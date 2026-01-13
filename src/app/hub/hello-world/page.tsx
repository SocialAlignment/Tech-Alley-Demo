'use client';

import { motion } from 'framer-motion';
import { Gift, Mic2, ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useIdentity } from '@/context/IdentityContext';

const AGENDA_ITEMS = [
    { time: '6:00 PM', event: 'Networking & Check-In', desc: 'Grab a drink, meet the community.' },
    { time: '6:30 PM', event: 'Kickoff & "State of the Alley"', desc: 'Welcome from Lorraine & The Team.' },
    { time: '7:00 PM', event: 'Startup Spotlight: Vegas AI', desc: 'Demo from local innovators.' },
    { time: '7:30 PM', event: 'Guest Speaker: The Future of work', desc: 'Deep dive into AI workflows.' },
    { time: '8:15 PM', event: 'Raffle & Closing Remarks', desc: 'Win the AI Commercial!' },
];

const containerParams = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemParams = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function HelloWorldPage() {
    const router = useRouter();
    const { leadId } = useIdentity();

    const navigateTo = (path: string) => {
        router.push(leadId ? `${path}?id=${leadId}` : path);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* --- CENTER COLUMN (Main Dashboard) --- */}
            <div className="lg:col-span-8 space-y-8">

                {/* Top Bar: Greeting & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Hey, Tech Alley!</h1>
                        <p className="text-slate-500">Welcome back, get ready to innovate.</p>
                    </div>
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
                            <Sparkles size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search talks, speakers, or resources..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all shadow-sm text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Hero Illustration Card */}
                <motion.div
                    variants={itemParams}
                    initial="hidden"
                    animate="show"
                    className="relative bg-[#FDF4FF] rounded-[2rem] p-8 md:p-12 overflow-hidden border border-purple-100/50"
                >
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-white text-xs font-bold text-purple-700 shadow-sm border border-purple-100">
                                HAPPENING NOW
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                                Hello, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Henderson.</span>
                            </h2>
                            <p className="text-slate-600 text-lg mb-8 max-w-md">
                                Tonight is about connection. Check the agenda, enter the raffle, and meet the founders.
                            </p>
                            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                                View Full Schedule
                            </button>
                        </div>

                        {/* Illustration Placeholder - Replaced by Image tool if successful */}
                        <div className="w-full md:w-1/3 flex justify-center">
                            <div className="w-48 h-48 bg-white/50 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
                                <Sparkles size={48} className="text-purple-300" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid (Agenda & Stats) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Agenda Card */}
                    <motion.div variants={itemParams} initial="hidden" animate="show" className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-xl text-slate-800">Tonight's Agenda</h3>
                            <button className="text-sm font-semibold text-purple-600 hover:text-purple-700">View All</button>
                        </div>
                        <div className="space-y-6">
                            {AGENDA_ITEMS.slice(0, 3).map((item, i) => (
                                <div key={i} className="flex gap-4 items-start group">
                                    <div className="w-2 h-full pt-2 flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-purple-200 group-hover:bg-purple-500 transition-colors"></div>
                                        <div className="w-0.5 h-full bg-slate-50 mt-1"></div>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 block mb-0.5">{item.time}</span>
                                        <h4 className="text-sm font-bold text-slate-700 group-hover:text-purple-700 transition-colors">{item.event}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Stats / Interactive Card */}
                    <motion.div variants={itemParams} initial="hidden" animate="show" className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
                            <Gift size={32} />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">Win $5,000</h3>
                        <p className="text-slate-500 mb-6 text-sm">Worth of Video Production</p>
                        <button
                            onClick={() => navigateTo('/hub/giveaway')}
                            className="w-full py-3 rounded-xl border-2 border-slate-100 font-bold text-slate-600 hover:border-purple-200 hover:text-purple-600 hover:bg-purple-50 transition-all"
                        >
                            Enter Giveaway
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* --- RIGHT COLUMN (Widgets) --- */}
            <div className="lg:col-span-4 space-y-6">

                {/* User Profile Widget */}
                <motion.div variants={itemParams} initial="hidden" animate="show" className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
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
                        <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600 text-sm font-medium">
                            <span>2FA Security</span>
                            <span className="text-green-500 font-bold text-xs">Enabled</span>
                        </button>
                    </div>
                </motion.div>

                {/* Quick Access Widget ("Savings" style) */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-2">Quick Access</h3>

                    <motion.div
                        variants={itemParams}
                        initial="hidden" animate="show"
                        onClick={() => navigateTo('/hub/surveys')}
                        className="bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-[2rem] p-6 text-white cursor-pointer hover:shadow-lg hover:shadow-indigo-200 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Mic2 size={20} />
                        </div>
                        <h4 className="font-bold text-lg mb-1">Feedback</h4>
                        <p className="text-indigo-100 text-xs opacity-80">Help us improve Tech Alley</p>
                    </motion.div>

                    <motion.div
                        variants={itemParams}
                        initial="hidden" animate="show"
                        onClick={() => navigateTo('/hub/checklist')}
                        className="bg-gradient-to-br from-[#A855F7] to-[#9333EA] rounded-[2rem] p-6 text-white cursor-pointer hover:shadow-lg hover:shadow-purple-200 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ArrowRight size={20} />
                        </div>
                        <h4 className="font-bold text-lg mb-1">Companion App</h4>
                        <p className="text-purple-100 text-xs opacity-80">Track your progress tonight</p>
                    </motion.div>
                </div>
            </div>

        </div>
    );
}
