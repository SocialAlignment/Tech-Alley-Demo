'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Clock, ArrowRight, User, Briefcase, Award, FileText, Mail, Linkedin, Globe, Phone, Share2, MessageSquare, Quote, Monitor, Mic2, AlertCircle, Check, Camera, Save, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

// --- Types ---
export interface ExtendedSpeaker {
    id: string;
    name: string;
    title: string;
    company: string;
    image: string;
    promoImage?: string; // New field for the side-panel "pop-out" image
    topics: string[];
    // Extended Data
    email?: string;
    phone?: string;
    bioShort?: string;
    bioFull?: string;
    socials?: {
        linkedin?: string;
        twitter?: string;
        website?: string;
        instagram?: string;
        facebook?: string;
        youtube?: string;
        scheduling?: string;
        tiktok?: string;
    };
    quote?: string;
    industry?: string;
    valueProposition?: string; // "I help [Blank], do [blank], using [blank]"
    landingPage?: string;
    deckLink?: string;
    resourceLink?: string; // Link to Download

    // Restored Fields
    sessionTitle?: string;
    sessionAbstract?: string;

    status: 'complete' | 'pending' | 'action_required';
    completion: number; // 0-100
}

interface SpeakerDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    speaker: ExtendedSpeaker | null;
}

// --- Components ---

const TabButton = ({ active, label, icon: Icon, onClick }: any) => (
    <button
        onClick={onClick}
        className={clsx(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap",
            active ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
        )}
    >
        <Icon size={16} />
        {label}
    </button>
);

const SectionHeader = ({ title, children }: any) => (
    <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
        {children && <p className="text-sm text-slate-500">{children}</p>}
    </div>
);

const InputField = ({ label, value, placeholder }: any) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        <input
            type="text"
            defaultValue={value}
            placeholder={placeholder}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all text-sm font-medium text-slate-700"
        />
    </div>
);

const TextAreaField = ({ label, value, placeholder }: any) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        <textarea
            defaultValue={value}
            placeholder={placeholder}
            rows={4}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all text-sm font-medium text-slate-700 resize-none"
        />
    </div>
);

// --- Main Drawer ---

export default function SpeakerDrawer({ isOpen, onClose, speaker }: SpeakerDrawerProps) {
    const [activeTab, setActiveTab] = useState('bio');

    if (!speaker) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-hidden" // Increased backdrop opacity
                        aria-hidden="true"
                    />

                    {/* Drawer Container - Removed Padding for Full Bleed Effect if needed, or keeping tight */}
                    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden pointer-events-none">
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className={
                                clsx(
                                    "relative w-full h-full bg-transparent shadow-2xl pointer-events-auto flex",
                                    speaker.promoImage ? "md:max-w-[90vw]" : "md:w-[900px]" // Maximizing width to 90vw for pop-out layout
                                )}
                        >
                            {/* LEFT PANEL: Promo Image (Desktop Only) */}
                            {speaker.promoImage && (
                                <div className="hidden md:block w-1/2 h-full shrink-0 relative overflow-hidden bg-slate-900">
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 to-transparent z-10"></div>
                                    <img
                                        src={speaker.promoImage}
                                        alt={`${speaker.name} Promo`}
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                            )}

                            {/* RIGHT PANEL: Content */}
                            <div className={clsx(
                                "flex-1 bg-white h-full overflow-hidden flex flex-col shadow-2xl z-20",
                                speaker.promoImage ? "" : "rounded-l-3xl border-l border-white/20" // Square off left side if promo exists
                            )}>

                                {/* PROMINENT HERO HEADER */}
                                <div className="relative min-h-[20rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shrink-0">
                                    {/* Pattern Overlay */}
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>

                                    <div className="relative h-full px-8 py-6 flex flex-col justify-between z-20">
                                        {/* TOP ROW: Name & Info */}
                                        <div className="text-white flex items-end flex-wrap gap-4 relative z-20">
                                            <h2 className="text-4xl font-black tracking-tight text-white drop-shadow-md leading-none">{speaker.name}</h2>
                                            <div className="flex items-center gap-3 text-blue-100 font-medium text-lg pb-1">
                                                <span className="flex items-center gap-2">
                                                    <User size={18} className="text-purple-400" />
                                                    {speaker.title}
                                                </span>
                                                <span className="opacity-40">•</span>
                                                <span className="flex items-center gap-2 opacity-80">
                                                    <Share2 size={18} className="text-purple-400" />
                                                    {speaker.company}
                                                </span>
                                            </div>
                                        </div>

                                        {/* BOTTOM ROW: Image & Quote */}
                                        <div className="flex items-center gap-6 w-full relative">
                                            {/* Headshot */}
                                            <div className="w-48 h-48 rounded-2xl border-4 border-white shadow-2xl shrink-0 bg-slate-200 relative ml-4 mb-2 group">
                                                <img
                                                    src={speaker.image}
                                                    alt={speaker.name}
                                                    className="w-full h-full object-cover object-top scale-125 shadow-inner rounded-xl"
                                                />
                                                {/* Speaker Badge */}
                                                <div className="absolute -bottom-6 -right-16 bg-white text-slate-900 text-base font-bold px-6 py-3 rounded-full shadow-lg border border-slate-100 z-20 flex items-center gap-2">
                                                    <User size={20} className="text-purple-600 fill-purple-600" />
                                                    <span>Speaker</span>
                                                </div>
                                            </div>

                                            {/* Quote */}
                                            <div className="flex-1 pr-4 pl-5 text-right relative mb-2">
                                                <div className="relative inline-block w-full">
                                                    <p className="text-xl md:text-2xl font-serif italic text-blue-100 leading-relaxed drop-shadow-lg text-balance">
                                                        "{speaker.quote || "Empowering the next generation of tech leaders through community and innovation."}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <img
                                        src="/ta-header-badge.png"
                                        alt="Tech Alley Henderson"
                                        className={clsx(
                                            "absolute w-40 opacity-90 object-contain z-10 transition-all duration-300",
                                            (speaker.title.length + speaker.company.length > 40)
                                                ? "top-2 right-12"
                                                : (speaker.title.length > 20)
                                                    ? "top-1 right-24"
                                                    : "top-0 right-28"
                                        )}
                                    />

                                    {/* Close Button */}
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-sm"
                                    >
                                        <X size={20} />
                                    </button>

                                </div>

                                {/* TAB NAVIGATION */}
                                <nav className="flex items-center px-6 border-b border-slate-100 overflow-x-auto no-scrollbar shrink-0 bg-white pl-[170px] pt-2">
                                    <TabButton active={activeTab === 'bio'} onClick={() => setActiveTab('bio')} label="Bio & Info" icon={User} />
                                    <TabButton active={activeTab === 'business'} onClick={() => setActiveTab('business')} label="Business" icon={Monitor} />
                                    <TabButton active={activeTab === 'expertise'} onClick={() => setActiveTab('expertise')} label="Expertise" icon={Mic2} />
                                    <TabButton active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} label="Resources" icon={Share2} />
                                    <TabButton active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} label="Contact" icon={Mail} />
                                </nav>

                                {/* SCROLLABLE CONTENT AREA */}
                                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50/50">

                                    {activeTab === 'bio' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <SectionHeader title="About the Speaker">
                                                Share your background, story, and what drives you.
                                            </SectionHeader>
                                            <TextAreaField label="Short Bio (Public)" value={speaker.bioShort} placeholder="A concise 1-2 sentence bio..." />
                                            <TextAreaField label="Full Bio" value={speaker.bioFull} placeholder="Your full professional biography..." />

                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField label="Email" value={speaker.email} placeholder="you@company.com" />
                                                <InputField label="Phone" value={speaker.phone} placeholder="+1 (555) 000-0000" />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'business' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <SectionHeader title="Business Info">
                                                Tell us about your company and what you do.
                                            </SectionHeader>

                                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
                                                <div className="flex gap-3">
                                                    <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm h-fit">
                                                        <AlertCircle size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-blue-900 text-sm mb-1">Value Proposition Statement</h4>
                                                        <p className="text-xs text-blue-700 leading-relaxed mb-3">
                                                            A clear statement following the framework: "I help [Target Audience], do [Benefit/Action], using [Mechanism/Solution]."
                                                        </p>
                                                        <input
                                                            type="text"
                                                            defaultValue={speaker.valueProposition}
                                                            className="w-full p-3 bg-white border border-blue-200 rounded-lg text-sm text-slate-700 placeholder:text-blue-300/70 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none shadow-sm"
                                                            placeholder="I help startups scale revenue using AI automation..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField label="Company Name" value={speaker.company} />
                                                <InputField label="Job Title" value={speaker.title} />
                                                <InputField label="Industry" value={speaker.industry} placeholder="e.g. SaaS, Fintech, Healthcare" />
                                                <InputField label="Website URL" value={speaker.socials?.website} placeholder="https://..." />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'expertise' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <SectionHeader title="Speaking & Expertise">
                                                Topics you speak on and session details.
                                            </SectionHeader>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                                {speaker.topics.map((topic, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                                        <span className="text-sm font-medium text-slate-700">{topic}</span>
                                                        <button className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                                                    </div>
                                                ))}
                                                <button className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                                    <Check size={14} /> Add Topic
                                                </button>
                                            </div>

                                            <InputField label="Proposed Session Title" value={speaker.sessionTitle} placeholder="Title of your talk..." />
                                            <TextAreaField label="Session Abstract / Description" value={speaker.sessionAbstract} placeholder="What will the audience learn?..." />
                                        </div>
                                    )}

                                    {activeTab === 'resources' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <SectionHeader title="Digital Assets">
                                                Resources for attendees and event promotion.
                                            </SectionHeader>

                                            <InputField label="Landing Page URL" value={speaker.landingPage} placeholder="Specific offer page for attendees..." />
                                            <InputField label="Slide Deck Link" value={speaker.deckLink} placeholder="Google Slides / PDF link..." />
                                            <InputField label="Resource Download Link" value={speaker.resourceLink} placeholder="Link to ebook, guide, etc..." />

                                            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex gap-4 items-start">
                                                <div className="p-2 bg-white rounded-lg text-orange-500 shadow-sm mt-1">
                                                    <Calendar size={18} />
                                                </div>
                                                <div className="space-y-2 flex-1">
                                                    <label className="text-xs font-bold text-orange-800 uppercase tracking-wider">Booking / Scheduling Link</label>
                                                    <input
                                                        type="text"
                                                        defaultValue={speaker.socials?.scheduling}
                                                        className="w-full p-3 bg-white border border-orange-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-orange-200"
                                                        placeholder="Cal.com / Calendly link..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'contact' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <SectionHeader title="Social & Connect">
                                                Where can people find you online?
                                            </SectionHeader>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="flex gap-2">
                                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                                        <Linkedin size={20} />
                                                    </div>
                                                    <input type="text" defaultValue={speaker.socials?.linkedin} className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" placeholder="LinkedIn URL" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="p-3 bg-slate-100 rounded-xl text-slate-800">
                                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                                                    </div>
                                                    <input type="text" defaultValue={speaker.socials?.twitter} className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" placeholder="X (Twitter) URL" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="p-3 bg-pink-50 rounded-xl text-pink-600">
                                                        <Camera size={20} />
                                                    </div>
                                                    <input type="text" defaultValue={speaker.socials?.instagram} className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" placeholder="Instagram URL" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="p-3 bg-slate-800 text-white rounded-xl">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                                                    </div>
                                                    <input type="text" defaultValue={speaker.socials?.tiktok} className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" placeholder="TikTok URL" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="p-3 bg-red-50 rounded-xl text-red-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                                                    </div>
                                                    <input type="text" defaultValue={speaker.socials?.youtube} className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" placeholder="YouTube URL" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                                    </div>
                                                    <input type="text" defaultValue={speaker.socials?.facebook} className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" placeholder="Facebook URL" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* FOOTER ACTIONS */}
                                <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0 z-10 flex gap-4">
                                    <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                                        Cancel
                                    </button>
                                    <button onClick={onClose} className="flex-[2] py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2">
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                </div>

                            </div>

                        </motion.div>
                    </div>
                </>
            )
            }
        </AnimatePresence >
    );
}
