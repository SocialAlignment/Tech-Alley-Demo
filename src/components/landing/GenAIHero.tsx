"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, PlayCircle } from "lucide-react";
import Image from "next/image";

export function GenAIHero() {
    return (
        <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-20">
            {/* Background Ambience */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Radial Gradient Top Left */}
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-blue-600/10 blur-[120px]" />
                {/* Radial Gradient Bottom Right */}
                <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <div className="flex flex-col items-start space-y-6 max-w-2xl">
                    {/* Eyebrow */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs font-semibold tracking-wide text-blue-400 uppercase">
                            GenAI Social-First Video Studio
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                        Elevate Your Brand with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">GenAI Video</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-lg">
                        Transform your social presence with high-output,<br />
                        AI-accelerated video content. increasing engagement<br />
                        and production speed by 10x.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 h-12 text-base shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all hover:scale-105"
                            onClick={() => window.location.href = '/hub/raffle'}
                        >
                            🎁 Enter GenAI Video Raffle
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-white text-slate-900 border-white hover:bg-slate-200 hover:text-slate-900 rounded-full px-8 h-12 text-base font-medium"
                            onClick={() => window.open('https://cal.com/jonathans-alignment/30min', '_blank')}
                        >
                            📅 Book Discovery Call
                        </Button>
                    </div>

                    {/* Reassurance */}
                    <p className="text-xs text-slate-500 pl-2">
                        No fluff. Concrete ideas to upgrade your content in 7 days or less.
                    </p>
                </div>

                {/* Right: Visual (Dashboard/Mockup) */}
                <div className="relative w-full perspective-1000 hidden lg:block">
                    <div className="relative z-10 bg-slate-900/50 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-[0deg] hover:rotate-x-[0deg] transition-all duration-700">
                        {/* Mock Video Element */}
                        <div className="aspect-video w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden relative flex items-center justify-center group cursor-pointer group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626544827763-d516dce335ca?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-60"></div>
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center z-20 transition-transform duration-300 group-hover:scale-110">
                                <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                            </div>

                            {/* Sub-cards mimicking "dashboard" stats */}
                            <div className="absolute bottom-4 left-4 right-4 flex gap-4">
                                <div className="bg-black/60 backdrop-blur-md rounded-lg p-2.5 flex-1 border border-white/5">
                                    <div className="h-1.5 w-12 bg-blue-500 rounded-full mb-1.5" />
                                    <div className="h-1.5 w-20 bg-slate-600 rounded-full" />
                                </div>
                                <div className="bg-black/60 backdrop-blur-md rounded-lg p-2.5 flex-1 border border-white/5">
                                    <div className="h-1.5 w-16 bg-green-500 rounded-full mb-1.5" />
                                    <div className="h-1.5 w-10 bg-slate-600 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements around the card */}
                        <div className="absolute -z-10 top-10 -right-10 w-24 h-24 bg-blue-500/20 blur-2xl rounded-full" />
                        <div className="absolute -z-10 -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 blur-2xl rounded-full" />
                    </div>
                </div>

                {/* Mobile Visual (Simplified) */}
                <div className="lg:hidden w-full mt-8">
                    <div className="relative w-full aspect-video bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                        {/* Same visual simplified */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626544827763-d516dce335ca?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <PlayCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
