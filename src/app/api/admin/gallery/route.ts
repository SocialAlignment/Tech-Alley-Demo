import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_PHOTOBOOTH_DB_ID;
const NOTION_VERSION = '2022-06-28';
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
    if (!NOTION_KEY || !NOTION_DB_ID) {
        return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    try {
        const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_KEY}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sorts: [
                    {
                        property: 'UploadedAt',
                        direction: 'descending',
                    },
                ],
            }),
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch from Notion" }, { status: 500 });
        }

        const data = await res.json();

        // Process results to get Signed URLs
        const photos = await Promise.all(data.results.map(async (page: any) => {
            const props = page.properties;
            const s3Key = props.S3Key?.rich_text?.[0]?.plain_text;
            let finalImageUrl = props.ImageURL?.url;

            // Generate Presigned URL if S3 Key exists (same logic as public gallery)
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
                id: page.id,
                url: finalImageUrl,
                caption: props.Caption?.title?.[0]?.plain_text || "Untitled",
                user: props.User?.rich_text?.[0]?.plain_text || "Anonymous",
                uploadedAt: props.UploadedAt?.date?.start,
                status: props.Status?.select?.name
            };
        }));

        return NextResponse.json({ photos });

    } catch (error) {
        console.error("Admin Gallery List Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
