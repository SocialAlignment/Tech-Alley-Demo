
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

    return NextResponse.json({
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        GOOGLE_CLIENT_ID: {
            exists: !!clientId,
            length: clientId.length,
            first3: clientId.slice(0, 3),
            last3: clientId.slice(-3),
            hasWhitespace: /\s/.test(clientId),
            value_safe: clientId.replace(/./g, '*') // totally masked
        },
        GOOGLE_CLIENT_SECRET: {
            exists: !!clientSecret,
            length: clientSecret.length,
            first3: clientSecret.slice(0, 3),
            last3: clientSecret.slice(-3),
            hasWhitespace: /\s/.test(clientSecret)
        },
        NEXTAUTH_SECRET: {
            exists: !!process.env.NEXTAUTH_SECRET,
            length: process.env.NEXTAUTH_SECRET?.length || 0
        },
        NODE_ENV: process.env.NODE_ENV
    });
}
