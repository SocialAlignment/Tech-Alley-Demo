'use client';

import { motion } from 'framer-motion';
import Link from "next/link";
import Image from "next/image";
import { Mic2, ExternalLink, Calendar, Target, Award, Users } from "lucide-react";
import { SocialTooltip } from "@/components/ui/social-media";
import { FaGlobe, FaYoutube, FaLinkedin, FaInstagram, FaEnvelope, FaXTwitter, FaPhone } from "react-icons/fa6";

export default function SpotlightPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">

            {/* --- CENTER COLUMN (Main Content) --- */}
            <div className="lg:col-span-12 space-y-8">

                {/* Header */}
                <div className="flex flex-col items-center justify-center text-center gap-4">
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
                            src="/hello-henderson-banner.png"
                            alt="Hello Henderson Podcast"
                            className="absolute inset-0 w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <span className="inline-block px-3 py-1 mb-3 rounded-full bg-purple-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                                Community Leader
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">Hello Henderson Podcast</h1>
                            <p className="text-lg text-slate-200 font-medium">Hosted By Hoz Roushdi</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Article Content */}
                        <div className="lg:col-span-8 space-y-6 text-lg text-slate-600 leading-relaxed">
                            <p>
                                <span className="font-bold text-slate-900 text-xl">Hosny “Hoz” Roushdi is the founder of Dead Sprint Radio</span>, the media network behind <strong>Hello Henderson</strong>, a community-powered podcast where conversations meet connection. As host and creator, Hoz amplifies local stories, bridging the gap between digital noise and authentic human experience to connect residents with the heartbeat of their city.
                            </p>
                            <p>
                                Beyond the mic, Hoz is an <strong>Enterprise Agile Coach</strong>, trainer, and transformation leader with over a decade of experience helping organizations improve how they work, deliver value, and develop people. He has supported healthcare, financial services, technology, and government organizations through large-scale transformation and workforce initiatives.
                            </p>
                            <p>
                                Hoz specializes in workforce development and designs cohort-based learning models connecting industry-recognized credentials with real-world application. Deeply committed to community impact, he brings a pragmatic, mission-first approach to supporting veterans, career changers, and the broader Henderson community.
                            </p>

                            <h3 className="text-2xl font-bold text-slate-900 pt-4">Big Things coming in 2026</h3>
                            <p>
                                We’re just getting started. 2026 is about amplifying the pulse of our city—connecting the innovators, the dreamers, and the doers who are building Henderson’s future. Join us as we turn up the volume on the stories that matter most.
                            </p>

                            {/* Media embed / Link Block */}
                            <div className="not-prose grid gap-4 my-8">
                                { /* Action Buttons */}
                                <a href="https://deadsprintradio.com" target="_blank" rel="noopener noreferrer" className="block group">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                            <Mic2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-700">Click to read Extended interview with Hoz</h4>
                                            <p className="text-sm text-slate-500">Deep Dive with Hoz</p>
                                        </div>
                                        <ExternalLink size={18} className="ml-auto text-slate-400 group-hover:text-indigo-400" />
                                    </div>
                                </a>
                                <a href="https://www.youtube.com/watch?v=KaO-I9hWlKM&t=172s" target="_blank" rel="noopener noreferrer" className="block group">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50 transition-all">
                                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                            <Mic2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-purple-700">Listen to Hoz's favorite episode of Hello Henderson</h4>
                                            <p className="text-sm text-slate-500">Episode: The Future of Vegas Tech</p>
                                        </div>
                                        <ExternalLink size={18} className="ml-auto text-slate-400 group-hover:text-purple-400" />
                                    </div>
                                </a>
                                <a href="https://academy.mba30.com/hoz-roushdi" target="_blank" rel="noopener noreferrer" className="block group">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-green-200 hover:bg-green-50 transition-all">
                                        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                            <Target size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-green-700">Learn More about Agile Coaching</h4>
                                            <p className="text-sm text-slate-500">Get your Agile Readiness Audit</p>
                                        </div>
                                        <ExternalLink size={18} className="ml-auto text-slate-400 group-hover:text-green-400" />
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Sidebar / Stats */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">Support Dead Sprint Radio</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 text-sm">Founded</span>
                                        <span className="font-bold text-slate-900">2025</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 text-sm">Primary Need</span>
                                        <span className="font-bold text-slate-900">Click that Subscribe button</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 text-sm">Secondary Need</span>
                                        <span className="font-bold text-slate-900">Sponsorships</span>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-4 text-sm">Connect with Hoz</h4>
                                    <SocialTooltip
                                        className="grid grid-cols-4 gap-y-6 justify-items-center"
                                        items={[
                                            {
                                                href: "https://deadsprintradio.com/",
                                                ariaLabel: "Website",
                                                tooltip: "Website",
                                                color: "#059669", // Emerald-600
                                                icon: FaGlobe,
                                            },
                                            {
                                                href: "https://www.youtube.com/@DeadSprintRadio",
                                                ariaLabel: "YouTube",
                                                tooltip: "YouTube",
                                                color: "#DC2626", // Red-600
                                                icon: FaYoutube,
                                            },
                                            {
                                                href: "https://www.linkedin.com/in/hosny-r-73400a6/",
                                                ariaLabel: "LinkedIn",
                                                tooltip: "LinkedIn",
                                                color: "#0077b5", // LinkedIn Blue
                                                icon: FaLinkedin,
                                            },
                                            {
                                                href: "https://www.instagram.com/deadsprintradio?igsh=NHFwam81M202dXhk",
                                                ariaLabel: "Instagram",
                                                tooltip: "Instagram",
                                                color: "#E4405F", // Instagram Brand Color
                                                icon: FaInstagram,
                                            },
                                            {
                                                href: "https://x.com/deadsprintradio?s=21",
                                                ariaLabel: "X (Twitter)",
                                                tooltip: "X (Twitter)",
                                                color: "#000000", // X Black
                                                icon: FaXTwitter,
                                            },
                                            {
                                                href: "mailto:hoz@deadsprintradio.com",
                                                ariaLabel: "Email",
                                                tooltip: "Email",
                                                color: "#EA4335", // Gmail Red-ish
                                                icon: FaEnvelope,
                                            },
                                            {
                                                href: "tel:626-494-5155",
                                                ariaLabel: "Phone",
                                                tooltip: "Phone",
                                                color: "#22C55E", // Green
                                                icon: FaPhone,
                                            },
                                        ]}
                                    />
                                    <div className="mt-8 flex justify-center w-full">
                                        <Image
                                            src="/dead-sprint-radio-logo.png"
                                            alt="Dead Sprint Radio Logo"
                                            width={350}
                                            height={350}
                                            className="mix-blend-multiply hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.article>
            </div>

            {/* --- RIGHT COLUMN REMOVED --- */}
        </div>
    );
}
