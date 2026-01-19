"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ScanLine, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function MRIHero() {
    return (
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#020817] pt-20">
            {/* Background Ambience - Cyan/Blue Theme */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Scanner Line Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.1)_50%,transparent_100%)] h-[200%] w-full animate-scan" />

                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-cyan-500/10 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <div className="flex flex-col items-start space-y-8 max-w-2xl">
                    {/* Eyebrow */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-semibold tracking-wide text-cyan-400 uppercase">
                            Business Intelligence Audit
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                        See Inside Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Business
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-lg">
                        Identify bottlenecks, tech waste, and opportunities to reclaim <span className="text-white font-semibold">10+ hours a week</span> with our deep-dive AI MRI.
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
                        <Button
                            size="lg"
                            className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full px-8 h-12 text-base shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] transition-all hover:scale-105"
                            onClick={() => document.getElementById('ai-mri-wizard')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <ScanLine className="w-4 h-4 mr-2" /> Start Free Audit
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-slate-500 px-2 h-12">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-950" />
                                <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-950" />
                                <div className="w-6 h-6 rounded-full bg-slate-600 border-2 border-slate-950" />
                            </div>
                            <span>50+ Audits Completed</span>
                        </div>
                    </div>
                </div>

                {/* Right: Visual (Scanner Interface) */}
                <div className="relative w-full h-[400px] lg:h-[600px] flex items-center justify-center hidden lg:flex">
                    {/* Floating Holographic Interface */}
                    <div className="relative w-96 h-80 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6 flex flex-col gap-4 shadow-[0_0_50px_-10px_rgba(6,182,212,0.2)]">
                        {/* Header UI */}
                        <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4">
                            <div className="font-mono text-cyan-400 text-xs">SYSTEM_DIAGNOSTIC_V2.0</div>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
                            </div>
                        </div>

                        {/* Body UI */}
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="bg-cyan-500/5 rounded p-3 border border-cyan-500/10">
                                <div className="text-xs text-slate-400 mb-1">EFFICIENCY</div>
                                <div className="text-2xl font-bold text-white">42%</div>
                                <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                                    <div className="bg-red-500 h-full w-[42%]" />
                                </div>
                            </div>
                            <div className="bg-cyan-500/5 rounded p-3 border border-cyan-500/10">
                                <div className="text-xs text-slate-400 mb-1">WASTE</div>
                                <div className="text-2xl font-bold text-white">$2.4k</div>
                                <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full w-[65%]" />
                                </div>
                            </div>

                            {/* Scanning Graph */}
                            <div className="col-span-2 bg-slate-950/50 rounded h-24 relative overflow-hidden flex items-end p-2 gap-1">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex-1 bg-cyan-500/20 rounded-t-sm"
                                        initial={{ height: "20%" }}
                                        animate={{ height: ["20%", "80%", "40%"] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.5,
                                            delay: i * 0.1,
                                            repeatType: "reverse"
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Orbital Rings */}
                    <div className="absolute inset-0 border border-cyan-500/10 rounded-full scale-[1.2] animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-0 border border-dashed border-cyan-500/10 rounded-full scale-[1.4] animate-[spin_15s_linear_infinite_reverse]" />
                </div>
            </div>
        </section>
    );
}
