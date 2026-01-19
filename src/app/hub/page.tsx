'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic2, X,
    Loader2, Send, Activity,
    Users, HelpCircle, Camera, User, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIdentity } from '@/context/IdentityContext';
import SpeakerCard from '@/components/SpeakerCard';
import { GlowingEffect } from '@/components/ui/glowing-effect';
// Import New Components
import { CyberpunkCard } from '@/components/ui/cyberpunk-card';
import { ElectricProgressBar } from '@/components/ui/electric-progress-bar';
import { CircuitBoardBackground } from '@/components/ui/circuit-board-background';

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

export default function HubPage() {
    const router = useRouter();
    const { leadId, userName, missionProgress } = useIdentity();
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [sending, setSending] = useState(false);

    // --- LEADERBOARD STATE ---
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loadingLeaders, setLoadingLeaders] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/leaderboard');
                const data = await res.json();
                if (data.success) {
                    setLeaders(data.leaders);
                }
            } catch (e) {
                console.error("Failed to fetch leaderboard", e);
            } finally {
                setLoadingLeaders(false);
            }
        }
        fetchLeaderboard();
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

    const missionItems = [
        {
            title: "Connect with 5 New People",
            subtitle: "+18 XP (Important) Memorize their names",
            icon: <Users className="w-6 h-6 text-cyan-200" />,
            action: () => navigateTo('/hub/networking')
        },
        {
            title: "Submit a Question or give Feedback",
            subtitle: "+10 XP Top to complete",
            icon: <HelpCircle className="w-6 h-6 text-cyan-200" />,
            action: () => setIsAskModalOpen(true)
        },
        {
            title: "Complete your Social Profile",
            subtitle: "+36 XP Top to complete",
            icon: <User className="w-6 h-6 text-cyan-200" />,
            action: () => navigateTo('/hub/profile')
        },
        {
            title: "Submit a photo to the photo booth",
            subtitle: "+10 XP Top to complete",
            icon: <Camera className="w-6 h-6 text-cyan-200" />,
            action: () => navigateTo('/hub/photo-booth')
        },
        {
            title: "Grab a photo with Jonathan Sterritt",
            subtitle: "+10 XP He Wont Bite",
            icon: <Camera className="w-6 h-6 text-cyan-200" />,
            action: () => navigateTo('/hub/photo-booth')
        }
    ];

    const currentProgress = missionProgress ? parseInt(missionProgress) : 0;
    const progressPercent = Math.min(100, Math.max(0, currentProgress));

    return (
        <div className="flex flex-col min-h-screen bg-[#0f0518] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">

            <CircuitBoardBackground />

            {/* --- MAIN LAYOUT --- */}
            <main className="relative z-10 flex flex-col xl:flex-row gap-6 p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto w-full">

                {/* --- LEFT COLUMN: HERO & MISSIONS --- */}
                <div className="flex-1 flex flex-col gap-6 min-w-0">

                    {/* CYBERPUNK HERO HEADER */}
                    <div className="relative w-full h-[250px] md:h-[320px] rounded-3xl overflow-hidden border border-cyan-500/30 group">
                        {/* Background Image Placeholder - using a gradient/abstract city feel if image fails */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=2676&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-[#0f0518]/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] mb-2">
                                Tech Alley Portal:<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Your Mission Control.</span>
                            </h1>
                            <p className="text-sm md:text-base text-cyan-100/70 font-mono tracking-widest uppercase">
                                Your companion for the best event experience.
                            </p>
                        </div>

                        {/* Decorative HUD Elements */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            <div className="px-3 py-1 bg-black/60 border border-cyan-500/50 text-cyan-400 text-[10px] font-bold uppercase tracking-wider rounded backdrop-blur-md">
                                System Online
                            </div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse mt-2" />
                        </div>
                    </div>

                    {/* PROGRESS SECTION */}
                    <div className="relative py-4">
                        <div className="flex justify-between items-end mb-2 px-2">
                            <div className="flex items-baseline gap-4">
                                <span className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                                    {progressPercent}%
                                </span>
                                <span className="text-sm font-bold text-purple-400 tracking-[0.2em] uppercase mb-1">
                                    Systems Optimized
                                </span>
                            </div>
                            <span className="text-[10px] text-cyan-500/70 font-mono">1/9 MISSIONS ACCOMPLISHED</span>
                        </div>

                        {/* Custom Electric Progress Bar */}
                        <ElectricProgressBar progress={progressPercent} />
                    </div>

                    {/* MISSIONS LIST */}
                    <div className="grid gap-3">
                        {missionItems.map((item, idx) => (
                            <CyberpunkCard key={idx} variant={idx === 1 ? 'active' : 'default'} onClick={item.action} className="cursor-pointer">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-black/50 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-base tracking-wide group-hover:text-cyan-300 transition-colors uppercase">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                                                    {item.subtitle.split(' ')[0]} {item.subtitle.split(' ')[1]}
                                                </span>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                                                    {item.subtitle.split(' ').slice(2).join(' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="px-6 py-2 bg-cyan-950/30 border border-cyan-500/50 rounded-full text-xs font-bold text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)] uppercase tracking-wider">
                                        Start
                                    </button>
                                </div>
                            </CyberpunkCard>
                        ))}
                    </div>

                    {/* SPEAKERS SECTION */}
                    <section className="pt-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                                <Mic2 size={16} className="text-purple-400" />
                                On Stage Tonight
                            </h3>
                            <button
                                onClick={() => navigateTo('/hub/speakers')}
                                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 uppercase"
                            >
                                View All <ChevronRight size={12} />
                            </button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {SPEAKERS.map((speaker, i) => (
                                <SpeakerCard
                                    key={i}
                                    speaker={{
                                        ...speaker,
                                        id: i.toString(),
                                        completion: 100,
                                        status: 'complete'
                                    }}
                                    isSpotlight={i === 0}
                                    variant="dark"
                                />
                            ))}
                        </div>
                    </section>

                </div>

                {/* --- RIGHT COLUMN: LEADERBOARD & PRIZE --- */}
                <div className="w-full xl:w-[420px] flex flex-col gap-6">

                    {/* LEADERBOARD PANEL */}
                    <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-cyan-500/50 to-purple-500/50 overflow-hidden">
                        <div className="absolute inset-0 bg-slate-950 rounded-[20px] m-[1px]" />
                        <div className="relative z-10 bg-slate-900/90 backdrop-blur-xl rounded-[20px] p-6 min-h-[300px] border border-white/5">

                            {/* Leaderboard Header */}
                            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                <h3 className="font-bold text-white text-lg tracking-wide uppercase">Leaderboard</h3>
                                <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 border border-red-500/30 rounded">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Live</span>
                                </div>
                            </div>

                            {/* List */}
                            <div className="space-y-1 font-mono text-sm max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                                {loadingLeaders ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="animate-spin text-cyan-500" />
                                    </div>
                                ) : (
                                    leaders.map((leader, i) => (
                                        <div key={leader.id} className="group flex justify-between items-center p-3 rounded bg-white/5 hover:bg-white/10 border border-transparent hover:border-cyan-500/30 transition-all cursor-default">
                                            <div className="flex items-center gap-3">
                                                <span className={`font-bold w-6 text-center text-xs ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : 'text-slate-500'}`}>
                                                    {i + 1}#
                                                </span>
                                                <span className="text-slate-200 font-bold truncate max-w-[140px] group-hover:text-white transition-colors">
                                                    {leader.name}
                                                </span>
                                            </div>
                                            <span className="text-cyan-400 font-medium">{leader.score}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Decorative circuit lines */}
                            <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-500/20 rounded-br-xl" />
                        </div>
                    </div>

                    {/* PRIZE PANEL */}
                    <CyberpunkCard className="h-[320px] flex flex-col items-center justify-center text-center p-8 bg-black/60 !border-purple-500/30">
                        <h3 className="text-xs font-bold text-purple-400 tracking-[0.3em] uppercase mb-8 border-b border-purple-500/30 pb-2 w-full text-center">
                            Tonight's Prize
                        </h3>

                        {/* Pixel Art Robot (Custom SVG/Element) */}
                        <div className="relative w-32 h-32 bg-slate-900 rounded-xl mb-6 group cursor-pointer overflow-hidden border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            {/* Glitch Overlay */}
                            <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay group-hover:bg-purple-500/20 transition-colors" />
                            <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                                🤖
                            </div>
                            {/* Scratch overlay text */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <span className="text-[10px] font-bold text-white px-3 py-1 bg-purple-600 rounded">REVEAL</span>
                            </div>
                        </div>

                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            SCRATCH_TO_REVEAL_PRIZE_TIER
                        </p>
                    </CyberpunkCard>

                </div>
            </main>

            {/* --- ASK MODAL --- */}
            <AnimatePresence>
                {isAskModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 w-full max-w-md p-1 shadow-2xl relative overflow-hidden group rounded-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 opacity-20 group-hover:opacity-30 transition-opacity" />
                            <div className="relative bg-slate-950 rounded-2xl p-6 border border-white/10 h-full">

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Transmission Link</h3>
                                    <button onClick={() => setIsAskModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleAskSubmit} className="space-y-4">
                                    <textarea
                                        autoFocus
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="Enter your query for the stage..."
                                        className="w-full h-32 p-4 rounded bg-black/50 border border-white/10 focus:outline-none focus:border-cyan-500 text-white resize-none font-mono text-sm"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="w-full py-4 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                                    >
                                        {sending ? <Loader2 className="animate-spin" /> : <Send size={16} />}
                                        {sending ? 'UPLOADING...' : 'TRANSMIT'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
