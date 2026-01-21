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
    confirmIdentity: boolean; // Replaces description
    website: string; // Q5

    // Page 2: Audience Context
    targetAudience: string; // Q6
    coreAlignmentStatement: string;

    // Page 3: The Offer
    mainProductService: string; // NEW
    offerType: string; // Q7
    offerType_custom: string;
    desiredAction: string; // Q8
    desiredAction_custom: string;

    // Page 4: Business Signal
    monthlyLeads: string; // Q9
    outcome90Days: string; // Q10
    outcome90Days_custom: string;

    // Page 5: AI Awareness
    aiToolsUsed: string[]; // Q11 (Multi)
    aiToolsUsed_custom: string;
    aiStage: string; // Q12

    // Page 6: Challenges & Goals
    aiChallenge: string; // Q13
    aiChallenge_custom: string;
    aiInterest: string[]; // Q14 (Multi)
    aiInterest_custom: string;

    // Consent
    wantResources: string; // Q18 (Yes/No)
    helpNeeded: string[]; // Q19 (Multi)
    helpNeeded_custom: string;
}

const initialData: GenAIFormData = {
    name: '', email: '', phone: '', confirmIdentity: false, website: '',
    targetAudience: '', coreAlignmentStatement: '',
    mainProductService: '', offerType: '', offerType_custom: '', desiredAction: '', desiredAction_custom: '',
    monthlyLeads: '', outcome90Days: '', outcome90Days_custom: '',
    aiToolsUsed: [], aiToolsUsed_custom: '', aiStage: '',
    aiChallenge: '', aiChallenge_custom: '', aiInterest: [], aiInterest_custom: '',
    wantResources: '', helpNeeded: [], helpNeeded_custom: ''
};


// --- Multi Select Helper ---
const MultiSelectOptions = ({
    options,
    selected,
    onChange,
    customValue,
    onCustomChange,
    placeholder = "Please specify..."
}: {
    options: string[],
    selected: string[],
    onChange: (val: string[]) => void,
    customValue?: string,
    onCustomChange?: (val: string) => void,
    placeholder?: string
}) => {
    const toggle = (opt: string) => {
        if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
        else onChange([...selected, opt]);
    };
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map(opt => (
                    <div
                        key={opt}
                        onClick={() => toggle(opt)}
                        className={cn(
                            "cursor-pointer px-4 py-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 group",
                            selected.includes(opt)
                                ? "bg-teal-600 border-teal-500 text-white shadow-lg shadow-teal-500/20"
                                : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white"
                        )}
                    >
                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center", selected.includes(opt) ? "bg-teal-500 border-teal-500" : "border-slate-600")}>
                            {selected.includes(opt) && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        {opt}
                    </div>
                ))}
            </div>
            {selected.includes('Other') && onCustomChange && (
                <div className="animate-in fade-in slide-in-from-top-1">
                    <Input
                        value={customValue}
                        onChange={(e) => onCustomChange(e.target.value)}
                        placeholder={placeholder}
                        className="bg-slate-800 border-teal-500/50 text-white focus:ring-teal-500"
                        autoFocus
                    />
                </div>
            )}
        </div>
    );
};

// --- Single Select Helper ---
const SingleSelectOptions = ({
    options,
    selected,
    onChange,
    customValue,
    onCustomChange,
    placeholder = "Please specify..."
}: {
    options: string[],
    selected: string,
    onChange: (val: string) => void,
    customValue?: string,
    onCustomChange?: (val: string) => void,
    placeholder?: string
}) => {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map(opt => (
                    <div
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={cn(
                            "cursor-pointer px-4 py-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-between group",
                            selected === opt
                                ? "bg-teal-600 border-teal-500 text-white shadow-lg shadow-teal-500/20"
                                : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white"
                        )}
                    >
                        {opt}
                        {selected === opt && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                    </div>
                ))}
            </div>
            {selected === 'Other' && onCustomChange && (
                <div className="animate-in fade-in slide-in-from-top-1">
                    <Input
                        value={customValue}
                        onChange={(e) => onCustomChange(e.target.value)}
                        placeholder={placeholder}
                        className="bg-slate-800 border-teal-500/50 text-white focus:ring-teal-500"
                        autoFocus
                    />
                </div>
            )}
        </div>
    );
};


// --- Component ---

export default function GenAIQualifyForm({ onSubmit, isSubmitting, initialAlignmentStatement, initialName, initialEmail }: { onSubmit: (data: GenAIFormData) => void, isSubmitting: boolean, initialAlignmentStatement?: string, initialName?: string, initialEmail?: string }) {
    const { userName, email } = useIdentity(); // Pre-fill context
    const [page, setPage] = useState(0);
    const [data, setData] = useState<GenAIFormData>({
        ...initialData,
        name: initialName || userName || '',
        email: initialEmail || email || '',
        coreAlignmentStatement: initialAlignmentStatement || ''
    });

    const update = (field: keyof GenAIFormData, value: any) => setData(prev => ({ ...prev, [field]: value }));

    // Sync context or prop data when available
    React.useEffect(() => {
        if (initialName && !data.name) setData(prev => ({ ...prev, name: initialName }));
        else if (userName && !data.name) setData(prev => ({ ...prev, name: userName }));

        if (initialEmail && !data.email) setData(prev => ({ ...prev, email: initialEmail }));
        else if (email && !data.email) setData(prev => ({ ...prev, email: email }));

        if (initialAlignmentStatement && !data.coreAlignmentStatement) setData(prev => ({ ...prev, coreAlignmentStatement: initialAlignmentStatement }));
    }, [userName, email, initialAlignmentStatement, initialName, initialEmail]);

    // Logic Gate: Skip Page 5 if "Curious, haven't tried" (Q12) is selected
    const shouldShowPage4b = data.aiStage !== "Never tried it" && data.aiStage !== "Curious, haven't tried" && data.aiStage !== "";

    // Steps Definition
    const steps = [
        {
            id: 'identity',
            title: "Identity Check",
            content: (
                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-white">Full Name</Label>
                            <div className="relative">
                                <Input
                                    value={data.name}
                                    onChange={(e) => update('name', e.target.value)}
                                    className="pl-10 bg-slate-800/50 border-slate-700 text-slate-300 focus:ring-teal-500 cursor-not-allowed opacity-80"
                                    placeholder="Jane Doe"
                                    readOnly
                                />
                                <CheckCircle2 className="w-4 h-4 text-teal-500 absolute left-3 top-3" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white">Email Address</Label>
                            <Input
                                value={data.email}
                                onChange={(e) => update('email', e.target.value)}
                                className="bg-slate-800/50 border-slate-700 text-slate-300 focus:ring-teal-500 cursor-not-allowed opacity-80"
                                placeholder="jane@company.com"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <div
                            onClick={() => update('confirmIdentity', !data.confirmIdentity)}
                            className={cn(
                                "cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-4 group",
                                data.confirmIdentity
                                    ? "bg-teal-900/30 border-teal-500 shadow-lg shadow-teal-500/10"
                                    : "bg-slate-900/60 border-slate-800 hover:bg-slate-800 hover:border-slate-600"
                            )}
                        >
                            <div className={cn("mt-1 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors",
                                data.confirmIdentity ? "bg-teal-500 border-teal-500" : "border-slate-600 group-hover:border-slate-500"
                            )}>
                                {data.confirmIdentity && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <div className="space-y-1">
                                <h3 className={cn("font-medium", data.confirmIdentity ? "text-white" : "text-slate-300")}>
                                    I confirm this is me
                                </h3>
                                <p className="text-sm text-slate-400">
                                    I want to answer a few quick questions to earn <span className="text-teal-400 font-bold whitespace-nowrap">+5 Extra Raffle Entries</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'audience_context',
            title: "Audience Context",
            content: (
                <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="space-y-3">
                        <Label className="text-white text-lg">Who are you trying to reach most?</Label>
                        <SingleSelectOptions
                            options={['Founders / entrepreneurs', 'Small business owners', 'Executives / leadership', 'Creators / influencers', 'B2B decision-makers', 'Local customers', 'Consumers (B2C)', 'Not fully sure yet']}
                            selected={data.targetAudience}
                            onChange={(v) => update('targetAudience', v)}
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-800">
                        <div className="bg-gradient-to-r from-teal-900/40 to-green-900/40 border border-teal-500/20 p-4 rounded-xl flex gap-4 items-center mb-2">
                            <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 text-teal-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Your Core Alignment</h3>
                                <p className="text-teal-200 text-xs">We've loaded this from your registration. Feel free to refine it.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Your Alignment Statement</Label>
                            <Textarea
                                value={data.coreAlignmentStatement}
                                onChange={(e) => update('coreAlignmentStatement', e.target.value)}
                                placeholder="I HELP [WHO] SOLVE [PROBLEM] USING [MECHANISM]."
                                className="bg-slate-800 border-slate-700 text-white min-h-[100px] text-base font-mono leading-relaxed focus:ring-teal-500"
                            />
                            <p className="text-xs text-slate-500">
                                This statement helps our AI models understand your business context instantly.
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'offer',
            title: "The Offer",
            content: (
                <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="space-y-3">
                        <Label className="text-white text-lg">What is the name of your main product / service?</Label>
                        <Input
                            value={data.mainProductService}
                            onChange={(e) => update('mainProductService', e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white focus:ring-teal-500"
                            placeholder="e.g. The Accelerator Program"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-white text-lg">What type of offer is it?</Label>
                        <SingleSelectOptions
                            options={['Service (done-for-you)', 'Course / coaching', 'Product / ecommerce', 'Subscription / membership', 'Events / community', 'Other']}
                            selected={data.offerType}
                            onChange={(v) => update('offerType', v)}
                            customValue={data.offerType_custom}
                            onCustomChange={(v) => update('offerType_custom', v)}
                            placeholder="Please specify your offer type..."
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-white text-lg">#1 Action you want viewers to take?</Label>
                        <SingleSelectOptions
                            options={['Book a call', 'Join email list', 'Buy something', 'DM me', 'Follow/subscribe', 'Other']}
                            selected={data.desiredAction}
                            onChange={(v) => update('desiredAction', v)}
                            customValue={data.desiredAction_custom}
                            onCustomChange={(v) => update('desiredAction_custom', v)}
                            placeholder="What action should they take?"
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
                                        data.monthlyLeads === opt ? "bg-teal-600 text-white border-teal-500" : "bg-slate-900 border-slate-700 text-slate-400"
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
                        <Select value={data.outcome90Days} onValueChange={(v) => update('outcome90Days', v)}>
                            <SelectTrigger className="w-full h-12 bg-slate-800 border-slate-700 text-white text-base">
                                <SelectValue placeholder="Select the biggest outcome..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                {[
                                    "I'd finally stop worrying about where leads come from",
                                    "I'd be seen as the distinctive market leader",
                                    "I'd save 10+ hours/week to focus on closing",
                                    "We would double our inbound qualified lead flow",
                                    "I could launch my new offer with guaranteed traction",
                                    "My sales cycle would shorten significantly",
                                    'Other'
                                ].map(opt => (
                                    <SelectItem key={opt} value={opt} className="focus:bg-slate-800 cursor-pointer py-3">
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {data.outcome90Days === 'Other' && (
                            <div className="animate-in fade-in slide-in-from-top-1 mt-2">
                                <Input
                                    value={data.outcome90Days_custom}
                                    onChange={(e) => update('outcome90Days_custom', e.target.value)}
                                    placeholder="Tell us what changes..."
                                    className="bg-slate-800 border-teal-500/50 text-white focus:ring-teal-500"
                                    autoFocus
                                />
                            </div>
                        )}
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
                            options={[
                                'ChatGPT / Claude',
                                'Midjourney / Image Gen',
                                'Sora 2',
                                'Perplexity',
                                'Google Nano Banana',
                                'Runway / Pika (Video)',
                                'Veo 3',
                                'Higgsfield',
                                'AI Avatars (HeyGen)',
                                'Descript / CapCut AI',
                                'None yet',
                                'Other'
                            ]}
                            selected={data.aiToolsUsed}
                            onChange={(v) => update('aiToolsUsed', v)}
                            customValue={data.aiToolsUsed_custom}
                            onCustomChange={(v) => update('aiToolsUsed_custom', v)}
                            placeholder="What other tools?"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-white text-lg">How would you describe your AI video experience?</Label>
                        <SingleSelectOptions
                            options={['Never tried it', 'Curious, haven\'t tried', 'Dabbled a bit', 'Use it weekly', 'Use it daily', 'Expert / Power User']}
                            selected={data.aiStage}
                            onChange={(v) => update('aiStage', v)}
                        />
                    </div>
                </div>
            )
        },
        // Step 6: Challenges (Conditional)
        ...(shouldShowPage4b ? [{
            id: 'challenges',
            title: "Challenges & Goals",
            content: (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="space-y-3">
                        <Label className="text-white text-lg">Biggest challenge with traditional video production?</Label>
                        <SingleSelectOptions
                            options={['Production costs are too high', 'Takes too long to film/edit', 'Scheduling actors/talent', 'Logistics & Locations', 'Inconsistent quality', 'Hard to update later', 'Other']}
                            selected={data.aiChallenge}
                            onChange={(v) => update('aiChallenge', v)}
                            customValue={data.aiChallenge_custom}
                            onCustomChange={(v) => update('aiChallenge_custom', v)}
                            placeholder="What is your biggest challenge?"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-white text-lg">What interests you most about GenAI Video Production?</Label>
                        <MultiSelectOptions
                            options={['Cheaper production costs', 'Create faster', 'Be on camera less', 'Higher consistency', 'Better storytelling', 'Scale platforms', 'Scaling output of paid social ads', 'Other']}
                            selected={data.aiInterest}
                            onChange={(v) => update('aiInterest', v)}
                            customValue={data.aiInterest_custom}
                            onCustomChange={(v) => update('aiInterest_custom', v)}
                            placeholder="What else interests you?"
                        />
                    </div>
                </div>
            )
        }] : []),
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
                                options={[
                                    'AI Consulting for Team',
                                    '1:1 AI Consulting',
                                    'Done-for-you Production',
                                    'AI Avatar Creation',
                                    'Creative Strategy',
                                    'System/Automation Audit',
                                    'UI/UX and Website Build',
                                    'Brand Context Engineering',
                                    'Workshops / Training',
                                    "I'm interested in grant funding."
                                ]}
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
        if (page === 0) return data.name && data.email && data.confirmIdentity;
        if (page === 1) return data.targetAudience && data.coreAlignmentStatement && data.coreAlignmentStatement.length > 10;
        if (page === 2) return data.offerType && data.desiredAction && data.mainProductService; // Added mainProductService check
        if (page === 3) return data.monthlyLeads && data.outcome90Days;
        if (page === 4) return data.aiStage && data.aiToolsUsed.length > 0;
        // Challenges is optional-ish but enforced if shown
        if (shouldShowPage4b && steps[page].id === 'challenges') return data.aiChallenge;
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
                                className="h-full bg-teal-500"
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
                            className="bg-teal-600 hover:bg-teal-500 text-white min-w-[120px]"
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
