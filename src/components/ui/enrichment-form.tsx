"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Loader2, RocketIcon, Info, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Types ---
export interface EnrichmentData {
    // Professional
    company: string;
    title: string;
    website: string;
    phone: string;
    industry: string;
    employeeCount: string;

    // Role
    role: string; // "What Best Describes You"
    decisionMaker: string;

    // Goals
    isFirstTime: boolean;
    goalForTonight: string; // TAH Goal?
    vision: string; // 3Month Success Vision
}

interface StepProps {
    formData: EnrichmentData;
    updateFormData: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    errors: Partial<Record<keyof EnrichmentData, string>>;
}

// --- Components ---
const InfoTooltip = ({ text }: { text: string }) => (
    <div className="group relative inline-block ml-2 align-middle">
        <HelpCircle className="w-4 h-4 text-blue-300 cursor-help" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
    </div>
);

// --- Steps ---
const ProfessionalStep: React.FC<StepProps> = ({ formData, updateFormData, errors }) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-white mb-1">Company / Organization</label>
                <input type="text" name="company" value={formData.company} onChange={updateFormData} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 focus:outline-none" placeholder="Acme Inc." />
                {errors.company && <p className="text-red-300 text-xs mt-1">{errors.company}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-white mb-1">Job Title</label>
                <input type="text" name="title" value={formData.title} onChange={updateFormData} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 focus:outline-none" placeholder="Founder, Dev, etc." />
                {errors.title && <p className="text-red-300 text-xs mt-1">{errors.title}</p>}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-white mb-1">Website</label>
                <input type="url" name="website" value={formData.website} onChange={updateFormData} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 focus:outline-none" placeholder="https://" />
            </div>
            <div>
                <label className="block text-sm font-medium text-white mb-1">Phone <InfoTooltip text="For event updates only." /></label>
                <input type="tel" name="phone" value={formData.phone} onChange={updateFormData} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 focus:outline-none" placeholder="(555) 123-4567" />
                {errors.phone && <p className="text-red-300 text-xs mt-1">{errors.phone}</p>}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-white mb-1">Industry</label>
                <select name="industry" value={formData.industry} onChange={updateFormData} className="w-full bg-slate-800/80 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none">
                    <option value="" disabled>Select...</option>
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-white mb-1">Employee Count</label>
                <select name="employeeCount" value={formData.employeeCount} onChange={updateFormData} className="w-full bg-slate-800/80 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none">
                    <option value="1-10">1-10 (Startup)</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201+">201+ (Enterprise)</option>
                </select>
            </div>
        </div>
    </div>
);

const RoleStep: React.FC<StepProps> = ({ formData, updateFormData, errors }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div>
            <label className="block text-sm font-medium text-white mb-2">What best describes you?</label>
            <select name="role" value={formData.role} onChange={updateFormData} className="w-full bg-slate-800/80 border border-white/20 rounded-lg px-4 py-3 text-white text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
                <option value="" disabled>Select your primary role...</option>
                <option value="Business Owner (Solopreneur)">Business Owner (Solopreneur)</option>
                <option value="Business Owner (With Team)">Business Owner (With Team)</option>
                <option value="Aspiring Entrepreneur">Aspiring Entrepreneur</option>
                <option value="Marketing / Creative Professional">Marketing / Creative Professional</option>
                <option value="Service Provider / Coach">Service Provider / Coach</option>
                <option value="Non-Profit / Community Leader">Non-Profit / Community Leader</option>
                <option value="Just Curious">Just Curious</option>
            </select>
            {errors.role && <p className="text-red-300 text-xs mt-1">{errors.role}</p>}
        </div>

        <div>
            <label className="block text-sm font-medium text-white mb-2">Are you a Decision Maker?</label>
            <select name="decisionMaker" value={formData.decisionMaker as any} onChange={updateFormData} className="w-full bg-slate-800/80 border border-white/20 rounded-lg px-4 py-3 text-white text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
                <option value="" disabled>Select decision making level...</option>
                <option value="Sole">Sole Decision Maker</option>
                <option value="Collaborative">Collaborative / Team</option>
                <option value="Influencer">Influencer (No budget authority)</option>
            </select>
        </div>
    </div>
);

const GoalsStep: React.FC<StepProps> = ({ formData, updateFormData, errors }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <span className="block text-white font-medium mb-3">Is this your first Tech Alley? <InfoTooltip text="Helps us guide you!" /></span>
            <div className="flex gap-4">
                <label className="flex items-center cursor-pointer bg-slate-800/50 px-4 py-2 rounded-lg border border-white/10 hover:bg-slate-700 transition-colors">
                    <input name="isFirstTime" type="radio" checked={formData.isFirstTime === true} onChange={() => updateFormData({ target: { name: 'isFirstTime', value: 'true', type: 'radio' } } as any)} className="accent-blue-500 w-4 h-4" />
                    <span className="ml-2 text-white text-sm">Yes, first timer!</span>
                </label>
                <label className="flex items-center cursor-pointer bg-slate-800/50 px-4 py-2 rounded-lg border border-white/10 hover:bg-slate-700 transition-colors">
                    <input name="isFirstTime" type="radio" checked={formData.isFirstTime === false} onChange={() => updateFormData({ target: { name: 'isFirstTime', value: 'false', type: 'radio' } } as any)} className="accent-blue-500 w-4 h-4" />
                    <span className="ml-2 text-white text-sm">No, I've attended before.</span>
                </label>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-white mb-1">Set a intentional action for tonight <InfoTooltip text="what would be a win for you here tonight before you leave" /></label>
            <input type="text" name="goalForTonight" value={formData.goalForTonight} onChange={updateFormData} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 focus:outline-none" placeholder="e.g. Meet a co-founder, specific tech..." />
            {errors.goalForTonight && <p className="text-red-300 text-xs mt-1">{errors.goalForTonight}</p>}
        </div>

        <div>
            <label className="block text-sm font-medium text-white mb-1">3 Month Success Vision <InfoTooltip text="Set a goal and let us help you achieve it!" /></label>
            <textarea name="vision" rows={3} value={formData.vision} onChange={updateFormData} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 focus:outline-none" placeholder="In 3 months, I want to have..." />
            {errors.vision && <p className="text-red-300 text-xs mt-1">{errors.vision}</p>}
        </div>
    </div>
);

// --- Constants ---
const initialFormData: EnrichmentData = {
    company: '',
    title: '',
    website: '',
    phone: '',
    industry: '',
    employeeCount: '1-10',
    role: '',
    decisionMaker: '',
    isFirstTime: true,
    goalForTonight: '',
    vision: ''
};

// --- Main Component ---
export default function EnrichmentForm({ leadId }: { leadId: string }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<EnrichmentData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<keyof EnrichmentData, string>>>({});

    const steps = [
        { label: "Profile", component: ProfessionalStep, validation: ['company', 'title', 'phone'] },
        { label: "Role", component: RoleStep, validation: ['role'] },
        { label: "Vision", component: GoalsStep, validation: ['goalForTonight', 'vision'] }
    ];

    const validateStep = () => {
        const fields = steps[currentStep].validation as (keyof EnrichmentData)[];
        const newErrors: any = {};
        let isValid = true;
        fields.forEach(f => {
            if (!formData[f] && formData[f] !== false) {
                newErrors[f] = 'Required';
                isValid = false;
            }
        });
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/update-lead', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pageId: leadId, ...formData })
            });

            if (!res.ok) throw new Error('Failed');

            // Force hard reload to ensure fresh dashboard state
            window.location.href = `/hub?id=${leadId}`;
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            alert("Something went wrong. Please check your inputs or try again.");
        }
    };

    const handleNext = () => { if (validateStep()) setCurrentStep(prev => prev + 1); };
    const CurrentStepComponent = steps[currentStep].component;

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Main Card with Blue Gradient */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10 relative">

                {/* Header */}
                <div className="p-8 pb-4 text-center border-b border-white/5">
                    <div className="mx-auto w-24 h-24 flex items-center justify-center mb-4">
                        <img src="/tech-alley-logo.png" alt="Tech Alley Henderson" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Complete Registration</h2>
                    <p className="text-blue-200 mt-2">Let's get you Connected.</p>
                </div>

                {/* Progress Bar */}
                <div className="px-8 mt-6">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }} />

                        {steps.map((s, i) => (
                            <div key={i} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i <= currentStep ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 scale-110' : 'bg-slate-800 text-gray-500 border border-white/10'}`}>
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-8 min-h-[400px]">
                    <h3 className="text-xl font-semibold text-white mb-6">{steps[currentStep].label}</h3>
                    <CurrentStepComponent formData={formData} updateFormData={(e) => {
                        const { name, value, type } = e.target;
                        // @ts-ignore
                        setFormData(p => ({ ...p, [name]: type === 'radio' ? value === 'true' : value }));
                        setErrors(p => ({ ...p, [name]: undefined }));
                    }} errors={errors} />
                </div>

                {/* Footer Controls */}
                <div className="p-8 pt-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center w-full">
                        <button
                            onClick={() => setCurrentStep(p => Math.max(0, p - 1))}
                            disabled={currentStep === 0}
                            className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" /> Back
                        </button>

                        {currentStep === steps.length - 1 ? (
                            <button onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100">
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Launch <RocketIcon className="w-5 h-5" /></>}
                            </button>
                        ) : (
                            <button onClick={handleNext} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold backdrop-blur-sm border border-white/10 flex items-center gap-2 transition-all">
                                Next <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            if (confirm("Start over? This will clear your progress.")) {
                                setCurrentStep(0);
                                setFormData(initialFormData);
                            }
                        }}
                        className="text-xs text-blue-300/50 hover:text-white transition-colors self-center uppercase tracking-widest font-medium"
                    >
                        Start Over
                    </button>
                </div>

                {/* Watermark */}
                {/* Watermark */}
                <div className="pb-8 flex flex-row items-center justify-center gap-1 opacity-90 hover:opacity-100 transition-opacity pt-6">
                    <span className="text-xs uppercase tracking-[0.2em] text-white font-semibold">Powered By</span>
                    <img
                        src="/social-alignment-icon.png"
                        alt="Social Alignment"
                        className="h-20 w-auto object-contain mix-blend-screen"
                    />
                </div>
            </div>
        </div>
    );
}
