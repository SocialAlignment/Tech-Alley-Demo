
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const DB_ID = "1bc6b72f-a765-81f6-80a7-e5dd23031eb4"; // Leads Database ID
const NOTION_API_KEY = process.env.NOTION_API_KEY;

async function checkProperties() {
    console.log("Checking properties for Leads database:", DB_ID);
    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${NOTION_API_KEY}`,
                "Notion-Version": "2022-06-28",
            },
        });

        if (!response.ok) {
            const text = await response.text();
            console.error(`Error: ${response.status} ${response.statusText}`, text);
            return;
        }

        const data = await response.json();
        console.log("Database properties:");
        if (data.properties) {
            Object.keys(data.properties).forEach(key => {
                console.log(`- "${key}": ${data.properties[key].type}`);
            });
        } else {
            console.log("No properties found in response:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Error retrieving database:", error);
    }
}

checkProperties();
