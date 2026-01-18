export async function syncToNotion(leadData: {
    name: string;
    email: string;
    company?: string;
    title?: string;
    phone?: string;
}) {
    // Fire and forget check
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_LEADS_DB_ID) {
        console.warn("Skipping Notion Sync: Credentials missing");
        return;
    }

    try {
        const apiKey = process.env.NOTION_API_KEY;
        const dbId = process.env.NOTION_LEADS_DB_ID;

        console.log("Syncing to Notion:", leadData.email);

        await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                parent: { database_id: dbId },
                properties: {
                    Name: { title: [{ text: { content: leadData.name } }] },
                    Email: { email: leadData.email },
                    Company: { rich_text: [{ text: { content: leadData.company || '' } }] },
                    Title: { rich_text: [{ text: { content: leadData.title || '' } }] },
                    Phone: leadData.phone ? { phone_number: leadData.phone } : undefined,
                    'Lead Source': { select: { name: 'Tech Alley Henderson' } }
                    // Add other fields if needed
                }
            })
        });
        console.log("Notion Sync Success for:", leadData.email);
    } catch (e) {
        console.error("Notion Sync Error (Background)", e);
    }
}

// Helper to Update Notion Page (Sync Update)
export async function syncUpdateToNotion(email: string, updateData: any) {
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_LEADS_DB_ID) return;

    try {
        const apiKey = process.env.NOTION_API_KEY;
        const dbId = process.env.NOTION_LEADS_DB_ID;
        const NOTION_VERSION = '2022-06-28';

        // 1. Find the Page ID by Email
        const queryRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Email',
                    email: { equals: email }
                }
            })
        });

        if (!queryRes.ok) throw new Error("Failed to query Notion for update");
        const queryData = await queryRes.json() as { results: { id: string }[] };

        if (!queryData.results || queryData.results.length === 0) {
            console.warn("Notion Sync Update: User not found in Notion", email);
            return;
        }

        const pageId = queryData.results[0].id;

        // 2. Format Properties for Notion
        // This maps the flat key-values to Notion's specific property types
        const properties: any = {};
        const toRichText = (txt: string) => [{ text: { content: txt || '' } }];

        if (updateData.preferred_name) properties['Preferred Name'] = { rich_text: toRichText(updateData.preferred_name) };
        if (updateData.phone) properties['Phone'] = { phone_number: updateData.phone };

        // Socials
        if (updateData.instagram) properties['Instagram'] = { rich_text: toRichText(updateData.instagram) };
        if (updateData.linkedin) properties['LinkedIn'] = { rich_text: toRichText(updateData.linkedin) };
        if (updateData.facebook) properties['Facebook'] = { rich_text: toRichText(updateData.facebook) };
        if (updateData.youtube) properties['YouTube'] = { rich_text: toRichText(updateData.youtube) };
        if (updateData.scheduling_link) properties['Scheduling Link'] = { rich_text: toRichText(updateData.scheduling_link) };

        // MRI fields
        if (updateData.hometown) properties['Hometown'] = { rich_text: toRichText(updateData.hometown) };
        if (updateData.timezone) properties['Timezone'] = { rich_text: toRichText(updateData.timezone) };
        if (updateData.best_time) properties['Best Time to Reach'] = { rich_text: toRichText(updateData.best_time) };
        if (updateData.ask_me_about) properties['Ask Me About'] = { rich_text: toRichText(updateData.ask_me_about) };
        if (updateData.help_me_by) properties['You can help me by:'] = { rich_text: toRichText(updateData.help_me_by) };
        if (updateData.help_you_by) properties['I can help you by:'] = { rich_text: toRichText(updateData.help_you_by) };

        // Prefs
        if (updateData.communication_preference) {
            properties['Communication Preference'] = { select: { name: updateData.communication_preference } };
        }
        if (updateData.learning_preference) {
            properties['Learning Preference'] = { multi_select: updateData.learning_preference.map((p: string) => ({ name: p })) };
        }

        // Check Social Profile Completed if verified
        properties['Social Profile Completed'] = { checkbox: true };

        // 3. Update Page
        await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ properties })
        });

        console.log("Notion Sync Update Success for:", email);

    } catch (e) {
        console.error("Notion Sync Update Error", e);
    }
}
