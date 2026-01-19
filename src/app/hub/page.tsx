'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Mic2, Gift, Sparkles, CheckSquare, MessageSquare, X,
    Loader2, Send, ArrowRight, Camera, Rocket
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIdentity } from '@/context/IdentityContext';
import SpeakerCard from '@/components/SpeakerCard';
import RaffleWheel from '@/components/RaffleWheel';

// --- DATA CONSTANTS ---

const SPEAKERS = [
    {
        name: "Lorraine",
        title: "Founder & Organizer",
        company: "Tech Alley Henderson",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
        topics: ["State of the Alley", "Innovation Hub", "Community Growth"]
    },
    {
        name: "Jonathan",
        title: "Host",
        company: "Social Alignment",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200",
        topics: ["System Automation", "Lead Gen", "Digital Strategy"]
    },
    {
        name: "Jorge 'HOZ' Hernandez",
        title: "Host",
        company: "Dead Sprint",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
        topics: ["Podcasting", "Content Strategy", "Community"]
    }
];

const AGENDA_ITEMS = [
    { time: '6:00 PM', event: 'Networking & Check-In', desc: 'Grab a drink, meet the community.' },
    { time: '6:30 PM', event: 'Kickoff & "State of the Alley"', desc: 'Welcome from Lorraine & The Team.' },
    { time: '7:00 PM', event: 'Startup Spotlight: Vegas AI', desc: 'Demo from local innovators.' },
    { time: '7:30 PM', event: 'Guest Speaker: The Future of work', desc: 'Deep dive into AI workflows.' },
    { time: '8:15 PM', event: 'Raffle & Closing Remarks', desc: 'Win the AI Commercial!' },
];

// --- ANIMATION VARIANTS ---

const itemParams = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function HubPage() {
    const router = useRouter();
    const { leadId, userName } = useIdentity();
    const displayName = userName ? userName.split(' ')[0] : 'Innovator';

    // --- STATE FOR ASK MODAL ---
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [sending, setSending] = useState(false);
    const [agendaItems, setAgendaItems] = useState(AGENDA_ITEMS);

    useEffect(() => {
        const fetchAgenda = async () => {
            try {
                const res = await fetch('/api/agenda');
                const data = await res.json();
                if (data.success && data.agenda && data.agenda.length > 0) {
                    setAgendaItems(data.agenda);
                }
            } catch (e) {
                console.error("Failed to fetch agenda", e);
            }
        };
        fetchAgenda();
    }, []);

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
                        eventFeedback: `ASKED QUESTION: ${question}`
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
        <div className="flex flex-col xl:flex-row gap-8 pb-24">

            {/* --- ASK MODAL --- */}
            <AnimatePresence>
                {isAskModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2rem] w-full max-w-md p-6 shadow-2xl border border-blue-100"
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
                                    className="w-full h-32 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-700 resize-none font-medium placeholder:text-slate-400"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2"
                                >
                                    {sending ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                    {sending ? 'Sending...' : 'Send to Stage'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            {/* --- CENTER COLUMN (Main Content) --- */}
            <div className="flex-1 space-y-8 min-w-0">



                {/* 2. PERSONAL HERO + ACTIONS (White Design) */}
                <motion.div
                    variants={itemParams}
                    initial="hidden"
                    animate="show"
                    className="relative bg-white rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-[0_20px_50px_-12px_rgba(200,200,255,0.3)] border border-slate-50"
                >
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-100/50 to-blue-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none mix-blend-multiply"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                                Hello, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{displayName}.</span>
                            </h2>
                            <div className="text-slate-500 text-lg mb-8 max-w-md font-medium leading-relaxed">
                                <p className="mb-2">You are now connected to the Tech Alley Henderson interactive hub. Use this throughout the event to access:</p>
                                <ul className="list-disc list-inside space-y-1 pl-2 marker:text-blue-500">
                                    <li>Tonight's Agenda</li>
                                    <li>Announcements</li>
                                    <li>Speaker Resources</li>
                                    <li>New Ways to Network</li>
                                    <li>And More</li>
                                </ul>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <button onClick={() => navigateTo('/hub/mri')} className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_15px_35px_-10px_rgba(37,99,235,0.6)] transition-all transform hover:-translate-y-0.5">
                                    Start Audit
                                </button>
                                <button onClick={() => setIsAskModalOpen(true)} className="px-6 py-3.5 bg-white text-slate-700 font-bold rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:bg-slate-50 hover:shadow-md transition-all flex items-center gap-2 group">
                                    <MessageSquare size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                                    Ask Lorraine
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
                        </div>
                    </div>
                </motion.div>

                {/* 3. SPEAKERS SECTION (Purple Design) */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold text-slate-900">Tonight's Speakers</h3>
                        <span className="text-xs font-bold text-purple-600 cursor-pointer hover:underline">View All</span>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {SPEAKERS.map((speaker, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                            >
                                <SpeakerCard {...speaker} />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 4. AGENDA (White Design) */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-xl text-slate-800">Tonight's Agenda</h3>
                        <span className="p-2 bg-slate-50 rounded-full text-slate-400"><Calendar size={20} /></span>
                    </div>
                    <div className="space-y-6">
                        {agendaItems.map((item, i) => (
                            <div key={i} className="flex gap-6 items-start group">
                                <span className="text-sm font-bold text-slate-400 w-16 pt-1">{item.time}</span>
                                <div className="flex-1 p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors border border-slate-100 group-hover:border-blue-100">
                                    <h4 className="font-bold text-slate-800 group-hover:text-blue-700 mb-1">{item.event}</h4>
                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. RAFFLE SECTION (Purple Design) */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-50 to-transparent pointer-events-none"></div>

                    <div className="text-center mb-8 relative z-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Exclusive Raffle</h2>
                        <p className="text-sm text-slate-500">Spin for a chance to win a Free GenAI Video Audit!</p>
                    </div>

                    <div className="flex justify-center relative z-10">
                        <RaffleWheel />
                    </div>
                </motion.section>

            </div>


            {/* --- RIGHT COLUMN (Sidebar from White Design) --- */}
            <div className="w-full xl:w-[350px] space-y-6 shrink-0">

                <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pl-4">Interact & Win</h3>

                    <div className="grid grid-cols-1 gap-4">
                        {/* 0. Photo Booth (Orange Pastel) */}
                        <motion.div
                            variants={itemParams}
                            initial="hidden" animate="show"
                            onClick={() => navigateTo('/hub/photo-booth')}
                            className="bg-gradient-to-r from-orange-50 to-white rounded-[1.5rem] p-4 cursor-pointer border border-orange-100 hover:border-orange-200 hover:shadow-[0_10px_20px_-5px_rgba(249,115,22,0.15)] transition-all flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white border border-orange-50 shadow-sm flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <Camera size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Photo Booth</h4>
                                <p className="text-orange-400 text-xs font-medium">Capture & Share</p>
                            </div>
                        </motion.div>
                        {/* 1. Enter Raffle (Pink Pastel) */}
                        <motion.div
                            variants={itemParams}
                            initial="hidden" animate="show"
                            onClick={() => navigateTo('/hub/raffle')}
                            className="bg-gradient-to-r from-pink-50 to-white rounded-[1.5rem] p-4 cursor-pointer border border-pink-100 hover:border-pink-200 hover:shadow-[0_10px_20px_-5px_rgba(236,72,153,0.15)] transition-all flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white border border-pink-50 shadow-sm flex items-center justify-center text-pink-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <Gift size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Enter Raffle</h4>
                                <p className="text-pink-400 text-xs font-medium">Win a GenAI Audit</p>
                            </div>
                        </motion.div>

                        {/* 2. Business MRI (Cyan Pastel) */}
                        <motion.div
                            variants={itemParams}
                            initial="hidden" animate="show"
                            onClick={() => navigateTo('/hub/mri')}
                            className="bg-gradient-to-r from-cyan-50 to-white rounded-[1.5rem] p-4 cursor-pointer border border-cyan-100 hover:border-cyan-200 hover:shadow-[0_10px_20px_-5px_rgba(6,182,212,0.15)] transition-all flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white border border-cyan-50 shadow-sm flex items-center justify-center text-cyan-500 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Productivity Audit</h4>
                                <p className="text-cyan-400 text-xs font-medium">Mini MRI (10+ Hrs Back)</p>
                            </div>
                        </motion.div>

                        {/* 3. Innovation Grant (Violet Pastel) */}
                        <motion.div
                            variants={itemParams}
                            initial="hidden" animate="show"
                            onClick={() => navigateTo('/hub/grant')}
                            className="bg-gradient-to-r from-violet-50 to-white rounded-[1.5rem] p-4 cursor-pointer border border-violet-100 hover:border-violet-200 hover:shadow-[0_10px_20px_-5px_rgba(139,92,246,0.15)] transition-all flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white border border-violet-50 shadow-sm flex items-center justify-center text-violet-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <Rocket size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Innovation Grant</h4>
                                <p className="text-violet-400 text-xs font-medium">$5k in AI Architecture</p>
                            </div>
                        </motion.div>

                        {/* 3. Feedback (Purple Pastel) */}


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

                        {/* 5. My Checklist (Emerald Pastel) */}
                        <motion.div
                            variants={itemParams}
                            initial="hidden" animate="show"
                            onClick={() => navigateTo('/hub/checklist')}
                            className="bg-gradient-to-r from-emerald-50 to-white rounded-[1.5rem] p-4 cursor-pointer border border-emerald-100 hover:border-emerald-200 hover:shadow-[0_10px_20px_-5px_rgba(16,185,129,0.15)] transition-all flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-50 shadow-sm flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                                <CheckSquare size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">My Checklist</h4>
                                <p className="text-emerald-400 text-xs font-medium">Your Companion Guide</p>
                            </div>
                        </motion.div>

                    </div>
                </div>

            </div>
        </div>
    );
}
