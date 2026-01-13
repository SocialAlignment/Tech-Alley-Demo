'use client';

import { Suspense, useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import RaffleWheel from '@/components/RaffleWheel';

interface Lead {
    id: string;
    name: string;
    company: string;
    interest: string;
    isQualified: boolean;
}

export default function AdminPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [wheelMode, setWheelMode] = useState(false);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/leads');
            const data = await res.json();
            if (data.success) {
                setLeads(data.leads);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
        // Poll every 10 seconds for live updates
        const interval = setInterval(fetchLeads, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#9d4edd] to-[#e0aaff] bg-clip-text text-transparent">
                            God Mode
                        </h1>
                        <p className="text-gray-400">Tech Alley Henderson | Control Center</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={fetchLeads}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                        <button className="bg-[#9d4edd] hover:bg-[#7b2cbf] px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-lg shadow-purple-500/20">
                            Trigger 9PM SMS
                        </button>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Live Data */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="glass-panel p-6 border border-white/10 rounded-2xl">
                            <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
                                <span>Live Leads Feed</span>
                                <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400">{leads.length} Total</span>
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-gray-500 border-b border-white/10">
                                        <tr>
                                            <th className="pb-3">Name</th>
                                            <th className="pb-3">Company</th>
                                            <th className="pb-3">Interest / Goal</th>
                                            <th className="pb-3 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {loading && leads.length === 0 ? (
                                            <tr><td colSpan={4} className="py-8 text-center text-gray-500">Loading live data...</td></tr>
                                        ) : leads.map((lead) => (
                                            <tr key={lead.id} className="group hover:bg-white/5 transition-colors">
                                                <td className="py-3 font-medium">{lead.name}</td>
                                                <td className="py-3 text-gray-400">{lead.company}</td>
                                                <td className="py-3 text-gray-400 truncate max-w-[200px]">{lead.interest}</td>
                                                <td className="py-3 text-right">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-[10px] uppercase font-bold ${lead.isQualified ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                        {lead.isQualified ? 'Entered' : 'Viewed'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: The Stage */}
                    <div className="lg:col-span-1 space-y-8">
                        <section className="glass-panel p-6 border border-[#9d4edd]/30 rounded-2xl bg-gradient-to-br from-black to-[#240046]/50 sticky top-8">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="text-2xl">🎡</span> The Wheel
                            </h2>

                            {wheelMode ? (
                                <div className="mb-4">
                                    <RaffleWheel candidates={leads.filter(l => l.isQualified).map(l => l.name)} />
                                </div>
                            ) : (
                                <div className="aspect-square bg-black/50 rounded-xl flex items-center justify-center border border-white/10 mb-4 flex-col gap-2 p-4 text-center">
                                    <p className="text-gray-300 font-bold">Ready to Draw?</p>
                                    <p className="text-gray-500 text-xs text-balance">
                                        {leads.filter(l => l.isQualified).length} Qualified Entrants Found
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setWheelMode(!wheelMode)}
                                    className="bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors col-span-2"
                                >
                                    {wheelMode ? 'Hide Wheel' : 'Launch Big Screen Mode'}
                                </button>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
