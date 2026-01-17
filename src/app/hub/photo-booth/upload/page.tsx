"use client"

import FileUpload05 from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PhotoBoothUploadPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center relative">
            <div className="fixed top-4 left-4 z-50">
                <Link href="/hub/photo-booth">
                    <Button variant="ghost" className="text-slate-600 gap-2 hover:bg-slate-200">
                        <ArrowLeft size={16} />
                        Back to Photo Booth
                    </Button>
                </Link>
            </div>

            <div className="w-full max-w-4xl p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Upload Your Memories</h1>
                    <p className="text-slate-500">Share your favorite moments from Tech Alley Henderson.</p>
                    <div className="mt-4">
                        <Link href="https://drive.google.com/drive/folders/1ivmkcEr9m9vgp-J6JbvjwN_NHaoA2jZw?usp=drive_link" target="_blank">
                            <Button variant="link" className="text-blue-600">Or use Google Drive directly ↗</Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <FileUpload05 />
                </div>
            </div>
        </div>
    )
}
