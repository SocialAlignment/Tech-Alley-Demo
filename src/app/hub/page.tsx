'use client';

import { motion } from 'framer-motion';
import { Sparkles, Mic2, ArrowRight } from 'lucide-react';
import SpeakerCard from '@/components/SpeakerCard';
import RaffleWheel from '@/components/RaffleWheel';

const SPEAKERS = [
    {
        name: "Lorraine",
        title: "Founder & Organizer",
        company: "Tech Alley Henderson",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
        topics: ["State of the Alley", "Innovation Hub", "Community Growth"]
    },
    {
        name: "Jonathan",
        title: "Host",
        company: "Social Alignment",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200",
        topics: ["System Automation", "Lead Gen", "Digital Strategy"]
    },
    {
        name: "Jorge 'HOZ' Hernandez",
        title: "Host",
        company: "Dead Sprint",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
        topics: ["Podcasting", "Content Strategy", "Community"]
    }
];

export default function HubPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">

            {/* --- CENTER COLUMN (Main Content) --- */}
            <div className="lg:col-span-8 space-y-8">

                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Innovation Hub</h1>
                        <p className="text-slate-500">Connect, Learn, and Win.</p>
                    </div>
                    {/* Search Bar */}
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
                            <Sparkles size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Find speakers or topics..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all shadow-sm text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Hero / Welcome Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="gradient-card p-8 md:p-10 rounded-[2rem] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-white/30 text-xs font-mono text-purple-900 border border-white/20 font-bold">LIVE EVENT</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Welcome, Innovator.</h2>
                        <p className="text-slate-700 max-w-2xl text-lg">
                            You are now connected to the Tech Alley Henderson digital experience.
                            Use this hub to access tonight's resources, connect with speakers, and win prizes.
                        </p>
                    </div>
                </motion.section>

                {/* Speakers Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold text-slate-900">Tonight's Speakers</h3>
                        <span className="text-xs font-bold text-purple-600 cursor-pointer hover:underline">View All</span>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {SPEAKERS.map((speaker, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                            >
                                <SpeakerCard {...speaker} />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Raffle Section */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-50 to-transparent pointer-events-none"></div>

                    <div className="text-center mb-8 relative z-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Exclusive Raffle</h2>
                        <p className="text-sm text-slate-500">Spin for a chance to win a custom 12s AI Commercial!</p>
                    </div>

                    <div className="flex justify-center relative z-10">
                        <RaffleWheel />
                    </div>
                </motion.section>
            </div>

            {/* --- RIGHT COLUMN (Widgets) --- */}
            <div className="lg:col-span-4 space-y-6">

                {/* User Profile Widget */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                            TA
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">My Profile</h3>
                            <p className="text-xs text-slate-400">Manage your networking</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600 text-sm font-medium">
                            <span>Track Activity</span>
                            <span className="bg-white px-2 py-1 rounded-md text-xs shadow-sm text-slate-400">Settings</span>
                        </button>
                    </div>
                </motion.div>

                {/* Quick Access Widgets */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-2">Quick Access</h3>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-[2rem] p-6 text-white cursor-pointer hover:shadow-lg hover:shadow-indigo-200 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                            <Mic2 size={20} />
                        </div>
                        <h4 className="font-bold text-lg mb-1">Feedback</h4>
                        <p className="text-indigo-100 text-xs opacity-80">Help us improve</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-[#A855F7] to-[#9333EA] rounded-[2rem] p-6 text-white cursor-pointer hover:shadow-lg hover:shadow-purple-200 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                            <ArrowRight size={20} />
                        </div>
                        <h4 className="font-bold text-lg mb-1">Companion App</h4>
                        <p className="text-purple-100 text-xs opacity-80">Checklist & Progress</p>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
