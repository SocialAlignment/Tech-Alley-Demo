
"use client";

import { useState, useEffect } from "react";
import { Check, X, Calendar, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PendingEvent {
    id: string;
    name: string;
    date: string;
    description: string;
    link: string;
    tags: string[];
}

export function EventApprovalWidget() {
    const [events, setEvents] = useState<PendingEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchPendingEvents = async () => {
        try {
            const res = await fetch("/api/admin/pending-events");
            const data = await res.json();
            if (data.success) {
                setEvents(data.events);
            }
        } catch (error) {
            console.error("Failed to fetch pending events", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingEvents();
    }, []);

    const handleAction = async (eventId: string, action: 'approve' | 'reject') => {
        setProcessingId(eventId);
        try {
            const res = await fetch("/api/admin/approve-event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId, action }),
            });
            const data = await res.json();

            if (data.success) {
                // Remove from local list
                setEvents(prev => prev.filter(e => e.id !== eventId));
            } else {
                alert("Failed to update event status: " + data.error);
            }
        } catch (error) {
            console.error("Action failed", error);
            alert("An error occurred.");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48 bg-slate-900/50 rounded-xl border border-slate-800">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 bg-slate-900/50 rounded-xl border border-dashed border-slate-800 text-slate-500">
                <Check className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No events pending approval</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Pending Event Approvals</h3>
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {events.map((event) => (
                        <motion.div
                            key={event.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/30 transition-all"
                        >
                            {/* Accent Line */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-3">
                                <div className="space-y-1 flex-1">
                                    <h4 className="font-bold text-white text-lg">{event.name}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                        {event.date.includes('T') && <span>• {new Date(event.date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>}
                                    </div>
                                    <p className="text-sm text-slate-300 line-clamp-2">{event.description}</p>
                                    {event.link && (
                                        <a href={event.link} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline truncate block max-w-xs">{event.link}</a>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleAction(event.id, 'reject')}
                                        disabled={!!processingId}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                                        title="Reject"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleAction(event.id, 'approve')}
                                        disabled={!!processingId}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 disabled:opacity-50 transition-colors font-bold text-sm"
                                        title="Approve"
                                    >
                                        {processingId === event.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5" />
                                                Approve
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
