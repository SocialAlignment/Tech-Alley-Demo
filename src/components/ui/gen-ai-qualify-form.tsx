"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2, Lock, Sparkles, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { useIdentity } from '@/context/IdentityContext';

// --- Types ---

export interface GenAIFormData {
    // Page 1: Identity
    name: string;
    email: string;
    phone: string;
    description: string; // Q4
    website: string; // Q5

    // Page 2: Audience/Offer
    targetAudience: string; // Q6
    offerType: string; // Q7
    desiredAction: string; // Q8

    // Page 3: Business Signal
    monthlyLeads: string; // Q9
    outcome90Days: string; // Q10

    // Page 4: AI Awareness
    aiToolsUsed: string[]; // Q11 (Multi)
    aiStage: string; // Q12

    // Page 5 (Conditional): Challenges
    aiChallenge: string; // Q13
    aiInterest: string[]; // Q14 (Multi)

    // Page 6: Sora Fit
    soraCreation: string; // Q15
    soraVibe: string; // Q16
    avoidTopics: string; // Q17

    // Consent
    wantResources: string; // Q18 (Yes/No)
    helpNeeded: string[]; // Q19 (Multi)
}

const initialData: GenAIFormData = {
    name: '', email: '', phone: '', description: '', website: '',
    targetAudience: '', offerType: '', desiredAction: '',
    monthlyLeads: '', outcome90Days: '',
    aiToolsUsed: [], aiStage: '',
    aiChallenge: '', aiInterest: [],
    soraCreation: '', soraVibe: '', avoidTopics: '',
    wantResources: '', helpNeeded: []
};


// --- Multi Select Helper ---
const MultiSelectOptions = ({ options, selected, onChange }: { options: string[], selected: string[], onChange: (val: string[]) => void }) => {
    const toggle = (opt: string) => {
        if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
        else onChange([...selected, opt]);
    };
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map(opt => (
                <div
                    key={opt}
                    onClick={() => toggle(opt)}
                    className={cn(
                        "cursor-pointer px-4 py-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 group",
                        selected.includes(opt)
                            ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white"
                    )}
                >
                    <div className={cn("w-4 h-4 rounded border flex items-center justify-center", selected.includes(opt) ? "bg-purple-500 border-purple-500" : "border-slate-600")}>
                        {selected.includes(opt) && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    {opt}
                </div>
            ))}
        </div>
    );
};

// --- Single Select Helper ---
const SingleSelectOptions = ({ options, selected, onChange }: { options: string[], selected: string, onChange: (val: string) => void }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map(opt => (
                <div
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={cn(
                        "cursor-pointer px-4 py-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-between group",
                        selected === opt
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white"
                    )}
                >
                    {opt}
                    {selected === opt && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
            ))}
        </div>
    );
};


// --- Component ---

export default function GenAIQualifyForm({ onSubmit, isSubmitting }: { onSubmit: (data: GenAIFormData) => void, isSubmitting: boolean }) {
    const { userName, email } = useIdentity(); // Pre-fill context
    const [page, setPage] = useState(0);
    const [data, setData] = useState<GenAIFormData>({
        ...initialData,
        name: userName || '',
        email: email || ''
    });

    const update = (field: keyof GenAIFormData, value: any) => setData(prev => ({ ...prev, [field]: value }));

    // Sync context data when available
    React.useEffect(() => {
        if (userName) setData(prev => ({ ...prev, name: userName }));
        if (email) setData(prev => ({ ...prev, email: email }));
    }, [userName, email]);

    // Logic Gate: Skip Page 5 if "Curious, haven't tried" (Q12) is selected
    const shouldShowPage4b = data.aiStage !== "Curious, haven't tried" && data.aiStage !== "";

    const steps = [
        {
            id: 'identity',
            title: "Identity & Context",
            content: (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-200">
                            We've pre-filled your contact info from your registration. Let's focus on your business goals.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-white text-lg">Which best describes you right now?</Label>
                        <SingleSelectOptions
                            options={['Solo founder / consultant', 'Small business owner (2-10)', 'Creator / influencer', 'Agency / service provider', 'Executive / internal team', 'Other']}
                            selected={data.description}
                            onChange={(v) => update('description', v)}
                        />
                    </div>
                </div>
            )
        },
        {
            id: 'audience',
            title: "Audience & Offer",
            content: (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="space-y-3">
                        <Label className="text-white text-lg">Who are you trying to reach most?</Label>
                        <SingleSelectOptions
                            options={['Founders / entrepreneurs', 'Small business owners', 'Executives / leadership', 'Creators / influencers', 'Local customers', 'B2B decision-makers', 'Consumers (B2C)', 'Not fully sure yet']}
                            selected={data.targetAudience}
                            onChange={(v) => update('targetAudience', v)}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-white text-lg">What do you primarily sell?</Label>
                        <SingleSelectOptions
                            options={['Service (done-for-you)', 'Product / ecommerce', 'Course / coaching', 'Subscription / membership', 'Events / community', 'Still figuring it out']}
                            selected={data.offerType}
                            onChange={(v) => update('offerType', v)}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-white text-lg">#1 Action you want viewers to take?</Label>
                        <SingleSelectOptions
                            options={['Book a call', 'DM me', 'Join email list', 'Buy something', 'Follow/subscribe', 'Not sure yet']}
                            selected={data.desiredAction}
                            onChange={(v) => update('desiredAction', v)}
                        />
                    </div>
                </div>
            )
        },
        {
            id: 'business',
            title: "Business Signal",
            content: (
                <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="space-y-3">
                        <Label className="text-white text-lg">Roughly how many qualified leads / month?</Label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {['0-5', '6-20', '21-50', '51-100', '100+', 'Not tracking'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => update('monthlyLeads', opt)}
                                    className={cn(
                                        "px-2 py-3 rounded-lg border text-sm font-medium transition-all hover:bg-slate-800",
                                        data.monthlyLeads === opt ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-900 border-slate-700 text-slate-400"
                                    )}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-white text-lg flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            If video worked perfectly next 90 days, what changes?
                        </Label>
                        <Textarea
                            value={data.outcome90Days}
                            onChange={(e) => update('outcome90Days', e.target.value)}
                            placeholder="e.g. I'd stop relying on cold outreach and have inbound calls booked automatically..."
                            className="min-h-[100px] bg-slate-800 border-slate-700 text-white text-lg"
                        />
                    </div>
                </div>
            )
        },
        {
            id: 'awareness',
            title: "AI Readiness",
            content: (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="space-y-3">
                        <Label className="text-white text-lg">Tools used so far?</Label>
                        <MultiSelectOptions
                            options={['None yet', 'ChatGPT / Claude', 'Midjourney / Image Gen', 'Runway / Pika (Video)', 'AI Avatars (HeyGen)', 'Descript / CapCut AI', 'Other']}
                            selected={data.aiToolsUsed}
                            onChange={(v) => update('aiToolsUsed', v)}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-white text-lg">Where are you with AI Video?</Label>
                        <SingleSelectOptions
                            options={['Curious, haven\'t tried', 'Tried a bit — results meh', 'Actively experimenting', 'Using in production', 'Tried and gave up']}
                            selected={data.aiStage}
                            onChange={(v) => update('aiStage', v)}
                        />
                    </div>
                </div>
            )
        },
        // LOGIC GATE: Only verify existance in render
        ...(shouldShowPage4b ? [{
            id: 'challenges',
            title: "Challenges & Interests",
            content: (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="space-y-3">
                        <Label className="text-white text-lg">Biggest Challenge?</Label>
                        <SingleSelectOptions
                            options={['Don\'t know what to prompt', 'Outputs not like my brand', 'Feels generic / cringe', 'Takes too much time', 'Don\'t trust it', 'Can\'t get consistent results']}
                            selected={data.aiChallenge}
                            onChange={(v) => update('aiChallenge', v)}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-white text-lg">What interests you most?</Label>
                        <MultiSelectOptions
                            options={['Create faster', 'Be on camera less', 'Higher consistency', 'Better storytelling', 'Scale platforms', 'Ads / Promos']}
                            selected={data.aiInterest}
                            onChange={(v) => update('aiInterest', v)}
                        />
                    </div>
                </div>
            )
        }] : []),
        {
            id: 'sora',
            title: "Sora Session Fit",
            content: (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 p-4 rounded-xl flex gap-4 items-center mb-6">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center shrink-0">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">If you win...</h3>
                            <p className="text-purple-200 text-sm">We want to hit the ground running. Help us prep.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-white text-lg">What would you create first?</Label>
                        <SingleSelectOptions
                            options={['Founder story / Intro', 'Offer explainer', 'Ad / Promo', 'Social content series', 'Testimonial style', 'Event promo']}
                            selected={data.soraCreation}
                            onChange={(v) => update('soraCreation', v)}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-white text-lg">Desired Vibe</Label>
                        <SingleSelectOptions
                            options={['Premium & cinematic', 'Clean & modern', 'Warm & human', 'Bold & high energy', 'Minimal & elegant', 'Playful & experimental']}
                            selected={data.soraVibe}
                            onChange={(v) => update('soraVibe', v)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Anything to avoid? (Topics, tone, etc)</Label>
                        <Input
                            value={data.avoidTopics}
                            onChange={(e) => update('avoidTopics', e.target.value)}
                            placeholder="e.g. cheesy stock footage look, overly corporate..."
                            className="bg-slate-800 border-slate-700 text-white"
                        />
                    </div>
                </div>
            )
        },
        {
            id: 'consent',
            title: "Final Step",
            content: (
                <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="space-y-4">
                        <Label className="text-white text-lg">If you don't win, do you want tailored resources based on your answers?</Label>
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={() => update('wantResources', 'Yes')} className={cn("p-4 rounded-xl border text-left transition-all", data.wantResources === 'Yes' ? "bg-green-900/40 border-green-500 text-white" : "bg-slate-800/50 border-slate-700 text-slate-400")}>
                                <div className="font-bold text-lg mb-1">Yes, send what's relevant</div>
                                <div className="text-sm opacity-70">Cheat sheets, prompt packs, and tips specific to your stage.</div>
                            </button>
                            <button onClick={() => update('wantResources', 'No')} className={cn("p-4 rounded-xl border text-left transition-all", data.wantResources === 'No' ? "bg-slate-700/50 border-slate-600 text-white" : "bg-slate-800/50 border-slate-700 text-slate-400")}>
                                <div className="font-bold text-lg mb-1">No thanks</div>
                                <div className="text-sm opacity-70">Just the raffle and newsletter please.</div>
                            </button>
                        </div>
                    </div>

                    {data.wantResources === 'Yes' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                            <Label className="text-white text-lg">What help is most valuable right now?</Label>
                            <MultiSelectOptions
                                options={['1:1 Sora / Strategy', 'Done-for-you Production', 'AI Avatar Creation', 'Messaging & Positioning', 'Systems / Automation', 'Workshops / Training']}
                                selected={data.helpNeeded}
                                onChange={(v) => update('helpNeeded', v)}
                            />
                        </div>
                    )}
                </div>
            )
        }
    ];

    const currentStep = steps[page];

    // Validation Logic
    const canContinue = () => {
        if (page === 0) return data.description;
        if (page === 1) return data.targetAudience && data.offerType && data.desiredAction;
        if (page === 2) return data.monthlyLeads && data.outcome90Days;
        if (page === 3) return data.aiStage && data.aiToolsUsed.length > 0;
        // Page 4b (Challenges) is optional-ish, but let's enforce single select
        if (shouldShowPage4b && steps[page].id === 'challenges') return data.aiChallenge;
        if (steps[page].id === 'sora') return data.soraCreation && data.soraVibe;
        if (steps[page].id === 'consent') return data.wantResources;
        return true;
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
            <div className="relative z-10 w-full bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                {/* Header */}
                <div className="bg-slate-950/50 px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            {currentStep.title}
                        </h2>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-slate-400">Step {page + 1} / {steps.length}</div>
                        <div className="h-1 w-24 bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <motion.div
                                className="h-full bg-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${((page + 1) / steps.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {currentStep.content}
                </div>

                {/* Footer */}
                <div className="bg-slate-950/80 px-8 py-6 flex justify-between items-center border-t border-white/5">
                    <Button
                        variant="ghost"
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="text-slate-400 hover:text-white"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>

                    {page < steps.length - 1 ? (
                        <Button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!canContinue()}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[120px]"
                        >
                            Next <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => onSubmit(data)}
                            disabled={!canContinue() || isSubmitting}
                            className="bg-green-600 hover:bg-green-500 text-white min-w-[140px]"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit & Join Raffle"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
