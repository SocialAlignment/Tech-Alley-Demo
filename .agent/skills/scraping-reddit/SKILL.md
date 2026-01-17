---
name: scraping-reddit
description: Extracts data from Reddit subreddits using the JSON API. Use when the user wants to scrape posts, comments, or data from Reddit.
---

# Reddit Scraping Skill

**Context:** reliably extracting data from Reddit without complex HTML parsing or Selenium.
**Strategy:** Use Reddit's public JSON API (`.json` extension) with robust, browser-mimicking headers to bypass simple 403 blocks.

## Core Principles

1.  **JSON over HTML**: Always append `.json` to Reddit URLs (e.g., `https://www.reddit.com/r/n8n/top.json`) instead of scraping HTML. The data is structured, richer, and more stable.
2.  **Robust Headers**: Reddit aggressively blocks non-browser User-Agents. You MUST use a standard browser User-Agent and other headers (Accept, Accept-Language) to mimic a real request.
3.  **Firecrawl Limitations**: The standard Firecrawl/Mendable extractors are often blocked by Reddit's Enterprise protection. Use direct `fetch` with custom headers instead.

## Workflow

### 1. Analyze the Target
Determine if you need a specific subreddit (`/r/name`), a post thread, or a search result.
-   **Subreddit**: `https://www.reddit.com/r/{subreddit}/{sort}.json?t={time}&limit={n}`
-   **Post**: `https://www.reddit.com/{permalink}.json`

### 2. Implementation Template
Use the following TypeScript template which implements the required headers and error handling.

👉 **[Scraper Template](resources/scraper-template.ts)**

### 3. Verification
Test the script with a known active subreddit (e.g., `r/programming` or `r/n8n`).
-   If `403 Forbidden`: Rotate the User-Agent or check if IP is flagged.
-   If `200 OK`: Data will be in `data.children[].data`.

## Common Pitfalls
-   **Missing Headers**: Results in `429 Too Many Requests` or `403 Forbidden`.
-   **Rate Limiting**: Reddit's JSON API is rate-limited. Respect `X-Ratelimit-*` headers if polling frequently.
-   **Pagination**: Use the `after` query parameter from the response to fetch the next page.
