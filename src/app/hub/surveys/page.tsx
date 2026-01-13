'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useIdentity } from '@/context/IdentityContext';

export default function SurveysPage() {
    const [feedback, setFeedback] = useState('');
    const [status, setStatus] = useState('idle'); // idle | submitting | success
    const { leadId } = useIdentity();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        if (!leadId) {
            alert("Identity not found. Please rescan QR code.");
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
                        eventFeedback: feedback
                    }
                })
            });

            if (res.ok) {
                setStatus('success');
            } else {
                throw new Error('Failed');
            }
        } catch (e) {
            console.error(e);
            alert('Error submitting feedback.');
            setStatus('idle');
        }
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold mb-2">Event <span className="gradient-text">Feedback</span></h1>
                <p className="text-gray-400">Help us improve Tech Alley Henderson.</p>
            </motion.div>

            {status === 'success' ? (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel p-8 text-center flex flex-col items-center justify-center min-h-[300px]"
                >
                    <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                    <p className="text-gray-400">Your feedback has been recorded directly to your profile.</p>
                </motion.div>
            ) : (
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 space-y-6"
                >
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <MessageSquare size={16} className="text-primary" />
                            Your Thoughts on Tonight's Event
                        </label>
                        <textarea
                            required
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 min-h-[150px] focus:outline-none focus:border-primary text-white placeholder:text-gray-600 resize-none focus:ring-1 focus:ring-primary/50 transition-all"
                            placeholder="What did you enjoy? What can we do better?"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        {status === 'submitting' ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                        {status === 'submitting' ? 'Sending...' : 'Submit Feedback'}
                    </button>
                </motion.form>
            )}
        </div>
    );
}
