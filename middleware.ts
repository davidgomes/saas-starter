import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

// Constants
const PROTECTED_ROUTES = ['/dashboard'];
const SESSION_COOKIE_NAME = 'session';
const SIGN_IN_PATH = '/sign-in';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Cookie configuration
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
};

/**
 * Checks if the given pathname is a protected route
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Creates a redirect response to the sign-in page
 */
function redirectToSignIn(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
}

/**
 * Calculates the expiration date for a session cookie (1 day from now)
 */
function getSessionExpiration(): Date {
  return new Date(Date.now() + ONE_DAY_MS);
}

/**
 * Refreshes the session cookie with a new expiration date
 */
async function refreshSession(
  response: NextResponse,
  sessionData: Awaited<ReturnType<typeof verifyToken>>
): Promise<void> {
  const expiresAt = getSessionExpiration();

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
 * Handles session refresh for authenticated users on GET requests
 */
async function handleSessionRefresh(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse | null> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  if (!sessionCookie || request.method !== 'GET') {
    return null;
  }

  try {
    const sessionData = await verifyToken(sessionCookie.value);
    await refreshSession(response, sessionData);
    return null; // Continue with the response
  } catch (error) {
    console.error('Error refreshing session:', error);
    response.cookies.delete(SESSION_COOKIE_NAME);

    // Redirect to sign-in if on a protected route
    if (isProtectedRoute(request.nextUrl.pathname)) {
      return redirectToSignIn(request);
    }

    return null; // Continue with the response (invalid session but not on protected route)
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route requires authentication
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  if (isProtectedRoute(pathname) && !sessionCookie) {
    return redirectToSignIn(request);
  }

  const response = NextResponse.next();

  // Refresh session for authenticated users
  const redirectResponse = await handleSessionRefresh(request, response);
  if (redirectResponse) {
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs',
};
