import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "../[...nextauth]/route";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Not authenticated", redirect: '/login' }, { status: 401 });
    }

    const { email, name } = session.user;

    // Notion Logic
    const dbId = process.env.NOTION_LEADS_DB_ID?.trim();
    const apiKey = process.env.NOTION_API_KEY?.trim();

    if (!dbId || !apiKey) {
        return NextResponse.json({ error: "Configuration missing" }, { status: 500 });
    }

    try {
        // 1. Check for existing lead
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

        if (!queryRes.ok) throw new Error("Failed to query Notion");
        const existing = await queryRes.json() as { results: any[] };


        if (existing.results && existing.results.length > 0) {
            const leadId = existing.results[0].id;
            return NextResponse.json({
                success: true,
                redirect: `/hub?id=${leadId}`,
                isNewUser: false
            });
        }

        // 2. Create New Lead if not found
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
                        title: [{ text: { content: name || 'Google User' } }],
                    },
                    Email: {
                        email: email,
                    },
                    'Lead Source': {
                        select: { name: 'Tech Alley Henderson' },
                    },
                    'Google Oauth': {
                        checkbox: true,
                    },
                    'Lead Status': {
                        status: { name: 'Engaged' },
                    },
                    'Registered Events': {
                        relation: [{ id: '2d56b72f-a765-80b9-bf33-cee0e586594c' }]
                    },
                },
            }),
        });

        if (!createRes.ok) {
            const err = await createRes.text();
            console.error('Notion Create Error:', err);
            throw new Error("Failed to create Notion Page");
        }

        const newLead = await createRes.json() as { id: string };
        const newId = newLead.id;

        return NextResponse.json({
            success: true,
            redirect: `/onboarding?id=${newId}`,
            isNewUser: true
        });

    } catch (e) {
        console.error("Auth Sync Error:", e);
        return NextResponse.json({ error: "Sync failed", details: String(e) }, { status: 500 });
    }
}
