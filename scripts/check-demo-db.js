
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndCreate() {
    console.log('Checking for table: demo_raffle_entries...');

    // Try to select from the table
    const { error } = await supabase.from('demo_raffle_entries').select('count', { count: 'exact', head: true });

    if (error && error.code === '42P01') { // undefined_table
        console.log('Table demo_raffle_entries does not exist. Creating it...');

        // We cannot create tables via JS client unless we use RPC or just raw SQL via a dashboard. 
        // However, if we don't have SQL editor access, we might be stuck.
        // BUT we can use the "rpc" method if we have a function to exec sql, OR we can try to just inform the user.
        // Wait, Supabase JS client doesn't support creating tables directly via API usually unless using the management API or SQL editor.
        // Let's assume we might have an 'exec_sql' RPC or similar, OR we just report the failure.

        console.error('CRITICAL: Table demo_raffle_entries is MISSING.');
        console.error('Please run the following SQL in your Supabase SQL Editor:');
        console.log(`
      create table if not exists demo_raffle_entries (
        id uuid default gen_random_uuid() primary key,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        email text unique not null,
        name text,
        social_handle text,
        is_first_time boolean,
        profile_data jsonb default '{}'::jsonb
      );
      
      -- Enable RLS
      alter table demo_raffle_entries enable row level security;
      
      -- Policy: allow anon insert (for demo flow, actually this is server side usually, but maybe client?)
      -- Our API uses service role or authenticated user. 
      -- Let's stick to service role for updates from API, but we need users to be able to read their own likely?
      -- For now, open it up or just rely on API role.
    `);
    } else if (error) {
        console.error('Error checking table:', error);
    } else {
        console.log('Table demo_raffle_entries EXISTS. Good to go.');
    }
}

checkAndCreate();
