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
            <div className="space-y-2 opacity-60">
                <Label>Full Name <Lock className="w-3 h-3 inline ml-1" /></Label>
                <Input value={formData.name} disabled className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed" />
            </div>
            <div className="space-y-2 opacity-60">
                <Label>Email <Lock className="w-3 h-3 inline ml-1" /></Label>
                <Input value={formData.email} disabled className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="preferredName">Preferred Name / Nickname</Label>
                <Input
                    id="preferredName"
                    name="preferredName"
                    value={formData.preferredName}
                    onChange={updateFormData}
                    placeholder="What should we call you?"
                    className="bg-black/20 border-white/10 focus:border-blue-500"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={updateFormData}
                    placeholder="(555) 123-4567"
                    className="bg-black/20 border-white/10 focus:border-blue-500"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={updateFormData}
                    placeholder="PST, EST, etc."
                    className="bg-black/20 border-white/10 focus:border-blue-500"
                />
            </div>
        </div>
    </div>
);

const OnboardingStep = ({ formData, updateFormData, toggleLearningPref }: any) => {
    const learningOptions = ["DFY (Done-For-You)", "DIY (Do It Yourself)", "Hybrid", "Live Workshop", "Online"];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Core Business Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="company">Company / Organization</Label>
                    <Input id="company" name="company" value={formData.company} onChange={updateFormData} className="bg-black/20 border-white/10" placeholder="Acme Inc." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" value={formData.website} onChange={updateFormData} className="bg-black/20 border-white/10" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <select name="industry" value={formData.industry} onChange={updateFormData} className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="" disabled>Select...</option>
                        <option value="Technology">Technology</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="Education">Education</option>
                        <option value="Health">Health</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Non-Profit">Non-Profit</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <select name="businessType" value={formData.businessType} onChange={updateFormData} className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="" disabled>Select...</option>
                        <option value="B2B">B2B (Business to Business)</option>
                        <option value="B2C">B2C (Business to Consumer)</option>
                        <option value="Agency">Agency / Service Provider</option>
                        <option value="SaaS">SaaS / Software</option>
                        <option value="E-Commerce">E-Commerce</option>
                        <option value="Local Business">Local Business</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="employeeCount">Team Size</Label>
                    <select name="employeeCount" value={formData.employeeCount} onChange={updateFormData} className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="" disabled>Select...</option>
                        <option value="1-10">1-10 (Startup)</option>
                        <option value="11-50">11-50</option>
                        <option value="51-200">51-200</option>
                        <option value="201+">201+ (Enterprise)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="estimatedMonthlyRevenue">Est. Monthly Revenue</Label>
                    <Select name="estimatedMonthlyRevenue" value={formData.estimatedMonthlyRevenue} onValueChange={(val) => updateFormData({ target: { name: 'estimatedMonthlyRevenue', value: val } })}>
                        <SelectTrigger className="bg-black/20 border-white/10">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pre-revenue">Pre-Revenue</SelectItem>
                            <SelectItem value="<5k">&lt;$5k/mo</SelectItem>
                            <SelectItem value="5k-25k">$5k-$25k/mo</SelectItem>
                            <SelectItem value="25k-100k">$25k-$100k/mo</SelectItem>
                            <SelectItem value="100k+">$100k+/mo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="currentLeadsPerMonth">Current Leads / Month</Label>
                    <Input id="currentLeadsPerMonth" name="currentLeadsPerMonth" value={formData.currentLeadsPerMonth} onChange={updateFormData} className="bg-black/20 border-white/10" placeholder="e.g. 50" type="number" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Your Role</Label>
                    <Input id="role" name="role" value={formData.role} onChange={updateFormData} className="bg-black/20 border-white/10" placeholder="Founder, CEO, etc." />
                </div>
            </div>

            {/* Goals & Vision */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Goals & Connect</h4>

                <div className="space-y-2">
                    <Label>Intention for Tonight</Label>
                    <Input name="goalForTonight" value={formData.goalForTonight} onChange={updateFormData} className="bg-black/20 border-white/10" placeholder="Meet 2 potential partners..." />
                </div>
                <div className="space-y-2">
                    <Label>3 Month Success Vision</Label>
                    <Textarea name="vision" value={formData.vision} onChange={updateFormData} className="bg-black/20 border-white/10" placeholder="I want to have launched my MVP..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Ask Me About...</Label>
                        <Textarea name="askMeAbout" value={formData.askMeAbout} onChange={updateFormData} className="bg-black/20 border-white/10 min-h-[80px]" placeholder="AI Agents, Sourdough bread..." />
                    </div>
                    <div className="space-y-2">
                        <Label>I Can Help You By...</Label>
                        <Textarea name="helpYouBy" value={formData.helpYouBy} onChange={updateFormData} className="bg-black/20 border-white/10 min-h-[80px]" placeholder="Designing your logo, reviewing code..." />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Learning Preferences</Label>
                    <div className="flex flex-wrap gap-2">
                        {learningOptions.map(opt => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => toggleLearningPref(opt)}
                                className={`px-3 py-1.5 rounded-md text-xs border transition-all ${formData.learningPreference?.includes(opt)
                                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-200"
                                    : "border-white/10 bg-white/5 hover:bg-white/10 text-gray-400"
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

const SocialsStep = ({ formData, updateFormData, toggleCommPref }: any) => {
    const commOptions = ["Text/SMS", "Email", "Phone Call", "Social Media", "Scheduling Link"];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input name="instagram" value={formData.instagram} onChange={updateFormData} className="bg-black/20 border-white/10" placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input name="linkedin" value={formData.linkedin} onChange={updateFormData} className="bg-black/20 border-white/10" placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="space-y-2">
                    <Label>Facebook</Label>
                    <Input name="facebook" value={formData.facebook} onChange={updateFormData} className="bg-black/20 border-white/10" placeholder="URL" />
                </div>
                <div className="space-y-2">
                    <Label>YouTube</Label>
                    <Input name="youtube" value={formData.youtube} onChange={updateFormData} className="bg-black/20 border-white/10" placeholder="Channel URL" />
                </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="space-y-2">
                    <Label>Scheduling Link (Calendly etc.)</Label>
                    <Input name="schedulingLink" value={formData.schedulingLink} onChange={updateFormData} className="bg-black/20 border-white/10" placeholder="https://cal.com/..." />
                </div>
                <div className="space-y-2">
                    <Label>Best Time to Reach</Label>
                    <Input name="bestTime" value={formData.bestTime} onChange={updateFormData} className="bg-black/20 border-white/10" placeholder="Weekdays after 5pm" />
                </div>

                <div className="space-y-2 mt-4">
                    <Label>Communication Preferences</Label>
                    <div className="flex flex-wrap gap-2">
                        {commOptions.map(opt => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => toggleCommPref(opt)}
                                className={`px-3 py-1.5 rounded-md text-xs border transition-all ${formData.commPrefs?.includes(opt)
                                    ? "border-blue-500 bg-blue-500/20 text-blue-200"
                                    : "border-white/10 bg-white/5 hover:bg-white/10 text-gray-400"
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
        { id: 'onboarding', label: 'Onboarding', component: OnboardingStep },
        { id: 'socials', label: 'Social Profile', component: SocialsStep },
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
                <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{steps[currentStep].label}</h2>
                    <p className="text-slate-400 text-sm mt-1">Please ensure your information is accurate.</p>
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
                        {currentStep < steps.length - 1 && (
                            <Button
                                variant="secondary"
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="bg-white/10 text-white hover:bg-white/20 border border-white/10"
                            >
                                Next <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}

                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`min-w-[140px] font-bold ${currentStep === steps.length - 1
                                ? "bg-green-600 hover:bg-green-500 text-white"
                                : "bg-blue-600 hover:bg-blue-500 text-white"
                                }`}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {isSubmitting ? "Saving..." : "Save All"}
                        </Button>
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
