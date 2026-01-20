'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic2, X,
    Loader2, Send, Activity,
    Users, HelpCircle, Camera, User, ChevronRight, CheckCircle2, Trophy
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIdentity } from '@/context/IdentityContext';
import SpeakerCard from '@/components/SpeakerCard';
import { GlowingEffect } from '@/components/ui/glowing-effect';
// Import New Components
import { CyberpunkCard } from '@/components/ui/cyberpunk-card';
import { ElectricProgressBar } from '@/components/ui/electric-progress-bar';
import { CircuitBoardBackground } from '@/components/ui/circuit-board-background';

// Icon Mapping
const ICON_MAP: Record<string, any> = {
    // Lucide Icons
    'Users': Users,
    'UserPlus': Users, // Map common variations
    'HelpCircle': HelpCircle,
    'User': User,
    'Camera': Camera,
    'ChevronRight': ChevronRight,
    'CheckCircle': CheckCircle2, // Map 'CheckCircle' (default fallback) to CheckCircle2
    'CheckCircle2': CheckCircle2,
    'Trophy': Trophy,
    'Mic2': Mic2,
    'Activity': Activity,
    'Send': Send,
    'Star': Trophy,
    // Add common social ones if user uses them in Notion
    'Youtube': Activity, // Fallback if explicit icon not imported
    'Linkedin': Users,   // Fallback
    'Facebook': Users,   // Fallback
    'Instagram': Camera, // Fallback
};

// --- DATA CONSTANTS ---

// Speakers removed per layout refactor

const MISSION_ACTIONS: Record<string, string> = {
    "Connect with 5 New People": "/hub/networking",
    "Complete your Social Profile": "/hub/profile",
    "Submit a photo to the photo booth": "/hub/photo-booth",
    "Enter the GenAi video giveaway": "/hub/raffle",
    "Follow Tech Alley Henderson on LinkedIn": "https://www.linkedin.com/company/tech-alley-henderson",
    "Follow Hello Henderson on YouTube": "https://www.youtube.com/@HelloHenderson"
};

const MISSION_ITEMS: any[] = [];

import confetti from 'canvas-confetti';

// Simple Toast Component
const Toast = ({ message, show, onClose }: { message: string, show: boolean, onClose: () => void }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-6 py-3 rounded-full border border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-3 backdrop-blur-md"
            >
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-bold text-sm tracking-wide">{message}</span>
            </motion.div>
        )}
    </AnimatePresence>
);

export default function ChecklistPage() {
    const router = useRouter();
    const { leadId, userName, missionProgress, missionData, refreshIdentity, isLoading: isIdentityLoading } = useIdentity();
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [sending, setSending] = useState(false);

    // --- LEADERBOARD STATE ---
    const [leaders, setLeaders] = useState<any[]>([]);
    const [winners, setWinners] = useState<any[]>([]);
    const [loadingLeaders, setLoadingLeaders] = useState(true);
    const [prizeRevealed, setPrizeRevealed] = useState(false);
    const [showAllMissions, setShowAllMissions] = useState(false); // Toggle state

    // --- DYNAMIC MISSIONS STATE ---
    const [missions, setMissions] = useState<any[]>([]);
    const [isMissionsLoading, setIsMissionsLoading] = useState(true);

    // Fetch Missions on Mount
    // Fetch Missions on Mount
    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const res = await fetch('/api/missions');
                const data = await res.json();

                // API returns an array, not { success: true, ... }
                if (Array.isArray(data)) {
                    const mappedMissions = data.map((m: any) => ({
                        // Map API response keys to component state keys
                        id: m.id,
                        title: m.Name,         // Map Name -> title
                        subtitle: m.Description, // Map Description -> subtitle
                        xp: m.XP,              // Map XP -> xp
                        // Use static map if API ActionPath is empty or fallback to empty string
                        actionPath: m.ActionPath || MISSION_ACTIONS[m.Name] || '',

                        // Fix casing and fallback
                        icon: ICON_MAP[m.IconName] || ICON_MAP['CheckCircle']
                    }));
                    setMissions(mappedMissions);
                } else {
                    console.error("Invalid mission data format:", data);
                }
            } catch (error) {
                console.error("Failed to fetch missions:", error);
            } finally {
                setIsMissionsLoading(false);
            }
        };

        fetchMissions();
    }, []);

    // --- TOAST STATE ---
    const [toast, setToast] = useState({ show: false, message: '' });
    const showToast = (msg: string) => {
        setToast({ show: true, message: msg });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    // --- MISSION STATE ---
    // We'll track completed mission IDs locally for immediate feedback, then sync.
    // In a real app, we'd fetch this from 'mission_data' column. 
    // For now, we'll initialize from local storage or just default to empty if not provided.
    const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());

    // --- LEADERBOARD FETCH ---
    const fetchLeaderboard = async () => {
        try {
            const res = await fetch('/api/leaderboard');
            const data = await res.json();
            if (data.success) {
                setLeaders(data.leaders || []);
                setWinners(data.winners || []);
            }
        } catch (e) {
            console.error("Failed to fetch leaderboard", e);
        } finally {
            setLoadingLeaders(false);
        }
    }

    useEffect(() => {
        fetchLeaderboard();
        // Poll leaderboard every 30s
        const interval = setInterval(fetchLeaderboard, 30000);
        return () => clearInterval(interval);
    }, []);

    // Load completed missions from storage to persist roughly across reloads if not fully synced
    useEffect(() => {
        // 1. Get Local Data
        let localData: string[] = [];
        const saved = localStorage.getItem(`missions_${leadId}`);
        if (saved) {
            try {
                localData = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse local missions", e);
            }
        }

        // 2. Get DB Data (from context)
        const dbData = missionData || [];

        // 3. Merge (Union)
        const merged = new Set([...localData, ...dbData]);
        setCompletedMissions(merged);

        // 4. Self-Healing: If local has more data than DB, sync back to DB
        // This fixes cases where a previous update failed or was overwritten
        if (merged.size > dbData.length && missions.length > 0) {
            console.log("Found unsaved missions locally. Syncing to database...", merged);

            // Calculate XP for the sync
            let totalEarned = 0;
            missions.forEach(m => {
                if (merged.has(m.id)) totalEarned += m.xp;
            });

            // Fire and forget update
            fetch('/api/update-lead', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pageId: leadId,
                    missionData: Array.from(merged),
                    missionProgress: totalEarned
                })
            }).then(() => {
                console.log("Sync complete. Refreshing leaderboard.");
                fetchLeaderboard();
            }).catch(e => console.error("Sync failed", e));
        }

    }, [leadId, missionData, missions.length]); // Added missions.length dependency to ensure we can calculate XP

    const navigateTo = (path: string) => {
        router.push(leadId ? `${path}?id=${leadId}` : path);
    };

    // Calculate Progress Based on Dynamic Missions
    const calculateProgress = () => {
        if (!completedMissions || missions.length === 0) return 0;

        let totalXP = 0;
        let earnedXP = 0;

        missions.forEach(mission => {
            totalXP += mission.xp;
            // Check if mission is effectively completed
            const isDone = completedMissions.has(mission.id);

            if (isDone) {
                earnedXP += mission.xp;
            }
        });

        return totalXP === 0 ? 0 : Math.round((earnedXP / totalXP) * 100);
    };

    const toggleMission = async (missionId: string, xp: number) => {
        const newCompleted = new Set(completedMissions);
        let added = false;

        if (newCompleted.has(missionId)) {
            newCompleted.delete(missionId);
        } else {
            newCompleted.add(missionId);
            added = true;
        }

        setCompletedMissions(newCompleted);
        localStorage.setItem(`missions_${leadId}`, JSON.stringify(Array.from(newCompleted)));

        // Calculate new Progress
        let totalXP = 0;
        let earnedTotal = 0;
        missions.forEach(m => {
            totalXP += m.xp;
            if (newCompleted.has(m.id)) earnedTotal += m.xp;
        });

        // Toast Feedback
        if (added) {
            showToast(`Mission Completed! +${xp} XP`);
            if (totalXP > 0 && (earnedTotal / totalXP) >= 1) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#22d3ee', '#a855f7', '#ffffff']
                });
                showToast("MAXIMUM LEVEL REACHED!");
            }
        }

        try {
            await fetch('/api/update-lead', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pageId: leadId, // Important: API expects 'pageId' as the UUID (legacy naming in route)
                    missionData: Array.from(newCompleted),
                    missionProgress: earnedTotal
                })
            });

            // Immediately refresh leaderboard to show new score
            fetchLeaderboard();

            // Refresh context to update global nav bar if needed
            if (refreshIdentity) refreshIdentity();
        } catch (e) {
            console.error("Failed to sync mission progress", e);
        }
    };

    const handleAskSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        try {
            const res = await fetch('/api/update-lead', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pageId: leadId,
                    updates: {
                        eventFeedback: `ASKED QUESTION: ${question}`
                    }
                })
            });

            if (res.ok) {
                // Also mark feedback mission as done if not already
                if (!completedMissions.has('feedback')) {
                    toggleMission('feedback', 10);
                }

                setTimeout(() => {
                    setSending(false);
                    setIsAskModalOpen(false);
                    setQuestion('');
                    showToast("Message Transmitted to Stage!");
                }, 800);
            }
        } catch (err) {
            console.error(err);
            setSending(false);
        }
    };

    // Calculate current visual progress
    const progressPercent = calculateProgress();

    return (
        <div className="flex flex-col min-h-screen bg-[#0f0518] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">

            <CircuitBoardBackground />

            <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />

            {/* --- MAIN LAYOUT --- */}
            <main className="relative z-10 flex flex-col xl:flex-row gap-6 p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto w-full flex-1">


                {/* --- LEFT COLUMN: HERO & MISSIONS --- */}
                <div className="flex-1 flex flex-col gap-6 min-w-0">

                    {/* CYBERPUNK HERO HEADER */}
                    <div className="relative w-full h-[250px] md:h-[320px] rounded-3xl overflow-hidden border border-cyan-500/30 group">
                        {/* Background Image Placeholder */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=2676&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-[#0f0518]/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] mb-2">
                                Tech Alley Henderson<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Task Station</span>
                            </h1>
                            <p className="text-sm md:text-base text-cyan-100/70 font-mono tracking-widest uppercase">
                                Missions
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
                                    {Math.round(progressPercent)}%
                                </span>
                                <span className="text-sm font-bold text-purple-400 tracking-[0.2em] uppercase mb-1">
                                    Systems Optimized
                                </span>
                            </div>
                            <span className="text-[10px] text-cyan-500/70 font-mono">{completedMissions.size}/{missions.length} MISSIONS ACCOMPLISHED</span>
                        </div>

                        {/* Custom Electric Progress Bar */}
                        <ElectricProgressBar progress={progressPercent} />
                    </div>

                    {/* MISSIONS LIST */}
                    <div className="grid gap-3">
                        {isMissionsLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                            </div>
                        ) : (showAllMissions ? missions : missions.slice(0, 5)).map((item, idx) => {
                            const isCompleted = completedMissions.has(item.id);
                            const Icon = item.icon;

                            return (
                                <CyberpunkCard
                                    key={item.id}
                                    variant={isCompleted ? 'active' : 'default'}
                                    className={`transition-all duration-300 ${isCompleted ? 'bg-cyan-950/20 border-cyan-500/50' : ''}`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {/* CHECKBOX / ICON - TOGGLES COMPLETION */}
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMission(item.id, item.xp);
                                                }}
                                                className={`w-10 h-10 rounded-lg border flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] transition-all cursor-pointer hover:bg-cyan-500/10 hover:border-cyan-400 hover:scale-105 active:scale-95 ${isCompleted
                                                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                                                    : 'bg-black/50 border-cyan-500/20 text-slate-500'
                                                    }`}
                                                role="button"
                                                title={isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                                            >
                                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                            </div>

                                            {/* TEXT CONTENT */}
                                            <div className="flex-1">
                                                <h3 className={`font-bold text-xl tracking-wide transition-colors uppercase ${isCompleted ? 'text-cyan-300 line-through decoration-cyan-500/50' : 'text-white'
                                                    }`}>
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded border uppercase tracking-wider ${isCompleted
                                                        ? 'bg-cyan-900/50 text-cyan-200 border-cyan-500/30'
                                                        : 'bg-purple-900/50 text-purple-300 border-purple-500/30'
                                                        }`}>
                                                        +{item.xp} XP
                                                    </span>
                                                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                                                        {item.subtitle}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ACTION BUTTON - NAVIGATES OR PERFORMS ACTION */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (item.actionPath) {
                                                    navigateTo(item.actionPath);
                                                } else if (item.id === 'feedback') {
                                                    setIsAskModalOpen(true);
                                                } else {
                                                    // For items without a path (e.g. Sticker, Demo), button also toggles
                                                    toggleMission(item.id, item.xp);
                                                }
                                            }}
                                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)] uppercase tracking-wider border ${isCompleted
                                                ? 'bg-cyan-950/30 text-cyan-300 border-cyan-500/50 hover:bg-cyan-500 hover:text-black'
                                                : 'bg-cyan-500 text-black border-cyan-400 hover:bg-cyan-400 min-w-[80px]'
                                                }`}
                                        >
                                            {item.actionPath || item.id === 'feedback'
                                                ? (isCompleted ? 'View' : 'Start')
                                                : (isCompleted ? 'Done' : 'Do It')
                                            }
                                        </button>
                                    </div>
                                </CyberpunkCard>
                            );
                        })}
                    </div>

                    {/* SHOW MORE TOGGLE */}
                    {missions.length > 5 && (
                        <button
                            onClick={() => setShowAllMissions(!showAllMissions)}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2 group"
                        >
                            {showAllMissions ? 'Collapse Missions' : `Show ${missions.length - 5} More Missions`}
                            <ChevronRight className={`transition-transform duration-300 ${showAllMissions ? '-rotate-90' : 'rotate-90'}`} />
                        </button>
                    )}

                </div>

                {/* --- RIGHT COLUMN: LEADERBOARD & PRIZE --- */}
                <div className="w-full xl:w-[420px] flex flex-col gap-4">

                    {/* 1. TOP: LEADERBOARD PANEL (XP Leaders) */}
                    <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-cyan-500/50 to-purple-500/50 overflow-hidden flex flex-col h-[400px]">
                        <div className="absolute inset-0 bg-slate-950 rounded-[20px] m-[1px]" />
                        <div className="relative z-10 bg-slate-900/90 backdrop-blur-xl rounded-[20px] p-6 h-full flex flex-col border border-white/5">

                            {/* Header */}
                            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3 shrink-0">
                                <h3 className="font-bold text-white text-base tracking-wide uppercase flex items-center gap-2">
                                    <Trophy size={16} className="text-cyan-400" />
                                    Top Leaders
                                </h3>
                                <div className="flex items-center gap-2 px-2 py-1 bg-cyan-900/20 border border-cyan-500/30 rounded">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                    <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">XP Rank</span>
                                </div>
                            </div>

                            {/* LEADERS LIST (Top 10) */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1 font-mono text-sm">
                                {loadingLeaders ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="animate-spin text-cyan-500" />
                                    </div>
                                ) : (
                                    leaders.map((leader, i) => (
                                        <div key={leader.id} className="group flex justify-between items-center p-2 rounded bg-white/5 hover:bg-white/10 border border-transparent hover:border-cyan-500/30 transition-all cursor-default">
                                            <div className="flex items-center gap-3">
                                                <span className={`font-bold w-5 text-center text-xs ${i === 0 ? 'text-cyan-300' : 'text-slate-500'}`}>
                                                    {i + 1}
                                                </span>
                                                <span className="text-slate-200 font-bold truncate max-w-[140px] group-hover:text-white transition-colors text-xs">
                                                    {leader.name}
                                                </span>
                                            </div>
                                            <span className="text-cyan-400 font-bold text-xs">{leader.score} XP</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. MIDDLE: PRIZE PANEL - COMPACT */}
                    <CyberpunkCard className="h-[200px] flex flex-col items-center justify-center text-center p-4 bg-black/60 !border-purple-500/30 relative overflow-hidden group hover:!border-purple-400/50 transition-colors">
                        {/* Background Glow */}
                        <div className={`absolute inset-0 transition-colors duration-1000 ${prizeRevealed ? 'bg-purple-900/20' : 'bg-purple-500/5 group-hover:bg-purple-500/10'}`} />

                        <h3 className="text-[10px] font-bold text-purple-400 tracking-[0.3em] uppercase mb-2 w-full text-center relative z-10">
                            {prizeRevealed ? "PRIZE UNLOCKED" : "MYSTERY DROP"}
                        </h3>

                        {/* Prize Content Container */}
                        <div className="relative w-full max-w-[120px] aspect-square my-auto flex items-center justify-center z-10">
                            <AnimatePresence mode='wait'>
                                {!prizeRevealed ? (
                                    <motion.div
                                        key="locked"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                                        className="relative w-full h-full bg-slate-900/80 rounded-xl flex items-center justify-center border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)] cursor-pointer group-hover:scale-105 transition-transform duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                                        onClick={() => setPrizeRevealed(true)}
                                    >
                                        <div className="text-5xl animate-bounce-slow filter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                                            🎁
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="revealed"
                                        initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        className="relative w-full h-full bg-gradient-to-br from-purple-900/80 to-black rounded-xl flex flex-col items-center justify-center border border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                                    >
                                        <div className="text-4xl mb-1">👕</div>
                                        <div className="text-xs font-black text-white uppercase tracking-wider">Dev Shirt</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <p className="text-[9px] font-mono uppercase tracking-widest mt-2 relative z-10 text-purple-300/70">
                            {prizeRevealed ? 'BOOTH #4' : 'CLICK TO REVEAL'}
                        </p>
                    </CyberpunkCard>

                    {/* 3. BOTTOM: WINNERS PANEL (Fastest Completion) */}
                    <div className="relative rounded-[20px] p-[1px] bg-gradient-to-br from-yellow-500/50 to-orange-500/50 overflow-hidden flex flex-col min-h-[250px] flex-1">
                        <div className="absolute inset-0 bg-slate-950 rounded-[20px] m-[1px]" />
                        <div className="relative z-10 bg-slate-900/90 backdrop-blur-xl rounded-[20px] p-6 h-full flex flex-col border border-white/5">

                            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3 shrink-0">
                                <h3 className="font-bold text-white text-base tracking-wide uppercase flex items-center gap-2">
                                    <Trophy size={16} className="text-yellow-400" />
                                    Hall of Fame
                                </h3>
                                <span className="text-[9px] font-bold text-yellow-500 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-500/30 uppercase tracking-widest">
                                    Fastest
                                </span>
                            </div>

                            {winners.length > 0 ? (
                                <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1">
                                    {winners.map((winner, i) => (
                                        <div key={`winner-${winner.id}`} className="flex justify-between items-center p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 hover:bg-yellow-500/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center font-black text-xs shadow-lg shadow-yellow-500/20">
                                                    #{i + 1}
                                                </div>
                                                <span className="text-yellow-100 font-bold text-sm truncate max-w-[120px]">{winner.name}</span>
                                            </div>
                                            <div className="text-[10px] text-yellow-400/80 font-mono">
                                                {new Date(winner.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-2">
                                    <Trophy size={32} className="opacity-20" />
                                    <p className="text-xs uppercase tracking-widest text-center">No Champions Yet</p>
                                    <p className="text-[10px] text-center max-w-[200px]">Be the first to complete all missions to claim your spot!</p>
                                </div>
                            )}
                        </div>
                    </div>

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
