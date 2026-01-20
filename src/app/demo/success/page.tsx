'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

import { Confetti } from '@/components/ui/confetti';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

import { useIdentity } from '@/context/IdentityContext';

export default function DemoSuccessPage() {
    const { userName } = useIdentity();
    const firstName = userName ? userName.split(' ')[0] : '';

    return (
        <main className="relative w-full min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center">

            <div className="absolute inset-0 pointer-events-none z-0">
                <Confetti
                    className="absolute inset-0 w-full h-full"
                    options={{
                        particleCount: 200,
                        spread: 120,
                        origin: { y: 0.6 },
                        colors: ['#22d3ee', '#818cf8', '#a78bfa', '#f472b6']
                    }}
                />
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 mx-4 w-full max-w-[900px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 md:p-14 rounded-[3rem] shadow-2xl text-center overflow-hidden"
            >
                {/* Subtle Gradient Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />

                {/* Brand Header */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-8 md:mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] shrink-0"
                    >
                        <Image
                            src="/tech-alley-henderson-transparent.png"
                            alt="Tech Alley Henderson"
                            fill
                            className="object-contain drop-shadow-[0_0_60px_rgba(168,85,247,0.5)]"
                            priority
                            sizes="(max-width: 768px) 280px, 350px"
                        />
                    </motion.div>
                </div>

                {/* Typography */}
                <h1 className="text-[36px] md:text-[64px] leading-tight font-black text-white mb-6 tracking-tight drop-shadow-sm">
                    {firstName ? `Thanks ${firstName},` : 'Thanks,'} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">You{"'"}re In!</span>
                </h1>

                <p className="text-[20px] md:text-[24px] leading-relaxed text-balance text-slate-200 font-medium mb-10">
                    We will see you at next month{"'"}s<br className="hidden md:block" />
                    <span className="whitespace-nowrap text-white font-semibold">Tech Alley Henderson meetup</span>. Same time, same place.
                </p>

                {/* Unified Giveway Card - Vertical Stack */}
                <div className="flex flex-col items-center justify-center gap-6 bg-white/5 p-8 md:p-10 rounded-3xl border border-white/10 backdrop-blur-sm max-w-[600px] mx-auto mb-10">

                    {/* Top Text Group */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-[32px] md:text-[42px] leading-tight font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            +1 Entry Earned
                        </div>
                        <div className="text-slate-300 text-[20px] md:text-[22px] font-medium">into the</div>
                    </div>

                    {/* Logo & Prize Group */}
                    <div className="flex flex-col items-center gap-5 mt-2">
                        <div className="relative w-[180px] h-[100px] md:w-[220px] md:h-[120px]">
                            <Image
                                src="/social-alignment-logo-new.png"
                                alt="Social Alignment"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 180px, 220px"
                            />
                        </div>
                        <h3 className="font-bold text-white tracking-wide text-[24px] md:text-[28px] uppercase drop-shadow-md">
                            GenAI Video Giveaway
                        </h3>
                    </div>
                </div>

                <p className="text-[18px] text-slate-400 font-normal mb-10">Good Luck!</p>

                {/* CTAs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[800px] mx-auto">
                    <Button
                        variant="default"
                        size="lg"
                        className="w-full h-[64px] md:h-[80px] px-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[18px] md:text-[22px] rounded-2xl shadow-xl shadow-blue-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        asChild
                    >
                        <Link href="https://socialalignment.biz" target="_blank">
                            About Social Alignment
                            <ExternalLink className="w-6 h-6 ml-3 opacity-80" />
                        </Link>
                    </Button>

                    <Button
                        variant="secondary"
                        size="lg"
                        className="w-full h-[64px] md:h-[80px] px-10 bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold text-[18px] md:text-[22px] rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md"
                        asChild
                    >
                        <Link href="/demo/qualify">
                            Gain 5 Extra Entries
                            <ArrowRight className="w-6 h-6 ml-3 opacity-80" />
                        </Link>
                    </Button>
                </div>

                <div className="mt-14 pt-8 border-t border-white/5 mx-auto max-w-2xl">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-slate-500">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse hidden md:block" />
                        <span className="text-sm font-medium tracking-wide uppercase text-center">Winners revealed at the Wheel of Alignment momentarily</span>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
