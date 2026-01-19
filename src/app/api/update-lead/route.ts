import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { syncToNotion, syncUpdateToNotion } from '@/lib/notion';

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { pageId } = body; // This is actually the Lead ID (UUID)

        if (!pageId) return NextResponse.json({ error: 'Missing leadId' }, { status: 400 });

        // 1. Prepare Supabase Update Object
        const updates: any = {};

        // Map frontend fields to Supabase columns
        if (body.company !== undefined) updates.company = body.company;
        if (body.title !== undefined) updates.title = body.title;
        if (body.phone !== undefined) updates.phone = body.phone;
        if (body.instagram !== undefined) updates.instagram = body.instagram;
        if (body.linkedin !== undefined) updates.linkedin = body.linkedin;

        // Mission / Gamification
        if (body.missionData !== undefined) updates.mission_data = body.missionData;
        if (body.missionProgress !== undefined) {
            updates.mission_progress = body.missionProgress; // Integer
            if (Number(body.missionProgress) === 100) {
                updates.mission_completed_at = new Date().toISOString();
            }
        }

        // Direct Column Updates for Onboarding / Profile Data
        if (body.industry !== undefined) updates.industry = body.industry;
        if (body.employeeCount !== undefined) updates.employee_count = body.employeeCount;
        if (body.role !== undefined) updates.role = body.role;
        if (body.decisionMaker !== undefined) updates.decision_maker = body.decisionMaker;
        if (body.isFirstTime !== undefined) updates.is_first_time = body.isFirstTime;
        if (body.goalForTonight !== undefined) updates.goal_for_tonight = body.goalForTonight;
        if (body.vision !== undefined) updates.vision = body.vision;
        if (body.website !== undefined) updates.website = body.website;

        // Keep JSONB for backup/rich data, but we now have dedicated columns!
        const onboardingFields = ['industry', 'employeeCount', 'role', 'decisionMaker', 'isFirstTime', 'goalForTonight', 'vision', 'website'];
        const onboardingData: any = {};

        onboardingFields.forEach(field => {
            if (body[field] !== undefined) {
                onboardingData[field] = body[field];
            }
        });

        if (Object.keys(onboardingData).length > 0) {
            updates.onboarding_data = onboardingData;
        }

        // Raffle / Survey Data (Store in strict columns if they exist, or user_metadata/JSONB if not)
        // For now, we assume simple columns or we skip if not in schema. 
        // Based on schema, we have: target_audience, pain_point, etc? 
        // Let's check schema. If columns missing, we might need to add them or store in a JSONB 'surveys' column.
        // For efficiency, let's just update the core profile fields and mission data for now, 
        // as the user specifically asked for "mission points tracked".

        // Initialize Admin Client to bypass RLS
        const adminAuthClient = process.env.SUPABASE_SERVICE_ROLE_KEY
            ? require('@supabase/supabase-js').createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            )
            : supabase;

        // 2. Update Supabase
        const { error } = await adminAuthClient
            .from('leads')
            .update(updates)
            .eq('id', pageId);

        if (error) {
            console.error("Supabase Update Error:", error);
            throw new Error(`Supabase Update Failed: ${error.message}`);
        }

        // 3. Sync to Notion (Background)
        // We need the email to find the Notion page. Fetch it from Supabase.
        const { data: leadData } = await adminAuthClient
            .from('leads')
            .select('email')
            .eq('id', pageId)
            .single();

        if (leadData?.email) {
            // Pass the original body which contains 'missionData' and 'missionProgress'
            // The utility function will handle mapping these to Notion properties
            await syncUpdateToNotion(leadData.email, body);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Update Lead Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
