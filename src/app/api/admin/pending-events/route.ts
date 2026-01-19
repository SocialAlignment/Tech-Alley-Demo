import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("Admin API: Fetching Pending Events (Supabase)");

        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Error:", error);
            throw error;
        }

        // Map simplified structure for Admin Dashboard
        const mappedEvents = (events || []).map((event: any) => ({
            id: event.id,
            name: event.name,
            date: event.date,
            description: event.description || '',
            link: event.link || '',
            status: event.status,
            tags: event.tags || []
        }));

        return NextResponse.json({ success: true, events: mappedEvents });
    } catch (error: any) {
        console.error('[ADMIN_PENDING_EVENTS] Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
