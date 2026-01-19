"use client"

import React from "react"
import { motion } from "framer-motion"

interface ElectricProgressBarProps {
    progress: number
    className?: string
}

export function ElectricProgressBar({ progress, className }: ElectricProgressBarProps) {
    // Clamp progress between 0 and 100
    const clampedProgress = Math.min(100, Math.max(0, progress))

    return (
        <div className={`relative h-12 w-full ${className}`}>
            {/* Background Track */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-slate-900 rounded-full border border-slate-700/50 overflow-hidden">
                {/* Glow behind the bolt */}
                <div
                    className="h-full bg-cyan-900/30 blur-sm transition-all duration-1000 ease-out"
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>

            {/* Electricity Bolt SVG */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                viewBox="0 0 100 12" // Aspect ratio adjustment might be needed based on container
                preserveAspectRatio="none"
            >
                {/* Dynamic Defs for Gradient */}
                <defs>
                    <linearGradient id="electricityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
                        <stop offset="10%" stopColor="#a855f7" />
                        <stop offset="50%" stopColor="#22d3ee" />
                        <stop offset="90%" stopColor="#fff" />
                        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* The Bolt Path - Masked by Progress */}
                <motion.path
                    d="M0,6 Q5,4 10,6 T20,6 T30,6 T40,6 T50,6 T60,6 T70,6 T80,6 T90,6 T100,6"
                    // We can use a more jagged path generator here if needed, but a wobbly line simulates a beam well
                    // when combined with high frequency dash animation.
                    fill="none"
                    stroke="url(#electricityGradient)"
                    strokeWidth="3"
                    strokeDasharray={`100 100`} // Total length roughly
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 100 - clampedProgress }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{
                        filter: "url(#glow)",
                    }}
                />

                {/* Secondary chaotic bolts for effect (only visible where there is progress) */}
                <motion.path
                    d="M0,6 L10,3 L20,9 L30,4 L40,8 L50,5 L60,7 L70,4 L80,8 L90,5 L100,6"
                    fill="none"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="1"
                    strokeDasharray="100 100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 100 - clampedProgress, pathLength: clampedProgress / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="opacity-50 mix-blend-overlay"
                />
            </svg>

            {/* End Cap Spark */}
            <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[2px] shadow-[0_0_20px_#fff]"
                initial={{ left: "0%" }}
                animate={{ left: `${clampedProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
        </div>
    )
}
