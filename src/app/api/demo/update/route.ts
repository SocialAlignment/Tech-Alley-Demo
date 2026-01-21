import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { CommService } from '@/lib/comm-service';

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

        // Map other common fields to top-level columns if they exist
        if (profileData.company) updatePayload.company = profileData.company;
        if (profileData.phone) updatePayload.phone = profileData.phone;
        if (profileData.role) updatePayload.title = profileData.role; // Map role -> title
        if (profileData.industry) updatePayload.industry = profileData.industry;
        if (profileData.website) updatePayload.website = profileData.website;
        if (profileData.businessType) updatePayload.business_type = profileData.businessType;
        if (profileData.goalForNextMonth) updatePayload.goal_for_tonight = profileData.goalForNextMonth;
        if (profileData.vision) updatePayload.vision = profileData.vision;

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

        // Trigger Welcome SMS if phone and name are available
        // We check the payload or the profileData to ensure we have the info
        const phone = updatePayload.phone || profileData.phone;
        const name = updatePayload.name || profileData.name;

        console.log(`[Demo Update] Checking SMS Triggers. Phone: ${phone}, Name: ${name}`);

        if (phone && name) {
            // Fire and forget - don't block the response
            CommService.sendWelcomeSMS(phone, name).catch(err =>
                console.error("Failed to send welcome SMS:", err)
            );
        }

        // Trigger Mailchimp Subscription (Fire & Forget)
        if (profileData.email && profileData.name) {
            const tags = ['Demo Registrant'];
            if (profileData.industry) tags.push(profileData.industry);

            // Import dynamically to avoid top-level load issues if env vars missing
            import('@/lib/email-service').then(({ EmailService }) => {
                // Split name for First/Last
                const nameParts = profileData.name.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

                EmailService.addSubscriber(profileData.email, firstName, lastName, tags).catch(err =>
                    console.error("Failed to add to Mailchimp:", err)
                );
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Demo Update Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Unknown server error' }, { status: 500 });
    }
}
