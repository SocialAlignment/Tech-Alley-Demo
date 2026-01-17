import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MISSIONS_DB_ID = '2eb6b72fa76580088736f7cb6632eb0e';
const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_VERSION = '2022-06-28';

const MISSIONS_TO_ADD = [
    { title: 'Connect with 5 New People', desc: '(Important) Memorize their names', points: 20 },
    { title: 'Submit a Question or give Feedback', desc: '', points: 10 },
    { title: 'Complete your Social Profile', desc: '', points: 10 },
    { title: 'Submit a photo to the photo booth', desc: '', points: 10 },
    { title: 'Grab a photo with Jonathan Sterritt', desc: '', points: 15 },
    { title: 'Learn one new thing about AI', desc: 'That you didn\'t know before today', points: 10 },
    { title: 'Follow Tech Alley Henderson on LinkedIn', desc: '', points: 5 },
    { title: 'Enter the GenAi video giveaway', desc: '', points: 15 },
];

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
    console.log('--- Setting up Missions Database ---');

    // 1. Update Schema (Add 'Order' if missing)
    console.log(`Checking Missions DB: ${MISSIONS_DB_ID}...`);
    try {
        await notionRequest(`databases/${MISSIONS_DB_ID}`, 'PATCH', {
            properties: {
                'Order': { number: {} },
                // Ensure others exist
                'Points': { number: {} },
                'Description': { rich_text: {} },
                'Active': { checkbox: {} }
            }
        });
        console.log('✅ Schema Updated (Order, Points, Description, Active).');
    } catch (e: any) {
        console.error('❌ Failed to update Missions schema:', e.message);
    }

    // 2. Seed Data
    console.log('Seeding Missions...');
    for (let i = 0; i < MISSIONS_TO_ADD.length; i++) {
        const m = MISSIONS_TO_ADD[i];
        try {
            await notionRequest('pages', 'POST', {
                parent: { database_id: MISSIONS_DB_ID },
                properties: {
                    'Mission': { title: [{ text: { content: m.title } }] }, // Property is 'Mission'
                    'Description': { rich_text: [{ text: { content: m.desc } }] },
                    'Points': { number: m.points },
                    'Active': { checkbox: true },
                    'Order': { number: i + 1 }
                }
            });
            console.log(`+ Created: ${m.title}`);
        } catch (e: any) {
            console.error(`- Failed to create ${m.title}:`, e.message);
        }
    }

    // 3. Find Leads Database and Add Property
    console.log('\n--- Searching for "Leads 2.0" Database ---');
    try {
        // Search without strict object filter first, or use correct value
        const searchRes = await notionRequest('search', 'POST', {
            query: 'Leads 2.0',
            filter: { property: 'object', value: 'database' },
            page_size: 1
        });

        const leadsDb = searchRes.results[0];
        if (leadsDb) {
            console.log(`Found Leads DB: ${leadsDb.id} (${(leadsDb.title && leadsDb.title[0]?.plain_text) || 'Untitled'})`);

            console.log('Adding "MissionProgress" property...');
            await notionRequest(`databases/${leadsDb.id}`, 'PATCH', {
                properties: {
                    'MissionProgress': { rich_text: {} }
                }
            });
            console.log('✅ Leads DB Updated with MissionProgress property.');
            console.log(`LEADS_DB_ID=${leadsDb.id}`);

        } else {
            console.error('❌ Could not find "Leads 2.0" database. Please create the property manually.');
        }

    } catch (e: any) {
        console.error('❌ Error finding Leads DB:', e.message);
    }
}

setup();
