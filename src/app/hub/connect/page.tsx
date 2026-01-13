'use client';

import { motion } from 'framer-motion';
import { Share2, Linkedin, Globe, Instagram, Mail, Mic2, ArrowRight, Sparkles } from 'lucide-react';

const SOCIALS = [
    { label: "LinkedIn", icon: Linkedin, url: "https://linkedin.com", color: "hover:text-[#0077b5]" },
    { label: "Instagram", icon: Instagram, url: "https://instagram.com", color: "hover:text-[#E1306C]" },
    { label: "TechAlley.org", icon: Globe, url: "https://techalley.org", color: "hover:text-primary" },
    { label: "Email the Team", icon: Mail, url: "mailto:hello@techalley.org", color: "hover:text-green-400" },
];

export default function ConnectPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">

            {/* --- CENTER COLUMN (Main Content) --- */}
            <div className="lg:col-span-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Connect With Us</h1>
                        <p className="text-slate-500">Join the digital conversation.</p>
                    </div>
                    {/* Search Bar */}
                    <div className="relative w-full md:w-80 group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
                            <Sparkles size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Find connection options..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all shadow-sm text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    {SOCIALS.map((social, i) => (
                        <motion.a
                            key={i}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all group"
                        >
                            <div className={`w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform ${social.color.replace('hover:', 'text-')}`}>
                                <social.icon size={32} />
                            </div>
                            <span className="font-bold text-slate-800 text-lg">{social.label}</span>
                            <div className="px-4 py-1 rounded-full bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                Connect
                            </div>
                        </motion.a>
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
    );
}
