"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Camera, Images } from "lucide-react"
import { StarsBackground } from "@/components/ui/stars-background"
import { ShootingStars } from "@/components/ui/shooting-stars"
import ShimmerButton from "@/components/ui/shimmer-button"

export default function PhotoBoothPage() {
    return (
        <div className="min-h-screen relative w-full bg-slate-900 flex flex-col items-center justify-between overflow-hidden rounded-md py-8">
            <div className="absolute inset-0 z-0">
                <StarsBackground />
                <ShootingStars minDelay={500} maxDelay={1500} />
            </div>

            <div className="fixed top-4 left-4 z-50">
                <Link href="https://muddy-nautilus-ad8.notion.site/nano-banana-pro-the-creative-amplifier?source=copy_link">
                    <Button variant="ghost" className="text-white hover:text-indigo-300 hover:bg-white/10 gap-2 backdrop-blur-sm bg-black/20 border border-white/5 rounded-full px-4">
                        <ArrowLeft size={16} />
                        Back to Resource Center
                    </Button>
                </Link>
            </div>

            {/* 1. TOP ANCHOR: Tech Alley Logo */}
            <div className="relative z-10 flex-none animate-in slide-in-from-top-10 duration-1000">
                <div className="relative group">
                    <div className="absolute inset-0 bg-purple-500/30 blur-[60px] rounded-full opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                    <img
                        src="/tah-hero-logo.png"
                        alt="Tech Alley Henderson"
                        className="relative h-[20vh] md:h-[25vh] w-auto object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.6)]"
                    />
                </div>
            </div>

            {/* 2. CENTER STAGE: Text & Buttons */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto relative z-10 space-y-8 w-full">

                <div className="space-y-6">
                    <h2 className="text-cyan-400 font-bold tracking-[0.2em] text-sm md:text-base uppercase animate-in fade-in duration-1000 delay-300">
                        The Innovation Gallery
                    </h2>
                    <p className="text-xl md:text-3xl text-white font-light leading-relaxed max-w-2xl mx-auto animate-in slide-in-from-bottom-5 duration-700 delay-500 drop-shadow-lg">
                        Step into the future. Capture the energy of Innovation Henderson, upload your moments, and become part of our digital legacy.
                    </p>
                </div>

                {/* Tips List */}
                <div className="bg-slate-950/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-left mx-auto max-w-md w-full animate-in fade-in duration-1000 delay-700">
                    <h3 className="text-indigo-300 font-semibold mb-3 border-b border-white/10 pb-2">Photo Booth Tips:</h3>
                    <ul className="space-y-2 text-slate-300 text-sm list-disc pl-5">
                        <li>One image at a time</li>
                        <li>No video files supported</li>
                        <li>File size limit: 10MB</li>
                        <li>Leave a caption in your handle!</li>
                        <li>Check out the gallery to see the night unfold</li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 animate-in slide-in-from-bottom-5 duration-700 delay-700 pt-4">
                    <Link href="/photo-booth/upload">
                        <ShimmerButton className="text-lg px-8 py-4 min-w-[200px]" shimmerColor="#A855F7" background="rgba(79, 70, 229, 0.4)">
                            <span className="flex items-center gap-2">
                                <Camera size={20} />
                                Upload Media
                            </span>
                        </ShimmerButton>
                    </Link>

                    <Link href="/photo-booth/gallery">
                        <Button
                            variant="outline"
                            className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white px-8 py-6 text-lg min-w-[200px] rounded-full backdrop-blur-sm transition-all hover:scale-105 hover:border-white/50"
                        >
                            <Images className="mr-2 h-5 w-5" />
                            View Gallery
                        </Button>
                    </Link>
                </div>
            </div>

            {/* 3. BOTTOM ANCHOR: Social Alignment */}
            <div className="relative z-10 flex-none pb-4 animate-in slide-in-from-bottom-10 duration-1000 delay-1000">
                <div className="flex flex-col items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-500">
                    <img
                        src="/sa-hero-logo.png"
                        alt="Social Alignment"
                        className="h-[12vh] md:h-[15vh] w-auto object-contain hover:scale-105 transition-all duration-500 drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                    />
                </div>
            </div>
        </div>
    )
}
