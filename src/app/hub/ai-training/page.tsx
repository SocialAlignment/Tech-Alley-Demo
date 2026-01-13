'use client';

import { motion } from 'framer-motion';
import Button from '@/components/Button';
import { ArrowRight, Sparkles, Mic2 } from 'lucide-react';

export default function AITrainingPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">

            {/* --- CENTER COLUMN (Main Content) --- */}
            <div className="lg:col-span-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">AI Masterclass</h1>
                        <p className="text-slate-500">From Chaos to Clarity in 24 Hours.</p>
                    </div>
                    {/* Search Bar */}
                    <div className="relative w-full md:w-80 group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
                            <Sparkles size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Find training modules..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all shadow-sm text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Hero Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-10 shadow-lg group gradient-card"
                >
                    <div className="absolute inset-0 bg-grid-slate-500/[0.05] -z-10" />
                    <div className="relative z-10 flex flex-col items-start gap-4">
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white mb-2">
                            <Sparkles size={24} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                            Master Generative AI <br />
                            <span className="opacity-80">For Your Business</span>
                        </h2>
                        <p className="text-indigo-100 text-lg max-w-lg mb-4">
                            Details on how to build, automate, and deploy AI agents that work for you 24/7.
                        </p>
                        <Button variant="primary" className="bg-white text-purple-600 hover:bg-slate-50 border-0 shadow-lg shadow-purple-900/20">
                            Start Learning <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </div>
                </motion.div>

                {/* Modules Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="text-4xl font-bold text-slate-100 mb-4 group-hover:text-purple-100 transition-colors">01</div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Automation 101</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Learn the basics of Zapier and Make.com to streamline workflows.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="text-4xl font-bold text-slate-100 mb-4 group-hover:text-indigo-100 transition-colors">02</div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Bot Building</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Create your first custom GPT assistant with no code required.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="text-4xl font-bold text-slate-100 mb-4 group-hover:text-pink-100 transition-colors">03</div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Content Engine</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Automate your social media workflow and content distribution.</p>
                    </motion.div>
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
    );
}
