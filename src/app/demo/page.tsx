'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { WarpBackground } from '@/components/ui/warp-background';
import { useInAppBrowser } from '@/hooks/use-in-app-browser';
import { InAppBrowserOverlay } from '@/components/ui/in-app-browser-overlay';

export default function DemoPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const isInAppBrowser = useInAppBrowser();
    const [dismissedInAppWarning, setDismissedInAppWarning] = useState(false);

    return (
        <main className="relative w-full h-[100dvh] overflow-hidden bg-slate-900 font-sans">
            {isInAppBrowser && !dismissedInAppWarning && (
                <InAppBrowserOverlay onDismiss={() => setDismissedInAppWarning(true)} />
            )}
            {/* Background - Neon Portal Warp Grid */}
            <div className="absolute inset-0 z-0">
                <WarpBackground className="w-full h-full" gridColor="rgba(34, 211, 238, 0.4)" />
                <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                {/* Vignette for cinematic focus */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
            </div>

            {/* Content Container - Centralized Vertical Stack for All Screens */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-evenly py-8 px-4">

                {/* 1. TOP ANCHOR: Tech Alley Logo (Large & Prominent) */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-none"
                >
                    <div className="relative group">
                        {/* Massive Glow Effect */}
                        <div className="absolute inset-0 bg-purple-500/30 blur-[60px] rounded-full opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                        <img
                            src="/tah-hero-logo.png"
                            alt="Tech Alley Henderson"
                            className="relative h-[25vh] md:h-[35vh] w-auto object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.6)] -my-4 md:-my-12"
                        />
                    </div>
                </motion.div>

                {/* 2. CENTER STAGE: Headline & CTA */}
                {/* Mobile: Flex grow/center. Desktop: Absolute Center */}
                {/* 2. CENTER STAGE: Headline & CTA */}
                <div className="flex-none flex flex-col items-center justify-center space-y-8 w-full max-w-4xl mx-auto z-20">

                    {/* Immersive Headline */}
                    <div className="space-y-6 text-center pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            <h2 className="text-cyan-400 font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-2">
                                The Future of Tech is Here
                            </h2>
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.6)] leading-[0.9]">
                                TECH ALLEY<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                                    HENDERSON
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-slate-300 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed px-4"
                        >
                            Register now for next month's meetup.
                            <span className="block mt-2 text-cyan-200 font-medium">Feb 25th 2026 5PM @ The Pass Casino</span>
                        </motion.p>
                    </div>

                    {/* Primary CTA */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="pointer-events-auto"
                    >
                        <button
                            onClick={() => {
                                setIsLoading(true);
                                signIn('google', { callbackUrl: '/demo/processing' });
                            }}
                            disabled={isLoading}
                            className="group relative px-8 py-4 bg-white hover:bg-cyan-50 text-slate-900 rounded-full font-bold text-lg md:text-xl shadow-[0_0_40px_-5px_rgba(34,211,238,0.5)] hover:shadow-[0_0_60px_-5px_rgba(34,211,238,0.8)] transition-all duration-300 flex items-center gap-3 overflow-hidden"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin text-slate-500" />
                                    <span>Connecting...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span>Register via Google</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>

                {/* 3. BOTTOM ANCHOR: Social Alignment */}
                {/* Mobile: Bottom Center. Desktop: Bottom Center Absolute */}
                {/* 3. BOTTOM ANCHOR: Social Alignment (Prominent & Centered) */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex-none pb-4"
                >
                    <div className="flex flex-col items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-500 translate-y-12 scale-125">
                        <img
                            src="/sa-hero-logo.png"
                            alt="Social Alignment"
                            className="h-[25vh] md:h-[35vh] w-auto object-contain hover:scale-105 transition-all duration-500 drop-shadow-[0_0_20px_rgba(56,189,248,0.3)] relative z-0 -mt-4 md:-mt-12"
                        />
                    </div>
                </motion.div>

            </div>
        </main>
    );
}
