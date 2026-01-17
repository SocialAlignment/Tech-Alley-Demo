const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function findTrueDB() {
    console.log("Searching for specific page 'Doors Open'...");

    try {
        const response = await notion.search({
            query: 'Social Alignment Workshop Series',
            sort: {
                direction: 'descending',
                timestamp: 'last_edited_time'
            }
        });

        console.log(`Found ${response.results.length} results.`);

        response.results.forEach(item => {
            const title = item.properties?.Name?.title?.[0]?.plain_text ||
                item.title?.[0]?.plain_text ||
                "Untitled";

            console.log(`\n[${item.object}] Title: "${title}"`);
            console.log(`ID: ${item.id}`);

            if (item.parent) {
                console.log(`Parent Type: ${item.parent.type}`);
                if (item.parent.type === 'database_id') {
                    console.log(`PARENT DATABASE ID: ${item.parent.database_id}`);
                } else if (item.parent.type === 'page_id') {
                    console.log(`PARENT PAGE ID: ${item.parent.page_id}`);
                } else {
                    console.log(`Parent: ${JSON.stringify(item.parent)}`);
                }
            }
        });

    } catch (error) {
        console.error("Search failed:", error.body || error);
    }
}

findTrueDB();
