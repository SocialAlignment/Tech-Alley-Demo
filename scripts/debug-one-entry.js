
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

    const { data, error } = await supabase
        .from('demo_raffle_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error fetching entries:', error);
    } else {
        if (data.length > 0) {
            console.log('Latest entry keys:');
            console.log(JSON.stringify(data[0], null, 2));
        } else {
            console.log("No entries found yet.");
        }
    }
}

listEntries();
