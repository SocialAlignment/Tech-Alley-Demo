"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Image from 'next/image';

interface GenAIRaffleWizardProps {
    onSubmit: (data: RaffleData) => void;
    isSubmitting?: boolean;
    initialValues?: Partial<RaffleData>;
}

export interface RaffleData {
    // New Schema for GenAI Video Production
    projectType: string;
    contentVolume: string;
    assetsReady: boolean; // mapped to "yes"/"no" from UI
    avatarType: string;
    budgetRange: string;
    timeline: string;
}

const INITIAL_DATA: RaffleData = {
    projectType: '',
    contentVolume: '',
    assetsReady: false,
    avatarType: '',
    budgetRange: '',
    timeline: '',
};

const STEPS = [
    { id: 'use-case', title: 'Use Case', description: 'How will you use GenAI Video?' },
    { id: 'requirements', title: 'Scope', description: 'Volume and Tech needs' },
    { id: 'qualification', title: 'Readiness', description: 'Budget and Timeline' },
];

export default function GenAIRaffleWizard({ onSubmit, isSubmitting = false, initialValues }: GenAIRaffleWizardProps) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<RaffleData>({ ...INITIAL_DATA, ...initialValues });

    const updateFields = (fields: Partial<RaffleData>) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) setStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(prev => prev - 1);
    };

    const isStepValid = () => {
        switch (step) {
            case 0: // Use Case
                return !!formData.projectType && !!formData.avatarType;
            case 1: // Scope
                return !!formData.contentVolume;
            case 2: // Qualification
                return !!formData.budgetRange && !!formData.timeline;
            default:
                return false;
        }
    };

    const handleSubmit = () => {
        if (isStepValid()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl relative">

            {/* Header */}
            <div className="bg-slate-900/80 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 opacity-50" />

                <div className="flex items-center gap-5 z-10 w-full md:w-auto">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 shadow-inner shrink-0 backdrop-blur-md">
                        <Image
                            src="/assets/social-alignment-logo-white-transparent.png"
                            alt="Social Alignment"
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain opacity-90"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">GenAI Video Audit</h2>
                        <p className="text-slate-400 text-sm font-medium">Step {step + 1} of {STEPS.length}: <span className="text-indigo-400">{STEPS[step].description}</span></p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center gap-1 group">
                            <div
                                className={cn(
                                    "w-12 h-1.5 rounded-full transition-all duration-500",
                                    i <= step ? "bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" : "bg-slate-800"
                                )}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-10 min-h-[400px] bg-slate-900/50 backdrop-blur-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8 max-w-2xl mx-auto"
                    >
                        {step === 0 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">What is your primary use case?</Label>
                                    <Select
                                        value={formData.projectType}
                                        onValueChange={(val) => updateFields({ projectType: val })}
                                    >
                                        <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-14 text-lg text-slate-200">
                                            <SelectValue placeholder="Select Use Case..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                            {[
                                                'Marketing Campaigns',
                                                'Sales Enablement',
                                                'Internal Training',
                                                'Customer Support',
                                                'Social Content'
                                            ].map(opt => (
                                                <SelectItem key={opt} value={opt} className="focus:bg-slate-800 focus:text-cyan-400 cursor-pointer text-base py-3">
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">What type of avatar do you need?</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { id: 'Stock Avatar', desc: 'Pre-made professional' },
                                            { id: 'Custom Digital Twin', desc: 'Clone of You' },
                                            { id: 'Brand Mascot', desc: 'Stylized character' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => updateFields({ avatarType: opt.id })}
                                                className={cn(
                                                    "p-4 rounded-xl border transition-all text-left space-y-2 hover:bg-slate-800/80 relative overflow-hidden group",
                                                    formData.avatarType === opt.id
                                                        ? "bg-indigo-900/30 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                                                        : "bg-slate-800/30 border-slate-700 hover:border-slate-500"
                                                )}
                                            >
                                                <div className="font-semibold text-slate-200">{opt.id}</div>
                                                <div className="text-xs text-slate-400">{opt.desc}</div>
                                                {formData.avatarType === opt.id && (
                                                    <div className="absolute top-2 right-2 text-indigo-400">
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">Monthly Content Volume</Label>
                                    <p className="text-slate-400 text-sm -mt-2">How many videos do you plan to produce?</p>
                                    <Select
                                        value={formData.contentVolume}
                                        onValueChange={(val) => updateFields({ contentVolume: val })}
                                    >
                                        <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-14 text-lg text-slate-200">
                                            <SelectValue placeholder="Select Volume..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                            {[
                                                'None yet (Just starting)',
                                                '1-4 videos/mo',
                                                '5-10 videos/mo',
                                                '10+ videos/mo'
                                            ].map(opt => (
                                                <SelectItem key={opt} value={opt} className="focus:bg-slate-800 focus:text-cyan-400 cursor-pointer text-base py-3">
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">Assets Status</Label>
                                    <p className="text-slate-400 text-sm -mt-2">Do you have existing brand assets or spokespeople ready?</p>
                                    <div className="flex gap-4">
                                        {['Yes', 'No'].map((opt) => {
                                            const isSelected = (opt === 'Yes' && formData.assetsReady) || (opt === 'No' && !formData.assetsReady);
                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => updateFields({ assetsReady: opt === 'Yes' })}
                                                    className={cn(
                                                        "flex-1 p-4 rounded-xl border text-center font-semibold transition-all hover:bg-slate-800/80",
                                                        isSelected
                                                            ? "bg-indigo-900/30 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                                            : "bg-slate-800/30 border-slate-700 text-slate-400 hover:text-slate-200"
                                                    )}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">Estimated Budget</Label>
                                    <Select
                                        value={formData.budgetRange}
                                        onValueChange={(val) => updateFields({ budgetRange: val })}
                                    >
                                        <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-14 text-lg text-slate-200">
                                            <SelectValue placeholder="Select Budget Range..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                            {[
                                                '<$1k (Pilot)',
                                                '$1k - $5k',
                                                '$5k - $10k',
                                                '$10k+'
                                            ].map(opt => (
                                                <SelectItem key={opt} value={opt} className="focus:bg-slate-800 focus:text-cyan-400 cursor-pointer text-base py-3">
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">Desired Launch Timeline</Label>
                                    <Select
                                        value={formData.timeline}
                                        onValueChange={(val) => updateFields({ timeline: val })}
                                    >
                                        <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-14 text-lg text-slate-200">
                                            <SelectValue placeholder="When do you need this?" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                            {[
                                                'ASAP (<2 weeks)',
                                                '1 Month',
                                                'Q1/Q2',
                                                'Exploratory / No Rush'
                                            ].map(opt => (
                                                <SelectItem key={opt} value={opt} className="focus:bg-slate-800 focus:text-cyan-400 cursor-pointer text-base py-3">
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="bg-slate-900/80 p-6 md:p-8 border-t border-white/5 flex items-center justify-between backdrop-blur-md">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === 0 || isSubmitting}
                    className="text-slate-400 hover:text-white hover:bg-white/5"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                {step === STEPS.length - 1 ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={!isStepValid() || isSubmitting}
                        className={cn(
                            "px-8 py-6 text-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all",
                            isSubmitting && "opacity-80 cursor-not-allowed"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                The Final Step
                                <Sparkles className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        className="px-8 py-6 text-lg bg-white text-slate-900 hover:bg-slate-200 rounded-xl"
                    >
                        Next Step <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                )}
            </div>
        </div>
    );
}
