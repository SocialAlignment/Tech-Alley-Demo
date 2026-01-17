const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

async function verifyFlow() {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const dbId = process.env.NOTION_LEADS_DB_ID || '1bc6b72f-a765-81f6-80a7-e5dd23031eb4';
    const EVENT_ID = "2d56b72f-a765-80b9-bf33-cee0e586594c";

    console.log("🚀 Starting Full Flow Verification...");

    // 1. Simulate "check-status" (Create Lead)
    let leadId;
    try {
        console.log("\n1️⃣ Testing Create Lead...");
        const createRes = await notion.pages.create({
            parent: { database_id: dbId },
            properties: {
                "Name": { title: [{ text: { content: 'Verification Bot' } }] },
                "Email": { email: 'verify@example.com' },
                "Lead Source": { select: { name: "Tech Alley Henderson" } },
                "Google Oauth": { checkbox: true },
                "Lead Status": { status: { name: "Engaged" } },
                "Registered Events": { relation: [{ id: EVENT_ID }] }
            }
        });
        leadId = createRes.id;
        console.log(`✅ Lead Created! ID: ${leadId}`);
    } catch (e) {
        console.error("❌ Create Failed:", e.body || e.message);
        return;
    }

    // 2. Simulate "update-lead" (Onboarding Form)
    try {
        console.log("\n2️⃣ Testing Update Lead (Onboarding)...");
        await notion.pages.update({
            page_id: leadId,
            properties: {
                "Company": { rich_text: [{ text: { content: "Bot Corp" } }] },
                "Job Title": { rich_text: [{ text: { content: "Tester" } }] },
                "Website": { url: "https://example.com" },
                "Phone": { phone_number: "555-000-0000" },
                "Industry": { select: { name: "Technology" } },
                "What Best Describes You?": { select: { name: "Business Owner (Solopreneur)" } },
                "Employee Count": { select: { name: "1-10" } },

                // Verified Select Options
                "Decision Maker": { select: { name: "Sole" } },
                "First Time TAH?": { select: { name: "Yes this is my first time!" } },

                "TAH Goal?": { rich_text: [{ text: { content: "Verify API" } }] },
                "3Month Success Vision": { rich_text: [{ text: { content: "To Work" } }] },
                "Onboarding Form Done": { checkbox: true }
            }
        });
        console.log("✅ Lead Updated Successfully!");
    } catch (e) {
        console.error("❌ Update Failed:", e.body || e.message);
    }
}

verifyFlow();
