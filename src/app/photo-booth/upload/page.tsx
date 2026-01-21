import FileUpload05 from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Camera } from "lucide-react"
import { StarsBackground } from "@/components/ui/stars-background"
import { ShootingStars } from "@/components/ui/shooting-stars"

export default function PhotoBoothUploadPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 selection:bg-indigo-500/30">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <StarsBackground />
                <ShootingStars minDelay={500} maxDelay={1500} />
            </div>

            <div className="fixed left-4 top-4 z-50">
                <Link href="/photo-booth">
                    <Button variant="ghost" className="text-white hover:text-indigo-300 hover:bg-white/10 gap-2 backdrop-blur-sm bg-black/20 border border-white/5 rounded-full px-4">
                        <ArrowLeft size={16} />
                        Back to Booth
                    </Button>
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-2xl px-4">
                <div className="mb-8 text-center relative">
                    {/* Decorative Blur behind text */}
                    <div className="absolute -inset-10 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

                    <h1 className="relative bg-gradient-to-b from-white to-slate-400 bg-clip-text text-5xl md:text-6xl font-bold tracking-tighter text-transparent drop-shadow-2xl">
                        Upload Memories
                    </h1>
                    <p className="relative mt-4 text-lg text-slate-300 max-w-md mx-auto leading-relaxed">
                        Share your favorite moments from Tech Alley Henderson.
                    </p>
                </div>

                {/* File Upload Component - it handles its own glassmorphic styling now */}
                <div className="relative z-20">
                    <FileUpload05 />
                </div>
            </div>
        </div>
    )
}
