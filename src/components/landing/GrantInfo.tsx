"use client";

import { CheckCircle2, XCircle } from "lucide-react";

export function GrantInfo() {
    return (
        <section className="py-24 bg-slate-950/50 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Here Is What You Get</h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        We aren't just giving you "advice". We are building the infrastructure for your future.
                        Here is the exact value stack for grant winners.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* The Stack */}
                    <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        {/* Header Row */}
                        <div className="grid grid-cols-12 bg-white/5 border-b border-white/5 p-4 text-xs font-bold text-slate-500 uppercase tracking-widest hidden md:grid">
                            <div className="col-span-8 px-4">Deliverable</div>
                            <div className="col-span-4 text-right px-4">Real Market Value</div>
                        </div>

                        {/* Item 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/5 p-6 md:p-8 hover:bg-white/[0.02] transition-colors items-center gap-4">
                            <div className="col-span-8 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                                    <span className="font-bold text-violet-400">01</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Full AI Architecture Audit</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        We deep-dive into your current workflows, tech stack, and bottlenecks to identify exactly where AI can 10x your output.
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-4 flex items-center md:justify-end">
                                <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2">
                                    <span className="font-mono text-white">$2,500.00</span>
                                </div>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/5 p-6 md:p-8 hover:bg-white/[0.02] transition-colors items-center gap-4">
                            <div className="col-span-8 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                                    <span className="font-bold text-violet-400">02</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Custom Automation Blueprint</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        A complete, engineer-ready schematic of your new AI-powered systems. No guesswork. Just a clear plan of action.
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-4 flex items-center md:justify-end">
                                <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2">
                                    <span className="font-mono text-white">$5,000.00</span>
                                </div>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/5 p-6 md:p-8 hover:bg-white/[0.02] transition-colors items-center gap-4">
                            <div className="col-span-8 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                                    <span className="font-bold text-violet-400">03</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Hands-On Implementation Roadmap</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Step-by-step execution guide. Use internal teams or hand it to us. It's the "instruction manual" for your business growth.
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-4 flex items-center md:justify-end">
                                <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2">
                                    <span className="font-mono text-white">$2,500.00</span>
                                </div>
                            </div>
                        </div>

                        {/* Item 4 */}
                        <div className="grid grid-cols-1 md:grid-cols-12 p-6 md:p-8 hover:bg-white/[0.02] transition-colors items-center gap-4">
                            <div className="col-span-8 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                                    <span className="font-bold text-violet-400">04</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">1-on-1 Strategy Session</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Sit down with our lead architects to align your business goals with the new technology.
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-4 flex items-center md:justify-end">
                                <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2">
                                    <span className="font-mono text-white">$1,000.00</span>
                                </div>
                            </div>
                        </div>

                        {/* Total Value Bar */}
                        <div className="bg-violet-600 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-white">
                                <div className="font-bold text-sm uppercase opacity-80 tracking-wide">Total Value To You</div>
                                <div className="text-3xl font-bold">Over $11,000</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden md:block">
                                    <div className="text-violet-200 text-sm font-medium">Cost For Winners</div>
                                    <div className="text-white text-2xl font-bold">Free</div>
                                </div>
                                <button
                                    className="bg-white text-violet-700 hover:bg-violet-50 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
                                    onClick={() => document.getElementById('grant-application-form')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    Claim This Grant
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500">
                            * Applications are reviewed on a rolling basis. The sooner you apply, the better.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
