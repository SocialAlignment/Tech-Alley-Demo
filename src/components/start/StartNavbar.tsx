'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Rocket, CheckSquare } from 'lucide-react';
import { useIdentity } from '@/context/IdentityContext';
import { useRouter } from 'next/navigation';

export default function StartNavbar() {
    const { isProfileComplete, leadId } = useIdentity();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const handleProfileClick = () => {
        const url = leadId ? `/hub/profile/qualify?id=${leadId}` : '/hub/profile/qualify';
        router.push(url);
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-[#020617]/90 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">

                {/* Logo Area */}
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Rocket className="text-white" size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-white text-lg leading-tight tracking-tight">
                            Alignment<span className="text-cyan-400">Hub</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Innovation Henderson
                        </span>
                    </div>
                </div>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-8">
                    {['Missions', 'Speakers', 'Raffle', 'Resources'].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(`section-${item.toLowerCase()}`)}
                            className="text-sm font-medium text-slate-300 hover:text-cyan-400 uppercase tracking-widest transition-colors"
                        >
                            {item}
                        </button>
                    ))}

                    <button
                        onClick={handleProfileClick}
                        className={`px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${isProfileComplete
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
                                : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-[0_0_20px_-5px_rgba(34,211,238,0.5)]'
                            }`}
                    >
                        {isProfileComplete ? 'Profile Active' : 'Complete Profile'}
                    </button>
                </div>

                {/* Mobile Menu Icon (Placeholder - relying on grid for main nav on mobile) */}
                <div className="lg:hidden">
                    <button
                        onClick={handleProfileClick}
                        className={`p-2 rounded-lg ${isProfileComplete ? 'text-green-400 bg-green-900/20' : 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/30'
                            }`}
                    >
                        <CheckSquare size={20} />
                    </button>
                </div>

            </div>
        </motion.nav>
    );
}
