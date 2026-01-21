"use client";

import { ImageData } from "@/components/ui/img-sphere";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FocusCards } from "@/components/ui/focus-cards";
import RetroGrid from "@/components/ui/retro-grid";

interface GalleryClientProps {
    images: ImageData[];
}

export default function GalleryClient({ images }: GalleryClientProps) {
    return (
        <div className="min-h-screen relative flex flex-col overflow-hidden bg-black selection:bg-indigo-500/30">
            {/* Background */}
            <RetroGrid />

            {/* Header/Nav */}
            <div className="fixed top-4 left-4 z-50">
                <Link href="/hub/photo-booth">
                    <Button variant="ghost" className="text-white hover:text-indigo-300 hover:bg-white/10 gap-2 backdrop-blur-sm bg-black/20">
                        <ArrowLeft size={16} />
                        Back to Photo Booth
                    </Button>
                </Link>
            </div>

            <div className="container mx-auto px-4 py-24 relative z-10 font-sans">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4 drop-shadow-sm">
                        Memory Gallery
                    </h1>
                    <p className="text-slate-400 md:text-lg max-w-2xl mx-auto">
                        A collection of moments from the Tech Alley community.
                    </p>
                </div>

                <FocusCards cards={images} />
            </div>
        </div>
    )
}
