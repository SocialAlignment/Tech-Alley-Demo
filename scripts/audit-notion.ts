import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const notion = new Client({ auth: process.env.NOTION_API_KEY });
// Found from previous run's data_sources field
// Use env var instead of hardcoded ID
const DB_ID = process.env.NOTION_LEADS_DB_ID;

async function auditSchema() {
    if (!DB_ID) {
        console.error('Error: NOTION_LEADS_DB_ID not found in .env.local');
        return;
    }

    console.log(`Auditing Database: ${DB_ID}...\n`);

    try {
        // Use SEARCH instead of RETRIEVE because Retrieve on a Linked View might empty properties
        // but Search seems to return them (based on previous logs).
        // Search broadly then filter manually
        console.log("Searching for 'Leads - Database 2.0'...");
        const searchRes = await notion.search({
            query: 'Leads - Database 2.0',
            sort: { direction: 'descending', timestamp: 'last_edited_time' }
        });

        // Find the first result that has properties
        const db = searchRes.results.find((r: any) => r.properties && Object.keys(r.properties).length > 0) as any;

        if (!db) {
            throw new Error("Database not found via search.");
        }

        console.log(`Found Database: ${db.id}`);
        // console.log("Full Response:", JSON.stringify(db, null, 2));

        if (!db.properties) {
            throw new Error("No properties found in search result.");
        }

        const properties = Object.entries(db.properties);

        // Log ALL properties to find the "missing" ones
        console.log('\n--- FULL PROPERTY LIST ---');
        properties.forEach(([name, prop]: [string, any]) => {
            console.log(`Property: "${name}" (Type: ${prop.type})`);
            if (prop.type === 'select' && prop.select && prop.select.options) {
                console.log(`  Options: ${prop.select.options.map((o: any) => o.name).join(', ')}`);
            }
        });
        console.log('--------------------------');

    } catch (error) {
        console.error("Notion API Error:", error);
    }
}

auditSchema();
