'use client';

import { motion } from 'framer-motion';
import { Mic2, ArrowRight, Search } from 'lucide-react';
import SpeakerCard from '@/components/SpeakerCard';

const SPEAKERS = [
    {
        name: "Shaq Cruz",
        title: "Founder",
        company: "Life Savers Restoration",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        topics: ["Resilience", "Disaster Recovery", "Local Business"]
    },
    {
        name: "Todd DeRemer",
        title: "General Manager",
        company: "The Pass Casino",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
        topics: ["Community Integration", "Hospitality Tech", "Economic Growth"]
    },
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
        topics: ["Podcasting", "Content Strategy", "Community"],
        isSpotlight: true
    }
];

export default function SpeakersPage() {
    return (
        <div className="flex flex-col gap-8 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- CENTER COLUMN (Main Content) --- */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Header & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Speakers</h1>
                            <p className="text-slate-500">Minds shaping tonight's conversation.</p>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Find a speaker..."
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all shadow-sm text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Speakers Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {SPEAKERS.map((speaker, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <SpeakerCard {...speaker} />
                            </motion.div>
                        ))}
                    </div>
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

            {/* Powered By Watermark */}
            <div className="w-full flex justify-center py-8 opacity-80 hover:opacity-100 transition-opacity">
                <img
                    src="/powered-by.png"
                    alt="Powered By Tech Alley & Innovation Hub"
                    className="h-16 w-auto object-contain"
                />
            </div>
        </div>
    );
}
