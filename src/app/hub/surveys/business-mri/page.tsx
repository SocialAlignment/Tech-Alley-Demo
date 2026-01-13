'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, CheckCircle2, Building2, BrainCircuit, LineChart, Target } from 'lucide-react';
import { useIdentity } from '@/context/IdentityContext';

export default function BusinessMRIPage() {
    const { leadId } = useIdentity();
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState('idle');
    const [completed, setCompleted] = useState(false);

    // Initial State Matching "Business MRI" Spec
    const [formData, setFormData] = useState({
        // 1. The Who
        description: '',        // What Best Describes You?
        businessStatus: '',     // Business Status
        profession: '',         // Profession
        companyName: '',        // Company
        website: '',            // Website
        linkedin: '',           // LinkedIn

        // 2. The Size
        employeeCount: '',      // Employee Count
        revenueRange: '',       // Revenue Range
        industry: '',           // Industry
        softwareSpend: '',      // Monthly Software Spend

        // 3. The Pain
        mainBottleneck: '',     // Main Bottleneck
        urgency: '',            // Urgency
        manualHours: '',        // Weekly Manual Hours
        giftedHours: '',        // If gifted 10+ hours...

        // 4. The Vision
        vision3mo: '',          // Vision of Success
        servicesInterest: [] as string[], // Interested Services (Multi)
        workshopsInterest: [] as string[], // Workshops needed (Multi)
        hiringInterest: false,  // Falback to Notes
        trainingInterest: false // Fallback to Notes
    });

    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    // Toggle Multi-Select Helper
    const toggleSelection = (field: 'servicesInterest' | 'workshopsInterest', value: string) => {
        setFormData(prev => {
            const current = prev[field];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [field]: updated };
        });
    };

    const handleSubmit = async () => {
        setStatus('submitting');

        if (!leadId) {
            alert("Identity not found. Please verify your email.");
            setStatus('idle');
            return;
        }

        try {
            const res = await fetch('/api/update-lead', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    updates: {
                        mriData: formData, // We will handle this 'mriData' object in the API
                        formType: 'Business MRI'
                    }
                })
            });

            if (res.ok) {
                setCompleted(true);
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            console.error(error);
            alert("Error submitting survey. Please try again.");
            setStatus('idle');
        }
    };

    if (completed) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-6 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-b from-[#240046] to-black border border-[#9d4edd] p-12 rounded-3xl"
                >
                    <div className="w-20 h-20 bg-[#9d4edd] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">MRI Scan Complete</h2>
                    <p className="text-gray-300 mb-6">
                        We have captured your business profile. <br />
                        Our team is preparing your <span className="text-[#e0aaff]">Custom Roadmap</span> based on this data.
                    </p>
                    <button onClick={() => window.location.href = '/hub'} className="text-[#9d4edd] hover:text-white underline transition-colors">
                        Return to Hub
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-6 pb-32">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <BrainCircuit className="text-[#9d4edd]" /> Business MRI
                </h1>
                <p className="text-gray-400">Deep-dive diagnostic to identify your growth levers.</p>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/10 mt-6 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#9d4edd] transition-all duration-500 ease-out"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                    <span>STEP {step} OF {totalSteps}</span>
                    <span>{step === 1 ? 'IDENTITY' : step === 2 ? 'SCALE' : step === 3 ? 'PAIN' : 'VISION'}</span>
                </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-sm min-h-[400px]">
                <AnimatePresence mode="wait">

                    {/* STEP 1: THE WHO */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-[#9d4edd] pl-4">The Identity</h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label-text">Role / Profession</label>
                                    <input
                                        type="text" className="input-field" placeholder="e.g. Founder, CEO"
                                        value={formData.profession}
                                        onChange={e => setFormData({ ...formData, profession: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label-text">Company Name</label>
                                    <input
                                        type="text" className="input-field" placeholder="Your Business"
                                        value={formData.companyName}
                                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label-text">Which best describes you?</label>
                                <select
                                    className="input-field"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                >
                                    <option value="" disabled>Select...</option>
                                    <option value="Business Owner (Solopreneur)">Solopreneur</option>
                                    <option value="Business Owner (With Team)">Business Owner (With Team)</option>
                                    <option value="Aspiring Entrepreneur">Aspiring Entrepreneur</option>
                                    <option value="Marketing / Creative Professional">Marketing Pro</option>
                                    <option value="Just Curious">Just Curious</option>
                                </select>
                            </div>

                            <div>
                                <label className="label-text">Website URL</label>
                                <input
                                    type="url" className="input-field" placeholder="https://"
                                    value={formData.website}
                                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: THE SIZE (Firmographics) */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-[#9d4edd] pl-4">The Scale</h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label-text">Employee Count</label>
                                    <select
                                        className="input-field"
                                        value={formData.employeeCount}
                                        onChange={e => setFormData({ ...formData, employeeCount: e.target.value })}
                                    >
                                        <option value="" disabled>Select...</option>
                                        <option value="Solo entrepreneur">Just Me (1)</option>
                                        <option value="2-5 employees">2-5</option>
                                        <option value="6-20 employees">6-20</option>
                                        <option value="21-50 employees">21-50</option>
                                        <option value="50+">50+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label-text">Revenue Range</label>
                                    <select
                                        className="input-field"
                                        value={formData.revenueRange}
                                        onChange={e => setFormData({ ...formData, revenueRange: e.target.value })}
                                    >
                                        <option value="" disabled>Select Annual Rev...</option>
                                        <option value="Under $100K">Under $100K</option>
                                        <option value="$100K-$500K">$100K - $500K</option>
                                        <option value="$500K-$1M">$500K - $1M</option>
                                        <option value="$1M-$5M">$1M - $5M</option>
                                        <option value="$5M+">$5M+</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="label-text">Industry</label>
                                <select
                                    className="input-field"
                                    value={formData.industry}
                                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                >
                                    <option value="" disabled>Select...</option>
                                    <option value="Professional Services">Services (Legal, Finance, Agency)</option>
                                    <option value="E-commerce">E-Commerce</option>
                                    <option value="Coaching/Consulting">Coaching / Education</option>
                                    <option value="Real Estate">Real Estate</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="SaaS">SaaS / Tech</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="label-text">Monthly Software Spend</label>
                                <select
                                    className="input-field"
                                    value={formData.softwareSpend}
                                    onChange={e => setFormData({ ...formData, softwareSpend: e.target.value })}
                                >
                                    <option value="" disabled>Est. Monthly Cost...</option>
                                    <option value="Less than $100">&lt; $100</option>
                                    <option value="$100-$250">$100 - $250</option>
                                    <option value="$251-$500">$251 - $500</option>
                                    <option value="$501-$1000">$501 - $1000</option>
                                    <option value="$1000+">$1000+</option>
                                </select>
                            </div>

                        </motion.div>
                    )}

                    {/* STEP 3: THE PAIN */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-[#9d4edd] pl-4">The Pain</h2>

                            <div>
                                <label className="label-text">Biggest Bottleneck</label>
                                <select
                                    className="input-field"
                                    value={formData.mainBottleneck}
                                    onChange={e => setFormData({ ...formData, mainBottleneck: e.target.value })}
                                >
                                    <option value="" disabled>Select...</option>
                                    <option value="I’m drowning in spreadsheets">Drowning in Spreadsheets</option>
                                    <option value="My systems are scattered">Scattered Systems</option>
                                    <option value="Tech and AI feel overwhelming">Tech/AI Overwhelm</option>
                                    <option value="I work IN not ON my business">Working IN not ON business</option>
                                    <option value="My marketing is messy">Marketing is Messy</option>
                                </select>
                            </div>

                            <div>
                                <label className="label-text">How urgent is solving this?</label>
                                <input
                                    type="text" className="input-field" placeholder="e.g. Critical, losing money daily..."
                                    value={formData.urgency}
                                    onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label-text">Hours/Week on Manual Tasks?</label>
                                    <select
                                        className="input-field"
                                        value={formData.manualHours}
                                        onChange={e => setFormData({ ...formData, manualHours: e.target.value })}
                                    >
                                        <option value="" disabled>Select...</option>
                                        <option value="1-5 Hours">1-5 Hours</option>
                                        <option value="6-10 Hours">6-10 Hours</option>
                                        <option value="11-20 Hours">11-20 Hours</option>
                                        <option value="20+ Hours">20+ Hours</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label-text">If gifted 10 hrs/week?</label>
                                    <select
                                        className="input-field"
                                        value={formData.giftedHours}
                                        onChange={e => setFormData({ ...formData, giftedHours: e.target.value })}
                                    >
                                        <option value="" disabled>I would focus on...</option>
                                        <option value="Lead capture + follow-up">More Sales</option>
                                        <option value="Content creation + scheduling">More Content</option>
                                        <option value="Client onboarding + delivery">Better Delivery</option>
                                        <option value="Admin + back office tasks">Clean Admin</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: THE VISION */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-[#9d4edd] pl-4">The Vision</h2>

                            <div>
                                <label className="label-text">Vision of Success (6-12 mo)</label>
                                <textarea
                                    className="input-field h-24 resize-none"
                                    placeholder="What does 'Winning' look like?"
                                    value={formData.vision3mo}
                                    onChange={e => setFormData({ ...formData, vision3mo: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="label-text mb-2 block">Interested Services</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Automations', 'Content Strategy', 'Video Production', 'Consulting'].map(opt => (
                                        <div
                                            key={opt}
                                            onClick={() => toggleSelection('servicesInterest', opt)}
                                            className={`cursor-pointer p-3 rounded-xl border transition-all ${formData.servicesInterest.includes(opt)
                                                    ? 'bg-[#9d4edd]/20 border-[#9d4edd] text-white'
                                                    : 'bg-black/40 border-white/10 text-gray-400 hover:bg-white/5'
                                                }`}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Fallback Checkboxes (Mapped to Notes) */}
                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-white/30 bg-black/50 checked:bg-[#9d4edd] transition-colors"
                                        checked={formData.hiringInterest}
                                        onChange={e => setFormData({ ...formData, hiringInterest: e.target.checked })}
                                    />
                                    <span className="text-gray-300 group-hover:text-white transition-colors">I'm interested in hiring new employees</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-white/30 bg-black/50 checked:bg-[#9d4edd] transition-colors"
                                        checked={formData.trainingInterest}
                                        onChange={e => setFormData({ ...formData, trainingInterest: e.target.checked })}
                                    />
                                    <span className="text-gray-300 group-hover:text-white transition-colors">I want free AI training for my team</span>
                                </label>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={handleBack}
                    disabled={step === 1}
                    className="px-6 py-3 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium border border-transparent hover:border-white/10"
                >
                    Back
                </button>

                {step < totalSteps ? (
                    <button
                        onClick={handleNext}
                        className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                        Next <ArrowRight size={18} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={status === 'submitting'}
                        className="bg-gradient-to-r from-[#9d4edd] to-[#7b2cbf] text-white px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(157,78,221,0.5)] transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                        {status === 'submitting' ? <Loader2 className="animate-spin" /> : 'Complete MRI Scan'}
                    </button>
                )}
            </div>

            {/* Styles */}
            <style jsx>{`
                .label-text {
                    display: block;
                    font-size: 0.875rem;
                    color: #d1d5db;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }
                .input-field {
                    width: 100%;
                    background: rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0.75rem;
                    padding: 0.75rem 1rem;
                    color: white;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-field:focus {
                    border-color: #9d4edd;
                    box-shadow: 0 0 0 2px rgba(157, 78, 221, 0.2);
                }
            `}</style>
        </div>
    );
}
