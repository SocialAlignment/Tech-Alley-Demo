const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySchema() {
    console.log('🔍 Verifying Database Schema...\n');
    let hasError = false;

    // 1. Verify grant_applications table
    console.log('1. Checking "grant_applications" table...');
    const { error: grantError } = await supabase
        .from('grant_applications')
        .select('id, dashboard_needs') // Check a specific new column too
        .limit(1);

    if (grantError) {
        console.error('   ❌ FAILED: Table "grant_applications" does not exist or has issues.');
        console.error(`      Error: ${grantError.message}`);
        if (grantError.code === '42P01') {
            console.error('      -> Run "migration_add_grants.sql" in Supabase SQL Editor.');
        } else if (grantError.code === '42703') {
            console.error('      -> Table exists but "dashboard_needs" column is missing. Re-run or update definition.');
        }
        hasError = true;
    } else {
        console.log('   ✅ PASSED: Table "grant_applications" exists with required columns.');
    }

    // 2. Verify raffle_entries new columns
    console.log('\n2. Checking "raffle_entries" new columns...');
    const { error: raffleError } = await supabase
        .from('raffle_entries')
        .select('ai_expectations, ai_hesitation, interested_services')
        .limit(1);

    if (raffleError) {
        console.error('   ❌ FAILED: New columns in "raffle_entries" are missing.');
        console.error(`      Error: ${raffleError.message}`);
        if (raffleError.code === '42703') {
            console.error('      -> Run "migration_update_raffle.sql" in Supabase SQL Editor.');
        }
        hasError = true;
    } else {
        console.log('   ✅ PASSED: "raffle_entries" has new schema columns.');
    }

    console.log('\n---------------------------------------------------');
    if (hasError) {
        console.log('❌ VERIFICATION FAILED. Please run the missing migrations.');
        process.exit(1);
    } else {
        console.log('✅ ALL CHECKS PASSED. Database is ready!');
        process.exit(0);
    }
}

verifySchema();
