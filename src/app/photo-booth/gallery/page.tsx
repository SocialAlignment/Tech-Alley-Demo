import { TestimonialSlider, Review } from '@/components/ui/testimonial-slider'; // Assuming you exported Review type
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { StarsBackground } from "@/components/ui/stars-background"
import { ShootingStars } from "@/components/ui/shooting-stars"

export const dynamic = 'force-dynamic';

const s3Client = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
});

// Fallback data if no Notion/S3 data found
const FALLBACK_REVIEWS: Review[] = [
    {
        id: "stock-1",
        name: "Tech Alley Team",
        affiliation: "@techalley",
        quote: "Welcome to the Innovation Gallery! Upload your photos to see them featured here.",
        imageSrc: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000",
        thumbnailSrc: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=200",
    },
    {
        id: "stock-2",
        name: "Community Member",
        affiliation: "Attendee",
        quote: "Networking at its finest. Love the energy here!",
        imageSrc: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=2000",
        thumbnailSrc: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=200",
    }
];

async function getGalleryReviews(): Promise<Review[]> {
    const NOTION_KEY = process.env.NOTION_API_KEY;
    const NOTION_DB_ID = process.env.NOTION_PHOTOBOOTH_DB_ID; // 2eb6b72f-a765-81ca-91d7-fca18180af7c
    const S3_BUCKET = process.env.S3_BUCKET_NAME;

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
            next: { revalidate: 10 } // Cache briefly
        });

        if (!res.ok) {
            console.error("Notion Gallery Fetch Error:", await res.text());
            return [];
        }

        const data = await res.json();

        // Process in parallel
        const reviewsWithUrls = await Promise.all(data.results.map(async (page: any) => {
            const props = page.properties;

            // Clean the user string to remove ID (e.g., "Name (uuid)" -> "Name")
            const rawUser = props.User?.rich_text?.[0]?.plain_text || "Anonymous";
            const cleanName = rawUser.replace(/\s*\([a-f0-9-]+\)$/i, "").trim();

            let instagram = props.Instagram?.rich_text?.[0]?.plain_text || "";
            // Clean URL if present
            if (instagram) {
                instagram = instagram.replace(/(?:https?:\/\/)?(?:www\.)?instagram\.com\//i, "");
                instagram = instagram.replace(/\/$/, ""); // Remove trailing slash
                if (!instagram.startsWith('@')) {
                    instagram = `@${instagram}`;
                }
            }
            const caption = props.Caption?.title?.[0]?.plain_text || "Checking out the event!";
            const s3Key = props.S3Key?.rich_text?.[0]?.plain_text;
            let finalImageUrl = props.ImageURL?.url;

            // Generate Presigned URL if S3 Key exists
            if (s3Key && S3_BUCKET && process.env.AWS_ACCESS_KEY_ID) {
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

            if (!finalImageUrl) return null;

            return {
                id: page.id,
                name: instagram || cleanName, // Use IG as primary name if available
                affiliation: instagram ? cleanName : "Tech Alley Attendee", // Use Name as affiliation
                quote: caption,
                imageSrc: finalImageUrl,
                thumbnailSrc: finalImageUrl,
            };
        }));

        return reviewsWithUrls.filter(Boolean) as Review[];

    } catch (e) {
        console.error("Failed to fetch gallery reviews:", e);
        return [];
    }
}

export default async function GalleryPage() {
    let reviews = await getGalleryReviews();

    if (reviews.length === 0) {
        // Double check if we should show fallback or just empty state
        // For now, show fallback to visually demonstrate the component
        reviews = FALLBACK_REVIEWS;
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <StarsBackground />
                <ShootingStars minDelay={500} maxDelay={1500} />
            </div>

            {/* Simple Back Button wrapped for layout */}
            <div className="fixed top-4 left-4 z-50">
                <Link href="https://muddy-nautilus-ad8.notion.site/nano-banana-pro-the-creative-amplifier?source=copy_link">
                    <Button variant="ghost" className="text-white hover:text-indigo-300 hover:bg-white/10 gap-2 backdrop-blur-sm bg-black/20 border border-white/5 rounded-full px-4">
                        <ArrowLeft size={16} />
                        Take me back to Alignment Resources
                    </Button>
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-[1400px] border border-slate-800 rounded-xl overflow-hidden shadow-2xl bg-slate-900/50 backdrop-blur-sm">
                <TestimonialSlider reviews={reviews} />
            </div>
        </div>
    );
}
