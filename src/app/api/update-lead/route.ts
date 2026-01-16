import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
    try {
        const { pageId, company, title, isFirstTime, goalForTonight, goalDetail } = await request.json();

        if (!pageId) return NextResponse.json({ error: 'Missing pageId' }, { status: 400 });

        const apiKey = process.env.NOTION_API_KEY;
        if (!apiKey) throw new Error('Missing Config');

        const updateRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                properties: {
                    Company: { rich_text: [{ text: { content: company || '' } }] },
                    Title: { rich_text: [{ text: { content: title || '' } }] },
                    'First Time Attendee': { checkbox: isFirstTime },
                    'Goal for Tonight': { rich_text: [{ text: { content: goalForTonight || '' } }] },
                    'Goal Detail': { rich_text: [{ text: { content: goalDetail || '' } }] }
                }
            })
        });

        if (!updateRes.ok) {
            const err = await updateRes.text();
            throw new Error(err);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
