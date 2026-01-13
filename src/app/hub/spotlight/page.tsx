'use client';

import { motion } from 'framer-motion';
import Button from '@/components/Button';
import { ExternalLink, Users, Calendar, Mic2, ArrowRight } from 'lucide-react';

export default function SpotlightPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">

            {/* --- CENTER COLUMN (Main Content) --- */}
            <div className="lg:col-span-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Startup Spotlight</h1>
                        <p className="text-slate-500">Discover the innovators building the future.</p>
                    </div>
                </div>

                {/* Main Spotlight Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Image / Logo Section */}
                        <div className="w-full md:w-1/3 space-y-4">
                            <div className="aspect-square relative rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                    alt="Vegas AI Team"
                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm border border-slate-200">
                                    Vegas AI
                                </div>
                            </div>
                            <div className="flex justify-center gap-3">
                                <Button variant="primary" className="w-full text-sm">
                                    Visit
                                </Button>
                                <Button variant="outline" className="w-full text-sm">
                                    Follow
                                </Button>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider">Community Leader</span>
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Vegas AI Community</h2>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    Vegas AI is the premier community for Artificial Intelligence enthusiasts, developers, and founders in Southern Nevada.
                                    They are dedicated to democratizing AI education and fostering a hub of innovation right here in the desert.
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1 text-purple-600">
                                        <Users size={18} />
                                        <span className="text-xs font-bold uppercase">Community</span>
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900">500+</h4>
                                    <p className="text-xs text-slate-500">Active Members</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1 text-indigo-600">
                                        <Calendar size={18} />
                                        <span className="text-xs font-bold uppercase">Events</span>
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900">Weekly</h4>
                                    <p className="text-xs text-slate-500">In-Person Meetups</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
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
