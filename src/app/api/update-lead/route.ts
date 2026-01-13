import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function PATCH(request: Request) {
    try {
        const { leadId, updates } = await request.json();

        if (!leadId || !updates) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Construct Notion Properties Update Object
        const properties: any = {};

        // Map "Standard" fields we expect from our app to Notion Properties
        // 1. Giveaway Qualification
        // 0. Update Name if provided (to fix Anonymous leads)
        if (updates.name) {
            properties['Name'] = {
                title: [
                    { text: { content: updates.name } }
                ]
            };
        }

        // 1. Giveaway Qualification
        if (updates.marketingGoal) {
            // Use 'Marketing Goal' select property as primarily reading in Admin API
            properties['Marketing Goal'] = {
                select: {
                    name: updates.marketingGoal
                }
            };

            // Optional: Also update Areas of AI Interest if needed, but stick to one for now.
        }

        // 2. Master Qualifier Fields (GenAI Video Audit)
        // "Who handles the tech & budget?" -> Decision Maker
        if (updates.decisionMaker) {
            properties['Decision Maker'] = { select: { name: updates.decisionMaker } };
        }
        // "Primary Business Model" -> Type of Business
        if (updates.businessType) {
            properties['Type of Business'] = { select: { name: updates.businessType } };
        }
        // "Biggest Bottleneck" -> Bottleneck
        if (updates.bottleneck) {
            properties['Bottleneck'] = { select: { name: updates.bottleneck } };
        }
        // "Snap fingers and solve ONE problem" -> Primary Priority Problem
        if (updates.primaryProblem) {
            properties['Primary Priority Problem'] = { rich_text: [{ text: { content: updates.primaryProblem } }] };
        }
        // "Tools currently using" -> Specific AI Tools
        if (updates.toolsInterest) {
            properties['Specific AI Tools (Used or Interested)'] = { rich_text: [{ text: { content: updates.toolsInterest } }] };
        }

        // 3. NEW Master Fields (Budget, Maturity, Gain)
        // "Monthly Content Budget" -> Budget Range
        if (updates.budgetRange) {
            properties['Budget Range'] = { select: { name: updates.budgetRange } };
        }
        // "AI Maturity" -> AI Knowledge Level
        if (updates.aiMaturity) {
            properties['AI Knowledge Level'] = { select: { name: updates.aiMaturity } };
        }
        // "Monthly Gain" -> Total Monthly Gain ($)
        if (updates.monthlyGain) {
            properties['Total Monthly Gain ($)'] = { number: Number(updates.monthlyGain) };
        }

        // 3. Handling Missing Fields (Video Readiness, etc)
        // Handled by Unified Notes Logic below


        // 4. Triggers & Checkboxes
        if (updates.enteredToWin) {
            properties['Entered to Win'] = { checkbox: true };
        }
        if (updates.genAiConfirmed) {
            properties['GenAi Entry Confirmed'] = { checkbox: true };
        }

        // 5. Event Feedback (Text Area)
        if (updates.eventFeedback) {
            properties['Event Feedback'] = {
                rich_text: [
                    { text: { content: updates.eventFeedback } }
                ]
            };
        }



        // --- 6. HANDLE BUSINESS MRI DATA (Phase 2) ---
        if (updates.mriData) {
            const mri = updates.mriData;

            // 1. The Who
            if (mri.description) properties['What Best Describes You?'] = { select: { name: mri.description } };
            if (mri.businessStatus) properties['Business Status'] = { select: { name: mri.businessStatus } };
            if (mri.profession) properties['Profession'] = { rich_text: [{ text: { content: mri.profession } }] };
            if (mri.companyName) properties['Company'] = { rich_text: [{ text: { content: mri.companyName } }] };
            if (mri.website) properties['Website'] = { url: mri.website };
            if (mri.linkedin) properties['LinkedIn'] = { rich_text: [{ text: { content: mri.linkedin } }] };

            // 2. The Size
            if (mri.employeeCount) properties['Employee Count'] = { select: { name: mri.employeeCount } };
            if (mri.revenueRange) properties['Revenue Range'] = { select: { name: mri.revenueRange } };
            if (mri.industry) properties['Industry'] = { select: { name: mri.industry } };
            if (mri.softwareSpend) properties['Monthly Software Spend'] = { select: { name: mri.softwareSpend } };

            // 3. The Pain
            if (mri.mainBottleneck) properties['Main Bottleneck'] = { select: { name: mri.mainBottleneck } };
            if (mri.urgency) properties['Urgency'] = { rich_text: [{ text: { content: mri.urgency } }] };
            if (mri.manualHours) properties['Weekly Hours Spent on Repetitive/Manual Tasks'] = { select: { name: mri.manualHours } };
            if (mri.giftedHours) properties['If gifted 10+ hours/week, how would you use it?'] = { select: { name: mri.giftedHours } };
            // Note: 'primaryProblem' maps to existing logic if sent, but mri uses specific keys, let's map explicit here too
            /* (Already handled by standard logic if keys match, but let's be safe) */

            // 4. The Vision
            if (mri.vision3mo) properties['Success Vision'] = { rich_text: [{ text: { content: mri.vision3mo } }] };
            if (mri.servicesInterest && mri.servicesInterest.length > 0) {
                properties['Intersted Service'] = { multi_select: mri.servicesInterest.map((n: string) => ({ name: n })) };
            }
            if (mri.workshopsInterest && mri.workshopsInterest.length > 0) {
                properties['Areas of AI Interest'] = { multi_select: mri.workshopsInterest.map((n: string) => ({ name: n })) };
            }

            // FALLBACKS (Missing Fields -> Initial Notes)
            // We append these to any existing notes logic
            // MRI Specific Fallbacks
            const mriNotes = [];
            if (mri.hiringInterest) mriNotes.push(`[MRI] Interested in Hiring: YES`);
            if (mri.trainingInterest) mriNotes.push(`[MRI] Wants Team AI Training: YES`);

            // Add to the main notesParts array if they exist
            if (mriNotes.length > 0) {
                // Creating a safe merge with standard notes
                // If we have standard notes (budget/videoReadiness) we combine them
                // NOTE: We handle this by verifying if 'Initial Notes' is already being set or not.
                // For simplicity, let's redefine the notes logic below to encompass ALL sources.
            }
        }

        // --- UNIFIED NOTES LOGIC (Standard + MRI) ---
        const allNotes = [];
        // Standard Form Inputs
        if (updates.budget) allNotes.push(`Monthly Content Budget: ${updates.budget}`);
        if (updates.videoReadiness) allNotes.push(`Video Readiness: ${updates.videoReadiness}`);

        // MRI Inputs
        if (updates.mriData) {
            if (updates.mriData.hiringInterest) allNotes.push(`[MRI] Interested in Hiring: YES`);
            if (updates.mriData.trainingInterest) allNotes.push(`[MRI] Wants Team AI Training: YES`);
        }

        // Speaker App Inputs (Phase 4)
        if (updates.speakerData) {
            allNotes.push(`[SPEAKER] Topic: ${updates.speakerData.topic}`);
            allNotes.push(`[SPEAKER] Experience: ${updates.speakerData.experience}`);
            if (updates.speakerData.isGuest) allNotes.push(`[SPEAKER] Interested in Podcast: YES`);
        }

        // GenAI Audit Inputs (Phase 3)
        // 1. Map to Real Properties
        if (updates.leadsPerWeek) {
            properties['Leads/Customers per Week for Better Automation'] = { select: { name: updates.leadsPerWeek } };
        }
        if (updates.aiChallenges && updates.aiChallenges.length > 0) {
            properties['Main Challenges for AI'] = { multi_select: updates.aiChallenges.map((n: string) => ({ name: n })) };
        }

        // 2. Map to Fallback Notes
        if (updates.conversionRate) allNotes.push(`Conversion Rate: ${updates.conversionRate}%`);
        if (updates.socialPosts) allNotes.push(`Social Posts/Week: ${updates.socialPosts}`);
        if (updates.allowAds) allNotes.push(`Runs Ads: ${updates.allowAds}`);
        if (updates.slogan) allNotes.push(`Slogan/Hook: "${updates.slogan}"`);

        if (allNotes.length > 0) {
            properties['Initial Notes'] = {
                rich_text: [{ text: { content: allNotes.join('\n') } }]
            };
        }

        // Execute Update
        await notion.pages.update({
            page_id: leadId,
            properties: properties
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Update Lead Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update lead' },
            { status: 500 }
        );
    }
}
