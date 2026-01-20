'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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
        <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
            <div className="flex flex-col items-center gap-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin relative z-10" />
                </motion.div>
                <div className="text-center space-y-2 max-w-md px-4">
                    <h2 className="text-xl font-bold text-white">Processing...</h2>
                    <p className="text-sm font-medium text-slate-400 font-mono break-words">{status}</p>
                </div>
            </div>
        </div>
    );
}
