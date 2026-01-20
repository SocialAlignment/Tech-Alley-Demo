
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listEntries() {
    console.log('Querying table: demo_raffle_entries...');
    console.log(`URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);

    const { data, error } = await supabase
        .from('demo_raffle_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching entries:', error);
    } else {
        console.log(`Found ${data.length} entries.`);
        if (data.length > 0) {
            console.log('Latest entries:');
            console.table(data.map(e => ({
                id: e.id,
                name: e.name,
                email: e.email,
                social: e.social_handle,
                first_time: e.is_first_time
            })));
        } else {
            console.log("No entries found yet.");
        }
    }
}

listEntries();
