import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

// Constants
const SESSION_COOKIE_NAME = 'session';
const PROTECTED_ROUTES_PREFIX = '/dashboard';
const SIGN_IN_PATH = '/sign-in';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Cookie configuration
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
} as const;

/**
 * Checks if the given pathname is a protected route
 */
function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith(PROTECTED_ROUTES_PREFIX);
}

/**
 * Creates a redirect response to the sign-in page
 */
function redirectToSignIn(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
}

/**
 * Refreshes the session cookie by verifying and re-signing the token
 */
async function refreshSession(
  sessionCookieValue: string,
  request: NextRequest
): Promise<NextResponse> {
  try {
    const parsed = await verifyToken(sessionCookieValue);
    const expiresInOneDay = new Date(Date.now() + ONE_DAY_MS);

    const response = NextResponse.next();
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: await signToken({
        ...parsed,
        expires: expiresInOneDay.toISOString(),
      }),
      ...SESSION_COOKIE_OPTIONS,
      expires: expiresInOneDay,
    });

    return response;
  } catch (error) {
    console.error('Error refreshing session:', error);
    
    const response = NextResponse.next();
    response.cookies.delete(SESSION_COOKIE_NAME);

    if (isProtectedRoute(request.nextUrl.pathname)) {
      return redirectToSignIn(request);
    }

    return response;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  // Redirect to sign-in if accessing protected route without session
  if (isProtectedRoute(pathname) && !sessionCookie) {
    return redirectToSignIn(request);
  }

  // Refresh session on GET requests if session exists
  if (sessionCookie && request.method === 'GET') {
    return refreshSession(sessionCookie.value, request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs',
};
