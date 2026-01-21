import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Copy, ExternalLink, Sparkles, RefreshCw, Send, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

interface EmailGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: any;
}

type Step = 'setup' | 'generating' | 'review';

export default function EmailGeneratorModal({ isOpen, onClose, lead }: EmailGeneratorModalProps) {
    const [step, setStep] = useState<Step>('setup');
    const [topic, setTopic] = useState('');
    const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Editor State
    const [editedSubject, setEditedSubject] = useState('');
    const [editedBody, setEditedBody] = useState('');

    // Reset state when modal opens with a new lead
    useEffect(() => {
        if (isOpen && lead) {
            setStep('setup');
            setTopic('');
            setDraft(null);
            setEditedSubject('');
            setEditedBody('');
        }
    }, [isOpen, lead]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setStep('generating');

        try {
            const response = await axios.post('/api/admin/generate-email', {
                leadId: lead.id,
                topic: topic
            });

            if (response.data.success) {
                const { subject, body } = response.data.draft;
                setDraft({ subject, body });
                setEditedSubject(subject);
                setEditedBody(body);
                setStep('review');
            } else {
                alert('Generation failed: ' + response.data.error);
                setStep('setup');
            }
        } catch (error) {
            console.error('Generation Error:', error);
            alert('Failed to generate draft.');
            setStep('setup');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        const fullText = `Subject: ${editedSubject}\n\n${editedBody}`;
        navigator.clipboard.writeText(fullText);
    };

    const handleOpenMail = () => {
        const mailtoLink = `mailto:${lead.email}?subject=${encodeURIComponent(editedSubject)}&body=${encodeURIComponent(editedBody)}`;
        window.open(mailtoLink, '_blank');
    };

    const renderLeadSummary = () => {
        if (!lead) return null;

        let profile = {};
        try {
            profile = typeof lead.profile_data === 'string' ? JSON.parse(lead.profile_data) : lead.profile_data || {};
        } catch (e) { console.error("Parse Error", e); }

        // @ts-ignore
        const helpStatement = profile.coreAlignmentStatement || profile.helpStatement || `Helping ${profile.targetAudience} solve ${profile.problemSolved}`;

        return (
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-3 mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {lead.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-white font-semibold">{lead.name}</h4>
                        <p className="text-slate-400 text-sm">{lead.title || 'Professional'} @ {lead.company || 'Unknown Co'}</p>
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-700/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Core Alignment</p>
                    <p className="text-slate-200 text-sm italic">"{helpStatement}"</p>
                </div>

                {/* @ts-ignore */}
                {profile.vision && (
                    <div className="pt-2 border-t border-slate-700/50">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">90-Day Vision</p>
                        {/* @ts-ignore */}
                        <p className="text-slate-300 text-sm">{profile.vision}</p>
                    </div>
                )}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-white">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        {step === 'setup' ? 'AI Email Generator' : step === 'generating' ? 'Writing...' : 'Review Draft'}
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 'setup' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            {renderLeadSummary()}

                            <div className="space-y-3">
                                <Label className="text-slate-300">Focus Topic / Theme (Optional)</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="e.g. Intro to Hoz, Invite to Podcast, Ask about their Vision..."
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white pr-10"
                                    />
                                    <Sparkles className="absolute right-3 top-2.5 w-4 h-4 text-purple-500/50" />
                                </div>
                                <p className="text-xs text-slate-500">
                                    Leave empty for a standard "Founder Intro" based on their profile data.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'generating' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center animate-in zoom-in-95 duration-500">
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                                <Loader2 className="w-12 h-12 text-purple-400 animate-spin relative z-10" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Using Perplexity Integration...</h3>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">
                                    Analyzing {lead?.name}'s profile, alignment, and vision to craft a personalized intro.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'review' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs uppercase tracking-wider">Subject Line</Label>
                                <Input
                                    value={editedSubject}
                                    onChange={(e) => setEditedSubject(e.target.value)}
                                    className="bg-slate-900 border-slate-700 font-medium text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs uppercase tracking-wider">Email Body</Label>
                                <Textarea
                                    value={editedBody}
                                    onChange={(e) => setEditedBody(e.target.value)}
                                    className="bg-slate-900 border-slate-700 min-h-[300px] text-slate-200 font-mono text-sm leading-relaxed"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-800 flex justify-between items-center">
                    {step === 'setup' && (
                        <div className="flex justify-end gap-2 w-full">
                            <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">Cancel</Button>
                            <Button
                                onClick={handleGenerate}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Draft
                            </Button>
                        </div>
                    )}

                    {step === 'review' && (
                        <div className="flex justify-between w-full items-center">
                            <Button
                                variant="ghost"
                                onClick={() => setStep('setup')}
                                className="text-slate-400 hover:text-white text-xs"
                            >
                                <ChevronRight className="w-4 h-4 mr-1 rotate-180" /> Back to Setup
                            </Button>

                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleCopy} className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                </Button>
                                <Button onClick={handleOpenMail} className="bg-white text-black hover:bg-slate-200 font-bold">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Open Mail App
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
