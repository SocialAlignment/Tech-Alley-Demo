'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function VerifyAuth() {
    const router = useRouter();
    const [status, setStatus] = useState('Syncing with centralized database...');

    useEffect(() => {
        const syncUser = async () => {
            try {
                const res = await fetch('/api/auth/check-status');
                if (!res.ok) throw new Error('Sync failed');

                const data = await res.json();

                if (data.redirect) {
                    setStatus('Redirecting...');
                    router.push(data.redirect);
                } else {
                    router.push('/hub/hello-world'); // Fallback
                }
            } catch (error) {
                console.error('Auth Verify Error:', error);
                setStatus('Error syncing profile. Please try logging in again.');
                setTimeout(() => router.push('/login'), 3000);
            }
        };

        syncUser();
    }, [router]);

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-8 w-8 rounded-full border-2 border-t-transparent border-blue-500"
                />
                <p className="text-sm font-medium text-gray-400 font-mono">{status}</p>
            </div>
        </div>
    );
}
