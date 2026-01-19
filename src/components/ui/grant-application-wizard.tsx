"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ChevronLeft,
    Loader2,
    Rocket,
    Building2,
    Users,
    Wallet,
    CheckCircle2,
    FileCheck,
    Shield,
    AlertTriangle,
    XCircle,
    Calendar,
    Briefcase,
    GraduationCap
} from 'lucide-react';
import { useIdentity } from '@/context/IdentityContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================
interface IWTGrantData {
    // Contact Info
    contactName: string;
    contactEmail: string;
    contactPhone: string;

    // Business Info
    businessName: string;
    businessAddress: string;
    ein: string;

    // Business Eligibility (Yes/No)
    hasBusinessLicense: boolean | null;
    hasWorkersComp: boolean | null;
    hasLiabilityInsurance: boolean | null;
    hasPayrollSystems: boolean | null;

    // Training Purpose (must select at least one)
    purposeAvertLayoff: boolean;
    purposeWageIncrease: boolean;
    purposePromotion: boolean;
    purposeTitleChange: boolean;

    // Employee/Trainee Info
    traineeCount: string;
    employeesWorkAuthorized: boolean | null;
    employeesPerformanceQualified: boolean | null;

    // Commitments
    commitToRetention: boolean | null;
    willDisplaceEmployees: boolean | null;
    trainingAlreadyStarted: boolean | null;

    // Training Details
    trainingType: string;
    trainingProvider: string;
    estimatedCost: string;
    preferredTimeline: string;

    // Certification
    certificationAgreed: boolean;
}

const initialData: IWTGrantData = {
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    businessName: "",
    businessAddress: "",
    ein: "",
    hasBusinessLicense: null,
    hasWorkersComp: null,
    hasLiabilityInsurance: null,
    hasPayrollSystems: null,
    purposeAvertLayoff: false,
    purposeWageIncrease: false,
    purposePromotion: false,
    purposeTitleChange: false,
    traineeCount: "",
    employeesWorkAuthorized: null,
    employeesPerformanceQualified: null,
    commitToRetention: null,
    willDisplaceEmployees: null,
    trainingAlreadyStarted: null,
    trainingType: "",
    trainingProvider: "Social Alignment / Tech Alley",
    estimatedCost: "",
    preferredTimeline: "",
    certificationAgreed: false
};

const STEPS = [
    { id: 'contact', title: 'Contact', icon: Users, description: 'Your Information' },
    { id: 'business', title: 'Business', icon: Building2, description: 'Eligibility Check' },
    { id: 'purpose', title: 'Purpose', icon: Briefcase, description: 'Training Goals' },
    { id: 'employees', title: 'Employees', icon: Shield, description: 'Trainee Requirements' },
    { id: 'training', title: 'Training', icon: GraduationCap, description: 'Program Details' },
    { id: 'review', title: 'Review', icon: FileCheck, description: 'Final Certification' }
];

// =============================================================================
// COMPONENT
// =============================================================================
export default function IWTGrantQualifier({
    onSubmit,
    isSubmitting,
    initialValues,
    calendarLink = "https://calendly.com/your-link"
}: {
    onSubmit: (data: IWTGrantData, status: 'qualified' | 'disqualified' | 'needs_review') => void;
    isSubmitting: boolean;
    initialValues?: Partial<IWTGrantData>;
    calendarLink?: string;
}) {
    const [step, setStep] = useState(() => {
        // Skip contact step if we have the basics
        if (initialValues?.contactName && initialValues?.contactEmail) {
            return 1;
        }
        return 0;
    });
    const [showResult, setShowResult] = useState(false);
    const { leadId, userName } = useIdentity();

    const [formData, setFormData] = useState<IWTGrantData>({
        ...initialData,
        ...initialValues,
        contactName: initialValues?.contactName || userName || "",
        contactEmail: initialValues?.contactEmail || "",
        contactPhone: initialValues?.contactPhone || "",
    });

    // Auto-skip step 0 if contact info arrives late (async)
    React.useEffect(() => {
        if (step === 0 && initialValues?.contactName && initialValues?.contactEmail) {
            setStep(1);
        }
    }, [initialValues, step]);

    // ==========================================================================
    // QUALIFICATION LOGIC
    // ==========================================================================
    const qualificationStatus = useMemo(() => {
        const disqualifiers: string[] = [];
        const warnings: string[] = [];

        // Hard disqualifiers
        if (formData.employeesWorkAuthorized === false) {
            disqualifiers.push("Employees must be legally authorized to work in the US with valid I-9 documentation");
        }
        if (formData.commitToRetention === false) {
            disqualifiers.push("Must commit to retaining employees for 3 months after training");
        }
        if (formData.willDisplaceEmployees === true) {
            disqualifiers.push("Training cannot result in displacement of other employees");
        }
        if (formData.trainingAlreadyStarted === true) {
            disqualifiers.push("Training must not have started before agreement execution");
        }

        // Soft warnings (needs review)
        if (formData.hasBusinessLicense === false) {
            warnings.push("Business license is required");
        }
        if (formData.hasWorkersComp === false) {
            warnings.push("Workers' Compensation insurance is required");
        }
        if (formData.hasLiabilityInsurance === false) {
            warnings.push("General Liability insurance is required");
        }
        if (formData.hasPayrollSystems === false) {
            warnings.push("Adequate payroll/accounting systems are required");
        }

        // Check training purpose
        const hasPurpose = formData.purposeAvertLayoff || formData.purposeWageIncrease ||
            formData.purposePromotion || formData.purposeTitleChange;
        if (!hasPurpose && step >= 2) {
            warnings.push("Must select at least one training purpose");
        }

        // Check cost limit
        const cost = parseFloat(formData.estimatedCost) || 0;
        if (cost > 10000) {
            warnings.push("Maximum reimbursement is $10,000 - you may need to cover the difference");
        }

        if (disqualifiers.length > 0) {
            return { status: 'disqualified' as const, disqualifiers, warnings };
        }
        if (warnings.length > 0) {
            return { status: 'needs_review' as const, disqualifiers, warnings };
        }
        return { status: 'qualified' as const, disqualifiers, warnings };

    }, [formData, step]);

    // ==========================================================================
    // FIELD UPDATERS
    // ==========================================================================
    const updateField = <K extends keyof IWTGrantData>(field: K, value: IWTGrantData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // ==========================================================================
    // NAVIGATION
    // ==========================================================================
    const handleNext = () => {
        if (step === STEPS.length - 1) {
            setShowResult(true);
            onSubmit(formData, qualificationStatus.status);
        } else {
            setStep(prev => Math.min(prev + 1, STEPS.length - 1));
        }
    };

    const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

    // ==========================================================================
    // STEP VALIDATION
    // ==========================================================================
    const isStepValid = (): boolean => {
        switch (step) {
            case 0: // Contact
                return formData.contactName.length > 2 &&
                    formData.contactEmail.includes('@') &&
                    formData.contactPhone.length > 9;
            case 1: // Business Eligibility
                return formData.businessName.length > 2 &&
                    formData.hasBusinessLicense !== null &&
                    formData.hasWorkersComp !== null &&
                    formData.hasLiabilityInsurance !== null;
            case 2: // Purpose
                return formData.purposeAvertLayoff || formData.purposeWageIncrease ||
                    formData.purposePromotion || formData.purposeTitleChange;
            case 3: // Employees
                return formData.traineeCount !== "" &&
                    formData.employeesWorkAuthorized !== null &&
                    formData.commitToRetention !== null &&
                    formData.willDisplaceEmployees !== null &&
                    formData.trainingAlreadyStarted !== null;
            case 4: // Training Details
                return formData.trainingType.length > 10 &&
                    formData.estimatedCost !== "" &&
                    formData.preferredTimeline !== "";
            case 5: // Review
                return formData.certificationAgreed;
            default:
                return false;
        }
    };

    // ==========================================================================
    // YES/NO BUTTON COMPONENT
    // ==========================================================================
    const YesNoButtons = ({
        value,
        onChange,
        yesLabel = "Yes",
        noLabel = "No",
        yesIsGood = true
    }: {
        value: boolean | null;
        onChange: (val: boolean) => void;
        yesLabel?: string;
        noLabel?: string;
        yesIsGood?: boolean;
    }) => (
        <div className="flex gap-3">
            <button
                type="button"
                onClick={() => onChange(true)}
                className={cn(
                    "flex-1 py-4 px-6 rounded-xl border-2 font-semibold transition-all text-lg",
                    value === true
                        ? yesIsGood
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20"
                            : "bg-red-500/20 border-red-500 text-red-300 shadow-lg shadow-red-500/20"
                        : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-600"
                )}
            >
                {yesLabel}
            </button>
            <button
                type="button"
                onClick={() => onChange(false)}
                className={cn(
                    "flex-1 py-4 px-6 rounded-xl border-2 font-semibold transition-all text-lg",
                    value === false
                        ? !yesIsGood
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20"
                            : "bg-red-500/20 border-red-500 text-red-300 shadow-lg shadow-red-500/20"
                        : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-600"
                )}
            >
                {noLabel}
            </button>
        </div>
    );

    // ==========================================================================
    // RESULT SCREEN
    // ==========================================================================
    if (showResult) {
        return (
            <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl bg-[#0F172A]/90 p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        {qualificationStatus.status === 'qualified' && (
                            <>
                                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">You Appear to Qualify!</h2>
                                <p className="text-slate-300 text-lg max-w-md mx-auto">
                                    Based on your responses, you may be eligible for up to <span className="text-emerald-400 font-bold">$10,000</span> in IWT grant funding.
                                </p>
                                <Button
                                    onClick={() => window.open(calendarLink, '_blank')}
                                    className="px-8 py-6 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl shadow-lg"
                                >
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Book Your Discovery Call
                                </Button>
                            </>
                        )}

                        {qualificationStatus.status === 'needs_review' && (
                            <>
                                <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <AlertTriangle className="w-12 h-12 text-amber-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Let's Talk</h2>
                                <p className="text-slate-300 text-lg max-w-md mx-auto">
                                    We have a few questions about your eligibility. Book a call to discuss your options.
                                </p>
                                <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4 text-left max-w-md mx-auto">
                                    <p className="text-amber-200 font-medium mb-2">Items to discuss:</p>
                                    <ul className="text-amber-100/70 text-sm space-y-1">
                                        {qualificationStatus.warnings.map((w, i) => (
                                            <li key={i}>• {w}</li>
                                        ))}
                                    </ul>
                                </div>
                                <Button
                                    onClick={() => window.open(calendarLink, '_blank')}
                                    className="px-8 py-6 text-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl shadow-lg"
                                >
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Book a Call to Discuss
                                </Button>
                            </>
                        )}

                        {qualificationStatus.status === 'disqualified' && (
                            <>
                                <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                                    <XCircle className="w-12 h-12 text-red-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Not a Match Right Now</h2>
                                <p className="text-slate-300 text-lg max-w-md mx-auto">
                                    Based on your responses, this grant may not be the right fit at this time.
                                </p>
                                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-left max-w-md mx-auto">
                                    <p className="text-red-200 font-medium mb-2">Reasons:</p>
                                    <ul className="text-red-100/70 text-sm space-y-1">
                                        {qualificationStatus.disqualifiers.map((d, i) => (
                                            <li key={i}>• {d}</li>
                                        ))}
                                    </ul>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    Have questions? <a href={calendarLink} className="text-emerald-400 underline">Contact us anyway</a> - we may have other options.
                                </p>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    // ==========================================================================
    // MAIN FORM RENDER
    // ==========================================================================
    return (
        <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl relative bg-[#0F172A]/80">
            {/* Header */}
            <div className="bg-slate-900/90 px-6 md:px-8 py-6 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 opacity-50" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 z-10">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center border border-emerald-500/20">
                            {React.createElement(STEPS[step].icon, { className: "w-6 h-6 text-emerald-400" })}
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">IWT Grant Qualifier</h2>
                            <p className="text-slate-400 text-sm">
                                Step {step + 1} of {STEPS.length}: <span className="text-emerald-400">{STEPS[step].description}</span>
                            </p>
                            {step > 0 && formData.contactName && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full w-fit">
                                    <Users className="w-3 h-3" />
                                    <span>Connected as <span className="text-slate-300">{formData.contactName}</span></span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Pills */}
                    <div className="flex items-center gap-1.5">
                        {STEPS.map((s, i) => (
                            <div
                                key={s.id}
                                className={cn(
                                    "w-8 md:w-10 h-1.5 rounded-full transition-all duration-500",
                                    i < step ? "bg-emerald-500" :
                                        i === step ? "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                                            "bg-slate-800"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="p-6 md:p-8 min-h-[400px] bg-slate-900/50 backdrop-blur-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="max-w-2xl mx-auto"
                    >
                        {/* STEP 0: Contact Information */}
                        {step === 0 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-base font-medium text-slate-200">Full Name *</Label>
                                    <Input
                                        className="bg-slate-950 border-slate-800 h-14 text-lg focus:border-emerald-500"
                                        placeholder="John Smith"
                                        value={formData.contactName}
                                        onChange={(e) => updateField('contactName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-base font-medium text-slate-200">Email Address *</Label>
                                    <Input
                                        type="email"
                                        className="bg-slate-950 border-slate-800 h-14 text-lg focus:border-emerald-500"
                                        placeholder="john@company.com"
                                        value={formData.contactEmail}
                                        onChange={(e) => updateField('contactEmail', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-base font-medium text-slate-200">Phone Number *</Label>
                                    <Input
                                        type="tel"
                                        className="bg-slate-950 border-slate-800 h-14 text-lg focus:border-emerald-500"
                                        placeholder="(702) 555-1234"
                                        value={formData.contactPhone}
                                        onChange={(e) => updateField('contactPhone', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 1: Business Eligibility */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-base font-medium text-slate-200">Business Name *</Label>
                                    <Input
                                        className="bg-slate-950 border-slate-800 h-14 text-lg focus:border-emerald-500"
                                        placeholder="ABC Company, LLC"
                                        value={formData.businessName}
                                        onChange={(e) => updateField('businessName', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-medium text-slate-200">
                                        Do you have a current local business license? *
                                    </Label>
                                    <YesNoButtons
                                        value={formData.hasBusinessLicense}
                                        onChange={(v) => updateField('hasBusinessLicense', v)}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-medium text-slate-200">
                                        Does your business carry Workers' Compensation insurance? *
                                    </Label>
                                    <YesNoButtons
                                        value={formData.hasWorkersComp}
                                        onChange={(v) => updateField('hasWorkersComp', v)}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-medium text-slate-200">
                                        Does your business carry General Liability insurance? *
                                    </Label>
                                    <YesNoButtons
                                        value={formData.hasLiabilityInsurance}
                                        onChange={(v) => updateField('hasLiabilityInsurance', v)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Training Purpose */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl">
                                    <p className="text-emerald-100 text-sm">
                                        <strong>Select at least one:</strong> What is the primary goal of this training?
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { key: 'purposeAvertLayoff', label: 'Avert Potential Layoffs', desc: 'Training will help prevent employee layoffs' },
                                        { key: 'purposeWageIncrease', label: 'Increase Employee Wages', desc: 'Employee will receive a wage increase after training' },
                                        { key: 'purposePromotion', label: 'Promote Employee', desc: 'Employee will be promoted to a new role' },
                                        { key: 'purposeTitleChange', label: 'Change Employee Title', desc: 'Employee will receive a new job title' },
                                    ].map((item) => (
                                        <div
                                            key={item.key}
                                            onClick={() => updateField(item.key as keyof IWTGrantData, !formData[item.key as keyof IWTGrantData])}
                                            className={cn(
                                                "flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all",
                                                formData[item.key as keyof IWTGrantData]
                                                    ? "bg-emerald-900/30 border-emerald-500 shadow-lg shadow-emerald-500/10"
                                                    : "bg-slate-800/30 border-slate-700 hover:border-slate-500"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-4 transition-colors",
                                                formData[item.key as keyof IWTGrantData]
                                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                                    : "border-slate-500 bg-transparent"
                                            )}>
                                                {formData[item.key as keyof IWTGrantData] && <CheckCircle2 className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className={cn(
                                                    "font-semibold text-lg",
                                                    formData[item.key as keyof IWTGrantData] ? "text-emerald-100" : "text-slate-300"
                                                )}>
                                                    {item.label}
                                                </p>
                                                <p className="text-slate-400 text-sm">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Employee Requirements */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-base font-medium text-slate-200">
                                        How many employees do you want to train? *
                                    </Label>
                                    <Select value={formData.traineeCount} onValueChange={(v) => updateField('traineeCount', v)}>
                                        <SelectTrigger className="bg-slate-950 border-slate-800 h-14 text-lg text-slate-200">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? 'employee' : 'employees'}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-medium text-slate-200">
                                        Are all trainees legally authorized to work in the US? *
                                    </Label>
                                    <p className="text-slate-400 text-sm">Must have valid I-9 documentation on file</p>
                                    <YesNoButtons
                                        value={formData.employeesWorkAuthorized}
                                        onChange={(v) => updateField('employeesWorkAuthorized', v)}
                                    />
                                    {formData.employeesWorkAuthorized === false && (
                                        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
                                            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                            <p className="text-red-200 text-sm">This is a requirement for IWT funding.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-medium text-slate-200">
                                        Can you commit to retaining trained employees for at least 3 months? *
                                    </Label>
                                    <YesNoButtons
                                        value={formData.commitToRetention}
                                        onChange={(v) => updateField('commitToRetention', v)}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-medium text-slate-200">
                                        Will this training displace any other employees? *
                                    </Label>
                                    <YesNoButtons
                                        value={formData.willDisplaceEmployees}
                                        onChange={(v) => updateField('willDisplaceEmployees', v)}
                                        yesIsGood={false}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-medium text-slate-200">
                                        Has this training already started? *
                                    </Label>
                                    <YesNoButtons
                                        value={formData.trainingAlreadyStarted}
                                        onChange={(v) => updateField('trainingAlreadyStarted', v)}
                                        yesIsGood={false}
                                    />
                                    {formData.trainingAlreadyStarted === true && (
                                        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
                                            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                            <p className="text-red-200 text-sm">Training costs incurred before agreement execution are not reimbursable.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 4: Training Details */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-base font-medium text-slate-200">
                                        What type of training are you seeking? *
                                    </Label>
                                    <Textarea
                                        className="bg-slate-950 border-slate-800 focus:border-emerald-500 min-h-[100px] text-lg p-4"
                                        placeholder="e.g., AI workflow automation, project management certification, leadership development..."
                                        value={formData.trainingType}
                                        onChange={(e) => updateField('trainingType', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-base font-medium text-slate-200">Training Provider</Label>
                                    <Input
                                        className="bg-slate-950 border-slate-800 h-14 text-lg focus:border-emerald-500"
                                        value={formData.trainingProvider}
                                        onChange={(e) => updateField('trainingProvider', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-base font-medium text-slate-200">Estimated Total Cost *</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">$</span>
                                            <Input
                                                type="number"
                                                className="bg-slate-950 border-slate-800 h-14 text-lg pl-8 focus:border-emerald-500"
                                                placeholder="5000"
                                                value={formData.estimatedCost}
                                                onChange={(e) => updateField('estimatedCost', e.target.value)}
                                            />
                                        </div>
                                        <p className="text-slate-400 text-xs">Maximum reimbursement: $10,000</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-base font-medium text-slate-200">Preferred Timeline *</Label>
                                        <Select value={formData.preferredTimeline} onValueChange={(v) => updateField('preferredTimeline', v)}>
                                            <SelectTrigger className="bg-slate-950 border-slate-800 h-14 text-lg text-slate-200">
                                                <SelectValue placeholder="When do you want to start?" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                                <SelectItem value="asap">As soon as possible</SelectItem>
                                                <SelectItem value="30days">Within 30 days</SelectItem>
                                                <SelectItem value="60days">1-2 months</SelectItem>
                                                <SelectItem value="90days">3+ months</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: Review & Certification */}
                        {step === 5 && (
                            <div className="space-y-6">
                                {/* Summary Card */}
                                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                                    <h3 className="text-lg font-semibold text-white mb-4">Application Summary</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-slate-400">Contact</p>
                                            <p className="text-slate-200">{formData.contactName}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400">Business</p>
                                            <p className="text-slate-200">{formData.businessName}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400">Trainees</p>
                                            <p className="text-slate-200">{formData.traineeCount} employee(s)</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400">Estimated Cost</p>
                                            <p className="text-emerald-400 font-semibold">${formData.estimatedCost}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Qualification Status Preview */}
                                {qualificationStatus.status === 'qualified' && (
                                    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                        <p className="text-emerald-100">Looking good! You appear to meet the basic eligibility requirements.</p>
                                    </div>
                                )}

                                {qualificationStatus.warnings.length > 0 && (
                                    <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                                            <p className="text-amber-200 font-medium">Items to review:</p>
                                        </div>
                                        <ul className="text-amber-100/70 text-sm space-y-1 ml-7">
                                            {qualificationStatus.warnings.map((w, i) => (
                                                <li key={i}>• {w}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Certification */}
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex items-start space-x-3 p-4 bg-slate-800/40 rounded-xl border border-white/5">
                                        <Checkbox
                                            id="certification"
                                            checked={formData.certificationAgreed}
                                            onCheckedChange={(c) => updateField('certificationAgreed', !!c)}
                                            className="mt-1 border-emerald-500 data-[state=checked]:bg-emerald-500"
                                        />
                                        <label
                                            htmlFor="certification"
                                            className="text-sm leading-relaxed text-slate-200 cursor-pointer"
                                        >
                                            I certify that the information provided is accurate to the best of my knowledge.
                                            I understand that submitting this form does not guarantee grant approval, and that
                                            training must not begin until an agreement is fully executed with Workforce Connections.
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="bg-slate-900/80 px-6 md:px-8 py-5 border-t border-white/5 flex items-center justify-between backdrop-blur-md">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === 0 || isSubmitting}
                    className="text-slate-400 hover:text-white hover:bg-white/5"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={!isStepValid() || isSubmitting}
                    className={cn(
                        "px-6 py-5 text-base rounded-xl transition-all",
                        step === STEPS.length - 1
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                            : "bg-white text-slate-900 hover:bg-slate-200"
                    )}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Checking...
                        </>
                    ) : step === STEPS.length - 1 ? (
                        <>
                            Check My Eligibility
                            <Rocket className="ml-2 h-5 w-5" />
                        </>
                    ) : (
                        <>
                            Continue <ChevronRight className="ml-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

