import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, X, Users, Building, Mail, Briefcase } from 'lucide-react';
import EmailGeneratorModal from './EmailGeneratorModal';

interface RegistrantsListModalProps {
    isOpen: boolean;
    onClose: () => void;
    leads: any[];
}

export default function RegistrantsListModal({ isOpen, onClose, leads }: RegistrantsListModalProps) {
    // Draft State
    const [generatorOpen, setGeneratorOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<any>(null);

    const handleOpenGenerator = (lead: any) => {
        setSelectedLead(lead);
        setGeneratorOpen(true);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-5xl bg-[#0f111a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                <Users size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Feb Registrants</h2>
                                <div className="text-xs text-slate-400">
                                    Total: {leads.length} Registrants
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
                            <thead className="bg-slate-900/50 sticky top-0 z-10 backdrop-blur-sm">
                                <tr>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800">Name</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800">Company</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800">Role</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800">Contact</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800">Intention</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                                            No registrants found.
                                        </td>
                                    </tr>
                                ) : (
                                    leads.map((lead) => {
                                        const company = lead.company || lead.profile_data?.company || lead.responses?.company || 'N/A';
                                        const role = lead.title || lead.profile_data?.role || lead.responses?.role || 'N/A';
                                        const phone = lead.phone || lead.profile_data?.phone || 'N/A';
                                        const intention = lead.intention || lead.profile_data?.vision || lead.profile_data?.goalForNextMonth || '-';

                                        return (
                                            <tr key={lead.id} className="group hover:bg-slate-800/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-medium text-white">{lead.name}</div>
                                                </td>
                                                <td className="p-4 text-slate-300">
                                                    <div className="flex items-center gap-2">
                                                        <Building size={14} className="text-slate-600" />
                                                        <span className="truncate max-w-[120px]" title={company}>{company}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-300">
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase size={14} className="text-slate-600" />
                                                        <span className="truncate max-w-[120px]" title={role}>{role}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-400 font-mono text-xs">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <Mail size={12} className="text-slate-600" />
                                                            <span className="truncate max-w-[150px]" title={lead.email}>{lead.email}</span>
                                                        </div>
                                                        {phone !== 'N/A' && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-slate-600 text-[10px]">PH:</span>
                                                                <span>{phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-300 text-xs">
                                                    <div className="truncate max-w-[150px] italic text-slate-500" title={intention}>
                                                        "{intention}"
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleOpenGenerator(lead)}
                                                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 p-2 rounded-lg transition-all group-hover:opacity-100 opacity-50"
                                                        title="Generate Intro Email (AI)"
                                                    >
                                                        <Sparkles size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-bold transition-colors text-sm"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>

            <EmailGeneratorModal
                isOpen={generatorOpen}
                onClose={() => setGeneratorOpen(false)}
                lead={selectedLead}
            />
        </>
    );
}
