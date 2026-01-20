import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Refactored to Supabase + Background Sync
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { leadId, ...data } = body;

        if (!leadId) return NextResponse.json({ error: 'Missing Lead ID' }, { status: 400 });

        console.log("Received Contact Update for:", leadId);

        // 1. Map Frontend Data to Supabase Columns
        const updateData: any = {};

        // Basic Info
        if (data.phone) updateData.phone = data.phone;

        // Socials (Clean up URLs)
        const cleanUrl = (url: string) => url ? (url.startsWith('@') ? `https://instagram.com/${url.substring(1)}` : url) : null;
        if (data.instagram) updateData.instagram = cleanUrl(data.instagram);
        if (data.linkedin) updateData.linkedin = data.linkedin;
        if (data.facebook) updateData.facebook = data.facebook;
        if (data.youtube) updateData.youtube = data.youtube;
        if (data.schedulingLink) updateData.scheduling_link = data.schedulingLink;

        // MRI / Profile Text
        if (data.hometown) updateData.hometown = data.hometown;
        if (data.timezone) updateData.timezone = data.timezone;
        if (data.bestTime) updateData.best_time = data.bestTime;
        if (data.askMeAbout) updateData.ask_me_about = data.askMeAbout;
        if (data.helpMeBy) updateData.help_me_by = data.helpMeBy;
        if (data.helpYouBy) updateData.help_you_by = data.helpYouBy;

        // Preferences
        if (data.learningPreference) {
            // Ensure it's an array for Supabase (text[])
            updateData.learning_preference = Array.isArray(data.learningPreference) ? data.learningPreference : [data.learningPreference];
        }

        if (data.commPrefs) {
            const commMap: Record<string, string> = {
                "Text/SMS": "SMS",
                "Phone Call": "Phone",
                "Email": "Email",
                "Social Media": "Social Media",
                "Scheduling Link": "Scheduling Link"
            };
            // Supabase expects a single string for communication_preference
            const rawPref = Array.isArray(data.commPrefs) ? data.commPrefs[0] : data.commPrefs;
            updateData.communication_preference = commMap[rawPref] || rawPref;
        }

        // Onboarding / Business Data
        if (data.industry) updateData.industry = data.industry;
        if (data.company) updateData.company = data.company;
        if (data.role) updateData.role = data.role;
        if (data.website) updateData.website = data.website;
        if (data.businessType) updateData.business_type = data.businessType;
        if (data.employeeCount) updateData.employee_count = data.employeeCount;
        if (data.decisionMaker) updateData.decision_maker = data.decisionMaker;

        // Fix: Convert "yes"/"no" to boolean for is_first_time
        if (data.isFirstTime !== undefined) {
            updateData.is_first_time = data.isFirstTime === 'yes' || data.isFirstTime === true;
        }

        if (data.goalForTonight) updateData.goal_for_tonight = data.goalForTonight;
        if (data.vision) updateData.vision = data.vision;

        // Fix: Handle empty strings for numeric fields
        if (data.estimatedMonthlyRevenue) {
            updateData.estimated_monthly_revenue = data.estimatedMonthlyRevenue;
        } else if (data.estimatedMonthlyRevenue === '') {
            updateData.estimated_monthly_revenue = null;
        }

        if (data.currentLeadsPerMonth) {
            updateData.current_leads_per_month = data.currentLeadsPerMonth;
        } else if (data.currentLeadsPerMonth === '') {
            updateData.current_leads_per_month = null;
        }

        // 3. AI MRI Data Aggregation
        // The wizard sends flat fields, we need to bundle them for the JSONB column
        // We merge with any existing `aiMriResponse` passed, prioritizing the flat fields
        const mriFields = {
            profession: data.profession,
            companyName: data.companyName,
            businessStatus: data.businessStatus,
            revenueRange: data.revenueRange,
            softwareSpend: data.softwareSpend,
            mainBottleneck: data.mainBottleneck,
            urgency: data.urgency,
            manualHours: data.manualHours,
            giftedHours: data.giftedHours,
            vision3mo: data.vision3mo,
            servicesInterest: data.servicesInterest,
            workshopsInterest: data.workshopsInterest,
            hiringInterest: data.hiringInterest,
            trainingInterest: data.trainingInterest
        };

        // Remove undefined/null keys to keep JSON clean
        const cleaningMri = Object.fromEntries(Object.entries(mriFields).filter(([_, v]) => v !== undefined && v !== null && v !== ''));

        if (Object.keys(cleaningMri).length > 0) {
            updateData.ai_mri_response = {
                ...(data.aiMriResponse || {}),
                ...cleaningMri
            };
        } else if (data.aiMriResponse) {
            updateData.ai_mri_response = data.aiMriResponse;
        }

        // Initialize Admin Client to bypass RLS
        const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        console.log(`[Contact Update] Using Admin Client? ${hasServiceKey}`);

        const adminAuthClient = process.env.SUPABASE_SERVICE_ROLE_KEY
            ? require('@supabase/supabase-js').createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            )
            : supabase;

        // 4. Update Supabase (Leads Table)
        const { data: updatedUser, error } = await adminAuthClient
            .from('leads')
            .update(updateData)
            .eq('id', leadId)
            .select('email') // Needed for Notion Sync
            .maybeSingle();

        if (error) {
            console.error("[Contact Update] database error:", error);
            throw new Error(error.message);
        }

        // If no user was updated (maybeSingle returned null), it means ID didn't match OR strict RLS blocking
        if (!updatedUser) {
            console.error(`[Contact Update] FAILED. No user found with ID ${leadId}. RLS blocked or Invalid ID.`);
            // Return ERROR so frontend doesn't show success confetti
            return NextResponse.json({
                success: false,
                error: 'Update failed. No user found or permission denied.',
                debug: { hasServiceKey, leadId }
            }, { status: 400 });
        }

        // 5. Handle GenAI Raffle Entry (Upsert Logic)
        // 5. Handle GenAI Raffle Entry (Upsert Logic)
        // Check if we have raffle data (Legacy or New Wizard)
        if (data.targetAudience || data.painPoint || data.uniqueSolution || data.aiExpectations || data.aiHesitation || data.interestedServices) {
            console.log("[Contact Update] Processing Raffle Entry...");
            const raffleData = {
                lead_id: leadId,
                // Legacy / Manual
                target_audience: data.targetAudience,
                pain_point: data.painPoint,
                unique_solution: data.uniqueSolution,
                mascot_details: data.mascotDetails,
                content_problem: data.contentProblem,
                ad_spend: data.adSpend,
                lead_volume: data.leadVolume,

                // New Wizard Fields
                gen_ai_exp: data.genAiExp,
                ai_expectations: data.aiExpectations,
                ai_hesitation: data.aiHesitation,
                interested_services: data.interestedServices, // specific text[] column in DB

                form_type: 'Unified Profile',
                // Don't overwrite is_winner if it exists
            };

            // We try to update existing entry first to avoid duplicates
            const { error: raffleError } = await adminAuthClient
                .from('raffle_entries')
                .upsert(raffleData, { onConflict: 'lead_id', ignoreDuplicates: false });
            // Note: 'lead_id' must be a unique constraint or primary key for onConflict to work perfectly.
            // If it fails, we catch it.

            if (raffleError) {
                console.error("[Contact Update] Raffle Upsert Error:", raffleError);
                // We don't block the main success response, but we log it.
            } else {
                console.log("[Contact Update] Raffle Entry Synced.");
            }
        }

        // 6. Sync to Notion (Background)
        if (updatedUser?.email) {
            const { syncUpdateToNotion } = await import('@/lib/notion');
            // We pass the same data structure we used for Supabase,
            // but `syncUpdateToNotion` expects keys matching the SQL columns mostly (snake_case)
            syncUpdateToNotion(updatedUser.email, updateData);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Contact Update Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update contact details',
                details: error.message || 'Unknown error',
                code: error.code,
                hint: error.hint
            },
            { status: 500 }
        );
    }
}
