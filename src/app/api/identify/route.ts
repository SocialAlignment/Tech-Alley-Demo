import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const { leadId } = await request.json();

        if (!leadId) {
            console.log("Identify API: Missing Lead ID");
            return NextResponse.json({ error: 'Missing Lead ID' }, { status: 400 });
        }

        // Initialize Admin Client to ensure we can find the user regardless of RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        console.log("Identify API (Demo): Fetching for ID:", leadId);

        // 1. Try Fetching by ID OR demo_google_id (Auth ID)
        let { data: entry, error } = await supabase
            .from('demo_raffle_entries')
            .select('*')
            .or(`id.eq.${leadId},demo_google_id.eq.${leadId}`)
            .single();

        // 2. Fallback: If not found, it might be a 'demo_leads' ID (from registration sync)
        if (!entry) {
            const { data: lead } = await supabase
                .from('demo_leads')
                .select('email, name')
                .eq('id', leadId)
                .single();

            if (lead && lead.email) {
                // Found a lead, now find the entry by email
                const { data: linkedEntry } = await supabase
                    .from('demo_raffle_entries')
                    .select('*')
                    .eq('email', lead.email)
                    .single();

                if (linkedEntry) {
                    entry = linkedEntry;
                } else {
                    // Lead exists but no raffle entry yet? Use lead data as base
                    entry = {
                        name: lead.name,
                        email: lead.email,
                        profile_data: {}
                    };
                }
            }
        }

        if (!entry) {
            console.error("Supabase Identity Error (Demo): Entry not found for ID", leadId);
            return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
        }

        // 2. Map 'profile_data' JSONB + Top Level Columns to IdentityContext shape
        const profile = entry.profile_data || {};

        // Helper to get field from top-level OR jsonb
        const getField = (key: string, topLevelKey?: string) => {
            // @ts-ignore
            return entry[topLevelKey || key] || profile[key] || '';
        };

        const isProfileComplete = !!(entry.name && entry.email); // Simplified completion check for demo

        return NextResponse.json({
            success: true,
            data: {
                name: entry.name || profile.name,
                company: profile.company || '',
                email: entry.email || profile.email,
                avatar: profile.avatar || '', // Demo might not have avatars
                isProfileComplete: isProfileComplete,
                missionProgress: 0, // Not used in demo
                missionData: [],
                coreAlignmentStatement: profile.coreAlignmentStatement || '',
                contactDetails: {
                    // Basic Contact
                    name: entry.name || profile.name || '',
                    email: entry.email || profile.email || '',
                    phone: profile.phone || '',
                    instagram: entry.social_handle || profile.instagram || '',
                    linkedin: profile.linkedin || '',
                    facebook: profile.facebook || '',
                    youtube: profile.youtube || '',
                    schedulingLink: profile.schedulingLink || '',

                    // Profile / MRI
                    hometown: profile.hometown || '',
                    timezone: profile.timezone || '',
                    bestTime: profile.bestTime || '',
                    askMeAbout: profile.askMeAbout || '',
                    helpMeBy: profile.helpMeBy || '',
                    helpYouBy: profile.helpYouBy || '',

                    // Preferences
                    commPrefs: profile.commPrefs || [],
                    learningPreference: profile.learningPreference || [],

                    // Onboarding / Business Data
                    industry: profile.industry || '',
                    company: profile.company || '',
                    role: profile.role || '',
                    website: profile.website || '',
                    businessType: profile.businessType || '',
                    employeeCount: profile.employeeCount || '',
                    decisionMaker: profile.decisionMaker || '',
                    isFirstTime: entry.is_first_time,
                    goalForTonight: profile.goalForTonight || '',
                    vision: profile.vision || '',

                    // AI / GenAI Data
                    aiMriResponse: profile.aiMriResponse || {}
                },
                raffleData: {
                    // Start with explicit columns if they exist, fallback to profile_data
                    genAiExp: entry.gen_ai_exp || profile.genAiExp || '',
                    aiExpectations: entry.ai_expectations || profile.aiExpectations || '',
                    aiHesitation: entry.ai_hesitation || profile.aiHesitation || '',
                    interestedServices: entry.interested_services || profile.interestedServices || []
                }
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
