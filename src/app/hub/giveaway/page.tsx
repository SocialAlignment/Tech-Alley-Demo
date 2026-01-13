'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Loader2, Sparkles, Youtube, DollarSign, Target, Users } from 'lucide-react';
import { useIdentity } from '@/context/IdentityContext';

export default function GiveawayPage() {
    const [isEntered, setIsEntered] = useState(false);
    const [status, setStatus] = useState('idle');
    const { leadId } = useIdentity();

    // Form State matching Master Spec (GenAI Audit)
    const [formData, setFormData] = useState({
        // 1. Authority & Context
        decisionMaker: '',
        businessType: '',
        bottleneck: '',

        // 2. Audit Metrics (New Phase 3)
        leadsPerWeek: '',       // Leads/Customers per week
        conversionRate: '',     // Current Conversion Rate
        socialPosts: '',        // Social Posts Per Week
        allowAds: '',           // Do you allow external ads?

        // 3. AI Readiness
        aiMaturity: '',
        aiChallenges: [] as string[], // Main Challenges for AI (Multi)
        toolsInterest: '',

        // 4. Budget & Outcome
        budgetRange: '',
        monthlyGain: '',
        slogan: ''              // Main Slogan/Hook
    });

    // Helper for Multi-Select (AI Challenges)
    const toggleChallenge = (value: string) => {
        setFormData(prev => {
            const current = prev.aiChallenges;
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, aiChallenges: updated };
        });
    };

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        if (!leadId) { alert("Identity missing."); setStatus('idle'); return; }

        try {
            const res = await fetch('/api/update-lead', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    updates: {
                        ...formData,
                        enteredToWin: true,
                        genAiConfirmed: true,
                        formType: 'GenAI Audit'
                    }
                })
            });

            if (res.ok) { setIsEntered(true); setStatus('success'); }
            else { throw new Error('Failed'); }
        } catch (err) { console.error(err); alert('Error.'); setStatus('idle'); }
    };

    return (
        <div className="space-y-8 pb-20">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <div className="inline-block p-3 rounded-full bg-primary/10 mb-4 border border-primary/30">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Win a <span className="gradient-text">$1,500 GenAI Video Audit</span></h1>
                <p className="text-gray-400 max-w-lg mx-auto">
                    Complete the audit below to unlock your entry.
                </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
                <motion.div layout className={`glass-panel p-8 ${isEntered ? 'hidden' : ''}`}>
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Lock size={18} className="text-primary" /> GenAI Audit
                        </h2>
                        <span className="text-xs font-mono text-gray-500">SECURE ENTRY </span>
                    </div>

                    <form onSubmit={handleUnlock} className="space-y-8">

                        {/* SECTION 1: CONTEXT */}
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold border-l-4 border-primary pl-3">1. Business Context</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label-text">Who handles tech/budget?</label>
                                    <select required className="input-field" value={formData.decisionMaker} onChange={e => setFormData({ ...formData, decisionMaker: e.target.value })}>
                                        <option value="" disabled>Select...</option>
                                        <option value="Sole">I make all decisions</option>
                                        <option value="Collaborative">Collaborative Team</option>
                                        <option value="Influencer">I research, others sign</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label-text">Business Model</label>
                                    <select required className="input-field" value={formData.businessType} onChange={e => setFormData({ ...formData, businessType: e.target.value })}>
                                        <option value="" disabled>Select...</option>
                                        <option value="Service Based Business">Service Based</option>
                                        <option value="E-Commerce">E-Commerce</option>
                                        <option value="Content Creator">Creator / Influencer</option>
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="New Business">New Business</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: METRICS */}
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold border-l-4 border-primary pl-3">2. Current Metrics</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label-text">Leads/Customers per Week?</label>
                                    <select required className="input-field" value={formData.leadsPerWeek} onChange={e => setFormData({ ...formData, leadsPerWeek: e.target.value })}>
                                        <option value="" disabled>Select...</option>
                                        <option value="0-10">0-10 (Starting)</option>
                                        <option value="11-50">11-50 (Growing)</option>
                                        <option value="51-200">51-200 (Scaling)</option>
                                        <option value="200+">200+ (Volume)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label-text">Avg. Conversion Rate (%)</label>
                                    <input type="number" placeholder="e.g. 5" className="input-field" value={formData.conversionRate} onChange={e => setFormData({ ...formData, conversionRate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="label-text">Social Posts per Week</label>
                                    <input type="number" placeholder="e.g. 3" className="input-field" value={formData.socialPosts} onChange={e => setFormData({ ...formData, socialPosts: e.target.value })} />
                                </div>
                                <div>
                                    <label className="label-text">Run paid ads?</label>
                                    <select required className="input-field" value={formData.allowAds} onChange={e => setFormData({ ...formData, allowAds: e.target.value })}>
                                        <option value="" disabled>Select...</option>
                                        <option value="Yes">Yes, actively.</option>
                                        <option value="No">No, organic only.</option>
                                        <option value="Interested">No, but interested.</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: PAIN & TECH */}
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold border-l-4 border-primary pl-3">3. AI & Tech</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label-text">Biggest Bottleneck</label>
                                    <select required className="input-field" value={formData.bottleneck} onChange={e => setFormData({ ...formData, bottleneck: e.target.value })}>
                                        <option value="" disabled>Select...</option>
                                        <option value="Hiring">Hiring / Team</option>
                                        <option value="Leads">Lead Quality</option>
                                        <option value="Chaos">Operational Chaos</option>
                                        <option value="Scaling">Scaling Revenue</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label-text">AI Maturity Level</label>
                                    <select required className="input-field" value={formData.aiMaturity} onChange={e => setFormData({ ...formData, aiMaturity: e.target.value })}>
                                        <option value="" disabled>Select...</option>
                                        <option value="No knowledge">Beginner (0)</option>
                                        <option value="Basic">Basic (Theoretical)</option>
                                        <option value="Intermediate">Intermediate (Dabbling)</option>
                                        <option value="Expert">Expert (Scaling)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="label-text mb-2 block">Main Challenges with AI (Select all)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Don\'t know where to start', 'Too expensive', 'Too complex/technical', 'Integration issues', 'Privacy concerns', 'No time to learn'].map(opt => (
                                        <div key={opt} onClick={() => toggleChallenge(opt)}
                                            className={`cursor-pointer p-3 rounded-lg border text-sm transition-all ${formData.aiChallenges.includes(opt) ? 'bg-primary/20 border-primary text-white' : 'bg-black/40 border-white/10 text-gray-400'}`}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="label-text">Tools you currently use?</label>
                                <input type="text" placeholder="e.g. ChatGPT, Zapier..." className="input-field" value={formData.toolsInterest} onChange={e => setFormData({ ...formData, toolsInterest: e.target.value })} />
                            </div>
                        </div>

                        {/* SECTION 4: OUTCOME */}
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold border-l-4 border-primary pl-3">4. The Prize</h3>
                            <div>
                                <label className="label-text">Main Slogan / Hook?</label>
                                <input type="text" placeholder="What is your core message?" className="input-field" value={formData.slogan} onChange={e => setFormData({ ...formData, slogan: e.target.value })} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label-text">Monthly Growth Budget</label>
                                    <select required className="input-field" value={formData.budgetRange} onChange={e => setFormData({ ...formData, budgetRange: e.target.value })}>
                                        <option value="" disabled>Select...</option>
                                        <option value="<$500">&lt;$500</option>
                                        <option value="$500-$2K">$500 - $2k</option>
                                        <option value="$2K-$5K">$2k - $5k</option>
                                        <option value="$5K+">$5k+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label-text">Est. Monthly Rev Gain?</label>
                                    <input type="number" required placeholder="e.g. 5000" className="input-field" value={formData.monthlyGain} onChange={e => setFormData({ ...formData, monthlyGain: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-purple-500/20 mt-4"
                        >
                            {status === 'submitting' ? <Loader2 className="animate-spin w-5 h-5" /> : 'Submit & Unlock Entry'}
                        </button>
                    </form>
                    <style jsx>{`
                        .label-text { display: block; font-size: 0.875rem; color: #d1d5db; margin-bottom: 0.5rem; font-weight: 500; }
                        .input-field { width: 100%; bg-black/40; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.75rem 1rem; color: white; background: rgba(0,0,0,0.4); }
                        .input-field:focus { border-color: #8B5CF6; outline: none; box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2); }
                    `}</style>
                </motion.div>

                {/* Success State */}
                {isEntered && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center p-12 text-center border border-primary rounded-3xl bg-gradient-to-b from-slate-900 to-black shadow-[0_0_50px_rgba(139,92,246,0.3)]"
                    >
                        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/50 animate-pulse">
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold mb-2 text-white">Entry Confirmed!</h3>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"></div>
                        <p className="text-gray-300 text-lg mb-6">
                            We have received your qualification profile. <br />
                            <span className="text-secondary text-sm">We will review your submission and announce the winner live.</span>
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
