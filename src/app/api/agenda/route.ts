import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const AGENDA_DB_ID = '2eb6b72f-a765-8066-84e6-000b7a37d74e';

export async function GET() {
    try {
        console.log('[AGENDA_API] Fetching agenda items...');

        // Use search because direct DB query can be flaky in some envs
        const response = await notion.search({
            filter: {
                value: 'page',
                property: 'object'
            },
            sort: {
                direction: 'descending',
                timestamp: 'last_edited_time'
            }
        });

        // Filter for our specific database items
        const rawItems = response.results.filter((item: any) => {
            if (item.parent?.type === 'database_id') {
                return item.parent.database_id.replaceAll('-', '') === AGENDA_DB_ID.replaceAll('-', '');
            }
            if (item.parent?.type === 'data_source_id') {
                // Check both source and view ID to be safe
                const p = item.parent;
                const target = AGENDA_DB_ID.replaceAll('-', '');
                return (p.data_source_id?.replaceAll('-', '') === target) ||
                    (p.database_id?.replaceAll('-', '') === target);
            }
            return false;
        });

        console.log(`[AGENDA_API] Found ${rawItems.length} items in DB`);

        const agendaItems = rawItems
            .map((page: any) => {
                const props = page.properties;

                // Extract Name
                const eventName = props.Name?.title?.[0]?.plain_text || 'Untitled Event';

                // Extract Description
                const description = props.Description?.rich_text?.[0]?.plain_text || '';

                // Extract Date/Time
                const dateStr = props.Date?.date?.start || props['Event Date']?.date?.start;
                let timeStr = 'TBD';
                let sortTime = 0;

                if (dateStr) {
                    const dateObj = new Date(dateStr);
                    // Convert to "6:00 PM" format
                    timeStr = dateObj.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'America/Los_Angeles' // Enforce Vegas time
                    });
                    sortTime = dateObj.getTime();
                }

                return {
                    id: page.id,
                    event: eventName,
                    desc: description,
                    time: timeStr,
                    sortTime
                };
            })
            // Filter for valid dates (optional, or maybe we want everything)
            // For now, let's just sort by time ascending
            .sort((a, b) => a.sortTime - b.sortTime);

        console.log(`[AGENDA_API] Returning ${agendaItems.length} processed agenda items`);

        return NextResponse.json({
            success: true,
            agenda: agendaItems.map(({ sortTime, ...item }) => item) // Remove sortTime from output
        });

    } catch (error) {
        console.error('[AGENDA_API] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch agenda' },
            { status: 500 }
        );
    }
}
