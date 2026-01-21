"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useIdentity } from "@/context/IdentityContext";
import { Liquid } from "@/components/ui/liquid-gradient";
import { Confetti } from "@/components/ui/confetti";
import { Hyperspace } from "@/components/ui/hyperspace";

export function SuccessContent() {
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
            {/* Hyperspace Background */}
            <Hyperspace density={80} speed={0.5} className="z-0" />

            {/* Top Light Accent */}
            <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[60vw] h-[400px] bg-gradient-to-b from-cyan-900/20 to-transparent blur-[80px] mix-blend-screen pointer-events-none z-0"
            />

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
                            <div className="flex flex-col items-center gap-2">
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
                                    className="px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 backdrop-blur-md flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                >
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" />
                                    <span className="text-cyan-100/90 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold text-shadow-sm">
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
                                    className="w-full h-full"
                                >
                                    {/* Condensed Card - Premium Glass Upgrade */}
                                    <div className={`
                                        relative w-full h-full bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border
                                        ${cardStatus === 'active' ? 'border-cyan-400/30 shadow-[0_0_40px_rgba(6,182,212,0.15)]' : 'border-cyan-900/20'}
                                        rounded-2xl overflow-hidden p-[1px] transition-all duration-700 group
                                    `}>
                                        {/* Glossy sheen overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50 pointer-events-none" />

                                        {/* Inner Frame */}
                                        <div className="relative h-full w-full rounded-2xl bg-black/40 flex flex-col items-center justify-between p-4 md:p-6 overflow-hidden">
                                            {/* Subtle internal grid */}
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                                            <div className="relative z-10 flex items-center justify-between w-full border-b border-white/10 pb-2 mb-1">
                                                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">UNIT-01</span>
                                                <span className="text-[10px] font-mono text-cyan-200 uppercase tracking-wider">{ticketId}</span>
                                            </div>

                                            <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
                                                <div className="text-4xl md:text-6xl font-black text-white mb-1 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">+1</div>
                                                <div className="text-[9px] md:text-[11px] text-cyan-200 uppercase tracking-[0.3em] font-medium">Entry Allocated</div>
                                            </div>

                                            {/* Status Bar */}
                                            <div className="relative z-10 w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                                                <motion.div
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                                    className="h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* PHASE 3: ACTION (CTA) - VISUALLY ELEVATED LIQUID BUTTON */}
                    <div className="w-full max-w-md px-4 h-16 md:h-20 flex items-center justify-center z-[100] relative">
                        <AnimatePresence>
                            {phase >= 3 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full h-full relative"
                                >
                                    <Link href="/demo/qualify" className="block w-full h-full relative group">
                                        {/* Liquid Background */}
                                        <div className="absolute inset-0 rounded-md overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                                            <Liquid isHovered={true} colors={{
                                                color1: '#06b6d4', // Cyan 500
                                                color2: '#0891b2', // Cyan 600
                                                color3: '#0e7490', // Cyan 700
                                                color4: '#155e75', // Cyan 800
                                                color5: '#164e63', // Cyan 900
                                                color6: '#22d3ee', // Cyan 400
                                                color7: '#67e8f9', // Cyan 200
                                                color8: '#06b6d4',
                                                color9: '#06b6d4',
                                                color10: '#06b6d4',
                                                color11: '#06b6d4',
                                                color12: '#06b6d4',
                                                color13: '#06b6d4',
                                                color14: '#06b6d4',
                                                color15: '#06b6d4',
                                                color16: '#06b6d4',
                                                color17: '#06b6d4',
                                            }} />
                                        </div>

                                        {/* Button Content - Overlaying the liquid */}
                                        <div className="absolute inset-0 flex items-center justify-center gap-2 z-10 px-4">
                                            <span className="relative z-10 text-center leading-tight font-black text-white text-base md:text-lg tracking-wider uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] filter">
                                                Engage
                                                <span className="hidden md:inline mx-2 text-cyan-200">-</span>
                                                <span className="font-bold normal-case text-white/95 text-sm md:text-base tracking-normal drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                                    Activate 5 More Entries
                                                </span>
                                            </span>
                                            <ArrowRight className="w-6 h-6 text-white stroke-[3px] group-hover:translate-x-1 transition-transform relative z-10 flex-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
                                        </div>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* 3. BOTTOM ANCHOR: Social Alignment */}
                {/* Negative margin adjusted to pull up more, Logo size increased */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 50 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-none pb-0 relative z-50 text-center -mt-2 md:-mt-12"
                >
                    <div className="flex flex-col items-center justify-center opacity-90 hover:opacity-100 transition-opacity duration-500 scale-95 md:scale-125 origin-top">
                        {/* Subtle Glow */}
                        <div className="absolute inset-0 bg-cyan-500/10 blur-[50px] rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500" />
                        <img
                            src="/sa-hero-logo.png"
                            alt="Social Alignment"
                            className="h-[18vh] md:h-[32vh] w-auto object-contain hover:scale-105 transition-all duration-500 drop-shadow-[0_0_30px_rgba(56,189,248,0.4)] relative z-10"
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

                <Confetti
                    className="fixed inset-0 w-full h-full pointer-events-none z-[100]"
                    manualstart={false}
                    options={{
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    }}
                />
            </div>
        </main>
    );
}
