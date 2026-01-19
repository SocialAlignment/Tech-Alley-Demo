
import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const EVENTS_DB_ID = '2eb6b72f-a765-8137-a249-e09442a38221';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("Admin API: Fetching Pending Events");

        // Use Native Fetch
        const url = `https://api.notion.com/v1/databases/${EVENTS_DB_ID}/query`;
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Status',
                    status: {
                        equals: 'Pending Review'
                    }
                },
                sorts: [
                    {
                        property: 'Date',
                        direction: 'ascending'
                    }
                ]
            })
        };

        const res = await fetch(url, options);

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Notion API Error: ${res.status} ${errorText}`);
        }

        const data = await res.json();

        // Map simplified structure for Admin Dashboard
        const events = data.results.map((page: any) => {
            const props = page.properties;
            return {
                id: page.id,
                name: props.Name?.title?.[0]?.plain_text || 'Untitled',
                date: props.Date?.date?.start || 'TBD',
                description: props.Description?.rich_text?.[0]?.plain_text || '',
                link: props.Location?.rich_text?.[0]?.plain_text || '',
                status: props.Status?.status?.name || 'Unknown',
                tags: props.Tags?.multi_select?.map((t: any) => t.name) || []
            };
        });

        return NextResponse.json({ success: true, events });
    } catch (error: any) {
        console.error('[ADMIN_PENDING_EVENTS] Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
