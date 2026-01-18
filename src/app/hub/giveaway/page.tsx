'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, Sparkles, ArrowRight, ChevronLeft,
    Smartphone, Zap, Target, BarChart3, Bot, Video, Play
} from 'lucide-react';
import { useIdentity } from '@/context/IdentityContext';
import Image from 'next/image';

const TOTAL_STEPS = 5;

// Design 3.0: Social Alignment Blue Palette
const BRAND_COLORS = {
    primary: '#0ea5e9', // Sky 500
    secondary: '#06b6d4', // Cyan 500
    accent: '#38bdf8', // Sky 400
    background: '#020617', // Slate 950
    glassBorder: 'rgba(14, 165, 233, 0.2)',
    glassBg: 'rgba(2, 6, 23, 0.6)'
};

export default function GiveawayPage() {
    const [step, setStep] = useState(1);
    const [isEntered, setIsEntered] = useState(false);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const { leadId } = useIdentity();

    // Resize logic for Mad Libs inputs
    const [inputWidths, setInputWidths] = useState({
        targetAudience: 180,
        painPoint: 180,
        uniqueSolution: 180
    });

    const [formData, setFormData] = useState({
        targetAudience: '',
        painPoint: '',
        uniqueSolution: '',
        mascotDetails: '',
        genAiExp: '',
        genAiTools: '',
        contentProblem: '',
        marketingProblem: '',
        adSpend: '',
        leadVolume: '',
    });

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        const length = value.length || 0;
        const newWidth = Math.max(180, length * 15 + 20);
        setInputWidths(prev => ({ ...prev, [key]: newWidth }));
    };

    const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        if (!leadId) {
            setTimeout(() => { setIsEntered(true); setStatus('success'); }, 1500);
            return;
        }

        try {
            await fetch('/api/update-lead', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    pageId: leadId,
                    ...formData,
                    enteredToWin: true,
                    genAiConfirmed: true,
                    formType: 'GenAI Raffle'
                })
            });
            setIsEntered(true);
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('idle');
        }
    };

    // --- Components ---

    const Iphone15Pro = () => (
        <div className="relative mx-auto w-[320px] h-[660px] bg-[#1c1c1e] rounded-[55px] shadow-[0_0_80px_rgba(14,165,233,0.2)] border-[6px] border-[#3a3a3c] overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out group">
            {/* Dynamic Island Area */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[35px] w-[120px] bg-black rounded-b-[20px] z-50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#1c1c1e]/50 ml-16"></div>
            </div>

            {/* Screen Content - Social Alignment Branded */}
            <div className="w-full h-full bg-black rounded-[48px] overflow-hidden relative group cursor-pointer">
                {/* Brand Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#001021] to-[#0ea5e9]/20">
                    {/* Abstract Tech Grid */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                </div>

                {/* Simulated UI Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 pb-12 z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 p-[2px] border border-sky-500/30">
                            <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                                {/* Simulated Logo/Icon */}
                                <img src="/social-alignment-icon.png" alt="Icon" className="w-6 h-6 object-contain" />
                            </div>
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm tracking-wide">Social Alignment</p>
                            <p className="text-sky-400 text-xs">Video Audit • AI Powered</p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-black text-white leading-tight mb-2">
                        Scale your reach.<br />
                        <span className="text-sky-400">Without the grind.</span>
                    </h3>

                    <div className="mt-4 flex items-center gap-2">
                        <button className="flex-1 bg-sky-500 text-white font-bold py-3 rounded-full text-sm hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20">
                            Start Audit
                        </button>
                    </div>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center pl-1">
                        <Play fill="white" className="text-white w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (isEntered) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-600/20 rounded-full blur-[120px] animate-pulse"></div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    className="relative z-10 text-center space-y-8 max-w-2xl px-4"
                >
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-sky-400 to-cyan-500 flex items-center justify-center shadow-[0_0_50px_rgba(14,165,233,0.4)]">
                        <CheckCircle2 size={64} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-300 mb-4">
                            You're In.
                        </h1>
                        <p className="text-xl text-slate-400 font-light">
                            Good luck. We'll verify your channel shortly.
                        </p>
                        <div className="mt-8">
                            <img src="/social-alignment-logo.png" alt="Social Alignment" className="h-8 opacity-50 mx-auto grayscale hover:grayscale-0 transition-all duration-500" />
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white font-outfit overflow-x-hidden selection:bg-sky-500/30">


            {/* Ambient Background - Social Alignment Blue */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-sky-900/20 blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-900/10 blur-[150px] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 lg:py-16 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-24 items-center min-h-[90vh]">

                {/* LEFT: Cinematic Phone Showcase */}
                <motion.div
                    initial={{ x: -100, opacity: 0, rotate: -5 }}
                    animate={{ x: 0, opacity: 1, rotate: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="hidden lg:flex flex-col items-center justify-center relative"
                >


                    <Iphone15Pro />
                    <div className="mt-12 text-center opacity-70">
                        <p className="text-sm font-light tracking-widest uppercase mb-2 text-sky-200">The Giveaway</p>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
                            Custom 30s GenAI Video
                        </h2>
                    </div>
                </motion.div>

                {/* RIGHT: Master Kinetic Wizard */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full max-w-2xl mx-auto"
                >
                    {/* Header */}
                    <div className="mb-12 relative">
                        {/* Social Alignment Logo - Top Right "Fill Here" Position */}
                        <div className="absolute -top-24 -right-10 md:-top-32 md:-right-20 lg:-top-40 lg:-right-0 z-50 pointer-events-none">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                className="flex items-center gap-3"
                            >
                                <img src="/social-alignment-icon.png" alt="Icon" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_25px_rgba(14,165,233,0.5)]" />
                                <span className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">
                                    Social Alignment
                                </span>
                            </motion.div>
                        </div>


                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-950/30 text-xs font-medium tracking-wide text-sky-200 mb-6 backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" /> LIVE RAFFLE
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] mb-6">
                            Win the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-white">Future of Ads</span>
                        </h1>
                    </div>

                    {/* Glassmorphic Form Card - Social Alignment Stye */}
                    <div className="relative bg-slate-900/40 backdrop-blur-xl border border-sky-500/20 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.3)]">
                        {/* Progress */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                            <motion.div
                                className="h-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.8)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                            />
                        </div>

                        {/* Mobile Mascot (visible only on small screens) */}
                        <div className="lg:hidden absolute top-4 right-4 w-12 h-12 opacity-50">
                            <img src="/social-alignment-icon.png" alt="Mascot" className="w-full h-full object-contain" />
                        </div>

                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                                        className="space-y-8"
                                    >
                                        <div className="text-sky-400/60 text-sm font-mono uppercase">01 / The Hook</div>
                                        <div className="text-3xl md:text-4xl leading-relaxed font-light text-slate-100">
                                            "I help
                                            <input
                                                autoFocus
                                                value={formData.targetAudience}
                                                onChange={e => handleInputChange('targetAudience', e.target.value)}
                                                placeholder="my audience"
                                                style={{ width: inputWidths.targetAudience }}
                                                className="inline-block mx-2 bg-transparent border-b-2 border-slate-700 focus:border-sky-500 text-sky-400 placeholder:text-slate-700 outline-none transition-all px-0"
                                            />
                                            to
                                            <input
                                                value={formData.painPoint}
                                                onChange={e => handleInputChange('painPoint', e.target.value)}
                                                placeholder="solve a problem"
                                                style={{ width: inputWidths.painPoint }}
                                                className="inline-block mx-2 bg-transparent border-b-2 border-slate-700 focus:border-sky-500 text-sky-400 placeholder:text-slate-700 outline-none transition-all px-0"
                                            />
                                            using
                                            <input
                                                value={formData.uniqueSolution}
                                                onChange={e => handleInputChange('uniqueSolution', e.target.value)}
                                                placeholder="my solution"
                                                style={{ width: inputWidths.uniqueSolution }}
                                                className="inline-block mx-2 bg-transparent border-b-2 border-slate-700 focus:border-sky-500 text-sky-400 placeholder:text-slate-700 outline-none transition-all px-0"
                                            />."
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        className="space-y-8"
                                    >
                                        <div className="text-sky-400/60 text-sm font-mono uppercase">02 / Identity</div>
                                        <h2 className="text-3xl font-bold">Do you have a spokesperson?</h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            {['Yes, a real human', 'Yes, a mascot/character', 'No, just logos/stock', 'No, but I need one'].map((opt) => (
                                                <div
                                                    key={opt}
                                                    onClick={() => setFormData(p => ({ ...p, mascotDetails: opt }))}
                                                    className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between group ${formData.mascotDetails === opt
                                                        ? 'bg-sky-500/10 text-white border-sky-500 scale-[1.02] shadow-[0_0_20px_rgba(14,165,233,0.1)]'
                                                        : 'bg-slate-800/20 border-white/5 hover:bg-slate-800/40 hover:border-white/10'
                                                        }`}
                                                >
                                                    <span className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors">{opt}</span>
                                                    {formData.mascotDetails === opt && <CheckCircle2 size={24} className="text-sky-400" />}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        className="space-y-8"
                                    >
                                        <div className="text-sky-400/60 text-sm font-mono uppercase">03 / Experience</div>
                                        <h2 className="text-3xl font-bold">Your GenAI Status</h2>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Experience Level</label>
                                                <div className="flex gap-2">
                                                    {['Newbie', 'Curious', 'Pro'].map(lvl => (
                                                        <button
                                                            key={lvl}
                                                            type="button"
                                                            onClick={() => setFormData(p => ({ ...p, genAiExp: lvl }))}
                                                            className={`flex-1 py-3 rounded-xl border transition-all ${formData.genAiExp === lvl
                                                                ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20'
                                                                : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
                                                                }`}
                                                        >
                                                            {lvl}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm text-slate-400">Biggest Creation Hurdle?</label>
                                                <select
                                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-sky-500 transition-colors"
                                                    value={formData.contentProblem}
                                                    onChange={e => setFormData(p => ({ ...p, contentProblem: e.target.value }))}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="Time">It takes forever</option>
                                                    <option value="Money">Too expensive</option>
                                                    <option value="Skill">Can't make it look good</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                                        <div className="text-sky-400/60 text-sm font-mono uppercase">04 / Metrics</div>
                                        <h2 className="text-3xl font-bold">Marketing Health</h2>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm text-slate-400">Ad Spend / Mo</label>
                                                <select className="input-glass" value={formData.adSpend} onChange={e => setFormData({ ...formData, adSpend: e.target.value })}>
                                                    <option value="">Select...</option>
                                                    <option value="0">$0</option>
                                                    <option value="<1k">&lt;$1k</option>
                                                    <option value="1k-5k">$1k-$5k</option>
                                                    <option value="5k+">$5k+</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-slate-400">Leads / Mo</label>
                                                <input type="number" className="input-glass" placeholder="0" value={formData.leadVolume} onChange={e => setFormData({ ...formData, leadVolume: e.target.value })} />
                                            </div>
                                        </div>
                                        <style jsx>{`
                                            .input-glass { width: 100%; background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(148, 163, 184, 0.2); padding: 1rem; border-radius: 0.75rem; color: white; outline: none; transition: all 0.2s; }
                                            .input-glass:focus { border-color: #0ea5e9; background: rgba(15, 23, 42, 0.8); box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2); }
                                         `}</style>
                                    </motion.div>
                                )}

                                {step === 5 && (
                                    <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="text-center py-12">
                                        <div className="w-24 h-24 rounded-full bg-sky-500/10 mx-auto flex items-center justify-center mb-6 animate-[pulse_3s_infinite]">
                                            <Target size={40} className="text-sky-400" />
                                        </div>
                                        <h2 className="text-4xl font-bold mb-4">Ready to Launch?</h2>
                                        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                                            Your profile is locked in. Let's see if you win the campaign.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* footer nav */}
                            <div className="mt-12 flex justify-between items-center border-t border-sky-900/10 pt-8">
                                <button type="button" onClick={prevStep} className={`text-sm text-slate-500 hover:text-white transition-colors flex items-center gap-2 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
                                    <ChevronLeft size={16} /> Back
                                </button>

                                {step < TOTAL_STEPS ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={step === 1 && !formData.targetAudience}
                                        className="group flex items-center gap-3 bg-sky-500 text-white px-8 py-3 rounded-full font-bold hover:bg-sky-400 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-sky-500/25"
                                    >
                                        Next <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-10 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:shadow-[0_0_50px_rgba(14,165,233,0.6)] hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        {status === 'submitting' ? 'Submitting...' : 'Enter Raffle'} <Sparkles size={20} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
