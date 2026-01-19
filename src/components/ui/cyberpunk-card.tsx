"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface CyberpunkCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    variant?: "default" | "active" | "danger"
    className?: string
}

export function CyberpunkCard({
    children,
    variant = "default",
    className,
    ...props
}: CyberpunkCardProps) {
    return (
        <div
            className={cn(
                "relative group overflow-hidden bg-slate-950/80 backdrop-blur-md border border-cyan-500/30",
                "clip-path-cyberpunk hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300",
                variant === "active" && "border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]",
                className
            )}
            style={{
                clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
            }}
            {...props}
        >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-500" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-cyan-500" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-cyan-500" />

            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%] opacity-20" />

            {/* Content */}
            <div className="relative z-10 p-4">{children}</div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
    )
}
