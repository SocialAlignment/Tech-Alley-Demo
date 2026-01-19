"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Loader2, AlertCircle, Clock,
    DoorOpen, Users, Video, Rocket, Mic,
    Flag, Zap, ChevronRight, PlayCircle
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists, typical in shadcn/ui setups. If not I'll handle it.

// --- Types ---
interface AgendaItem {
    id: string;
    time: string;
    event: string;
    desc: string;
}

// --- Icons Mapping ---
const getEventIcon = (event: string) => {
    const e = event.toLowerCase();
    if (e.includes('door')) return <DoorOpen className="w-6 h-6" />;
    if (e.includes('networking')) return <Users className="w-6 h-6" />;
    if (e.includes('film') || e.includes('show')) return <Video className="w-6 h-6" />;
    if (e.includes('kickoff') || e.includes('start')) return <Rocket className="w-6 h-6" />;
    if (e.includes('speaker') || e.includes('talk')) return <Mic className="w-6 h-6" />;
    if (e.includes('spotlight')) return <Zap className="w-6 h-6" />;
    if (e.includes('end')) return <Flag className="w-6 h-6" />;
    return <Calendar className="w-6 h-6" />;
};

// --- Time Helper ---
const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

// --- Components ---

const CircuitryBackground = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 bg-slate-950/80" />
        {/* Animated Orbs/Glows */}
        <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"
        />
        <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px]"
        />
    </div>
);

const HUDWidget = ({ label, value, subtext }: { label: string, value: string, subtext?: string }) => (
    <div className="relative group overflow-hidden bg-slate-900/50 border border-slate-800 backdrop-blur-md rounded-xl p-4 min-w-[160px]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500/50 rounded-tl-md" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50 rounded-tr-md" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500/50 rounded-bl-md" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50 rounded-br-md" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{label}</span>
            <span className="text-2xl font-mono font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                {value}
            </span>
            {subtext && <span className="text-[10px] text-cyan-400/70 mt-1">{subtext}</span>}
        </div>
    </div>
);

const AgendaCard = ({ item, index, isCurrent }: { item: AgendaItem, index: number, isCurrent: boolean }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-8 md:pl-0"
        >
            {/* Timeline Connector Mobile */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-800 md:hidden">
                <div className={cn("absolute top-6 left-[-5px] w-3 h-3 rounded-full border-2 bg-slate-950",
                    isCurrent ? "border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "border-slate-700"
                )} />
            </div>

            <div className={cn(
                "group relative flex flex-col md:flex-row gap-6 p-1 md:p-6 rounded-2xl transition-all duration-300",
                isCurrent
                    ? "bg-slate-900/60 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] scale-[1.02]"
                    : "hover:bg-slate-900/30 border border-transparent hover:border-slate-800"
            )}>
                {/* Time Chip */}
                <div className="md:w-32 flex-shrink-0">
                    <div className={cn(
                        "inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-bold border",
                        isCurrent
                            ? "bg-cyan-950/30 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                            : "bg-slate-900 border-slate-700 text-slate-400 group-hover:border-slate-600 transition-colors"
                    )}>
                        {item.time}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", isCurrent ? "text-cyan-400 bg-cyan-950/30" : "text-slate-500 bg-slate-900 group-hover:text-blue-400 transition-colors")}>
                            {getEventIcon(item.event)}
                        </div>
                        <h3 className={cn("text-xl font-bold", isCurrent ? "text-white" : "text-slate-200 group-hover:text-white transition-colors")}>
                            {item.event}
                        </h3>
                    </div>

                    <p className="text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                        {item.desc}
                    </p>

                    {/* Hover Micro-interaction */}
                    <div className="h-0 group-hover:h-6 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                        <span className="text-xs text-blue-400 flex items-center gap-1 mt-2">
                            DETAILS <ChevronRight size={12} />
                        </span>
                    </div>
                </div>

                {/* Desktop Timeline Dot */}
                <div className="hidden md:block absolute left-[-41px] top-1/2 -translate-y-1/2">
                    <div className={cn("w-4 h-4 rounded-full border-2 bg-slate-950 transition-all duration-500",
                        isCurrent
                            ? "border-cyan-400 scale-125 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                            : "border-slate-700 group-hover:border-blue-500"
                    )} />
                </div>
            </div>
        </motion.div>
    );
};

export default function AgendaPage() {
    const [agenda, setAgenda] = useState<AgendaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");

    useEffect(() => {
        // Hydration fix for client-only time
        setCurrentTime(new Date());

        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);

            // Event: Jan 21st, 2026 at 6:00 PM
            const eventStart = new Date('2026-01-21T18:00:00');

            if (now > eventStart) {
                // If past 5pm, maybe show time until 8pm or just "LIVE"
                setTimeRemaining("LIVE NOW");
            } else {
                const diff = eventStart.getTime() - now.getTime();
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                // Format: DD:HH:MM:SS
                setTimeRemaining(`${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }

        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        async function fetchAgenda() {
            try {
                const res = await fetch('/api/agenda');
                const data = await res.json();

                if (data.success) {
                    setAgenda(data.agenda);
                } else {
                    setError('Failed to load agenda');
                }
            } catch (err) {
                console.error('Error fetching agenda:', err);
                setError('Could not connect to schedule service');
            } finally {
                setLoading(false);
            }
        }

        fetchAgenda();
    }, []);

    // Helper to determine active item (mock logic for demo, real logic would parse time strings)
    const activeIndex = 0; // Defaulting to first item for visual demo if time parsing is complex

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 relative">
            <CircuitryBackground />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col min-h-screen">

                {/* --- Hero Section --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm tracking-widest text-blue-400 mb-2 uppercase font-medium">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            Innovation Henderson Alignment Hub
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-2xl">
                            Tonight's<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Agenda</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-lg border-l-2 border-slate-800 pl-4 mt-4">
                            Stay on track with everything happening tonight.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        {currentTime && (
                            <>
                                <HUDWidget label="Current Time" value={formatTime(currentTime)} />
                                <HUDWidget label="Event Starts In" value={timeRemaining} subtext="DOORS OPEN" />
                            </>
                        )}
                    </div>
                </div>

                {/* --- Timeline Section --- */}
                <div className="relative flex-1">
                    {/* Central Spine (Desktop) */}
                    <div className="hidden md:block absolute left-[88px] top-4 bottom-20 w-[2px] bg-gradient-to-b from-slate-800 via-slate-800 to-transparent" />

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                            <p className="text-slate-500 tracking-widest text-sm uppercase">Synchronizing Run of Show...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4 border border-red-900/50 bg-red-950/20 rounded-2xl">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                            <p className="text-red-400">{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-12 pb-24">
                            {(() => {
                                // Helper to group items
                                const groups = {
                                    pre: [] as AgendaItem[],
                                    main: [] as AgendaItem[],
                                    post: [] as AgendaItem[]
                                };

                                agenda.forEach(item => {
                                    // Parse time roughly (e.g. 5:00 PM)
                                    const timeStr = item.time.toLowerCase();
                                    const isPM = timeStr.includes('pm');
                                    let [hours, minutes] = timeStr.replace(/(am|pm)/, '').trim().split(':').map(Number);

                                    if (isPM && hours !== 12) hours += 12;
                                    if (!isPM && hours === 12) hours = 0;

                                    // Simple logic: < 6pm (18) = Pre, 6-8pm (18-20) = Main, > 8pm (20) = Post
                                    if (hours < 18) {
                                        groups.pre.push(item);
                                    } else if (hours >= 18 && hours < 20) {
                                        groups.main.push(item);
                                    } else {
                                        groups.post.push(item);
                                    }
                                });

                                const renderGroup = (title: string, items: AgendaItem[], delayBase: number) => {
                                    if (items.length === 0) return null;
                                    return (
                                        <div key={title} className="relative">
                                            <div className="flex items-center gap-4 mb-6 ml-0 md:ml-32">
                                                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
                                                <span className="text-xs uppercase tracking-[0.2em] text-cyan-500/70 font-bold">{title}</span>
                                                <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
                                            </div>
                                            <div className="space-y-4">
                                                {items.map((item, idx) => (
                                                    <AgendaCard
                                                        key={item.id}
                                                        item={item}
                                                        index={delayBase + idx}
                                                        isCurrent={false} // Mock logic removed for clean grouping
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                };

                                return (
                                    <>
                                        {renderGroup("Pre-Show", groups.pre, 0)}
                                        {renderGroup("Main Program", groups.main, groups.pre.length)}
                                        {renderGroup("After Hours", groups.post, groups.pre.length + groups.main.length)}
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>

                {/* --- Footer --- */}
                <div className="mt-auto border-t border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-950/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-900">
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 font-medium">Ready for the next move?</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {['Start Here', 'Missions', 'Resources'].map((label) => (
                            <button key={label} className="px-5 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white transition-all text-sm font-medium">
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 pl-0 md:pl-6 md:border-l border-slate-800">
                        <div className="text-right hidden md:block">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Connect with us</p>
                            <p className="text-sm font-bold text-white">Jonathan Sterritt</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
                            JS
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}


