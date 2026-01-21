'use client';

import { motion } from 'framer-motion';

export function RadialBurstBackground() {
    return (
        <div className="fixed inset-0 w-full h-full bg-[#020617] overflow-hidden -z-10">
            {/* Deep Navy/Black Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]" />

            {/* Radial Burst - Spotlight Effect */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] sm:w-[100vw] sm:h-[100vw] opacity-40 mix-blend-screen pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-purple-500/10 to-transparent blur-[80px]" />

                {/* Rotating Rays - Layer 1 (Cyan) */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0,cyan-500/10_15deg,transparent_30deg,transparent_60deg,cyan-500/10_75deg,transparent_90deg,transparent_120deg,cyan-500/10_135deg,transparent_150deg,transparent_180deg,cyan-500/10_195deg,transparent_210deg,transparent_240deg,cyan-500/10_255deg,transparent_270deg,transparent_300deg,cyan-500/10_315deg,transparent_360deg)]"
                />

                {/* Rotating Rays - Layer 2 (Purple - Counter Rotate) */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 scale-125 bg-[conic-gradient(from_45deg_at_50%_50%,transparent_0,purple-500/10_15deg,transparent_30deg,transparent_60deg,purple-500/10_75deg,transparent_90deg,transparent_120deg,purple-500/10_135deg,transparent_150deg,transparent_180deg,purple-500/10_195deg,transparent_210deg,transparent_240deg,purple-500/10_255deg,transparent_270deg,transparent_300deg,purple-500/10_315deg,transparent_360deg)]"
                />
            </div>

            {/* Subtle Grid Floor */}
            <div
                className="absolute bottom-0 w-full h-[40vh] bg-[linear-gradient(to_bottom,transparent,rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black)] perspective-[1000px] origin-bottom transform-gpu"
                style={{
                    transform: 'perspective(1000px) rotateX(60deg) translateY(0) scale(2)',
                    transformOrigin: 'bottom center',
                }}
            />

            {/* Ambient Up-glow from bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none" />
        </div>
    );
}
