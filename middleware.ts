import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

// Constants
const PROTECTED_ROUTES = ['/dashboard'];
const SIGN_IN_ROUTE = '/sign-in';
const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day

// Helper functions
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

function redirectToSignIn(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL(SIGN_IN_ROUTE, request.url));
}

function getSessionExpirationDate(): Date {
  return new Date(Date.now() + SESSION_DURATION_MS);
}

async function refreshSession(
  sessionToken: string,
  response: NextResponse
): Promise<void> {
  const parsed = await verifyToken(sessionToken);
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
}

async function handleSessionRefresh(
  request: NextRequest,
  response: NextResponse,
  sessionCookie: string
): Promise<NextResponse | null> {
  try {
    await refreshSession(sessionCookie, response);
    return null; // Continue with the response
  } catch (error) {
    console.error('Error refreshing session:', error);
    response.cookies.delete(SESSION_COOKIE_NAME);
    
    if (isProtectedRoute(request.nextUrl.pathname)) {
      return redirectToSignIn(request);
    }
    
    return null; // Continue even if refresh failed on non-protected routes
  }
}

// Main middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isProtected = isProtectedRoute(pathname);

  // Redirect to sign-in if accessing protected route without session
  if (isProtected && !sessionCookie) {
    return redirectToSignIn(request);
  }

  const response = NextResponse.next();

  // Refresh session on GET requests if session exists
  if (sessionCookie && request.method === 'GET') {
    const redirectResponse = await handleSessionRefresh(
      request,
      response,
      sessionCookie
    );
    if (redirectResponse) {
      return redirectResponse;
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs',
};
