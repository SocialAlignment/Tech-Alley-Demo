import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_PHOTOBOOTH_DB_ID;
const NOTION_VERSION = '2022-06-28';

async function verifyLastEntry() {
    try {
        const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_KEY}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ page_size: 1, sorts: [{ property: 'UploadedAt', direction: 'descending' }] })
        });

        const data = await res.json();
        if (data.results && data.results.length > 0) {
            const props = data.results[0].properties;
            console.log("Last Entry User Field:", JSON.stringify(props.User, null, 2));

            const userText = props.User?.rich_text?.[0]?.plain_text;
            const igText = props.Instagram?.rich_text?.[0]?.plain_text;

            console.log("Last Entry User:", userText);
            console.log("Last Entry Instagram:", igText);

            if (userText === "Test User (Verification Script)" && igText === "@test_ig_handle") {
                console.log("✅ Verification Passed: User and Instagram fields match test data.");
            } else {
                console.error("❌ Verification Failed: Data mismatch.", { user: userText, ig: igText });
            }
        }
    } catch (e) {
        console.error(e);
    }
}

verifyLastEntry();
