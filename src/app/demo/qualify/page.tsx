'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GenAIQualifyForm, { GenAIFormData } from '@/components/ui/gen-ai-qualify-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Confetti } from '@/components/ui/confetti';
import { useIdentity } from '@/context/IdentityContext';
import { useSearchParams } from 'next/navigation';
import { WarpBackground } from '@/components/ui/warp-background';
import { Liquid } from '@/components/ui/liquid-gradient';

export default function QualifyPage() {
    const { email, userName, isLoading: isIdentityLoading, leadId: ctxLeadId } = useIdentity();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [scoreInfo, setScoreInfo] = useState<{ score: number, band: string } | null>(null);
    const [initialAlignmentStatement, setInitialAlignmentStatement] = useState('');
    const [initialName, setInitialName] = useState(userName || '');
    const [initialEmail, setInitialEmail] = useState(email || '');

    // Update state when context loads if not already set
    useEffect(() => {
        if (!initialName && userName) setInitialName(userName);
        if (!initialEmail && email) setInitialEmail(email);
    }, [userName, email]);

    // Fetch Alignment Statement
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || ctxLeadId;

    useEffect(() => {
        if (!id) return;

        const fetchEntry = async () => {
            try {
                const res = await fetch(`/api/demo/get-entry?id=${id}`);
                if (res.ok) {
                    const data = await res.json();
                    // Try to finding the statement in common variations
                    if (data.entry) {
                        setInitialAlignmentStatement(
                            data.entry.core_alignment_statement ||
                            data.entry.coreAlignmentStatement ||
                            data.entry.profile_data?.coreAlignmentStatement ||
                            ''
                        );
                        if (data.entry.name) setInitialName(data.entry.name);
                        if (data.entry.email) setInitialEmail(data.entry.email);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch entry for alignment statement", e);
            }
        };

        fetchEntry();
    }, [id]);

    const handleSubmit = async (data: GenAIFormData) => {
        setStatus('submitting');
        try {
            const res = await fetch('/api/demo/qualify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error("Failed to submit");

            const json = await res.json();
            setScoreInfo(json);
            setStatus('success');

        } catch (e) {
            console.error(e);
            alert("Something went wrong. Please try again.");
            setStatus('idle');
        }
    };

    if (status === 'success') {
        return (
            <main className="relative w-full h-[100dvh] overflow-hidden bg-[#02040a] font-sans selection:bg-green-500/30">
                {/* --- AMBIENT BACKGROUND --- */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <WarpBackground
                        perspective={100}
                        beamsPerSide={3}
                        beamSize={5}
                        beamDelayMax={3}
                        beamDuration={4}
                        gridColor="rgba(16, 185, 129, 0.1)" // Green grid
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-4 px-4 gap-6 md:gap-8">

                    {/* TOP: Identity Verified Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="px-3 py-1 rounded-full bg-green-950/30 border border-green-500/20 backdrop-blur-md flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                    >
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_#4ade80]" />
                        <span className="text-green-100/90 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold text-shadow-sm">
                            Signal Received
                        </span>
                    </motion.div>

                    {/* HEADLINE */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="text-center space-y-2"
                    >
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-green-100 tracking-tighter leading-none drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                            Alignment Completed.
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
                            You've unlocked customized resources and increased your winning odds.
                        </p>
                    </motion.div>

                    {/* CARD: ENTRIES REWARD */}
                    <motion.div
                        initial={{ opacity: 0, rotateX: 20, y: 20 }}
                        animate={{ opacity: 1, rotateX: 0, y: 0 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                        className="relative w-full max-w-[320px] md:max-w-[380px] h-[180px] md:h-[220px]"
                    >
                        <div className="relative w-full h-full bg-gradient-to-br from-green-900/10 to-transparent backdrop-blur-xl border border-green-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.15)] group">
                            {/* Gloss */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50 pointer-events-none" />

                            {/* Content */}
                            <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center">
                                <div className="text-[10px] font-mono text-green-400 uppercase tracking-widest mb-2 border border-green-500/30 px-2 py-0.5 rounded bg-green-950/50">Bonus Activated</div>

                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-6xl md:text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]">+5</span>
                                    <span className="text-lg text-green-200 font-bold uppercase tracking-wider">Entries</span>
                                </div>

                                {/* Progress */}
                                <div className="relative w-32 h-1.5 bg-white/10 rounded-full overflow-hidden mt-6">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
                                        className="h-full bg-green-400 shadow-[0_0_10px_#4ade80]"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA BUTTON */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="w-full max-w-sm h-16 relative z-[100]"
                    >
                        <Link href="https://socialalignment.biz" target="_blank" className="block w-full h-full relative group">
                            <div className="absolute inset-0 rounded-md overflow-hidden transform group-hover:scale-105 transition-transform duration-500 shadow-xl shadow-green-900/20">
                                <Liquid isHovered={true} colors={{
                                    color1: '#059669', // Emerald 600
                                    color2: '#047857', // Emerald 700
                                    color3: '#10b981', // Emerald 500
                                    color4: '#34d399', // Emerald 400
                                    color5: '#065f46', // Emerald 800
                                    color6: '#6ee7b7', // Emerald 300
                                    color7: '#059669',
                                    color8: '#059669',
                                    color9: '#059669',
                                    color10: '#059669',
                                    color11: '#059669',
                                    color12: '#059669',
                                    color13: '#059669',
                                    color14: '#059669',
                                    color15: '#059669',
                                    color16: '#059669',
                                    color17: '#059669',
                                }} />
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center gap-2 z-10 px-4">
                                <span className="text-white font-bold uppercase tracking-widest text-sm md:text-base drop-shadow-md">
                                    Continue to SocialAlignment.biz
                                </span>
                                <ArrowRight className="w-5 h-5 text-white stroke-[3px] group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>

                    {/* CONFETTI (Both Sides) */}
                    <Confetti
                        className="fixed inset-0 w-full h-full pointer-events-none z-[100]"
                        manualstart={false}
                        options={{
                            particleCount: 50,
                            spread: 60,
                            origin: { x: 0, y: 0.6 }, // Left side
                            colors: ['#34d399', '#10b981', '#06b6d4']
                        }}
                    />
                    <Confetti
                        className="fixed inset-0 w-full h-full pointer-events-none z-[100]"
                        manualstart={false}
                        options={{
                            particleCount: 50,
                            spread: 60,
                            origin: { x: 1, y: 0.6 }, // Right side
                            colors: ['#34d399', '#10b981', '#06b6d4']
                        }}
                    />

                    {/* HUD Footer */}
                    <div className="absolute bottom-4 text-center text-[10px] text-slate-500 font-mono uppercase tracking-widest opacity-50">
                        Check your SMS in ~5 mins for resources
                    </div>
                </div>
            </main>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 bg-gradient-to-b from-slate-900 to-black py-12 px-4 selection:bg-teal-500/30">
            <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <Link href="/demo/success">
                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </Link>
                <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Connected as</div>
                    <div className="text-sm font-bold text-white flex items-center gap-2 justify-end">
                        {isIdentityLoading ? (
                            <span className="text-slate-400 animate-pulse">Connecting...</span>
                        ) : (userName || email) ? (
                            <>
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                                {userName || email}
                            </>
                        ) : (
                            <span className="text-amber-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500/50" />
                                Guest (No ID)
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-center mb-10 space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-green-400 to-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                    Win a 1:1 <br className="md:hidden" /> GenAI Video Session
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Complete this creative brief to earn <span className="text-white font-bold whitespace-nowrap block md:inline">+5 Raffle Entries</span> and unlock <br className="hidden md:inline" /> personalized GenAI resources aligned to your exact business stage.
                </p>
            </div>

            <GenAIQualifyForm
                onSubmit={handleSubmit}
                isSubmitting={status === 'submitting'}
                initialAlignmentStatement={initialAlignmentStatement}
                initialName={initialName}
                initialEmail={initialEmail}
            />

            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[100px]" />
            </div>
        </div>
    );
}
