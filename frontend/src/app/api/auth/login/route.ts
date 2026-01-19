import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            return NextResponse.json(
                { message: 'Server configuration error. Credentials not set.' },
                { status: 500 }
            );
        }

        // Validate credentials
        if (email === adminEmail && password === adminPassword) {
            // successful login
            const cookieStore = await cookies();

            // Set HTTP-only cookie for 30 days
            cookieStore.set('auth_token', 'secure-admin-session', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
            });

            return NextResponse.json({ success: true, message: 'Logged in successfully' });
        } else {
            return NextResponse.json(
                { message: 'Invalid Admin ID or Password' },
                { status: 401 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { message: 'An error occurred during login' },
            { status: 500 }
        );
    }
}
