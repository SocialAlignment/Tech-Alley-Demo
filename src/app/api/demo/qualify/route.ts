import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { CommService } from '@/lib/comm-service';

// Init Supabase with Service Role to bypass RLS for updates if needed, though we use public policy
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- SOP Logic Helpers ---

// 1. Derived Tags
function deriveTags(data: any): string[] {
    const tags: string[] = [];
    const { aiStage, aiToolsUsed, monthlyLeads, targetAudience, desiredAction, aiChallenge, helpNeeded, aiInterest } = data;

    // AI Awareness
    if (aiToolsUsed.includes("None yet")) tags.push('AI_UNAWARE');
    else if (aiStage === "Curious, haven't tried" || aiStage === "Never tried it") tags.push('AI_CURIOUS');
    else if (aiStage === "Dabbled a bit") tags.push('AI_EXPERIMENTING');
    else if (aiStage.includes("weekly") || aiStage.includes("daily") || aiStage.includes("Expert")) tags.push('AI_PRODUCTION');

    // Video Readiness / Challenges
    if (aiChallenge === "Production costs are too high") tags.push('COST_BLOCKED');
    if (aiChallenge === "Takes too long to film/edit") tags.push('TIME_BLOCKED');
    if (aiChallenge === "Scheduling actors/talent" || aiChallenge === "Logistics & Locations") tags.push('LOGISTICS_BLOCKED');
    if (aiChallenge === "Inconsistent quality") tags.push('QUALITY_BLOCKED');
    if (aiChallenge === "Hard to update later") tags.push('FLEXIBILITY_BLOCKED');

    // Business Stage
    if (['0-5'].includes(monthlyLeads)) tags.push('PRE_LEADS');
    if (['6-20'].includes(monthlyLeads)) tags.push('EARLY_TRACTION');
    if (['21-50'].includes(monthlyLeads)) tags.push('GROWTH');
    if (['51-100'].includes(monthlyLeads)) tags.push('SCALE');
    if (['100+'].includes(monthlyLeads)) tags.push('VOLUME');

    // Audience Clarity
    if (targetAudience?.includes("not sure") || targetAudience?.includes("Not fully sure")) tags.push('AUDIENCE_FUZZY');
    else tags.push('AUDIENCE_CLEAR');

    if (desiredAction?.includes("Not sure") || desiredAction?.includes("Other")) tags.push('CTA_FUZZY');

    // Offer Alignment
    const helpStr = helpNeeded?.join(' ') || '';
    if (helpStr.includes("1:1") || helpStr.includes("Consulting")) tags.push('SORA_1ON1_FIT');
    if (helpStr.includes("Done-for-you")) tags.push('DFY_FIT');
    if (helpStr.includes("Avatar") || aiInterest?.includes("Be on camera less")) tags.push('AVATAR_FIT');
    if (helpStr.includes("System") || helpStr.includes("Automation")) tags.push('SYSTEMS_FIT');
    if (helpStr.includes("Workshops") || helpStr.includes("Training")) tags.push('TRAINING_FIT');
    if (helpStr.includes("grant funding")) tags.push('GRANT_SEEKER');

    return tags;
}

// 2. Scoring (0-100)
function calculateScore(data: any): number {
    let score = 10; // Base: 10

    // Business Leverage (Q9)
    const leads = data.monthlyLeads;
    if (leads === '0-5') score += 5;
    else if (leads === '6-20') score += 10;
    else if (leads === '21-50') score += 20;
    else if (leads === '51-100') score += 25;
    else if (leads === '100+') score += 30;

    // Clarity
    if (data.targetAudience && !data.targetAudience.includes("not sure")) score += 10;
    if (data.desiredAction && !data.desiredAction.includes("not sure")) score += 10;

    // AI Readiness
    const stage = data.aiStage;
    if (stage === "Curious, haven't tried") score += 5;
    else if (stage === "Dabbled a bit") score += 10;
    else if (stage.includes("weekly")) score += 15;
    else if (stage.includes("daily")) score += 20;
    else if (stage.includes("Expert")) score += 25;

    // Opt-in Intent
    if (data.wantResources === 'Yes') score += 15;
    const help = data.helpNeeded || [];
    if (help.includes("Done-for-you") || help.some((h: string) => h.includes("System"))) score += 10;
    if (help.some((h: string) => h.includes("1:1"))) score += 8;
    if (help.includes("AI Avatar Creation")) score += 8;
    if (help.includes("I'm interested in grant funding.")) score += 5;

    // Details provided
    if (data.website && data.website.length > 3) score += 5;
    if (data.coreAlignmentStatement && data.coreAlignmentStatement.length > 20) score += 5;

    return Math.min(100, score);
}

function getScoreBand(score: number): string {
    if (score < 30) return 'NURTURE';
    if (score < 60) return 'ENGAGE';
    if (score < 80) return 'QUALIFIED';
    return 'PRIORITY';
}

// 3. Newsletter Variant
function assignVariant(tags: string[], data: any): string {
    if (tags.includes('AVATAR_FIT')) return 'Variant 4: Avatar / Efficiency';
    if (tags.includes('AI_PRODUCTION')) return 'Variant 3: Production Builder';
    if (tags.includes('AI_EXPERIMENTING')) return 'Variant 2: Experimenter';
    if (tags.includes('GROWTH') || tags.includes('SCALE')) return 'Variant 5: Growth / Scale';
    return 'Variant 1: Curious Starter';
}

// 4. SMS Template Selection
function selectSMSTemplate(tags: string[], scoreBand: string): string {
    if (scoreBand === 'PRIORITY') return 'Template E (High Score)';
    if (tags.includes('TIME_BLOCKED')) return 'Template D (Time Blocked)';
    if (tags.includes('COST_BLOCKED')) return 'Template C (Cost Blocked)';
    if (tags.includes('AI_EXPERIMENTING') && tags.includes('QUALITY_BLOCKED')) return 'Template B (Quality Blocked)';
    return 'Template A (General)';
}


// --- Main Route ---

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        const { email, ...formData } = payload;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // 1. Run Logic
        const tags = deriveTags(formData);
        const score = calculateScore(formData);
        const band = getScoreBand(score);
        const variant = assignVariant(tags, formData);
        const smsTemplate = selectSMSTemplate(tags, band);

        console.log(`[GenAI Qualifier] Email: ${email}, Score: ${score}, Band: ${band}, Variant: ${variant}, SMS: ${smsTemplate}`);

        // 2. Database Update
        // Check if user exists in demo_raffle_entries
        const { data: existingEntry, error: fetchError } = await supabase
            .from('demo_raffle_entries')
            .select('id, entries_count')
            .eq('email', email)
            .single();

        let entryId;
        let newCount = (existingEntry?.entries_count || 1) + 5; // +5 Extra Entries

        if (!existingEntry) {
            // New Entry (Shouldn't happen if flow is strictly followed, but robust)
            const { data: inserted, error: insertError } = await supabase
                .from('demo_raffle_entries')
                .insert({
                    email,
                    name: formData.name,
                    phone: formData.phone,
                    responses: formData,
                    tags,
                    score,
                    score_band: band,
                    newsletter_variant: variant,
                    entries_count: 6, // 1 base + 5 bonus
                    sms_status: 'sent', // simulator
                    email_status: 'sent'
                })
                .select()
                .single();

            if (insertError) throw insertError;
            entryId = inserted.id;
        } else {
            // Update Existing
            const { error: updateError } = await supabase
                .from('demo_raffle_entries')
                .update({
                    phone: formData.phone, // Update phone
                    responses: formData,
                    tags,
                    score,
                    score_band: band,
                    newsletter_variant: variant,
                    entries_count: newCount,
                    sms_status: 'sent',
                    email_status: 'sent'
                })
                .eq('id', existingEntry.id);

            if (updateError) throw updateError;
            entryId = existingEntry.id;
        }

        // 3. Log Communications (Simulation)
        await supabase.from('comms_log').insert([
            {
                entry_id: entryId,
                channel: 'sms',
                template_id: smsTemplate,
                status: 'sent',
                metadata: {
                    details: "Simulated sending via Twilio",
                    content_preview: `Hey ${formData.name.split(' ')[0]} - you're in! [${smsTemplate}]`
                }
            },
            {
                entry_id: entryId,
                channel: 'email',
                template_id: 'Welcome + Next Steps',
                status: 'sent',
                metadata: {
                    variant: variant,
                    details: "Simulated sending via Mailchimp"
                }
            }
        ]);

        // 4. Send Real SMS via CommService
        // Map monthlyLeads to a friendly stage name for the message
        let stageName = 'Growth'; // Default
        const leads = formData.monthlyLeads;
        if (leads === '0-5') stageName = 'Foundation';
        else if (leads === '6-20') stageName = 'Early Traction';
        else if (leads === '21-50') stageName = 'Growth';
        else if (leads === '51-100') stageName = 'Scale';
        else if (leads === '100+') stageName = 'High Volume';

        if (formData.phone && formData.name) {
            CommService.sendGenAIResourcesSMS(formData.phone, formData.name, {
                tags,
                band,
                stage: stageName
            }).catch(err =>
                console.error("Failed to send GenAI SMS:", err)
            );
        }

        return NextResponse.json({ success: true, score, band, extraEntries: 5 });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
