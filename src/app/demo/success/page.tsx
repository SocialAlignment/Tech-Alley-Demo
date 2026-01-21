'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ExternalLink, Terminal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useIdentity } from '@/context/IdentityContext';
import { Button } from '@/components/ui/button';
import { WarpBackground } from '@/components/ui/warp-background';

export default function DemoSuccessPage() {
    const { userName } = useIdentity();
    const firstName = userName ? userName.split(' ')[0] : 'OPERATOR';

    // Animation Phases:
    // 0: Arrival (Background, Light)
    // 1: Recognition (Text)
    // 2: Injection (Card enters)
    // 3: Active (Card settled, CTA appears)
    const [phase, setPhase] = useState(0);

    // Card State: 'registering' -> 'active'
    const [cardStatus, setCardStatus] = useState<'registering' | 'active'>('registering');

    // Hydration-safe ID
    const [ticketId, setTicketId] = useState('SYNCING...');
    const [pattern, setPattern] = useState<boolean[]>([]);

    useEffect(() => {
        // Hydration fix
        setTicketId(Math.random().toString(36).substr(2, 9).toUpperCase());
        setPattern([...Array(10)].map(() => Math.random() > 0.5));

        // Sequence Orchestration
        const timer1 = setTimeout(() => setPhase(1), 800);   // Text appears
        const timer2 = setTimeout(() => setPhase(2), 1600);  // Card flies in
        const timer3 = setTimeout(() => {
            setPhase(3);     // CTA appears
            setCardStatus('active'); // Card activates
        }, 2600);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    return (
        <main className="relative w-full h-[100dvh] overflow-hidden bg-[#02040a] font-sans selection:bg-cyan-500/30">

            {/* --- PHASE 0: ARRIVAL (Environment) --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[#02040a]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)] opacity-80" />

                {/* Dynamic Grid - Moving Forward */}
                <div className="absolute inset-0 opacity-20 perspective-[2000px]">
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.05)_100%)] transform-3d rotate-x-[60deg] origin-bottom mask-image-gradient-b blur-[1px]">
                        <motion.div
                            initial={{ y: 0 }}
                            animate={{ y: [0, 40] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="w-full h-[200%] bg-[repeating-linear-gradient(90deg,transparent_0,transparent_98px,rgba(6,182,212,0.3)_100px)]"
                        />
                    </div>
                </div>

                {/* Converging Light */}
                <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[60vw] h-[400px] bg-gradient-to-b from-cyan-900/20 to-transparent blur-[80px] mix-blend-screen"
                />
            </div>

            {/* Content Container - Centralized Vertical Stack for All Screens */}
            {/* TIGHTER SPACING: Reduced gap and padding */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-4 px-4 gap-4 md:gap-8">

                {/* 1. TOP ANCHOR: Tech Alley Logo */}
                {/* Brought closer to center with negative margin */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : -50 }}
                    transition={{ duration: 0.8 }}
                    className="flex-none relative z-50 -mb-6 md:-mb-16"
                >
                    <div className="relative group">
                        {/* Massive Glow Effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-500/20 blur-[80px] rounded-full opacity-60 mix-blend-screen pointer-events-none" />
                        <img
                            src="/tah-hero-logo.png"
                            alt="Tech Alley Henderson"
                            className="relative h-[16vh] md:h-[28vh] w-auto object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.5)]"
                        />
                    </div>
                </motion.div>


                {/* 2. CENTRAL STAGE: Text & Action */}
                {/* TIGHT PACK: Reduced gaps */}
                <div className="flex-none flex flex-col items-center justify-center w-full relative z-40 gap-4 md:gap-6">

                    {/* PHASE 1: RECOGNITION (Headline) */}
                    <div className="text-center h-14 md:h-20 flex items-center justify-center -mt-2 md:-mt-8">
                        {phase >= 1 && (
                            <div className="flex flex-col items-center gap-1">
                                <motion.h1
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, ease: "circOut" }}
                                    className="text-2xl md:text-5xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-100 tracking-tighter leading-none drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                                >
                                    {firstName} - You&apos;re In!
                                </motion.h1>
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" />
                                    <span className="text-cyan-400/80 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold">
                                        Identity Verified
                                    </span>
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* PHASE 2: INJECTION (The Card) */}
                    {/* Size Optimized for fit */}
                    <div className="relative w-full max-w-[280px] md:max-w-[380px] h-[160px] md:h-[200px] flex items-center justify-center">
                        <AnimatePresence>
                            {phase >= 2 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                    className="w-full"
                                >
                                    {/* Condensed Card */}
                                    <div className={`
                                        relative w-full bg-[#0A0F1E]/80 backdrop-blur-md border 
                                        ${cardStatus === 'active' ? 'border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.1)]' : 'border-cyan-900/20'}
                                        rounded-lg overflow-hidden p-1 transition-all duration-700
                                    `}>
                                        {/* Inner Frame */}
                                        <div className="border border-cyan-500/10 rounded-md p-3 md:p-5 flex flex-col items-center gap-2 bg-black/40">

                                            <div className="flex items-center justify-between w-full border-b border-cyan-900/30 pb-2">
                                                <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest">UNIT-01</span>
                                                <span className="text-[9px] font-mono text-cyan-700 uppercase">{ticketId}</span>
                                            </div>

                                            <div className="text-center py-1">
                                                <div className="text-3xl md:text-5xl font-bold text-white mb-0.5">+1</div>
                                                <div className="text-[8px] md:text-[10px] text-cyan-400 uppercase tracking-[0.3em]">Entry Allocated</div>
                                            </div>

                                            {/* Status Bar */}
                                            <div className="w-full h-1 bg-cyan-900/20 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                                    className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* PHASE 3: ACTION (CTA) */}
                    <div className="w-full max-w-md px-4 h-12 md:h-14 flex items-center justify-center">
                        <AnimatePresence>
                            {phase >= 3 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full"
                                >
                                    <Button
                                        asChild
                                        className="w-full h-12 md:h-14 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs md:text-sm tracking-wide uppercase transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] rounded-sm group overflow-hidden relative"
                                    >
                                        <Link href="/demo/qualify" className="flex items-center justify-center gap-2">
                                            <span className="relative z-10 text-center leading-tight">
                                                Engage
                                                <span className="hidden md:inline mx-1">-</span>
                                                <span className="opacity-80 font-normal normal-case ml-1">
                                                    Activate 5 More Entries
                                                </span>
                                            </span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10 flex-none" />
                                        </Link>
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* 3. BOTTOM ANCHOR: Social Alignment */}
                {/* Negative margin to pull up */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 50 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-none pb-0 relative z-50 text-center -mt-2 md:-mt-10"
                >
                    <div className="flex flex-col items-center justify-center opacity-90 hover:opacity-100 transition-opacity duration-500 scale-90 md:scale-110 origin-top">
                        {/* Subtle Glow */}
                        <div className="absolute inset-0 bg-cyan-500/10 blur-[50px] rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500" />
                        <img
                            src="/sa-hero-logo.png"
                            alt="Social Alignment"
                            className="h-[16vh] md:h-[28vh] w-auto object-contain hover:scale-105 transition-all duration-500 drop-shadow-[0_0_30px_rgba(56,189,248,0.4)] relative z-10"
                        />
                    </div>
                </motion.div>

                {/* HUD FOOTER (Fixed Bottom) */}
                <div className="absolute bottom-2 left-6 flex items-center gap-3 z-50 pointer-events-none opacity-60 mix-blend-screen hidden md:flex">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
                        System Live
                    </span>
                </div>

            </div>
        </main>
    );
}
