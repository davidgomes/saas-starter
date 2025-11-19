import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

// Constants
const PROTECTED_ROUTES = '/dashboard';
const SIGN_IN_ROUTE = '/sign-in';
const SESSION_COOKIE_NAME = 'session';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
};

/**
 * Checks if a route requires authentication
 */
function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith(PROTECTED_ROUTES);
}

/**
 * Creates a redirect response to the sign-in page
 */
function redirectToSignIn(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL(SIGN_IN_ROUTE, request.url));
}

/**
 * Creates a new expiration date one day from now
 */
function getExpirationDate(): Date {
  return new Date(Date.now() + ONE_DAY_MS);
}

/**
 * Refreshes the session token for valid sessions
 * @returns The response with refreshed session, or null if refresh failed
 */
async function refreshSession(
  sessionCookie: string,
  response: NextResponse
): Promise<NextResponse | null> {
  try {
    const parsed = await verifyToken(sessionCookie);
    const expiresInOneDay = getExpirationDate();

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: await signToken({
        ...parsed,
        expires: expiresInOneDay.toISOString(),
      }),
      ...COOKIE_OPTIONS,
      expires: expiresInOneDay,
    });

    return response;
  } catch (error) {
    console.error('Error refreshing session:', error);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return null;
  }
}

/**
 * Handles authentication and session management for protected routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const isProtected = isProtectedRoute(pathname);

  // Redirect to sign-in if accessing protected route without session
  if (isProtected && !sessionCookie) {
    return redirectToSignIn(request);
  }

  const response = NextResponse.next();

  // Refresh session token on GET requests with valid session
  if (sessionCookie && request.method === 'GET') {
    const refreshedResponse = await refreshSession(sessionCookie.value, response);

    // If session refresh failed and we're on a protected route, redirect
    if (!refreshedResponse && isProtected) {
      return redirectToSignIn(request);
    }

    return refreshedResponse ?? response;
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs',
};
