
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const s3Bucket = process.env.S3_BUCKET_NAME;

    let status = "Checking...";
    let rowCount = 0;
    let errorMsg = null;
    let rows = [];

    // Diagnostics
    const keyDiagnostics = {
        length: sbKey ? sbKey.length : 0,
        start: sbKey ? sbKey.substring(0, 5) : "NULL",
        end: sbKey ? sbKey.slice(-5) : "NULL",
        hasWhitespace: sbKey ? /\s/.test(sbKey) : false,
        hasQuotes: sbKey ? /['"]/.test(sbKey) : false
    };

    try {
        if (!sbUrl || !sbKey) {
            throw new Error("Missing Env Vars");
        }
        const supabase = createClient(sbUrl, sbKey);
        const { data, error } = await supabase.from('demo_gallery').select('*').limit(5);

        if (error) {
            console.error("Supabase Query Error:", error);
            throw error;
        }

        rowCount = data.length;
        rows = data || [];
        status = "Connected";
    } catch (err: any) {
        status = "Failed";
        errorMsg = err.message;
    }

    return (
        <div className="p-10 bg-black text-green-400 font-mono text-sm whitespace-pre-wrap">
            <h1 className="text-xl font-bold mb-4">Debug Console v2</h1>
            <div>NEXT_PUBLIC_SUPABASE_URL: {sbUrl ? "✅ Defined" : "❌ MISSING"} ({sbUrl?.substring(0, 10)}...)</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY: {sbKey ? "✅ Defined" : "❌ MISSING"}</div>

            <div className="ml-4 p-2 border border-green-800 my-2">
                <div className="font-bold text-white">Key Diagnostics:</div>
                <div>Length: {keyDiagnostics.length} (Expected ~200+)</div>
                <div>Start: "{keyDiagnostics.start}" (Should match local)</div>
                <div>End: "{keyDiagnostics.end}" (Should match local)</div>
                <div className={keyDiagnostics.hasWhitespace ? "text-red-500 font-bold" : ""}>
                    Has Whitespace: {keyDiagnostics.hasWhitespace ? "YES (DELETE IT)" : "No"}
                </div>
                <div className={keyDiagnostics.hasQuotes ? "text-red-500 font-bold" : ""}>
                    Has Quotes: {keyDiagnostics.hasQuotes ? "YES (DELETE THEM)" : "No"}
                </div>
            </div>

            <div>S3_BUCKET_NAME: {s3Bucket ? "✅ Defined" : "❌ MISSING"}</div>

            <hr className="my-4 border-gray-700" />
            <div>Supabase Status: {status}</div>
            <div>Row Count: {rowCount}</div>
            {errorMsg && <div className="text-red-500 font-bold bg-red-900/20 p-2">Error: {errorMsg}</div>}
            <hr className="my-4 border-gray-700" />
            <div>Recent Rows:</div>
            {JSON.stringify(rows, null, 2)}
        </div>
    );
}
