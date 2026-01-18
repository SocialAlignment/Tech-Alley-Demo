"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader2, Rocket, Globe, BookOpen, BarChart3 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GrantData {
    websiteUrl: string;
    websiteConfidence: string;
    brandStatus: string;
    firstAiContent: string;
    dashboardInterest: string; // "yes" | "no"
    topMetric: string;
    grantIntention: string;
}

const initialData: GrantData = {
    websiteUrl: "",
    websiteConfidence: "",
    brandStatus: "",
    firstAiContent: "",
    dashboardInterest: "",
    topMetric: "",
    grantIntention: ""
};

export default function GrantApplicationWizard({ onSubmit, isSubmitting, initialValues }: { onSubmit: (data: any) => void, isSubmitting: boolean, initialValues?: any }) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<GrantData>({
        ...initialData,
        ...initialValues
    });

    const updateField = (field: keyof GrantData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const steps = [
        { id: 'web', title: 'Web Presence', icon: Globe },
        { id: 'brand', title: 'Brand Context', icon: BookOpen },
        { id: 'dashboard', title: 'CEO Dashboard', icon: BarChart3 },
        { id: 'pitch', title: 'Your Pitch', icon: Rocket }
    ];

    const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

    const StepIcon = steps[step].icon;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            {/* Progress Header */}
            <div className="flex justify-center gap-2 mb-4">
                {steps.map((s, idx) => (
                    <div key={s.id} className={`h-2 rounded-full transition-all duration-500 ${idx <= step ? 'w-12 bg-cyan-500' : 'w-2 bg-cyan-500/20'}`} />
                ))}
            </div>

            <motion.div
                layout
                className="bg-[#0B1120] border border-cyan-500/20 rounded-3xl overflow-hidden shadow-2xl relative"
            >
                <div className="px-8 py-6 border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                            <StepIcon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">{steps[step].title}</h2>
                            <p className="text-cyan-200/60 text-sm mt-1">Innovation Grant Application</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 min-h-[400px]">
                    {step === 0 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-4">
                                <Label className="text-lg">What is your primary website URL?</Label>
                                <Input
                                    className="bg-black/20 border-white/10 h-14 text-lg"
                                    placeholder="https://"
                                    value={formData.websiteUrl}
                                    onChange={(e) => updateField('websiteUrl', e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-lg text-cyan-300">How well does it tell your story? (1-10)</Label>
                                <Select value={formData.websiteConfidence} onValueChange={(v) => updateField('websiteConfidence', v)}>
                                    <SelectTrigger className="bg-black/20 border-white/10 h-14 text-lg">
                                        <SelectValue placeholder="Select confidence level..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">1-3 (Needs immediate Help)</SelectItem>
                                        <SelectItem value="mid">4-7 (It's okay/functional)</SelectItem>
                                        <SelectItem value="high">8-10 (It's a conversion machine)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-4">
                                <Label className="text-lg">Do you have a 'Brand Bible' or documented Voice Guide?</Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {['Yes, fully documented', 'Sort of / In progress', 'No, it\'s all in my head'].map((opt) => (
                                        <div
                                            key={opt}
                                            onClick={() => updateField('brandStatus', opt)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.brandStatus === opt ? 'bg-cyan-500/20 border-cyan-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                                        >
                                            <span className="font-medium">{opt}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-lg text-cyan-300">If AI could perfectly mimic your voice, what would you interpret first?</Label>
                                <Textarea
                                    className="bg-black/20 border-cyan-500/20 focus:border-cyan-500 h-32 text-lg"
                                    placeholder="Emails? Social posts? Blog articles?"
                                    value={formData.firstAiContent}
                                    onChange={(e) => updateField('firstAiContent', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-4">
                                <Label className="text-lg">Are you interested in an AI CEO Dashboard to track your business health?</Label>
                                <div className="flex gap-4">
                                    {['Yes', 'No'].map((opt) => (
                                        <div
                                            key={opt}
                                            onClick={() => updateField('dashboardInterest', opt)}
                                            className={`flex-1 p-6 rounded-xl border cursor-pointer transition-all text-center ${formData.dashboardInterest === opt ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                                        >
                                            <span className="text-xl font-bold">{opt}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {formData.dashboardInterest === 'Yes' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <Label className="text-lg text-blue-300">What is the #1 metric you wish you could see every morning?</Label>
                                    <Input
                                        className="bg-black/20 border-blue-500/20 focus:border-blue-500 h-14 text-lg"
                                        placeholder="e.g. Daily Cash Flow, Lead Velocity..."
                                        value={formData.topMetric}
                                        onChange={(e) => updateField('topMetric', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-4">
                                <Label className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-bold">The Pitch</Label>
                                <p className="text-slate-400">Why should we invest in your transformation with this grant?</p>
                                <Textarea
                                    className="bg-black/20 border-cyan-500/20 focus:border-cyan-500 h-48 text-lg p-6"
                                    placeholder="Tell us about your vision and what's holding you back..."
                                    value={formData.grantIntention}
                                    onChange={(e) => updateField('grantIntention', e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 0}
                        className="text-slate-400 hover:text-white"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>

                    <div className="flex gap-3">
                        {step < steps.length - 1 ? (
                            <Button
                                variant="secondary"
                                onClick={handleNext}
                                className="bg-white/10 text-white hover:bg-white/20 border border-white/10"
                            >
                                Next <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={() => onSubmit(formData)}
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-8 shadow-[0_0_20px_rgba(8,145,178,0.4)]"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
                                Submit Application
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
