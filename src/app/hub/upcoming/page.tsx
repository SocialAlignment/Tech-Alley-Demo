'use client';

import { useState, useEffect } from 'react';
import { EventCard, EventCardProps } from '@/components/ui/event-card';

import { Calendar } from 'lucide-react';

export default function UpcomingEventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
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
        // Simple Google Calendar Link generation
        // Format: https://www.google.com/calendar/render?action=TEMPLATE&text=Your+Event+Name&dates=20140127T224000Z/20140320T221500Z&details=For+details,+link+here:+http://www.example.com&location=Waldorf+Astoria,+301+Park+Ave+,+New+York,+NY+10022&sf=true&output=xml

        const startDate = new Date(event.date);
        const endDate = new Date(startDate.getTime() + (60 * 60 * 1000)); // Default 1 hour duration

        const formatTime = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.eventName)}&dates=${formatTime(startDate)}/${formatTime(endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent("Tech Alley Henderson")}`;

        window.open(url, '_blank');
    };

    return (
        <div className="h-full w-full p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="inline-flex items-center gap-3 p-3 bg-blue-50 rounded-2xl mb-4">
                    <div className="p-2 bg-blue-100 rounded-xl">
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Upcoming Events
                        </h1>
                        <p className="text-sm text-slate-500">
                            See what's happening next at Tech Alley Henderson.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-96 bg-slate-100 rounded-2xl"></div>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        No upcoming events found. Check back soon!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                heading={event.heading}
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
