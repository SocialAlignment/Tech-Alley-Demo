'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Mic2, ArrowRight, Calendar, Sparkles, MessageSquare, X, Send, Loader2, CheckSquare } from 'lucide-react';
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
    const { leadId, userName } = useIdentity();
    const displayName = userName ? userName.split(' ')[0] : 'Tech Alley Henderson';
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [sending, setSending] = useState(false);

    const navigateTo = (path: string) => {
        router.push(leadId ? `${path}?id=${leadId}` : path);
    };

    const handleAskSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        try {
            const res = await fetch('/api/update-lead', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    updates: {
                        eventFeedback: `ASKED QUESTION: ${question}` // Storing in feedback for now, or dedicated field
                    }
                })
            });

            if (res.ok) {
                setTimeout(() => {
                    setSending(false);
                    setIsAskModalOpen(false);
                    setQuestion('');
                    alert("Question sent to the stage!");
                }, 800);
            }
        } catch (err) {
            console.error(err);
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col xl:flex-row gap-8 pb-10">

            {/* --- ASK MODAL --- */}
            <AnimatePresence>
                {isAskModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2rem] w-full max-w-md p-6 shadow-2xl border border-purple-100"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Ask Lorraine</h3>
                                <button onClick={() => setIsAskModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAskSubmit} className="space-y-4">
                                <textarea
                                    autoFocus
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Type your question here..."
                                    className="w-full h-32 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 text-slate-700 resize-none font-medium placeholder:text-slate-400"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all flex items-center justify-center gap-2"
                                >
                                    {sending ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                    {sending ? 'Sending...' : 'Send to Stage'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            {/* --- CENTER COLUMN (Main Dashboard) --- */}
            <div className="flex-1 space-y-8 min-w-0">

                {/* Top Bar: Greeting & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Hey, {displayName}!</h1>
                        <p className="text-slate-500">Welcome back, get ready to innovate.</p>
                    </div>
                </div>

                {/* Hero Illustration Card */}
                <motion.div
                    variants={itemParams}
                    initial="hidden"
                    animate="show"
                    className="relative bg-white rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-[0_20px_50px_-12px_rgba(200,200,255,0.3)] border border-slate-50"
                >
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-100/50 to-purple-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none mix-blend-multiply"></div>
                    <div className="absolute bottom-0 left-20 w-72 h-72 bg-gradient-to-tr from-pink-100/40 to-blue-100/40 rounded-full blur-3xl -mb-10 pointer-events-none mix-blend-multiply"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-purple-50 text-xs font-bold text-purple-600 tracking-wide border border-purple-100">
                                HAPPENING NOW
                            </span>
                            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                                Hello, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">{displayName}.</span>
                            </h2>
                            <p className="text-slate-500 text-lg mb-8 max-w-md font-medium leading-relaxed">
                                Tonight is about connection. Check the agenda, enter the raffle, and meet the founders.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button onClick={() => setIsAskModalOpen(true)} className="px-6 py-3.5 bg-white text-slate-700 font-bold rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:bg-slate-50 hover:shadow-md transition-all flex items-center gap-2 group">
                                    <MessageSquare size={18} className="text-purple-500 group-hover:scale-110 transition-transform" />
                                    Ask Lorraine
                                </button>
                                <button onClick={() => navigateTo('/hub/surveys/business-mri')} className="px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-[0_10px_30px_-10px_rgba(147,51,234,0.5)] hover:shadow-[0_15px_35px_-10px_rgba(147,51,234,0.6)] transition-all transform hover:-translate-y-0.5">
                                    Help Us Help You
                                </button>
                            </div>
                        </div>

                        {/* Illustration */}
                        <div className="w-full md:w-5/12 flex justify-center relative">
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <img
                                    src="/hero-whimsical.png"
                                    alt="Innovation Hub"
                                    className="w-full max-w-[320px] object-contain drop-shadow-2xl"
                                />
                            </motion.div>

                            {/* Glow behind image */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/50 rounded-full blur-[64px] pointer-events-none"></div>
                        </div>
                    </div>
                </motion.div>

                {/* Agenda Card (Moved to Center bottom or keep right? User wanted visual match. Ref image has "Views by categories" here) */}
                {/* Let's put Agenda here as "Views by categories" equivalent */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-xl text-slate-800">Tonight's Agenda</h3>
                        <span className="p-2 bg-slate-50 rounded-full text-slate-400"><Calendar size={20} /></span>
                    </div>
                    <div className="space-y-6">
                        {AGENDA_ITEMS.map((item, i) => (
                            <div key={i} className="flex gap-6 items-start group">
                                <span className="text-sm font-bold text-slate-400 w-16 pt-1">{item.time}</span>
                                <div className="flex-1 p-4 bg-slate-50 rounded-2xl group-hover:bg-purple-50 transition-colors border border-slate-100 group-hover:border-purple-100">
                                    <h4 className="font-bold text-slate-800 group-hover:text-purple-700 mb-1">{item.event}</h4>
                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- RIGHT COLUMN (Widgets) --- */}
            <div className="w-full xl:w-[350px] space-y-6 shrink-0">

                {/* User Profile Widget */}
                <motion.div variants={itemParams} initial="hidden" animate="show" className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] transition-all">
                    <div className="flex items-center gap-5 mb-8 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-white shadow-lg flex items-center justify-center text-xl font-bold text-purple-600">
                            {userName ? userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'TA'}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-xl leading-tight">{userName || 'Guest User'}</h3>
                            {leadId && <p className="text-[11px] font-bold text-purple-500 mt-1 uppercase tracking-wider bg-purple-50 px-2 py-1 rounded-lg inline-block">ID: {leadId.slice(0, 8)}</p>}
                        </div>
                    </div>

                    <button
                        onClick={() => navigateTo('/hub/checklist')}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-purple-200 transition-all shadow-sm hover:shadow-md group/btn"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white rounded-xl text-purple-600 shadow-sm group-hover/btn:scale-110 transition-transform">
                                <CheckSquare size={20} />
                            </div>
                            <span className="font-bold text-slate-700 group-hover/btn:text-purple-700 transition-colors">My Checklist</span>
                        </div>
                        <ArrowRight size={20} className="text-slate-300 group-hover/btn:text-purple-400 group-hover/btn:translate-x-1 transition-all" />
                    </button>

                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                </motion.div>

                {/* Interact & Win (Pastel Style) */}
                <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pl-4">Interact & Win</h3>

                    <div className="grid grid-cols-1 gap-4">
                        {/* 1. Enter Raffle (Pink Pastel) */}
                        <motion.div
                            variants={itemParams}
                            initial="hidden" animate="show"
                            onClick={() => navigateTo('/hub/giveaway')}
                            className="bg-gradient-to-r from-pink-50 to-white rounded-[1.5rem] p-4 cursor-pointer border border-pink-100 hover:border-pink-200 hover:shadow-[0_10px_20px_-5px_rgba(236,72,153,0.15)] transition-all flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white border border-pink-50 shadow-sm flex items-center justify-center text-pink-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <Gift size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Enter Raffle</h4>
                                <p className="text-pink-400 text-xs font-medium">Win the AI Commercial</p>
                            </div>
                        </motion.div>

                        {/* 2. Business MRI (Cyan Pastel) */}
                        <motion.div
                            variants={itemParams}
                            initial="hidden" animate="show"
                            onClick={() => navigateTo('/hub/surveys/business-mri')}
                            className="bg-gradient-to-r from-cyan-50 to-white rounded-[1.5rem] p-4 cursor-pointer border border-cyan-100 hover:border-cyan-200 hover:shadow-[0_10px_20px_-5px_rgba(6,182,212,0.15)] transition-all flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white border border-cyan-50 shadow-sm flex items-center justify-center text-cyan-500 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Business MRI</h4>
                                <p className="text-cyan-400 text-xs font-medium">Get your 2026 Diagnosis</p>
                            </div>
                        </motion.div>

                        {/* 3. Feedback (Purple Pastel) */}
                        <motion.div
                            variants={itemParams}
                            initial="hidden" animate="show"
                            onClick={() => navigateTo('/hub/surveys')}
                            className="bg-gradient-to-r from-purple-50 to-white rounded-[1.5rem] p-4 cursor-pointer border border-purple-100 hover:border-purple-200 hover:shadow-[0_10px_20px_-5px_rgba(147,51,234,0.15)] transition-all flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white border border-purple-50 shadow-sm flex items-center justify-center text-purple-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <MessageSquare size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Feedback</h4>
                                <p className="text-purple-400 text-xs font-medium">Help us improve</p>
                            </div>
                        </motion.div>

                        {/* 4. Speak Here (Blue Pastel) */}
                        <motion.div
                            variants={itemParams}
                            initial="hidden" animate="show"
                            onClick={() => navigateTo('/hub/apply-to-speak')}
                            className="bg-gradient-to-r from-blue-50 to-white rounded-[1.5rem] p-4 cursor-pointer border border-blue-100 hover:border-blue-200 hover:shadow-[0_10px_20px_-5px_rgba(59,130,246,0.15)] transition-all flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white border border-blue-50 shadow-sm flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                                <Mic2 size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Speak Here</h4>
                                <p className="text-blue-400 text-xs font-medium">Apply for the stage</p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
}
