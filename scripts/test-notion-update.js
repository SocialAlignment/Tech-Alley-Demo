const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

async function testUpdate() {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    // Use the ID from the previous successful creation or any valid page ID in that DB
    const pageId = '2ea6b72f-a765-8144-bfc8-c513053497d9';

    console.log('Testing Notion UPDATE on Page ID:', pageId);

    try {
        const response = await notion.pages.update({
            page_id: pageId,
            properties: {
                Company: { rich_text: [{ text: { content: 'Test Corp' } }] },
                Title: { rich_text: [{ text: { content: 'Developer' } }] },
                // 'First Time?': { checkbox: true }, // Disabled
                'Goal for Tonight': { rich_text: [{ text: { content: 'Learn something' } }] },
                'Goal Detail': { rich_text: [{ text: { content: 'React' } }] }
            },
        });
        console.log('Success! Updated:', response.id);
    } catch (error) {
        console.error('Error updating page:', error.message);
        if (error.body) console.error('Body:', error.body);
    }
}

testUpdate();
