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
        name: "Jonathan Sterritt",
        title: "Host",
        company: "Social Alignment",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200",
        topics: ["System Automation", "Lead Gen", "Digital Strategy"]
    },
    {
        name: "Hoz Roshndi",
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
                <div className="lg:col-span-12 space-y-8">

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
