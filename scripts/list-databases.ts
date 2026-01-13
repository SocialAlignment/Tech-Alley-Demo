import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function listDatabases() {
    console.log("Searching for databases...");
    try {
        const response = await notion.search({
            page_size: 100
        });

        const leads = response.results.filter((db: any) => {
            const title = db.title?.[0]?.plain_text || '';
            // Log all databases briefly to help debug
            console.log(`FOUND DB: [${db.id}] "${title}"`);
            return title.toLowerCase().includes('lead') || title.toLowerCase().includes('database 2.0');
        });

        console.log(`Found ${leads.length} relevant databases:`);

        leads.forEach((db: any) => {
            const title = db.title?.[0]?.plain_text || 'Untitled';
            console.log(`[${db.id}] "${title}" (Type: ${db.object})`);
            console.log(JSON.stringify(db, null, 2));
        });

    } catch (error) {
        console.error("Search Error:", error);
    }
}

listDatabases();
