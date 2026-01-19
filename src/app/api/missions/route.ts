import { NextResponse } from 'next/server';

// Properly formatted UUID (8-4-4-4-12) based on user input '2eb6b72fa76580088736f7cb6632eb0e'
const rawId = '2eb6b72fa76580088736f7cb6632eb0e';
const CHECKLIST_DB_ID = `${rawId.substring(0, 8)}-${rawId.substring(8, 12)}-${rawId.substring(12, 16)}-${rawId.substring(16, 20)}-${rawId.substring(20)}`;

export async function GET() {
    try {
        console.log('[MISSIONS_API] Fetching mission items via Direct Fetch from DB:', CHECKLIST_DB_ID);

        if (!process.env.NOTION_API_KEY) {
            console.error('[MISSIONS_API] NOTION_API_KEY is missing');
            return NextResponse.json({ error: 'Server Authorization Error' }, { status: 500 });
        }

        const response = await fetch(`https://api.notion.com/v1/databases/${CHECKLIST_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
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
                        direction: 'ascending',
                    },
                ],
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[MISSIONS_API] Notion API Error:', response.status, errorText);
            return NextResponse.json({ error: 'Failed to fetch missions from Notion' }, { status: response.status });
        }

        const data = await response.json();
        const results = data.results || [];
        console.log(`[MISSIONS_API] Found ${results.length} active missions.`);

        const missions = results.map((page: any) => {
            const props = page.properties;

            // Extract Icon Name from File Name (heuristic) or use default
            let iconName = 'CheckCircle';
            // Check if Icon matches "files" type and has content
            if (props.Icon?.files?.length > 0) {
                const fileName = props.Icon.files[0].name; // e.g., "Youtube.png"
                if (fileName) {
                    // Remove extension and capitalize first letter if needed
                    const namePart = fileName.split('.')[0];
                    // Simple sanitization to match Lucide names (CamelCase)
                    // e.g. "youtube" -> "Youtube", "camera" -> "Camera"
                    iconName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

                    // Handle spaces if any (e.g. "Mission Icon" -> "MissionIcon")
                    iconName = iconName.replace(/\s+/g, '');
                }
            } else if (props.IconName?.rich_text?.[0]) {
                // Fallback to "IconName" text property if it exists (legacy/alternative)
                iconName = props.IconName.rich_text[0].plain_text;
            }

            return {
                id: page.id,
                Name: props.Mission?.title?.[0]?.plain_text || 'Untitled Mission',
                Description: props.Description?.rich_text?.[0]?.plain_text || '',
                XP: props.Points?.number || 10,
                ActionPath: '', // No property for this in schema yet; default empty
                IconName: iconName,
                Order: props.Order?.number || 999, // Push null orders to end
                Status: 'Active'
            };
        });

        return NextResponse.json(missions);

    } catch (error) {
        console.error('[MISSIONS_API] Internal Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
