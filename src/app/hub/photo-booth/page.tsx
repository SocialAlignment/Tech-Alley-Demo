"use client"

import { BentoCell, BentoGrid, ContainerScale, ContainerScroll } from "@/components/ui/hero-gallery-scroll-animation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const IMAGES = [
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?q=80&w=2264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?q=80&w=2368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG9reW98ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRva3lvfGVufDB8fDB8fHww",
]

export default function PhotoBoothPage() {
    return (
        <div className="bg-slate-900 min-h-screen">
            <div className="fixed top-4 left-4 z-50">
                <Link href="/hub">
                    <Button variant="ghost" className="text-white hover:text-slate-300 hover:bg-white/10 gap-2">
                        <ArrowLeft size={16} />
                        Back to Hub
                    </Button>
                </Link>
            </div>

            <ContainerScroll className="h-[350vh]">
                <BentoGrid className="sticky left-0 top-0 z-0 h-screen w-full p-4">
                    {IMAGES.map((imageUrl, index) => (
                        <BentoCell
                            key={index}
                            className="overflow-hidden rounded-xl shadow-xl bg-slate-800"
                        >
                            <img
                                className="size-full object-cover object-center"
                                src={imageUrl}
                                alt={`Photo Booth Gallery ${index + 1}`}
                            />
                        </BentoCell>
                    ))}
                </BentoGrid>

                <ContainerScale className="relative z-10 text-center">
                    <h1 className="max-w-xl text-5xl font-bold tracking-tighter text-slate-800 md:text-slate-900 drop-shadow-sm">
                        Tech Alley Photo Booth
                    </h1>
                    <p className="my-6 max-w-xl text-sm text-slate-700 md:text-base font-medium">
                        Capture the moment! Upload your photos or videos from the event to our shared gallery.
                        Access the Google Drive folder to download and share your memories.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/hub/photo-booth/upload">
                            <Button className="bg-indigo-600 px-6 py-6 font-bold text-lg hover:bg-indigo-500 shadow-xl">
                                Upload Media
                            </Button>
                        </Link>
                        <Link href="/hub/photo-booth/gallery">
                            <Button
                                variant="link"
                                className="px-4 py-2 font-medium text-indigo-700 hover:text-indigo-900"
                            >
                                Access Gallery
                            </Button>
                        </Link>
                    </div>
                </ContainerScale>
            </ContainerScroll>
        </div>
    )
}
