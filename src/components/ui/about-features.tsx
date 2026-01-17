"use client";

import React from "react";
import { Rocket, Users, Mic, Gift, MessageSquare, Target } from "lucide-react";

export default function AboutFeatures() {
    return (
        <section className="py-16">
            <h1 className="text-3xl font-semibold text-center mx-auto text-slate-800">About the Hub</h1>
            <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
                A visual collection of our most recent works - each piece crafted with intention, emotion and style.
            </p>
            <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 px-8 md:px-0 pt-16">
                <div className="size-[520px] -top-80 left-1/2 -translate-x-1/2 rounded-full absolute blur-[300px] -z-10 bg-blue-100"></div>

                {/* Feature 1: Startup Spotlight */}
                <div>
                    <div className="size-10 p-2 bg-blue-50 border border-blue-200 rounded flex items-center justify-center text-blue-600">
                        <Rocket size={20} />
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-600">Startup Spotlight</h3>
                        <p className="text-sm text-slate-500">Learn more about this month's featured Startup.</p>
                    </div>
                </div>

                {/* Feature 2: Next Level Networking */}
                <div>
                    <div className="size-10 p-2 bg-blue-50 border border-blue-200 rounded flex items-center justify-center text-blue-600">
                        <Users size={20} />
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-600">Next Level Networking</h3>
                        <p className="text-sm text-slate-500">Complete your social profile to experience the Tech Alley Henderson community like never before.</p>
                    </div>
                </div>

                {/* Feature 3: Guest Speaker Resources */}
                <div>
                    <div className="size-10 p-2 bg-blue-50 border border-blue-200 rounded flex items-center justify-center text-blue-600">
                        <Mic size={20} />
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-600">Guest Speaker Resources</h3>
                        <p className="text-sm text-slate-500">Learn more about tonight's speakers, download their presentations and get resources exclusive to tonight's event.</p>
                    </div>
                </div>

                {/* Feature 4: Giveaways */}
                <div>
                    <div className="size-10 p-2 bg-blue-50 border border-blue-200 rounded flex items-center justify-center text-blue-600">
                        <Gift size={20} />
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-600">Giveaways</h3>
                        <p className="text-sm text-slate-500">Be sure to enter the Hub Raffle each month to earn a chance to win sponsored prizes. (Better odds than the slots)</p>
                    </div>
                </div>

                {/* Feature 5: Let your voices be heard */}
                <div>
                    <div className="size-10 p-2 bg-blue-50 border border-blue-200 rounded flex items-center justify-center text-blue-600">
                        <MessageSquare size={20} />
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-600">Let your voices be heard</h3>
                        <p className="text-sm text-slate-500">Interact with tonight's event by asking questions and/or leaving feedback related to tonight's event.</p>
                    </div>
                </div>

                {/* Feature 6: Interactive Mission Hub */}
                <div>
                    <div className="size-10 p-2 bg-blue-50 border border-blue-200 rounded flex items-center justify-center text-blue-600">
                        <Target size={20} />
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-600">Interactive Mission Hub</h3>
                        <p className="text-sm text-slate-500">Make tonight count by completing live micro‑missions in the Hub—unlock content, earn perks, and enrich connections as you move through the event.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
