'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic2, Loader2, CheckCircle2 } from 'lucide-react';
import { useIdentity } from '@/context/IdentityContext';

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
            <div className="max-w-2xl mx-auto py-20 px-6 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-b from-[#240046] to-black border border-[#9d4edd] p-12 rounded-3xl"
                >
                    <div className="w-20 h-20 bg-[#9d4edd] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Application Received</h2>
                    <p className="text-gray-300 mb-6">
                        Thanks for your interest in sharing your knowledge.<br />
                        Our team reviews speaker proposals weekly.
                    </p>
                    <button onClick={() => window.location.href = '/hub'} className="text-[#9d4edd] hover:text-white underline transition-colors">
                        Return to Hub
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <div className="mb-8 text-center">
                <Mic2 className="w-12 h-12 text-[#9d4edd] mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Speaker Application</h1>
                <p className="text-gray-400">Share your expertise with the Tech Alley community.</p>
            </div>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 border border-white/10 p-8 rounded-3xl space-y-6"
            >
                <div>
                    <label className="label-text">Proposed Topic / Title</label>
                    <input
                        type="text" required
                        className="input-field"
                        placeholder="e.g. valid use cases for AI agents..."
                        value={formData.topic}
                        onChange={e => setFormData({ ...formData, topic: e.target.value })}
                    />
                </div>

                <div>
                    <label className="label-text">Previous Speaking Experience</label>
                    <textarea
                        required
                        className="input-field h-32 resize-none"
                        placeholder="Briefly describe your experience or link to past talks..."
                        value={formData.experience}
                        onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    />
                </div>

                <div className="pt-4 border-t border-white/10">
                    <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="pt-1">
                            <input
                                type="checkbox"
                                className="w-6 h-6 rounded border-white/30 bg-black/50 checked:bg-[#9d4edd] transition-colors"
                                checked={formData.isGuest}
                                onChange={e => setFormData({ ...formData, isGuest: e.target.checked })}
                            />
                        </div>
                        <div>
                            <span className="text-white font-medium block group-hover:text-[#9d4edd] transition-colors">Interested in being a Podcast Guest?</span>
                            <span className="text-sm text-gray-500 block">We also record live episodes at the event.</span>
                        </div>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-gradient-to-r from-[#9d4edd] to-[#7b2cbf] text-white py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(157,78,221,0.5)] transition-all flex justify-center items-center gap-2 disabled:opacity-70 mt-8"
                >
                    {status === 'submitting' ? <Loader2 className="animate-spin" /> : 'Submit Proposal'}
                </button>

            </motion.form>

            <style jsx>{`
                .label-text {
                    display: block;
                    font-size: 0.875rem;
                    color: #d1d5db;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }
                .input-field {
                    width: 100%;
                    background: rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0.75rem;
                    padding: 0.75rem 1rem;
                    color: white;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-field:focus {
                    border-color: #9d4edd;
                    box-shadow: 0 0 0 2px rgba(157, 78, 221, 0.2);
                }
            `}</style>
        </div>
    );
}
