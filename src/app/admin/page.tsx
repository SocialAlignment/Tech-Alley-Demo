'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Ticket, CheckSquare, Bell, Mail, MessageSquare, RefreshCw, Trophy, LogOut, Calendar, X } from 'lucide-react';
import WheelOfAlignment from '@/components/ui/wheel-of-alignment';
import BroadcastModal from '@/components/admin/BroadcastModal';
import { EventApprovalWidget } from '@/components/admin/EventApprovalWidget';
import { getAllFeedback, getAllQuestions, markFeedbackAsHandled, markQuestionAsAnswered } from '@/lib/api';
import { HelpCircle, MessagesSquare, Filter } from 'lucide-react';
import RegistrantsListModal from '@/components/admin/RegistrantsListModal';
import RaffleEntriesModal from '@/components/admin/RaffleEntriesModal';

// Data Interfaces
export interface DashboardStats {
    totalUsers: number;
    totalLeads: number;
    activeSponsors: number;
    photoUploads: number;
    questions: number;
    raffleEntries: number;
    registrantCount: number;
    checkedIn: number;
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
    onClick?: () => void;
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
    const [qualifiedLeads, setQualifiedLeads] = useState<any[]>([]); // New State for Qualified Leads
    const [smsStatus, setSmsStatus] = useState<'active' | 'simulated'>('active');
    const [feedbackItems, setFeedbackItems] = useState<any[]>([]); // Quick type for now
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedSpeaker, setSelectedSpeaker] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [showRegistrantsModal, setShowRegistrantsModal] = useState(false);
    const [showRaffleEntriesModal, setShowRaffleEntriesModal] = useState(false);

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
                if (data.qualifiedLeads) setQualifiedLeads(data.qualifiedLeads);
                if (data.smsStatus) setSmsStatus(data.smsStatus);

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

    const BentoCard = ({ children, className = "", delay = 0, onClick }: BentoCardProps) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            onClick={onClick}
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

                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            MISSION CONTROL
                        </h1>
                        <p className="text-slate-400">Tech Alley Henderson • Live Operations</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={async () => {
                                if (confirm("⚠️ FACTORY RESET: This will wipe ALL leads, entries, and logs. Are you sure?")) {
                                    const res = await fetch('/api/admin/reset', { method: 'POST' });
                                    if (res.ok) {
                                        alert("Database Reset Complete. Refreshing...");
                                        window.location.reload();
                                    } else {
                                        alert("Reset Failed.");
                                    }
                                }
                            }}
                            className="p-2 hover:bg-red-500/20 rounded-full text-slate-500 hover:text-red-500 transition-colors"
                            title="Factory Reset Database"
                        >
                            <span className="font-bold text-xs uppercase tracking-widest border border-current px-2 py-1 rounded">Reset DB</span>
                        </button>
                        <button
                            onClick={() => {
                                sessionStorage.removeItem('admin_access');
                                router.push('/');
                            }}
                            className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                        >
                            <LogOut className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                {/* UNIFIED BENTO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

                    {/* --- ROW 1: PRIORITY DEMO & STATS --- */}

                    {/* 1. Spin the Wheel (Priority) */}
                    <BentoCard className="md:col-span-2 md:row-span-1 bg-gradient-to-br from-amber-500/10 to-purple-600/10 border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group/wheel" delay={0.05}>
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

                    {/* 2. Registrants Count */}
                    <BentoCard
                        className="md:col-span-1 border-purple-500/30 bg-purple-500/10 cursor-pointer hover:bg-purple-500/20 transition-colors"
                        delay={0.1}
                        onClick={() => setShowRegistrantsModal(true)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Users className="w-6 h-6" /></span>
                            <span className="text-xs text-purple-300 flex items-center gap-1">Unique</span>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-1">{stats?.registrantCount || 0}</div>
                            <div className="text-sm text-slate-400">Feb Registrants</div>
                        </div>
                    </BentoCard>

                    {/* 3. Raffle Entries Count */}
                    <BentoCard
                        className="md:col-span-1 border-blue-500/30 bg-blue-500/10 cursor-pointer hover:bg-blue-500/20 transition-colors"
                        delay={0.15}
                        onClick={() => setShowRaffleEntriesModal(true)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Ticket className="w-6 h-6" /></span>
                            <span className="text-xs text-blue-300 flex items-center gap-1">Total</span>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-1">{stats?.raffleEntries || 0}</div>
                            <div className="text-sm text-slate-400">Raffle Entries</div>
                        </div>
                    </BentoCard>

                    {/* --- ROW 2: QUALIFIED LEADS & LIVE FEED --- */}

                    {/* 4. Qualified Leads Table (2x2) */}
                    <motion.div
                        className="md:col-span-2 md:row-span-2 bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-purple-400" />
                                Feb Qualified Leads
                            </h2>
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full font-bold">
                                {qualifiedLeads?.length || 0} Registered
                            </span>
                        </div>
                        <div className="overflow-x-auto flex-1 custom-scrollbar">
                            <table className="w-full text-left text-sm">
                                <thead className="text-xs text-slate-500 uppercase border-b border-white/5">
                                    <tr>
                                        <th className="pb-3 pl-2">Name</th>
                                        <th className="pb-3">Score</th>
                                        <th className="pb-3 text-right">Var</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {qualifiedLeads?.length === 0 ? (
                                        <tr><td colSpan={3} className="py-8 text-center text-slate-500 italic">No registrations.</td></tr>
                                    ) : (
                                        qualifiedLeads.map((lead: any) => (
                                            <tr key={lead.id} className="group hover:bg-white/5 transition-colors">
                                                <td className="py-2 pl-2">
                                                    <div className="font-bold text-white">{lead.name}</div>
                                                    <div className="text-[10px] text-slate-500">{lead.company}</div>
                                                </td>
                                                <td className="py-2">
                                                    <span className={`font-mono font-bold ${lead.score >= 80 ? 'text-green-400' : 'text-slate-400'}`}>{lead.score}</span>
                                                </td>
                                                <td className="py-2 text-right text-[10px] text-slate-400">
                                                    {lead.newsletter_variant?.split(':')[0]?.replace('Variant ', '') || '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* 5. Live Check-in Feed (1x2) */}
                    {/* 5. Event Approvals (Promoted to Row 2) */}
                    <BentoCard className="md:col-span-2 md:row-span-2" delay={0.25}>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold flex items-center gap-2 text-indigo-100 text-sm">
                                <Calendar className="w-4 h-4 text-indigo-400" /> Event Approvals
                            </h3>
                            <span className="text-[10px] bg-indigo-950 text-indigo-200 px-2 py-0.5 rounded border border-indigo-500/20">Queue</span>
                        </div>
                        <div className="h-[200px] contents-center">
                            <EventApprovalWidget />
                        </div>
                    </BentoCard>

                    {/* --- ROW 3: OPS & LEGACY --- */}

                    {/* 6. Photo Uploads */}
                    <BentoCard
                        className="md:col-span-1 bg-slate-900/50 border-pink-500/20 cursor-pointer hover:bg-pink-500/10 transition-colors"
                        delay={0.3}
                        onClick={() => router.push('/admin/gallery')}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-pink-500/20 rounded-lg text-pink-400"><CheckSquare className="w-6 h-6" /></span>
                            <span className="text-xs text-slate-400">Manage</span>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">{stats?.photoUploads || 0}</div>
                            <div className="text-sm text-slate-400">Photo Uploads</div>
                        </div>
                    </BentoCard>

                    {/* 7. SMS System */}
                    <BentoCard className="md:col-span-1 bg-slate-800/50 border-green-500/20" delay={0.35}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-300 text-sm">SMS System</h3>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${smsStatus === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}`}>
                                {smsStatus === 'active' ? 'Active' : 'Simulated'}
                            </span>
                        </div>
                        <div className="mt-auto">
                            {smsStatus === 'simulated' ? (
                                <button
                                    onClick={() => {
                                        const phone = window.prompt("Enter phone number to test SIMULATION:");
                                        if (phone) {
                                            fetch('/api/admin/sms/test', {
                                                method: 'POST',
                                                body: JSON.stringify({ phone, message: "SIMULATED TEST from Dashboard" })
                                            })
                                                .then(res => res.json())
                                                .then(data => alert(JSON.stringify(data, null, 2)))
                                                .catch(err => alert("Error: " + err.message));
                                        }
                                    }}
                                    className="w-full py-2 rounded text-xs bg-yellow-500/10 text-yellow-200 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors uppercase tracking-wider"
                                >
                                    Test Sim
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        const phone = window.prompt("Enter phone number for LIVE SMS Test:");
                                        if (phone) {
                                            fetch('/api/admin/sms/test', {
                                                method: 'POST',
                                                body: JSON.stringify({ phone, message: "LIVE TEST from Tech Alley Dashboard 🚀" })
                                            })
                                                .then(res => res.json())
                                                .catch(err => alert("Error: " + err.message));
                                        }
                                    }}
                                    className="w-full py-2 rounded text-xs bg-green-500/10 text-green-200 border border-green-500/20 hover:bg-green-500/20 transition-colors uppercase tracking-wider"
                                >
                                    Test Live
                                </button>
                            )}
                        </div>
                    </BentoCard>

                    {/* 8. Broadcast */}
                    <BentoCard className="md:col-span-1 bg-gradient-to-b from-red-900/20 to-slate-900/50 border-red-500/30 hover:border-red-500/60" delay={0.4}>
                        <div className="flex items-center gap-2 mb-4">
                            <Bell className="w-5 h-5 text-red-400" />
                            <h3 className="font-bold text-red-100 text-sm">Broadcast</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-auto">
                            <button onClick={() => setBroadcastState({ isOpen: true, type: 'email' })} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded flex justify-center items-center transition-colors"><Mail className="w-5 h-5" /></button>
                            <button onClick={() => setBroadcastState({ isOpen: true, type: 'sms' })} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded flex justify-center items-center transition-colors"><MessageSquare className="w-5 h-5" /></button>
                        </div>
                    </BentoCard>

                    {/* 9. Check-ins (Legacy) */}
                    <BentoCard className="md:col-span-1 opacity-50 grayscale hover:grayscale-0 transition-all border-dashed border-slate-700" delay={0.45}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="p-1.5 bg-slate-500/20 rounded text-slate-400"><Users className="w-4 h-4" /></span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Legacy</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-300">{stats?.totalUsers || 0}</div>
                        <div className="text-[10px] text-slate-500 uppercase">Total Users</div>
                    </BentoCard>

                    {/* --- ROW 4: DATA FEEDS --- */}

                    {/* 10. Questions */}
                    <BentoCard className="md:col-span-2 bg-slate-900/80 border-indigo-500/20 hover:border-indigo-500/40" delay={0.55}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2 text-indigo-100 text-sm">
                                <HelpCircle className="w-4 h-4 text-indigo-400" /> Questions
                            </h3>
                            <span className="text-[10px] bg-indigo-950 text-indigo-200 px-2 py-0.5 rounded">{questions.length}</span>
                        </div>
                        <div className="h-40 overflow-y-auto custom-scrollbar">
                            {/* ... Content abbreviated to save complexity, using existing map logic ... */}
                            {questions.length === 0 ? <p className="text-xs text-slate-500 text-center mt-10">No questions.</p> : (
                                questions.slice(0, 5).map(q => (
                                    <div key={q.id} className="p-2 border-b border-white/5 text-xs">
                                        <span className="text-indigo-400 font-bold">{q.speaker_name}:</span> <span className="text-slate-300">{q.content}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </BentoCard>

                    {/* 11. Feedback */}
                    <BentoCard className="md:col-span-2 bg-slate-900/80 border-cyan-500/20 hover:border-cyan-500/40" delay={0.6}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2 text-cyan-100 text-sm">
                                <MessagesSquare className="w-4 h-4 text-cyan-400" /> Feedback
                            </h3>
                            <span className="text-[10px] bg-cyan-950 text-cyan-200 px-2 py-0.5 rounded">{feedbackItems.length}</span>
                        </div>
                        <div className="h-40 overflow-y-auto custom-scrollbar">
                            {feedbackItems.length === 0 ? <p className="text-xs text-slate-500 text-center mt-10">No feedback.</p> : (
                                feedbackItems.slice(0, 5).map(f => (
                                    <div key={f.id} className="p-2 border-b border-white/5 text-xs">
                                        <span className="text-cyan-400 font-bold">{f.speaker_name}:</span> <span className="text-slate-300">{f.content}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </BentoCard>

                    {/* 12. Live Feed (Legacy) - Moved to bottom */}
                    <div className="md:col-span-4 opacity-30 hover:opacity-100 transition-opacity bg-slate-900/20 border border-white/5 rounded-2xl p-6 h-[200px] flex flex-col border-dashed">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold flex items-center gap-2 text-slate-500">
                                <RefreshCw className="w-4 h-4" /> Live Feed (Legacy)
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                            {leads.length === 0 ? (
                                <div className="text-center text-slate-500 italic text-xs mt-10">Waiting...</div>
                            ) : (
                                leads.map((lead) => (
                                    <div key={lead.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5 opacity-50">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold flex-none text-slate-400">
                                            {lead.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-xs text-slate-400 truncate">{lead.name}</div>
                                            <div className="text-[10px] text-slate-600 truncate">{lead.company}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

            </div>

            {/* Wheel of Alignment Modal */}
            {showRaffleWheel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="relative w-full max-w-5xl bg-black/50 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="absolute top-4 right-4 z-50">
                            <button
                                onClick={() => setShowRaffleWheel(false)}
                                className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-white/10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <WheelOfAlignment />
                    </div>
                </div>
            )}

            {/* Broadcast Modal */}
            <BroadcastModal
                isOpen={broadcastState.isOpen}
                onClose={() => setBroadcastState(prev => ({ ...prev, isOpen: false }))}
                type={broadcastState.type}
                leads={leads}
            />

            {/* Registrants List Modal */}
            <RegistrantsListModal
                isOpen={showRegistrantsModal}
                onClose={() => setShowRegistrantsModal(false)}
                leads={qualifiedLeads}
            />

            {/* Raffle Entries Modal */}
            <RaffleEntriesModal
                isOpen={showRaffleEntriesModal}
                onClose={() => setShowRaffleEntriesModal(false)}
                entries={qualifiedLeads}
            />

        </main>
    );
}
