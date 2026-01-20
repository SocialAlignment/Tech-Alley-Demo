"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GenAIQualifyForm, { GenAIFormData } from '@/components/ui/gen-ai-qualify-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useIdentity } from '@/context/IdentityContext';

export default function QualifyPage() {
    const { email, userName, isLoading, leadId } = useIdentity();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [scoreInfo, setScoreInfo] = useState<{ score: number, band: string } | null>(null);

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

            // Trigger Confetti
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#a855f7', '#ec4899', '#6366f1']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#a855f7', '#ec4899', '#6366f1']
                });

                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();

        } catch (e) {
            console.error(e);
            alert("Something went wrong. Please try again.");
            setStatus('idle');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center space-y-6"
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🚀</span>
                    </div>

                    <h1 className="text-3xl font-bold text-white">Power Up Complete!</h1>
                    <p className="text-slate-400 text-lg">
                        You just earned <span className="text-purple-400 font-bold">+5 Extra Entries</span> into the Sora 2 Raffle.
                    </p>

                    <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
                        <div className="text-xl font-bold text-white mb-2">Signal Received</div>
                        <p className="text-sm text-slate-400">
                            Your profile has been analyzed and logged. We've prepared personalized resources for you based on your answers.
                        </p>
                    </div>

                    <p className="text-sm text-slate-500">
                        Check your SMS in ~5 mins for your personalized resources.
                    </p>

                    <Link href="https://socialalignment.biz" target="_blank" className="block">
                        <Button className="w-full h-12 bg-white text-black hover:bg-slate-200 font-bold rounded-xl">
                            Continue to SocialAlignment.biz <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 bg-gradient-to-b from-slate-900 to-black py-12 px-4">
            <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <Link href="/demo/success">
                    <Button variant="ghost" className="text-slate-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </Link>
                <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Connected as</div>
                    <div className="text-sm font-bold text-white flex items-center gap-2 justify-end">
                        {isLoading ? (
                            <span className="text-slate-400 animate-pulse">Connecting...</span>
                        ) : (userName || email) ? (
                            <>
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                                {userName || email}
                            </>
                        ) : (
                            <span className="text-amber-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500/50" />
                                Guest (No ID: {leadId || 'None'})
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-center mb-10 space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                    Max Signal Qualifier
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Complete this creative brief to earn <span className="text-white font-bold">+5 Raffle Entries</span> and unlock personalized AI video resources tailored to your exact business stage.
                </p>
            </div>

            <GenAIQualifyForm onSubmit={handleSubmit} isSubmitting={status === 'submitting'} />

            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
            </div>
        </div>
    );
}
