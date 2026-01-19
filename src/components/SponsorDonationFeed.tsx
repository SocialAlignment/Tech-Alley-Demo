'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';

interface Donation {
    id: string;
    created_at: string;
    donor_name: string;
    amount: number;
    message: string | null;
    avatar_url: string | null;
    is_anonymous: boolean;
}

export default function SponsorDonationFeed() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            const { data, error } = await supabase
                .from('donations')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (!error && data) {
                setDonations(data);
            }
            setLoading(false);
        };

        fetchDonations();

        // Realtime subscription
        const channel = supabase
            .channel('donations-realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'donations'
                },
                (payload) => {
                    const newDonation = payload.new as Donation;
                    setDonations((current) => [newDonation, ...current]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) {
        return <div className="text-center text-slate-500 py-4">Loading supporters...</div>;
    }

    if (donations.length === 0) {
        return (
            <div className="text-center py-8 px-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-slate-400">Be the first to donate and start the momentum!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">●</span> Recent Supporters
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {donations.map((donation) => (
                        <motion.div
                            key={donation.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors"
                        >
                            <div className="shrink-0">
                                {donation.avatar_url ? (
                                    <img
                                        src={donation.avatar_url}
                                        alt={donation.donor_name}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                                        <User size={20} className="text-slate-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-semibold text-white truncate">
                                        {donation.is_anonymous ? 'Anonymous' : donation.donor_name}
                                    </h4>
                                    <span className="font-bold text-emerald-400">
                                        ${donation.amount.toLocaleString()}
                                    </span>
                                </div>
                                {donation.message && (
                                    <p className="text-sm text-slate-300 break-words">
                                        "{donation.message}"
                                    </p>
                                )}
                                <div className="text-xs text-slate-500 mt-2">
                                    {new Date(donation.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
