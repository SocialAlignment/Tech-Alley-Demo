import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { name, email, company, phone, title, isFirstTime, goalForTonight, goalDetail } = await request.json();

        // Validate Env Vars
        if (!process.env.NOTION_API_KEY) {
            throw new Error('Missing NOTION_API_KEY');
        }
        if (!process.env.NOTION_LEADS_DB_ID) {
            throw new Error('Missing NOTION_LEADS_DB_ID');
        }



        const dbId = process.env.NOTION_LEADS_DB_ID.trim();
        const apiKey = process.env.NOTION_API_KEY.trim();

        // 1. Check for existing lead (Deduplication) - Using native fetch to bypass SDK issues
        const queryRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Email',
                    email: {
                        equals: email,
                    },
                },
            }),
        });

        if (!queryRes.ok) {
            const errText = await queryRes.text();
            throw new Error(`Notion API Error: ${queryRes.status} - ${errText}`);
        }

        const existing = await queryRes.json() as { results: any[] };

        if (existing.results && existing.results.length > 0) {
            console.log('Lead already exists, resuming session.');
            return NextResponse.json({
                success: true,
                leadId: existing.results[0].id,
                message: 'Lead found',
                redirect: '/hub/hello-world'
            });
        }

        // 2. Create new lead - Using native fetch
        const createRes = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                parent: { database_id: dbId },
                properties: {
                    Name: {
                        title: [
                            {
                                text: {
                                    content: name,
                                },
                            },
                        ],
                    },
                    Email: {
                        email: email,
                    },
                    Company: {
                        rich_text: [
                            {
                                text: {
                                    content: company || '',
                                },
                            },
                        ],
                    },
                    Title: {
                        rich_text: [
                            {
                                text: {
                                    content: title || '',
                                },
                            },
                        ],
                    },
                    'First Time Attendee': {
                        checkbox: isFirstTime || false,
                    },
                    // Assuming 'Goal for Tonight' exists as a Rich Text property in Notion
                    'Goal for Tonight': {
                        rich_text: [
                            {
                                text: {
                                    content: goalForTonight || '',
                                },
                            },
                        ],
                    },
                    'Goal Detail': {
                        rich_text: [
                            {
                                text: {
                                    content: goalDetail || '',
                                },
                            },
                        ],
                    },
                    // 'Phone' is optional
                    ...(phone && {
                        Phone: {
                            phone_number: phone,
                        },
                    }),
                    'Lead Source': {
                        select: {
                            name: 'Tech Alley Henderson',
                        },
                    },
                },
            }),
        });

        if (!createRes.ok) {
            const errText = await createRes.text();
            throw new Error(`Notion Create Error: ${createRes.status} - ${errText}`);
        }

        const newLead = await createRes.json() as { id: string };

        return NextResponse.json({ success: true, leadId: newLead.id, redirect: '/hub/hello-world' });
    } catch (error) {
        console.error('Notion Submission Error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
