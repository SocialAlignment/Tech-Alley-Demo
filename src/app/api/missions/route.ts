import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Disable caching for now to see updates immediately

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('missions')
            .select('*')
            // .eq('is_active', true)
            .order('xp', { ascending: true });

        if (error) {
            console.error('[MISSIONS_API] Supabase Error:', error);
            // Fallback to empty list or error
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Map Supabase columns to Frontend expected format (PascalCase)
        // Note: Notion properties were: Name, Description, XP, IconName (capitalized), ActionPath
        // Our new DB tables are lowercase snake_case.

        const mappedMissions = (data || []).map((m: any) => ({
            id: m.id,
            Name: m.title,
            Description: m.description,
            XP: m.xp,
            IconName: m.icon_name,
            ActionPath: m.action_path || '',
            // Notion API returned 'Status', we can omit or keep 'Active'
            Status: 'Active'
        }));

        return NextResponse.json(mappedMissions);

    } catch (error: any) {
        console.error('[MISSIONS_API] Critical Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
