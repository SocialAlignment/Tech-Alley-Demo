"use client";

import { useEffect, useState } from 'react';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';

interface AgendaItem {
    id: string;
    time: string;
    event: string;
    desc: string;
}

export default function AgendaPage() {
    const [agenda, setAgenda] = useState<AgendaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        Tonight's Agenda
                    </h1>
                    <p className="text-slate-400">Stay on track with everything happening tonight.</p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden">
                    {/* Access Granted Badge/Deco (Optional, keeping simple for now) */}

                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-xl text-slate-800">Schedule</h3>
                        <span className="p-2 bg-slate-50 rounded-full text-slate-400"><Calendar size={20} /></span>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            <p className="text-slate-400 text-sm">Syncing schedule...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-2 text-center">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                            <p className="text-slate-600 font-medium">{error}</p>
                            <p className="text-xs text-slate-400">Please try refreshing the page.</p>
                        </div>
                    ) : agenda.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <p>No agenda items found for tonight.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {agenda.map((item) => (
                                <div key={item.id} className="flex gap-6 items-start group">
                                    <span className="text-sm font-bold text-slate-400 w-16 pt-1 whitespace-nowrap">{item.time}</span>
                                    <div className="flex-1 p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors border border-slate-100 group-hover:border-blue-100">
                                        <h4 className="font-bold text-slate-800 group-hover:text-blue-700 mb-1">{item.event}</h4>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
