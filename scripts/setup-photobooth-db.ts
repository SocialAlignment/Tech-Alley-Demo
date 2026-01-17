import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_VERSION = '2022-06-28';
// Using the same parent page as Missions/Events if possible, or just create it in the workspace
// Ideally we want to search for a parent page, but for now let's creating it under the same parent as Missions if we knew it.
// Since we don't have the parent ID handy, we'll search for "Tech Alley Henderson" page or "Hub Database" page to be the parent.
// Or actually, let's just search for the "Leads 2.0" DB and use its parent, assuming they are in the same workspace/page.

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
    console.log('--- Setting up Photo Booth Gallery Database ---');

    try {
        // 1. Find a suitable parent page. We'll look for "Tech Alley Henderson" page.
        const searchRes = await notionRequest('search', 'POST', {
            query: 'Tech Alley Henderson',
            filter: { property: 'object', value: 'page' },
            page_size: 1
        });

        const parentPage = searchRes.results[0];
        if (!parentPage) {
            console.error('❌ Could not find "Tech Alley Henderson" page to use as parent.');
            return;
        }
        console.log(`Found Parent Page: ${parentPage.id} (${parentPage.properties?.title?.title[0]?.plain_text || 'Untitled'})`);

        // 2. Create the Database
        console.log('Creating "Photo Booth Gallery" Database...');

        const newDb = await notionRequest('databases', 'POST', {
            parent: { page_id: parentPage.id },
            title: [
                {
                    type: 'text',
                    text: { content: 'Photo Booth Gallery' }
                }
            ],
            properties: {
                'Caption': { title: {} },
                'ImageURL': { url: {} },
                'S3Key': { rich_text: {} },
                'Status': {
                    select: {
                        options: [
                            { name: 'Approved', color: 'green' },
                            { name: 'Pending', color: 'yellow' },
                            { name: 'Rejected', color: 'red' }
                        ]
                    }
                },
                'UploadedAt': { date: {} }
            }
        });

        console.log('✅ Database Created Successfully!');
        console.log(`DB_ID: ${newDb.id}`);
        console.log(`\nPlease add the following to your .env.local:\nNOTION_PHOTOBOOTH_DB_ID=${newDb.id}`);

    } catch (e: any) {
        console.error('❌ Error setting up database:', e.message);
    }
}

setup();
