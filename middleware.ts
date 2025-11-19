import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

// Constants
const PROTECTED_ROUTES = ['/dashboard'];
const SESSION_COOKIE_NAME = 'session';
const SIGN_IN_PATH = '/sign-in';
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

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
  return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
}

/**
 * Calculates the expiration date for a session (1 day from now)
 */
function getSessionExpirationDate(): Date {
  return new Date(Date.now() + MILLISECONDS_PER_DAY);
}

/**
 * Refreshes the session cookie by verifying and re-signing the token
 */
async function refreshSession(
  sessionCookieValue: string,
  response: NextResponse
): Promise<{ success: boolean; shouldRedirect: boolean }> {
  try {
    const parsed = await verifyToken(sessionCookieValue);
    const expiresAt = getSessionExpirationDate();

    const newToken = await signToken({
      ...parsed,
      expires: expiresAt.toISOString(),
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: newToken,
      ...SESSION_COOKIE_OPTIONS,
      expires: expiresAt,
    });

    return { success: true, shouldRedirect: false };
  } catch (error) {
    console.error('Error refreshing session:', error);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return { success: false, shouldRedirect: true };
  }
}

/**
 * Main middleware function that handles authentication and session management
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const requiresAuth = isProtectedRoute(pathname);

  // Redirect to sign-in if accessing protected route without session
  if (requiresAuth && !sessionCookie) {
    return createSignInRedirect(request);
  }

  const response = NextResponse.next();

  // Refresh session on GET requests if session exists
  if (sessionCookie && request.method === 'GET') {
    const { shouldRedirect } = await refreshSession(
      sessionCookie.value,
      response
    );

    if (shouldRedirect && requiresAuth) {
      return createSignInRedirect(request);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs',
};
