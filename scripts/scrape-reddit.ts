// Native fetch is available in Node 18+
// In Node 20 environment (likely), global fetch is available.

// Since I removed the import line in previous steps but overwriting now, I should just stick to global fetch.
// But wait, I'm writing the file from scratch.
// I'll assume global fetch.

interface ScrapedRedditPost {
    data: {
        title: string;
        url: string;
        ups: number;
        author: string;
        permalink: string;
    }
}

interface ScrapedRedditResponse {
    data: {
        children: ScrapedRedditPost[];
    }
}

async function scrapeReddit(subreddit: string) {
    const url = `https://www.reddit.com/r/${subreddit}/top/.json?t=week&limit=3`;
    console.log(`🔍 Scraping top posts from r/${subreddit} (via JSON API)...`);
    console.log(`🔗 URL: ${url}`);

    try {
        const response = await fetch(url, {
            headers: {
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
            // Truncate response if too long (likely HTML error page)
            console.error("Response Preview:", text.substring(0, 200));
            return;
        }

        const data = await response.json() as ScrapedRedditResponse;

        if (!data.data || !data.data.children) {
            console.error("❌ Invalid response structure:", data);
            return;
        }

        const topPosts = data.data.children.slice(0, 3).map(post => ({
            title: post.data.title,
            url: post.data.url,
            upvotes: post.data.ups,
            author: post.data.author
        }));

        console.log("\n✅ Scrape Successful!\n");
        console.log(JSON.stringify(topPosts, null, 2));

    } catch (error) {
        console.error("❌ Unexpected Error:", error);
    }
}

const subreddit = process.argv[2] || 'n8n';
scrapeReddit(subreddit);
