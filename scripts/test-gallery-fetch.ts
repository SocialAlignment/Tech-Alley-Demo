
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function testFetch() {
    console.log("Testing Supabase Gallery Fetch...");

    // 1. Telemetry check
    if (!supabaseUrl || !anonKey || !serviceKey) {
        console.error("❌ Missing Supabase Environment Variables");
        return;
    }

    // 2. Test with Service Role (Admin) - Should always work
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: adminData, error: adminError } = await adminClient
        .from('demo_gallery')
        .select('*')
        .order('created_at', { ascending: false });

    if (adminError) {
        console.error("❌ Service Role Fetch Failed:", adminError.message);
    } else {
        console.log(`✅ Service Role Fetch: Found ${adminData.length} rows`);
        if (adminData.length > 0) {
            console.log("   Latest Item Status:", adminData[0].status);
        }
    }

    // 3. Test with Anon Key (Public) - Relies on RLS
    const anonClient = createClient(supabaseUrl, anonKey);
    const { data: anonData, error: anonError } = await anonClient
        .from('demo_gallery')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

    if (anonError) {
        console.error("❌ Anon Key Fetch Failed:", anonError.message);
    } else {
        console.log(`✅ Anon Key Fetch: Found ${anonData.length} rows`);
        if (anonData.length === 0 && adminData && adminData.length > 0) {
            console.warn("⚠️ Data exists but Anon Key found 0 rows. RLS Policy likely missing!");
        }
    }
}

testFetch();
