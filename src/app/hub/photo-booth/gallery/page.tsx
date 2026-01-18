import GalleryClient from './gallery-client';
import { ImageData } from '@/components/ui/img-sphere';

// Fallback images if folder is empty (so it still looks good initially)
const FALLBACK_IMAGES: ImageData[] = [
    {
        id: "stock-1",
        src: "https://images.unsplash.com/photo-1758178309498-036c3d7d73b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
        alt: "Mountain Landscape",
        title: "Sample Gallery",
        description: "Add images to public/gallery to see them here!"
    },
    {
        id: "stock-2",
        src: "https://images.unsplash.com/photo-1757647016230-d6b42abc6cc9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2072",
        alt: "Portrait Photography",
        title: "Sample Gallery",
        description: "Add images to public/gallery to see them here!"
    },
    {
        id: "stock-3",
        src: "https://images.unsplash.com/photo-1757906447358-f2b2cb23d5d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
        alt: "Urban Architecture",
        title: "Sample Gallery",
        description: "Add images to public/gallery to see them here!"
    }
];

export const dynamic = 'force-dynamic';

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

async function getGalleryImages(): Promise<ImageData[]> {
    const NOTION_KEY = process.env.NOTION_API_KEY;
    const NOTION_DB_ID = process.env.NOTION_PHOTOBOOTH_DB_ID;
    const S3_BUCKET = process.env.AWS_BUCKET_NAME;

    if (!NOTION_KEY || !NOTION_DB_ID) {
        console.warn("Notion credentials missing for Gallery");
        return [];
    }

    try {
        const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_KEY}`,
                'Notion-Version': '2022-06-28',
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
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            console.error("Notion Gallery Fetch Error:", await res.text());
            return [];
        }

        const data = await res.json();

        // Process images in parallel to get signed URLs
        const imagesWithUrls = await Promise.all(data.results.map(async (page: any) => {
            const props = page.properties;
            const caption = props.Caption?.title?.[0]?.plain_text || "Tech Alley Memory";
            const s3Key = props.S3Key?.rich_text?.[0]?.plain_text;
            let finalImageUrl = props.ImageURL?.url;

            // If we have an S3 Key and credentials, generate a fresh presigned URL
            if (s3Key && S3_BUCKET && process.env.AWS_ACCESS_KEY_ID) {
                try {
                    const command = new GetObjectCommand({
                        Bucket: S3_BUCKET,
                        Key: s3Key,
                    });
                    finalImageUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
                } catch (err) {
                    console.error("Failed to sign URL for key:", s3Key, err);
                    // Fallback to the stored URL
                }
            }

            if (!finalImageUrl) return null;

            return {
                id: page.id,
                src: finalImageUrl,
                alt: caption,
                title: "Event Photo",
                description: caption
            };
        }));

        return imagesWithUrls.filter(Boolean) as ImageData[];

    } catch (e) {
        console.error("Failed to fetch gallery images:", e);
        return [];
    }
}

export default async function GalleryPage() {
    let images = await getGalleryImages();
    let displayImages = images;

    if (images.length === 0) {
        displayImages = FALLBACK_IMAGES;
    }

    return <GalleryClient images={displayImages} />;
}
