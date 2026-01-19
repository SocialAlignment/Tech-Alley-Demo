"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Star } from "lucide-react";
import { motion } from "framer-motion";

export function GrantHero() {
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-slate-950 pt-32 pb-20">
            {/* Background Ambience - Violet/Deep Space Theme */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center max-w-5xl">

                {/* 1. Hook / Headline */}
                <div className="mb-8 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mx-auto">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold tracking-wide text-amber-400 uppercase">
                            Accepting Applications for Batch #1
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                        We Will Build Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300">
                            AI Systems For Free
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        If you are selected, we will personally design, build, and implement a complete <span className="text-white font-semibold">AI Automation Architecture</span> for your business.
                    </p>
                </div>

                {/* 2. VSL Container (Video Sales Letter) */}
                <div className="w-full max-w-4xl aspect-video bg-slate-900 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group mb-12">
                    {/* Placeholder Image/Ambience */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-violet-950/50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                        </div>
                    </div>
                    {/* "Mission Briefing" Overlay */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded text-xs font-mono text-violet-300 border border-violet-500/30">
                        MISSION BRIEFING // TOP SECRET
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded text-xs font-mono text-slate-400">
                        02:45
                    </div>
                </div>

                {/* 3. CTA & Urgency */}
                <div className="flex flex-col items-center gap-4">
                    <Button
                        size="lg"
                        className="bg-violet-600 hover:bg-violet-500 text-white rounded-full px-12 h-14 text-lg font-bold shadow-[0_0_30px_-5px_rgba(139,92,246,0.6)] hover:shadow-[0_0_40px_-5px_rgba(139,92,246,0.8)] transition-all hover:scale-105"
                        onClick={() => document.getElementById('grant-application-form')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        🚀 Apply For The Grant
                    </Button>
                    <p className="text-sm text-slate-500">
                        <span className="text-amber-400 font-semibold">Warning:</span> Only 5 spots available for this cohort.
                    </p>
                </div>

            </div>
        </section>
    );
}
