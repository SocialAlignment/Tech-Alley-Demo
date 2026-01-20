import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

// Use Service Role to bypass RLS for server-side operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { name, email } = session.user;

        // Upsert based on email to ensure we capture the user
        const { data, error } = await supabase
            .from('demo_leads')
            .upsert({
                email,
                name: name || email.split('@')[0],
                // We keep existing data if present, just ensuring the record exists
            }, { onConflict: 'email' })
            .select('id, name, email')
            .single();

        if (error) {
            console.error("Demo Sync Supabase Error:", error);
            throw error;
        }

        return NextResponse.json({ success: true, id: data.id, entry: data });
    } catch (e: any) {
        console.error("Demo Sync Error:", e);
        return NextResponse.json({ error: e.message || 'Server Error' }, { status: 500 });
    }
}
