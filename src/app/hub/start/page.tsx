"use client";

import { AboutFeatures } from "@/components/ui/about-features";
import AboutHero from "@/components/ui/about-hero";

export default function StartHerePage() {
    return (
        <div className="w-full h-full overflow-y-auto p-8 bg-white/50 rounded-[32px]">
            <AboutHero />
            <div className="my-12 w-full h-px bg-slate-200/50" />
            <AboutFeatures />
        </div>
    );
}
