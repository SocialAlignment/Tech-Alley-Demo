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

        // 1. Check if Lead already exists
        const { data: existingLead, error: fetchError } = await supabase
            .from('demo_leads')
            .select('id, name, email')
            .eq('email', email)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows found"
            console.error("Error checking existing lead:", fetchError);
            throw fetchError;
        }

        let resultData;

        if (existingLead) {
            // 2a. Update existing Lead (update last_active)
            const { data, error } = await supabase
                .from('demo_leads')
                .update({
                    name: name || email.split('@')[0],
                    last_active: new Date().toISOString()
                })
                .eq('id', existingLead.id)
                .select()
                .single();

            if (error) throw error;
            resultData = data;
        } else {
            // 2b. Insert new Lead
            const { data, error } = await supabase
                .from('demo_leads')
                .insert({
                    email,
                    name: name || email.split('@')[0],
                    status: 'new'
                })
                .select()
                .single();

            if (error) throw error;
            resultData = data;
        }

        // 3. Ensure Initial Raffle Entry (1 Entry for Registration)
        const { error: raffleError } = await supabase
            .from('demo_raffle_entries')
            .upsert({
                email: email,
                name: name || email.split('@')[0],
                entries_count: 1 // Base entry
            }, { onConflict: 'email', ignoreDuplicates: true }); // Only insert if not exists to avoid resetting count

        if (raffleError) {
            console.error("Raffle Init Error:", raffleError);
            // Don't fail the whole request, just log it
        }

        return NextResponse.json({ success: true, id: resultData.id, entry: resultData });
    } catch (e: any) {
        console.error("Demo Sync Error:", e);
        return NextResponse.json({ error: e.message || 'Server Error' }, { status: 500 });
    }
}
