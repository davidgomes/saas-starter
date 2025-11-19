import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

// Constants
const PROTECTED_ROUTES = ['/dashboard'] as const;
const SESSION_COOKIE_NAME = 'session';
const SIGN_IN_PATH = '/sign-in';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

// Cookie configuration
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
} as const;

/**
 * Checks if a given pathname requires authentication
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Creates a redirect response to the sign-in page
 */
function createSignInRedirect(request: NextRequest): NextResponse {
  const signInUrl = new URL(SIGN_IN_PATH, request.url);
  return NextResponse.redirect(signInUrl);
}

/**
 * Calculates the expiration date for a session (1 day from now)
 */
function getSessionExpirationDate(): Date {
  return new Date(Date.now() + SESSION_DURATION_MS);
}

/**
 * Refreshes the session cookie by verifying and re-signing the token.
 * Returns true if the session was successfully refreshed, false if it should be invalidated.
 */
async function refreshSession(
  sessionToken: string,
  response: NextResponse
): Promise<boolean> {
  try {
    const sessionData = await verifyToken(sessionToken);
    const expiresAt = getSessionExpirationDate();

    const newToken = await signToken({
      ...sessionData,
      expires: expiresAt.toISOString(),
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: newToken,
      ...SESSION_COOKIE_OPTIONS,
      expires: expiresAt,
    });

    return true;
  } catch (error) {
    console.error('Error refreshing session:', error);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return false;
  }
}

/**
 * Main middleware function that handles authentication and session management
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const isProtected = isProtectedRoute(pathname);

  // Redirect to sign-in if accessing protected route without session
  if (isProtected && !sessionCookie) {
    return createSignInRedirect(request);
  }

  const response = NextResponse.next();

  // Refresh session on GET requests if session exists
  if (sessionCookie && request.method === 'GET') {
    const sessionRefreshed = await refreshSession(
      sessionCookie.value,
      response
    );

    // If session refresh failed and we're on a protected route, redirect to sign-in
    if (!sessionRefreshed && isProtected) {
      return createSignInRedirect(request);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs',
} as const;
