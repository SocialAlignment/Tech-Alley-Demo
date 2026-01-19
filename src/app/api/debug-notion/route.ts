
import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const EVENTS_DB_ID = '2eb6b72f-a765-8137-a249-e09442a38221';

export const dynamic = 'force-dynamic';

export async function GET() {
    const debugData: any = {
        logs: [],
        dbId: EVENTS_DB_ID,
        apiKeyStart: process.env.NOTION_API_KEY ? process.env.NOTION_API_KEY.substring(0, 4) + '...' : 'MISSING'
    };

    const log = (msg: string, data?: any) => {
        debugData.logs.push({ msg, data });
        console.log(msg, data);
    };

    try {
        log("DEBUG: Inspeting Notion DB from API Route");

        // 1. Inspect DB Metadata (properties)
        try {
            const dbResponse = await notion.databases.retrieve({ database_id: EVENTS_DB_ID });
            log("DEBUG: DB Retrieve Success", {
                id: dbResponse.id,
                // @ts-ignore
                title: dbResponse.title?.[0]?.plain_text
            });

            // @ts-ignore
            if (dbResponse.properties) {
                // @ts-ignore
                const propKeys = Object.keys(dbResponse.properties);
                log("DEBUG: DB Properties Keys", propKeys);

                // Detailed Schema for critical fields
                log("DEBUG: Schema Details", {
                    // @ts-ignore
                    Status: dbResponse.properties['Status'],
                    // @ts-ignore
                    Date: dbResponse.properties['Date'],
                    // @ts-ignore
                    Tags: dbResponse.properties['Tags']
                });
            }
        } catch (e: any) {
            log("DEBUG: DB Retrieve Failed", e.message);
            debugData.dbError = e;
        }

        // 2. Query items (no filter to see what's there) using Native Fetch
        const url = `https://api.notion.com/v1/databases/${EVENTS_DB_ID}/query`;
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page_size: 5 // Get a few to see patterns
            })
        };

        log("DEBUG: Fetching with native fetch", url);
        const res = await fetch(url, options);

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Fetch failed: ${res.status} ${txt}`);
        }

        const queryResponse = await res.json();

        log("DEBUG: Query Success. Results count:", queryResponse.results.length);

        const rows = queryResponse.results.map((page: any) => {
            return {
                id: page.id,
                created_time: page.created_time,
                properties: {
                    Name: page.properties.Name?.title?.[0]?.plain_text,
                    Date: page.properties.Date?.date,
                    Status: page.properties.Status?.status || page.properties.Status?.select,
                    Tags: page.properties.Tags?.multi_select || page.properties.Tags?.select
                }
            };
        });

        debugData.rows = rows;

        return NextResponse.json(debugData);
    } catch (error) {
        log("DEBUG: Overall Error", error);
        return NextResponse.json({ ...debugData, error: String(error) }, { status: 500 });
    }
}
