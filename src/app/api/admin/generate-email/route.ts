import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GenAIService } from '@/lib/gen-ai-service';

// Use Service Role to bypass RLS for admin operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { leadId, topic } = await req.json();

        if (!leadId) {
            return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 });
        }

        // 1. Fetch Lead Data
        const { data: lead, error } = await supabase
            .from('demo_leads')
            .select('*')
            .eq('id', leadId)
            .single();

        if (error || !lead) {
            console.error('[Generate Email] Lead not found:', error);
            return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
        }

        // 2. Parse Profile Data (for flexible fields)
        const profile = typeof lead.profile_data === 'string'
            ? JSON.parse(lead.profile_data)
            : lead.profile_data || {};

        // 3. Construct Lead Profile for AI (ENRICHED)
        const leadProfile = {
            name: lead.name,
            role: lead.title || profile.role || 'Professional',
            industry: lead.industry || profile.industry || 'Tech',
            businessType: profile.businessType,
            company: lead.company || profile.company,
            website: profile.website,

            // Core Alignment
            helpStatement: profile.coreAlignmentStatement || profile.helpStatement || `Helping ${profile.targetAudience} solve ${profile.problemSolved}`,
            targetAudience: profile.targetAudience,
            mainProblem: profile.problemSolved,
            solutionMechanism: profile.solutionMechanism,

            // Goals
            goals: lead.goal_for_tonight || profile.goalForNextMonth,
            vision: profile.vision,
            wishlist: profile.futureEventsWishlist,
            isFirstTime: profile.isFirstTime
        };

        // 4. Generate Email
        console.log(`[Generate Email] Generating for ${lead.name} with topic: ${topic || 'None'}...`);
        const draft = await GenAIService.generateIntroEmail(leadProfile, topic);

        return NextResponse.json({ success: true, draft });

    } catch (error: any) {
        console.error('[Generate Email] Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
