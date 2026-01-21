'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Terminal, AlertTriangle } from 'lucide-react';
import { WarpBackground } from '@/components/ui/warp-background';

function LoginContent() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [typedText, setTypedText] = useState('');
    const router = useRouter();

    // "Typewriter" effect for the terminal text
    useEffect(() => {
        const text = "> SYSTEM LOCKED. ENTER ACCESS CODE...";
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setTypedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // BYPASS: Always succeed
        setSuccess(true);
        setError(false);
        // Simulate "Access Granted" delay
        setTimeout(() => {
            sessionStorage.setItem('admin_access', 'true');
            router.push('/admin');
        }, 1000);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black text-green-500 font-mono flex flex-col items-center justify-center">

            {/* Background - Reusing Warp for consistency but green/matrix style */}
            <div className="absolute inset-0 z-0 opacity-20">
                <WarpBackground className="w-full h-full" gridColor="rgba(34, 197, 94, 0.4)" />
            </div>

            <div className="relative z-10 w-full max-w-md p-8 space-y-8">

                {/* Header Icon */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex justify-center"
                >
                    <div className={`p-6 rounded-full border-2 ${success ? 'border-green-500 bg-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.6)]' : error ? 'border-red-500 bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.6)]' : 'border-green-500/50 bg-black/50'}`}>
                        {success ? (
                            <Unlock className="w-12 h-12 text-green-400" />
                        ) : error ? (
                            <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
                        ) : (
                            <Lock className="w-12 h-12 text-green-500/70" />
                        )}
                    </div>
                </motion.div>

                {/* Terminal Text */}
                <div className="h-8 text-center text-sm md:text-base tracking-widest uppercase">
                    {success ? (
                        <span className="text-green-400 font-bold animate-pulse">Access Granted. Redirecting...</span>
                    ) : error ? (
                        <span className="text-red-500 font-bold">Access Denied. Invalid Protocol.</span>
                    ) : (
                        <span>{typedText}<span className="animate-blink">_</span></span>
                    )}
                </div>

                {/* Input Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="relative"
                >
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full bg-black/80 border-2 ${error ? 'border-red-500 text-red-500' : 'border-green-500/50 text-green-400 focus:border-green-400'} rounded-lg px-4 py-3 outline-none text-center tracking-[0.5em] placeholder-green-900 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                        placeholder="PASSWORD"
                        autoFocus
                        disabled={success}
                    />

                    {/* Submit Button (Hidden visually but accessible via enter, or visible if preferred) */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-6 w-full py-3 bg-green-900/20 border border-green-500/40 text-green-400 rounded hover:bg-green-500 hover:text-black font-bold uppercase tracking-widest transition-colors"
                    >
                        {success ? 'Proceeding...' : 'Authenticate'}
                    </motion.button>
                </motion.form>

                {/* Decorative 'System Stats' */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 2 }}
                    className="fixed bottom-4 right-4 text-[10px] text-green-900 leading-tight text-right select-none pointer-events-none"
                >
                    <p>SECURE CONNETION: ENCRYPTED</p>
                    <p>IP: 192.168.X.X [MASKED]</p>
                    <p>SESSION ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                </motion.div>

            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <LoginContent />
        </Suspense>
    );
}
