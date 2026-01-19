'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Lightbulb, Rocket, Mic2, Gift, MessageSquare,
    Compass, BookOpen, Users, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface NavTileProps {
    title: string;
    description: string;
    icon: React.ElementType;
    href: string;
    actionLabel?: string;
    color: 'cyan' | 'magenta' | 'purple' | 'lime' | 'orange';
    delay?: number;
    className?: string; // For grid spans
}

const NavTile = ({ title, description, icon: Icon, href, actionLabel = "ENTER", color, delay = 0, className = "" }: NavTileProps) => {

    const colorStyles = {
        cyan: {
            border: 'border-cyan-500/50 group-hover:border-cyan-400',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)]',
            icon: 'text-cyan-400',
            bg: 'bg-cyan-950/10'
        },
        magenta: {
            border: 'border-fuchsia-500/50 group-hover:border-fuchsia-400',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(232,121,249,0.4)]',
            icon: 'text-fuchsia-400',
            bg: 'bg-fuchsia-950/10'
        },
        purple: {
            border: 'border-violet-500/50 group-hover:border-violet-400',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(167,139,250,0.4)]',
            icon: 'text-violet-400',
            bg: 'bg-violet-950/10'
        },
        lime: {
            border: 'border-lime-500/50 group-hover:border-lime-400',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(163,230,53,0.4)]',
            icon: 'text-lime-400',
            bg: 'bg-lime-950/10'
        },
        orange: {
            border: 'border-orange-500/50 group-hover:border-orange-400',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(251,146,60,0.4)]',
            icon: 'text-orange-400',
            bg: 'bg-orange-950/10'
        }
    };

    const style = colorStyles[color];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.4 }}
            className={`h-full ${className}`}
        >
            <Link href={href} className="block h-full">
                <div className={`group relative h-full p-6 md:p-8 rounded-2xl bg-[#0B1121] border ${style.border} transition-all duration-300 ${style.glow} hover:-translate-y-2 flex flex-col justify-between overflow-hidden`}>

                    {/* Background decoration */}
                    <div className={`absolute top-0 right-0 w-32 h-32 ${style.bg} rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:opacity-100 opacity-50`}></div>

                    <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center ${style.icon} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon size={28} strokeWidth={1.5} />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">{title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">{description}</p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-slate-800">
                        <span className={`text-xs font-bold ${style.icon} tracking-widest`}>{actionLabel}</span>
                        <div className={`w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center ${style.icon} group-hover:bg-slate-800 transition-colors`}>
                            <ArrowRight size={14} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default function StartGrid() {
    return (
        <section id="hub-tiles-grid" className="relative py-12 md:py-24 px-6 md:px-12 lg:px-20 -mt-20 z-20">
            <div className="max-w-7xl mx-auto">
                {/* 
                  BENTO GRID LAYOUT:
                  - 4 columns on desktop 
                  - Variable row sizing 
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">

                    {/* 1. STARTUP SPOTLIGHT: Large 2x2 tile */}
                    <NavTile
                        className="lg:col-span-2 lg:row-span-2 min-h-[400px]"
                        title="Startup Spotlight"
                        description="Discover the featured startup of the month. See who's disrupting the industry tonight."
                        icon={Rocket}
                        href="#section-spotlight"
                        color="cyan"
                        delay={0.1}
                    />

                    {/* 2. NETWORKING: Wide 2x1 tile */}
                    <NavTile
                        className="lg:col-span-2"
                        title="Next Level Networking"
                        description="Complete your profile to unlock connections."
                        icon={Users}
                        href="#section-networking"
                        color="purple"
                        delay={0.2}
                    />

                    {/* 3. SPEAKER RESOURCES: Standard 1x1 */}
                    <NavTile
                        title="Speaker Resources"
                        description="Decks & info."
                        icon={Mic2}
                        href="#section-speakers"
                        color="magenta"
                        delay={0.3}
                    />

                    {/* 4. RAFFLE: Standard 1x1 */}
                    <NavTile
                        title="Hub Raffle"
                        description="Enter to win prizes."
                        icon={Gift}
                        href="#section-raffle"
                        color="lime"
                        delay={0.4}
                    />

                    {/* 5. MISSION HUB: Standard 1x1 */}
                    <NavTile
                        title="Mission Hub"
                        description="Earn XP & Perks."
                        icon={Compass}
                        href="#section-mission"
                        color="orange"
                        actionLabel="START"
                        delay={0.5}
                    />

                    {/* 6. FEEDBACK: Standard 1x1 */}
                    <NavTile
                        title="Feedback"
                        description="Share thoughts."
                        icon={MessageSquare}
                        href="#section-feedback"
                        color="cyan"
                        delay={0.6}
                    />

                    {/* 7. RESOURCES: Standard 1x1 */}
                    <NavTile
                        title="Resource Library"
                        description="Free tools & guides."
                        icon={BookOpen}
                        href="#section-resources"
                        color="purple"
                        delay={0.7}
                    />

                    {/* 8. CONNECT: Standard 1x1 */}
                    <NavTile
                        title="Connect With Us"
                        description="Collaborate with us."
                        icon={Users}
                        href="#section-contact"
                        color="magenta"
                        delay={0.8}
                    />

                </div>
            </div>
        </section>
    );
}
