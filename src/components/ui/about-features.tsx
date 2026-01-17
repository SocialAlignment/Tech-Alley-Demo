import React from "react";
import Image from "next/image";

const features = [
    {
        title: "Startup Spotlight",
        description: "Learn more about this month's featured Startup.",
        icon: "/features/startup.png",
    },
    {
        title: "Next Level Networking",
        description: "Complete your social profile to experience the Tech Alley Henderson community like never before.",
        icon: "/features/networking.png",
    },
    {
        title: "Guest Speaker Resources",
        description: "Learn more about tonight's speakers, download their presentations and get resources exclusive to tonight's event.",
        icon: "/features/speakers.png",
    },
    {
        title: "Giveaways",
        description: "Be sure to enter the Hub Raffle each month to earn a chance to win sponsored prizes. (Better odds than the slots)",
        icon: "/features/giveaways.png",
    },
    {
        title: "Let your voices be heard",
        description: "Interact with tonight's event by asking questions and/or leaving feedback related to tonight's event.",
        icon: "/features/voice.png",
    },
    {
        title: "Interactive Mission Hub",
        description: "Make tonight count by completing live micro-missions in the Hub—unlock content, earn perks, and enrich connections as you move through the event.",
        icon: "/features/mission.png",
    },
];

export function AboutFeatures() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-20 pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/50 border border-blue-100 hover:border-blue-300 transition-colors shadow-sm hover:shadow-md h-full"
                    >
                        <div className="h-48 w-48 mb-6 bg-white rounded-2xl flex items-center justify-center p-4 shadow-sm border border-slate-100">
                            <Image
                                src={feature.icon}
                                alt={feature.title}
                                width={192}
                                height={192}
                                className={`w-full h-full object-contain ${index === 4 ? "scale-150" : ""}`}
                                priority={index < 3}
                            />
                        </div>
                        {/* <h3 className="text-xl font-bold text-slate-900 mb-3 w-full">
                            {feature.title}
                        </h3> */}
                        <p className="text-slate-500 leading-relaxed max-w-sm">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
