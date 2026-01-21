import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_PHOTOBOOTH_DB_ID;
const NOTION_VERSION = '2022-06-28';
const AWS_REGION = process.env.S3_REGION!;
const AWS_BUCKET_NAME = process.env.S3_BUCKET_NAME!;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { s3Key, caption, userId, instagramHandle } = body;

        if (!s3Key) {
            return NextResponse.json(
                { error: 's3Key is required' },
                { status: 400 }
            );
        }

        const AWS_BUCKET_NAME = process.env.S3_BUCKET_NAME!;
        const imageUrl = `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

        // Initialize Supabase Admin Client
        const adminAuthClient = process.env.SUPABASE_SERVICE_ROLE_KEY
            ? require('@supabase/supabase-js').createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            )
            : supabase;

        // 1. Save to Supabase (demo_gallery)
        console.log(`[Upload Confirm] Saving to Supabase demo_gallery: ${s3Key}`);

        const { error: galleryError } = await adminAuthClient
            .from('demo_gallery')
            .insert({
                s3_key: s3Key,
                image_url: imageUrl,
                caption: caption || 'Untitled Memory',
                user_info: userId || 'Anonymous',
                instagram: instagramHandle || '',
                status: 'approved' // Default to approved as requested for stability
            });

        if (galleryError) {
            console.error("Supabase Insert Error:", galleryError);
            throw new Error(`Database Error: ${galleryError.message}`);
        }

        // 2. Sync Instagram to User Profile (Supabase) if provided
        if (userId && instagramHandle) {
            console.log(`[Upload Confirm] Syncing Instagram for user ${userId}: ${instagramHandle}`);

            const { error: profileError } = await adminAuthClient
                .from('leads')
                .update({ instagram: instagramHandle })
                .eq('id', userId); // Assuming userId matches leads.id logic, or we tolerate failure

            if (profileError) {
                console.warn("Failed to sync Instagram to profile:", profileError);
                // Don't fail the whole request for this
            }
        }

        return NextResponse.json({ success: true, imageUrl });

    } catch (error: any) {
        console.error('Error confirming upload:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save to database' },
            { status: 500 }
        );
    }
}
