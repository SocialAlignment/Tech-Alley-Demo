import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { supabase } from '@/lib/supabase';

const S3_BUCKET = process.env.S3_BUCKET_NAME;

const s3Client = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
});

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch from Supabase
        const { data: galleryItems, error } = await supabase
            .from('demo_gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Admin Gallery Fetch Error:", error);
            return NextResponse.json({ error: "Failed to fetch from database" }, { status: 500 });
        }

        if (!galleryItems) return NextResponse.json({ photos: [] });

        // Process results to get Signed URLs
        const photos = await Promise.all(galleryItems.map(async (item: any) => {
            let finalImageUrl = item.image_url;
            const s3Key = item.s3_key;

            // Generate Presigned URL if S3 Key exists
            if (s3Key && S3_BUCKET && process.env.S3_ACCESS_KEY_ID) {
                try {
                    const command = new GetObjectCommand({
                        Bucket: S3_BUCKET,
                        Key: s3Key,
                    });
                    finalImageUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
                } catch (err) {
                    console.error("Failed to sign URL for key:", s3Key, err);
                }
            }

            return {
                id: item.id,
                url: finalImageUrl,
                caption: item.caption || "Untitled",
                user: item.user_info || "Anonymous",
                uploadedAt: item.created_at,
                status: item.status
            };
        }));

        return NextResponse.json({ photos });

    } catch (error) {
        console.error("Admin Gallery List Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
