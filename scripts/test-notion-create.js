const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

async function testCreate() {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const dbId = process.env.NOTION_LEADS_DB_ID;

    console.log('Testing Notion Create with DB ID:', dbId);

    try {
        const response = await notion.pages.create({
            parent: { database_id: dbId },
            properties: {
                Name: {
                    title: [{ text: { content: 'Test User' } }],
                },
                Email: {
                    email: 'test@example.com',
                },
                'Lead Source': {
                    select: { name: 'Tech Alley Henderson' },
                },
                'First Time': {
                    checkbox: true,
                },
            },
        });
        console.log('Success! ID:', response.id);
    } catch (error) {
        console.error('Error creating page:', error.message);
        console.error('Body:', error.body);
    }
}

testCreate();
