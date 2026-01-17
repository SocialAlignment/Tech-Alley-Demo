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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">

            {/* --- CENTER COLUMN (Main Content) --- */}
            <div className="lg:col-span-8 space-y-8">

                {/* Header */}
                {/* Header / Video Player */}
                <div className="w-full">
                    <VideoPlayer
                        thumbnailUrl="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
                        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        title="Welcome to Tech Alley"
                        description="Your companion for the best event experience."
                        className="rounded-[2rem] shadow-sm w-full"
                        aspectRatio="16/9"
                    />
                    {isSaving && (
                        <div className="text-xs text-purple-500 flex items-center justify-end gap-2 animate-pulse mt-2">
                            <Loader2 size={12} className="animate-spin" /> Saving progress...
                        </div>
                    )}
                </div>

                {/* Progress Card */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
                    <div className="flex justify-between items-end mb-3">
                        <div>
                            <span className="text-4xl font-bold text-slate-900">{progress}%</span>
                            <span className="text-slate-400 text-sm ml-2">Completed</span>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-purple-600 font-bold bg-purple-50 px-3 py-1 rounded-full inline-block">
                                {checkedItems.size} / {missions.length} Tasks
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                                {earnedPoints} / {maxPoints} XP
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-10 text-slate-400">Loading missions...</div>
                    ) : missions.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">No missions active right now.</div>
                    ) : (
                        missions.map((item) => {
                            const isChecked = checkedItems.has(item.id);

                            // Determine Action URL
                            let actionUrl = null;
                            const textValues = item.text.toLowerCase();

                            if (textValues.includes("connect with 5 new people")) actionUrl = "/hub/networking";
                            else if (textValues.includes("submit a question")) actionUrl = "/hub/surveys";
                            else if (textValues.includes("complete your social profile")) actionUrl = leadId ? `/hub/profile/qualify?id=${leadId}` : '/hub/profile/qualify';
                            else if (textValues.includes("enter the genai")) actionUrl = "/hub/giveaway";
                            else if (textValues.includes("follow hello henderson")) actionUrl = "https://www.youtube.com/@DeadSprintRadio/videos";
                            // Add more mappings as needed

                            const isExternal = actionUrl?.startsWith('http');

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`
                                    group p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4
                                    ${isChecked
                                            ? 'bg-purple-50 border-purple-100'
                                            : 'bg-white border-slate-100 hover:border-purple-200 hover:shadow-sm'
                                        }
                                `}
                                    onClick={() => toggleItem(item.id)}
                                >
                                    <div className={`
                                    w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0
                                    ${isChecked
                                            ? 'bg-purple-500 border-purple-500 text-white'
                                            : 'border-slate-300 text-transparent group-hover:border-purple-300'
                                        }
                                `}>
                                        <Check size={14} strokeWidth={3} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-bold transition-colors truncate ${isChecked ? 'text-purple-900 line-through decoration-purple-300' : 'text-slate-800'}`}>
                                            {item.text}
                                        </h3>
                                        <p className="text-xs text-slate-400 truncate">
                                            {isChecked ? 'Completed!' : (item.description || `Tap to complete (+${item.points} XP)`)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-xs font-bold text-slate-300 group-hover:text-purple-400 whitespace-nowrap">
                                            +{item.points} XP
                                        </div>

                                        {/* Action Button */}
                                        {!isChecked && actionUrl && (
                                            <div onClick={(e) => e.stopPropagation()}>
                                                {isExternal ? (
                                                    <a href={actionUrl} target="_blank" rel="noopener noreferrer">
                                                        <GoButton className="h-8 text-xs bg-slate-900 text-white hover:bg-slate-800" text="Go" />
                                                    </a>
                                                ) : (
                                                    <Link href={actionUrl}>
                                                        <GoButton className="h-8 text-xs bg-slate-900 text-white hover:bg-slate-800" text="Go" />
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        }))}
                </div>
            </div>

            {/* --- RIGHT COLUMN (Widgets) --- */}
            <div className="lg:col-span-4 space-y-6">

                {/* Winners Widget */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none"></div>

                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900">Tonight's Winners</h3>
                        <div className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full flex items-center gap-1 border border-yellow-100">
                            <span>🏆</span> Top 5
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isLoadingLeaders ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-slate-300" />
                            </div>
                        ) : (
                            <>
                                {/* Render Winners */}
                                {winners.map((winner, index) => (
                                    <div key={winner.id} className="flex items-center gap-4">
                                        {/* Rank Badge */}
                                        <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-sm shrink-0 border border-yellow-200">
                                            {index + 1}
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                {winner.avatar ? (
                                                    <img src={winner.avatar} alt={winner.name} className="w-6 h-6 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                        {(winner.name || '?').substring(0, 1)}
                                                    </div>
                                                )}
                                                <p className="text-sm font-bold text-slate-800 truncate">
                                                    {winner.name}
                                                </p>
                                            </div>
                                            <p className="text-xs text-slate-400 truncate pl-8">
                                                {winner.company || 'Community Member'}
                                            </p>
                                        </div>

                                        {/* Time */}
                                        <div className="font-bold text-slate-900 text-xs text-right leading-tight">
                                            <div>{new Date(winner.completedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
                                            <div className="text-[10px] text-slate-400 font-normal">Mission Complete</div>
                                        </div>
                                    </div>
                                ))}

                                {/* Open Slots */}
                                {Array.from({ length: Math.max(0, 5 - winners.length) }).map((_, i) => (
                                    <div key={`empty-${i}`} className="flex items-center gap-4 opacity-50">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center font-bold text-sm shrink-0 border border-dashed border-slate-200">
                                            {winners.length + i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-400 italic">Open Slot</p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* Progress Leaderboard Widget */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900">Leaderboard</h3>
                        <div className="text-xs font-bold text-purple-500 bg-purple-50 px-2 py-1 rounded-full flex items-center gap-1">
                            <span>🔥</span> Top 10
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isLoadingLeaders ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-slate-300" />
                            </div>
                        ) : leaders.length === 0 ? (
                            <div className="text-center py-6 text-slate-400 text-sm">
                                No activity yet. Start your missions!
                            </div>
                        ) : (
                            leaders.map((leader, index) => (
                                <div key={leader.id || index} className="flex items-center gap-4">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                                        ${index < 3 ? 'bg-purple-100 text-purple-700' : 'bg-slate-50 text-slate-500'}
                                    `}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            {leader.avatar ? (
                                                <img src={leader.avatar} alt={leader.name} className="w-6 h-6 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    {(leader.name || '?').substring(0, 1)}
                                                </div>
                                            )}
                                            <p className="text-sm font-bold text-slate-800 truncate">
                                                {leader.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-slate-900 text-sm">
                                        {leader.score}%
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Prize Reveal Widget */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <h3 className="font-bold text-slate-900 mb-4">Tonight's Prize</h3>
                    <div className="rounded-2xl overflow-hidden border-2 border-slate-100">
                        <ScratchToReveal
                            width={250}
                            height={250}
                            minScratchPercentage={50}
                            className="flex items-center justify-center bg-slate-50"
                            gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
                        >
                            <div className="flex flex-col items-center justify-center p-4">
                                <div className="text-6xl mb-4">🤖 🎥</div>
                                <p className="text-sm font-bold text-slate-800 px-4">
                                    First 5 people to finish all Tasks get 5 extra entries into GenAI Ad Giveaway!
                                </p>
                            </div>
                        </ScratchToReveal>
                    </div>
                    <p className="text-xs text-slate-400 mt-4">
                        Scratch to reveal your potential prize!
                    </p>
                </div>

            </div>
        </div>
    );
}
