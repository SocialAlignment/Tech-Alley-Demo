import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
    try {
        const { pageId, company, title, website, phone, industry, role, employeeCount, decisionMaker, isFirstTime, goalForTonight, vision } = await request.json();

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
                    'Job Title': { rich_text: [{ text: { content: title || '' } }] },
                    Website: { url: website || null },
                    Phone: { phone_number: phone || null },
                    Industry: { select: { name: industry || 'Other' } },
                    'What Best Describes You?': { select: { name: role || 'Just Curious' } },
                    'Employee Count': { select: { name: employeeCount || '1-10' } },
                    'Decision Maker': { select: { name: decisionMaker || 'Sole' } }, // Defaulting if empty, but form enforces it

                    'First Time TAH?': { select: { name: isFirstTime ? "Yes this is my first time!" : "No I've attended before." } },
                    'Intentional Action': { rich_text: [{ text: { content: goalForTonight || '' } }] },
                    '3Month Success Vision': { rich_text: [{ text: { content: vision || '' } }] },
                    'Onboarding Form Done': { checkbox: true }
                }
            })
        });

        if (!updateRes.ok) {
            const err = await updateRes.text();
            throw new Error(err);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Update Error:', error);
        console.error('Update Error Body:', error?.body || 'No body');
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
