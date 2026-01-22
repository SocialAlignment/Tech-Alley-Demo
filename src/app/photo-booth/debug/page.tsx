
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

    try {
        if (!sbUrl || !sbKey) {
            throw new Error("Missing Supabase Env Vars");
        }
        const supabase = createClient(sbUrl, sbKey);
        const { data, error } = await supabase.from('demo_gallery').select('*').limit(5);
        if (error) throw error;
        rowCount = data.length;
        rows = data || [];
        status = "Connected";
    } catch (err: any) {
        status = "Failed";
        errorMsg = err.message;
    }

    return (
        <div className="p-10 bg-black text-green-400 font-mono text-sm whitespace-pre-wrap">
            <h1 className="text-xl font-bold mb-4">Debug Console</h1>
            <div>NEXT_PUBLIC_SUPABASE_URL: {sbUrl ? "✅ Defined" : "❌ MISSING"} ({sbUrl?.substring(0, 10)}...)</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY: {sbKey ? "✅ Defined" : "❌ MISSING"}</div>
            <div>S3_BUCKET_NAME: {s3Bucket ? "✅ Defined" : "❌ MISSING"}</div>
            <hr className="my-4 border-gray-700" />
            <div>Supabase Status: {status}</div>
            <div>Row Count: {rowCount}</div>
            {errorMsg && <div className="text-red-500">Error: {errorMsg}</div>}
            <hr className="my-4 border-gray-700" />
            <div>Recent Rows:</div>
            {JSON.stringify(rows, null, 2)}
        </div>
    );
}
