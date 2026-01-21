import { TestimonialSlider, Review } from '@/components/ui/testimonial-slider'; // Assuming you exported Review type
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { WarpBackground } from "@/components/ui/warp-background"

export const dynamic = 'force-dynamic';

const s3Client = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
});

// Fallback data if no Notion/S3 data found
// Fallback data if no Notion/S3 data found
const FALLBACK_REVIEWS: Review[] = [];

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
        <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background - Neon Portal Warp Grid */}
            <div className="absolute inset-0 z-0">
                <WarpBackground className="w-full h-full" gridColor="rgba(34, 211, 238, 0.4)" />
                <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
            </div>

            {/* Simple Back Button wrapped for layout */}
            <div className="fixed top-4 left-4 z-50">
                <Link href="https://muddy-nautilus-ad8.notion.site/nano-banana-pro-the-creative-amplifier?source=copy_link">
                    <Button variant="ghost" className="text-white hover:text-cyan-300 hover:bg-white/10 gap-2 backdrop-blur-sm bg-black/20 border border-white/5 rounded-full px-4">
                        <ArrowLeft size={16} />
                        Take me back to Alignment Resources
                    </Button>
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-[1400px] border border-slate-800 rounded-xl overflow-hidden shadow-2xl bg-slate-900/50 backdrop-blur-sm">
                {reviews.length > 0 ? (
                    <TestimonialSlider reviews={reviews} />
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-8 space-y-6">
                        <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20 animate-pulse">
                            <ArrowLeft className="w-10 h-10 text-indigo-400 rotate-90" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-white">The Gallery is Empty... For Now!</h2>
                            <p className="text-lg text-slate-300 max-w-md mx-auto">
                                Be the first to share a moment from Tech Alley. <br />
                                Your photo will be featured here instantly.
                            </p>
                        </div>
                        <Link href="/photo-booth/upload">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-500/50 transition-all hover:scale-105">
                                Upload the First Photo
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
