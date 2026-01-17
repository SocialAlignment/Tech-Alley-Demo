const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function searchForSource() {
    const sourceId = '2eb6b72f-a765-8066-84e6-000b7a37d74e'; // The source ID from previous logs
    console.log(`Searching specifically for Source DB ID: ${sourceId}...`);

    try {
        // 1. Try direct retrieve again 
        try {
            const direct = await notion.databases.retrieve({ database_id: sourceId });
            console.log("✅ FOUND DIRECTLY! (This contradicts previous 404)");
            console.log("Title:", direct.title?.[0]?.plain_text);

            // If found, update it right here!
            await updateDB(sourceId);
            return;
        } catch (e) {
            console.log("❌ Direct retrieve failed (Expected 404):", e.code);
        }

        // 2. Search using correct legacy filter or 'page'/'database' depending on API version
        // The previous error said 'page' or 'data_source'. 'data_source' often usually means database.
        const response = await notion.search({
            // filter argument is optional. If removed, it searches everything. Maybe safest.
            // But let's try 'page' just to see if it shows up as a page container, or omit filter to be broad.
            query: 'Run of Show',
            page_size: 100
        });

        console.log(`\nFound ${response.results.length} results for 'Run of Show':`);
        let found = false;
        response.results.forEach(item => {
            const title = item.title?.[0]?.plain_text || item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
            const id = item.id.replaceAll('-', '');
            const target = sourceId.replaceAll('-', '');

            console.log(`- [${item.object}] ${title} (${item.id})`);

            if (id === target) {
                console.log("⭐️ MATCH FOUND IN SEARCH!");
                found = true;
            }
        });

        if (found) {
            console.log("\n✅ The Source Database WAS found in search (even if retrieve failed?). Attempting update...");
            await updateDB(sourceId);
        } else {
            console.log("\n❌ CRITICAL: The Source Database is NOT visible to the integration.");
            console.log("Only the Linked View is visible.");
        }

    } catch (error) {
        console.error("Search failed:", error);
    }
}

async function updateDB(id) {
    try {
        console.log("Attempting schema update...");
        const response = await notion.databases.update({
            database_id: id,
            properties: {
                "Date": { date: {} },
                "Description": { rich_text: {} }
            }
        });
        console.log("✅ SUCCESS! Columns added to Source DB.");
    } catch (e) {
        console.error("❌ Update failed:", e.body || e);
    }
}

searchForSource();
