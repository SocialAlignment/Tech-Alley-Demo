"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarPlus, Sparkles, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitEvent } from "@/app/actions";

interface SubmitEventWidgetProps {
    className?: string;
}

export function SubmitEventWidget({ className }: SubmitEventWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const result = await submitEvent(formData);

        if (result.success) {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setIsOpen(false);
            }, 3000);
        } else {
            console.error(result.error);
            // Could add error handling UI here
        }
        setIsSubmitting(false);
    };

    return (
        <>
            {/* Widget Card */}
            <div className={cn("relative group overflow-hidden rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-sm p-6", className)}>
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-magenta-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-cyan-400">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Community</span>
                        </div>
                        <h3 className="text-xl font-bold text-white leading-tight">
                            Host an Event?
                        </h3>
                        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                            Promote your local tech meetups, workshops, and gatherings to the Tech Alley community.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsOpen(true)}
                        className="w-full group/btn relative flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-cyan-500 px-4 py-3 text-sm font-bold uppercase tracking-wider text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Submit Event <CalendarPlus className="w-4 h-4" />
                        </span>
                    </button>
                </div>
            </div>

            {/* Modal Dialog (Rendered in Portal) */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
                            />

                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 md:p-8 shadow-2xl z-10"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {!submitted ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2 text-center">
                                            <h2 className="text-2xl font-bold text-white">Submit an Event</h2>
                                            <p className="text-sm text-slate-400">Fill out the details below to add your event to the calendar.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-slate-500">Event Name</label>
                                                <input
                                                    name="name"
                                                    required
                                                    type="text"
                                                    placeholder="e.g. AI Workflow Workshop"
                                                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase text-slate-500">Date</label>
                                                    <input
                                                        name="date"
                                                        required
                                                        type="date"
                                                        className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase text-slate-500">Time</label>
                                                    <input
                                                        name="time"
                                                        required
                                                        type="time"
                                                        className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-slate-500">Description</label>
                                                <textarea
                                                    name="description"
                                                    required
                                                    rows={3}
                                                    placeholder="Briefly describe what attendees can expect..."
                                                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-slate-500">Link / RSVP URL</label>
                                                <input
                                                    name="link"
                                                    type="url"
                                                    placeholder="https://..."
                                                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full flex items-center justify-center rounded-lg bg-cyan-500 py-3 text-sm font-bold uppercase tracking-wider text-slate-950 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                "Submit for Review"
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                                            <Send className="w-8 h-8 text-green-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Submission Received!</h3>
                                        <p className="text-slate-400 max-w-xs">
                                            Thanks for submitting your event. Our team will review it shortly.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
