"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// --- Types ---
export interface LeadFormData {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    title: string;
    isFirstTime: boolean;
    goalForTonight: string;
    goalDetail: string;
}

interface StepProps {
    formData: LeadFormData;
    updateFormData: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    errors: Partial<Record<keyof LeadFormData, string>>;
}

interface MultiStepFormProps {
    onSubmit: (data: LeadFormData) => Promise<void>;
    isSubmitting?: boolean;
}

// --- Progress Indicator Component ---
const ProgressSteps = ({ steps, currentStep }: { steps: { label: string }[], currentStep: number }) => {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-center">
                {steps.map((step, i) => (
                    <React.Fragment key={i}>
                        {/* Step circle */}
                        <div className="relative z-10">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${i < currentStep
                                    ? "bg-blue-600 text-white"
                                    : i === currentStep
                                        ? "bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900/30"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                {i < currentStep ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <span className="text-sm font-medium">{i + 1}</span>
                                )}
                            </div>

                            {/* Step label */}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <span
                                    className={`text-xs font-medium ${i <= currentStep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        </div>

                        {/* Connector line */}
                        {i < steps.length - 1 && (
                            <div
                                className={`flex-auto border-t-2 transition-colors duration-300 mx-2 ${i < currentStep ? "border-blue-600" : "border-gray-200 dark:border-gray-700"
                                    }`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

// --- Form Steps Components ---

const PersonalInfoStep: React.FC<StepProps> = ({ formData, updateFormData, errors }) => (
    <div className="space-y-4">
        <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Full Name
            </label>
            <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={updateFormData}
                className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors ${errors.fullName
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900'
                    }`}
                placeholder="Jane Doe"
            />
            {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
        </div>

        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Email Address
            </label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={updateFormData}
                className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors ${errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900'
                    }`}
                placeholder="jane@example.com"
            />
            {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
        </div>

        <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Phone Number
            </label>
            <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={updateFormData}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
                placeholder="(123) 456-7890"
            />
        </div>
    </div>
);

const ProfessionalInfoStep: React.FC<StepProps> = ({ formData, updateFormData, errors }) => (
    <div className="space-y-4">
        <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Company / Organization
            </label>
            <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={updateFormData}
                className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors ${errors.company
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900'
                    }`}
                placeholder="Acme Inc."
            />
            {errors.company && (
                <p className="mt-1 text-sm text-red-500">{errors.company}</p>
            )}
        </div>

        <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Job Title
            </label>
            <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={updateFormData}
                className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors ${errors.title
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900'
                    }`}
                placeholder="Software Engineer"
            />
            {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
        </div>
    </div>
);

const AdditionalInfoStep: React.FC<StepProps> = ({ formData, updateFormData }) => (
    <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-5 border border-blue-100 dark:border-blue-900/30">
            <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Welcome to Tech Alley Henderson!</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-4 break-words">
                We love meeting new people. Is this your first time attending a Tech Alley Henderson event?
            </p>

            <div className="space-y-3">
                <label className="flex items-center cursor-pointer group">
                    <input
                        name="isFirstTime"
                        type="radio"
                        checked={formData.isFirstTime === true}
                        onChange={() => {
                            // Force true
                            const e = { target: { name: 'isFirstTime', value: 'true', type: 'radio' } } as any;
                            updateFormData(e);
                        }}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 bg-white dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-blue-600"
                    />
                    <span className="ml-3 block text-sm font-medium text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Yes, this is my first time!
                    </span>
                </label>
                <label className="flex items-center cursor-pointer group">
                    <input
                        name="isFirstTime"
                        type="radio"
                        checked={formData.isFirstTime === false}
                        onChange={() => {
                            // Force false
                            const e = { target: { name: 'isFirstTime', value: 'false', type: 'radio' } } as any;
                            updateFormData(e);
                        }}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 bg-white dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-blue-600"
                    />
                    <span className="ml-3 block text-sm font-medium text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        No, I've attended before.
                    </span>
                </label>
            </div>
        </div>

        <div>
            <label htmlFor="goalForTonight" className="block font-medium text-gray-700 dark:text-white mb-2">
                What is one thing you wish to gain from your experience here tonight?
            </label>
            <div className="relative">
                <select
                    id="goalForTonight"
                    name="goalForTonight"
                    value={formData.goalForTonight}
                    onChange={updateFormData}
                    className="w-full px-4 py-3 border rounded-xl focus:ring focus:ring-opacity-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900 leading-relaxed appearance-none bg-white"
                >
                    <option value="" disabled>Select a goal...</option>
                    <option value="Learn something">Learn something</option>
                    <option value="Meet new people">Meet new people</option>
                    <option value="Solve a specific problem">Solve a specific problem</option>
                    <option value="Promote my business">Promote my business</option>
                    <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <ChevronRight className="w-5 h-5 text-gray-400 rotate-90" />
                </div>
            </div>
        </div>

        {formData.goalForTonight === "Solve a specific problem" && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label htmlFor="goalDetail" className="block font-medium text-gray-700 dark:text-white mb-2">
                    Please let us know what would help you tonight specifically:
                </label>
                <textarea
                    id="goalDetail"
                    name="goalDetail"
                    rows={3}
                    value={formData.goalDetail || ''}
                    onChange={updateFormData}
                    className="w-full px-4 py-3 border rounded-xl focus:ring focus:ring-opacity-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-900 resize-none leading-relaxed"
                    placeholder="I'm looking for a React developer..."
                />
            </div>
        )}
    </div>
);

const ReviewStep: React.FC<{ formData: LeadFormData }> = ({ formData }) => (
    <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                Personal Details
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm pl-3 border-l-2 border-gray-100 dark:border-gray-700 ml-1.5">
                <div>
                    <span className="text-gray-500 dark:text-gray-400">Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-2">{formData.fullName}</span>
                </div>
                <div>
                    <span className="text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-2">{formData.email}</span>
                </div>
                <div>
                    <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-2">{formData.phone || 'N/A'}</span>
                </div>
            </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-sky-500 rounded-full"></span>
                Professional Info
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm pl-3 border-l-2 border-gray-100 dark:border-gray-700 ml-1.5">
                <div>
                    <span className="text-gray-500 dark:text-gray-400">Company:</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-2">{formData.company}</span>
                </div>
                <div>
                    <span className="text-gray-500 dark:text-gray-400">Title:</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-2">{formData.title}</span>
                </div>
            </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                Misc
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm pl-3 border-l-2 border-gray-100 dark:border-gray-700 ml-1.5">
                <div>
                    <span className="font-medium text-blue-600 dark:text-blue-400 ml-2">
                        {formData.isFirstTime ? "Yes" : "No"}
                    </span>
                </div>
                {formData.goalForTonight && (
                    <div className="mt-2">
                        <span className="text-gray-500 dark:text-gray-400 block mb-1">Goal for tonight:</span>
                        <p className="font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 p-2 rounded-md border border-gray-100 dark:border-gray-600">
                            {formData.goalForTonight}
                            {formData.goalDetail && (
                                <span className="block mt-1 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-1">
                                    {formData.goalDetail}
                                </span>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

// --- Main Component ---
const MultiStepForm: React.FC<MultiStepFormProps> = ({ onSubmit, isSubmitting: parentIsSubmitting }) => {
    const steps = [
        { label: "Contact", component: PersonalInfoStep, validationFields: ['fullName', 'email'] as (keyof LeadFormData)[] },
        { label: "Work", component: ProfessionalInfoStep, validationFields: ['company', 'title'] as (keyof LeadFormData)[] },
        { label: "Welcome", component: AdditionalInfoStep, validationFields: ['goalForTonight'] as (keyof LeadFormData)[] },
        { label: "Review", component: ReviewStep, validationFields: [] as (keyof LeadFormData)[] },
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<LeadFormData>({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        isFirstTime: false,
        goalForTonight: '',
        goalDetail: ''
    });
    const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
    const [direction, setDirection] = useState<"right" | "left">("right");

    const validateStep = () => {
        const currentValidationFields = steps[currentStep].validationFields;
        const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

        currentValidationFields.forEach(field => {
            // Basic required field validation
            if (!formData[field]) {
                // @ts-ignore
                newErrors[field] = 'This field is required';
            }

            // Email validation
            if (field === 'email' && formData.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    newErrors.email = 'Please enter a valid email address';
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let newValue: any = value;

        if (type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
        } else if (name === 'isFirstTime') {
            // Unify radio button handling for isFirstTime to boolean
            newValue = value === 'true';
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Clear error when field is changed
        if (errors[name as keyof LeadFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            if (validateStep()) {
                setDirection("right");
                setCurrentStep(prev => prev + 1);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setDirection("left");
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep()) {
            onSubmit(formData);
        }
    };

    const CurrentStepComponent = steps[currentStep].component;

    // Animation variants for sliding effect
    const slideVariants = {
        hidden: (direction: "right" | "left") => ({
            x: direction === "right" ? 50 : -50,
            opacity: 0,
        }),
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 30,
            }
        },
        exit: (direction: "right" | "left") => ({
            x: direction === "right" ? -50 : 50,
            opacity: 0,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 30,
            }
        })
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <ProgressSteps steps={steps} currentStep={currentStep} />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="min-h-[300px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={slideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="py-2"
                        >
                            {/* @ts-ignore */}
                            <CurrentStepComponent
                                formData={formData}
                                updateFormData={handleInputChange}
                                errors={errors}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-6">
                    <button
                        type="button"
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentStep === 0
                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                            }`}
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                    >
                        <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    {currentStep === steps.length - 1 ? (
                        <button
                            type="submit"
                            disabled={parentIsSubmitting}
                            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-blue-500/20"
                        >
                            {parentIsSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Registration <Check className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center shadow-lg shadow-blue-500/20"
                            onClick={handleNext}
                        >
                            Next Step <ChevronRight className="w-4 h-4 ml-2" />
                        </button>
                    )}
                </div>
            </form>

        </div>
    );
};

export default MultiStepForm;
