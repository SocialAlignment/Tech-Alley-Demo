import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_PHOTOBOOTH_DB_ID;
const NOTION_VERSION = '2022-06-28';

async function setupInstagram() {
    if (!NOTION_DB_ID) {
        console.error("NOTION_PHOTOBOOTH_DB_ID missing.");
        return;
    }

    console.log(`Updating Database Schema for: ${NOTION_DB_ID} to add "Instagram" property...`);

    const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${NOTION_KEY}`,
            'Notion-Version': NOTION_VERSION,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            properties: {
                'Instagram': {
                    rich_text: {}
                }
            }
        })
    });

    if (!res.ok) {
        console.error(`Error updating DB: ${await res.text()}`);
    } else {
        const data = await res.json();
        console.log("✅ Successfully added 'Instagram' property to database!");
    }
}

setupInstagram();
