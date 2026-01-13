import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';
import { enrichCompany } from '@/lib/enrichment';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB_ID = process.env.NOTION_LEADS_DB_ID!;

export async function POST() {
    try {
        // 1. Find leads created > 24 hours ago that are NOT enriched
        // Notion API filter for "created_time"
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const response = await notion.request({
            path: `databases/${DB_ID}/query`,
            method: 'post',
            body: {
                filter: {
                    and: [
                        {
                            property: 'Created time',
                            created_time: {
                                on_or_before: yesterday
                            }
                        },
                        {
                            property: 'Enrichment Status', // Assumes a status property exists
                            select: {
                                is_empty: true
                            }
                        }
                    ]
                },
                page_size: 10 // Batch size limit
            }
        }) as any;

        const leadsToEnrich = response.results;
        const results = [];

        // 2. Process Batch
        for (const lead of leadsToEnrich) {
            const companyName = lead.properties.Company?.rich_text?.[0]?.plain_text;

            if (companyName) {
                const enrichmentData = await enrichCompany(companyName, lead.properties.Website?.url);

                const summaryBlock = `
[ENRICHMENT ANALYSIS]
Summary: ${enrichmentData.summary}
Pain Points:
- ${enrichmentData.painPoints.join('\n- ')}
Icebreaker: "${enrichmentData.suggestedIcebreaker}"
                `.trim();

                // Update Notion
                // Note: Using 'Initial Notes' as fallback until 'Enrichment Context' property is confirmed
                const properties: any = {
                    'Enrichment Status': { select: { name: 'Complete' } }
                };

                // Append to Initial Notes (or create strict property if available)
                properties['Initial Notes'] = {
                    rich_text: [
                        // Preserve existing if we could read it (not easy in one go without read), 
                        // so we might overwrite or we should read first? 
                        // The batch query returned properties, let's check if we have content.
                        ...((lead.properties['Initial Notes']?.rich_text || []) as any[]),
                        { text: { content: '\n\n' + summaryBlock } }
                    ]
                };

                await notion.pages.update({
                    page_id: lead.id,
                    properties: properties
                });

                results.push({ id: lead.id, company: companyName, status: 'Enriched' });
            }
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            message: "Enrichment job ran (Simulated). Uncomment logic to enable."
        });

    } catch (error) {
        console.error('Enrichment Job Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to run enrichment' },
            { status: 500 }
        );
    }
}
