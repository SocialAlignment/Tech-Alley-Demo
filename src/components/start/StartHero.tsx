'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar, CheckSquare } from 'lucide-react';
import { useIdentity } from '@/context/IdentityContext';
import { useRouter } from 'next/navigation';

const CountdownDisplay = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                const pad = (n: number) => n < 10 ? `0${n}` : n;
                return `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m`;
            }
            return 'LIVE NOW';
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        setTimeLeft(calculateTimeLeft());
        return () => clearInterval(timer);
    }, [targetDate]);

    return <span className="font-mono text-cyan-400 text-lg tracking-widest">{timeLeft}</span>;
};

export default function StartHero() {
    const { isProfileComplete, leadId } = useIdentity();
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleProfileClick = () => {
        const url = leadId ? `/hub/profile/qualify?id=${leadId}` : '/hub/profile/qualify';
        router.push(url);
    };

    const scrollToTiles = () => {
        const element = document.getElementById('hub-tiles-grid');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative w-full min-h-[90vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 overflow-hidden pt-20">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[#020617] -z-20"></div>
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 -z-10 bg-center mask-image-gradient"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10"></div>

            {/* Info Cluster - Moved from Top Bar to keep sticky nav clean, or we can keep it absolute if we want */}
            <div className="absolute top-24 right-6 md:right-12 hidden md:flex items-start gap-4 z-40">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-end bg-slate-900/50 backdrop-blur-md border border-slate-800 p-3 rounded-xl"
                >
                    <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
                        <Clock size={12} />
                        <span>Local Time</span>
                    </div>
                    <div className="text-white font-mono text-lg font-bold">
                        {currentTime}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col items-end bg-slate-900/50 backdrop-blur-md border border-slate-800 p-3 rounded-xl border-l-2 border-l-cyan-500 shadow-[0_0_20px_-5px_rgba(34,211,238,0.2)]"
                >
                    <div className="flex items-center gap-2 text-cyan-400 text-xs uppercase font-bold tracking-wider mb-1">
                        <Calendar size={12} />
                        <span>Event Starts In</span>
                    </div>
                    <CountdownDisplay targetDate="2026-01-21T17:00:00-08:00" />
                </motion.div>
            </div>

            {/* Main Hero Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl z-10"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    Live Command Center
                </div>

                <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                    Start Here: <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                        Your Interactive Event
                    </span> <br />
                    Command Center
                </h2>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-light">
                    Explore sessions, connect with people, and unlock missions that turn one night into lasting momentum.
                    This is your dashboard for the entire event.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleProfileClick}
                        className={`group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold uppercase tracking-wider rounded-none clip-path-polygon hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] transition-all transform hover:-translate-y-1`}
                        style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                    >
                        <span className="flex items-center gap-3">
                            {isProfileComplete ? 'View Your Profile' : 'Complete Profile'}
                            {isProfileComplete ? <CheckSquare size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </span>
                    </button>

                    <button
                        onClick={scrollToTiles}
                        className="px-8 py-4 bg-transparent border border-slate-700 text-slate-300 font-bold uppercase tracking-wider hover:bg-slate-800/50 hover:text-white hover:border-slate-500 transition-all"
                        style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                    >
                        Explore Experiences
                    </button>
                </div>
            </motion.div>

        </div>
    );
}
