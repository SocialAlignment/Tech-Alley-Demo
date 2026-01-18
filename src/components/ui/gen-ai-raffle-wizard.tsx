"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Ticket, Loader2, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";

interface RaffleData {
    genAiExp: string; // Existing column
    aiExpectations: string; // New
    aiHesitation: string; // New
    interestedServices: string[]; // New (store as comma-separated text or JSON)
}

const initialData: RaffleData = {
    genAiExp: "",
    aiExpectations: "",
    aiHesitation: "",
    interestedServices: []
};

const SERVICE_OPTIONS = [
    { id: 'automations', label: 'Custom Automations (Save Time)' },
    { id: 'chatbots', label: 'AI Chatbots (Customer Service)' },
    { id: 'content', label: 'Content Creation Agents' },
    { id: 'cloning', label: 'Voice/Video Cloning' },
    { id: 'consulting', label: 'Strategy & Consulting' },
    { id: 'workshops', label: 'Team Training / Workshops' }
];

export default function GenAIRaffleWizard({ onSubmit, isSubmitting, initialValues }: { onSubmit: (data: any) => void, isSubmitting: boolean, initialValues?: any }) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<RaffleData>({
        ...initialData,
        ...initialValues,
        interestedServices: initialValues?.interestedServices ?
            (Array.isArray(initialValues.interestedServices) ? initialValues.interestedServices : initialValues.interestedServices.split(','))
            : []
    });

    const updateField = (field: keyof RaffleData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleService = (serviceId: string) => {
        setFormData(prev => {
            const current = prev.interestedServices;
            if (current.includes(serviceId)) {
                return { ...prev, interestedServices: current.filter(s => s !== serviceId) };
            } else {
                return { ...prev, interestedServices: [...current, serviceId] };
            }
        });
    };

    const steps = [
        { id: 'knowledge', title: 'AI Knowledge' },
        { id: 'sentiments', title: 'Hopes & Fears' },
        { id: 'services', title: 'Services Interest' }
    ];

    const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            {/* Progress Header */}
            <div className="flex justify-center gap-2 mb-4">
                {steps.map((s, idx) => (
                    <div key={s.id} className={`h-2 rounded-full transition-all duration-500 ${idx <= step ? 'w-8 bg-purple-500' : 'w-2 bg-purple-500/20'}`} />
                ))}
            </div>

            <motion.div
                layout
                className="bg-[#0B1120] border border-purple-500/20 rounded-3xl overflow-hidden shadow-2xl relative"
            >
                <div className="px-8 py-6 border-b border-white/5 bg-gradient-to-r from-purple-900/20 to-pink-900/20 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{steps[step].title}</h2>
                        <p className="text-purple-200/60 text-sm mt-1">Enter to win a Free GenAI Audit ($500 Value)</p>
                    </div>
                    <Ticket className="w-8 h-8 text-purple-400 opacity-50" />
                </div>

                <div className="p-8 min-h-[400px]">
                    {step === 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-4">
                                <Label className="text-lg">How would you rate your current AI knowledge?</Label>
                                <Select value={formData.genAiExp} onValueChange={(v) => updateField('genAiExp', v)}>
                                    <SelectTrigger className="bg-black/20 border-white/10 h-14 text-lg">
                                        <SelectValue placeholder="Select your level..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner (What is ChatGPT?)</SelectItem>
                                        <SelectItem value="intermediate">Intermediate (I use it weekly)</SelectItem>
                                        <SelectItem value="advanced">Advanced (I build/prompt daily)</SelectItem>
                                        <SelectItem value="expert">Expert (I train models)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-4">
                                <Label className="text-lg text-purple-300">What are you most excited about regarding AI?</Label>
                                <Textarea
                                    className="bg-black/20 border-purple-500/20 focus:border-purple-500 h-24 text-lg"
                                    placeholder="Automation? Cost savings? Creativity?"
                                    value={formData.aiExpectations}
                                    onChange={(e) => updateField('aiExpectations', e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-lg text-red-300">What is your biggest hesitation or fear?</Label>
                                <Textarea
                                    className="bg-black/20 border-red-500/20 focus:border-red-500 h-24 text-lg"
                                    placeholder="Privacy? Complexity? Job replacement?"
                                    value={formData.aiHesitation}
                                    onChange={(e) => updateField('aiHesitation', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <Label className="text-lg mb-4 block">Which services are you potentially interested in?</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {SERVICE_OPTIONS.map((service) => {
                                    const isSelected = formData.interestedServices.includes(service.id);
                                    return (
                                        <div
                                            key={service.id}
                                            onClick={() => toggleService(service.id)}
                                            className={`
                                                cursor-pointer p-4 rounded-xl border border-white/10 transition-all duration-200 flex items-center gap-3
                                                ${isSelected ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-white/5 hover:bg-white/10'}
                                            `}
                                        >
                                            <Checkbox checked={isSelected} onCheckedChange={() => toggleService(service.id)} className="border-white/50 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500" />
                                            <span className={isSelected ? 'text-white font-medium' : 'text-slate-300'}>{service.label}</span>
                                        </div>
                                    )
                                })}
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
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-8"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                Enter Raffle
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
