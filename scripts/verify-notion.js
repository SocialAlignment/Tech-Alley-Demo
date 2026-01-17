const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

async function verifyNotion() {
    const apiKey = process.env.NOTION_API_KEY;
    const dbId = '1bc6b72f-a765-81f6-80a7-e5dd23031eb4';
    const notion = new Client({ auth: apiKey });

    try {
        console.log(`Fetching Schema for DB: ${dbId}...`);
        const response = await notion.databases.retrieve({ database_id: dbId });
        console.log(JSON.stringify(response, null, 2));
    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
}

verifyNotion();
