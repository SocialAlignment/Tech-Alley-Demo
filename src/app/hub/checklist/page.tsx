'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';
import { Check, Mic2, ArrowRight, CheckSquare } from 'lucide-react';

const CHECKLIST_ITEMS = [
    { id: 'connect', label: 'Connect with 3 New People', points: 10 },
    { id: 'scan', label: 'Scan The QR Code at Registration', points: 5 },
    { id: 'survey', label: 'Complete the "Help Us Help You" Survey', points: 15 },
    { id: 'linkedin', label: 'Follow Tech Alley Henderson on LinkedIn', points: 5 },
    { id: 'spotlight', label: 'Visit the Startup Spotlight', points: 10 },
    { id: 'speaker', label: 'Ask a Question During Q&A', points: 20 },
    { id: 'giveaway', label: 'Enter the $1,500 Audit Giveaway', points: 25 },
];

export default function ChecklistPage() {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const toggleItem = (id: string) => {
        const next = new Set(checkedItems);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setCheckedItems(next);
    };

    const progress = Math.round((checkedItems.size / CHECKLIST_ITEMS.length) * 100);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">

            {/* --- CENTER COLUMN (Main Content) --- */}
            <div className="lg:col-span-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Your Companion</h1>
                        <p className="text-slate-500">Complete tasks to unlock perks.</p>
                    </div>
                </div>

                {/* Progress Card */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
                    <div className="flex justify-between items-end mb-3">
                        <div>
                            <span className="text-4xl font-bold text-slate-900">{progress}%</span>
                            <span className="text-slate-400 text-sm ml-2">Completed</span>
                        </div>
                        <div className="text-sm text-purple-600 font-bold bg-purple-50 px-3 py-1 rounded-full">
                            {checkedItems.size} / {CHECKLIST_ITEMS.length} Tasks
                        </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-4">
                    {CHECKLIST_ITEMS.map((item) => {
                        const isChecked = checkedItems.has(item.id);
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`
                                    group p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4
                                    ${isChecked
                                        ? 'bg-purple-50 border-purple-100'
                                        : 'bg-white border-slate-100 hover:border-purple-200 hover:shadow-sm'
                                    }
                                `}
                                onClick={() => toggleItem(item.id)}
                            >
                                <div className={`
                                    w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors
                                    ${isChecked
                                        ? 'bg-purple-500 border-purple-500 text-white'
                                        : 'border-slate-300 text-transparent group-hover:border-purple-300'
                                    }
                                `}>
                                    <Check size={14} strokeWidth={3} />
                                </div>

                                <div className="flex-1">
                                    <h3 className={`font-bold transition-colors ${isChecked ? 'text-purple-900 line-through decoration-purple-300' : 'text-slate-800'}`}>
                                        {item.label}
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        {isChecked ? 'Completed!' : `Tap to complete (+${item.points} XP)`}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* --- RIGHT COLUMN (Widgets) --- */}
            <div className="lg:col-span-4 space-y-6">

                {/* User Profile Widget */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                            TA
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">My Profile</h3>
                            <p className="text-xs text-slate-400">Manage your networking</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600 text-sm font-medium">
                            <span>Track Activity</span>
                            <span className="bg-white px-2 py-1 rounded-md text-xs shadow-sm text-slate-400">Settings</span>
                        </button>
                    </div>
                </motion.div>

                {/* Quick Access Widgets */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-2">Quick Access</h3>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-[2rem] p-6 text-white cursor-pointer hover:shadow-lg hover:shadow-indigo-200 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                            <Mic2 size={20} />
                        </div>
                        <h4 className="font-bold text-lg mb-1">Feedback</h4>
                        <p className="text-indigo-100 text-xs opacity-80">Help us improve</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-[#A855F7] to-[#9333EA] rounded-[2rem] p-6 text-white cursor-pointer hover:shadow-lg hover:shadow-purple-200 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                            <ArrowRight size={20} />
                        </div>
                        <h4 className="font-bold text-lg mb-1">Companion App</h4>
                        <p className="text-purple-100 text-xs opacity-80">Checklist & Progress</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
