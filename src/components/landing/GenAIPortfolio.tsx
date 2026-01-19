"use client";

import { ThreeDCarousel } from "@/components/ui/feature-carousel";

interface GenAIPortfolioProps {
    videos: { src: string; alt: string; poster?: string }[];
}

export function GenAIPortfolio({ videos }: GenAIPortfolioProps) {
    return (
        <section id="portfolio" className="relative w-full py-24 bg-slate-950/50 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        See GenAI Videos in Action
                    </h2>
                    <p className="text-slate-400 max-w-2xl text-lg">
                        Swipe through social-ready clips, hooks, and explainer formats built with GenAI workflows.
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="w-full max-w-6xl mx-auto">
                    <ThreeDCarousel videos={videos} />
                </div>
            </div>
        </section>
    );
}
