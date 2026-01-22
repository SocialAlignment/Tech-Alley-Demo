
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
        .limit(25);

    if (error) {
        console.error('Error fetching entries:', error);
    } else {
        console.log(`Found ${data.length} entries.`);
        const withResponses = data.filter(e => e.responses && Object.keys(e.responses).length > 0);
        console.log(`Found ${withResponses.length} entries with responses.`);

        if (withResponses.length > 0) {
            console.log("Example responses keys:");
            console.log(JSON.stringify(withResponses[0].responses, null, 2));
            console.log("Example responses:");
            console.log(JSON.stringify(withResponses[0], null, 2));
        } else {
            console.log("No entries with responses found.");
            // Print one raw entry just in case it's in profile_data
            if (data.length > 0) {
                console.log("Random entry profile_data:");
                console.log(JSON.stringify(data[0].profile_data, null, 2));
            }
        }
    }
}

listEntries();
