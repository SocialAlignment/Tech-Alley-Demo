
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Test with Anon Key
const supabaseAnon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAnon() {
    console.log('Testing Connection with ANON KEY...');
    console.log(`URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    // console.log(`Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);

    const { data, error } = await supabaseAnon.from('demo_gallery').select('*').limit(1);

    if (error) {
        console.error('❌ Anon Key Failed:', error.message);
    } else {
        console.log('✅ Anon Key Works!');
    }
}

checkAnon();
