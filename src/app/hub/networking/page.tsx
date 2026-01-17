"use client";

import { CardStack, CardStackItem } from "@/components/ui/card-stack";

const items: CardStackItem[] = [
    {
        id: 1,
        title: "Luxury Performance",
        description: "Experience the thrill of precision engineering",
        imageSrc: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5960?q=80&w=1000",
        href: "https://example.com",
    },
    {
        id: 2,
        title: "Elegant Design",
        description: "Where beauty meets functionality",
        imageSrc: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000",
        href: "https://example.com",
    },
    {
        id: 3,
        title: "Power & Speed",
        description: "Unleash the true potential of the road",
        imageSrc: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000",
        href: "https://example.com",
    },
    {
        id: 4,
        title: "Timeless Craftsmanship",
        description: "Built with passion, driven by excellence",
        imageSrc: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=1000",
        href: "https://example.com",
    },
    {
        id: 5,
        title: "Future of Mobility",
        description: "Innovation that moves you forward",
        imageSrc: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000",
        href: "https://example.com",
    },
];

export default function NetworkingAlignmentPage() {
    return (
        <div className="w-full h-full p-8 flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Networking Alignment</h1>
                <p className="text-slate-500 mt-2">
                    Connect with like-minded professionals using our interactive card system.
                </p>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-5xl">
                    <CardStack
                        items={items}
                        initialIndex={0}
                        autoAdvance
                        intervalMs={2000}
                        pauseOnHover
                        showDots
                    />
                </div>
            </div>
        </div>
    );
}
