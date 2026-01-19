'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { AlertCircle, HelpCircle, MessageSquare, Star } from 'lucide-react';
import type { ExtendedSpeaker } from './SpeakerDrawer';
import { MouseEvent } from 'react';

interface SpeakerCardProps {
    speaker: ExtendedSpeaker;
    onClick?: (action?: 'questions' | 'feedback') => void;
    isSpotlight?: boolean;
    variant?: 'light' | 'dark';
    layout?: 'compact' | 'comprehensive';
}

export default function SpeakerCard({ speaker, onClick, isSpotlight, variant = 'dark', layout = 'compact' }: SpeakerCardProps) {
    const { name, title, company, image, topics, completion, status, promoImage } = speaker;

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
    const isComprehensive = layout === 'comprehensive';

    return (
        <motion.div
            layoutId={`card-${speaker.id}`}
            onClick={() => onClick?.()}
            onMouseMove={handleMouseMove}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`
                group relative overflow-hidden rounded-[2rem] border transition-all duration-500 cursor-pointer h-full
                ${isDark
                    ? 'bg-slate-900/60 border-white/5 hover:border-cyan-500/30'
                    : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-xl'
                }
                ${isSpotlight && isDark ? 'ring-1 ring-purple-500/50 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]' : ''}
            `}
        >
            {/* Spotlight Glow Effect (Dark Mode Only) */}
            {isDark && (
                <>
                    <motion.div
                        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 rounded-[2rem] z-0"
                        style={{ background: glowBackground }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                </>
            )}

            {isSpotlight && (
                <div className="absolute top-0 right-0 z-20">
                    <div className="bg-gradient-to-bl from-purple-600 to-indigo-600 text-white text-[10px] uppercase font-bold px-4 py-1.5 rounded-bl-2xl shadow-lg">
                        Spotlight
                    </div>
                </div>
            )}

            {/* Content Container */}
            <div className={`relative z-10 p-6 flex flex-col h-full ${isComprehensive ? '' : ''}`}>

                {isComprehensive ? (
                    // --- COMPREHENSIVE LAYOUT (Avatar w/ Logo on right, text below) ---
                    <>
                        <div className="flex items-start justify-between mb-6">
                            {/* Avatar */}
                            <div className={`
                                relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 shadow-lg border-2 
                                ${isDark ? 'border-white/10 group-hover:border-cyan-400/50' : 'border-slate-200'}
                                transition-colors
                            `}>
                                <img
                                    src={image}
                                    alt={name}
                                    className={speaker.imageClassName || "w-full h-full object-cover object-top"}
                                />
                                {isSpotlight && (
                                    <div className="absolute inset-0 rounded-2xl ring-2 ring-purple-500/50 animate-pulse" />
                                )}
                            </div>

                            {/* Logos */}
                            {(promoImage || speaker.id === '2') && (
                                <div className="w-56 h-48 -mt-2 mr-2 flex items-center justify-center opacity-100">
                                    {speaker.id === '2' ? (
                                        <HelpCircle className="w-36 h-36 text-white opacity-80" />
                                    ) : (
                                        <img
                                            src={promoImage}
                                            alt="Logo"
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="mt-auto flex flex-col h-full">
                            <div>
                                <h3 className={`text-3xl font-bold leading-tight mb-1 truncate
                                    ${isDark ? 'text-white group-hover:text-cyan-400' : 'text-slate-900'}
                                    transition-colors
                                `}>
                                    {name}
                                </h3>
                                <p className={`text-base font-medium mb-4 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {title}, {company}
                                </p>
                            </div>

                            {/* Action Buttons - Pushed to bottom */}
                            <div className="mt-auto space-y-3">
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onClick?.('questions');
                                        }}
                                        className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
                                    >
                                        <MessageSquare size={16} />
                                        Question
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onClick?.('feedback');
                                        }}
                                        className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-white/10 active:scale-95"
                                    >
                                        <Star size={16} />
                                        Feedback
                                    </button>
                                </div>

                                <div className={`
                                    rounded-xl px-3 py-2 border flex items-center gap-2
                                    ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}
                                 `}>
                                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                    <span className={`text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Speaking On</span>
                                    <span className={`text-sm truncate ${isDark ? 'text-cyan-200/80' : 'text-cyan-700'}`}>
                                        {topics[0]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // --- COMPACT LAYOUT (Original) ---
                    <>
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
                    </>
                )}


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
