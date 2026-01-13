import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Only protect /admin routes
    if (!request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    const authHeader = request.headers.get('authorization');

    if (authHeader) {
        const authValue = authHeader.split(' ')[1];
        const [user, pwd] = atob(authValue).split(':');

        // Simple Env-based check
        // In production, use robust auth provider if scaling, but for this "single user" dashboard, this is sufficient.
        const validUser = process.env.ADMIN_USER || 'admin';
        const validPwd = process.env.ADMIN_PASSWORD || 'password';

        if (user === validUser && pwd === validPwd) {
            return NextResponse.next();
        }
    }

    // Request Auth
    return new NextResponse('Auth Required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    });
}

export const config = {
    matcher: '/admin/:path*',
};
