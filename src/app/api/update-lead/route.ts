import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { pageId } = body;

        if (!pageId) return NextResponse.json({ error: 'Missing pageId' }, { status: 400 });

        const apiKey = process.env.NOTION_API_KEY;
        if (!apiKey) throw new Error('Missing Config');

        // Dynamic Property Construction to support Partial Updates
        const properties: any = {};

        // Helper to add property if defined in body
        const addProp = (key: string, type: string, value: any, transform?: (v: any) => any) => {
            if (value !== undefined) {
                if (type === 'rich_text') {
                    properties[key] = { rich_text: [{ text: { content: value || '' } }] };
                } else if (type === 'select') {
                    properties[key] = { select: { name: value || (key === 'Industry' ? 'Other' : 'Just Curious') } };
                } else if (type === 'url') {
                    properties[key] = { url: value || null };
                } else if (type === 'phone_number') {
                    properties[key] = { phone_number: value || null };
                } else if (type === 'checkbox') {
                    properties[key] = { checkbox: !!value };
                } else if (type === 'number') {
                    properties[key] = { number: Number(value) };
                }
                // Custom handling
                else if (transform) {
                    properties[key] = transform(value);
                }
            }
        };

        // --- GenAI Raffle / Audit Fields ---
        addProp('Target Audience', 'rich_text', body.targetAudience);
        addProp('Biggest Pain Point', 'rich_text', body.painPoint);
        addProp('Unique Solution', 'rich_text', body.uniqueSolution);
        addProp('Mascot Details', 'rich_text', body.mascotDetails);

        addProp('GenAI Experience', 'select', body.genAiExp);
        addProp('GenAI Tools', 'rich_text', body.genAiTools);
        addProp('Content Problem', 'select', body.contentProblem);

        addProp('Marketing Problem', 'select', body.marketingProblem);
        addProp('Ad Spend', 'select', body.adSpend);

        // Metrics - Try to parse as numbers, or store as text if preferred? 
        // Using number for sorting/filtering.
        addProp('Lead Volume', 'number', body.leadVolume);
        addProp('Conversion Rate', 'number', body.conversionRate);

        // Metadata
        addProp('Form Type', 'select', body.formType);
        addProp('Entered Raffle', 'checkbox', body.enteredToWin);
        addProp('GenAI Interest', 'checkbox', body.genAiConfirmed);

        addProp('Company', 'rich_text', body.company);
        addProp('Job Title', 'rich_text', body.title);
        addProp('Website', 'url', body.website);
        addProp('Phone', 'phone_number', body.phone);

        // Selects with Defaults (Logic: if provided but empty/null, use default? Or if undefined do nothing?)
        // The previous code defaulted if 'industry' was passed as empty string? 
        // "industry || 'Other'".
        // If body has { industry: "" }, it sets 'Other'. ok.
        addProp('Industry', 'select', body.industry);
        addProp('What Best Describes You?', 'select', body.role);
        addProp('Employee Count', 'select', body.employeeCount, (v) => ({ select: { name: v || '1-10' } }));
        addProp('Decision Maker', 'select', body.decisionMaker, (v) => ({ select: { name: v || 'Sole' } }));

        if (body.isFirstTime !== undefined) {
            properties['First Time TAH?'] = { select: { name: body.isFirstTime ? "Yes this is my first time!" : "No I've attended before." } };
        }

        addProp('Intentional Action', 'rich_text', body.goalForTonight);
        addProp('3Month Success Vision', 'rich_text', body.vision);

        // Mission Progress Implementation:
        // 'MissionData': Stores the raw IDs (Text) -> Used for Checkbox State
        addProp('MissionData', 'rich_text', body.missionData);

        // 'MissionProgress': Stores the Percentage (Number) -> Used for Visualization Ring
        addProp('MissionProgress', 'number', body.missionProgress);

        // If MissionProgress is 100, verify if we should set the completion timestamp
        // We only set it if provided 'missionProgress' is explicitly 100.
        // Ideally we would check if it's already set to avoid overwriting the FIRST time they completed it,
        // but for now, let's assume if they hit 100% we update the completion time to "now" if it's not set?
        // Actually, simpler: If 100%, set MissionComplete to now.
        if (Number(body.missionProgress) === 100) {
            properties['MissionComplete'] = { date: { start: new Date().toISOString() } };
        }

        // Onboarding Form Done
        // Only set this if explicitly passed (e.g. from the form), OR if it was defaulted before. 
        // Previous code: always sent { checkbox: true }.
        // We will assume if this endpoint is called without explicit 'onboardingDone' false, we might want to set it?
        // But for missions we DON'T want to set it if it wasn't valid.
        // Let's rely on the frontend sending `onboardingDone: true` if it's the Main Form.
        // UPDATE: For backward compatibility with the existing form (which might not send it), 
        // we check if "Company" or "Role" is present. If so, it's likely the onboarding form.
        if (body.company !== undefined || body.role !== undefined || body.onboardingDone === true) {
            properties['Onboarding Form Done'] = { checkbox: true };
        }

        const updateRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ properties })
        });

        if (!updateRes.ok) {
            const err = await updateRes.text();
            throw new Error(err);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Update Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
