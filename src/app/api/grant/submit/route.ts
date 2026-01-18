import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { leadId, ...grantData } = body;

        if (!leadId) {
            return NextResponse.json({ error: 'Missing Lead ID' }, { status: 400 });
        }

        // Initialize Supabase Admin Client
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Map wizard fields to DB columns
        const dbPayload = {
            lead_id: leadId,
            website_url: grantData.websiteUrl,
            brand_status: grantData.brandStatus,
            brand_pain_points: grantData.firstAiContent, // "What would you interpret first?"
            dashboard_interest: grantData.dashboardInterest,
            dashboard_needs: grantData.topMetric, // "#1 Metric"
            grant_intention: grantData.grantIntention,
            status: 'pending'
        };

        const { error } = await supabase
            .from('grant_applications')
            .insert(dbPayload);

        if (error) {
            console.error('Grant Submission Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Grant API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
