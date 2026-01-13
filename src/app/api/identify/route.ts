import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(request: Request) {
    try {
        const { leadId } = await request.json();

        if (!leadId) {
            return NextResponse.json({ error: 'Missing Lead ID' }, { status: 400 });
        }

        // Retrieve Page Properties from Notion
        // We use notion.pages.retrieve
        const page = await notion.pages.retrieve({ page_id: leadId });

        if (!page) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        // Extract useful context (safely)
        // Note: Type assertions are tricky with the generic Notion API response, so we do basic checks
        const props = (page as any).properties;

        // Extract Name (Title)
        const name = props.Name?.title?.[0]?.plain_text || 'Guest';
        const company = props.Company?.rich_text?.[0]?.plain_text || '';

        return NextResponse.json({
            success: true,
            data: { name, company }
        });

    } catch (error) {
        console.error('Identity Fetch Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to identify lead' },
            { status: 500 }
        );
    }
}
