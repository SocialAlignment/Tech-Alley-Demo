'use client';

import React from "react";
import StartNavbar from "@/components/start/StartNavbar";
import StartHero from "@/components/start/StartHero";
import StartGrid from "@/components/start/StartGrid";
import StartSection from "@/components/start/StartSection";
import {
    Rocket, Users, Mic2, Gift, MessageSquare,
    Compass, BookOpen
} from "lucide-react";
import Link from 'next/link';

export default function StartHerePage() {
    return (
        <div className="w-full min-h-screen bg-[#020617] text-slate-200">
            <StartNavbar />
            <StartHero />
            <StartGrid />

            {/* --- SECTIONS --- */}

            {/* Startup Spotlight */}
            <StartSection
                id="section-spotlight"
                title="Startup Spotlight"
                subtitle="This Month's Featured Innovator"
                icon={Rocket}
                color="cyan"
            >
                <div>
                    <p className="text-lg text-slate-300 mb-6">Learn more about this month's featured Startup.</p>
                    <Link href="/hub/spotlight">
                        <button className="px-6 py-3 bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold uppercase tracking-wider hover:bg-cyan-500 hover:text-slate-900 transition-all rounded-lg">
                            View Spotlight
                        </button>
                    </Link>
                </div>
            </StartSection>

            {/* Next Level Networking */}
            <StartSection
                id="section-networking"
                title="Next Level Networking"
                subtitle="Complete Your Profile & Connect"
                icon={Users}
                color="purple"
            >
                <div>
                    <p className="text-lg text-slate-300 mb-6">Complete your social profile to experience the Tech Alley Henderson community like never before.</p>
                    <Link href="/hub/profile/qualify">
                        <button className="px-6 py-3 bg-violet-950 border border-violet-500/30 text-violet-400 font-bold uppercase tracking-wider hover:bg-violet-500 hover:text-white transition-all rounded-lg">
                            Complete Profile
                        </button>
                    </Link>
                </div>
            </StartSection>

            {/* Guest Speaker Resources */}
            <StartSection
                id="section-speakers"
                title="Guest Speaker Resources"
                subtitle="Slides, Links & Takeaways"
                icon={Mic2}
                color="magenta"
            >
                <div>
                    <p className="text-lg text-slate-300 mb-6">Learn more about tonight's speakers, download their presentations and get resources exclusive to tonight's event.</p>
                    <Link href="/hub/speaker-resources">
                        <button className="px-6 py-3 bg-fuchsia-950 border border-fuchsia-500/30 text-fuchsia-400 font-bold uppercase tracking-wider hover:bg-fuchsia-500 hover:text-white transition-all rounded-lg">
                            View Resources
                        </button>
                    </Link>
                </div>
            </StartSection>

            {/* Giveaways */}
            <StartSection
                id="section-raffle"
                title="Giveaways"
                subtitle="Win Exclusive Prizes"
                icon={Gift}
                color="lime"
            >
                <div>
                    <p className="text-lg text-slate-300 mb-6">Be sure to enter the Hub Raffle each month to earn a chance to win sponsored prizes.</p>
                    <Link href="/genai-raffle">
                        <button className="px-6 py-3 bg-lime-950 border border-lime-500/30 text-lime-400 font-bold uppercase tracking-wider hover:bg-lime-500 hover:text-slate-900 transition-all rounded-lg">
                            Enter Raffle
                        </button>
                    </Link>
                </div>
            </StartSection>

            {/* Interactive Mission Hub */}
            <StartSection
                id="section-mission"
                title="Interactive Mission Hub"
                subtitle="Earn XP & Unlock Perks"
                icon={Compass}
                color="orange"
            >
                <div>
                    <p className="text-lg text-slate-300 mb-6">Make tonight count by completing live micro-missions in the Hub—unlock content, earn perks, and enrich connections.</p>
                    <Link href="/hub/checklist">
                        <button className="px-6 py-3 bg-orange-950 border border-orange-500/30 text-orange-400 font-bold uppercase tracking-wider hover:bg-orange-500 hover:text-slate-900 transition-all rounded-lg">
                            Go To Missions
                        </button>
                    </Link>
                </div>
            </StartSection>

            {/* Feedback */}
            <StartSection
                id="section-feedback"
                title="Let Your Voices Be Heard"
                subtitle="Questions & Feedback"
                icon={MessageSquare}
                color="cyan"
            >
                <div>
                    <p className="text-lg text-slate-300 mb-6">Interact with tonight's event by asking questions and/or leaving feedback related to tonight's event.</p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/hub/feedback">
                            <button className="px-6 py-3 bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold uppercase tracking-wider hover:bg-cyan-500 hover:text-slate-900 transition-all rounded-lg">
                                Leave Feedback
                            </button>
                        </Link>
                        <Link href="/hub/ask-lorraine">
                            <button className="px-6 py-3 bg-transparent border border-slate-700 text-slate-300 font-bold uppercase tracking-wider hover:bg-slate-800 hover:text-white transition-all rounded-lg">
                                Ask A Question
                            </button>
                        </Link>
                    </div>
                </div>
            </StartSection>

            {/* Resources */}
            <StartSection
                id="section-resources"
                title="Resource Library"
                subtitle="Free Tools & Guides"
                icon={BookOpen}
                color="purple"
            >
                <div>
                    <p className="text-lg text-slate-300 mb-6">Access a library of free resources, guides, and tools to help you grow your business and skills.</p>
                    <Link href="/hub/resources">
                        <button className="px-6 py-3 bg-violet-950 border border-violet-500/30 text-violet-400 font-bold uppercase tracking-wider hover:bg-violet-500 hover:text-white transition-all rounded-lg">
                            Browse Library
                        </button>
                    </Link>
                </div>
            </StartSection>

            {/* Connect With Us */}
            <StartSection
                id="section-contact"
                title="Connect With Us"
                subtitle="Collaboration & Contact"
                icon={Users}
                color="magenta"
            >
                <div>
                    <p className="text-lg text-slate-300 mb-6">Interested in becoming a speaker, sponsor, or volunteer? We want to hear from you.</p>
                    <Link href="/hub/speaker-application">
                        <button className="px-6 py-3 bg-fuchsia-950 border border-fuchsia-500/30 text-fuchsia-400 font-bold uppercase tracking-wider hover:bg-fuchsia-500 hover:text-white transition-all rounded-lg">
                            Apply to Speak
                        </button>
                    </Link>
                </div>
            </StartSection>

            {/* Footer Padding */}
            <div className="h-32"></div>

        </div>
    );
}
