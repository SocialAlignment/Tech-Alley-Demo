const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const notion = new Client({ auth: process.env.NOTION_API_KEY });

const PAGE_ID = '2eb6b72f-a765-81e8-9e4b-f60e46afe7f4';

async function inspectPage() {
    try {
        console.log(`Fetching page ${PAGE_ID}...`);
        const page = await notion.pages.retrieve({ page_id: PAGE_ID });

        console.log("Parent:", JSON.stringify(page.parent, null, 2));
        console.log("Properties Keys:", Object.keys(page.properties));
        console.log("Full Properties:", JSON.stringify(page.properties, null, 2));

    } catch (error) {
        console.error("Error fetching page:", error.body || error);
    }
}

inspectPage();
