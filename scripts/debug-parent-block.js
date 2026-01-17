const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function debugBlock() {
    const blockId = '2756b72f-a765-80fb-9d32-c2b13534a471';
    console.log(`Retrieving Block: ${blockId}...`);

    try {
        const response = await notion.blocks.retrieve({ block_id: blockId });
        console.log(`Block Type: ${response.type}`);
        if (response[response.type].title) {
            console.log(`Title: ${response[response.type].title}`);
        } else {
            console.log("No title directly on block.");
        }

        // If it's a page, retrieve page details
        if (response.type === 'child_page') {
            const page = await notion.pages.retrieve({ page_id: blockId });
            console.log("It's a page! Title:", page.properties?.title?.title?.[0]?.plain_text);
            // List its children!
            listChildren(blockId);
        } else {
            // List children anyway
            listChildren(blockId);
        }

    } catch (error) {
        console.error("Error retrieving block:", error.body || error);
    }
}

async function listChildren(id) {
    console.log(`Listing children of [${id}]...`);
    const children = await notion.blocks.children.list({ block_id: id });
    children.results.forEach(child => {
        let title = "Untitled";
        if (child.type === 'child_database') {
            title = child.child_database.title;
            const dbId = child.id;
            console.log(`- [DB] ${title} (${dbId})`);

            // Checking if this is the source
            if (dbId.replaceAll('-', '') === '2eb6b72fa765806684e6000b7a37d74e') {
                console.log("⭐️ FOUND THE SOURCE DATABASE ID HERE!");
            }
        } else if (child.type === 'child_page') {
            console.log(`- [PAGE] ${child.child_page.title} (${child.id})`);
        } else {
            // console.log(`- [${child.type}] ${child.id}`);
        }
    });
}

debugBlock();
