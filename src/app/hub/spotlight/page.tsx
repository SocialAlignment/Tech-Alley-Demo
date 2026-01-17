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

                {/* Main Spotlight Article */}
                <motion.article
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden"
                >
                    {/* Article Header Image */}
                    <div className="relative h-64 md:h-80 w-full">
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                            alt="Vegas AI Team"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <span className="inline-block px-3 py-1 mb-3 rounded-full bg-purple-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                                Community Leader
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">Vegas AI Community</h1>
                            <p className="text-lg text-slate-200 font-medium">Democratizing Innovation in the Desert</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Article Content */}
                        <div className="lg:col-span-8 space-y-6 text-lg text-slate-600 leading-relaxed">
                            <p>
                                <span className="font-bold text-slate-900 text-xl">Vegas AI is the premier community</span> for Artificial Intelligence enthusiasts, developers, and founders in Southern Nevada.
                                Born from a desire to bridge the gap between abstract technology and practical application, they are dedicated to building a hub of innovation right here in Henderson.
                            </p>
                            <p>
                                "We want to make sure no one gets left behind in this revolution," says the founding team. Their weekly meetups have become a staple for local founders looking to integrate LLMs and automation into their workflows.
                            </p>

                            <h3 className="text-2xl font-bold text-slate-900 pt-4">The 'Hello Henderson' Connection</h3>
                            <p>
                                Recently featured on the <strong>Hello Henderson</strong> podcast, the team discussed their roadmap for 2026 and how local businesses can leverage AI for 10x growth.
                            </p>

                            {/* Media embed / Link Block */}
                            <div className="not-prose grid gap-4 my-8">
                                <a href="https://socialalignment.biz" target="_blank" rel="noopener noreferrer" className="block group">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50 transition-all">
                                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                            <Mic2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-purple-700">Listen on 'Hello Henderson'</h4>
                                            <p className="text-sm text-slate-500">Episode: The Future of Vegas Tech</p>
                                        </div>
                                        <ExternalLink size={18} className="ml-auto text-slate-400 group-hover:text-purple-400" />
                                    </div>
                                </a>
                                <a href="https://deadsprintradio.com" target="_blank" rel="noopener noreferrer" className="block group">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                            <Mic2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-700">Dead Sprint Radio Feature</h4>
                                            <p className="text-sm text-slate-500">Deep Dive with Hoz</p>
                                        </div>
                                        <ExternalLink size={18} className="ml-auto text-slate-400 group-hover:text-indigo-400" />
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Sidebar / Stats */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">Community Stats</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 text-sm">Active Members</span>
                                        <span className="font-bold text-slate-900">500+</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 text-sm">Founded</span>
                                        <span className="font-bold text-slate-900">2023</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 text-sm">Meeting Cadence</span>
                                        <span className="font-bold text-slate-900">Weekly</span>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2 text-sm">Connect with Founders</h4>
                                    <Button variant="primary" className="w-full text-sm mb-2">
                                        Visit Website
                                    </Button>
                                    <Button variant="glass" className="w-full text-sm">
                                        Follow on LinkedIn
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.article>
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
