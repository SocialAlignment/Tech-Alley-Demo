import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_PHOTOBOOTH_DB_ID;
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

async function inspectSchema() {
    if (!NOTION_DB_ID) {
        console.error("NOTION_PHOTOBOOTH_DB_ID not found in .env.local");
        return;
    }
    console.log(`Inspecting Database: ${NOTION_DB_ID}`);
    try {
        // Query for 1 page to see its properties (which reflect schema)
        const response = await notionRequest(`databases/${NOTION_DB_ID}/query`, 'POST', {
            page_size: 1
        });

        if (response.results.length > 0) {
            console.log("Page Properties:");
            console.log(JSON.stringify(response.results[0].properties, null, 2));
        } else {
            console.log("No pages found in database. Trying to retrieve database object directly to check if that works manually.");
            const dbResponse = await notionRequest(`databases/${NOTION_DB_ID}`, 'GET');
            console.log("Database Object (raw):");
            console.log(JSON.stringify(dbResponse, null, 2));
        }
    } catch (error: any) {
        console.error("Error retrieving database:", error.message);
    }
}

inspectSchema();
