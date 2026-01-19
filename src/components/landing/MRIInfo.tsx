"use client";

import { Clock, DollarSign, Lightbulb } from "lucide-react";

export function MRIInfo() {
    return (
        <section className="py-24 bg-[#020817] relative border-t border-white/5">
            <div className="container mx-auto px-6 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Content/Values */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                Stop Guessing. <br /> Start Knowing.
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                Most businesses lose 20% of their revenue to invisible inefficiencies. Our AI MRI scans your entire operation and generates a comprehensive report in minutes.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                                    <Clock className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Time Analysis</h3>
                                    <p className="text-slate-400 text-sm">See exactly how many hours your team is wasting on low-value tasks.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                                    <DollarSign className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Tech Stack Audit</h3>
                                    <p className="text-slate-400 text-sm">Find out which subscriptions are a waste of money and what tools you are missing.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                                    <Lightbulb className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">AI Opportunity Score</h3>
                                    <p className="text-slate-400 text-sm">Get a quantified score of how "AI Ready" your business is right now.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sample Report Visual */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-cyan-500/20 blur-2xl rounded-3xl opacity-20" />
                        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                            {/* Report Header */}
                            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                                <div className="flex gap-2 items-center">
                                    <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center font-bold text-white text-xs">SA</div>
                                    <span className="font-bold text-white text-sm">OFFICIAL AUDIT REPORT</span>
                                </div>
                                <div className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded font-mono">
                                    STATUS: COMPLETED
                                </div>
                            </div>

                            {/* Report Body Mockup */}
                            <div className="space-y-4">
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Estimated Waste</div>
                                    <div className="text-3xl font-bold text-red-500">$24,500 <span className="text-sm text-slate-500 font-normal">/ year</span></div>
                                </div>

                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Recommended Actions</div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <div className="w-4 h-4 rounded-full border border-cyan-500 flex items-center justify-center text-[10px] text-cyan-500">1</div>
                                            <span>Consolidate CRMs</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <div className="w-4 h-4 rounded-full border border-cyan-500 flex items-center justify-center text-[10px] text-cyan-500">2</div>
                                            <span>Automate Lead Entry</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <div className="w-4 h-4 rounded-full border border-cyan-500 flex items-center justify-center text-[10px] text-cyan-500">3</div>
                                            <span>Implement AI Chatbot</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
                                <button
                                    className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform"
                                    onClick={() => document.getElementById('ai-mri-wizard')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    Get Your Report
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
