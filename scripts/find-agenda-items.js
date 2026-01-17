const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function findItems() {
    console.log("Searching for newly created agenda items (Networking, Kickoff, Welcome)...");

    try {
        const response = await notion.search({
            query: 'Networking', // Searching for a likely keyword
            sort: {
                direction: 'descending',
                timestamp: 'last_edited_time'
            }
        });

        console.log(`Found ${response.results.length} results.`);

        response.results.forEach(item => {
            if (item.object === 'page' && item.parent.type === 'database_id') {
                const title = item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
                console.log(`\nPage: "${title}"`);
                console.log(`ID: ${item.id}`);
                console.log(`Parent DB ID: ${item.parent.database_id}`);

                if (item.parent.database_id.replaceAll('-', '') === '2eb6b72fa765806684e6000b7a37d74e') {
                    console.log("✅ MATCHES CURRENT CONFIG ID!");
                } else {
                    console.log("❌ DOES NOT MATCH CURRENT CONFIG ID.");
                }
            }
        });

    } catch (error) {
        console.error("Search failed:", error.body || error);
    }
}

findItems();
