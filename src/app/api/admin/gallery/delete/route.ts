import { NextResponse } from 'next/server';

const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_VERSION = '2022-06-28';

export async function POST(request: Request) {
    try {
        const { pageId } = await request.json();

        if (!pageId) {
            return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
        }

        if (!NOTION_KEY) {
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        // Archive the page in Notion (Soft Delete)
        const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${NOTION_KEY}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                archived: true
            })
        });

        if (!res.ok) {
            const error = await res.text();
            console.error("Notion Archive Error:", error);
            return NextResponse.json({ error: "Failed to delete from Notion" }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Admin Gallery Delete Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
