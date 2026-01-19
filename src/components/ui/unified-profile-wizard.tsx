"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, Save, Info, CheckCircle2, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';

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
                    className="w-full justify-between bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white"
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
            <PopoverContent className="w-full min-w-[300px] p-0 bg-slate-950 border-slate-800">
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
                    <div className="p-2 text-xs text-slate-500 text-center border-t border-slate-800">
                        Max {max} selections
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};


// --- Types ---
// --- Types ---
interface ProfileData {
    // Basic (Read Only / Core)
    name: string;
    email: string;
    phone: string;
    preferredName: string;
    timezone: string;

    // Onboarding / Business
    industry: string;
    company: string;
    role: string;
    website: string; // URL
    businessType: string;
    employeeCount: string;
    teamSize: string; // redundant? maybe map to employeeCount
    goalForTonight: string;
    vision: string;
    askMeAbout: string;
    helpMeBy: string;
    helpYouBy: string;
    learningPreference: string[];

    // Socials
    instagram: string;
    linkedin: string;
    facebook: string;
    youtube: string;
    schedulingLink: string;
    bestTime: string;
    commPrefs: string[];

    estimatedMonthlyRevenue: string; // New field
    currentLeadsPerMonth: string; // New field

    // Placeholders / Legacy
    aiMriResponse: any;
}

const initialProfileData: ProfileData = {
    name: '',
    email: '',
    phone: '',
    preferredName: '',
    timezone: '',
    industry: '',
    company: '',
    role: '',
    website: '',
    businessType: '',
    employeeCount: '',
    teamSize: '',
    goalForTonight: '',
    vision: '',
    askMeAbout: '',
    helpMeBy: '',
    helpYouBy: '',
    learningPreference: [],
    instagram: '',
    linkedin: '',
    facebook: '',
    youtube: '',
    schedulingLink: '',
    bestTime: '',
    commPrefs: [],

    estimatedMonthlyRevenue: '',
    currentLeadsPerMonth: '',

    aiMriResponse: {}
};

// --- Steps ---

const BasicDetailsStep = ({ formData, updateFormData }: any) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-200">
                Your Name and Email are managed via your Google Login and cannot be changed here.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label className="text-slate-300">Full Name <Lock className="w-3 h-3 inline ml-1 text-slate-500" /></Label>
                <Input value={formData.name} disabled className="bg-slate-900/50 border-slate-700 text-slate-300 cursor-not-allowed opacity-100" />
            </div>
            <div className="space-y-2">
                <Label className="text-slate-300">Email <Lock className="w-3 h-3 inline ml-1 text-slate-500" /></Label>
                <Input value={formData.email} disabled className="bg-slate-900/50 border-slate-700 text-slate-300 cursor-not-allowed opacity-100" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="preferredName" className="text-slate-200">Preferred Name / Nickname</Label>
                <Input
                    id="preferredName"
                    name="preferredName"
                    value={formData.preferredName}
                    onChange={updateFormData}
                    placeholder="What should we call you?"
                    className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-200">Phone Number</Label>
                <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={updateFormData}
                    placeholder="(555) 123-4567"
                    className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500"
                />
            </div>

        </div>
    </div>
);

const ProfessionalInfoStep = ({ formData, updateFormData }: any) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="company" className="text-slate-200">Company / Organization</Label>
                    <Input id="company" name="company" value={formData.company} onChange={updateFormData} className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500" placeholder="Acme Inc." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role" className="text-slate-200">Your Role</Label>
                    <Input id="role" name="role" value={formData.role} onChange={updateFormData} className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500" placeholder="Founder, CEO, etc." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="industry" className="text-slate-200">Industry</Label>
                    <select name="industry" value={formData.industry} onChange={updateFormData} className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="" disabled>Select...</option>
                        <option value="Technology & AI">Technology & AI</option>
                        <option value="Software & SaaS">Software & SaaS</option>
                        <option value="Marketing & Media">Marketing & Media</option>
                        <option value="Creative & Design">Creative & Design</option>
                        <option value="Finance & Fintech">Finance & Fintech</option>
                        <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                        <option value="Education & EdTech">Education & EdTech</option>
                        <option value="Real Estate & PropTech">Real Estate & PropTech</option>
                        <option value="Logistics & Manufacturing">Logistics & Manufacturing</option>
                        <option value="Sports & Entertainment">Sports & Entertainment</option>
                        <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                        <option value="Non-Profit & Community">Non-Profit & Community</option>
                        <option value="Government & Public Sector">Government & Public Sector</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-slate-200">Business Type</Label>
                    <select name="businessType" value={formData.businessType} onChange={updateFormData} className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="" disabled>Select...</option>
                        <option value="B2B">B2B (Business to Business)</option>
                        <option value="B2C">B2C (Business to Consumer)</option>
                        <option value="Agency">Agency / Service Provider</option>
                        <option value="SaaS">SaaS / Software</option>
                        <option value="E-Commerce">E-Commerce</option>
                        <option value="Local Business">Local Business</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="website" className="text-slate-200">Website</Label>
                    <Input id="website" name="website" value={formData.website} onChange={updateFormData} className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500" placeholder="https://..." />
                </div>
            </div>
        </div>
    );
};

const GoalsStep = ({ formData, updateFormData }: any) => {
    const learningOptions = ["DFY (Done-For-You)", "DIY (Do It Yourself)", "Hybrid", "Live Workshop", "Online", "Other"];
    const intentionOptions = ["Find Co-Founder", "Meet Investors", "Hire Talent", "Find Job", "Learn AI", "Find Mentor", "Offer Mentorship", "Socialize", "Promote Startup", "Find Beta Testers", "Other"];

    const intentionArray = formData.goalForTonight ? formData.goalForTonight.split(', ') : [];

    const handleIntentionChange = (newSelected: string[]) => {
        if (newSelected.length > 3) return;
        const value = newSelected.join(', ');
        updateFormData({ target: { name: 'goalForTonight', value } });
    };

    const handleLearningChange = (newSelected: string[]) => {
        updateFormData({ target: { name: 'learningPreference', value: newSelected } });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-slate-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center">
                        Intention for Tonight
                        <HelpBubble content="Pick up to 3 goals for tonight's event." />
                    </label>
                    <MultiSelect
                        options={intentionOptions}
                        selected={intentionArray}
                        onChange={handleIntentionChange}
                        label="Intentions"
                        max={3}
                        placeholder="What are you looking for?"
                    />
                    {intentionArray.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {intentionArray.map((item: string) => (
                                <Badge key={item} variant="secondary" className="bg-blue-500/10 text-blue-200 border-blue-500/20 hover:bg-blue-500/20">
                                    {item}
                                    <button onClick={() => handleIntentionChange(intentionArray.filter((i: string) => i !== item))} className="ml-1 hover:text-white"><X className="w-3 h-3" /></button>
                                </Badge>
                            ))}
                        </div>
                    )}
                    {intentionArray.includes("Other") && (
                        <Input
                            name="goalForTonightOther"
                            className="mt-2 bg-slate-950/50 border-slate-800 text-white"
                            placeholder="Please specify..."
                        />
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-200 flex items-center">
                        3 Month Success Vision
                        <HelpBubble content="Where do you want your business/project to be in 90 days?" />
                    </Label>
                    <Textarea name="vision" value={formData.vision} onChange={updateFormData} className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500" placeholder="I want to have launched my MVP..." />
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-200 flex items-center">
                        Learning Preferences
                        <HelpBubble content="How do you prefer to consume new information or skills?" />
                    </Label>
                    <MultiSelect
                        options={learningOptions}
                        selected={formData.learningPreference || []}
                        onChange={handleLearningChange}
                        label="Learning Preferences"
                        placeholder="Select preferences..."
                    />
                    {formData.learningPreference?.includes("Other") && (
                        <Input
                            className="mt-2 bg-slate-950/50 border-slate-800 text-white"
                            placeholder="Please specify..."
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-slate-200">Ask Me About...</Label>
                        <Textarea name="askMeAbout" value={formData.askMeAbout} onChange={updateFormData} className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 min-h-[80px]" placeholder="AI Agents, Sourdough bread..." />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-200">I Can Help You By...</Label>
                        <Textarea name="helpYouBy" value={formData.helpYouBy} onChange={updateFormData} className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 min-h-[80px]" placeholder="Designing your logo, reviewing code..." />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SocialsStep = ({ formData, updateFormData, toggleCommPref }: any) => {
    const commOptions = ["Text/SMS", "Email", "Phone Call", "Social Media", "Scheduling Link"];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-slate-200">Instagram</Label>
                    <Input name="instagram" value={formData.instagram} onChange={updateFormData} className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500" placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-200">LinkedIn</Label>
                    <Input name="linkedin" value={formData.linkedin} onChange={updateFormData} className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500" placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-200">Facebook</Label>
                    <Input name="facebook" value={formData.facebook} onChange={updateFormData} className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500" placeholder="URL" />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-200">YouTube</Label>
                    <Input name="youtube" value={formData.youtube} onChange={updateFormData} className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500" placeholder="Channel URL" />
                </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="space-y-2">
                    <Label className="text-slate-200">Scheduling Link (Calendly etc.)</Label>
                    <Input name="schedulingLink" value={formData.schedulingLink} onChange={updateFormData} className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500" placeholder="https://cal.com/..." />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-200">Best Time to Reach</Label>
                    <Input name="bestTime" value={formData.bestTime} onChange={updateFormData} className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500" placeholder="Weekdays after 5pm" />
                </div>

                <div className="space-y-2 mt-4">
                    <Label className="text-slate-200">Communication Preferences</Label>
                    <div className="flex flex-wrap gap-2">
                        {commOptions.map(opt => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => toggleCommPref(opt)}
                                className={`px-3 py-1.5 rounded-md text-xs border transition-all ${formData.commPrefs?.includes(opt)
                                    ? "border-blue-500 bg-blue-500/20 text-blue-200"
                                    : "border-slate-800 bg-slate-950/50 hover:bg-slate-800 text-gray-400"
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};



// --- Main Component ---

export default function UnifiedProfileWizard({ initialData, onSubmit, isSubmitting }: { initialData?: any, onSubmit: (data: any) => void, isSubmitting?: boolean }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<ProfileData>(initialProfileData);

    // Hydration
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                // Ensure arrays are arrays
                learningPreference: Array.isArray(initialData.learningPreference) ? initialData.learningPreference : [],
                commPrefs: Array.isArray(initialData.commPrefs) ? initialData.commPrefs : [],
            }));
        }
    }, [initialData]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleArrayItem = (field: keyof ProfileData, value: string) => {
        setFormData(prev => {
            const list = (prev[field] as string[]) || [];
            if (list.includes(value)) {
                return { ...prev, [field]: list.filter(i => i !== value) };
            }
            return { ...prev, [field]: [...list, value] };
        });
    };

    const steps = [
        { id: 'basic', label: 'Basic Info', component: BasicDetailsStep },
        { id: 'professional', label: 'Professional Details', component: ProfessionalInfoStep },
        { id: 'goals', label: 'Goals & Connect', component: GoalsStep },
    ];

    const CurrentComponent = steps[currentStep].component;

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">

            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-2 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/10 sticky top-4 z-20 shadow-xl">
                {steps.map((step, index) => {
                    const isActive = currentStep === index;
                    const isCompleted = index < currentStep; // Simple logic for now
                    return (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(index)}
                            className={`flex items-center gap-2 px-3 md:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <span className="w-4 h-4 text-center text-xs opacity-50">{index + 1}</span>}
                            <span>{step.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Content Card */}
            <motion.div
                layout
                className="bg-[#0B1120] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
            >
                {/* Header for current Step */}
                <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{steps[currentStep].label}</h2>
                        <p className="text-slate-400 text-sm mt-1">Please ensure your information is accurate.</p>
                    </div>
                    {/* Wide Banner Logo - Seamlessly blends with background */}
                    <div className="flex-1 max-w-[400px] flex justify-end">
                        <img src="/tech-alley-wide-banner.png" alt="Tech Alley Henderson" className="w-full h-auto object-contain max-h-[100px] opacity-90" />
                    </div>
                </div>

                <div className="p-8 min-h-[400px]">
                    <CurrentComponent
                        formData={formData}
                        updateFormData={handleInputChange}
                        toggleLearningPref={(v: string) => toggleArrayItem('learningPreference', v)}
                        toggleCommPref={(v: string) => toggleArrayItem('commPrefs', v)}
                    />
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="text-slate-400 hover:text-white"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>

                    <div className="flex gap-3">
                        {currentStep < steps.length - 1 ? (
                            <Button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="bg-blue-600 hover:bg-blue-500 text-white min-w-[120px]"
                            >
                                Next <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-500 text-white min-w-[160px] font-bold shadow-lg shadow-green-900/20"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                )}
                                {isSubmitting ? "Finishing..." : "Complete Setup"}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Branding Footer */}
                {/* Branding Footer */}
                <div className="pb-8 flex flex-col items-center justify-center gap-4 opacity-80 hover:opacity-100 transition-opacity pt-6 bg-[#0B1120]">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-blue-500/70 font-bold mt-0.5">Powered By</span>
                        <img
                            src="/social-alignment-logo.png"
                            alt="Social Alignment"
                            className="h-6 w-auto object-contain brightness-0 invert opacity-90 sepia-[.5] hue-rotate-[190deg] saturate-[500%]" // Blueish tint hack or use CSS filter
                            style={{ filter: "brightness(0) saturate(100%) invert(44%) sepia(35%) saturate(718%) hue-rotate(176deg) brightness(87%) contrast(85%)" }} // #4d8cc5 approx
                        />
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
