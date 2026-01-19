'use client';

import { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];


interface RaffleWheelProps {
    onClose: () => void;
    candidates?: string[];
}

const DEFAULT_CANDIDATES = ['Waiting for players...', 'Scan QR Code', 'Join Now!'];

export default function RaffleWheel({ onClose, candidates = [] }: RaffleWheelProps) {
    const participants = candidates.length > 0 ? candidates : DEFAULT_CANDIDATES;
    const [spinning, setSpinning] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const controls = useAnimation();
    const wheelRef = useRef<HTMLDivElement>(null);

    const spinWheel = async () => {
        if (spinning) return;
        setSpinning(true);
        setWinner(null);

        // Random rotation between 5 and 10 full spins + random segment
        const randomRotation = 1800 + Math.random() * 360;

        await controls.start({
            rotate: randomRotation,
            transition: { duration: 4, ease: "circOut" }
        });

        // Calculate winner based on actual participants
        const winningIndex = Math.floor(Math.random() * participants.length);
        const wonName = participants[winningIndex];

        setWinner(wonName);
        setSpinning(false);
        triggerConfetti();
    };

    const triggerConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: COLORS
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: COLORS
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    // Pre-calculate gradient string to avoid template literal issues in JSX
    const conicGradient = `conic-gradient(${COLORS.map((c, i) => `${c} ${(i * 100) / COLORS.length}% ${((i + 1) * 100) / COLORS.length}%`).join(', ')})`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl flex flex-col items-center justify-center p-8">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>

                {/* The Wheel */}
                <div className="relative w-80 h-80 md:w-96 md:h-96">
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-12 bg-white clip-path-triangle shadow-lg border-2 border-slate-900" />

                    <motion.div
                        ref={wheelRef}
                        animate={controls}
                        className="w-full h-full rounded-full border-8 border-slate-800 shadow-[0_0_50px_rgba(168,85,247,0.4)] overflow-hidden relative"
                        style={{ transformOrigin: 'center' }}
                    >
                        {/* Conic Gradient Segment Background */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{ background: conicGradient }}
                        />

                        {/* Labels - Rotated to match segments */}
                        {participants.map((name, index) => {
                            const angle = (360 / participants.length) * (index + 0.5);
                            return (
                                <div
                                    key={index}
                                    className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 origin-bottom flex justify-center pt-8"
                                    style={{ transform: `rotate(${angle}deg)` }}
                                >
                                    <span className="text-white font-bold drop-shadow-md text-sm md:text-base -rotate-90 select-none">{name}</span>
                                </div>
                            );
                        })}
                    </motion.div>

                    {/* Center Hub */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center z-10 border-4 border-slate-900">
                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">SPIN</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="mt-12 text-center space-y-4 h-32">
                    {!winner ? (
                        <button
                            onClick={spinWheel}
                            disabled={spinning}
                            className={`px-12 py-4 text-2xl font-bold rounded-full transition-all transform ${spinning ? 'bg-slate-700 text-slate-500 scale-95' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:scale-110 hover:shadow-[0_0_50px_rgba(236,72,153,0.8)]'}`}
                        >
                            {spinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
                        </button>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="space-y-2"
                        >
                            <h2 className="text-2xl text-slate-400">WINNER!</h2>
                            <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-500 drop-shadow-sm">
                                {winner}
                            </h1>
                            <button
                                onClick={() => { setWinner(null); controls.set({ rotate: 0 }); }}
                                className="text-sm text-slate-500 hover:text-white underline mt-4"
                            >
                                Reset Wheel
                            </button>
                        </motion.div>
                    )}
                </div>

            </div>
        </div>
    );
}
