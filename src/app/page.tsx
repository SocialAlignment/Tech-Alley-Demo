'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ScanLine, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useIdentity } from '@/context/IdentityContext';

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });
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
      // Simulate API call to Notion (We'll wire this up properly next step)
      // For now, we simulate success and redirect to Hub with a "temp" ID if API fails or returns one
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
          // Fallback if ID missing (shouldn't happen with fix)
          console.error('No leadId returned');
          setStatus('idle');
        }
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  if (isLoading || leadId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-[#9d4edd] w-8 h-8" />
      </div>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Blobs (Same as before) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-[#9d4edd] rounded-full mix-blend-screen filter blur-[120px] opacity-20"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-[#240046] rounded-full mix-blend-screen filter blur-[100px] opacity-30"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 md:p-12 w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9d4edd] to-[#240046] mb-6 shadow-lg shadow-purple-500/20">
            <ScanLine className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Tech Alley <span className="gradient-text">Henderson</span></h1>
          <p className="text-gray-400">Enter your details to unlock the Innovation Hub experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold ml-1 block mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#9d4edd] focus:ring-1 focus:ring-[#9d4edd] transition-all"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold ml-1 block mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#9d4edd] focus:ring-1 focus:ring-[#9d4edd] transition-all"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold ml-1 block mb-1">Company (Optional)</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#9d4edd] focus:ring-1 focus:ring-[#9d4edd] transition-all"
              placeholder="Acme Inc."
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-gradient-to-r from-[#9d4edd] to-[#5a189a] hover:brightness-110 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 group"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="animate-spin" /> unlocking...
              </>
            ) : (
              <>
                Enter Hub <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
