"use client";

import { useState, useEffect } from "react";
import { EventCard } from "@/components/ui/event-card";
import { Calendar } from "@/components/ui/calendar";
import { SubmitEventWidget } from "@/components/ui/submit-event-widget";
import { Calendar as CalendarIcon, FilterX, Clock, Users, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CircuitBoardBackground } from "@/components/ui/circuit-board-background";
import { cn } from "@/lib/utils";

// --- HUD Widget Component (Local) ---
const HUDWidget = ({ label, value, subtext }: { label: string, value: string, subtext?: string }) => (
    <div className="relative group overflow-hidden bg-slate-900/50 border border-slate-800 backdrop-blur-md rounded-xl p-4 min-w-[140px] md:min-w-[160px]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500/50 rounded-tl-md" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50 rounded-tr-md" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500/50 rounded-bl-md" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50 rounded-br-md" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{label}</span>
            <span className="text-xl md:text-2xl font-mono font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                {value}
            </span>
            {subtext && <span className="text-[10px] text-cyan-400/70 mt-1">{subtext}</span>}
        </div>
    </div>
);

export default function UpcomingEventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Time State
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");

    useEffect(() => {
        // Hydration fix
        setCurrentTime(new Date());

        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);

            // Mock Event: Next month 1st at 6 PM
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            nextMonth.setDate(1);
            nextMonth.setHours(18, 0, 0, 0);

            const diff = nextMonth.getTime() - now.getTime();
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeRemaining(`${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            } else {
                setTimeRemaining("SOON");
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events");
                const data = await res.json();
                if (data.success) {
                    setEvents(data.events);
                }
            } catch (error) {
                console.error("Failed to fetch events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleAddToCalendar = (event: any) => {
        const startDate = new Date(event.date);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        const formatTime = (date: Date) =>
            date.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            event.eventName
        )}&dates=${formatTime(startDate)}/${formatTime(
            endDate
        )}&details=${encodeURIComponent(
            event.description
        )}&location=${encodeURIComponent("Tech Alley Henderson")}`;

        window.open(url, "_blank");
    };

    const filteredEvents = selectedDate
        ? events.filter((event) => {
            const eventDate = new Date(event.date);
            return (
                eventDate.getDate() === selectedDate.getDate() &&
                eventDate.getMonth() === selectedDate.getMonth() &&
                eventDate.getFullYear() === selectedDate.getFullYear()
            );
        })
        : events;

    const formatTimeDisplay = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="relative min-h-full w-full bg-slate-950 text-slate-200 overflow-x-hidden font-sans selection:bg-cyan-500/30">
            <CircuitBoardBackground />

            <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-8 lg:p-12 space-y-12">

                {/* --- Hero Section --- */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/5 pb-10">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-3 text-xs md:text-sm tracking-[0.2em] text-cyan-400 mb-2 uppercase font-bold">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_currentColor]" />
                            Innovation Henderson Alignment Hub
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-2xl">
                            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Events</span>
                        </h1>
                        <p className="text-lg text-slate-400 border-l-2 border-cyan-500/30 pl-4">
                            See what's happening next at Tech Alley Henderson.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        {currentTime && (
                            <>
                                <HUDWidget label="Local Time" value={formatTimeDisplay(currentTime)} />
                                <HUDWidget label="Next Event" value={timeRemaining} subtext="COUNTDOWN" />
                            </>
                        )}
                    </div>
                </div>

                {/* --- Main Content --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-24">

                    {/* Left Column: Calendar */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-700" />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Event Calendar</span>
                            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-700" />
                        </div>

                        <div className="sticky top-8">
                            <Calendar
                                events={events}
                                selectedDate={selectedDate}
                                onDateSelect={setSelectedDate}
                            />

                            {/* Contextual Side Content (Mobile: Below Calendar, Desktop: Sticky Below) */}
                            <div className="mt-8">
                                <SubmitEventWidget />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Events List */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Users className="w-6 h-6 text-cyan-400" />
                                <span>Event Details</span>
                            </h2>
                            {selectedDate && (
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider hover:bg-red-500/20 transition-colors"
                                >
                                    <FilterX className="w-3.5 h-3.5" />
                                    Clear Filter
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="space-y-6 animate-pulse">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-48 rounded-2xl border border-white/5 bg-slate-900/50" />
                                ))}
                            </div>
                        ) : filteredEvents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 text-center">
                                <div className="p-4 rounded-full bg-slate-800/50 mb-4">
                                    <CalendarIcon className="w-8 h-8 text-slate-600" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">No events found</h3>
                                <p className="text-slate-500 max-w-xs mx-auto text-sm">
                                    {selectedDate
                                        ? `There are no events scheduled for ${selectedDate.toLocaleDateString()}.`
                                        : "No upcoming events found. Check back soon!"}
                                </p>
                                {selectedDate && (
                                    <button
                                        onClick={() => setSelectedDate(null)}
                                        className="mt-6 text-cyan-400 font-bold text-xs uppercase tracking-wider hover:text-cyan-300 transition-colors"
                                    >
                                        View all upcoming events
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {filteredEvents.map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3, delay: index * 0.08 }} // Staggered animation
                                            layout
                                        >
                                            <EventCard
                                                heading={event.heading || "Event"}
                                                description={event.description}
                                                date={new Date(event.date)}
                                                imageUrl={event.imageUrl}
                                                imageAlt={event.imageAlt}
                                                eventName={event.eventName}
                                                location={event.location}
                                                time={event.time}
                                                actionLabel={event.actionLabel}
                                                onActionClick={() => handleAddToCalendar(event)}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Bottom Contact Pin --- */}
                <div className="fixed bottom-6 right-6 z-50 hidden md:block">
                    <div className="group flex items-center gap-4 p-2 pl-4 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-xl hover:border-cyan-500/30 transition-all shadow-2xl">
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider group-hover:text-cyan-400 transition-colors">Connect with us</p>
                            <p className="text-xs font-bold text-white">Jonathan Sterritt</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 text-sm">
                            JS
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
