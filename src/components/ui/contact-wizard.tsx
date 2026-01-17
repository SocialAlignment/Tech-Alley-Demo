"use client"

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have this or will use Input for now
import { Info, Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// --- Progress Indicator ---
const ProgressSteps = ({ steps, currentStep }: { steps: any[], currentStep: number }) => {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-center">
                {steps.map((step, i) => (
                    <React.Fragment key={i}>
                        <div className="relative">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${i < currentStep
                                    ? "bg-blue-600 text-white"
                                    : i === currentStep
                                        ? "bg-blue-500 text-white ring-4 ring-blue-500/30"
                                        : "bg-white/10 text-gray-500"
                                    }`}
                            >
                                {i < currentStep ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <span className="text-sm font-medium">{i + 1}</span>
                                )}
                            </div>

                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <span
                                    className={`text-xs font-medium ${i <= currentStep ? 'text-blue-400' : 'text-gray-500'
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        </div>

                        {i < steps.length - 1 && (
                            <div
                                className={`flex-auto w-12 md:w-24 border-t-2 transition-colors duration-300 mx-2 ${i < currentStep ? "border-blue-600" : "border-white/10"
                                    }`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

// --- Steps ---

const ConnectionStep = ({ formData, updateFormData }: any) => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" placeholder="(555) 123-4567" value={formData.phone} onChange={updateFormData} className="bg-black/20 border-white/10" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="schedulingLink">Scheduling Link (Calendly, etc.)</Label>
                <Input id="schedulingLink" name="schedulingLink" placeholder="cal.com/..." value={formData.schedulingLink} onChange={updateFormData} className="bg-black/20 border-white/10" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="hometown">Hometown</Label>
                <Input id="hometown" name="hometown" placeholder="City, State" value={formData.hometown} onChange={updateFormData} className="bg-black/20 border-white/10" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" name="timezone" placeholder="e.g. PST" value={formData.timezone} onChange={updateFormData} className="bg-black/20 border-white/10" />
            </div>
        </div>

        <div className="space-y-2">
            <Label>Social Profiles</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="instagram" placeholder="Instagram (@handle)" value={formData.instagram} onChange={updateFormData} className="bg-black/20 border-white/10" />
                <Input name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={updateFormData} className="bg-black/20 border-white/10" />
                <Input name="facebook" placeholder="Facebook URL" value={formData.facebook} onChange={updateFormData} className="bg-black/20 border-white/10" />
                <Input name="youtube" placeholder="YouTube URL" value={formData.youtube} onChange={updateFormData} className="bg-black/20 border-white/10" />
            </div>
        </div>
    </div>
);

const PreferencesStep = ({ formData, updateFormData, toggleCommPref, toggleLearningPref, setFormData }: any) => {
    const commOptions = ["Text/SMS", "Email", "Phone Call", "Social Media", "Scheduling Link"];
    const learningOptions = ["DFY (Done-For-You)", "DIY (Do It Yourself)", "Hybrid", "Live Workshop", "Online"];

    return (
        <div className="space-y-6">

            <div className="space-y-3">
                <Label>Communication Preferences</Label>
                <div className="flex flex-wrap gap-2">
                    {commOptions.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => toggleCommPref(opt)}
                            className={`px-3 py-1.5 rounded-md text-xs border transition-all ${formData.commPrefs.includes(opt)
                                ? "border-blue-500 bg-blue-500/20 text-blue-200"
                                : "border-white/10 bg-white/5 hover:bg-white/10 text-gray-400"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Label htmlFor="learningPreference">Learning Preference</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Info className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                        </PopoverTrigger>
                        <PopoverContent className="w-64 bg-slate-900 border-white/10 text-xs text-gray-300">
                            Please select your preferred engagement style use AND if Online or Live Workshop is preferred.
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-wrap gap-2">
                    {learningOptions.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => toggleLearningPref(opt)}
                            className={`px-3 py-1.5 rounded-md text-xs border transition-all ${(formData.learningPreference || []).includes(opt)
                                ? "border-cyan-500 bg-cyan-500/20 text-cyan-200"
                                : "border-white/10 bg-white/5 hover:bg-white/10 text-gray-400"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <Label>Best Time to Reach</Label>
                <Input name="bestTime" placeholder="e.g. Weekdays after 2pm" value={formData.bestTime} onChange={updateFormData} className="bg-black/20 border-white/10" />
            </div>
        </div>
    );
};

const IcebreakerStep = ({ formData, updateFormData }: any) => (
    <div className="space-y-6">
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Label htmlFor="askMeAbout" className="text-blue-400 font-medium">Ask Me About</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Info className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 bg-slate-900 border-white/10 text-xs text-gray-300">
                        Help others break the ice! Share a hobby, a passion, or a unique topic you love discussing.
                    </PopoverContent>
                </Popover>
            </div>
            <Textarea
                id="askMeAbout"
                name="askMeAbout"
                placeholder="I love talking about AI agents, classic cars, or creating sourdough..."
                value={formData.askMeAbout}
                onChange={updateFormData}
                className="bg-black/20 border-white/10 min-h-[80px]"
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="helpMeBy">You Can Help Me By...</Label>
            <Textarea
                id="helpMeBy"
                name="helpMeBy"
                placeholder="Connecting me with..."
                value={formData.helpMeBy}
                onChange={updateFormData}
                className="bg-black/20 border-white/10 min-h-[80px]"
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="helpYouBy">I Can Help You By...</Label>
            <Textarea
                id="helpYouBy"
                name="helpYouBy"
                placeholder="Sharing my expertise in..."
                value={formData.helpYouBy}
                onChange={updateFormData}
                className="bg-black/20 border-white/10 min-h-[80px]"
            />
        </div>
    </div>
);

// --- Main Wizard ---

export default function ContactWizard({ onSubmit, isSubmitting: parentSubmitting, initialData }: { onSubmit: (data: any) => void, isSubmitting?: boolean, initialData?: any }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState("right");
    const [formData, setFormData] = useState({
        phone: initialData?.phone || '',
        schedulingLink: initialData?.schedulingLink || '',
        instagram: initialData?.instagram || '',
        linkedin: initialData?.linkedin || '',
        facebook: initialData?.facebook || '',
        youtube: initialData?.youtube || '',
        hometown: initialData?.hometown || '',
        timezone: initialData?.timezone || '',
        learningPreference: initialData?.learningPreference || ([] as string[]),
        bestTime: initialData?.bestTime || '',
        commPrefs: initialData?.commPrefs || ([] as string[]),
        askMeAbout: initialData?.askMeAbout || '',
        helpMeBy: initialData?.helpMeBy || '',
        helpYouBy: initialData?.helpYouBy || ''
    });

    // Sync state with initialData when it loads
    React.useEffect(() => {
        console.log("ContactWizard: useEffect triggered by initialData", initialData);
        if (initialData) {
            console.log("ContactWizard: Setting formData with", initialData);
            setFormData(prev => {
                const newState = {
                    ...prev,
                    ...initialData,
                    learningPreference: initialData.learningPreference || [],
                    commPrefs: initialData.commPrefs || []
                };
                console.log("ContactWizard: New State Computed:", newState);
                return newState;
            });
        }
    }, [initialData]);

    console.log("ContactWizard: Render formData:", formData);

    const steps = [
        { label: "Connect", component: ConnectionStep },
        { label: "Connection Preferences", component: PreferencesStep },
        { label: "Icebreakers", component: IcebreakerStep }
    ];

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleCommPref = (opt: string) => {
        setFormData(prev => {
            const current = prev.commPrefs;
            const updated = current.includes(opt)
                ? current.filter(c => c !== opt)
                : [...current, opt];
            return { ...prev, commPrefs: updated };
        });
    };

    const toggleLearningPref = (opt: string) => {
        setFormData(prev => {
            const current = (prev.learningPreference as string[]) || []; // Safely handle if it was string
            const updated = current.includes(opt)
                ? current.filter((c: string) => c !== opt)
                : [...current, opt];
            return { ...prev, learningPreference: updated };
        });
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setDirection("right");
            setCurrentStep(prev => prev + 1);
        } else {
            onSubmit(formData);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setDirection("left");
            setCurrentStep(prev => prev - 1);
        }
    };

    const CurrentStepComponent = steps[currentStep].component;

    const slideVariants = {
        hidden: (direction: string) => ({
            x: direction === "right" ? 50 : -50,
            opacity: 0,
        }),
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        },
        exit: (direction: string) => ({
            x: direction === "right" ? -50 : 50,
            opacity: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        })
    };

    return (
        <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="px-8 pt-2">
                <ProgressSteps steps={steps} currentStep={currentStep} />
            </div>

            <div className="px-8 py-6 min-h-[400px]">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <CurrentStepComponent
                            formData={formData}
                            updateFormData={handleInputChange}
                            toggleCommPref={toggleCommPref}
                            toggleLearningPref={toggleLearningPref}
                            setFormData={setFormData}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="px-8 py-4 bg-white/5 border-t border-white/10 flex justify-between">
                <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={parentSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
                >
                    {parentSubmitting ? <Loader2 className="animate-spin" /> : (
                        currentStep === steps.length - 1 ? "Complete Profile" : "Next"
                    )}
                    {!parentSubmitting && currentStep !== steps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
                </Button>
            </div>
        </div>
    );
}
