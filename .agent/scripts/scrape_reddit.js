const https = require('https');

const searchQueries = [
    'qualify clients for video production',
    'qualify leads for video ads',
    'questions to ask video production clients',
    'selling genai video services'
];

const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

function fetchReddit(query) {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5&sort=top`;

    return new Promise((resolve, reject) => {
        https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const posts = json.data.children.map(child => ({
                        title: child.data.title,
                        selftext: child.data.selftext,
                        url: child.data.url
                    }));
                    resolve(posts);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    for (const query of searchQueries) {
        console.log(`\n--- Results for "${query}" ---`);
        try {
            const results = await fetchReddit(query);
            results.forEach(post => {
                console.log(`\nTitle: ${post.title}`);
                console.log(`Snippet: ${post.selftext.substring(0, 200)}...`);
            });
        } catch (e) {
            console.error(`Error fetching ${query}:`, e.message);
        }
    }
}

main();
