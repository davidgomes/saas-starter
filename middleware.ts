import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

// Constants
const PROTECTED_ROUTES = ['/dashboard'] as const;
const SESSION_COOKIE_NAME = 'session';
const SIGN_IN_PATH = '/sign-in';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day

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
 * Sets a new session cookie on the response
 */
async function setSessionCookie(
  response: NextResponse,
  sessionData: Awaited<ReturnType<typeof verifyToken>>,
  expiresAt: Date
): Promise<void> {
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
}

/**
 * Clears the session cookie from the response
 */
function clearSessionCookie(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE_NAME);
}

/**
 * Refreshes the session cookie by verifying and re-signing the token
 * @returns true if session refresh was successful, false otherwise
 */
async function refreshSession(
  sessionCookieValue: string,
  response: NextResponse
): Promise<boolean> {
  try {
    const sessionData = await verifyToken(sessionCookieValue);
    const expiresAt = getSessionExpirationDate();

    await setSessionCookie(response, sessionData, expiresAt);
    return true;
  } catch (error) {
    console.error('Error refreshing session:', error);
    clearSessionCookie(response);
    return false;
  }
}

/**
 * Main middleware function that handles authentication and session management
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const requiresAuth = isProtectedRoute(pathname);
  const hasSession = Boolean(sessionCookie);

  // Handle protected routes without session
  if (requiresAuth && !hasSession) {
    return createSignInRedirect(request);
  }

  const response = NextResponse.next();

  // Refresh session on GET requests if session exists
  if (hasSession && request.method === 'GET') {
    const refreshSuccessful = await refreshSession(
      sessionCookie!.value,
      response
    );

    // If refresh failed and we're on a protected route, redirect to sign-in
    if (!refreshSuccessful && requiresAuth) {
      return createSignInRedirect(request);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs',
};
