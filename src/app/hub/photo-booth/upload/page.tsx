import FileUpload05 from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import RetroGrid from "@/components/ui/retro-grid"

export default function PhotoBoothUploadPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black selection:bg-indigo-500/30">
            {/* Immersive Background */}
            <RetroGrid />

            <div className="fixed left-4 top-4 z-50">
                <Link href="/hub/photo-booth">
                    <Button variant="ghost" className="gap-2 text-slate-400 hover:bg-white/10 hover:text-white">
                        <ArrowLeft size={16} />
                        Back to Booth
                    </Button>
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-2xl px-4">
                <div className="mb-8 text-center">
                    <h1 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent drop-shadow-md">
                        Upload Memories
                    </h1>
                    <p className="mt-2 text-slate-400">
                        Share your favorite moments from Tech Alley Henderson.
                    </p>
                </div>

                {/* File Upload Component - it handles its own glassmorphic styling now */}
                <FileUpload05 />
            </div>
        </div>
    )
}
