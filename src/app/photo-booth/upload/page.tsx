import FileUpload05 from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { WarpBackground } from "@/components/ui/warp-background"

export default function PhotoBoothUploadPage() {
    return (
        <main className="relative w-full h-[100dvh] overflow-hidden bg-slate-900 font-sans flex flex-col items-center justify-center">
            {/* Background - Neon Portal Warp Grid */}
            <div className="absolute inset-0 z-0">
                <WarpBackground className="w-full h-full" gridColor="rgba(34, 211, 238, 0.4)" />
                <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
            </div>

            <div className="fixed left-4 top-4 z-50">
                <Link href="/photo-booth">
                    <Button variant="ghost" className="text-white hover:text-cyan-300 hover:bg-white/10 gap-2 backdrop-blur-sm bg-black/20 border border-white/5 rounded-full px-4">
                        <ArrowLeft size={16} />
                        Back to Booth
                    </Button>
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-2xl px-4 animate-in fade-in duration-1000 delay-300">
                <div className="mb-8 text-center relative pointer-events-none">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.6)] leading-[0.9]">
                        UPLOAD<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                            MEMORIES
                        </span>
                    </h1>
                    <p className="mt-4 text-slate-300 text-lg md:text-xl font-light leading-relaxed">
                        Share your favorite moments from Tech Alley Henderson.
                    </p>
                </div>

                {/* File Upload Component */}
                <div className="relative z-50">
                    <FileUpload05 />
                </div>
            </div>
        </main>
    )
}
