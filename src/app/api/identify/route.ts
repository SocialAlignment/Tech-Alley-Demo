import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { leadId } = await request.json();

        if (!leadId) {
            console.log("Identify API: Missing Lead ID");
            return NextResponse.json({ error: 'Missing Lead ID' }, { status: 400 });
        }

        console.log("Identify API: Fetching for Lead ID:", leadId);

        // 1. Supabase Fetch
        const { data: lead, error } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .single();

        if (error || !lead) {
            console.error("Supabase Identity Error:", error);
            return NextResponse.json({ error: 'Lead not found in Supabase' }, { status: 404 });
        }

        // 2. Fetch Raffle Entry (if exists)
        const { data: raffleEntry } = await supabase
            .from('raffle_entries')
            .select('*')
            .eq('lead_id', leadId)
            .maybeSingle();

        return NextResponse.json({
            success: true,
            data: {
                name: lead.name,
                company: lead.company,
                email: lead.email,
                avatar: lead.avatar || '',
                isProfileComplete: !!(lead.company && lead.title && lead.phone && lead.instagram),
                missionProgress: lead.mission_progress || 0,
                missionData: lead.mission_data || [],
                contactDetails: {
                    // Basic Contact
                    name: lead.name || '',
                    email: lead.email || '',
                    phone: lead.phone || '',
                    instagram: lead.instagram || '',
                    linkedin: lead.linkedin || '',
                    facebook: lead.facebook || '',
                    youtube: lead.youtube || '',
                    schedulingLink: lead.scheduling_link || '',

                    // Profile / MRI
                    hometown: lead.hometown || '',
                    timezone: lead.timezone || '',
                    bestTime: lead.best_time || '',
                    askMeAbout: lead.ask_me_about || '',
                    helpMeBy: lead.help_me_by || '',
                    helpYouBy: lead.help_you_by || '',

                    // Preferences
                    commPrefs: lead.communication_preference ? [lead.communication_preference] : [],
                    learningPreference: lead.learning_preference || [],

                    // Onboarding / Business Data
                    industry: lead.industry || '',
                    company: lead.company || '',
                    role: lead.role || '',
                    website: lead.website || '',
                    businessType: lead.business_type || '',
                    employeeCount: lead.employee_count || '',
                    decisionMaker: lead.decision_maker || '',
                    isFirstTime: lead.is_first_time,
                    goalForTonight: lead.goal_for_tonight || '',
                    vision: lead.vision || '',

                    // AI / GenAI Data (Placeholder for now)
                    aiMriResponse: lead.ai_mri_response || {}
                },
                raffleData: raffleEntry ? {
                    genAiExp: raffleEntry.gen_ai_exp || '',
                    aiExpectations: raffleEntry.ai_expectations || '',
                    aiHesitation: raffleEntry.ai_hesitation || '',
                    interestedServices: raffleEntry.interested_services || []
                } : null
            }
        });

    } catch (error) {
        console.error('Identity Fetch Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed' },
            { status: 500 }
        );
    }
}
