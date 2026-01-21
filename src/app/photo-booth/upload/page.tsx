"use client";

import FileUpload05 from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { WarpBackground } from "@/components/ui/warp-background"
import { motion } from "framer-motion"

export default function PhotoBoothUploadPage() {
    return (
        <main className="relative w-full h-[100dvh] overflow-hidden bg-slate-900 font-sans">
            {/* Navigation */}
            <div className="fixed left-4 top-4 z-50">
                <Link href="/photo-booth">
                    <Button variant="ghost" className="text-white hover:text-cyan-300 hover:bg-white/10 gap-2 backdrop-blur-sm bg-black/20 border border-white/5 rounded-full px-4">
                        <ArrowLeft size={16} />
                        Back by choice
                    </Button>
                </Link>
            </div>

            {/* Background - Neon Portal Warp Grid */}
            <div className="absolute inset-0 z-0">
                <WarpBackground className="w-full h-full" gridColor="rgba(34, 211, 238, 0.4)" />
                <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
            </div>

            {/* Content Container - Flex Column for Vertical Layout */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-8 px-4">

                {/* 1. TOP ANCHOR: Tech Alley Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-none"
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-purple-500/30 blur-[40px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                        <img
                            src="/tah-hero-logo.png"
                            alt="Tech Alley Henderson"
                            className="relative h-[12vh] md:h-[15vh] w-auto object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                        />
                    </div>
                </motion.div>

                {/* 2. CENTER STAGE: Upload Component */}
                <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center">
                    <div className="mb-6 text-center relative pointer-events-none">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.6)] leading-[0.9]">
                            UPLOAD<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                                MEMORIES
                            </span>
                        </h1>
                        <p className="mt-4 text-slate-300 text-sm md:text-lg font-light leading-relaxed">
                            Share your favorite moments.
                        </p>
                    </div>

                    <div className="w-full relative z-50">
                        <FileUpload05 />
                    </div>
                </div>

                {/* 3. BOTTOM ANCHOR: Social Alignment */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex-none"
                >
                    <div className="flex flex-col items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-500">
                        <img
                            src="/sa-hero-logo.png"
                            alt="Social Alignment"
                            className="h-[10vh] md:h-[12vh] w-auto object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                        />
                    </div>
                </motion.div>

            </div>
        </main>
    )
}
