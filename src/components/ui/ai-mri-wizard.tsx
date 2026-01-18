"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface MRIResponseData {
    // Audit / Tech
    monthlySoftwareSpend: string;
    unusedTechTools: string; // New field for "unused tech" concept

    // Leakage / Scale
    manualHoursPerWeek: string;
    lostLeadsEstimate: string; // "Lost leads due to missed calls/late responses"
    adSpendMonthly: string; // Moved from Raffle

    // Pain / Vision
    biggestBottleneck: string; // Updated polarizing options
    whatIsAtStake: string; // New Final Question
}

const initialData: MRIResponseData = {
    monthlySoftwareSpend: "",
    unusedTechTools: "",
    manualHoursPerWeek: "",
    lostLeadsEstimate: "",
    adSpendMonthly: "",
    biggestBottleneck: "",
    whatIsAtStake: ""
};

export default function AIMRIWizard({ onSubmit, isSubmitting, initialValues }: { onSubmit: (data: any) => void, isSubmitting: boolean, initialValues?: any }) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<MRIResponseData>({ ...initialData, ...initialValues });

    const updateField = (field: keyof MRIResponseData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const steps = [
        { id: 'audit', title: 'Tech & Time Audit' },
        { id: 'leakage', title: 'Opportunity Leakage' },
        { id: 'vision', title: 'Bottlenecks & Stakes' }
    ];

    const currentStepConfig = steps[step];

    const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">

            {/* Progress Header */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-2 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/10 sticky top-4 z-20 shadow-xl">
                {steps.map((s, idx) => {
                    const isActive = step === idx;
                    const isCompleted = idx < step;
                    return (
                        <button
                            key={s.id}
                            onClick={() => setStep(idx)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/25 scale-105"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <span className="w-4 h-4 text-center text-xs opacity-50">{idx + 1}</span>}
                            <span>{s.title}</span>
                        </button>
                    )
                })}
            </div>

            <motion.div
                layout
                className="bg-[#0B1120] border border-cyan-500/20 rounded-3xl overflow-hidden shadow-2xl relative"
            >
                <div className="px-8 py-6 border-b border-white/5 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{currentStepConfig.title}</h2>
                    <p className="text-cyan-200/60 text-sm mt-1">Productivity & Systems Audit</p>
                </div>

                <div className="p-8 min-h-[400px]">

                    {/* STEP 1: Tech & Time Audit */}
                    {step === 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-4">
                                <Label className="text-lg">What is your monthly software spend?</Label>
                                <Select value={formData.monthlySoftwareSpend} onValueChange={(v) => updateField('monthlySoftwareSpend', v)}>
                                    <SelectTrigger className="bg-black/20 border-white/10 h-12 text-lg">
                                        <SelectValue placeholder="Select amount..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="<100">Under $100/mo</SelectItem>
                                        <SelectItem value="100-500">$100 - $500/mo</SelectItem>
                                        <SelectItem value="500-2000">$500 - $2,000/mo</SelectItem>
                                        <SelectItem value="2000+">$2,000+/mo (Enterprise)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4 pt-6">
                                <Label className="text-lg">Roughly how many hours/week do you waste on manual, repetitive tasks?</Label>
                                <Select value={formData.manualHoursPerWeek} onValueChange={(v) => updateField('manualHoursPerWeek', v)}>
                                    <SelectTrigger className="bg-black/20 border-white/10 h-12 text-lg">
                                        <SelectValue placeholder="Be honest..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0-5">0-5 hrs (I'm efficient)</SelectItem>
                                        <SelectItem value="5-10">5-10 hrs (Annoying)</SelectItem>
                                        <SelectItem value="10-20">10-20 hrs (Part-time job)</SelectItem>
                                        <SelectItem value="20+">20+ hrs (I'm the bottleneck)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4 pt-6">
                                <Label className="text-lg">Any unused tech tools gathering dust? (Optional)</Label>
                                <Input
                                    className="bg-black/20 border-white/10 h-12"
                                    placeholder="e.g. HubSpot, ClickUp, Zapier..."
                                    value={formData.unusedTechTools}
                                    onChange={(e) => updateField('unusedTechTools', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Opportunity Leakage */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6">
                                <p className="text-red-200 text-sm">"The most expensive lead is the one you miss."</p>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-lg">How much do you spend on Ads/Marketing monthly?</Label>
                                <Select value={formData.adSpendMonthly} onValueChange={(v) => updateField('adSpendMonthly', v)}>
                                    <SelectTrigger className="bg-black/20 border-white/10 h-12 text-lg">
                                        <SelectValue placeholder="e.g. $0 (Organic only)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">$0 (Organic)</SelectItem>
                                        <SelectItem value="<1000">&lt;$1k/mo</SelectItem>
                                        <SelectItem value="1k-5k">$1k - $5k/mo</SelectItem>
                                        <SelectItem value="5k-20k">$5k - $20k/mo</SelectItem>
                                        <SelectItem value="20k+">$20k+/mo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4 pt-6">
                                <Label className="text-lg">How many leads do you lose due to slow response times?</Label>
                                <Select value={formData.lostLeadsEstimate} onValueChange={(v) => updateField('lostLeadsEstimate', v)}>
                                    <SelectTrigger className="bg-black/20 border-white/10 h-12 text-lg">
                                        <SelectValue placeholder="Best guess..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="None">None, I'm glued to my phone</SelectItem>
                                        <SelectItem value="Few">A few here and there</SelectItem>
                                        <SelectItem value="Too Many">Too many to count</SelectItem>
                                        <SelectItem value="Idk">I don't track this (Scary)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Pain & Vision */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-4">
                                <Label className="text-lg text-cyan-300">What is your single Biggest Bottleneck?</Label>
                                <Select value={formData.biggestBottleneck} onValueChange={(v) => updateField('biggestBottleneck', v)}>
                                    <SelectTrigger className="bg-black/20 border-white/10 h-14 text-lg">
                                        <SelectValue placeholder="Select the one that hurts most..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="chaotic_fulfillment">"Selling is easy, but FULFILLMENT is chaos"</SelectItem>
                                        <SelectItem value="cloned_self">"I wish I could CLONE myself to handle meetings"</SelectItem>
                                        <SelectItem value="content_hamster_wheel">"Stuck on the content creation hamster wheel"</SelectItem>
                                        <SelectItem value="data_blindness">"I have data everywhere but NO insights"</SelectItem>
                                        <SelectItem value="lead_followup">"I get leads, but I suck at follow-up"</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-lg text-red-300">What is at stake if you don't fix this in 3 months?</Label>
                                <Textarea
                                    className="bg-black/20 border-red-500/20 focus:border-red-500 h-32 text-lg"
                                    placeholder="Burnout? Lost revenue? Competitors winning?"
                                    value={formData.whatIsAtStake}
                                    onChange={(e) => updateField('whatIsAtStake', e.target.value)}
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
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-8"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Generate Audit
                            </Button>
                        )}
                    </div>
                </div>

                {/* Branding Footer */}
                <div className="pb-8 flex flex-row items-center justify-center gap-2 opacity-80 hover:opacity-100 transition-opacity pt-6 bg-[#0B1120]">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold mt-1">Powered By</span>
                    <img
                        src="/social-alignment-logo.png"
                        alt="Social Alignment"
                        className="h-8 w-auto object-contain brightness-0 invert opacity-70"
                    />
                </div>
            </motion.div>
        </div>
    );
}
