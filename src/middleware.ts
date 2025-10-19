import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const publicPaths = ['/login', '/signup', '/verify-otp'];
const authPaths = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get tokens from cookies
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const hasAuth = !!(accessToken || refreshToken);

    // Redirect root to login
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Allow public paths
    if (publicPaths.includes(pathname)) {
        // If already authenticated and trying to access auth pages, redirect to dashboard
        if (hasAuth && authPaths.includes(pathname)) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
        if (!hasAuth) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Let the page component handle authorization and user fetching
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
