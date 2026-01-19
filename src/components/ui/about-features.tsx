import React from "react";
import { Lightbulb, Network, Mic2, Gift, MessageSquare, Compass, LucideIcon } from "lucide-react";

interface Feature {
    title: string;
    description: string;
    icon: LucideIcon;
}

const features: Feature[] = [
    {
        title: "Startup Spotlight",
        description: "Learn more about this month's featured Startup.",
        icon: Lightbulb,
    },
    {
        title: "Next Level Networking",
        description: "Complete your social profile to experience the Tech Alley Henderson community like never before.",
        icon: Network,
    },
    {
        title: "Guest Speaker Resources",
        description: "Learn more about tonight's speakers, download their presentations and get resources exclusive to tonight's event.",
        icon: Mic2,
    },
    {
        title: "Giveaways",
        description: "Be sure to enter the Hub Raffle each month to earn a chance to win sponsored prizes.", // Removed parenthetical to clean up
        icon: Gift,
    },
    {
        title: "Let your voices be heard",
        description: "Interact with tonight's event by asking questions and/or leaving feedback related to tonight's event.",
        icon: MessageSquare,
    },
    {
        title: "Interactive Mission Hub",
        description: "Make tonight count by completing live micro-missions in the Hub—unlock content, earn perks, and enrich connections.",
        icon: Compass,
    },
];

export function AboutFeatures() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center text-center group"
                    >
                        <div className="mb-6 p-4 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:scale-110 shadow-sm group-hover:shadow-lg">
                            <feature.icon size={48} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                            {feature.title}
                        </h3>
                        <p className="text-slate-500 leading-relaxed max-w-sm">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
