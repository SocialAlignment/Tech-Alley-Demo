'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { WarpBackground } from '@/components/ui/warp-background';

export default function DemoProcessingPage() {
    const router = useRouter();
    const [status, setStatus] = useState('Securing your raffle entry...');

    useEffect(() => {
        const syncEntry = async () => {
            try {
                // simple delay to show UI then sync
                await new Promise(r => setTimeout(r, 800));

                const res = await fetch('/api/demo/sync', { method: 'POST' });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.id) {
                        setStatus('Success! Redirecting to setup...');
                        // Ensure we pass the ID to onboarding
                        router.push(`/demo/onboarding?id=${data.id}`);
                    } else {
                        throw new Error("No ID returned from sync API");
                    }
                } else {
                    const statusVal = res.status;
                    const text = await res.text();
                    setStatus(`Sync failed (${statusVal}). Redirecting...`);
                    setTimeout(() => router.push('/demo'), 2500);
                }
            } catch (error: any) {
                console.error('Demo Processing Error:', error);
                setStatus('Something went wrong. Redirecting...');
                router.push('/demo');
            }
        };

        syncEntry();
    }, [router]);

    return (
        <main className="relative w-full h-[100dvh] overflow-hidden bg-slate-900 font-sans flex items-center justify-center">
            {/* Background - Neon Portal Warp Grid */}
            <div className="absolute inset-0 z-0">
                <WarpBackground className="w-full h-full" gridColor="rgba(168, 85, 247, 0.4)" />
                <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                >
                    {/* Glowing Orb behind loader */}
                    <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full scale-150 animate-pulse" />

                    <div className="relative z-10 p-4 bg-slate-900/50 backdrop-blur-md rounded-full border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                        <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />
                    </div>
                </motion.div>

                <div className="text-center space-y-3 max-w-md px-4">
                    <h2 className="text-2xl font-bold text-white tracking-widest uppercase pb-2 border-b border-purple-500/30">
                        Initializing
                    </h2>
                    <p className="text-sm font-medium text-cyan-300 font-mono tracking-wide animate-pulse">
                        {status}
                    </p>
                </div>
            </div>
        </main>
    );
}
