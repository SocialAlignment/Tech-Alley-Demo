import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Query 1: Winners (First 5 to complete)
        // Logic: mission_progress = 100 (or check mission_completed_at), sorted by time
        const { data: winnersData, error: winnersError } = await supabase
            .from('leads')
            .select('id, name, company, avatar, mission_progress, mission_completed_at')
            .eq('mission_progress', 100)
            .not('mission_completed_at', 'is', null) // Ensure timestamp exists
            .order('mission_completed_at', { ascending: true })
            .limit(5);

        if (winnersError) throw winnersError;

        // Query 2: Leaders (Top 10 by Progress)
        // Logic: active progress, sorted by highest score
        const { data: leadersData, error: leadersError } = await supabase
            .from('leads')
            .select('id, name, company, avatar, mission_progress, mission_completed_at')
            .gt('mission_progress', 0)
            .order('mission_progress', { ascending: false })
            .limit(10);

        if (leadersError) throw leadersError;

        // Helper to map Supabase row to Leader object
        const mapRowToLeader = (row: any) => ({
            id: row.id,
            name: row.name || 'Anonymous',
            company: row.company || '',
            score: row.mission_progress || 0,
            completedAt: row.mission_completed_at || null,
            avatar: row.avatar || ''
        });

        const winners = (winnersData || []).map(mapRowToLeader);
        const leaders = (leadersData || []).map(mapRowToLeader);

        return NextResponse.json({ success: true, winners, leaders });

    } catch (error: any) {
        console.error('Leaderboard Fetch Error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
