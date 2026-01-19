import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const rawId = '2eb6b72fa76580088736f7cb6632eb0e';
const CHECKLIST_DB_ID = `${rawId.substring(0, 8)}-${rawId.substring(8, 12)}-${rawId.substring(12, 16)}-${rawId.substring(16, 20)}-${rawId.substring(20)}`;

export async function GET() {
    try {
        console.log('[MIGRATION] Starting Mission Migration (Delete + Insert)...');

        if (!process.env.NOTION_API_KEY) {
            return NextResponse.json({ error: 'Missing NOTION_API_KEY' }, { status: 500 });
        }

        // 1. Fetch from Notion
        const notionRes = await fetch(`https://api.notion.com/v1/databases/${CHECKLIST_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // No sorts, default order
            }),
        });

        if (!notionRes.ok) {
            const err = await notionRes.text();
            throw new Error(`Notion API Error: ${err}`);
        }

        const notionData = await notionRes.json();
        const results = notionData.results || [];

        console.log(`[MIGRATION] Found ${results.length} missions in Notion.`);

        // 2. Map to Supabase Schema
        const missionsToInsert = results.map((page: any) => {
            const props = page.properties;
            return {
                notion_id: page.id,
                title: props.Name?.title?.[0]?.plain_text || 'Untitled Mission',
                description: props.Description?.rich_text?.[0]?.plain_text || '',
                xp: props.XP?.number || 10,
                icon_name: props.IconName?.rich_text?.[0]?.plain_text || 'CheckCircle',
                action_path: props.ActionPath?.rich_text?.[0]?.plain_text || '',
                is_active: true
            };
        });

        // 3. Clear Existing Missions to prevent duplicates
        const { error: deleteError } = await supabaseAdmin
            .from('missions')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (hacky way to say all usually, or just gte id '0')
        // Better: .neq('created_at', '1970-01-01') ? 
        // Supabase delete requires a filter.
        // .gt('xp', -1) work? XP is int.

        if (deleteError) {
            console.error('[MIGRATION] Delete Error:', deleteError);
            // Verify if table exists?
        }

        // 4. Insert Fresh Data
        const { data, error } = await supabaseAdmin
            .from('missions')
            .insert(missionsToInsert)
            .select();

        if (error) {
            console.error('[MIGRATION] Supabase Insert Error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            count: data.length,
            migrated: data
        });

    } catch (error: any) {
        console.error('[MIGRATION] Critical Error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
