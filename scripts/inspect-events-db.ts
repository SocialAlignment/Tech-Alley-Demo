import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function debug() {
    console.log("Notion DataBases keys:", Object.keys(notion.databases));
    console.log("Has retrieve?", typeof notion.databases.retrieve);
    console.log("Has query?", typeof notion.databases.query);
}

debug();
