import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

// ============================================================================
// Constants
// ============================================================================

const PROTECTED_ROUTES = ['/dashboard'] as const;
const SESSION_COOKIE_NAME = 'session';
const SIGN_IN_PATH = '/sign-in';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
} as const;

// ============================================================================
// Types
// ============================================================================

type RefreshSessionResult = {
  success: boolean;
  shouldRedirect: boolean;
};

// ============================================================================
// Route Protection Utilities
// ============================================================================

/**
 * Determines if a given pathname requires authentication.
 *
 * @param pathname - The pathname to check
 * @returns True if the pathname requires authentication
 */
function requiresAuthentication(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Creates a redirect response to the sign-in page.
 *
 * @param request - The incoming request
 * @returns A redirect response to the sign-in page
 */
function redirectToSignIn(request: NextRequest): NextResponse {
  const signInUrl = new URL(SIGN_IN_PATH, request.url);
  return NextResponse.redirect(signInUrl);
}

// ============================================================================
// Session Management
// ============================================================================

/**
 * Calculates the expiration date for a session token.
 *
 * @returns A Date object representing the expiration time (1 day from now)
 */
function calculateSessionExpiration(): Date {
  return new Date(Date.now() + SESSION_DURATION_MS);
}

/**
 * Refreshes the session cookie by verifying the existing token and issuing a new one.
 * If verification fails, the session cookie is deleted.
 *
 * @param sessionToken - The current session token value
 * @param response - The response object to set the new cookie on
 * @returns An object indicating success and whether a redirect is needed
 */
async function refreshSessionToken(
  sessionToken: string,
  response: NextResponse
): Promise<RefreshSessionResult> {
  try {
    const sessionData = await verifyToken(sessionToken);
    const expiresAt = calculateSessionExpiration();

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

    return { success: true, shouldRedirect: false };
  } catch (error) {
    console.error('Failed to refresh session:', error);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return { success: false, shouldRedirect: true };
  }
}

/**
 * Handles session refresh for GET requests.
 * Only refreshes if a session cookie exists.
 *
 * @param request - The incoming request
 * @param response - The response object
 * @returns True if the request should be redirected
 */
async function handleSessionRefresh(
  request: NextRequest,
  response: NextResponse
): Promise<boolean> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || request.method !== 'GET') {
    return false;
  }

  const { shouldRedirect } = await refreshSessionToken(
    sessionCookie.value,
    response
  );

  return shouldRedirect;
}

// ============================================================================
// Main Middleware
// ============================================================================

/**
 * Middleware function that handles authentication and session management.
 *
 * - Protects routes that require authentication
 * - Redirects unauthenticated users to sign-in
 * - Refreshes session tokens on GET requests
 *
 * @param request - The incoming request
 * @returns A response (potentially redirected) or the next response
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const isProtected = requiresAuthentication(pathname);

  // Redirect unauthenticated users trying to access protected routes
  if (isProtected && !sessionCookie) {
    return redirectToSignIn(request);
  }

  const response = NextResponse.next();

  // Refresh session on GET requests
  const shouldRedirect = await handleSessionRefresh(request, response);

  if (shouldRedirect && isProtected) {
    return redirectToSignIn(request);
  }

  return response;
}

// ============================================================================
// Middleware Configuration
// ============================================================================

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs',
};
