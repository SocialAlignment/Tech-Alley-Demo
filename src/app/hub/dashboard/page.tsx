"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIdentity } from '@/context/IdentityContext';
import HubLandingNavbar from '@/components/hub/hub-landing-navbar';
import AIExecutiveDashboardWizard from '@/components/ui/ai-executive-dashboard-wizard';
import { ArrowRight, LayoutDashboard, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardIntakePage() {
    const { leadId, userName } = useIdentity();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        // Simulate API call for now or hook up to Supabase later
        console.log("Dashboard Form Data:", data);

        // TODO: Persist to Supabase/Notion
        setTimeout(() => {
            setIsSubmitting(false);
            setIsComplete(true);
        }, 1500);
    };

    if (isComplete) {
        return (
            <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-violet-500/30 selection:text-violet-200">
                <HubLandingNavbar />
                <div className="max-w-4xl mx-auto px-6 py-32 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="h-24 w-24 rounded-full bg-violet-500/10 mx-auto flex items-center justify-center border border-violet-500/20 shadow-[0_0_50px_rgba(167,139,250,0.2)]">
                        <LayoutDashboard className="w-12 h-12 text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Assessment <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Complete</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Thank you, <span className="text-white">{userName}</span>. We are analyzing your data sources and blind spots. A preview of your Executive Strategy will be sent shortly.
                        </p>
                    </div>
                    <div className="pt-8">
                        <button onClick={() => window.location.href = "/hub"} className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium tracking-wide">
                            Return to Hub
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">
            <HubLandingNavbar />

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left Column: Hero & Value Prop */}
                    <div className="space-y-12 lg:sticky lg:top-32 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-900/30 border border-violet-500/30 text-violet-300 text-xs font-medium tracking-wide uppercase">
                                <Zap className="w-3 h-3" /> Executive Intelligence
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                                Stop Guessing. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">Start Knowing.</span>
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
                                You shouldn't have to ask "how are sales?" Turn your disparate data (Salesforce, Sheets, Ads) into a single source of truth.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-4 items-start">
                                <div className="h-10 w-10 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center shrink-0">
                                    <Target className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Identify Blind Spots</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mt-1">
                                        We find the metrics that actually drive revenue, not just the vanity numbers.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="h-10 w-10 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center shrink-0">
                                    <LayoutDashboard className="w-5 h-5 text-fuchsia-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Command Center View</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mt-1">
                                        Designed for the C-Suite. Zero clutter. Just the pulse of your business.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-lg">
                                    AI
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-400">Powered by</div>
                                    <div className="text-lg font-bold text-white">Ops Intelligence Engine</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Wizard Form */}
                    <div className="w-full animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                        <AIExecutiveDashboardWizard
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            initialValues={{}}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
