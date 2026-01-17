const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

if (!process.env.NOTION_API_KEY) {
    console.error('Error: NOTION_API_KEY not found in .env.local');
    process.exit(1);
}

const notion = new Client({ auth: process.env.NOTION_API_KEY });
// This is the Link/Source ID found in the debugging step
const realDatabaseId = '2eb6b72f-a765-8066-84e6-000b7a37d74e';

async function updateDB() {
    console.log(`Force updating SOURCE database schema for ID: ${realDatabaseId}...`);
    try {
        const response = await notion.databases.update({
            database_id: realDatabaseId,
            properties: {
                "Date": {
                    date: {}
                },
                "Description": {
                    rich_text: {}
                },
                // Re-asserting Name just in case
                "Name": {
                    title: {}
                }
            }
        });

        if (response.properties) {
            console.log("Properties returned:", Object.keys(response.properties));
            const hasDate = response.properties['Date'];
            const hasDesc = response.properties['Description'];

            if (hasDate && hasDesc) {
                console.log("✅ SUCCESS: API returned the new columns!");
                console.log("You can now refresh Notion to see 'Date' and 'Description'.");
            } else {
                console.log("⚠️ WARNING: API returned properties but MISSING the new ones (Race condition?).");
            }
        } else {
            console.error("❌ ERROR: API result missing 'properties' key even on Source DB.");
            console.log("Full Response:", JSON.stringify(response, null, 2));
        }

        console.log("Database URL:", response.url);
    } catch (error) {
        console.error("❌ Error updating database:", error.body || error);
        process.exit(1);
    }
}

updateDB();
