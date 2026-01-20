
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    try {
        // Service Role to bypass RLS and Foreign Key restrictions where possible (though order still matters)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        console.log("[Factory Reset] Starting cascade delete...");

        // 1. Delete Comms Logs (Child of Raffle Entries)
        const { error: logsError } = await supabase
            .from('comms_log')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (hacky neq uuid trick or just use gt id)
        // .neq is safer than empty filter which some clients block. 
        // Better: .gte('created_at', '1970-01-01')

        if (logsError) throw new Error(`Failed to clear comms_log: ${logsError.message}`);

        // 2. Delete Raffle Entries (Child of Leads)
        const { error: entriesError } = await supabase
            .from('demo_raffle_entries')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

        if (entriesError) throw new Error(`Failed to clear raffle_entries: ${entriesError.message}`);

        // 3. Delete Leads (Parent)
        const { error: leadsError } = await supabase
            .from('demo_leads')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

        if (leadsError) throw new Error(`Failed to clear demo_leads: ${leadsError.message}`);

        console.log("[Factory Reset] Database wiped successfully.");
        return NextResponse.json({ success: true, message: "Database Reset Complete" });

    } catch (error: any) {
        console.error("Factory Reset Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
