"use client"

import React from "react"
import { motion } from "framer-motion"

export function CircuitBoardBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <svg
                className="w-full h-full opacity-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <pattern
                    id="circuit-pattern"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M10,0 V10 M0,10 H10 M10,10 V20 M10,10 H20"
                        stroke="cyan"
                        strokeWidth="0.2"
                        fill="none"
                    />
                    <circle cx="10" cy="10" r="1" fill="cyan" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>
            {/* Animated glowing lines overlay */}
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_70%)]"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    )
}
