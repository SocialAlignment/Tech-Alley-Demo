
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

function escapeCsv(value) {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    // Escape quotes by doubling them, and wrap in quotes
    return `"${stringValue.replace(/"/g, '""')}"`;
}

async function exportEntries() {
    console.log('Querying table: demo_raffle_entries...');

    // Fetch entries created in the last 24 hours (roughly "tonight")
    const { data, error } = await supabase
        .from('demo_raffle_entries')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching entries:', error);
        return;
    }

    // Filter for entries created recently (last 24h) just to be safe, 
    // but since it's a demo, maybe just take them all if the count is small.
    // The user said "19 entrants". Let's just output all recent ones.
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 1); // 24 hours ago

    const respondents = data.filter(e => new Date(e.created_at) > cutoffDate);

    console.log(`Found ${respondents.length} entries from the last 24 hours.`);

    if (respondents.length === 0) {
        console.log("No entries found from the last 24 hours.");
        return;
    }

    // Define columns
    const columns = [
        // Top level
        { header: 'ID', key: 'id' },
        { header: 'Created At', key: 'created_at' },
        { header: 'Name', key: 'name' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phone' },
        { header: 'Is First Time', key: 'is_first_time' },

        // Survey Responses
        { header: 'AI Stage', key: 'responses.aiStage' },
        { header: 'Website', key: 'responses.website' },
        { header: 'Offer Type', key: 'responses.offerType' },
        { header: 'AI Interest', key: 'responses.aiInterest' },
        { header: 'Help Needed', key: 'responses.helpNeeded' },
        { header: 'AI Challenge', key: 'responses.aiChallenge' },
        { header: 'AI Tools Used', key: 'responses.aiToolsUsed' },
        { header: 'Monthly Leads', key: 'responses.monthlyLeads' },
        { header: 'Desired Action', key: 'responses.desiredAction' },
        { header: 'Outcome 90 Days', key: 'responses.outcome90Days' },
        { header: 'Want Resources', key: 'responses.wantResources' },
        { header: 'Target Audience', key: 'responses.targetAudience' },
        { header: 'Main Product/Service', key: 'responses.mainProductService' },
        { header: 'Core Alignment Statement', key: 'responses.coreAlignmentStatement' },

        // Custom inputs
        { header: 'Offer Type (Custom)', key: 'responses.offerType_custom' },
        { header: 'AI Interest (Custom)', key: 'responses.aiInterest_custom' },
        { header: 'Help Needed (Custom)', key: 'responses.helpNeeded_custom' },
        { header: 'AI Challenge (Custom)', key: 'responses.aiChallenge_custom' },
        { header: 'AI Tools Used (Custom)', key: 'responses.aiToolsUsed_custom' },

        // Meta
        { header: 'Tags', key: 'tags' },
        { header: 'Score', key: 'score' },
        { header: 'Score Band', key: 'score_band' },
        { header: 'Newsletter Variant', key: 'newsletter_variant' }
    ];

    // Build CSV Header
    const csvHeader = columns.map(c => c.header).join(',');

    // Build CSV Rows
    const csvRows = respondents.map(row => {
        return columns.map(col => {
            let val;
            if (col.key.startsWith('responses.')) {
                const responseKey = col.key.split('.')[1];
                val = row.responses ? row.responses[responseKey] : '';
            } else {
                val = row[col.key];
            }

            // Handle arrays (e.g. aiInterest)
            if (Array.isArray(val)) {
                val = val.join('; ');
            }
            // Handle booleans
            if (typeof val === 'boolean') {
                val = val ? 'Yes' : 'No';
            }

            return escapeCsv(val);
        }).join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const outputPath = path.resolve(process.cwd(), 'public', 'tech-alley-entries.csv');

    fs.writeFileSync(outputPath, csvContent);
    console.log(`Successfully exported ${respondents.length} entries to CSV.`);
    console.log(`File saved to: ${outputPath}`);
}

exportEntries();
