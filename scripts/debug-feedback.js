
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFeedbackInsert() {
    console.log('Testing connection to:', supabaseUrl);

    // 1. Try to fetch to see if table exists (and we have read access)
    console.log('--- Attempting SELECT ---');
    const { data: selectData, error: selectError } = await supabase
        .from('feedback')
        .select('count(*)', { count: 'exact', head: true });

    if (selectError) {
        console.error('SELECT Error:', selectError);
    } else {
        console.log('SELECT Success. Table exists found.');
    }

    // 2. Try to insert
    console.log('--- Attempting INSERT ---');
    const payload = {
        speaker_id: 'debug-script',
        speaker_name: 'Debug Script',
        visitor_name: 'Tester',
        topic: 'Debugging',
        content: 'This is a test message from the debug script.',
        type: 'feedback',
        created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('feedback')
        .insert([payload])
        .select();

    if (error) {
        console.error('INSERT Error FULL OBJECT:', JSON.stringify(error, null, 2));
        console.error('Message:', error.message);
        console.error('Hint:', error.hint);
        console.error('Details:', error.details);
    } else {
        console.log('INSERT Success:', data);
    }
}

testFeedbackInsert();
