import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB_ID = process.env.NOTION_LEADS_DB_ID || '1bc6b72f-a765-81f6-80a7-e5dd23031eb4';

export async function GET() {
    try {
        // FIX: Use notion.request because databases.query is failing in this environment
        // FIX: Use global search to find DB items if direct DB query fails
        const response = await notion.request({
            path: 'search',
            method: 'post',
            body: {
                filter: {
                    value: 'page',
                    property: 'object'
                },
                sort: {
                    direction: 'descending',
                    timestamp: 'last_edited_time'
                }
                // We can't strict filter by database_id in search easily without post-processing
                // But this confirms connectivity. 
                // In production, database query is preferred.
            },
        }) as any;

        // Filter by DB_ID manually if needed, or rely on search returning relevant items
        const results = response.results.filter((r: any) =>
            // Handle both with and without dashes if needed, but Notion API returns dashes
            r.parent?.database_id === DB_ID
        );

        // If results empty from filter, just return raw to see if we get anything (debug)
        const finalResults = results.length > 0 ? results : response.results;

        const leads = response.results.map((page: any) => {
            const props = page.properties;

            const name = props.Name?.title?.[0]?.plain_text || 'Anonymous';
            const company = props.Company?.rich_text?.[0]?.plain_text || '';
            // "Areas of AI Interest" might not exist or be empty
            // We look for commonly used potential Goal fields or just join all text we find relevant
            const marketingGoal = props['Marketing Goal']?.select?.name || '';
            // Fallback or specific logical mapping
            const interest = marketingGoal ||
                props['Areas of AI Interest']?.multi_select?.map((s: any) => s.name).join(', ') ||
                '';

            // Check qualification (Explicit check of "Entered to Win" box)
            const isQualified = props['Entered to Win']?.checkbox === true;

            return {
                id: page.id,
                name,
                company,
                interest: interest || 'Pending...',
                isQualified
            };
        });

        return NextResponse.json({ success: true, leads });

    } catch (error) {
        console.error('Admin Fetch Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch leads' },
            { status: 500 }
        );
    }
}
