'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, Star } from 'lucide-react';
import { ExtendedSpeaker } from './SpeakerDrawer';

export type InteractionMode = 'question' | 'feedback';

interface SpeakerInteractionModalProps {
    isOpen: boolean;
    onClose: () => void;
    speaker: ExtendedSpeaker | null;
    initialMode?: InteractionMode;
}

import { useQuestions } from '@/context/QuestionsContext';
import { submitFeedback } from '@/lib/api';

export default function SpeakerInteractionModal({
    isOpen,
    onClose,
    speaker,
    initialMode = 'question'
}: SpeakerInteractionModalProps) {
    const { addQuestion } = useQuestions();
    const [mode, setMode] = useState<InteractionMode>(initialMode);
    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setIsSuccess(false);
            setName('');
            setTopic('');
            setContent('');
        }
    }, [isOpen, initialMode]);

    if (!isOpen || !speaker) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (mode === 'question') {
            addQuestion({
                speakerId: speaker.id,
                from: name || 'Anonymous',
                topic: topic,
                content: content,
            });
        }

        console.log(`Submitting ${mode} for ${speaker.name}:`, { name, topic, content });

        setIsSubmitting(false);
        setIsSuccess(true);

        setTimeout(() => {
            onClose();
        }, 1500);
    };

    const isQuestion = mode === 'question';
    const title = isQuestion ? `Ask ${speaker.name.split(' ')[0]}` : `Feedback for ${speaker.name.split(' ')[0]}`;
    const subtitle = isQuestion
        ? "Submit a question for the live Q&A session."
        : "Share your thoughts or feedback with the speaker.";
    const buttonText = isQuestion ? "Send Question" : "Submit Feedback";
    const Icon = isQuestion ? MessageSquare : Star;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden pointer-events-auto relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            <div className="p-8">
                                {/* Header */}
                                <div className="mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isQuestion ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        <Icon size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                                    <p className="text-slate-400">{subtitle}</p>
                                </div>

                                {isSuccess ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                                        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                                            <Send size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Sent Successfully!</h3>
                                        <p className="text-slate-400">Your {mode} has been received.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Your Name (Optional)</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Anonymous"
                                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Topic</label>
                                            <input
                                                type="text"
                                                required
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                placeholder={isQuestion ? "e.g. Marketing, Growth" : "e.g. Presentation Style, Content"}
                                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                                {isQuestion ? 'Your Question' : 'Your Feedback'}
                                            </label>
                                            <textarea
                                                required
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder={isQuestion ? "Type your question here..." : "Share your thoughts..."}
                                                rows={4}
                                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2
                                                ${isQuestion
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-900/20'
                                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-900/20'
                                                }
                                                text-white`}
                                        >
                                            {isSubmitting ? 'Sending...' : (
                                                <>
                                                    {buttonText} {isQuestion ? <Send size={18} /> : <Star size={18} />}
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
