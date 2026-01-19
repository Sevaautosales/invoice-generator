import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define paths that are always public (no auth required)
    const publicPaths = [
        '/login',
        '/api/auth/login',
        '/logo.png',
        '/favicon.ico',
        '/manifest.webmanifest',
        '/icon512_maskable.png',
        '/icon512_rounded.png'
    ];

    // Check if the current path is public
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    // Check for auth token
    const token = request.cookies.get('auth_token')?.value;

    // If authenticated and trying to access login, redirect to dashboard
    if (token && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Also allow Next.js internal paths and static files
    if (isPublicPath || pathname.startsWith('/_next') || pathname.startsWith('/static')) {
        return NextResponse.next();
    }

    if (!token) {
        // If no token and trying to access a protected route, redirect to login
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
