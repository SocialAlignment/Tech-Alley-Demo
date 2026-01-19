'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { WarpBackground } from '@/components/ui/warp-background';
import { ArrowLeft, ArrowRight, Check, Loader2, Mic, Send, UserCheck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useIdentity } from '@/context/IdentityContext';
import { supabase } from '@/lib/supabase';

// Define the form data structure
interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    linkedin: string;
    hasSpokenBefore: string; // "yes" | "no"
    topicTitle: string;
    topicAbstract: string;
    targetAudience: string;
    callToAction: string;
    pastSpeakingExamples: string; // URLs
    willingToPodcast: string; // "yes" | "no"
    agreedToRecord: boolean;
}

const INITIAL_DATA: FormData = {
    firstName: '',
    lastName: '',
    email: '',
    linkedin: '',
    hasSpokenBefore: '',
    topicTitle: '',
    topicAbstract: '',
    targetAudience: '',
    callToAction: '',
    pastSpeakingExamples: '',
    willingToPodcast: '',
    agreedToRecord: false,
};

const STEPS = [
    {
        id: 'intro',
        title: 'Introduction',
        description: "Let's get to know you.",
        fields: ['firstName', 'lastName', 'email', 'linkedin']
    },
    {
        id: 'experience',
        title: 'Experience',
        description: 'Tell us about your speaking history.',
        fields: ['hasSpokenBefore', 'pastSpeakingExamples']
    },
    {
        id: 'topic',
        title: 'The Topic',
        description: 'What do you want to share?',
        fields: ['topicTitle', 'topicAbstract', 'targetAudience']
    },
    {
        id: 'impact',
        title: 'The Impact',
        description: 'What is the takeaway?',
        fields: ['callToAction', 'agreedToRecord']
    }
];

export default function SpeakerApplicationPage() {
    const router = useRouter();
    const { leadId, userName, email: contextEmail, refreshIdentity } = useIdentity();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);

    // Pre-fill data from IdentityContext and Supabase
    useEffect(() => {
        const loadUserData = async () => {
            if (!leadId) return;

            setIsLoadingProfile(true);
            try {
                // 1. Basic info from Context
                const names = userName?.split(' ') || [];
                const firstName = names[0] || '';
                const lastName = names.slice(1).join(' ') || '';

                setFormData(prev => ({
                    ...prev,
                    firstName: prev.firstName || firstName,
                    lastName: prev.lastName || lastName,
                    email: prev.email || contextEmail || '',
                }));

                // 2. Fetch extended details (LinkedIn) from Supabase
                const { data, error } = await supabase
                    .from('leads')
                    .select('linkedin')
                    .eq('id', leadId)
                    .single();

                if (data && !error) {
                    setFormData(prev => ({
                        ...prev,
                        linkedin: prev.linkedin || data.linkedin || ''
                    }));
                }
            } catch (error) {
                console.error("Failed to load user profile:", error);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        if (leadId) {
            loadUserData();
        }
    }, [leadId, userName, contextEmail]);

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            router.back();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Form Submitted:", formData);
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    const progress = ((currentStep + 1) / STEPS.length) * 100;

    if (isSuccess) {
        return (
            <main className="min-h-screen w-full bg-slate-950 relative overflow-hidden flex items-center justify-center text-white">
                <div className="fixed inset-0 z-0 bg-transparent pointer-events-none">
                    <WarpBackground className="w-full h-full" gridColor="rgba(56, 189, 248, 0.4)" />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 max-w-lg w-full p-8 bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl text-center shadow-[0_0_50px_rgba(6,182,212,0.3)]"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <Check className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-4xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Application Received!</h2>
                    <p className="text-slate-300 text-lg mb-8">
                        Thanks for stepping up. The Tech Alley team will review your submission and reach out soon.
                    </p>
                    <button
                        onClick={() => router.push('/hub/speakers')}
                        className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform"
                    >
                        Back to Speakers
                    </button>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center text-white p-4">
            {/* Background */}
            <div className="fixed inset-0 z-0 bg-transparent pointer-events-none">
                <WarpBackground className="w-full h-full" gridColor="rgba(139, 92, 246, 0.3)" />
            </div>

            {/* Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-slate-900/80 px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Mic className="w-6 h-6 text-fuchsia-400" />
                            Speaker Application
                        </h1>
                        {leadId ? (
                            <p className="text-cyan-400 text-sm flex items-center gap-1 mt-1">
                                <UserCheck className="w-3 h-3" /> Connected as {userName}
                            </p>
                        ) : (
                            <p className="text-slate-400 text-sm mt-1">Tech Alley Henderson & Dead Sprint Radio</p>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-cyan-400">Step {currentStep + 1} of {STEPS.length}</div>
                        <div className="h-1.5 w-32 bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-8 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">{STEPS[currentStep].title}</h2>
                                <p className="text-slate-400 text-lg">{STEPS[currentStep].description}</p>
                            </div>

                            {currentStep === 0 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                                            <Input
                                                id="firstName"
                                                className="bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500"
                                                value={formData.firstName}
                                                onChange={(e: { target: { value: any; }; }) => handleInputChange('firstName', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                className="bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500"
                                                value={formData.lastName}
                                                onChange={(e: { target: { value: any; }; }) => handleInputChange('lastName', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500"
                                            value={formData.email}
                                            onChange={(e: { target: { value: any; }; }) => handleInputChange('email', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin" className="text-slate-300">LinkedIn URL</Label>
                                        <Input
                                            id="linkedin"
                                            placeholder="https://linkedin.com/in/..."
                                            className="bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500"
                                            value={formData.linkedin}
                                            onChange={(e: { target: { value: any; }; }) => handleInputChange('linkedin', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-slate-300 text-base">Have you spoken live before?</Label>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleInputChange('hasSpokenBefore', 'yes')}
                                                className={`flex-1 py-4 rounded-xl border-2 transition-all ${formData.hasSpokenBefore === 'yes' ? 'border-cyan-500 bg-cyan-500/20 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-500'}`}
                                            >
                                                Yes, I have
                                            </button>
                                            <button
                                                onClick={() => handleInputChange('hasSpokenBefore', 'no')}
                                                className={`flex-1 py-4 rounded-xl border-2 transition-all ${formData.hasSpokenBefore === 'no' ? 'border-fuchsia-500 bg-fuchsia-500/20 text-white shadow-[0_0_15px_rgba(217,70,239,0.3)]' : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-500'}`}
                                            >
                                                No, this is my first time
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-slate-300 text-base">Willing to appear on the Podcast?</Label>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleInputChange('willingToPodcast', 'yes')}
                                                className={`flex-1 py-4 rounded-xl border-2 transition-all ${formData.willingToPodcast === 'yes' ? 'border-cyan-500 bg-cyan-500/20 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-500'}`}
                                            >
                                                Yes, I'd love to
                                            </button>
                                            <button
                                                onClick={() => handleInputChange('willingToPodcast', 'no')}
                                                className={`flex-1 py-4 rounded-xl border-2 transition-all ${formData.willingToPodcast === 'no' ? 'border-fuchsia-500 bg-fuchsia-500/20 text-white shadow-[0_0_15px_rgba(217,70,239,0.3)]' : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-500'}`}
                                            >
                                                No / Not right now
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pastExamples" className="text-slate-300">Past Speaking Examples (Optional)</Label>
                                        <p className="text-xs text-slate-500">Links to YouTube, Vimeo, or event pages.</p>
                                        <Textarea
                                            id="pastExamples"
                                            className="bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500 min-h-[120px]"
                                            value={formData.pastSpeakingExamples}
                                            onChange={(e: { target: { value: any; }; }) => handleInputChange('pastSpeakingExamples', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="topicTitle" className="text-slate-300">Proposed Topic Title</Label>
                                        <Input
                                            id="topicTitle"
                                            className="bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500"
                                            value={formData.topicTitle}
                                            onChange={(e: { target: { value: any; }; }) => handleInputChange('topicTitle', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="topicAbstract" className="text-slate-300">Abstract / Description</Label>
                                        <Textarea
                                            id="topicAbstract"
                                            className="bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500 min-h-[150px]"
                                            placeholder="What will the audience learn?"
                                            value={formData.topicAbstract}
                                            onChange={(e: { target: { value: any; }; }) => handleInputChange('topicAbstract', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="targetAudience" className="text-slate-300">Target Audience</Label>
                                        <Input
                                            id="targetAudience"
                                            placeholder="e.g. Founders, Developers, Students..."
                                            className="bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500"
                                            value={formData.targetAudience}
                                            onChange={(e: { target: { value: any; }; }) => handleInputChange('targetAudience', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="callToAction" className="text-slate-300">Your "Call to Action"</Label>
                                        <p className="text-xs text-slate-500">What should the audience DO after hearing you?</p>
                                        <Textarea
                                            id="callToAction"
                                            className="bg-slate-800/50 border-slate-700 text-white focus:border-cyan-500 min-h-[100px]"
                                            value={formData.callToAction}
                                            onChange={(e: { target: { value: any; }; }) => handleInputChange('callToAction', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-xl border border-white/5">
                                        <Checkbox
                                            id="record"
                                            checked={formData.agreedToRecord}
                                            onCheckedChange={(checked: any) => handleInputChange('agreedToRecord', checked)}
                                            className="border-slate-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor="record" className="text-slate-200 cursor-pointer font-medium">
                                                I understand sessions may be recorded/streamed.
                                            </Label>
                                            <p className="text-slate-500 text-xs">
                                                Tech Alley & Dead Sprint Radio reserve distribution rights.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Buttons */}
                <div className="bg-slate-900/40 px-8 py-6 flex justify-between items-center border-t border-white/5">
                    <button
                        onClick={handleBack}
                        className="px-6 py-2.5 rounded-xl text-slate-400 font-medium hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="px-8 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : currentStep === STEPS.length - 1 ? (
                            <>Submit Application <Send className="w-4 h-4" /></>
                        ) : (
                            <>Next Step <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>

            </motion.div>
        </main>
    );
}
