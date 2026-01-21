"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Camera, Images } from "lucide-react"
import { StarsBackground } from "@/components/ui/stars-background"
import { ShootingStars } from "@/components/ui/shooting-stars"
import ShimmerButton from "@/components/ui/shimmer-button"

export default function PhotoBoothPage() {
    return (
        <div className="min-h-screen relative w-full bg-slate-900 flex flex-col items-center justify-center overflow-hidden rounded-md">
            <div className="absolute inset-0 z-0">
                <StarsBackground />
                <ShootingStars minDelay={500} maxDelay={1500} />
            </div>

            <div className="fixed top-4 left-4 z-50">
                <Link href="https://muddy-nautilus-ad8.notion.site/nano-banana-pro-the-creative-amplifier?source=copy_link">
                    <Button variant="ghost" className="text-white hover:text-indigo-300 hover:bg-white/10 gap-2">
                        <ArrowLeft size={16} />
                        Back to Resource Center
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto relative z-10">
                <div className="animate-in fade-in zoom-in duration-1000 mb-8 relative">
                    <div className="absolute -inset-4 bg-indigo-500/30 blur-3xl rounded-full" />
                    <Camera className="w-24 h-24 text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                </div>

                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl animate-in slide-in-from-bottom-5 duration-700 delay-150">
                    Tech Alley <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Photo Booth
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 leading-relaxed animate-in slide-in-from-bottom-5 duration-700 delay-300">
                    Step into the future. Capture the energy of Innovation Henderson, upload your moments, and become part of our digital legacy.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 animate-in slide-in-from-bottom-5 duration-700 delay-500">
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
        </div>
    )
}
