"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, Info, CheckCircle2, Lock, UserCheck, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import Image from 'next/image';
import { useIdentity } from '@/context/IdentityContext';

// --- Components ---

const HelpBubble = ({ content }: { content: string }) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full ml-1.5 hover:bg-slate-800 text-blue-400">
                <Info className="h-3.5 w-3.5" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-slate-900 border-slate-700 text-slate-300 text-xs p-3 shadow-xl">
            {content}
        </PopoverContent>
    </Popover>
);

interface MultiSelectProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    label: string;
    max?: number;
    placeholder?: string;
}

const MultiSelect = ({ options, selected, onChange, label, max, placeholder = "Select..." }: MultiSelectProps) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(i => i !== option));
        } else {
            if (max && selected.length >= max) return;
            onChange([...selected, option]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-black/20 border-white/10 text-slate-300 hover:bg-slate-900/50 hover:text-white transition-all duration-300 focus:ring-0 focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                >
                    {selected.length > 0 ? (
                        <span className="truncate">
                            {selected.length} selected
                        </span>
                    ) : (
                        <span className="text-slate-500">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-[300px] p-0 bg-slate-950 border-slate-700">
                <div className="max-h-64 overflow-y-auto p-1">
                    {options.map((option) => (
                        <div
                            key={option}
                            className={cn(
                                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-800 hover:text-white cursor-pointer",
                                selected.includes(option) ? "text-white bg-slate-800/50" : "text-slate-400"
                            )}
                            onClick={() => handleSelect(option)}
                        >
                            <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-slate-700", selected.includes(option) ? "bg-blue-600 border-blue-600" : "opacity-50")}>
                                {selected.includes(option) && <Check className="h-3 w-3 text-white" />}
                            </div>
                            {option}
                        </div>
                    ))}
                </div>
                {max && (
                    <div className="p-2 text-xs text-slate-500 text-center border-t border-slate-700">
                        Max {max} selections
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};


// --- Types ---
interface DemoProfileData {
    // Basic
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    industry: string;
    businessType: string;
    website: string;

    // Core Alignment
    targetAudience: string;
    targetAudienceOther?: string;
    problemVerb: string;
    problemVerbOther?: string;
    problemSolved: string;
    solutionMechanism: string;
    coreAlignmentStatement: string; // Computed

    // Event Registration
    registrationType: string; // "reserve" | "raffle_only"

    // Future & Goals
    isFirstTime: string; // "yes" | "no"
    goalForNextMonth: string;
    vision: string;
    futureEventsWishlist: string;
}

const initialDemoProfileData: DemoProfileData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    industry: '',
    businessType: '',
    website: '',

    targetAudience: '',
    targetAudienceOther: '',
    problemVerb: 'Solve',
    problemVerbOther: '',
    problemSolved: '',
    solutionMechanism: '',
    coreAlignmentStatement: '',

    registrationType: '',

    isFirstTime: '',
    goalForNextMonth: '',
    vision: '',
    futureEventsWishlist: '',
};

// --- Steps ---

// STEP 1: Basic Info
const BasicDetailsStep = ({ formData, updateFormData }: any) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-base text-blue-200/80">
                Your Name and Email are managed via your Google Login.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label className="text-slate-300 text-base">Full Name <Lock className="w-3.5 h-3.5 inline ml-1 text-slate-500" /></Label>
                <Input value={formData.name} disabled className="bg-slate-950/30 border-white/5 text-slate-400 cursor-not-allowed text-base" />
            </div>
            <div className="space-y-2">
                <Label className="text-slate-300 text-base">Email <Lock className="w-3.5 h-3.5 inline ml-1 text-slate-500" /></Label>
                <Input value={formData.email} disabled className="bg-slate-950/30 border-white/5 text-slate-400 cursor-not-allowed text-base" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300 text-base">Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={updateFormData} placeholder="(555) 123-4567" className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 text-base" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="company" className="text-slate-300 text-base">Company</Label>
                <Input id="company" name="company" value={formData.company} onChange={updateFormData} placeholder="Your Company Name" className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 text-base" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-300 text-base">Role / Title</Label>
                <Input id="role" name="role" value={formData.role} onChange={updateFormData} placeholder="Founder, CEO, Developer..." className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 text-base" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="industry" className="text-slate-300 text-base">Industry</Label>
                <Select value={formData.industry} onValueChange={(val) => updateFormData({ target: { name: 'industry', value: val } })}>
                    <SelectTrigger className="bg-black/20 border-white/10 text-white focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 text-base h-12">
                        <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        {['Technology', 'Marketing', 'Real Estate', 'Finance', 'Health/Wellness', 'Education', 'Service', 'Other'].map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="businessType" className="text-slate-300 text-base">Business Type</Label>
                <Select value={formData.businessType} onValueChange={(val) => updateFormData({ target: { name: 'businessType', value: val } })}>
                    <SelectTrigger className="bg-black/20 border-white/10 text-white focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 text-base h-12">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        {['B2B', 'B2C', 'Non-Profit', 'Government', 'Hybrid'].map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website" className="text-slate-300 text-base">Website</Label>
                <Input id="website" name="website" value={formData.website} onChange={updateFormData} placeholder="https://..." className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 text-base" />
            </div>
        </div>
    </div>
);

// STEP 2: Core Alignment Statement
const CoreAlignmentStep = ({ formData, updateFormData }: any) => {

    // Computed sentence
    const target = formData.targetAudience === 'Other' ? (formData.targetAudienceOther || '[TARGET AUDIENCE]') : (formData.targetAudience || '[TARGET AUDIENCE]');
    const verb = formData.problemVerb === 'Other' ? (formData.problemVerbOther || '[ACTION]') : (formData.problemVerb || 'SOLVE');
    const problem = formData.problemSolved || '[PROBLEM]';
    const solution = formData.solutionMechanism || '[MECHANISM]';

    const sentence = `I HELP ${target}, ${verb.toUpperCase()} ${problem}, USING ${solution}.`;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-white">Core Alignment Statement</h3>
                <p className="text-slate-400 text-sm">Let's clarify your value proposition for the community.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <Label className="text-slate-300 text-base">1. Who do you help? (Target Audience)</Label>
                    <Select value={formData.targetAudience} onValueChange={(val) => updateFormData({ target: { name: 'targetAudience', value: val } })}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-12 text-base">
                            <SelectValue placeholder="Select Target Audience..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-white">
                            {[
                                'Small Business Owners',
                                'Developers / Engineers',
                                'Investors',
                                'Marketing Pros',
                                'Recruiters',
                                'Community Leaders',
                                'Service Professionals',
                                'Gyms',
                                'Other'
                            ].map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {formData.targetAudience === 'Other' && (
                        <Input
                            name="targetAudienceOther"
                            value={formData.targetAudienceOther}
                            onChange={updateFormData}
                            placeholder="Please specify..."
                            className="bg-slate-800/50 border-slate-700 text-white mt-2 h-12 text-base"
                        />
                    )}
                </div>

                <div className="space-y-3">
                    <Label className="text-slate-300 text-base">2. What problem do you solve? (Biggest Pain Point)</Label>
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="w-full md:w-1/3">
                            <Select value={formData.problemVerb} onValueChange={(val) => updateFormData({ target: { name: 'problemVerb', value: val } })}>
                                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-12 text-base">
                                    <SelectValue placeholder="Action..." />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                    {['Solve', 'Fix', 'Get', 'Stop', 'Gain', 'Remove', 'Recover', 'Other'].map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formData.problemVerb === 'Other' && (
                                <Input
                                    name="problemVerbOther"
                                    value={formData.problemVerbOther}
                                    onChange={updateFormData}
                                    placeholder="Action verb..."
                                    className="bg-slate-800/50 border-slate-700 text-white mt-2 h-12 text-base"
                                />
                            )}
                        </div>
                        <div className="w-full md:w-2/3">
                            <Input
                                name="problemSolved"
                                value={formData.problemSolved}
                                onChange={updateFormData}
                                placeholder="e.g. lack of leads, poor retention..."
                                className="bg-slate-800/50 border-slate-700 text-white h-12 text-base"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-slate-300 text-base">3. How do you solve it? (Your Product/Service/Mechanism)</Label>
                    <Input
                        name="solutionMechanism"
                        value={formData.solutionMechanism}
                        onChange={updateFormData}
                        placeholder="e.g. AI automation, custom software, coaching..."
                        className="bg-slate-800/50 border-slate-700 text-white h-12 text-base"
                    />
                </div>
            </div>

            {/* Live Preview Card */}
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 rounded-xl border border-blue-500/30 shadow-lg text-center">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Your Statement</p>
                <div className="text-xl md:text-2xl font-black text-white leading-relaxed uppercase font-mono">
                    "{sentence}"
                </div>
            </div>
        </div>
    );
};

// STEP 3: Event Registration
const EventRegistrationStep = ({ formData, updateFormData }: any) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-center">

            <div className="space-y-4 flex flex-col items-center">
                <div className="relative w-64 h-64 -mb-8 z-10">
                    <Image
                        src="/tech-alley-logo-transparent.png"
                        alt="Tech Alley Henderson"
                        fill
                        className="object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                        priority
                    />
                </div>

                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-xl p-6 pt-10 w-full max-w-lg shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-700" />

                    <Badge variant="outline" className="mb-3 text-indigo-300 border-indigo-500/50 bg-indigo-950/50 px-3 py-0.5">NEXT EVENT</Badge>

                    <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                        Tech Alley Henderson
                    </h3>

                    <div className="flex flex-col gap-1 text-slate-200 font-medium">
                        <span className="text-xl text-blue-300">February 25th 2026 @ <span className="whitespace-nowrap">5:00 PM</span></span>
                        <span className="text-slate-400">Pass Casino, Henderson, NV</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto pt-6">
                <label className={cn(
                    "flex flex-col items-center justify-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105",
                    formData.registrationType === 'reserve'
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                        : "bg-slate-800/30 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-500"
                )}>
                    <input
                        type="radio"
                        name="registrationType"
                        value="reserve"
                        checked={formData.registrationType === 'reserve'}
                        onChange={updateFormData}
                        className="hidden"
                    />
                    <CheckCircle2 className={cn("w-12 h-12", formData.registrationType === 'reserve' ? "text-blue-400" : "text-slate-500")} />
                    <div className="space-y-1">
                        <div className="font-bold text-lg">Reserve My Spot</div>
                        <div className="text-xs opacity-70">Register & Enter Raffle</div>
                    </div>
                </label>

                <label className={cn(
                    "flex flex-col items-center justify-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105",
                    formData.registrationType === 'raffle_only'
                        ? "bg-purple-600/20 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                        : "bg-slate-800/30 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-500"
                )}>
                    <input
                        type="radio"
                        name="registrationType"
                        value="raffle_only"
                        checked={formData.registrationType === 'raffle_only'}
                        onChange={updateFormData}
                        className="hidden"
                    />
                    <Sparkles className={cn("w-12 h-12", formData.registrationType === 'raffle_only' ? "text-purple-400" : "text-slate-500")} />
                    <div className="space-y-1">
                        <div className="font-bold text-lg">Just in it for the Raffle</div>
                        <div className="text-xs opacity-70">Enter Raffle Only</div>
                    </div>
                </label>
            </div>
        </div>
    );
};

// STEP 4: Goals & Future
const GoalsStep = ({ formData, updateFormData }: any) => {
    const intentionOptions = ["Find Co-Founder", "Meet Investors", "Hire Talent", "Find Job", "Learn AI", "Find Mentor", "Offer Mentorship", "Socialize", "Promote Startup", "Find Beta Testers", "Other"];
    const intentionArray = formData.goalForNextMonth ? formData.goalForNextMonth.split(', ') : [];

    const handleIntentionChange = (newSelected: string[]) => {
        if (newSelected.length > 3) return;
        const value = newSelected.join(', ');
        updateFormData({ target: { name: 'goalForNextMonth', value } });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* Moved First Time Question Here */}
            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                <Label className="text-slate-300 block mb-3 text-base">Was today your first time at Tech Alley Henderson?</Label>
                <div className="flex gap-4">
                    <label className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                        formData.isFirstTime === 'yes'
                            ? "bg-blue-600/20 border-blue-500 text-blue-200"
                            : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800"
                    )}>
                        <input
                            type="radio"
                            name="isFirstTime"
                            value="yes"
                            checked={formData.isFirstTime === 'yes'}
                            onChange={updateFormData}
                            className="hidden"
                        />
                        <span className="font-medium">Yes, First Time!</span>
                    </label>
                    <label className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                        formData.isFirstTime === 'no'
                            ? "bg-blue-600/20 border-blue-500 text-blue-200"
                            : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800"
                    )}>
                        <input
                            type="radio"
                            name="isFirstTime"
                            value="no"
                            checked={formData.isFirstTime === 'no'}
                            onChange={updateFormData}
                            className="hidden"
                        />
                        <span className="font-medium">No, I'm a Regular</span>
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-base font-medium leading-none text-slate-300 flex items-center">
                    Intention for Next Month's Event
                    <HelpBubble content="What are you hoping to achieve when you return?" />
                </label>
                <MultiSelect
                    options={intentionOptions}
                    selected={intentionArray}
                    onChange={handleIntentionChange}
                    label="Intentions"
                    max={3}
                    placeholder="What are you looking for?"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-slate-300 flex items-center text-base">
                    3 Month Success Vision
                    <HelpBubble content="Where do you want your business/project to be in 90 days?" />
                </Label>
                <Textarea name="vision" value={formData.vision} onChange={updateFormData} className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 text-base" placeholder="I want to have launched my MVP..." />
            </div>

            <div className="space-y-2">
                <Label className="text-slate-300 text-base">What would you like to see from future Tech Alley Henderson events?</Label>
                <Textarea
                    name="futureEventsWishlist"
                    value={formData.futureEventsWishlist}
                    onChange={updateFormData}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[80px]"
                    placeholder="More workshops, specific topics, better snacks..."
                />
            </div>
        </div>
    );
};


// --- Main Component ---

export default function DemoProfileWizard({ initialData, onSubmit, isSubmitting, connectedName, connectedId }: {
    initialData?: any,
    onSubmit: (data: any) => void,
    isSubmitting?: boolean,
    connectedName?: string,
    connectedId?: string
}) {
    const [currentStep, setCurrentStep] = useState(0);
    const { leadId: ctxLeadId, userName: ctxUserName } = useIdentity();
    const [formData, setFormData] = useState<DemoProfileData>(initialDemoProfileData);

    const leadId = connectedId || ctxLeadId;
    const userName = connectedName || ctxUserName;

    // Hydration
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                // Ensure recursive merge if needed, but shallow is fine for now
            }));

            // Smart skipping logic can be added here if needed
        }
    }, [initialData]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log(`Input Changed: ${name} = ${value}`); // DEBUG LOG
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const steps = [
        { id: 'basic', label: 'Basic Info', component: BasicDetailsStep },
        { id: 'core', label: 'Core Alignment', component: CoreAlignmentStep },
        { id: 'register', label: 'Initial Registration', component: EventRegistrationStep },
        { id: 'goals', label: 'Future & Goals', component: GoalsStep },
    ];

    const CurrentComponent = steps[currentStep].component;

    const handleSubmit = () => {
        // Construct final Core Alignment Statement before submit
        const target = formData.targetAudience === 'Other' ? (formData.targetAudienceOther || '') : formData.targetAudience;
        const verb = formData.problemVerb === 'Other' ? (formData.problemVerbOther || '') : formData.problemVerb;
        const problem = formData.problemSolved;
        const solution = formData.solutionMechanism;
        const finalSentence = `I HELP ${target}, ${verb.toUpperCase()} ${problem}, USING ${solution}.`;

        const finalData = {
            ...formData,
            coreAlignmentStatement: finalSentence
        };

        console.log("Submitting Final Data:", finalData); // DEBUG LOG
        onSubmit(finalData);
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">

            {/* Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-2xl border border-white/10 border-t-white/20 rounded-[2rem] shadow-[0_0_40px_rgba(139,92,246,0.15)] overflow-hidden"
            >
                {/* Full-Width Branded Header Bar */}
                {/* Full-Width Branded Header Bar */}
                <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-900/80 px-6 py-4 flex items-center justify-between border-b border-white/10 relative min-h-[100px]">

                    {/* Left: Logo */}
                    <div className="flex-none z-10 -ml-2">
                        <Image
                            src="/tah-hero-logo.png"
                            alt="Tech Alley Henderson"
                            width={120}
                            height={120}
                            className="w-28 h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-125"
                        />
                    </div>

                    {/* Center: Step Title & User Context */}
                    <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none z-0">
                        <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight drop-shadow-md text-center px-4 leading-tight max-w-[200px] md:max-w-none mx-auto">
                            {steps[currentStep].label}
                        </h2>
                        {leadId && (
                            <div className="flex items-center gap-1.5 mt-1 bg-black/20 rounded-full px-3 py-0.5 border border-white/5 backdrop-blur-md pointer-events-auto">
                                <UserCheck className="w-3 h-3 text-cyan-400" />
                                <span className="text-xs font-medium text-cyan-200/80 block pb-0.5">Connected as {userName || 'User'}</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Step Counter */}
                    <div className="flex-none text-right z-10 relative">
                        <div className="text-lg font-bold font-mono text-cyan-300">
                            Step {currentStep + 1} <span className="text-white/40 text-sm font-sans mx-1">of</span> {steps.length}
                        </div>
                        <div className="h-2 w-32 bg-slate-800/50 rounded-full mt-2 overflow-hidden border border-white/5 ml-auto">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 min-h-[400px]">
                    <CurrentComponent
                        formData={formData}
                        updateFormData={handleInputChange}
                    />
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-900/40 px-8 py-6 flex justify-between items-center border-t border-white/5">
                    <Button
                        variant="ghost"
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>

                    <div className="flex gap-3">
                        {currentStep < steps.length - 1 ? (
                            <Button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-blue-900/20"
                            >
                                Next <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold shadow-lg shadow-green-900/20"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                )}
                                {isSubmitting ? "Finishing..." : "Complete & Register"}
                            </Button>
                        )}
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
