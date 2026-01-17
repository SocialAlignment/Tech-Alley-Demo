import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { leadId, ...data } = body;

        console.log("Received Contact Update for:", leadId, data);

        if (!leadId) {
            return NextResponse.json({ error: 'Missing Lead ID' }, { status: 400 });
        }

        const properties: any = {};

        // Helper to format Rich Text
        const toRichText = (content: string) => ([{ text: { content: content || '' } }]);

        // 1. Phone
        if (data.phone) {
            properties['Phone'] = { phone_number: data.phone };
        }

        // 2. URLs (Socials & Schedule)
        // NOTE: Notion Database has these as 'Text' (rich_text), not 'URL'
        const socialFields = [
            { key: 'instagram', prop: 'Instagram' },
            { key: 'linkedin', prop: 'LinkedIn' },
            { key: 'facebook', prop: 'Facebook' },
            { key: 'youtube', prop: 'YouTube' },
            { key: 'schedulingLink', prop: 'Scheduling Link' }
        ];

        socialFields.forEach(({ key, prop }) => {
            if (data[key]) {
                let url = data[key];
                // basic cleanup
                if (key === 'instagram' && url.startsWith('@')) {
                    url = `https://instagram.com/${url.substring(1)}`;
                }

                // Save as Rich Text because Notion schema is Text
                properties[prop] = { rich_text: toRichText(url) };
            }
        });

        // 3. Text Fields (Matching exact Notion Schema: Sentence case + colon)
        if (data.hometown) properties['Hometown'] = { rich_text: toRichText(data.hometown) };
        if (data.timezone) properties['Timezone'] = { rich_text: toRichText(data.timezone) };
        if (data.bestTime) properties['Best Time to Reach'] = { rich_text: toRichText(data.bestTime) };

        if (data.askMeAbout) properties['Ask Me About'] = { rich_text: toRichText(data.askMeAbout) };
        // Corrected Name: "You can help me by:"
        if (data.helpMeBy) properties['You can help me by:'] = { rich_text: toRichText(data.helpMeBy) };
        // Corrected Name: "I can help you by:"
        if (data.helpYouBy) properties['I can help you by:'] = { rich_text: toRichText(data.helpYouBy) };

        // 4. Multi-Select Fields (Learning Preference & Comm Prefs)

        // Learning Preference
        if (data.learningPreference && Array.isArray(data.learningPreference) && data.learningPreference.length > 0) {
            properties['Learning Preference'] = {
                multi_select: data.learningPreference.map((pref: string) => ({ name: pref }))
            };
        } else if (typeof data.learningPreference === 'string' && data.learningPreference) {
            properties['Learning Preference'] = {
                multi_select: [{ name: data.learningPreference }]
            };
        }

        // Comm Prefs - Name Correction: Singular "Communication Preference"
        if (data.commPrefs && Array.isArray(data.commPrefs) && data.commPrefs.length > 0) {
            const commMap: Record<string, string> = {
                "Text/SMS": "SMS",
                "Phone Call": "Phone",
                "Email": "Email",
                "Social Media": "Social Media",
                "Scheduling Link": "Scheduling Link"
            };

            // Notion "Select" only accepts ONE value. We take the first one selected.
            const rawPref = data.commPrefs[0];
            const finalPref = commMap[rawPref] || rawPref;

            properties['Communication Preference'] = {
                select: { name: finalPref }
            };
        }

        // Perform Update
        if (Object.keys(properties).length > 0) {
            // Check the 'Social Profile Completed' box
            properties['Social Profile Completed'] = { checkbox: true };

            await notion.pages.update({
                page_id: leadId,
                properties: properties,
            });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Contact Update Error:', error);
        // Log detailed Notion error
        if (error.body) {
            console.error('Notion Error Body:', error.body);
        }
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update contact details',
                details: error.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
}
