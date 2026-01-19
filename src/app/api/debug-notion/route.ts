
import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const EVENTS_DB_ID = '2eb6b72f-a765-8137-a249-e09442a38221';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("DEBUG: Inspeting Notion DB from API Route");

        // 1. Inspect DB Metadata (properties)
        // Retrieve might not work as seen before, but let's try safely
        try {
            const dbResponse = await notion.databases.retrieve({ database_id: EVENTS_DB_ID });
            console.log("DEBUG: DB Retrieve Properties Key Exists?", 'properties' in dbResponse);
            // @ts-ignore
            if (dbResponse.properties) {
                console.log("DEBUG: DB Properties:", JSON.stringify(Object.keys(dbResponse.properties), null, 2));
                // Check Status specifically
                // @ts-ignore
                console.log("DEBUG: Status Prop:", JSON.stringify(dbResponse.properties['Status'], null, 2));
            }
        } catch (e) {
            console.error("DEBUG: DB Retrieve Failed", e);
        }

        // 2. Query one item to see row properties
        const queryResponse = await notion.databases.query({
            database_id: EVENTS_DB_ID,
            page_size: 1
        });
        console.log("DEBUG: Query Success. Results count:", queryResponse.results.length);

        if (queryResponse.results.length > 0) {
            const page = queryResponse.results[0];
            // @ts-ignore
            if (page.properties) {
                console.log("DEBUG: Row Properties Keys:", JSON.stringify(Object.keys(page.properties), null, 2));
                // Check 'Status' value on the row
                // @ts-ignore
                console.log("DEBUG: Row 'Status' Value:", JSON.stringify(page.properties['Status'], null, 2));
            }
        }

        return NextResponse.json({ status: 'Debug logs printed to console' });
    } catch (error) {
        console.error("DEBUG: Overall Error", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
