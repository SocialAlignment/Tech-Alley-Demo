
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

export interface EnrichmentResult {
    summary: string;
    painPoints: string[];
    suggestedIcebreaker: string;
    rawContext?: string;
}

export async function enrichCompany(companyName: string, websiteUrl?: string): Promise<EnrichmentResult> {
    console.log(`[Enrichment] Starting for: ${companyName} (${websiteUrl})`);

    let websiteContent = '';

    // 1. Scrape with Firecrawl (if URL provided)
    if (websiteUrl && FIRECRAWL_API_KEY) {
        try {
            console.log('[Enrichment] Scraping via Firecrawl...');
            const fcResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: websiteUrl,
                    formats: ['markdown']
                })
            });

            if (fcResponse.ok) {
                const fcData = await fcResponse.json();
                websiteContent = fcData.data?.markdown || '';
                // Limit content length to avoid token limits
                websiteContent = websiteContent.slice(0, 15000);
                console.log('[Enrichment] Scrape successful.');
            } else {
                console.error('[Enrichment] Firecrawl failed:', await fcResponse.text());
            }
        } catch (err) {
            console.error('[Enrichment] Firecrawl error:', err);
        }
    }

    // 2. Analyze with Perplexity
    if (PERPLEXITY_API_KEY) {
        try {
            console.log('[Enrichment] Analyzing via Perplexity...');

            const systemPrompt = `You are a world-class B2B Sales Strategist. Your goal is to analyze a company and provide actionable insights for a "GenAI Video Production" agency (Social Alignment).
            
            Output ONLY valid JSON with this schema:
            {
                "summary": "One sentence value proposition of what they do.",
                "painPoints": ["Pain Point 1", "Pain Point 2", "Pain Point 3"],
                "suggestedIcebreaker": "A 1-2 sentence personalized opening line for an email mentioning their specific work/news."
            }`;

            const userPrompt = `Analyze the company "${companyName}".
            ${websiteUrl ? `Website Context: ${websiteContent}` : 'Start by searching the web for this company.'}
            
            Identify 3 specific pain points that could be solved by high-volume, AI-generated short-form video content (TikTok/Reels).
            Draft a hyper-personalized icebreaker.`;

            const pplxResponse = await fetch('https://api.perplexity.ai/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'sonar-pro',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.2
                })
            });

            if (pplxResponse.ok) {
                const pplxData = await pplxResponse.json();
                const rawContent = pplxData.choices?.[0]?.message?.content || '{}';

                // Parse JSON from markdown code blocks if necessary
                const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
                const jsonString = jsonMatch ? jsonMatch[0] : rawContent;

                try {
                    const parsed = JSON.parse(jsonString);
                    return {
                        summary: parsed.summary || `Analysis of ${companyName}`,
                        painPoints: parsed.painPoints || [],
                        suggestedIcebreaker: parsed.suggestedIcebreaker || '',
                        rawContext: websiteContent ? 'Scraped' : 'Search'
                    };
                } catch (e) {
                    console.error('[Enrichment] Failed to parse Perplexity JSON:', rawContent);
                    return {
                        summary: rawContent.slice(0, 200),
                        painPoints: [],
                        suggestedIcebreaker: 'I saw your work and was impressed.',
                        rawContext: 'Parse Error'
                    };
                }
            } else {
                console.error('[Enrichment] Perplexity failed:', await pplxResponse.text());
            }

        } catch (err) {
            console.error('[Enrichment] Perplexity error:', err);
        }
    }

    // Fallback
    return {
        summary: 'Enrichment failed or keys missing.',
        painPoints: [],
        suggestedIcebreaker: `Hi ${companyName} team, I'd love to connect!`,
        rawContext: 'Fallback'
    };
}
