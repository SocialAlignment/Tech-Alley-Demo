import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const EVENTS_DB_ID = '2eb6b72f-a765-8137-a249-e09442a38221'; // Correct Child Database ID found inside the user's page

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log("API: /api/events hit");
    console.log(`API: Key starts with: ${process.env.NOTION_API_KEY ? process.env.NOTION_API_KEY.substring(0, 4) + '...' : 'UNDEFINED'}`);
    console.log(`API: Target DB ID: ${EVENTS_DB_ID}`);

    try {
        // Use Native Fetch to bypass broken Notion Client 'databases.query' method
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
                    property: 'Date',
                    date: {
                        on_or_after: new Date().toISOString().split('T')[0]
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
            console.error('[EVENTS_API] Fetch Error:', res.status, errorText);
            throw new Error(`Notion API Error: ${res.status} ${errorText}`);
        }

        const data = await res.json();
        const events = data.results.map((page: any) => {
            const props = page.properties;

            // Name
            const eventName = props.Name?.title?.[0]?.plain_text || 'Untitled Event';

            // Date
            const dateProp = props.Date?.date;
            const dateStart = dateProp?.start || null;

            // Time string
            let timeStr = 'TBD';
            if (dateStart && dateStart.includes('T')) {
                timeStr = new Date(dateStart).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
            }

            // Location
            const locationPlace = props.Location?.rich_text?.[0]?.plain_text || 'Tech Alley Henderson';

            // Description
            const description = props.Description?.rich_text?.[0]?.plain_text || '';

            // Presenter
            const presenterList = props['Presented By']?.multi_select || [];
            const presenter = presenterList.map((p: any) => p.name).join(', ') || 'Tech Alley';

            // Tag (Heading)
            const tagObj = props.Tags?.select;
            const tagName = tagObj?.name || 'Event';
            const primaryTag = tagName.split(' ')[0];

            // Image
            let imageUrl = '';
            if (props['Event Image']?.files?.length > 0) {
                const file = props['Event Image'].files[0];
                imageUrl = file.file?.url || file.external?.url || '';
            }

            return {
                id: page.id,
                heading: primaryTag,
                eventName: eventName,
                description: description,
                date: dateStart,
                time: timeStr,
                location: presenter ? `Presented By: ${presenter}` : locationPlace,
                imageUrl: imageUrl,
                imageAlt: eventName,
                actionLabel: "Add to Calendar"
            };
        });

        console.log(`API: Found ${events.length} events via Native Fetch.`);
        return NextResponse.json({ success: true, events });
    } catch (error: any) {
        console.error('[EVENTS_API] Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch events',
                details: error.message,
                code: error.code || 'UNKNOWN_ERROR',
                status: error.status || 500
            },
            { status: 500 }
        );
    }
}
