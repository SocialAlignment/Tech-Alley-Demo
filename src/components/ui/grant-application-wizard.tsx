"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader2, Rocket, Building, Users, Wallet, CheckCircle2, FileCheck, Scale, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useIdentity } from '@/context/IdentityContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface GrantData {
    companyName: string;
    ein: string;
    naics: string;
    employeeCount: string; // W2 Full Time
    traineeCount: string;
    trainingNeed: string;
    trainingProvider: string;
    totalCost: string;
    employerContribution: string; // "10%", "25%", "50%"
    outcomes: string[]; // multi-select
    certification: boolean;
}

const initialData: GrantData = {
    companyName: "",
    ein: "",
    naics: "",
    employeeCount: "",
    traineeCount: "",
    trainingNeed: "",
    trainingProvider: "Social Alignment / Tech Alley",
    totalCost: "",
    employerContribution: "",
    outcomes: [],
    certification: false
};

const STEPS = [
    { id: 'eligibility', title: 'Eligibility', icon: Building, description: 'Business Details' },
    { id: 'scope', title: 'Scope', icon: Users, description: 'Training Plan' },
    { id: 'budget', title: 'Budget', icon: Wallet, description: 'Costs & Match' },
    { id: 'cert', title: 'Certification', icon: FileCheck, description: 'Final Review' }
];

export default function GrantApplicationWizard({ onSubmit, isSubmitting, initialValues }: { onSubmit: (data: any) => void, isSubmitting: boolean, initialValues?: any }) {
    const [step, setStep] = useState(0);
    const { leadId, userName } = useIdentity();
    const [formData, setFormData] = useState<GrantData>({
        ...initialData,
        ...initialValues
    });

    const updateField = (field: keyof GrantData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleOutcome = (outcome: string) => {
        setFormData(prev => {
            const current = prev.outcomes || [];
            if (current.includes(outcome)) {
                return { ...prev, outcomes: current.filter(o => o !== outcome) };
            } else {
                return { ...prev, outcomes: [...current, outcome] };
            }
        });
    };

    const handleNext = () => setStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

    const isStepValid = () => {
        switch (step) {
            case 0: // Eligibility
                return formData.companyName.length > 2 && formData.ein.length > 5 && !!formData.employeeCount;
            case 1: // Scope
                return !!formData.traineeCount && formData.trainingNeed.length > 10;
            case 2: // Budget
                return !!formData.totalCost && !!formData.employerContribution;
            case 3: // Cert
                return formData.certification && formData.outcomes.length > 0;
            default:
                return false;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl relative bg-[#0F172A]/80">
            {/* Header */}
            <div className="bg-slate-900/90 px-8 py-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 opacity-50" />

                <div className="flex items-center gap-5 z-10 w-full md:w-auto">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner shrink-0 backdrop-blur-md">
                        <Scale className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">IWT Grant Application</h2>
                        <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                            Step {step + 1}: <span className="text-emerald-400">{STEPS[step].description}</span>
                            {leadId && <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-500">Autofill Active</span>}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center gap-1 group">
                            <div
                                className={cn(
                                    "w-12 h-1.5 rounded-full transition-all duration-500",
                                    i <= step ? "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-slate-800"
                                )}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-8 min-h-[450px] bg-slate-900/50 backdrop-blur-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-3xl mx-auto"
                    >
                        {step === 0 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <Label className="text-lg font-medium text-slate-200">Legal Business Name</Label>
                                        <Input
                                            className="bg-slate-800/50 border-slate-700 h-14 text-lg focus:border-emerald-500"
                                            placeholder="Consulting, LLC"
                                            value={formData.companyName}
                                            onChange={(e) => updateField('companyName', e.target.value)}
                                        />
                                        <p className="text-xs text-slate-500">Must match tax records exactly.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-lg font-medium text-slate-200">Federal Tax ID (EIN)</Label>
                                        <Input
                                            className="bg-slate-800/50 border-slate-700 h-14 text-lg focus:border-emerald-500"
                                            placeholder="xx-xxxxxxx"
                                            value={formData.ein}
                                            onChange={(e) => updateField('ein', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <Label className="text-lg font-medium text-slate-200">NAICS Code (Optional)</Label>
                                        <Input
                                            className="bg-slate-800/50 border-slate-700 h-14 text-lg focus:border-emerald-500"
                                            placeholder="e.g. 541611"
                                            value={formData.naics}
                                            onChange={(e) => updateField('naics', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-lg font-medium text-slate-200">Full-Time W2 Employees</Label>
                                        <Select value={formData.employeeCount} onValueChange={(v) => updateField('employeeCount', v)}>
                                            <SelectTrigger className="bg-slate-800/50 border-slate-700 h-14 text-lg text-slate-200">
                                                <SelectValue placeholder="Select Count..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                                <SelectItem value="1-50">1-50 (Small Business)</SelectItem>
                                                <SelectItem value="51-100">51-100 (Mid-Market)</SelectItem>
                                                <SelectItem value="100+">100+ (Enterprise)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-slate-500">Determines match requirement.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">Why is this training needed right now?</Label>
                                    <Textarea
                                        className="bg-slate-800/50 border-slate-700 focus:border-emerald-500 min-h-[120px] text-lg p-4 text-slate-200"
                                        placeholder="e.g. To adopt new AI workflows, avoid layoffs, increase competitiveness..."
                                        value={formData.trainingNeed}
                                        onChange={(e) => updateField('trainingNeed', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <Label className="text-lg font-medium text-slate-200"># of Trainees</Label>
                                        <Input
                                            type="number"
                                            className="bg-slate-800/50 border-slate-700 h-14 text-lg focus:border-emerald-500"
                                            placeholder="5"
                                            value={formData.traineeCount}
                                            onChange={(e) => updateField('traineeCount', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-lg font-medium text-slate-200">Training Provider</Label>
                                        <Input
                                            className="bg-slate-800/50 border-slate-700 h-14 text-lg focus:border-emerald-500"
                                            value={formData.trainingProvider}
                                            onChange={(e) => updateField('trainingProvider', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-2xl">
                                    <h3 className="text-xl font-bold text-emerald-200 mb-2 flex items-center gap-2">
                                        <Wallet className="w-5 h-5" /> Funding Calculator
                                    </h3>
                                    <p className="text-emerald-100/70 text-sm leading-relaxed">
                                        The IWT grant reimburses up to 90% of training costs depending on your company size.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <Label className="text-lg font-medium text-slate-200">Total Estimated Cost</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">$</span>
                                            <Input
                                                type="number"
                                                className="bg-slate-800/50 border-slate-700 h-14 text-lg pl-8 focus:border-emerald-500"
                                                placeholder="5000"
                                                value={formData.totalCost}
                                                onChange={(e) => updateField('totalCost', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-lg font-medium text-slate-200">Employer Match %</Label>
                                        <Select value={formData.employerContribution} onValueChange={(v) => updateField('employerContribution', v)}>
                                            <SelectTrigger className="bg-slate-800/50 border-slate-700 h-14 text-lg text-slate-200">
                                                <SelectValue placeholder="Select Match..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                                <SelectItem value="10%">10% Match (most common)</SelectItem>
                                                <SelectItem value="25%">25% Match (50-100 employees)</SelectItem>
                                                <SelectItem value="50%">50% Match (100+ employees)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <Label className="text-lg font-medium text-slate-200">Projected Outcomes (Select all that apply)</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {['Wage Increases', 'Employee Retention', 'New Certification', 'New Hire Prevention', 'Market Expansion'].map((opt) => (
                                            <div
                                                key={opt}
                                                onClick={() => toggleOutcome(opt)}
                                                className={cn(
                                                    "flex items-center p-4 rounded-xl border cursor-pointer transition-all hover:bg-slate-800/80",
                                                    formData.outcomes.includes(opt)
                                                        ? "bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                                        : "bg-slate-800/30 border-slate-700"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors",
                                                    formData.outcomes.includes(opt) ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-500 bg-transparent"
                                                )}>
                                                    {formData.outcomes.includes(opt) && <CheckCircle2 className="w-3 h-3" />}
                                                </div>
                                                <span className={cn("font-medium", formData.outcomes.includes(opt) ? "text-emerald-100" : "text-slate-300")}>{opt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <div className="flex items-start space-x-3 p-4 bg-slate-800/40 rounded-xl border border-white/5">
                                        <Checkbox
                                            id="certification"
                                            checked={formData.certification}
                                            onCheckedChange={(c) => updateField('certification', !!c)}
                                            className="mt-1 border-emerald-500 data-[state=checked]:bg-emerald-500"
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor="certification"
                                                className="text-sm font-medium leading-relaxed text-slate-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                I certify that the employees to be trained are full-time W2 employees and residents of Nevada, and that this information is accurate to the best of my knowledge.
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="bg-slate-900/80 px-8 py-6 border-t border-white/5 flex items-center justify-between backdrop-blur-md">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === 0 || isSubmitting}
                    className="text-slate-400 hover:text-white hover:bg-white/5"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                {step === STEPS.length - 1 ? (
                    <Button
                        onClick={() => onSubmit(formData)}
                        disabled={!isStepValid() || isSubmitting}
                        className={cn(
                            "px-8 py-6 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-500/25 transition-all",
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
                                Submit Grant Application
                                <Rocket className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        className="px-8 py-6 text-lg bg-white text-slate-900 hover:bg-slate-200 rounded-xl"
                    >
                        Next Step <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                )}
            </div>
        </div>
    );
}
