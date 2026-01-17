import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const apiKey = process.env.NOTION_API_KEY;
        const databaseId = '1bc6b72f-a765-81f6-80a7-e5dd23031eb4'; // Leads Database ID

        if (!apiKey || !databaseId) {
            throw new Error('Missing Notion Configuration');
        }

        // Query 1: Winners (First 5 to complete)
        const winnersQuery = fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page_size: 5,
                sorts: [
                    { property: 'MissionComplete', direction: 'ascending' },
                ],
                filter: {
                    property: 'MissionComplete',
                    date: { is_not_empty: true }
                }
            })
        });

        // Query 2: Leaders (Top 10 by Progress)
        const leadersQuery = fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page_size: 10,
                sorts: [
                    { property: 'MissionProgress', direction: 'descending' },
                ],
                filter: {
                    property: 'MissionProgress',
                    number: { is_not_empty: true }
                }
            })
        });

        const [winnersRes, leadersRes] = await Promise.all([winnersQuery, leadersQuery]);

        if (!winnersRes.ok || !leadersRes.ok) {
            throw new Error(`Notion API Error: Winners=${winnersRes.status} Leaders=${leadersRes.status}`);
        }

        const [winnersData, leadersData] = await Promise.all([winnersRes.json(), leadersRes.json()]);

        // Helper to map Notion page to Leader object
        const mapPageToLeader = (page: any) => {
            const props = page.properties;
            const name = props.Name?.title?.[0]?.plain_text || 'Anonymous';
            const company = props.Company?.rich_text?.[0]?.plain_text || '';
            const score = props.MissionProgress?.number || 0;
            const completedAt = props.MissionComplete?.date?.start || null;

            // Avatar extraction
            const profileFiles = props['Profile Image']?.files || [];
            const avatar = profileFiles.length > 0
                ? (profileFiles[0].file?.url || profileFiles[0].external?.url || '')
                : '';

            return {
                id: page.id,
                name,
                company,
                score,
                completedAt,
                avatar
            };
        };

        const winners = winnersData.results.map(mapPageToLeader);
        const leaders = leadersData.results.map(mapPageToLeader);

        return NextResponse.json({ success: true, winners, leaders });

    } catch (error: any) {
        console.error('Leaderboard Fetch Error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
