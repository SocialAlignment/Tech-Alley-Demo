"use client"

import SphereImageGrid, { ImageData } from "@/components/ui/img-sphere";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Component configuration
interface SphereConfig {
    containerSize: number;
    sphereRadius: number;
    dragSensitivity: number;
    momentumDecay: number;
    maxRotationSpeed: number;
    baseImageScale: number;
    hoverScale: number;
    perspective: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
}

const CONFIG: SphereConfig = {
    containerSize: 600,
    sphereRadius: 200,
    dragSensitivity: 0.8,
    momentumDecay: 0.96,
    maxRotationSpeed: 6,
    baseImageScale: 0.15,
    hoverScale: 1.3,
    perspective: 1000,
    autoRotate: true,
    autoRotateSpeed: 0.2
};

interface GalleryClientProps {
    images: ImageData[];
}

export default function GalleryClient({ images }: GalleryClientProps) {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="fixed top-4 left-4 z-50">
                <Link href="/hub/photo-booth">
                    <Button variant="ghost" className="text-white hover:text-slate-300 hover:bg-white/10 gap-2">
                        <ArrowLeft size={16} />
                        Back to Photo Booth
                    </Button>
                </Link>
            </div>

            <div className="z-10 text-center mb-0 md:mb-8">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-sm">
                    Memory Sphere
                </h1>
                <p className="text-slate-400 mt-2 max-w-lg mx-auto">
                    Explore the moments captured by the community. Drag to rotate the sphere.
                </p>
            </div>

            <div className="relative">
                {/* Glow effect backend */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

                <SphereImageGrid
                    images={images}
                    {...CONFIG}
                />
            </div>
        </div>
    )
}
