'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
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
                        // Direct to Google OAuth, skipping explicit login page
                        signIn('google', { callbackUrl: '/demo/processing' });
                    }}
                    disabled={isLoading}
                    className="group relative pointer-events-auto px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.6)] transition-all duration-300 flex items-center gap-4 overflow-hidden"
                >
                    {isLoading ? (
                        <>
                            <Loader className="w-5 h-5 relative z-10 animate-spin text-slate-500" />
                            <span className="relative z-10 text-slate-600">Connecting...</span>
                        </>
                    ) : (
                        <>
                            {/* Google "G" Logo */}
                            <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="relative z-10">Register via Google</span>
                            <ArrowRight className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-slate-900 transition-colors" />
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
