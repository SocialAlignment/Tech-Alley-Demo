import { motion } from 'framer-motion';
import { X, Ticket, Trophy } from 'lucide-react';

interface RaffleEntriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    entries: any[];
}

export default function RaffleEntriesModal({ isOpen, onClose, entries }: RaffleEntriesModalProps) {
    if (!isOpen) return null;

    // Calculate total entries
    const totalEntries = entries.reduce((sum, entry) => sum + (entry.entries_count || 1), 0);
    const sortedEntries = [...entries].sort((a, b) => (b.entries_count || 1) - (a.entries_count || 1));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-[#0f111a] border border-blue-900/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-blue-900/30 flex justify-between items-center bg-blue-950/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <Ticket size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Raffle Entries</h2>
                            <div className="text-xs text-blue-300/60">
                                {entries.length} Entrants • {totalEntries} Total Tickets
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0a0e12] sticky top-0 z-10 border-b border-blue-900/30">
                            <tr>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-blue-300/50">Rank</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-blue-300/50">Name</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-blue-300/50 text-right">Entries</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-900/10">
                            {sortedEntries.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-500 italic">
                                        No entries found.
                                    </td>
                                </tr>
                            ) : (
                                sortedEntries.map((entry, index) => (
                                    <tr key={entry.id} className="group hover:bg-blue-900/10 transition-colors">
                                        <td className="p-4 w-16 text-slate-500 font-mono text-xs">
                                            {index === 0 ? <Trophy size={14} className="text-yellow-400" /> : `#${index + 1}`}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-white group-hover:text-blue-200 transition-colors">
                                                {entry.name}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-mono text-sm font-bold border border-blue-500/20">
                                                {entry.entries_count || 1}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-blue-900/30 bg-[#0a0e12] flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-bold transition-colors text-sm"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
