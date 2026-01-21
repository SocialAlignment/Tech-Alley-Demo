import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, ExternalLink, Send, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ReviewDraftModalProps {
    isOpen: boolean;
    onClose: () => void;
    draft: { subject: string; body: string } | null;
    recipientName: string;
    recipientEmail: string;
    isLoading: boolean;
}

export default function ReviewDraftModal({ isOpen, onClose, draft, recipientName, recipientEmail, isLoading }: ReviewDraftModalProps) {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (draft) {
            setSubject(draft.subject);
            setBody(draft.body);
        }
    }, [draft]);

    if (!isOpen) return null;

    const handleCopy = () => {
        const fullText = `Subject: ${subject}\n\n${body}`;
        navigator.clipboard.writeText(fullText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenMail = () => {
        const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-[#0f111a] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Using Jonathan's Profile</h2>
                            <div className="text-xs text-slate-400">
                                Drafting for <span className="text-white font-medium">{recipientName}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {isLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                                <Loader2 size={48} className="text-purple-400 animate-spin relative z-10" />
                            </div>
                            <p className="animate-pulse text-sm">Accessing Perplexity Sonar Pro...</p>
                        </div>
                    ) : (
                        <>
                            {/* Subject */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject Line</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-white font-medium focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            {/* Body */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Body</label>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className="w-full h-80 bg-slate-900/50 border border-white/10 rounded-lg p-4 text-slate-300 focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm leading-relaxed resize-none"
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-slate-950 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white px-4 py-2 font-medium transition-colors"
                    >
                        Discard
                    </button>
                    {!isLoading && (
                        <>
                            <button
                                onClick={handleCopy}
                                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                            >
                                {copied ? <span className="text-green-400">Copied!</span> : <><Copy size={16} /> Copy Text</>}
                            </button>
                            <button
                                onClick={handleOpenMail}
                                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                            >
                                <Send size={16} /> Open Mail App
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
