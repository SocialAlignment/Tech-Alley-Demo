"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ArrowLeft, Check, Sparkles, Building, AlertTriangle, Coins, ScrollText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Image from 'next/image';

interface AIMRIWizardProps {
    onSubmit: (data: MRIResponseData) => void;
    isSubmitting?: boolean;
    initialValues?: Partial<MRIResponseData>;
}

export interface MRIResponseData {
    // Audit / Tech
    monthlySoftwareSpend: string;
    unusedTechTools: string;

    // Leakage / Scale (New Optimization Schema)
    teamSize: string;
    painPoint: string[]; // multi-select
    techStack: string; // Open text
    wasteEstimate: string; // "Lost Hours"
    decisionMaker: string;
    auditGoal: string;
}

const INITIAL_DATA: MRIResponseData = {
    monthlySoftwareSpend: '',
    unusedTechTools: '',
    teamSize: '',
    painPoint: [],
    techStack: '',
    wasteEstimate: '',
    decisionMaker: '',
    auditGoal: '',
};

const STEPS = [
    { id: 'scale', title: 'Scale & Scope', description: 'Team and Tech' },
    { id: 'waste', title: 'The Waste', description: 'Inefficiencies' },
    { id: 'vision', title: 'The Goal', description: 'What matters most' },
];

export default function AIMRIWizard({ onSubmit, isSubmitting = false, initialValues }: AIMRIWizardProps) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<MRIResponseData>({ ...INITIAL_DATA, ...initialValues });

    const updateFields = (fields: Partial<MRIResponseData>) => {
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
            case 0: // Scale
                return !!formData.teamSize && !!formData.decisionMaker;
            case 1: // Waste
                // Checking if at least one pain point is selected and waste estimate exists
                return formData.painPoint.length > 0 && !!formData.wasteEstimate;
            case 2: // Vision
                return !!formData.auditGoal;
            default:
                return false;
        }
    };

    const handleSubmit = () => {
        if (isStepValid()) {
            onSubmit(formData);
        }
    };

    const togglePainPoint = (point: string) => {
        setFormData(prev => {
            const current = prev.painPoint;
            if (current.includes(point)) {
                return { ...prev, painPoint: current.filter(p => p !== point) };
            } else {
                return { ...prev, painPoint: [...current, point] };
            }
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl relative bg-[#0F172A]/80">

            {/* Header */}
            <div className="bg-slate-900/90 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 opacity-50" />

                <div className="flex items-center gap-5 z-10 w-full md:w-auto">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center border border-cyan-500/20 shadow-inner shrink-0 backdrop-blur-md">
                        <Image
                            src="/assets/social-alignment-logo-white-transparent.png"
                            alt="Social Alignment"
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain opacity-90"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Productivity MRI</h2>
                        <p className="text-slate-400 text-sm font-medium">Step {step + 1} of {STEPS.length}: <span className="text-cyan-400">{STEPS[step].description}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center gap-1 group">
                            <div
                                className={cn(
                                    "w-12 h-1.5 rounded-full transition-all duration-500",
                                    i <= step ? "bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "bg-slate-800"
                                )}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-10 min-h-[450px] bg-slate-900/50 backdrop-blur-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8 max-w-2xl mx-auto"
                    >
                        {/* STEP 1: Scale & Scope */}
                        {step === 0 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">How large is your operations/admin team?</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {['1-5', '6-20', '20-50', '50+'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => updateFields({ teamSize: size })}
                                                className={cn(
                                                    "p-4 rounded-xl border text-center font-semibold transition-all hover:bg-slate-800/80 relative overflow-hidden",
                                                    formData.teamSize === size
                                                        ? "bg-cyan-950/40 border-cyan-500 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                                                        : "bg-slate-800/30 border-slate-700 text-slate-400 hover:text-slate-300"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">Are you the decision maker for Tech Ops?</Label>
                                    <Select
                                        value={formData.decisionMaker}
                                        onValueChange={(val) => updateFields({ decisionMaker: val })}
                                    >
                                        <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-14 text-lg text-slate-200">
                                            <SelectValue placeholder="Select Role..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                            {[
                                                'Yes, I approve budget',
                                                'No, I am researching',
                                                'Joint Decision'
                                            ].map(opt => (
                                                <SelectItem key={opt} value={opt} className="focus:bg-slate-800 focus:text-cyan-400 cursor-pointer text-base py-3">
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">Current Monthly Software Spend</Label>
                                    <Select
                                        value={formData.monthlySoftwareSpend}
                                        onValueChange={(val) => updateFields({ monthlySoftwareSpend: val })}
                                    >
                                        <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-14 text-lg text-slate-200">
                                            <SelectValue placeholder="Estimate your spend..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                            {[
                                                '<$100',
                                                '$100 - $500',
                                                '$500 - $2,000',
                                                '$2,000+'
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

                        {/* STEP 2: The Waste */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">Where is your biggest bottleneck?</Label>
                                    <p className="text-slate-400 text-sm -mt-2">Select all that apply.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            'Lead Follow-up / Sales',
                                            'Employee Fulfillment',
                                            'Data Entry / Admin',
                                            'Reporting / Analytics',
                                            'Customer Support'
                                        ].map((pain) => {
                                            const isSelected = formData.painPoint.includes(pain);
                                            return (
                                                <div
                                                    key={pain}
                                                    onClick={() => togglePainPoint(pain)}
                                                    className={cn(
                                                        "flex items-center p-4 rounded-xl border cursor-pointer transition-all hover:bg-slate-800/80",
                                                        isSelected
                                                            ? "bg-red-900/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                                                            : "bg-slate-800/30 border-slate-700"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors",
                                                        isSelected ? "bg-red-500 border-red-500 text-white" : "border-slate-500 bg-transparent"
                                                    )}>
                                                        {isSelected && <Check className="w-3 h-3" />}
                                                    </div>
                                                    <span className={cn("font-medium", isSelected ? "text-red-100" : "text-slate-300")}>{pain}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">Technically speaking...</Label>
                                    <div className="space-y-3">
                                        <Input
                                            placeholder="What tools are central to your stack? (e.g. Salesforce, Asana...)"
                                            value={formData.techStack}
                                            onChange={(e) => updateFields({ techStack: e.target.value })}
                                            className="bg-slate-800/50 border-slate-700 h-14 text-lg text-slate-200 focus:border-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <Label className="text-lg font-medium text-slate-200">How many hours are wasted weekly?</Label>
                                    <Select
                                        value={formData.wasteEstimate}
                                        onValueChange={(val) => updateFields({ wasteEstimate: val })}
                                    >
                                        <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-14 text-lg text-slate-200">
                                            <SelectValue placeholder="Estimate lost time..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                            {[
                                                '<10h',
                                                '10-40h (1 FTE)',
                                                '40h+ (Multiple FTEs)'
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

                        {/* STEP 3: Vision */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="bg-cyan-900/20 border border-cyan-500/30 p-6 rounded-2xl">
                                    <h3 className="text-xl font-bold text-cyan-200 mb-2 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" /> The Opportunity
                                    </h3>
                                    <p className="text-cyan-100/70 text-sm leading-relaxed">
                                        Based on your team size of <span className="text-white font-semibold">{formData.teamSize}</span> and wasted hours,
                                        we can likely reclaim significant revenue. Let's define the win.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">What is your #1 goal for this audit?</Label>
                                    <Textarea
                                        placeholder="I want to see exactly where we are losing money..."
                                        value={formData.auditGoal}
                                        onChange={(e) => updateFields({ auditGoal: e.target.value })}
                                        className="bg-slate-800/50 border-slate-700 min-h-[160px] text-lg text-slate-200 focus:border-cyan-500 p-4"
                                    />
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
                            "px-8 py-6 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-cyan-500/25 transition-all",
                            isSubmitting && "opacity-80 cursor-not-allowed"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                Generate Audit Report
                                <ScrollText className="ml-2 h-5 w-5" />
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
