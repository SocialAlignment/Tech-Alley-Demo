
interface RedditPost {
    data: {
        title: string;
        url: string;
        ups: number;
        author: string;
        permalink: string;
        created_utc: number;
        num_comments: number;
        selftext: string;
    }
}

interface RedditResponse {
    data: {
        children: RedditPost[];
        after: string | null;
    }
}

async function searchReddit(subreddit: string, query: string) {
    const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&sort=top&t=all&limit=5`;
    console.log(`🔍 Searching r/${subreddit} for "${query}"...`);

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        if (!response.ok) {
            console.error(`❌ Error: ${response.status} ${response.statusText}`);
            return;
        }

        const data = await response.json() as RedditResponse;

        if (!data.data || !data.data.children) {
            console.error("❌ Invalid response structure");
            return;
        }

        const posts = data.data.children.map(child => ({
            subreddit,
            title: child.data.title,
            text: child.data.selftext.substring(0, 200) + "...",
            url: `https://reddit.com${child.data.permalink}`,
            upvotes: child.data.ups
        }));

        console.log(JSON.stringify(posts, null, 2));

    } catch (error) {
        console.error("❌ Unexpected Error:", error);
    }
}

async function main() {
    await searchReddit('marketing', 'qualifying video clients');
    await searchReddit('videography', 'client questionnaire');
    await searchReddit('agency', 'onboarding questions video');
}

main();
