import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Initialize Supabase Admin Client (Service Role)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Fetch all entries with > 0 tickets
        const { data, error } = await supabase
            .from('demo_raffle_entries')
            .select('id, name, entries_count')
            .gt('entries_count', 0);

        if (error) {
            console.error("Wheel Entrants Fetch Error", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ entries: data });

    } catch (e: any) {
        console.error("Wheel API Error", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
