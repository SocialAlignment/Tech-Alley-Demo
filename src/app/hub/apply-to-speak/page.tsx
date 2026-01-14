'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic2, Loader2, CheckCircle2, Sparkles, User, FileText } from 'lucide-react';
import { useIdentity } from '@/context/IdentityContext';
import clsx from 'clsx';

export default function SpeakerAppPage() {
    const { leadId } = useIdentity();
    const [status, setStatus] = useState('idle');
    const [completed, setCompleted] = useState(false);

    const [formData, setFormData] = useState({
        topic: '',
        experience: '',
        isGuest: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        if (!leadId) {
            alert("Identity not found. Please verify your email.");
            setStatus('idle');
            return;
        }

        try {
            const res = await fetch('/api/update-lead', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    updates: {
                        speakerData: formData, // Send as specific object
                        formType: 'Speaker Application'
                    }
                })
            });

            if (res.ok) {
                setCompleted(true);
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            console.error(error);
            alert("Error submitting application. Please try again.");
            setStatus('idle');
        }
    };

    if (completed) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-6 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-[2.5rem] p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
                >
                    {/* Success Decor */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500" />
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100/50 rounded-full blur-2xl" />

                    <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-purple-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Received</h2>
                    <p className="text-slate-500 mb-8 text-lg">
                        Thanks for your interest in sharing your knowledge.<br />
                        Our team reviews speaker proposals weekly.
                    </p>
                    <button
                        onClick={() => window.location.href = '/hub'}
                        className="px-8 py-3 rounded-xl bg-slate-50 text-slate-700 font-bold hover:bg-slate-100 transition-colors border border-slate-200"
                    >
                        Return to Hub
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center md:text-left"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 shadow-sm border border-indigo-200">
                    <Mic2 size={12} />
                    SPEAKER TRACK
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                    Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Expertise.</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-2xl">
                    Become a voice in the Tech Alley Henderson community. Pitch a talk or join us as a podcast guest.
                </p>
            </motion.div>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
            >
                {/* Decor */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-50/50 via-white to-white rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <div className="space-y-8 relative z-10">

                    <div>
                        <label className="text-sm font-bold text-slate-900 uppercase tracking-wider block mb-3 flex items-center gap-2">
                            <Sparkles size={16} className="text-indigo-500" />
                            Proposed Topic / Title
                        </label>
                        <input
                            type="text" required
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all font-medium text-lg"
                            placeholder="e.g. The Future of AI Agents..."
                            value={formData.topic}
                            onChange={e => setFormData({ ...formData, topic: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-900 uppercase tracking-wider block mb-3 flex items-center gap-2">
                            <FileText size={16} className="text-indigo-500" />
                            Experience & Background
                        </label>
                        <textarea
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all font-medium min-h-[160px] resize-none text-lg"
                            placeholder="Briefly describe your experience or link to past talks..."
                            value={formData.experience}
                            onChange={e => setFormData({ ...formData, experience: e.target.value })}
                        />
                    </div>

                    <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="pt-1 relative">
                                <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={formData.isGuest}
                                    onChange={e => setFormData({ ...formData, isGuest: e.target.checked })}
                                />
                                <div className="w-6 h-6 border-2 border-slate-300 rounded-md bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors flex items-center justify-center">
                                    <CheckCircle2 size={16} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-900 font-bold block text-lg group-hover:text-indigo-700 transition-colors">Interested in being a Podcast Guest?</span>
                                <span className="text-sm text-slate-500 block mt-1">We record live episodes during the event. This is a great way to participate if you don't have a full talk prepared.</span>
                            </div>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-5 rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 mt-4"
                    >
                        {status === 'submitting' ? <Loader2 className="animate-spin w-6 h-6" /> : 'Submit Proposal'}
                    </button>

                </div>
            </motion.form>
        </div>
    );
}
