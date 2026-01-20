import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, socialHandle } = body;

        if (!name || !email) {
            return NextResponse.json({ success: false, error: 'Name and Email are required' }, { status: 400 });
        }

        // Insert into demo_raffle_entries
        const { error } = await supabase
            .from('demo_raffle_entries')
            .insert({
                name,
                email,
                social_handle: socialHandle
            });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Demo Registration Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
