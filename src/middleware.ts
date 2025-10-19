import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
interface JWTPayload {
    userId: string;
    email: string;
    role: 'user' | 'admin' | 'superadmin';
    iat: number;
    exp: number;
}

const publicPaths = ['/'];

const authOnlyPaths = ['/login', '/signup'];

const protectedPaths = ['/dashboard'];

const adminPaths = ['/dashboard/admin'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const hasAuth = !!(accessToken || refreshToken);

    const otpVerificationToken = request.cookies.get('otpVerificationToken')?.value;

    let userRole: string | null = null;
    if (accessToken) {
        try {
            const decoded = jwtDecode<JWTPayload>(accessToken);
            userRole = decoded.role;
        } catch (error) {
            console.error('Failed to decode JWT:', error);
        }
    }

    if (pathname === '/') {
        if (hasAuth) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (authOnlyPaths.some((path) => pathname.startsWith(path))) {
        if (hasAuth) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    if (pathname.startsWith('/verify-otp')) {

        if (!otpVerificationToken) {
            return NextResponse.redirect(new URL('/signup', request.url));
        }

        if (hasAuth) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        return NextResponse.next();
    }

    if (adminPaths.some((path) => pathname.startsWith(path))) {
        if (!hasAuth) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (userRole !== 'admin' && userRole !== 'superadmin') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        return NextResponse.next();
    }

    if (protectedPaths.some((path) => pathname.startsWith(path))) {
        if (!hasAuth) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
