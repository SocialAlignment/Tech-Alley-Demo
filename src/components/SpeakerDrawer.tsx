'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Clock, ArrowRight, User, Briefcase, Award, FileText, Mail, Linkedin, Globe, Phone, Share2, MessageSquare, Quote, Monitor, Mic2, AlertCircle, Check, Camera, Save, ChevronRight, HelpCircle, HelpCircle as QuestionIcon, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { useQuestions } from '@/context/QuestionsContext';
import { QuestionsStack } from './QuestionsStack';
import SpeakerInteractionModal from './SpeakerInteractionModal';


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
    imageClassName?: string;
    sessionAbstract?: string;

    status: 'complete' | 'pending' | 'action_required';
    completion: number; // 0-100
}

interface SpeakerDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    speaker: ExtendedSpeaker | null;
    initialTab?: 'bio' | 'questions' | 'feedback';
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

const DisplayField = ({ label, value, className }: any) => (
    <div className={clsx("space-y-2", className)}>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</h4>
        <div className="text-sm font-medium text-slate-200 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
            {value || <span className="text-slate-500 italic">Not provided</span>}
        </div>
    </div>
);

const SocialDisplayRow = ({ icon, value, placeholder, iconColorClass = "text-slate-400", bgClass = "bg-white/5" }: any) => (
    <div className="flex gap-2">
        <div className={clsx("p-3 rounded-xl border border-white/10", bgClass, iconColorClass)}>
            {icon}
        </div>
        <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 flex items-center overflow-hidden">
            {value ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline truncate w-full transition-colors">
                    {value}
                </a>
            ) : (
                <span className="text-slate-500 italic">{placeholder}</span>
            )}
        </div>
    </div>
);

// --- Main Drawer ---

export default function SpeakerDrawer({ isOpen, onClose, speaker, initialTab = 'bio' }: SpeakerDrawerProps) {
    const [activeTab, setActiveTab] = useState<'bio' | 'questions' | 'feedback' | 'business' | 'expertise' | 'resources' | 'contact'>(initialTab);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { getQuestionsBySpeakerId, markAsAnswered } = useQuestions();

    // Reset tab when drawer opens with a new initialTab
    useState(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    });

    if (!speaker) return null;

    const speakerQuestions = getQuestionsBySpeakerId(speaker.id);

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
                            {(speaker.promoImage || speaker.image) && (
                                <div className={clsx(
                                    "hidden md:block w-1/2 h-full shrink-0 relative overflow-hidden",
                                    (speaker.id === '1' || speaker.id === '2') ? "bg-[#1C1335]" : "bg-slate-900" // Shaq & Todd: Custom dark bg
                                )}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 to-transparent z-10"></div>

                                    {/* Render Logic Based on ID */}
                                    {speaker.id === '2' ? (
                                        // Todd: Large Question Mark Icon as "Logo"
                                        <div className="w-full h-full flex items-center justify-center">
                                            <HelpCircle className="w-64 h-64 text-white/90" strokeWidth={1} />
                                        </div>
                                    ) : (
                                        // Others: Image
                                        <img
                                            src={
                                                speaker.id === '1' ? '/shaq-drawer-bg.png' : // Shaq: Custom provided background
                                                    (speaker.promoImage || speaker.image)
                                            }
                                            alt={`${speaker.name} Promo`}
                                            className={clsx(
                                                "w-full h-full object-center",
                                                speaker.id === '1' ? "object-contain scale-75" : "object-cover"
                                            )}
                                        />
                                    )}
                                </div>
                            )}

                            {/* RIGHT PANEL: Content */}
                            <div className={clsx(
                                "flex-1 relative h-full overflow-hidden flex flex-col shadow-2xl z-20",
                                speaker.promoImage ? "" : "rounded-l-3xl border-l border-white/20"
                            )}>
                                {/* Warp Background Behind Content */}


                                <div className="relative z-10 flex flex-col h-full">

                                    {/* MINIMAL HEADER */}
                                    <div className="relative flex flex-col justify-end px-8 py-10 bg-slate-950 border-b border-white/10 shrink-0 z-30 overflow-hidden min-h-[180px]">
                                        {/* Background Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black z-0" />

                                        {/* Tech Alley Badge - Standard for ALL */}
                                        <img
                                            src="/ta-header-badge.png"
                                            alt="Badge"
                                            className={clsx(
                                                "absolute z-10 mix-blend-screen pointer-events-none transition-all duration-500",
                                                "w-40 right-28 top-0 opacity-100"
                                            )}
                                        />

                                        <div className="relative z-20">
                                            {/* Speaker Name & Avatar */}
                                            <div className="flex items-end gap-6 mb-2">
                                                {/* Headshot Avatar */}
                                                <div className="relative shrink-0">
                                                    <div className="w-24 h-24 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden bg-slate-800">
                                                        <img
                                                            src={speaker.image} // Fixed: Added src
                                                            alt={speaker.name}
                                                            className={clsx("w-full h-full object-cover", speaker.imageClassName)}
                                                        />
                                                    </div>
                                                </div>

                                                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl mb-1">
                                                    {speaker.name.toUpperCase()}
                                                </h2>
                                            </div>

                                            {/* Title & Company */}
                                            <div className="flex items-center gap-3 text-lg font-medium text-slate-300">
                                                <span className="text-cyan-400 font-bold">{speaker.title}</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                                <span className="text-slate-400">{speaker.company}</span>
                                            </div>
                                        </div>

                                        {/* Close Button */}
                                        <button
                                            onClick={onClose}
                                            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors z-50 backdrop-blur-md border border-white/5"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    {/* TAB NAVIGATION */}
                                    <nav className="flex items-center px-6 border-b border-white/10 overflow-x-auto no-scrollbar shrink-0 bg-slate-950/50 pt-2 backdrop-blur-md">
                                        <TabButton active={activeTab === 'bio'} onClick={() => setActiveTab('bio')} label="Bio & Info" icon={User} />
                                        <TabButton active={activeTab === 'questions'} onClick={() => setActiveTab('questions')} label="Questions" icon={QuestionIcon} />

                                        <TabButton active={activeTab === 'business'} onClick={() => setActiveTab('business')} label="Business" icon={Monitor} />
                                        <TabButton active={activeTab === 'expertise'} onClick={() => setActiveTab('expertise')} label="Expertise" icon={Mic2} />
                                        <TabButton active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} label="Resources" icon={Share2} />
                                        <TabButton active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} label="Contact" icon={Mail} />
                                    </nav>

                                    {/* SCROLLABLE CONTENT AREA */}
                                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-transparent">

                                        {activeTab === 'bio' && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-slate-200 bg-slate-900/50 border border-white/10 rounded-xl p-6 shadow-sm">
                                                <SectionHeader title="About the Speaker">
                                                    Background, story, and drive.
                                                </SectionHeader>

                                                {/* Quote Section */}
                                                {speaker.quote && (
                                                    <div className="relative p-6 bg-white/5 rounded-2xl border border-white/10">
                                                        <Quote className="absolute top-4 left-4 text-white/10 rotate-180" size={32} />
                                                        <p className="text-lg italic text-slate-300 relative z-10 pl-4 border-l-2 border-cyan-400/50">
                                                            "{speaker.quote}"
                                                        </p>
                                                    </div>
                                                )}
                                                <DisplayField label="Short Bio" value={speaker.bioShort} />
                                                <DisplayField label="Full Bio" value={speaker.bioFull} />

                                                <div className="grid grid-cols-2 gap-4">
                                                    <DisplayField label="Email" value={speaker.email} />
                                                    <DisplayField label="Phone" value={speaker.phone} />
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'business' && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-slate-200 bg-slate-900/50 border border-white/10 rounded-xl p-6 shadow-sm">
                                                <SectionHeader title="Business Info">
                                                    Company and Value Proposition.
                                                </SectionHeader>

                                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-3">
                                                    <div className="flex gap-3">
                                                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300 shadow-sm h-fit">
                                                            <AlertCircle size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-blue-200 text-sm mb-1">Value Proposition</h4>
                                                            <p className="text-sm text-blue-100/80 leading-relaxed font-medium">
                                                                {speaker.valueProposition || "No value proposition provided."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <DisplayField label="Company Name" value={speaker.company} />
                                                    <DisplayField label="Job Title" value={speaker.title} />
                                                    <DisplayField label="Industry" value={speaker.industry} />
                                                    <DisplayField label="Website URL" value={speaker.socials?.website} />
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'expertise' && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-slate-200 bg-slate-900/50 border border-white/10 rounded-xl p-6 shadow-sm">
                                                <SectionHeader title="Speaking & Expertise">
                                                    Topics and Session Details.
                                                </SectionHeader>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {speaker.topics.map((topic, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-slate-300">
                                                            {topic}
                                                        </span>
                                                    ))}
                                                </div>

                                                <DisplayField label="Session Title" value={speaker.sessionTitle} />
                                                <DisplayField label="Session Abstract" value={speaker.sessionAbstract} />
                                            </div>
                                        )}

                                        {activeTab === 'questions' && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <div className="flex items-center justify-between">
                                                    <SectionHeader title="Q&A Questions">
                                                        Submitted questions for the session.
                                                    </SectionHeader>
                                                    <button
                                                        onClick={() => setIsModalOpen(true)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 text-sm"
                                                    >
                                                        <MessageSquare size={16} />
                                                        Ask a Question
                                                    </button>
                                                </div>

                                                <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden min-h-[400px]">
                                                    <QuestionsStack questions={speakerQuestions} onMarkAnswered={markAsAnswered} />
                                                </div>
                                            </div>
                                        )}



                                        {activeTab === 'resources' && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-slate-200 bg-slate-900/50 border border-white/10 rounded-xl p-6 shadow-sm">
                                                <SectionHeader title="Digital Assets">
                                                    Resources for attendees and event promotion.
                                                </SectionHeader>

                                                <DisplayField label="Landing Page URL" value={speaker.landingPage} />
                                                <DisplayField label="Slide Deck Link" value={speaker.deckLink} />
                                                <DisplayField label="Resource Download Link" value={speaker.resourceLink} />

                                                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-4 items-start">
                                                    <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400 shadow-sm mt-1">
                                                        <Calendar size={18} />
                                                    </div>
                                                    <div className="space-y-1 flex-1">
                                                        <label className="text-xs font-bold text-orange-300 uppercase tracking-wider">Booking Link</label>
                                                        <a href={speaker.socials?.scheduling} target="_blank" rel="noopener noreferrer" className="block text-sm text-orange-200 hover:text-white underline decoration-orange-500/50 hover:decoration-orange-400 transition-all">
                                                            {speaker.socials?.scheduling || "No link provided"}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'contact' && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-slate-200 bg-slate-900/50 border border-white/10 rounded-xl p-6 shadow-sm">
                                                <SectionHeader title="Social & Connect">
                                                    Where can people find you online?
                                                </SectionHeader>

                                                <div className="grid grid-cols-1 gap-4">
                                                    <SocialDisplayRow
                                                        icon={<Linkedin size={20} />}
                                                        value={speaker.socials?.linkedin}
                                                        placeholder="LinkedIn URL"
                                                        iconColorClass="text-blue-400"
                                                        bgClass="bg-blue-500/10"
                                                    />
                                                    <SocialDisplayRow
                                                        icon={<svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>}
                                                        value={speaker.socials?.twitter}
                                                        placeholder="X (Twitter) URL"
                                                        iconColorClass="text-white"
                                                        bgClass="bg-slate-800"
                                                    />
                                                    <SocialDisplayRow
                                                        icon={<Camera size={20} />}
                                                        value={speaker.socials?.instagram}
                                                        placeholder="Instagram URL"
                                                        iconColorClass="text-pink-400"
                                                        bgClass="bg-pink-500/10"
                                                    />
                                                    <SocialDisplayRow
                                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>}
                                                        value={speaker.socials?.tiktok}
                                                        placeholder="TikTok URL"
                                                        iconColorClass="text-cyan-400"
                                                        bgClass="bg-slate-900"
                                                    />
                                                    <SocialDisplayRow
                                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>}
                                                        value={speaker.socials?.youtube}
                                                        placeholder="YouTube URL"
                                                        iconColorClass="text-red-400"
                                                        bgClass="bg-red-500/10"
                                                    />
                                                    <SocialDisplayRow
                                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>}
                                                        value={speaker.socials?.facebook}
                                                        placeholder="Facebook URL"
                                                        iconColorClass="text-blue-400"
                                                        bgClass="bg-blue-600/10"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}

            <SpeakerInteractionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                speaker={speaker}
                initialMode="question"
            />
        </AnimatePresence>
    );
}
