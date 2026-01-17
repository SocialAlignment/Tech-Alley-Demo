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

async function getGalleryImages(): Promise<ImageData[]> {
    const NOTION_KEY = process.env.NOTION_API_KEY;
    const NOTION_DB_ID = process.env.NOTION_PHOTOBOOTH_DB_ID;

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

        return data.results.map((page: any) => {
            const props = page.properties;
            const caption = props.Caption?.title?.[0]?.plain_text || "Tech Alley Memory";
            const imageUrl = props.ImageURL?.url;
            const key = props.S3Key?.rich_text?.[0]?.plain_text || page.id;

            if (!imageUrl) return null;

            return {
                id: page.id,
                src: imageUrl,
                alt: caption,
                title: "Event Photo",
                description: caption
            };
        }).filter(Boolean) as ImageData[];

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
    } else if (images.length < 10) {
        // Sphere looks empty with few images, so duplicate them to fill it up
        const originalLength = images.length;
        const targetCount = 20;
        const multiplier = Math.ceil(targetCount / originalLength);

        displayImages = [];
        for (let i = 0; i < multiplier; i++) {
            images.forEach(img => {
                displayImages.push({
                    ...img,
                    id: `${img.id}-dup-${i}`
                });
            });
        }
    }

    return <GalleryClient images={displayImages} />;
}
