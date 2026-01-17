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
const databaseId = '2eb6b72f-a765-8031-af1e-efc71474eb63';

async function verifyDB() {
    console.log(`Fetching database schema for ID: ${databaseId}...`);
    try {
        const response = await notion.databases.retrieve({
            database_id: databaseId
        });

        console.log("Full Database Response:", JSON.stringify(response, null, 2));

        // Safety check BEFORE accessing properties
        if (!response.properties) {
            console.error("❌ CRITICAL: 'properties' field is missing from the response!");
            process.exit(1);
        }

        console.log("Existing Properties:");

        const props = Object.keys(response.properties);
        if (props.length === 0) {
            console.log("  (No properties found)");
        } else {
            props.forEach(propName => {
                const prop = response.properties[propName];
                console.log(`  - "${propName}" (Type: ${prop.type})`);
            });
        }

        // Check specifically for our expected columns
        const hasDate = props.includes('Date');
        const hasDesc = props.includes('Description');

        if (hasDate && hasDesc) {
            console.log("\n✅ VERIFIED: Both 'Date' and 'Description' columns exist in the database.");
        } else {
            console.log("\n❌ MISSING COLUMNS: One or more columns are missing.");
            if (!hasDate) console.log("   - Missing 'Date'");
            if (!hasDesc) console.log("   - Missing 'Description'");
        }

    } catch (error) {
        console.error("❌ Error retrieving database:", error.body || error);
        process.exit(1);
    }
}

verifyDB();
