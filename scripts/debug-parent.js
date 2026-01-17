const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function debugParent() {
    const parentId = '1bc6b72f-a765-813f-99d8-d1d231b3c1b8'; // Mainframe BrainMap
    console.log(`Listing ALL children of Parent Page: ${parentId}...`);

    try {
        let cursor = undefined;
        let hasMore = true;
        let allBlocks = [];

        while (hasMore) {
            const response = await notion.blocks.children.list({
                block_id: parentId,
                start_cursor: cursor
            });
            allBlocks.push(...response.results);
            cursor = response.next_cursor;
            hasMore = response.has_more;
            console.log(`fetched batch... total so far: ${allBlocks.length}`);
        }

        console.log(`Total blocks found: ${allBlocks.length}`);

        let targetId = null;

        for (const block of allBlocks) {
            let title = "Untitled";
            let id = block.id;

            if (block.type === 'child_database') {
                title = block.child_database.title;
                // Normalize for comparison
                if (title.toLowerCase().includes("run of show")) {
                    console.log(`🎯 FOUND TARGET DATABASE: [${id}] "${title}"`);
                    targetId = id;
                    break;
                }
            }

            // Log interesting items
            if (block.type === 'child_database') {
                // console.log(`[DB] ${title} (${id})`);
            }
        }

        if (targetId) {
            await updateDB(targetId);
        } else {
            console.log("❌ Could not find a child database named 'Run of Show'.");
        }

    } catch (error) {
        console.error("Error listing children:", error.body || error);
    }
}

async function updateDB(id) {
    console.log(`🚀 Attempting to update database [${id}]...`);
    try {
        const response = await notion.databases.update({
            database_id: id,
            properties: {
                "Date": { date: {} },
                "Description": { rich_text: {} }
            }
        });
        console.log("✅✅✅ SUCCESS! Updated DB: " + response.url);
        console.log("New ID to use in API: " + response.id);
    } catch (e) {
        console.error("❌ Update failed for this ID:", e.body || e);
    }
}

debugParent();
