import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

// Constants
const PROTECTED_ROUTES = '/dashboard';
const SESSION_COOKIE_NAME = 'session';
const SIGN_IN_PATH = '/sign-in';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Checks if a given pathname requires authentication
 */
function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith(PROTECTED_ROUTES);
}

/**
 * Creates a redirect response to the sign-in page
 */
function redirectToSignIn(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
}

/**
 * Calculates the expiration date for a session (1 day from now)
 */
function getSessionExpirationDate(): Date {
  return new Date(Date.now() + ONE_DAY_MS);
}

/**
 * Refreshes the session cookie by verifying and re-signing the token
 */
async function refreshSession(
  sessionCookieValue: string,
  response: NextResponse
): Promise<NextResponse> {
  try {
    const parsed = await verifyToken(sessionCookieValue);
    const expiresAt = getSessionExpirationDate();

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: await signToken({
        ...parsed,
        expires: expiresAt.toISOString(),
      }),
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error('Error refreshing session:', error);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }
}

/**
 * Main middleware function that handles authentication and session management
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const requiresAuth = isProtectedRoute(pathname);

  // Redirect unauthenticated users from protected routes
  if (requiresAuth && !sessionCookie) {
    return redirectToSignIn(request);
  }

  const response = NextResponse.next();

  // Refresh session on GET requests if a valid session exists
  if (sessionCookie && request.method === 'GET') {
    const refreshedResponse = await refreshSession(
      sessionCookie.value,
      response
    );

    // If session refresh failed and user is on a protected route, redirect to sign-in
    if (
      requiresAuth &&
      !refreshedResponse.cookies.get(SESSION_COOKIE_NAME)
    ) {
      return redirectToSignIn(request);
    }

    return refreshedResponse;
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs',
};
