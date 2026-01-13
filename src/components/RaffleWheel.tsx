'use client';

import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function RaffleWheel({ candidates = [] }: { candidates?: string[] }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const controls = useAnimation();

    const spin = async () => {
        if (isSpinning || candidates.length === 0) return;
        setIsSpinning(true);
        setWinner(null);

        // Random rotation
        const randomSpin = 1800 + Math.random() * 1800; // 5-10 spins

        await controls.start({
            rotate: randomSpin,
            transition: { duration: 5, type: 'spring', stiffness: 50, damping: 20 }
        });

        // Pick random winner
        const randomIndex = Math.floor(Math.random() * candidates.length);
        setWinner(candidates[randomIndex]);
        setIsSpinning(false);
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-8">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-8 bg-[#9d4edd] rotate-45 border-4 border-[#0a0a0a] shadow-lg rounded-sm"></div>

                {/* Wheel */}
                <motion.div
                    animate={controls}
                    className="w-full h-full rounded-full border-4 border-[#240046] shadow-[0_0_50px_rgba(157,78,221,0.3)] relative overflow-hidden bg-[#1a0b2e]"
                    style={{ backgroundImage: 'conic-gradient(from 0deg, #240046 0 60deg, #3c096c 60deg 120deg, #5a189a 120deg 180deg, #7b2cbf 180deg 240deg, #9d4edd 240deg 300deg, #240046 300deg 360deg)' }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 rounded-full bg-[#0a0a0a] border-4 border-[#9d4edd] z-10 flex flex-col items-center justify-center p-4 text-center">
                            {winner ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-[#e0aaff] font-bold text-xl"
                                >
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Winner</p>
                                    {winner}
                                </motion.div>
                            ) : (
                                <span className="text-xs font-bold text-gray-600">
                                    {candidates.length} Entrants
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            <button
                onClick={spin}
                disabled={isSpinning}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-[#9d4edd] to-[#7b2cbf] text-white font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSpinning ? 'Spinning...' : 'Spin to Win!'}
            </button>
        </div>
    );
}
