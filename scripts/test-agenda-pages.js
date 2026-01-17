const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function testReadPages() {
    const sourceId = '2eb6b72f-a765-8066-84e6-000b7a37d74e';
    console.log(`Searching for Pages inside DB: ${sourceId}...`);

    try {
        const response = await notion.search({
            filter: {
                value: 'page',
                property: 'object'
            },
            sort: {
                direction: 'descending',
                timestamp: 'last_edited_time'
            }
        });

        const items = response.results.filter(item =>
            item.parent?.type === 'database_id' &&
            item.parent.database_id.replaceAll('-', '') === sourceId.replaceAll('-', '')
        );

        console.log(`\nFound ${items.length} pages in this database.`);

        if (items.length > 0) {
            console.log("✅ ACCESS CONFIRMED! The API can read the agenda items.");
            console.log("Example Item 1:", items[0].properties.Name?.title?.[0]?.plain_text || "Untitled");
            // Check for columns on the ITEM
            console.log("Item Properties Keys:", Object.keys(items[0].properties));

            const hasDate = items[0].properties['Date'];
            const hasDesc = items[0].properties['Description'];
            if (!hasDate) console.log("⚠️ 'Date' property is missing from the item (Schema update needed).");
            if (!hasDesc) console.log("⚠️ 'Description' property is missing from the item (Schema update needed).");

        } else {
            console.log("⚠️ No pages found yet (or access denied to pages).");
            console.log("Try adding a test item to the database manually.");
        }

    } catch (error) {
        console.error("Search/Filter failed:", error.body || error);
    }
}

testReadPages();
