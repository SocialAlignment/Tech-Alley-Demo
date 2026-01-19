import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log("API: /api/events hit (Supabase)");

    try {
        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .in('status', ['approved', 'published', 'done'])
            .gte('date', new Date().toISOString().split('T')[0])
            .order('date', { ascending: true });

        if (error) {
            console.error("Supabase Fetch Error:", error);
            throw error;
        }

        console.log(`API: Found ${events?.length || 0} events via Supabase.`);

        const mappedEvents = (events || []).map((e: any) => {
            // Format Time (HH:MM -> 6:00 PM)
            let timeStr = e.time;
            try {
                const [hours, minutes] = e.time.split(':');
                const date = new Date();
                date.setHours(parseInt(hours), parseInt(minutes));
                timeStr = date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
            } catch (err) {
                // Keep original if parse fails
            }

            // Heading from tags
            const heading = (e.tags && e.tags.length > 0) ? e.tags[0] : 'Community Event';

            // Location / Presenter
            const location = e.submitted_by_name
                ? `Presented By: ${e.submitted_by_name}`
                : 'Tech Alley Henderson';

            // Date formatting (ensure ISO string)
            // Supabase returns YYYY-MM-DD. We can append time if needed or just use date.
            // Existing card might expect full ISO. Let's create one.
            const fullDate = `${e.date}T${e.time}:00`;

            return {
                id: e.id,
                heading: heading,
                eventName: e.name,
                description: e.description || '',
                date: fullDate,
                time: timeStr,
                location: location,
                imageUrl: '', // No image support in form yet
                imageAlt: e.name,
                actionLabel: "Add to Calendar",
                link: e.link // Optional extra field if needed
            };
        });

        return NextResponse.json({ success: true, events: mappedEvents });
    } catch (error: any) {
        console.error('[EVENTS_API] Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch events',
                details: error.message
            },
            { status: 500 }
        );
    }
}
