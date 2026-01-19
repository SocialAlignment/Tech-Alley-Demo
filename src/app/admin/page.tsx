'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Ticket, CheckSquare, Bell, Mail, MessageSquare, RefreshCw, Trophy, LogOut, Calendar } from 'lucide-react';
import RaffleWheel from '@/components/admin/RaffleWheel';
import BroadcastModal from '@/components/admin/BroadcastModal';
import { EventApprovalWidget } from '@/components/admin/EventApprovalWidget';
import { getAllFeedback, getAllQuestions, markFeedbackAsHandled, markQuestionAsAnswered } from '@/lib/api';
import { HelpCircle, MessagesSquare, Filter } from 'lucide-react';

// Data Interfaces
export interface DashboardStats {
    totalUsers: number;
    photoUploads: number;
    questions: number;
    raffleEntries: number;
    forms: {
        grant: number;
        mri: number;
        genai: number;
    }
}

export interface Lead {
    id: string;
    name: string;
    email: string;
    role: string;
    company: string;
}

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export default function AdminDashboardPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showRaffleWheel, setShowRaffleWheel] = useState(false);
    const [broadcastState, setBroadcastState] = useState<{ isOpen: boolean, type: 'email' | 'sms' | 'voice' }>({
        isOpen: false,
        type: 'email'
    });



    // Data State
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [feedbackItems, setFeedbackItems] = useState<any[]>([]); // Quick type for now
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedSpeaker, setSelectedSpeaker] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Auth Bypass (Debugging)
        setIsAuthenticated(true);

        // Fetch Data
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();

                if (data.stats) setStats(data.stats);
                if (data.recentLeads) setLeads(data.recentLeads);

                // Fetch Feedback & Questions
                const fb = await getAllFeedback();
                setFeedbackItems(fb);

                const qs = await getAllQuestions();
                setQuestions(qs);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 15000); // Poll every 15s

        return () => clearInterval(interval);
    }, [router]);

    if (!isAuthenticated) return null;

    const BentoCard = ({ children, className = "", delay = 0 }: BentoCardProps) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-md hover:border-purple-500/50 transition-colors group ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 p-6 h-full flex flex-col">
                {children}
            </div>
        </motion.div>
    );

    return (
        <main className="relative min-h-screen bg-black text-white p-4 md:p-8 font-sans">

            {/* Background: Static & Premium */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[#0a0a0a]">
                {/* Subtle Gradient Mesh */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black opacity-80" />

                {/* Technical Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            MISSION CONTROL
                        </h1>
                        <p className="text-slate-400">Tech Alley Henderson • Live Operations</p>
                    </div>
                    <button
                        onClick={() => {
                            sessionStorage.removeItem('admin_access');
                            router.push('/');
                        }}
                        className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <LogOut className="w-6 h-6" />
                    </button>
                </header>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

                    {/* Stat: Total Attendees */}
                    <BentoCard className="md:col-span-1" delay={0.1}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Users className="w-6 h-6" /></span>
                            <span className="text-xs text-green-400 flex items-center gap-1">Live <span className="bg-green-500 w-1.5 h-1.5 rounded-full animate-pulse" /></span>
                        </div>
                        <div className="mt-auto">
                            <h3 className="text-4xl font-bold text-white">{loading ? '...' : stats?.totalUsers || 0}</h3>
                            <p className="text-sm text-slate-400">Total Check-ins</p>
                        </div>
                    </BentoCard>

                    {/* Stat: Raffle Entries */}
                    <BentoCard className="md:col-span-1" delay={0.2}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Ticket className="w-6 h-6" /></span>
                            <span className="text-xs text-purple-400">Active Pool</span>
                        </div>
                        <div className="mt-auto">
                            <h3 className="text-4xl font-bold text-white">{loading ? '...' : stats?.raffleEntries || 0}</h3>
                            <p className="text-sm text-slate-400">Raffle Entries</p>
                        </div>
                    </BentoCard>

                    {/* Stat: Missions & Forms */}
                    <BentoCard className="md:col-span-1" delay={0.3}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-pink-500/20 rounded-lg text-pink-400"><CheckSquare className="w-6 h-6" /></span>
                        </div>
                        <div className="mt-auto">
                            <h3 className="text-4xl font-bold text-white">{loading ? '...' : (stats?.photoUploads || 0) + (stats?.forms.grant || 0)}</h3>
                            <p className="text-sm text-slate-400">Actions / Uploads</p>
                        </div>
                    </BentoCard>


                    {/* Data Feed: Recent Activity */}
                    <BentoCard className="md:col-span-2 md:row-span-2" delay={0.4}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2">
                                <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} /> Live Feed
                            </h3>
                            <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-white/5">Real-time</span>
                        </div>
                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 -mx-4 px-4 space-y-2">
                            {leads.length === 0 ? (
                                <p className="text-slate-500 text-sm text-center py-4">Waiting for check-ins...</p>
                            ) : (
                                leads.map((lead) => (
                                    <div key={lead.id} className="flex items-center justify-between p-3 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm text-white">{lead.name}</span>
                                            <span className="text-xs text-slate-400">{lead.email}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">{lead.role}</span>
                                            <span className="text-[10px] text-slate-500 mt-1">{lead.company}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </BentoCard>

                    {/* Action: Event Approvals */}
                    <BentoCard className="md:col-span-2 md:row-span-2" delay={0.45}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2 text-indigo-100">
                                <Calendar className="w-5 h-5 text-indigo-400" /> Event Approvals
                            </h3>
                            <span className="text-xs bg-indigo-950 text-indigo-200 px-2 py-1 rounded border border-indigo-500/20">
                                Review Queue
                            </span>
                        </div>
                        <div className="h-[calc(100%-3rem)] contents-center">
                            <EventApprovalWidget />
                        </div>
                    </BentoCard>

                    {/* Action: Broadcast (High Priority) */}
                    <BentoCard className="md:col-span-1 md:row-span-2 bg-gradient-to-b from-red-900/20 to-slate-900/50 border-red-500/30 hover:border-red-500/60" delay={0.5}>
                        <div className="flex items-center gap-2 mb-6">
                            <Bell className="w-5 h-5 text-red-400" />
                            <h3 className="font-bold text-red-100">BROADCAST</h3>
                        </div>
                        <div className="space-y-3 mt-auto">
                            <button
                                onClick={() => setBroadcastState({ isOpen: true, type: 'email' })}
                                className="w-full py-3 bg-red-500/20 hover:bg-red-500 hover:text-black border border-red-500/50 rounded-lg flex items-center justify-center gap-2 transition-all group/btn"
                            >
                                <Mail className="w-4 h-4" />
                                <span>Send Email Blast</span>
                            </button>
                            <button
                                onClick={() => setBroadcastState({ isOpen: true, type: 'sms' })}
                                className="w-full py-3 bg-red-500/20 hover:bg-red-500 hover:text-black border border-red-500/50 rounded-lg flex items-center justify-center gap-2 transition-all"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>Send SMS Alert</span>
                            </button>
                            <button
                                onClick={() => setBroadcastState({ isOpen: true, type: 'voice' })}
                                className="w-full py-3 bg-purple-500/20 hover:bg-purple-500 hover:text-black border border-purple-500/50 rounded-lg flex items-center justify-center gap-2 transition-all"
                            >
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span>Deploy Voice Agent</span>
                            </button>
                            <p className="text-[10px] text-red-400/60 text-center mt-2">Will notify all active attendees immediately.</p>
                        </div>
                    </BentoCard>


                    {/* Data Feed: Questions (New Section) */}
                    <BentoCard className="md:col-span-2 md:row-span-2 bg-slate-900/80 border-indigo-500/20 hover:border-indigo-500/40" delay={0.5}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2 text-indigo-100">
                                <HelpCircle className="w-5 h-5 text-indigo-400" /> Speaker Questions
                            </h3>
                            <div className="flex items-center gap-2">
                                <Filter className="w-3 h-3 text-slate-500" />
                                <select
                                    value={selectedSpeaker}
                                    onChange={(e) => setSelectedSpeaker(e.target.value)}
                                    className="bg-slate-800 text-xs text-slate-300 border border-white/10 rounded px-2 py-1 outline-none focus:border-indigo-500"
                                >
                                    <option value="all">All Speakers</option>
                                    {Array.from(new Set([...questions, ...feedbackItems].map(i => i.speaker_name))).map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                                <span className="text-xs bg-indigo-950 text-indigo-200 px-2 py-1 rounded border border-indigo-500/20">
                                    {loading ? '...' : questions.filter(q => selectedSpeaker === 'all' || q.speaker_name === selectedSpeaker).length} Pending
                                </span>
                            </div>
                        </div>
                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 -mx-4 px-4 space-y-3">
                            {questions.filter(q => selectedSpeaker === 'all' || q.speaker_name === selectedSpeaker).length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
                                    <HelpCircle className="w-8 h-8 mb-2 opacity-20" />
                                    <p>No unanswered questions!</p>
                                </div>
                            ) : (
                                questions.filter(q => selectedSpeaker === 'all' || q.speaker_name === selectedSpeaker).map((item) => (
                                    <div key={item.id} className="p-3 rounded-lg bg-black/40 border border-white/5 hover:border-indigo-500/30 transition-all group relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{item.speaker_name}</span>
                                            <span className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 font-medium mb-2">"{item.content}"</p>
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs text-slate-500">From: {item.visitor_name || 'Anonymous'}</span>
                                            <button
                                                onClick={async () => {
                                                    await markQuestionAsAnswered(item.id);
                                                    setQuestions(prev => prev.filter(i => i.id !== item.id));
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 flex items-center gap-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-xs"
                                            >
                                                <div className="w-3 h-3 rounded-sm border border-current" /> Mark Done
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </BentoCard>

                    {/* Action: Feedback Widget */}
                    <BentoCard className="md:col-span-2 md:row-span-2 bg-slate-900/80 border-cyan-500/20 hover:border-cyan-500/40" delay={0.55}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2 text-cyan-100">
                                <MessagesSquare className="w-5 h-5 text-cyan-400" /> Speaker Feedback
                            </h3>
                            {/* Re-use selectedSpeaker filter for viewing consistency */}
                            <span className="text-xs bg-cyan-950 text-cyan-200 px-2 py-1 rounded border border-cyan-500/20">
                                {loading ? '...' : feedbackItems.filter(f => selectedSpeaker === 'all' || f.speaker_name === selectedSpeaker).length} Pending
                            </span>
                        </div>
                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 -mx-4 px-4 space-y-3">
                            {feedbackItems.filter(f => selectedSpeaker === 'all' || f.speaker_name === selectedSpeaker).length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
                                    <CheckSquare className="w-8 h-8 mb-2 opacity-20" />
                                    <p>All feedback handled!</p>
                                </div>
                            ) : (
                                feedbackItems.filter(f => selectedSpeaker === 'all' || f.speaker_name === selectedSpeaker).map((item) => (
                                    <div key={item.id} className="p-3 rounded-lg bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all group relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{item.speaker_name}</span>
                                            <span className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 italic mb-2">"{item.content}"</p>
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs text-slate-500">From: {item.visitor_name || 'Anonymous'}</span>
                                            <button
                                                onClick={async () => {
                                                    await markFeedbackAsHandled(item.id);
                                                    setFeedbackItems(prev => prev.filter(i => i.id !== item.id));
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 flex items-center gap-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-xs"
                                            >
                                                <div className="w-3 h-3 rounded-sm border border-current" /> Mark Done
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </BentoCard>

                    {/* Action: Raffle Wheel (The "Cool" Thing) */}
                    <BentoCard className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-amber-500/10 to-purple-600/10 border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group/wheel" delay={0.6}>
                        <div
                            onClick={() => setShowRaffleWheel(true)}
                            className="h-full flex flex-col items-center justify-center text-center gap-4 py-4"
                        >
                            <div className="p-4 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 shadow-[0_0_30px_rgba(251,191,36,0.4)] group-hover/wheel:scale-110 transition-transform duration-500">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-amber-100">Spin the Wheel</h3>
                                <p className="text-xs text-amber-200/60">Launch Digital Raffle</p>
                            </div>
                        </div>
                    </BentoCard>

                </div>
            </div>

            {/* Raffle Wheel Modal */}
            {showRaffleWheel && (
                <RaffleWheel
                    onClose={() => setShowRaffleWheel(false)}
                    candidates={leads.map(l => l.name)}
                />
            )}

            {/* Broadcast Modal */}
            <BroadcastModal
                isOpen={broadcastState.isOpen}
                onClose={() => setBroadcastState(prev => ({ ...prev, isOpen: false }))}
                type={broadcastState.type}
                leads={leads}
            />

        </main>
    );
}
