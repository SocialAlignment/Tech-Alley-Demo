import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use Service Role to bypass RLS for server-side operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, ...profileData } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        // Prepare update object
        const updatePayload: any = {
            profile_data: profileData, // Store the full wizard data payload as JSONB
        };

        // Extract and map top-level fields if they exist in the profile data
        if (profileData.name) updatePayload.name = profileData.name;
        if (profileData.email) updatePayload.email = profileData.email;
        if (profileData.socialHandle) updatePayload.social_handle = profileData.socialHandle;

        // Map is_first_time from wizard format ('yes'/'no') to boolean
        if (profileData.isFirstTime) {
            updatePayload.is_first_time = profileData.isFirstTime === 'yes';
        }

        // Update demo_leads
        // We update the main record with known columns and dump everything else into profile_data

        // Ensure profile_data merge (Supabase doesn't deep merge JSONB on update by default unless specific function used, 
        // but for this wizard, we likely want to overwrite/extend the existing profile_data.
        // We'll fetch first or just assume we are writing the wizard state.)

        // Actually, let's just write the payload to profile_data. 
        // The wizard sends the complete state.

        const { error } = await supabase
            .from('demo_leads')
            .update(updatePayload)
            .eq('id', id);

        if (error) {
            console.error('Supabase update error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Demo Update Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Unknown server error' }, { status: 500 });
    }
}
