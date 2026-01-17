
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const LEADS_DB_ID = '1bc6b72fa76581f680a7e5dd23031eb4';
const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_VERSION = '2022-06-28';

async function notionRequest(endpoint: string, method: string, body?: any) {
    const res = await fetch(`https://api.notion.com/v1/${endpoint}`, {
        method,
        headers: {
            'Authorization': `Bearer ${NOTION_KEY}`,
            'Notion-Version': NOTION_VERSION,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        throw new Error(`Notion API Error ${res.status}: ${await res.text()}`);
    }
    return res.json();
}

async function setup() {
    console.log(`Checking Leads DB: ${LEADS_DB_ID}...`);
    try {
        await notionRequest(`databases/${LEADS_DB_ID}`, 'PATCH', {
            properties: {
                // 'MissionData' stores the raw IDs string (e.g. "id1,id2")
                'MissionData': { rich_text: {} },

                // 'MissionProgress' stores the calculated percentage (e.g. 38)
                // We set format to 'ring' (though API might just see number, visualization is UI-side or Notion-side config)
                // Notion API allows setting number format
                'MissionProgress': { number: { format: 'number' } } // Can't set 'ring' via API easily, user can config in UI.
            }
        });
        console.log('✅ Schema Updated (MissionData added, MissionProgress set to Number).');
        console.log('NOTE: Please configure "MissionProgress" in Notion UI to display as "Ring" or "Bar" if not already set.');
    } catch (e: any) {
        console.error('❌ Failed to update Leads schema:', e.message);
    }
}

setup();
