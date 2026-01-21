"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Camera, Images } from "lucide-react"
import { WarpBackground } from "@/components/ui/warp-background"
import { motion } from "framer-motion"
import ShimmerButton from "@/components/ui/shimmer-button"

export default function PhotoBoothPage() {
    return (
        <main className="relative w-full h-[100dvh] overflow-hidden bg-slate-900 font-sans">
            <div className="fixed top-4 left-4 z-50">
                <Link href="https://muddy-nautilus-ad8.notion.site/nano-banana-pro-the-creative-amplifier?source=copy_link">
                    <Button variant="ghost" className="text-white hover:text-cyan-300 hover:bg-white/10 gap-2 backdrop-blur-sm bg-black/20 border border-white/5 rounded-full px-4">
                        <ArrowLeft size={16} />
                        Back to Resource Center
                    </Button>
                </Link>
            </div>

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
                <div className="flex-none flex flex-col items-center justify-center space-y-8 w-full max-w-4xl mx-auto z-20">

                    {/* Immersive Headline */}
                    <div className="space-y-6 text-center pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            <h2 className="text-cyan-400 font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-2">
                                The Innovation Gallery
                            </h2>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.6)] leading-[0.9]">
                                CAPTURE THE<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                                    ENERGY
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-slate-300 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed px-4"
                        >
                            Snap a photo to become part of our digital legacy.
                            <span className="block mt-2 text-cyan-200 font-medium">Verified by Social Alignment</span>
                        </motion.p>
                    </div>

                    {/* Tips - Collapsible/Compact to save space */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="bg-slate-950/40 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/10 text-left mx-auto max-w-md w-full"
                    >
                        <ul className="text-cyan-100/70 text-xs md:text-sm list-none text-center space-y-1">
                            <li>✨ One image at a time • Max 10MB</li>
                            <li>📸 Leave a caption • No videos</li>
                        </ul>
                    </motion.div>

                    {/* Primary Actions */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="flex flex-col sm:flex-row items-center gap-6 pointer-events-auto"
                    >
                        <Link href="/photo-booth/upload">
                            <ShimmerButton className="text-lg px-8 py-4 min-w-[200px]" shimmerColor="#22D3EE" background="rgba(15, 23, 42, 0.8)">
                                <span className="flex items-center gap-2 group">
                                    <Camera size={20} className="text-cyan-400 group-hover:text-white transition-colors" />
                                    Upload Media
                                </span>
                            </ShimmerButton>
                        </Link>

                        <Link href="/photo-booth/gallery">
                            <Button
                                variant="outline"
                                className="bg-transparent border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10 hover:text-white hover:border-cyan-400 px-8 py-6 text-lg min-w-[200px] rounded-full backdrop-blur-sm transition-all hover:scale-105 shadow-[0_0_20px_-10px_rgba(34,211,238,0.3)]"
                            >
                                <Images className="mr-2 h-5 w-5" />
                                View Gallery
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* 3. BOTTOM ANCHOR: Social Alignment */}
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
    )
}
