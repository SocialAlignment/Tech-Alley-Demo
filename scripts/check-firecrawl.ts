import FirecrawlApp from '@mendable/firecrawl-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.FIRECRAWL_API_KEY;
if (!apiKey) {
    console.error("No API Key");
    process.exit(1);
}

const app = new FirecrawlApp({ apiKey });

console.log("FirecrawlApp instance keys:");
console.log(Object.keys(app));
console.log("\nPrototype methods:");
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(app)));
