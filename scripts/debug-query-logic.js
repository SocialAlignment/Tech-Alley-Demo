const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// The ID discovered from inspect-event.js
const EVENTS_DB_ID = '2eb6b72f-a765-8137-a249-e09442a38221';

async function testQuery() {
    try {
        console.log(`Querying DB: ${EVENTS_DB_ID}`);
        console.log(`Filter Date On/After: ${new Date().toISOString().split('T')[0]}`);

        const response = await notion.databases.query({
            database_id: EVENTS_DB_ID,
            sorts: [
                {
                    property: 'Date',
                    direction: 'ascending',
                },
            ],
            filter: {
                property: 'Date',
                date: {
                    on_or_after: new Date().toISOString().split('T')[0],
                },
            },
        });

        console.log(`Results: ${response.results.length}`);
        if (response.results.length > 0) {
            console.log("First event found:", response.results[0].properties.Name.title[0].plain_text);
        } else {
            console.log("No events found with these filters.");
            // Try without filter
            console.log("Retrying without date filter...");
            const responseNoFilter = await notion.databases.query({
                database_id: EVENTS_DB_ID,
            });
            console.log(`Results (No Filter): ${responseNoFilter.results.length}`);
        }

    } catch (error) {
        console.error("Query failed:", error.body || error);
    }
}

testQuery();
