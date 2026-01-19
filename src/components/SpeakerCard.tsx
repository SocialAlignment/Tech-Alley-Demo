'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { AlertCircle, Linkedin, Globe } from 'lucide-react';
import type { ExtendedSpeaker } from './SpeakerDrawer';
import { MouseEvent } from 'react';

interface SpeakerCardProps {
    speaker: ExtendedSpeaker;
    onClick?: () => void;
    isSpotlight?: boolean;
    variant?: 'light' | 'dark';
}

export default function SpeakerCard({ speaker, onClick, isSpotlight, variant = 'dark' }: SpeakerCardProps) {
    const { name, title, company, image, topics, completion, status } = speaker;

    // Calculate stroke dash for circle progress (r=18, circ=113)
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (completion / 100) * circumference;

    // 3D Tilt Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const glowBackground = useMotionTemplate`radial-gradient(
        650px circle at ${mouseX}px ${mouseY}px,
        rgba(139, 92, 246, 0.15),
        transparent 80%
    )`;

    const isDark = variant === 'dark';

    return (
        <motion.div
            layoutId={`card-${speaker.id}`}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`
                group relative overflow-hidden rounded-[2rem] border transition-all duration-500 cursor-pointer
                ${isDark
                    ? 'bg-slate-900/40 border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)]'
                    : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-xl'
                }
                ${isSpotlight && isDark ? 'ring-1 ring-purple-500/50 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]' : ''}
            `}
        >
            {/* Spotlight Glow Effect (Dark Mode Only) */}
            {isDark && (
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 rounded-[2rem] z-0"
                    style={{ background: glowBackground }}
                />
            )}

            {isSpotlight && (
                <div className="absolute top-0 right-0 z-20">
                    <div className="bg-gradient-to-bl from-purple-600 to-indigo-600 text-white text-[10px] uppercase font-bold px-4 py-1.5 rounded-bl-2xl shadow-lg">
                        Spotlight
                    </div>
                </div>
            )}

            {/* Content Container (z-10 to sit above glow) */}
            <div className="relative z-10 p-6 flex flex-col h-full">

                {/* Header: Avatar + Meta */}
                <div className="flex items-start gap-5 mb-6">
                    <div className={`
                        relative w-28 h-28 rounded-2xl overflow-hidden shrink-0
                        ${isDark ? 'ring-2 ring-white/10 shadow-2xl' : 'shadow-md'}
                    `}>
                        <img
                            src={image}
                            alt={name}
                            className={speaker.imageClassName || "w-full h-full object-cover object-top transform scale-125 translate-y-1 group-hover:scale-135 transition-transform duration-700 ease-out"}
                        />
                        {/* Live/Active Ring */}
                        {isSpotlight && (
                            <div className="absolute inset-0 rounded-2xl ring-2 ring-purple-500/50 animate-pulse" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                        <h3 className={`text-2xl font-bold leading-tight mb-1 truncate
                            ${isDark ? 'text-white group-hover:text-purple-200' : 'text-slate-900'}
                            transition-colors
                        `}>
                            {name}
                        </h3>
                        <p className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-1 truncate">
                            {title}
                        </p>
                        <p className={`text-sm font-medium leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {company}
                        </p>
                    </div>

                    {/* Completion Status (Mini) */}
                    <div className="absolute top-0 right-0 pt-0 pr-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Hidden by default, appears on hover if we want detailed stats, or keep existing badge layout? 
                             Let's revert to the previous badge style but cleaner if needed. 
                             Actually, let's keep the circle logic from before but make it subtle.
                         */}
                    </div>
                </div>

                {/* Topics Tags */}
                <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between">
                        <p className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Speaking On
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {topics.slice(0, 2).map((topic, i) => (
                            <span key={i} className={`
                                px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors
                                ${isDark
                                    ? 'bg-white/5 border-white/5 text-slate-300 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 group-hover:text-purple-200'
                                    : 'bg-slate-50 text-slate-600 border-slate-100'
                                }
                            `}>
                                {topic}
                            </span>
                        ))}
                        {topics.length > 2 && (
                            <span className={`px-2 py-1 text-xs rounded-lg ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                +{topics.length - 2} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Status Indicator */}
                {status === 'action_required' && (
                    <div className="absolute bottom-4 right-4 z-20">
                        <span className="text-[10px] font-bold text-red-400 bg-red-950/30 border border-red-500/20 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <AlertCircle size={10} /> Action
                        </span>
                    </div>
                )}
            </div>

        </motion.div>
    );
}
