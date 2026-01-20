
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Initialize Clients
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const notionApiKey = process.env.NOTION_API_KEY;
        const photoDbId = process.env.NOTION_PHOTOBOOTH_DB_ID || '2eb6b72f-a765-81ca-91d7-fca18180af7c';
        const leadsDbId = process.env.NOTION_LEADS_DB_ID;

        // 2. Define Fetchers

        // A. Total Users + Recent Feed (Supabase: leads table)
        const fetchUsersAndFeed = async () => {
            // Count total users
            const { count, error: countError } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true });

            if (countError) console.error("User Count Error", countError);

            // Fetch recent 5 for feed
            const { data: recentLeads, error: feedError } = await supabase
                .from('leads')
                .select('id, name, email, role, company, created_at')
                .order('created_at', { ascending: false })
                .limit(5);

            if (feedError) console.error("Feed Error", feedError);

            const recent = recentLeads ? recentLeads.map((lead: any) => ({
                id: lead.id,
                name: lead.name || 'Anonymous',
                email: lead.email || 'No Email',
                role: lead.role || 'Attendee',
                company: lead.company || 'Independent'
            })) : [];

            return { count: count || 0, recent };
        };

        // B. Photo Uploads (Notion: Photo DB Count)
        const fetchPhotos = async () => {
            if (!notionApiKey || !photoDbId) return 0;
            // Fire and forget catch internally
            try {
                const res = await fetch(`https://api.notion.com/v1/databases/${photoDbId}/query`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${notionApiKey}`,
                        'Notion-Version': '2022-06-28',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ page_size: 100 })
                });
                const data = await res.json();
                return data.results ? data.results.length : 0;
            } catch (e) {
                console.error("Photo Fetch Error", e);
                return 0;
            }
        };

        // C. Grant Applications (Supabase: grant_applications)
        const fetchGrantApps = async () => {
            const { count, error } = await supabase
                .from('grant_applications')
                .select('*', { count: 'exact', head: true });
            if (error) {
                console.error("Grant Count Error", error);
                return 0;
            }
            return count || 0;
        };

        // D. MRI Submissions (Notion)
        // Keeping this for now as requested, or until migrated
        const fetchMRI = async () => {
            if (!notionApiKey || !leadsDbId) return 0;
            try {
                const res = await fetch(`https://api.notion.com/v1/databases/${leadsDbId}/query`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${notionApiKey}`,
                        'Notion-Version': '2022-06-28',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        filter: {
                            property: 'Hometown',
                            rich_text: { is_not_empty: true }
                        },
                        page_size: 100
                    })
                });
                const data = await res.json();
                return data.results ? data.results.length : 0;
            } catch (e) {
                console.error("MRI Fetch Error", e);
                return 0;
            }
        };

        // E. Raffle Entries (Supabase: demo_raffle_entries) - Qualified Leads
        const fetchRaffleEntries = async () => {
            const { data, error } = await supabase
                .from('demo_raffle_entries')
                .select('*')
                .order('score', { ascending: false }); // Show highest scores first

            if (error) {
                console.error("Raffle Count Error", error);
                return { registrantCount: 0, raffleEntries: 0, entries: [], error };
            }

            // Sum up all entries_count values
            const registrantCount = (data || []).length
            const raffleEntries = ((data as any[]) || []).reduce((sum, entry) => sum + (entry.entries_count || 0), 0)

            return { registrantCount, raffleEntries, entries: data || [] };
        };


        // 3. Execute Parallel
        const [userData, photos, grants, mris, raffleData] = await Promise.all([
            fetchUsersAndFeed(),
            fetchPhotos(),
            fetchGrantApps(),
            fetchMRI(),
            fetchRaffleEntries()
        ]);

        return NextResponse.json({
            stats: {
                totalUsers: userData.count,
                photoUploads: photos,
                questions: 0,
                raffleEntries: raffleData.raffleEntries,
                registrantCount: raffleData.registrantCount,
                forms: {
                    grant: grants,
                    mri: mris,
                    genai: raffleData.registrantCount
                }
            },
            recentLeads: userData.recent,
            qualifiedLeads: raffleData.entries, // Send full list to frontend
        });

    } catch (e: any) {
        console.error("Admin Stats Error", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
