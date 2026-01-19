"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ArrowLeft, Check, LayoutDashboard, LineChart, Gauge, Target, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Image from 'next/image';

interface DashboardResponseData {
    // Current State
    currentReporting: string;
    dataSources: string[];

    // The Gap
    blindSpots: string;
    updateFreq: string;

    // Vision
    primaryUser: string;
}

const INITIAL_DATA: DashboardResponseData = {
    currentReporting: '',
    dataSources: [],
    blindSpots: '',
    updateFreq: '',
    primaryUser: '',
};

const STEPS = [
    { id: 'state', title: 'Current State', description: 'How you track now' },
    { id: 'gap', title: 'The Gap', description: 'What is missing' },
    { id: 'vision', title: 'The Vision', description: 'Who needs to see it' },
];

interface AIExecutiveDashboardWizardProps {
    onSubmit: (data: DashboardResponseData) => void;
    isSubmitting?: boolean;
    initialValues?: Partial<DashboardResponseData>;
}

export default function AIExecutiveDashboardWizard({ onSubmit, isSubmitting = false, initialValues }: AIExecutiveDashboardWizardProps) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<DashboardResponseData>({ ...INITIAL_DATA, ...initialValues });

    const updateFields = (fields: Partial<DashboardResponseData>) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    const toggleDataSource = (source: string) => {
        setFormData(prev => {
            const current = prev.dataSources;
            if (current.includes(source)) {
                return { ...prev, dataSources: current.filter(s => s !== source) };
            } else {
                return { ...prev, dataSources: [...current, source] };
            }
        });
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) setStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(prev => prev - 1);
    };

    const isStepValid = () => {
        switch (step) {
            case 0: // Current State
                return !!formData.currentReporting && formData.dataSources.length > 0;
            case 1: // The Gap
                return !!formData.blindSpots && !!formData.updateFreq;
            case 2: // Vision
                return !!formData.primaryUser;
            default:
                return false;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl relative bg-[#0F172A]/80">

            {/* Header */}
            <div className="bg-slate-900/90 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-50" />

                <div className="flex items-center gap-5 z-10 w-full md:w-auto">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center border border-violet-500/20 shadow-inner shrink-0 backdrop-blur-md">
                        <LayoutDashboard className="w-8 h-8 text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Executive Dashboard</h2>
                        <p className="text-slate-400 text-sm font-medium">Step {step + 1} of {STEPS.length}: <span className="text-violet-400">{STEPS[step].description}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center gap-1 group">
                            <div
                                className={cn(
                                    "w-12 h-1.5 rounded-full transition-all duration-500",
                                    i <= step ? "bg-gradient-to-r from-violet-400 to-fuchsia-500 shadow-[0_0_10px_rgba(167,139,250,0.5)]" : "bg-slate-800"
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
                        {/* STEP 1: Current State */}
                        {step === 0 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">How do you currently track KPIs?</Label>
                                    <Select
                                        value={formData.currentReporting}
                                        onValueChange={(val) => updateFields({ currentReporting: val })}
                                    >
                                        <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-14 text-lg text-slate-200">
                                            <SelectValue placeholder="Select Method..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                            {[
                                                'Spreadsheets (Excel/Sheets)',
                                                'Manual Reports (PDF/Docs)',
                                                'CRM Dashboards (HubSpot/Salesforce)',
                                                'We don\'t track consistent KPIs'
                                            ].map(opt => (
                                                <SelectItem key={opt} value={opt} className="focus:bg-slate-800 focus:text-violet-400 cursor-pointer text-base py-3">
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">Where does your data live? (Select all)</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            'Salesforce / HubSpot',
                                            'QuickBooks / Xero',
                                            'Google Analytics / Ads',
                                            'Custom SQL / Database',
                                            'Spreadsheets / CSVs'
                                        ].map((source) => {
                                            const isSelected = formData.dataSources.includes(source);
                                            return (
                                                <div
                                                    key={source}
                                                    onClick={() => toggleDataSource(source)}
                                                    className={cn(
                                                        "flex items-center p-4 rounded-xl border cursor-pointer transition-all hover:bg-slate-800/80",
                                                        isSelected
                                                            ? "bg-violet-900/20 border-violet-500/50 shadow-[0_0_15px_rgba(167,139,250,0.15)]"
                                                            : "bg-slate-800/30 border-slate-700"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors",
                                                        isSelected ? "bg-violet-500 border-violet-500 text-white" : "border-slate-500 bg-transparent"
                                                    )}>
                                                        {isSelected && <Check className="w-3 h-3" />}
                                                    </div>
                                                    <span className={cn("font-medium", isSelected ? "text-violet-100" : "text-slate-300")}>{source}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: The Gap */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">What metric do you wish you saw daily but don't?</Label>
                                    <Textarea
                                        placeholder="e.g. Real-time Lead Velocity, Daily Cash Flow, Net Retention..."
                                        value={formData.blindSpots}
                                        onChange={(e) => updateFields({ blindSpots: e.target.value })}
                                        className="bg-slate-800/50 border-slate-700 min-h-[120px] text-lg text-slate-200 focus:border-violet-500 p-4"
                                    />
                                    <p className="text-xs text-slate-500">This helps us identify your biggest blind spot.</p>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <Label className="text-lg font-medium text-slate-200">How 'live' does the data need to be?</Label>
                                    <Select
                                        value={formData.updateFreq}
                                        onValueChange={(val) => updateFields({ updateFreq: val })}
                                    >
                                        <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-14 text-lg text-slate-200">
                                            <SelectValue placeholder="Select Frequency..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                            {[
                                                'Real-time (Streaming)',
                                                'Daily Updates (Morning Report)',
                                                'Weekly / Monthly Reporting'
                                            ].map(opt => (
                                                <SelectItem key={opt} value={opt} className="focus:bg-slate-800 focus:text-violet-400 cursor-pointer text-base py-3">
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
                                <div className="bg-violet-900/20 border border-violet-500/30 p-6 rounded-2xl">
                                    <h3 className="text-xl font-bold text-violet-200 mb-2 flex items-center gap-2">
                                        <Target className="w-5 h-5" /> Design Audience
                                    </h3>
                                    <p className="text-violet-100/70 text-sm leading-relaxed">
                                        Dashboards for CEOs look very different from dashboards for Ops teams.
                                        Knowing the primary audience ensures we build the right view.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">Who is the primary audience for this dashboard?</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            'CEO / Founder',
                                            'Board / Investors',
                                            'Department Heads',
                                            'Entire Team (TV Screen)'
                                        ].map((user) => (
                                            <button
                                                key={user}
                                                onClick={() => updateFields({ primaryUser: user })}
                                                className={cn(
                                                    "p-4 rounded-xl border text-center font-semibold transition-all hover:bg-slate-800/80 relative overflow-hidden",
                                                    formData.primaryUser === user
                                                        ? "bg-violet-950/40 border-violet-500 text-violet-200 shadow-[0_0_15px_rgba(167,139,250,0.15)]"
                                                        : "bg-slate-800/30 border-slate-700 text-slate-400 hover:text-slate-300"
                                                )}
                                            >
                                                {user}
                                            </button>
                                        ))}
                                    </div>
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
                        onClick={() => onSubmit(formData)}
                        disabled={!isStepValid() || isSubmitting}
                        className={cn(
                            "px-8 py-6 text-lg bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-400 hover:to-fuchsia-500 text-white rounded-xl shadow-lg shadow-violet-500/25 transition-all",
                            isSubmitting && "opacity-80 cursor-not-allowed"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Designing...
                            </>
                        ) : (
                            <>
                                Build My Dashboard View
                                <Eye className="ml-2 h-5 w-5" />
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
