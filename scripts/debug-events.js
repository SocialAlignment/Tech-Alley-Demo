const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const EVENTS_DB_ID = '2eb6b72fa7658136a858e1373417c858';

async function debugEvents() {
    try {
        console.log("Querying database:", EVENTS_DB_ID);
        const response = await notion.databases.query({
            database_id: EVENTS_DB_ID,
        });

        console.log("Response results count:", response.results.length);
        if (response.results.length > 0) {
            const result = response.results[0];
            console.log("First item ID:", result.id);
            console.log("Properties keys:", Object.keys(result.properties));
            console.log("Full Properties:", JSON.stringify(result.properties, null, 2));
        } else {
            console.log("No results found. Check if Integration is added to the database.");
        }
    } catch (error) {
        console.error("Error querying database:", error.message);
    }
}

debugEvents();
