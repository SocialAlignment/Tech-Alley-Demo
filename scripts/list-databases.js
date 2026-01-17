const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

async function findDatabases() {
    console.log("Searching for databases...");
    try {
        const response = await notion.search({
            filter: {
                property: "object",
                value: "database",
            },
        });

        console.log(`Found ${response.results.length} databases.`);
        response.results.forEach((db) => {
            const title = db.title.map((t) => t.plain_text).join("");
            console.log(`- [${title}] ID: ${db.id}`);
        });
    } catch (error) {
        console.error("Error searching databases:", error);
    }
}

findDatabases();
