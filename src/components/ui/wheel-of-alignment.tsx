"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createClient } from '@supabase/supabase-js';

// --- Types ---
interface Entrant {
    id: string;
    name: string;
    entries_count: number;
    color?: string;
}

// --- Component ---

export default function WheelOfAlignment() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [entrants, setEntrants] = useState<Entrant[]>([]);
    const [loading, setLoading] = useState(true);
    const [spinning, setSpinning] = useState(false);
    const [winner, setWinner] = useState<Entrant | null>(null);
    const [rotation, setRotation] = useState(0);

    // Fetch Entrants
    useEffect(() => {
        fetchEntrants();
    }, []);

    const fetchEntrants = async () => {
        setLoading(true);
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Fetch valid entries
        const { data, error } = await supabase
            .from('demo_raffle_entries')
            .select('id, name, entries_count')
            .gt('entries_count', 0);

        if (data && !error) {
            // Assign colors
            const colors = ['#a855f7', '#ec4899', '#6366f1', '#14b8a6', '#f59e0b', '#ef4444'];
            const formatted = data.map((d: any, i: number) => ({
                id: d.id,
                name: d.name.split(' ')[0], // First name only for cleaner wheel
                entries_count: d.entries_count || 1,
                color: colors[i % colors.length]
            }));
            setEntrants(formatted);
        }
        setLoading(false);
    };

    // Spin Logic
    const spin = async () => {
        if (spinning || entrants.length === 0) return;
        setSpinning(true);
        setWinner(null);

        // Calculate Total Weight
        const totalWeight = entrants.reduce((sum, e) => sum + e.entries_count, 0);

        // Pick Winner (Weighted Random)
        let random = Math.random() * totalWeight;
        let selected = entrants[0];

        for (const entrant of entrants) {
            if (random < entrant.entries_count) {
                selected = entrant;
                break;
            }
            random -= entrant.entries_count;
        }

        // Determine Target Angle
        // We know exactly who won, now we need to land on their segment.
        // Calculate start/end angles for the winner
        let currentWeight = 0;
        let startAngle = 0;
        let endAngle = 0;

        for (const entrant of entrants) {
            const segmentAngle = (entrant.entries_count / totalWeight) * 2 * Math.PI;
            if (entrant.id === selected.id) {
                startAngle = (currentWeight / totalWeight) * 2 * Math.PI;
                endAngle = startAngle + segmentAngle;
                break;
            }
            currentWeight += entrant.entries_count;
        }

        // Randomize landing within the segment (padding 10% on each side)
        const segmentAngle = endAngle - startAngle;
        const landingAngle = startAngle + (segmentAngle * 0.1) + (Math.random() * (segmentAngle * 0.8));

        // Convert to degrees and add multiple spins (5-10 spins)
        const landingDegrees = (landingAngle * 180 / Math.PI);
        // The pointer is usually at 270 (top) or 0 (right). Let's assume passed 0 is to the right.
        // Actually, let's reverse compute:
        // We want: Rotation % 360 == (360 - landingDegrees)  Assuming pointer is at 0 (Right)
        // Adjust for pointer location. Let's assume pointer is at 270deg (Top).
        // Target Rotation = 270 - landingDegrees

        const extraSpins = 360 * (5 + Math.floor(Math.random() * 5));
        const finalRotation = extraSpins + (270 - landingDegrees);

        // Ensure we always rotate forward
        const newRotation = rotation + (finalRotation - (rotation % 360)) + 360;

        setRotation(newRotation);

        // Wait for animation
        setTimeout(() => {
            setSpinning(false);
            setWinner(selected);
            triggerWin(selected);
        }, 5000); // 5s spin
    };

    // Win Handler
    const triggerWin = async (winner: Entrant) => {
        // Confetti!
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // In real app: Update DB here
        // await supabase.from('demo_raffle_entries').update({ is_winner: true, winner_draw_id: ... }).eq('id', winner.id);
    };

    // Render Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const totalWeight = entrants.reduce((sum, e) => sum + e.entries_count, 0);
        let startAngle = 0;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Center
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = cx - 20;

        // Draw Segments
        entrants.forEach(entrant => {
            const segmentAngle = (entrant.entries_count / totalWeight) * 2 * Math.PI;
            const endAngle = startAngle + segmentAngle;

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.closePath();

            ctx.fillStyle = entrant.color || '#ccc';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Text
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            ctx.font = "bold 14px sans-serif";
            ctx.fillText(entrant.name, radius - 10, 5);
            ctx.restore();

            startAngle += segmentAngle;
        });

    }, [entrants]); // Redraw when entrants change (static wheel, rotation handled by CSS)

    return (
        <div className="flex flex-col items-center gap-8 p-8 max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Wheel of Alignment
                </h2>
                <p className="text-slate-400">
                    {entrants.length} Entrants • Weighted by Signal Score
                </p>
            </div>

            <div className="relative">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
                    <div className="w-8 h-8 bg-white rotate-45 transform origin-center shadow-xl border-4 border-slate-900" />
                </div>

                {/* Wheel Container (Rotates) */}
                <div
                    className="relative w-[500px] h-[500px] transition-transform duration-[5000ms] cubic-bezier(0.25, 0.1, 0.25, 1)"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    <canvas
                        ref={canvasRef}
                        width={500}
                        height={500}
                        className="w-full h-full"
                    />
                </div>

                {/* Center Cap */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-slate-900 z-10">
                    <span className="text-2xl">🎯</span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 min-h-[100px]">
                {winner ? (
                    <div className="animate-in zoom-in slide-in-from-bottom-4 text-center space-y-4">
                        <div className="space-y-2">
                            <div className="text-yellow-400 font-bold uppercase tracking-widest text-sm">Winner!</div>
                            <div className="text-4xl font-black text-white">{winner.name}</div>
                            <div className="text-slate-400 text-sm">{winner.entries_count} Entries ({((winner.entries_count / entrants.reduce((a, b) => a + b.entries_count, 0)) * 100).toFixed(1)}% Chance)</div>
                        </div>

                        <Button
                            onClick={async () => {
                                const res = await fetch('/api/admin/sms/send', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        type: 'raffle_winner',
                                        recipient: winner
                                    })
                                });
                                if (res.ok) alert('SMS Sent!');
                                else alert('Failed to send SMS');
                            }}
                            className="bg-green-500 hover:bg-green-600 text-black font-bold rounded-full px-8"
                        >
                            <span className="mr-2">📲</span> Notify Winner
                        </Button>
                    </div>
                ) : (
                    <Button
                        size="lg"
                        onClick={spin}
                        disabled={spinning || entrants.length === 0}
                        className="h-16 px-12 text-xl font-bold rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 shadow-xl shadow-purple-500/20"
                    >
                        {spinning ? (
                            <>Spinning...</>
                        ) : (
                            <>SPIN THE WHEEL!</>
                        )}
                    </Button>
                )}

                <Button variant="ghost" size="sm" onClick={fetchEntrants} disabled={spinning} className="text-slate-500">
                    <RotateCcw className="w-3 h-3 mr-2" /> Refresh Entrants
                </Button>
            </div>
        </div>
    );
}
