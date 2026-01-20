'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { WarpBackground } from '@/components/ui/warp-background';

export default function DemoPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <main className="relative w-full h-screen overflow-hidden bg-slate-900">
            {/* Background - Neon Portal Warp Grid (Consistent with Photo Booth) */}
            <div className="absolute inset-0 z-0">
                <WarpBackground className="w-full h-full" gridColor="rgba(34, 211, 238, 0.6)" />
                {/* Deep dark overlay for text contrast */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 text-center pointer-events-none">

                {/* Main Headline */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="space-y-4 mb-20 pointer-events-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] select-none">
                        Tech Alley<br />Henderson
                    </h1>
                    <p className="text-lg md:text-xl text-cyan-200/80 font-medium tracking-wide max-w-2xl mx-auto">
                        Register for next month's event and enter the GenAI Video Raffle.
                    </p>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setIsLoading(true);
                        // Direct to demo specific login flow
                        router.push('/demo/login');
                    }}
                    disabled={isLoading}
                    className="group relative pointer-events-auto px-8 py-5 bg-cyan-500 text-slate-950 rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(34,211,238,0.6)] hover:shadow-[0_0_60px_-10px_rgba(34,211,238,0.8)] transition-all duration-300 flex items-center gap-3 overflow-hidden"
                >
                    {isLoading ? (
                        <>
                            <Loader className="w-5 h-5 relative z-10 animate-spin" />
                            <span className="relative z-10">Starting...</span>
                        </>
                    ) : (
                        <>
                            <span className="relative z-10">Register for Next Month's Event</span>
                            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                        </>
                    )}

                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                </motion.button>


                {/* Centered Footer with Watermark - Updated Size/Spacing */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-8 left-0 w-full flex flex-col items-center justify-center gap-0 z-20 pointer-events-none leading-none"
                >
                    <div className="flex flex-row items-center justify-center gap-0 opacity-90 transition-opacity select-none">
                        <span className="text-sm uppercase tracking-[0.2em] text-white font-semibold">Powered By</span>
                        <img
                            src="/social-alignment-icon.png"
                            alt="Social Alignment"
                            className="h-28 w-auto object-contain mix-blend-screen"
                        />
                    </div>
                </motion.div>

            </div>
        </main>
    );
}
