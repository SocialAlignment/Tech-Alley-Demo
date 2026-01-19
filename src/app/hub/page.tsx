'use client';

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Gift, Users, Calendar, Megaphone, BookOpen,
    Zap, Mail, ArrowRight, Play, ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIdentity } from '@/context/IdentityContext';
import SpeakerCard from '@/components/SpeakerCard';
import { cn } from '@/lib/utils';

// --- DATA CONSTANTS ---

const SPEAKERS = [
    {
        name: "Lorraine",
        title: "Founder & Organizer",
        company: "Tech Alley Henderson",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
        topics: ["State of the Alley", "Innovation Hub", "Community Growth"],
        id: "0"
    },
    {
        name: "Jonathan",
        title: "Host",
        company: "Social Alignment",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200",
        topics: ["System Automation", "Lead Gen", "Digital Strategy"],
        id: "1"
    },
    {
        name: "Jorge 'HOZ' Hernandez",
        title: "Host",
        company: "Dead Sprint",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
        topics: ["Podcasting", "Content Strategy", "Community"],
        id: "2"
    }
];

// --- COMPONENTS ---

const CircuitryBackground = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        {/* Animated Orbs/Glows */}
        <motion.div
            animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]"
        />
        <motion.div
            animate={{ opacity: [0.1, 0.2, 0.1], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
    </div>
);

const FeatureTile = ({ icon: Icon, title, desc, href, delay }: { icon: any, title: string, desc: string, href: string, delay: number }) => (
    <Link href={href}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="group relative h-full bg-slate-900/40 border border-slate-800/60 hover:border-cyan-500/50 rounded-2xl p-6 backdrop-blur-sm overflow-hidden transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Light Sweep */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 group-hover:bg-cyan-950/50 border border-slate-700 group-hover:border-cyan-500/50 flex items-center justify-center mb-4 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-white mb-2 transition-colors">{title}</h3>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 mb-4 flex-grow">{desc}</p>

                <div className="flex items-center text-xs font-bold text-slate-500 group-hover:text-cyan-400 transition-colors uppercase tracking-wider">
                    Explore <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </motion.div>
    </Link>
);

const ConnectionTile = ({ label, children, delay }: { label: string, children: React.ReactNode, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors backdrop-blur-sm flex flex-col justify-center items-center text-center group"
    >
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 group-hover:text-slate-400 transition-colors">{label}</div>
        {children}
    </motion.div>
);

export default function HubPage() {
    const router = useRouter();
    const { leadId, userName } = useIdentity();
    const displayName = userName ? userName.split(' ')[0] : 'Innovator';

    const navigateTo = (path: string) => {
        router.push(leadId ? `${path}?id=${leadId}` : path);
    };

    const startTour = () => {
        const driverObj = driver({
            showProgress: true,
            steps: [
                { element: '#hub-hero', popover: { title: 'Welcome Console', description: 'Your main dashboard for the event.' } },
                { element: '#nav-start-here', popover: { title: 'Start Here', description: 'Begin your journey and set up your profile.' } },
                { element: '#nav-agenda', popover: { title: 'Agenda', description: 'Plan your evening with the event schedule.' } },
                { element: '#hub-tiles', popover: { title: 'Feature Hub', description: 'Quick access to all key event resources.' } },
                { element: '#hub-speakers', popover: { title: 'Speakers', description: 'Meet tonight\'s industry leaders.' } },
                { element: '#hub-connect-bar', popover: { title: 'Connection Zone', description: 'Network, find resources, and contact us.' } },
            ]
        });
        driverObj.drive();
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 relative overflow-x-hidden">
            <CircuitryBackground />

            {/* --- TOP NAV --- */}
            <nav className="relative z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Area */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <Zap className="w-5 h-5 text-white fill-white" />
                            </div>
                            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Alignment Hub
                            </span>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                            <Link id="nav-start-here" href="/hub/start" className="hover:text-white transition-colors">Start Here</Link>
                            <Link id="nav-agenda" href="/hub/agenda" className="hover:text-white transition-colors">Agenda</Link>
                            <Link href="/hub/upcoming" className="hover:text-white transition-colors">Upcoming Events</Link>
                            <Link href="/hub/checklist" className="hover:text-white transition-colors">Missions</Link>

                            <button
                                onClick={startTour}
                                className="px-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wide transition-all border border-slate-700"
                            >
                                Take a Tour
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col space-y-16 pb-24">

                {/* --- 1. HERO CONSOLE --- */}
                <section id="hub-hero" className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 rounded-[2.5rem] blur-xl" />
                    <div className="relative bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 md:p-16 overflow-hidden backdrop-blur-sm shadow-2xl">

                        {/* Background Detail */}
                        <div className="absolute top-0 right-0 p-12 opacity-30 pointer-events-none">
                            <div className="w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 space-y-8 text-center md:text-left">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
                                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                        Interactive Console
                                    </div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                                        Welcome to the<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                            Innovation Hub
                                        </span>
                                    </h1>
                                </div>

                                <div className="space-y-4 max-w-lg mx-auto md:mx-0">
                                    <h2 className="text-2xl font-bold text-slate-200 flex items-center justify-center md:justify-start gap-2">
                                        Hello, <span className="text-blue-400">{displayName}.</span>
                                    </h2>
                                    <p className="text-slate-400 text-lg leading-relaxed">
                                        You are now connected to the Tech Alley Henderson interactive hub. Use this dashboard to navigate your event experience.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
                                    <button
                                        onClick={startTour}
                                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                    >
                                        <Zap className="w-5 h-5 fill-current" />
                                        Take a Tour
                                        <span className="flex h-3 w-3 relative ml-1">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white/50"></span>
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => navigateTo('/genai-raffle')}
                                        className="px-8 py-4 bg-transparent border border-white/20 hover:border-cyan-400/50 text-white hover:text-cyan-400 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <Gift className="w-5 h-5 group-hover:scale-110 transition-transform text-purple-400" />
                                        Win Free GenAI Video Content
                                    </button>
                                </div>
                            </div>

                            {/* Hero Visual */}
                            <div className="w-full md:w-5/12 flex justify-center">
                                <motion.div
                                    animate={{ y: [0, -15, 0], rotate: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                    className="relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-full border border-slate-700/50 flex items-center justify-center shadow-2xl shadow-blue-500/10"
                                >
                                    <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute inset-4 rounded-full border border-blue-500/20 animate-[spin_15s_linear_infinite_reverse]" />
                                    <Zap className="w-32 h-32 text-slate-700 drop-shadow-lg" />

                                    {/* Floating stats or icons could go here */}
                                    <div className="absolute -right-4 top-10 bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-bold text-slate-300">HUB ACTIVE</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 2. FEATURE TILES --- */}
                <section id="hub-tiles" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FeatureTile
                        icon={Calendar}
                        title="Tonight's Agenda"
                        desc="View the full run of show and timing."
                        href="/hub/agenda"
                        delay={0.1}
                    />
                    <FeatureTile
                        icon={Megaphone}
                        title="Announcements"
                        desc="Live updates and important news."
                        href="/hub/announcements"
                        delay={0.2}
                    />
                    <FeatureTile
                        icon={BookOpen}
                        title="Speaker Resources"
                        desc="Slides, links, and key takeaways."
                        href="/hub/speaker-resources"
                        delay={0.3}
                    />
                    <FeatureTile
                        icon={Users}
                        title="Networking"
                        desc="Connect with attendees and grow."
                        href="/hub/networking"
                        delay={0.4}
                    />
                </section>

                {/* --- 3. SPEAKERS SPOTLIGHT --- */}
                <section id="hub-speakers" className="space-y-6">
                    <div className="flex items-center justify-between px-2 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                            <h3 className="text-2xl font-bold text-white">Tonight's Speakers</h3>
                        </div>
                        <Link href="/hub/speakers" className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-widest border border-purple-500/30 px-4 py-2 rounded-full hover:bg-purple-950/30 transition-all">
                            View All
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {SPEAKERS.map((speaker, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.2 + (i * 0.1) }}
                            >
                                <SpeakerCard
                                    speaker={{
                                        ...speaker,
                                        completion: 100,
                                        status: 'complete'
                                    }}
                                    variant="dark"
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* --- 4. CONNECTION BAR --- */}
                <section id="hub-connect-bar" className="flex flex-col md:flex-row gap-4 pt-8">
                    <ConnectionTile label="Connect with Others" delay={0.5}>
                        <Link href="/hub/networking" className="w-full h-full flex items-center justify-center p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <div className="flex flex-col items-center gap-2">
                                <Users className="w-6 h-6 text-blue-400" />
                                <span className="text-sm font-semibold text-slate-200">Attendee Directory</span>
                            </div>
                        </Link>
                    </ConnectionTile>

                    <ConnectionTile label="Free Resources" delay={0.6}>
                        <Link href="/hub/resources" className="w-full h-full flex items-center justify-center p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <div className="flex flex-col items-center gap-2">
                                <BookOpen className="w-6 h-6 text-purple-400" />
                                <span className="text-sm font-semibold text-slate-200">Access Library</span>
                            </div>
                        </Link>
                    </ConnectionTile>

                    <ConnectionTile label="Connect With Us" delay={0.7}>
                        <div className="flex items-center gap-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800 w-full hover:border-slate-700 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                <img src="/logo-sa.png" alt="JS" className="w-full h-full object-cover opacity-80" />
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">Jonathan Sterritt</p>
                                <a href="mailto:jonathan@socialalignment.biz" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 truncate">
                                    <Mail size={10} /> jonathan@socialalignment.biz
                                </a>
                            </div>
                        </div>
                    </ConnectionTile>
                </section>

                {/* --- FOOTER --- */}
                <footer className="pt-12 pb-8 flex flex-col items-center justify-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-2" />
                    <div className="flex items-center gap-2 select-none pointer-events-none">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Powered By</span>
                        <div className="flex items-center gap-1.5 grayscale opacity-80">
                            {/* Simple text logo representation or SVG if available */}
                            <span className="text-xs font-black text-slate-300 tracking-tighter">TECH ALLEY</span>
                        </div>
                    </div>
                    {/* Hidden Admin Trigger - Kept from original */}
                    <div
                        onClick={() => router.push('/admin')}
                        className="w-20 h-4 mt-2 cursor-default"
                        title=""
                    />
                </footer>

            </div>
        </div>
    );
}

