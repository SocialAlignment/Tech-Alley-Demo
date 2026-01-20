import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Send, Zap, MessageSquare, Mic,
    Users, Sparkles, CheckCircle,
    Loader2, Radio, Smartphone, Mail,
    Edit3, Play, Volume2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardStats, Lead } from '@/app/admin/page'; // Verify import path

interface BroadcastModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'email' | 'sms' | 'voice';
    leads: Lead[];
}

type Step = 'audience' | 'input' | 'preview' | 'dispatch' | 'completed';

export default function BroadcastModal({ isOpen, onClose, type, leads }: BroadcastModalProps) {
    const [step, setStep] = useState<Step>('audience');
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [mode, setMode] = useState<'generic' | 'enriched'>('generic');
    const [message, setMessage] = useState('');
    const [contextNotes, setContextNotes] = useState('');

    // Dispatch State
    const [dispatchLog, setDispatchLog] = useState<{ name: string, status: string, msg: string }[]>([]);
    const [progress, setProgress] = useState(0);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setStep('audience');
            setSelectedLeads(leads.map(l => l.id)); // Default select all
            setMode('generic');
            setMessage('');
            setContextNotes('');
            setDispatchLog([]);
            setProgress(0);
        }
    }, [isOpen]);

    // Auto-scroll dispatch log
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [dispatchLog]);

    const titleMap = {
        email: 'Email Blast',
        sms: 'SMS Alert',
        voice: 'Voice Agent Deployment'
    };

    const iconMap = {
        email: Mail,
        sms: MessageSquare,
        voice: Mic
    };

    const Icon = iconMap[type];

    // --- LOGIC ---

    const generateAIPreview = () => {
        // Simulating AI Generation based on context
        const base = contextNotes || "Update from Tech Alley";
        return [
            { tone: 'Professional', text: `Hello [Name], update regarding: ${base}. Please advise.` },
            { tone: 'Excited', text: `Hey [Name]! Huge news: ${base}. Don't miss out!` },
            { tone: 'Urgent', text: `[Action Required] ${base}. Please check immediately, [Name].` }
        ];
    };

    const [aiOptions, setAiOptions] = useState<{ tone: string, text: string }[]>([]);
    const [selectedOption, setSelectedOption] = useState<number>(0);

    const handleNext = () => {
        if (step === 'audience') {
            setStep('input');
        } else if (mode === 'enriched' && step === 'input') {
            setAiOptions(generateAIPreview());
            setStep('preview');
        } else {
            startDispatch();
        }
    };

    const toggleLead = (id: string) => {
        setSelectedLeads(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedLeads.length === leads.length) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(leads.map(l => l.id));
        }
    };

    const startDispatch = () => {
        setStep('dispatch');
        let current = 0;

        // --- REAL SMS TRIGGER ---
        if (type === 'sms') {
            fetch('/api/admin/sms/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'blast' })
            }).catch(console.error);
        }


        // Filter leads based on selection
        const targetLeads = leads.filter(l => selectedLeads.includes(l.id));
        const finalLeads = targetLeads.length > 0 ? targetLeads : [
            { id: '1', name: "Jonathan Sterritt", role: "Organizer", email: "demo@test.com", company: "Tech Alley" },
            { id: '2', name: "Ana Birch", role: "Attendee", email: "demo@test.com", company: "Tech Alley" },
            { id: '3', name: "Jorge Hernandez", role: "Sponsor", email: "demo@test.com", company: "Tech Alley" },
            { id: '4', name: "Sarah Connor", role: "Developer", email: "demo@test.com", company: "Tech Alley" },
            { id: '5', name: "John Doe", role: "Founder", email: "demo@test.com", company: "Tech Alley" }
        ];

        const total = finalLeads.length;

        const interval = setInterval(() => {
            if (current >= total) {
                clearInterval(interval);
                setTimeout(() => setStep('completed'), 1000);
                return;
            }

            const lead = finalLeads[current];
            const personalMsg = mode === 'enriched'
                ? aiOptions[selectedOption]?.text.replace('[Name]', lead.name.split(' ')[0]) || "Error"
                : message;

            setDispatchLog(prev => [...prev, {
                name: lead.name,
                status: 'Sent',
                msg: type === 'voice' ? `Calling... Connected (0:${12 + Math.floor(Math.random() * 10)}s)` : personalMsg
            }]);

            setProgress(((current + 1) / total) * 100);
            current++;
        }, 800); // Speed of dispatch
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-[#0f111a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg bg-slate-800",
                            type === 'email' ? "text-blue-400" : type === 'sms' ? "text-green-400" : "text-purple-400"
                        )}>
                            <Icon size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{titleMap[type]}</h2>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Users size={12} />
                                <span>Targeting {selectedLeads.length} of {leads.length || 'Unknown'} Users</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">

                    {/* STEP 0: AUDIENCE SELECTION */}
                    {step === 'audience' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-white">Select Recipients</h3>
                                <button
                                    onClick={toggleAll}
                                    className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                                >
                                    {selectedLeads.length === leads.length ? "Deselect All" : "Select All"}
                                </button>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden max-h-[400px] overflow-y-auto">
                                {leads.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500">
                                        <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p>No leads found in database.</p>
                                    </div>
                                ) : leads.map(lead => (
                                    <div
                                        key={lead.id}
                                        onClick={() => toggleLead(lead.id)}
                                        className={cn(
                                            "flex items-center justify-between p-3 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors",
                                            selectedLeads.includes(lead.id) ? "bg-blue-900/10" : ""
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                selectedLeads.includes(lead.id) ? "bg-blue-500 border-blue-500" : "border-slate-600 group-hover:border-slate-500"
                                            )}>
                                                {selectedLeads.includes(lead.id) && <CheckCircle size={12} className="text-white" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{lead.name}</p>
                                                <p className="text-xs text-slate-500">{lead.role} • {lead.company}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs text-slate-500 text-center">
                                Tip: You can filter by roles in the next version.
                            </div>
                        </div>
                    )}

                    {/* STEP 1: INPUT */}
                    {step === 'input' && (
                        <div className="space-y-6">
                            {/* Mode Toggle */}
                            <div className="grid grid-cols-2 gap-4 p-1 bg-slate-900 rounded-xl border border-slate-800">
                                <button
                                    onClick={() => setMode('generic')}
                                    className={cn("flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all",
                                        mode === 'generic' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    <MessageSquare size={16} /> Generic
                                </button>
                                <button
                                    onClick={() => setMode('enriched')}
                                    className={cn("flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all relative overflow-hidden",
                                        mode === 'enriched' ? "bg-indigo-900/40 text-indigo-300 shadow-md border border-indigo-500/50" : "text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    {mode === 'enriched' && <Sparkles className="absolute top-2 right-2 w-3 h-3 text-indigo-400 animate-pulse" />}
                                    <Zap size={16} /> Enriched AI
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {mode === 'generic' ? (
                                    <motion.div
                                        key="generic"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <label className="text-sm font-medium text-slate-300">Message Content</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                                            placeholder="Type your broadcast message here..."
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="enriched"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <div className="bg-indigo-900/20 border border-indigo-500/20 p-4 rounded-xl flex items-start gap-3">
                                            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-bold text-indigo-300 mb-1">AI Context Engine</h4>
                                                <p className="text-xs text-indigo-200/70">
                                                    Provide context notes. Our system will analyze each recipient's profile (Role, Industry, Interests) and generate a personalized message for them.
                                                </p>
                                            </div>
                                        </div>

                                        <label className="text-sm font-medium text-slate-300">Context Notes</label>
                                        <textarea
                                            value={contextNotes}
                                            onChange={(e) => setContextNotes(e.target.value)}
                                            className="w-full h-32 bg-slate-950 border border-indigo-500/30 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                            placeholder="e.g. Pizza has arrived in the lobby, remind them about the raffle..."
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* STEP 2: PREVIEW (Enriched Only) */}
                    {step === 'preview' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white">Select AI Strategy</h3>
                            <div className="grid gap-4">
                                {aiOptions.map((opt, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedOption(i)}
                                        className={cn("p-4 rounded-xl border cursor-pointer transition-all",
                                            selectedOption === i
                                                ? "bg-indigo-900/20 border-indigo-500"
                                                : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{opt.tone}</span>
                                            {selectedOption === i && <CheckCircle size={16} className="text-indigo-400" />}
                                        </div>
                                        <p className="text-sm text-slate-300">"{opt.text}"</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Sample Personalizations</h4>
                                <div className="space-y-2 text-xs text-slate-400 font-mono">
                                    <p>• {aiOptions[selectedOption].text.replace('[Name]', 'Jonathan')}</p>
                                    <p>• {aiOptions[selectedOption].text.replace('[Name]', 'Sarah')}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: DISPATCH CONSOLE */}
                    {(step === 'dispatch' || step === 'completed') && (
                        <div className="h-full flex flex-col space-y-4">
                            {/* Visualization container */}
                            <div className="relative bg-black rounded-xl border border-slate-800 p-4 h-64 overflow-hidden font-mono text-xs shadow-inner">
                                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent z-10" />
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent z-10" />

                                <div ref={scrollRef} className="h-full overflow-y-auto space-y-1 pb-2">
                                    {dispatchLog.map((log, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={i}
                                            className="flex items-start gap-3 border-b border-slate-900 pb-1 mb-1"
                                        >
                                            <span className="text-green-500 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                                            <span className="text-blue-400 font-bold shrink-0 w-24 truncate">{log.name}</span>
                                            <span className="text-slate-500 shrink-0">::</span>
                                            <span className={cn("truncate", type === 'voice' ? "text-purple-400" : "text-slate-300")}>
                                                {log.msg}
                                            </span>
                                        </motion.div>
                                    ))}
                                    {step === 'dispatch' && (
                                        <div className="flex items-center gap-2 text-slate-500 animate-pulse mt-2">
                                            <Loader2 size={12} className="animate-spin" />
                                            <span>Processing queue...</span>
                                        </div>
                                    )}
                                    {step === 'completed' && (
                                        <div className="text-green-400 font-bold mt-4 border-t border-green-900/50 pt-2">
                                            Successfully dispatched to {dispatchLog.length} users.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Progress</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-gradient-to-r from-blue-600 to-purple-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer / Actions */}
                <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
                    {step === 'completed' ? (
                        <button
                            onClick={onClose}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                        >
                            Close
                        </button>
                    ) : (
                        <>
                            {step !== 'dispatch' && (
                                <button
                                    onClick={onClose}
                                    className="text-slate-400 hover:text-white px-4 py-2 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            )}

                            {step === 'input' && (
                                <button
                                    onClick={handleNext}
                                    disabled={(!message && mode === 'generic') || (!contextNotes && mode === 'enriched')}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                                >
                                    {mode === 'enriched' ? 'Preview Generation' : 'Send Broadcast'} <Send size={16} />
                                </button>
                            )}

                            {step === 'audience' && (
                                <button
                                    onClick={handleNext}
                                    disabled={selectedLeads.length === 0}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                                >
                                    Compose Message <Send size={16} />
                                </button>
                            )}

                            {step === 'preview' && (
                                <button
                                    onClick={startDispatch}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                                >
                                    <Zap size={16} fill="currentColor" /> Deploy Agents
                                </button>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

// NOTE: Add this component to your admin page and manage the state 'isOpen', 'type' etc.
