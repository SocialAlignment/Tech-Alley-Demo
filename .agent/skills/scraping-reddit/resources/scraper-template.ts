// Native fetch is available in Node 18+

/**
 * Reddit Scraper Template
 * 
 * Usage:
 * 1. Install types if needed: `npm i -D @types/node`
 * 2. Run with: `npx tsx scrape-reddit.ts <subreddit>`
 */

interface RedditPost {
    data: {
        title: string;
        url: string;
        ups: number;
        author: string;
        permalink: string;
        created_utc: number;
        num_comments: number;
    }
}

interface RedditResponse {
    data: {
        children: RedditPost[];
        after: string | null; // For pagination
    }
}

async function scrapeReddit(subreddit: string, limit = 5, timeFilter = 'week') {
    // Construct JSON URL
    const url = `https://www.reddit.com/r/${subreddit}/top/.json?t=${timeFilter}&limit=${limit}`;
    console.log(`🔍 Scraping top posts from r/${subreddit} (via JSON API)...`);

    try {
        const response = await fetch(url, {
            headers: {
                // Critical: Mimic a real browser to avoid 403 blocks
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            console.error(`❌ Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response Preview:", text.substring(0, 200));
            return;
        }

        // Parse JSON
        const data = await response.json() as RedditResponse;

        if (!data.data || !data.data.children) {
            console.error("❌ Invalid response structure:", data);
            return;
        }

        // Map to simplified object
        const posts = data.data.children.map(child => ({
            title: child.data.title,
            url: child.data.url,
            permalink: `https://reddit.com${child.data.permalink}`,
            upvotes: child.data.ups,
            author: child.data.author,
            comments: child.data.num_comments
        }));

        console.log("\n✅ Scrape Successful!\n");
        console.log(JSON.stringify(posts, null, 2));

    } catch (error) {
        console.error("❌ Unexpected Error:", error);
    }
}

// CLI Execution
const args = process.argv.slice(2);
const subreddit = args[0] || 'n8n';
scrapeReddit(subreddit);
