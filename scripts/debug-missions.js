require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const rawId = '2eb6b72fa76580088736f7cb6632eb0e';
const CHECKLIST_DB_ID = `${rawId.substring(0, 8)}-${rawId.substring(8, 12)}-${rawId.substring(12, 16)}-${rawId.substring(16, 20)}-${rawId.substring(20)}`;

async function debug() {
    try {
        console.log('--- DEBUG START ---');
        console.log('Target ID:', CHECKLIST_DB_ID);

        // 1. Retrieve Database
        console.log('Calling notion.databases.retrieve...');
        try {
            const db = await notion.databases.retrieve({ database_id: CHECKLIST_DB_ID });
            console.log('✅ Connect Success! Database retrieved.');

            if (db.properties) {
                const props = Object.keys(db.properties);
                console.log('Available Properties:', props);

                // Check mappings
                ['Status', 'Active', 'Mission', 'Name', 'Points', 'XP', 'ActionPath', 'Icon'].forEach(key => {
                    if (db.properties[key]) {
                        console.log(`- Property "${key}": Type=${db.properties[key].type}`);
                    } else {
                        console.log(`- Property "${key}": Missing`);
                    }
                });
            } else {
                console.log('❌ db.properties is undefined! Full DB:', JSON.stringify(db, null, 2));
            }

        } catch (e) {
            console.error('❌ Retrieve Failed:', e.code, e.message);
        }

        // 2. Try Direct Fetch (Bypass SDK)
        console.log('\nTesting Direct Fetch...');
        try {
            // Using global fetch (Node 18+)
            const res = await fetch(`https://api.notion.com/v1/databases/${CHECKLIST_DB_ID}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ page_size: 5 })
            });

            if (res.ok) {
                const data = await res.json();
                console.log(`✅ Direct Fetch Success! Found ${data.results.length} items.`);
                if (data.results.length > 0) {
                    console.log('First Record Props:', Object.keys(data.results[0].properties));
                    // Check if Active
                    const first = data.results[0];
                    console.log('First Record Details:', JSON.stringify(first.properties, null, 2));
                }
            } else {
                const txt = await res.text();
                console.log(`❌ Direct Fetch Failed: ${res.status} ${res.statusText}`);
                console.log('Body:', txt);
            }
        } catch (e) {
            console.error('❌ Direct Fetch Error:', e.message);
        }

    } catch (error) {
        console.error('Debug Error:', error.body || error);
    }
}

debug();
