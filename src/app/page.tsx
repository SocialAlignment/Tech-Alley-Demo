'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ScanLine, Loader2, Phone } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useIdentity } from '@/context/IdentityContext';

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { leadId, isLoading } = useIdentity();

  // Redirect if already logged in (ID present)
  useEffect(() => {
    if (!isLoading && leadId) {
      router.push(`/hub/hello-world?id=${leadId}`);
    }
  }, [leadId, isLoading, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();

        if (data.leadId) {
          // Persist Identity
          localStorage.setItem('techalley_lead_id', data.leadId);
          setStatus('success');

          setTimeout(() => {
            // Redirect with ID to ensure Context picks it up immediately
            router.push(`/hub/hello-world?id=${data.leadId}`);
          }, 1000);
        } else {
          console.error('No leadId returned', data);
          setStatus('idle');
          alert('Error: No Lead ID returned from server.');
        }
      } else {
        const errData = await res.json();
        console.error('Server Error Detail:', errData);
        throw new Error(errData.error || 'Submission Failed');
      }
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  if (isLoading || leadId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600 w-8 h-8" />
      </div>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-slate-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-purple-200/30 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-indigo-200/30 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 w-full max-w-lg relative z-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 mb-6 shadow-lg shadow-purple-200">
            <ScanLine className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900 tracking-tight">
            Tech Alley <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Henderson</span>
          </h1>
          <p className="text-slate-500 text-lg">Unlock the full innovation experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-bold ml-1 block mb-2">Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all font-medium"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-bold ml-1 block mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all font-medium"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-bold ml-1 block mb-2">Company</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all font-medium"
                placeholder="Acme Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-bold ml-1 block mb-2">Phone <span className="text-slate-300 normal-case font-normal">(Optional)</span></label>
              <input
                type="tel"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all font-medium"
                placeholder="(555) 123..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>


          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="animate-spin" /> Unlocking Hub...
              </>
            ) : (
              <>
                Enter Innovation Hub <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400 mt-6">
            By entering, you agree to join the Tech Alley Henderson community.
          </p>
        </form>
      </motion.div>
    </main>
  );
}
