const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

async function verifyNotion() {
    const apiKey = process.env.NOTION_API_KEY;
    const dbId = process.env.NOTION_LEADS_DB_ID;
    const notion = new Client({ auth: apiKey });

    try {
        console.log('Fetching...');
        const response = await notion.databases.retrieve({ database_id: dbId });
        console.log(JSON.stringify(response, null, 2));
    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
}

verifyNotion();
