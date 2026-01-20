
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { CommService } from '@/lib/comm-service'; // Fixed import path

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, recipient, topic } = body;

        if (!type) {
            return NextResponse.json({ error: "Type is required" }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // --- Raffle Winner ---
        if (type === 'raffle_winner') {
            if (!recipient?.id) return NextResponse.json({ error: "No recipient ID" }, { status: 400 });

            // Get phone number from lead record
            const { data: lead } = await supabase
                .from('demo_leads')
                .select('profile_data')
                .eq('id', recipient.id)
                .single();

            const phone = lead?.profile_data?.phone;

            if (!phone) {
                return NextResponse.json({ error: "Winner has no phone number on file" }, { status: 400 });
            }

            try {
                await CommService.sendRaffleWinnerSMS(phone, recipient.name);
                return NextResponse.json({ success: true, message: `Congratulated ${recipient.name}!` });
            } catch (err) {
                console.error("SMS Failed", err);
                return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
            }
        }

        // --- Post-Event Blast ---
        if (type === 'blast') {
            // 1. Fetch all attendees
            const { data: attendees } = await supabase
                .from('demo_leads')
                .select('profile_data')
                .not('profile_data', 'is', null);

            if (!attendees || attendees.length === 0) {
                return NextResponse.json({ message: "No attendees found to blast." });
            }

            let sentCount = 0;

            // 2. Loop and Send (Fire & Forget style for MVP, though Batching is better for prod)
            // In a real app, use a queue. For this demo (10-20 users), simple loop is fine.
            const promises = attendees.map(async (lead) => {
                const p = lead.profile_data;
                if (p?.phone && p?.firstName) {
                    try {
                        // Personalization: Use their "Goal" or "Industry" as the 'topic'
                        // Fallback to "your business goals"
                        const personalTopic = p.goal || p.industry || "your growth";

                        await CommService.sendPostEventFollowUpSMS(p.phone, p.firstName, personalTopic);
                        sentCount++;
                    } catch (e) {
                        console.error("Failed to blast", p.email, e);
                    }
                }
            });

            await Promise.all(promises);

            return NextResponse.json({ success: true, count: sentCount, message: `Blasted ${sentCount} attendees.` });
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    } catch (error) {
        console.error("Admin SMS API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
