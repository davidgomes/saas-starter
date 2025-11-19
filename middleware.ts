import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

// Constants
const PROTECTED_ROUTES = ['/dashboard'] as const;
const SESSION_COOKIE_NAME = 'session';
const SIGN_IN_PATH = '/sign-in';
const SESSION_DURATION_DAYS = 1;
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
  const signInUrl = new URL(SIGN_IN_PATH, request.url);
  return NextResponse.redirect(signInUrl);
}

/**
 * Calculates the expiration date for a session
 */
function getSessionExpirationDate(): Date {
  const expirationTime = Date.now() + SESSION_DURATION_DAYS * MILLISECONDS_PER_DAY;
  return new Date(expirationTime);
}

/**
 * Sets a new session cookie on the response
 */
function setSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: Date
): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    ...SESSION_COOKIE_OPTIONS,
    expires: expiresAt,
  });
}

/**
 * Removes the session cookie from the response
 */
function clearSessionCookie(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE_NAME);
}

/**
 * Refreshes the session cookie by verifying and re-signing the token
 * @returns true if session was successfully refreshed, false otherwise
 */
async function refreshSession(
  sessionToken: string,
  response: NextResponse
): Promise<boolean> {
  try {
    const parsed = await verifyToken(sessionToken);
    const expiresAt = getSessionExpirationDate();

    const newToken = await signToken({
      ...parsed,
      expires: expiresAt.toISOString(),
    });

    setSessionCookie(response, newToken, expiresAt);
    return true;
  } catch (error) {
    console.error('Error refreshing session:', error);
    clearSessionCookie(response);
    return false;
  }
}

/**
 * Handles authentication check for protected routes
 */
function handleAuthenticationCheck(
  request: NextRequest,
  requiresAuth: boolean,
  hasSession: boolean
): NextResponse | null {
  if (requiresAuth && !hasSession) {
    return createSignInRedirect(request);
  }
  return null;
}

/**
 * Handles session refresh for GET requests
 */
async function handleSessionRefresh(
  request: NextRequest,
  sessionCookie: { value: string },
  response: NextResponse,
  requiresAuth: boolean
): Promise<NextResponse | null> {
  if (request.method !== 'GET') {
    return null;
  }

  const wasRefreshed = await refreshSession(sessionCookie.value, response);

  if (!wasRefreshed && requiresAuth) {
    return createSignInRedirect(request);
  }

  return null;
}

/**
 * Main middleware function that handles authentication and session management
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const requiresAuth = isProtectedRoute(pathname);

  // Check authentication for protected routes
  const authRedirect = handleAuthenticationCheck(
    request,
    requiresAuth,
    !!sessionCookie
  );
  if (authRedirect) {
    return authRedirect;
  }

  const response = NextResponse.next();

  // Refresh session on GET requests if session exists
  if (sessionCookie) {
    const refreshRedirect = await handleSessionRefresh(
      request,
      sessionCookie,
      response,
      requiresAuth
    );
    if (refreshRedirect) {
      return refreshRedirect;
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs',
};
