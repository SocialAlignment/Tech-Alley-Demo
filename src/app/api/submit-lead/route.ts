import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(request: Request) {
    try {
        const { name, email, company, phone } = await request.json();

        if (!process.env.NOTION_LEADS_DB_ID) {
            throw new Error('Missing NOTION_LEADS_DB_ID');
        }

        // 1. Check for existing lead (Deduplication) using raw request since .query is missing
        const existing = await notion.request({
            path: `databases/${process.env.NOTION_LEADS_DB_ID}/query`,
            method: 'post',
            body: {
                filter: {
                    property: 'Email',
                    email: {
                        equals: email,
                    },
                },
            },
        }) as { results: any[] };

        if (existing.results && existing.results.length > 0) {
            console.log('Lead already exists, resuming session.');
            return NextResponse.json({
                success: true,
                leadId: existing.results[0].id,
                message: 'Lead found',
                redirect: '/hub/hello-world'
            });
        }

        // 2. Create new lead
        const newLead = await notion.pages.create({
            parent: { database_id: process.env.NOTION_LEADS_DB_ID },
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
                // 'Phone' is optional, mapping if provided
                ...(phone && {
                    Phone: {
                        phone_number: phone,
                    },
                }),
                'Lead Source': {
                    select: {
                        name: 'Tech Alley Render',
                    },
                },
            },
        });

        return NextResponse.json({ success: true, leadId: newLead.id, redirect: '/hub/hello-world' });
    } catch (error) {
        console.error('Notion Submission Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to submit lead' },
            { status: 500 }
        );
    }
}
