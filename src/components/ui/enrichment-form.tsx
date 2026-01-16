"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Loader2, RocketIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Types ---
export interface EnrichmentData {
    company: string;
    title: string;
    isFirstTime: boolean;
    goalForTonight: string;
    goalDetail: string;
}

interface StepProps {
    formData: EnrichmentData;
    updateFormData: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    errors: Partial<Record<keyof EnrichmentData, string>>;
}

interface EnrichmentFormProps {
    leadId: string;
}

// --- Progress Indicator ---
const ProgressSteps = ({ steps, currentStep }: { steps: { label: string }[], currentStep: number }) => (
    <div className="w-full py-6 flex justify-center">
        <div className="flex items-center">
            {steps.map((step, i) => (
                <React.Fragment key={i}>
                    <div className="relative z-10">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${i < currentStep ? "bg-blue-600 text-white" :
                                i === currentStep ? "bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900/30" :
                                    "bg-gray-200 dark:bg-gray-700 text-gray-400"
                            }`}>
                            {i < currentStep ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                        </div>
                        <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-wider ${i <= currentStep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                            }`}>
                            {step.label}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`w-12 h-0.5 mx-2 transition-colors duration-300 ${i < currentStep ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                            }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    </div>
);

// --- Steps ---
const ProfessionalInfoStep: React.FC<StepProps> = ({ formData, updateFormData, errors }) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Company / Org</label>
            <input type="text" id="company" name="company" value={formData.company} onChange={updateFormData}
                className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.company ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`} placeholder="Acme Inc." />
            {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
        </div>
        <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Job Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={updateFormData}
                className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.title ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`} placeholder="Product Manager" />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>
    </div>
);

const GoalsStep: React.FC<StepProps> = ({ formData, updateFormData }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30">
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-3 font-medium">Is this your first Tech Alley?</p>
            <div className="flex gap-4">
                <label className="flex items-center cursor-pointer"><input name="isFirstTime" type="radio" checked={formData.isFirstTime === true} onChange={() => updateFormData({ target: { name: 'isFirstTime', value: 'true', type: 'radio' } } as any)} className="text-blue-600" /><span className="ml-2 text-sm">Yes!</span></label>
                <label className="flex items-center cursor-pointer"><input name="isFirstTime" type="radio" checked={formData.isFirstTime === false} onChange={() => updateFormData({ target: { name: 'isFirstTime', value: 'false', type: 'radio' } } as any)} className="text-blue-600" /><span className="ml-2 text-sm">No, I'm a regular.</span></label>
            </div>
        </div>
        <div>
            <label htmlFor="goalForTonight" className="block font-medium text-gray-700 dark:text-white mb-2">Primary Goal</label>
            <select id="goalForTonight" name="goalForTonight" value={formData.goalForTonight} onChange={updateFormData} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                <option value="" disabled>Select a goal...</option>
                <option value="Learn something">Learn something</option>
                <option value="Meet new people">Meet new people</option>
                <option value="Find talent/jobs">Find talent/jobs</option>
                <option value="Promote business">Promote business</option>
                <option value="Other">Other</option>
            </select>
        </div>
        {formData.goalForTonight && (
            <div className="animate-in fade-in slide-in-from-top-2">
                <label htmlFor="goalDetail" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Details (Optional)</label>
                <textarea id="goalDetail" name="goalDetail" rows={2} value={formData.goalDetail} onChange={updateFormData} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="Specific interests..." />
            </div>
        )}
    </div>
);

// --- Main Component ---
export default function EnrichmentForm({ leadId }: EnrichmentFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<EnrichmentData>({ company: '', title: '', isFirstTime: true, goalForTonight: '', goalDetail: '' });
    const [errors, setErrors] = useState<Partial<Record<keyof EnrichmentData, string>>>({});

    const steps = [
        { label: "Role", component: ProfessionalInfoStep, validation: ['company', 'title'] },
        { label: "Goals", component: GoalsStep, validation: ['goalForTonight'] }
    ];

    const validateStep = () => {
        const fields = steps[currentStep].validation as (keyof EnrichmentData)[];
        const newErrors: any = {};
        fields.forEach(f => { if (!formData[f]) newErrors[f] = 'Required'; });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

            // Redirect to Hub with confetti param?
            router.push(`/hub/hello-world?id=${leadId}&new=true`);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    const handleNext = () => { if (validateStep()) setCurrentStep(prev => prev + 1); };
    const CurrentStepComponent = steps[currentStep].component;

    return (
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="bg-blue-600 p-6 text-center">
                <div className="mx-auto bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                    <RocketIcon className="text-white w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Almost there!</h2>
                <p className="text-blue-100 text-sm">Complete your profile to join the network.</p>
            </div>

            <div className="p-6">
                <ProgressSteps steps={steps} currentStep={currentStep} />

                <div className="min-h-[220px] py-4">
                    <CurrentStepComponent formData={formData} updateFormData={(e) => {
                        const { name, value, type } = e.target;
                        // @ts-ignore
                        setFormData(p => ({ ...p, [name]: type === 'radio' ? value === 'true' : value }));
                        setErrors(p => ({ ...p, [name]: undefined }));
                    }} errors={errors} />
                </div>

                <div className="flex justify-between mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={() => setCurrentStep(p => Math.max(0, p - 1))} disabled={currentStep === 0} className="text-gray-500 disabled:opacity-30 flex items-center gap-1 text-sm font-medium"><ChevronLeft className="w-4 h-4" /> Back</button>

                    {currentStep === steps.length - 1 ? (
                        <button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Finish <Check className="w-4 h-4" /></>}
                        </button>
                    ) : (
                        <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all">
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
