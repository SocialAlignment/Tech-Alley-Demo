'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import clsx from 'clsx';
import { Check, Mic2, ArrowRight, CheckSquare, Loader2 } from 'lucide-react';
import { VideoPlayer } from '@/components/ui/video-thumbnail-player';
import { ScratchToReveal } from '@/components/ui/scratch-to-reveal';
import { useIdentity } from '@/context/IdentityContext';
import { GoButton } from '@/components/ui/go-button';
import Link from 'next/link';

interface Mission {
    id: string;
    text: string;
    description: string;
    points: number;
    active: boolean;
    order: number;
}

export default function ChecklistPage() {
    const { leadId, missionProgress, updateMissionProgress, isLoading: isIdentityLoading } = useIdentity();

    const [missions, setMissions] = useState<Mission[]>([]);
    const [isLoadingMissions, setIsLoadingMissions] = useState(true);

    // Manage checked items locally, sync with Identity
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    // Leaderboard State
    const [winners, setWinners] = useState<any[]>([]);
    const [leaders, setLeaders] = useState<any[]>([]);
    const [isLoadingLeaders, setIsLoadingLeaders] = useState(true);

    // Leaderboard Polling
    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const res = await fetch('/api/leaderboard');
                const data = await res.json();
                if (data.success) {
                    setWinners(data.winners || []);
                    setLeaders(data.leaders || []);
                }
            } catch (error) {
                console.error("Failed to load leaderboard", error);
            } finally {
                setIsLoadingLeaders(false);
            }
        };

        fetchLeaders();
        const interval = setInterval(fetchLeaders, 30000); // 30s poll
        return () => clearInterval(interval);
    }, []);

    // Initial Load of Missions
    useEffect(() => {
        async function fetchMissions() {
            try {
                const res = await fetch('/api/missions/list');
                const data = await res.json();
                if (data.success) {
                    const sorted = data.missions.sort((a: Mission, b: Mission) => {
                        const getPriority = (text: string) => {
                            const t = text.toLowerCase();
                            if (t.includes('spotlight') || t.includes('speaker')) return 2;
                            if (t.includes('connect') || t.includes('networking')) return 1;
                            return 0;
                        };
                        const pA = getPriority(a.text);
                        const pB = getPriority(b.text);
                        if (pA !== pB) return pB - pA; // Higher priority first
                        return a.order - b.order; // Fallback to DB order
                    });
                    setMissions(sorted);
                }
            } catch (error) {
                console.error("Failed to load missions", error);
            } finally {
                setIsLoadingMissions(false);
            }
        }
        fetchMissions();
    }, []);

    // Initial Sync with Identity Progress
    // Only run this when missions are leaded AND identity is ready?
    // Actually, just whenever 'missionProgress' changes from Identity, update local state
    // But we need to avoid overwriting optimistic updates.
    // Simple strategy: On Mount (or when identity loads first time), parse string.
    const hasLoadedProgress = useRef(false);
    useEffect(() => {
        if (missionProgress && !hasLoadedProgress.current) {
            try {
                // Determine format. 
                // The setup script made it 'Rich Text', so we assume Comma Separated String of IDs?
                // Or JSON array?
                // Let's support Comma Separated for robustness to text editing.
                const ids = missionProgress.split(',').map(s => s.trim()).filter(Boolean);
                setCheckedItems(new Set(ids));
                hasLoadedProgress.current = true;
            } catch (e) {
                console.warn("Error parsing mission progress", e);
            }
        }
    }, [missionProgress]);

    // Save Debouncer
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const toggleItem = (id: string) => {
        if (!leadId) {
            alert("Please sign in (scan QR code) to track progress!");
            // return; // Allow toggling for fun? No, better to warn.
        }

        const next = new Set(checkedItems);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setCheckedItems(next);

        // Convert to String
        const progressString = Array.from(next).join(',');

        // Calculate Percentage for Status Ring
        // Note: We use 'missions.length' to determine total. If missions list isn't fully loaded, this might be off, 
        // but toggleItem only works if missions are rendered.
        // We clamp to 100 just in case.
        const percentage = missions.length > 0
            ? Math.round((next.size / missions.length) * 100)
            : 0;

        // 1. Optimistic Update Context
        updateMissionProgress(progressString);

        // 2. Debounced Save to API
        setIsSaving(true);
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(async () => {
            if (!leadId) {
                console.warn("No Lead ID found, skipping save.");
                setIsSaving(false);
                return;
            }
            try {
                await fetch('/api/update-lead', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pageId: leadId,
                        missionData: progressString,
                        missionProgress: percentage
                    })
                });
            } catch (e) {
                console.error("Save failed", e);
            } finally {
                setIsSaving(false);
            }
        }, 1000);
    };

    const maxPoints = missions.reduce((acc, m) => acc + m.points, 0);
    const earnedPoints = missions
        .filter(m => checkedItems.has(m.id))
        .reduce((acc, m) => acc + m.points, 0);

    // Progress calculation based on COUNT or POINTS? 
    // User interface showed count previously. Let's use count for bar, points for fun.
    const progress = missions.length > 0 ? Math.round((checkedItems.size / missions.length) * 100) : 0;

    const isLoading = isLoadingMissions || isIdentityLoading;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 text-white">

            {/* --- CENTER COLUMN (Main Content) --- */}
            <div className="lg:col-span-8 space-y-8">

                {/* Header / Video Player */}
                <div className="w-full relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-[2.2rem] opacity-30 group-hover:opacity-60 blur-lg transition duration-500"></div>
                    <div className="relative">
                        <VideoPlayer
                            thumbnailUrl="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
                            videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                            title="Welcome to Tech Alley"
                            description="Your companion for the best event experience."
                            className="rounded-[2rem] shadow-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 w-full"
                            aspectRatio="16/9"
                        />
                    </div>
                    {isSaving && (
                        <div className="text-xs text-purple-400 flex items-center justify-end gap-2 animate-pulse mt-2 font-mono">
                            <Loader2 size={12} className="animate-spin" /> SAVING_PROGRESS...
                        </div>
                    )}
                </div>

                {/* Progress Card */}
                <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tighter">{progress}%</span>
                                <span className="text-purple-400 font-bold uppercase tracking-wider text-sm">Completed</span>
                            </div>
                        </div>
                        <div className="text-right space-y-2">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Status</div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-white/10 text-cyan-400 text-sm font-bold shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                                <CheckSquare size={14} />
                                {checkedItems.size} / {missions.length} Missions
                            </div>
                            <div className="text-xs text-slate-500 font-mono">
                                {earnedPoints} / {maxPoints} XP EARNED
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-4 bg-slate-950/50 rounded-full overflow-hidden border border-white/5 box-border p-0.5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                        >
                            <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 blur-[2px]"></div>
                        </motion.div>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
                            <Loader2 className="animate-spin w-10 h-10 text-purple-500" />
                            <p className="font-mono text-sm tracking-widest">INITIALIZING_MISSIONS...</p>
                        </div>
                    ) : missions.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 font-mono">NO MISSIONS DETECTED</div>
                    ) : (
                        missions.map((item) => {
                            const isChecked = checkedItems.has(item.id);

                            // Determine Action URL
                            let actionUrl = null;
                            const textValues = item.text.toLowerCase();

                            if (textValues.includes("connect with 5 new people")) actionUrl = "/hub/networking";
                            else if (textValues.includes("submit a question")) actionUrl = "/hub/mri";
                            else if (textValues.includes("complete your social profile")) actionUrl = leadId ? `/hub/profile/qualify?id=${leadId}` : '/hub/profile/qualify';
                            else if (textValues.includes("enter the genai")) actionUrl = "/hub/raffle";
                            else if (textValues.includes("apply for grant")) actionUrl = "/hub/grant";
                            else if (textValues.includes("productivity audit")) actionUrl = "/hub/mri";
                            else if (textValues.includes("follow hello henderson")) actionUrl = "https://www.youtube.com/@DeadSprintRadio/videos";
                            // Add more mappings as needed

                            const isExternal = actionUrl?.startsWith('http');

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={clsx(
                                        "group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-5 overflow-hidden backdrop-blur-sm",
                                        isChecked
                                            ? 'bg-slate-900/40 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.05)]'
                                            : 'bg-slate-900/60 border-white/5 hover:border-white/10 hover:bg-slate-800/60'
                                    )}
                                    onClick={() => toggleItem(item.id)}
                                >
                                    {/* Active Glow for unchecked */}
                                    {!isChecked && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>}

                                    {/* Checkbox */}
                                    <div className={clsx(
                                        "w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-300 shrink-0 shadow-lg",
                                        isChecked
                                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600 border-transparent text-white scale-110'
                                            : 'bg-slate-950 border-slate-700 text-transparent group-hover:border-purple-400/50'
                                    )}>
                                        <Check size={16} strokeWidth={4} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 z-10">
                                        <h3 className={clsx(
                                            "font-bold text-lg transition-colors truncate",
                                            isChecked ? 'text-slate-500 line-through decoration-purple-500/50' : 'text-white group-hover:text-purple-200'
                                        )}>
                                            {item.text}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={clsx(
                                                "text-xs font-mono px-1.5 py-0.5 rounded border",
                                                isChecked
                                                    ? 'text-green-400 border-green-500/20 bg-green-500/10'
                                                    : 'text-purple-400 border-purple-500/20 bg-purple-500/10'
                                            )}>
                                                +{item.points} XP
                                            </span>
                                            <p className="text-sm text-slate-400 truncate">
                                                {isChecked ? 'Mission Complete' : (item.description || 'Tap to complete')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {!isChecked && actionUrl && (
                                        <div onClick={(e) => e.stopPropagation()} className="z-10 group/btn">
                                            {isExternal ? (
                                                <a href={actionUrl} target="_blank" rel="noopener noreferrer">
                                                    <GoButton className="h-10 px-6 text-xs bg-white text-slate-900 hover:bg-cyan-400 hover:text-slate-900 border-0 font-bold tracking-wider" text="START" />
                                                </a>
                                            ) : (
                                                <Link href={actionUrl}>
                                                    <GoButton className="h-10 px-6 text-xs bg-white text-slate-900 hover:bg-cyan-400 hover:text-slate-900 border-0 font-bold tracking-wider" text="START" />
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        }))}
                </div>
            </div>

            {/* --- RIGHT COLUMN (Widgets) --- */}
            <div className="lg:col-span-4 space-y-6">

                {/* Winners Widget */}
                <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-yellow-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white text-lg">Tonight's Winners</h3>
                        <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                            <span>🏆</span> Top 5
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isLoadingLeaders ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-purple-500" />
                            </div>
                        ) : (
                            <>
                                {/* Render Winners */}
                                {winners.map((winner, index) => (
                                    <div key={winner.id} className="flex items-center gap-4 group/item">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 text-slate-900 flex items-center justify-center font-bold text-sm shrink-0 shadow-lg">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                {winner.avatar ? (
                                                    <img src={winner.avatar} alt={winner.name} className="w-6 h-6 rounded-full object-cover ring-2 ring-yellow-500/20" />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 ring-1 ring-white/10">
                                                        {(winner.name || '?').substring(0, 1)}
                                                    </div>
                                                )}
                                                <p className="text-sm font-bold text-slate-200 truncate group-hover/item:text-yellow-400 transition-colors">
                                                    {winner.name}
                                                </p>
                                            </div>
                                            <p className="text-xs text-slate-500 truncate pl-8">
                                                {winner.company || 'Community Member'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-yellow-500/80">{new Date(winner.completedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
                                        </div>
                                    </div>
                                ))}

                                {/* Open Slots */}
                                {Array.from({ length: Math.max(0, 5 - winners.length) }).map((_, i) => (
                                    <div key={`empty-${i}`} className="flex items-center gap-4 opacity-30">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0">
                                            {winners.length + i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-500 font-mono tracking-wider">OPEN_SLOT</p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* Progress Leaderboard Widget */}
                <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white text-lg">Leaderboard</h3>
                        <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            <span>🔥</span> Live
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isLoadingLeaders ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-purple-500" />
                            </div>
                        ) : leaders.length === 0 ? (
                            <div className="text-center py-6 text-slate-500 text-sm font-mono">
                                NO_ACTIVITY_DETECTED
                            </div>
                        ) : (
                            leaders.map((leader, index) => (
                                <div key={leader.id || index} className="flex items-center gap-4">
                                    <div className={clsx(
                                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 backdrop-blur-sm",
                                        index < 3
                                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]'
                                            : 'bg-white/5 text-slate-500 border border-white/5'
                                    )}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            {leader.avatar ? (
                                                <img src={leader.avatar} alt={leader.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/10" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                    {(leader.name || '?').substring(0, 1)}
                                                </div>
                                            )}
                                            <p className="text-sm font-bold text-slate-300 truncate">
                                                {leader.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-white text-sm font-mono">
                                        {leader.score}%
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Prize Reveal Widget */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-[2rem] shadow-xl border border-white/10 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.02] -z-10"></div>
                    <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-6 uppercase tracking-wider text-sm">Tonight's Prize</h3>
                    <div className="rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-orange-500 opacity-20 blur-lg group-hover:opacity-40 transition duration-500"></div>
                        <ScratchToReveal
                            width={250}
                            height={250}
                            minScratchPercentage={50}
                            className="flex items-center justify-center bg-slate-900 relative z-10"
                            gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
                        >
                            <div className="flex flex-col items-center justify-center p-6 space-y-4">
                                <div className="text-7xl animate-bounce">🤖</div>
                                <div className="space-y-2">
                                    <p className="text-white font-bold text-lg">GenAI Ad Giveaway!</p>
                                    <p className="text-xs font-medium text-slate-400 px-4">
                                        First 5 people to finish all Tasks get 5 extra entries!
                                    </p>
                                </div>
                            </div>
                        </ScratchToReveal>
                    </div>
                    <p className="text-xs text-slate-500 mt-6 font-mono">
                        SCRATCH_TO_REVEAL_PRIZE_TIER
                    </p>
                </div>

            </div>
        </div>
    );
}
