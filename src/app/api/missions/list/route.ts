import { NextResponse } from 'next/server';

const MISSIONS_DB_ID = '2eb6b72fa76580088736f7cb6632eb0e';
const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_VERSION = '2022-06-28';

export async function GET() {
    if (!NOTION_KEY) {
        return NextResponse.json({ error: 'Missing Config' }, { status: 500 });
    }

    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${MISSIONS_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_KEY}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Active',
                    checkbox: {
                        equals: true
                    }
                },
                sorts: [
                    {
                        property: 'Order',
                        direction: 'ascending'
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Notion API Error:', errorText);
            throw new Error(`Notion API Error: ${response.status}`);
        }

        const data = await response.json();

        const missions = data.results.map((page: any) => {
            const props = page.properties;
            return {
                id: page.id,
                text: props.Mission?.title?.[0]?.plain_text || 'Untitled Mission',
                points: props.Points?.number || 0,
                description: props.Description?.rich_text?.[0]?.plain_text || '',
                // If Order is missing for some reason, default to a high number
                order: props.Order?.number || 999
            };
        });

        return NextResponse.json({ success: true, missions });

    } catch (error: any) {
        console.error('Missions Fetch Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
