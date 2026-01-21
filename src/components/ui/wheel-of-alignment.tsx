"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X } from 'lucide-react';

// --- Types ---
interface Entrant {
    id: string;
    name: string;
    entries_count: number;
    color: string;
}

export default function WheelOfAlignment() {
    // --- State ---
    const [entrants, setEntrants] = useState<Entrant[]>([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState<Entrant | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [particles, setParticles] = useState<any[]>([]);
    const wheelRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);

    // --- Effects ---

    // 1. Fetch Entrants (Supabase Integration)
    useEffect(() => {
        fetchEntrants();
    }, []);

    const fetchEntrants = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/wheel-entries');
            const data = await res.json();

            if (data.entries) {
                const palette = ['#3B82F6', '#06B6D4', '#6366F1', '#2563EB', '#0891B2', '#4F46E5', '#60A5FA', '#22D3EE'];
                const formatted = data.entries.map((d: any, i: number) => ({
                    id: d.id,
                    name: d.name.split(' ')[0], // First name
                    entries_count: d.entries_count || 1,
                    color: palette[i % palette.length]
                }));
                setEntrants(formatted);
            }
        } catch (error) {
            console.error("Failed to fetch wheel entrants", error);
        } finally {
            setLoading(false);
        }
    };


    // 2. Generate ambient particles
    useEffect(() => {
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 5,
        }));
        setParticles(newParticles);
    }, []);

    // --- Logic ---
    const spinWheel = async () => {
        if (isSpinning || entrants.length === 0) return;

        setIsSpinning(true);
        setWinner(null);
        setShowConfetti(false);

        // --- Weighted Winner Selection ---
        const totalWeight = entrants.reduce((sum, e) => sum + e.entries_count, 0);
        let random = Math.random() * totalWeight;
        let selected = entrants[0];
        let selectedIndex = 0;

        for (let i = 0; i < entrants.length; i++) {
            const e = entrants[i];
            if (random < e.entries_count) {
                selected = e;
                selectedIndex = i;
                break;
            }
            random -= e.entries_count;
        }

        // --- Calculate Rotation to land on Selected ---
        // segmentSize is strictly visual here (360 / length)
        const segmentSize = 360 / entrants.length;

        // Target angle logic:
        // The pointer is at TOP (270 degrees in standard circle math, or 0/360 if we rotate the container).
        // Let's look at the SVG: 
        // 0 degrees starts at 3 o'clock (standard SVG arc).
        // The pointer is at top (-90 deg from 0). Or physically TOP.
        // User Code: winnerIndex = Math.floor((360 - normalizedRotation + segmentSize / 2) % 360 / segmentSize) % entrants.length;
        // This implies the wheel rotates normally.

        // We want to force the rotation to land on 'selectedIndex'.
        // Target Angle (where the pointer points to the center of the segment):
        // Pointer is fixed at top.
        // We need the center of segment 'selectedIndex' to be at -90deg (Top).

        // Current Angle of segment[i] center = (i * segmentSize) - 90 + (segmentSize/2)
        // We want (Angle + Rotation) % 360 = 270 (Top)
        // ... Let's trust the User's random spin logic for visual flair, OR rig it?
        // Since this is a raffle, we MUST rig it to the weighted winner.

        // Inverse Math:
        // We want the wheel to stop such that 'selected' is at the top.
        // Segment Start: index * segmentSize
        // Segment Center: (index + 0.5) * segmentSize

        // If we want Segment Center to be at 270 (Top)
        // Rotation + SegmentCenter = 270
        // Rotation = 270 - SegmentCenter

        // Let's add randomness within the segment (+/- 40% of segmentSize)
        const randomOffset = (Math.random() - 0.5) * 0.8 * segmentSize;

        const targetCenter = (selectedIndex + 0.5) * segmentSize;
        // SVG starts 0 at 3 o'clock. 
        // Our segments are drawn: i * segmentSize - 90. So index 0 starts at -90 (Top).
        // So index 0 is ALREADY at the top.
        // Wait, logic check:
        // user's d calc: `i * segmentSize - 90`.
        // So Entrant 0 is at Top (-90 to -90+size). Check.

        // To land Index 0 at Top, Rotation should be 0 (or 360).
        // To land Index 1 at Top, we rotate -segmentSize. (Clockwise necessitates 360-segmentSize).

        // Target Rotation = -1 * (selectedIndex * segmentSize) + randomOffset
        // Add full spins
        const spins = 5 + Math.floor(Math.random() * 5);
        const extraDegrees = (360 * spins);

        // Current rotation
        const currentRot = rotation;
        // We want to go forward.
        // Target:
        let targetRot = (360 - (selectedIndex * segmentSize)) + randomOffset;

        // Normalize
        const totalRotation = currentRot + (360 * spins) + (targetRot - (currentRot % 360));
        // Fix modulo glitch if needed, or just add huge raw numbers.
        // Simplified: Just add (spins * 360) + calculated delta.

        // Let's use the user's simpler math if possible, but we need to target the weighted winner.
        // User's User's Math: `totalRotation = rotation + (spins * 360) + extraDegrees` (Pure Random)
        // My Override:
        const desiredLandingAngle = (360 - (selectedIndex * segmentSize) - (segmentSize / 2)) + randomOffset;
        // Add multiple spins
        const finalRotation = rotation + (360 * 5) + (360 - (rotation % 360)) + desiredLandingAngle;

        setRotation(finalRotation);

        // Sync State Update
        setTimeout(async () => {
            setWinner(selected);
            setIsSpinning(false);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);

            // Trigger DB/SMS (Optional side effect)
            await fetch('/api/admin/sms/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'raffle_winner', recipient: selected })
            });

        }, 5000);
    };

    const segmentSize = entrants.length > 0 ? 360 / entrants.length : 0;

    return (
        <div style={{
            position: 'relative',
            overflow: 'hidden',
            // Matched to user request, but scoped to container instead of full screen force
            width: '100%',
            height: '100%',
            minHeight: '600px',
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Outfit', sans-serif",
            borderRadius: '24px', // Added for modal fit
        }}>
            {/* Import fonts */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
                
                @keyframes float {
                  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
                  50% { transform: translateY(-20px) translateX(10px); opacity: 0.7; }
                }
                
                @keyframes pulse-glow {
                  0%, 100% { filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.4)); }
                  50% { filter: drop-shadow(0 0 40px rgba(6, 182, 212, 0.8)); }
                }
                
                @keyframes spin-glow {
                  0% { filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 60px rgba(6, 182, 212, 0.4)); }
                  50% { filter: drop-shadow(0 0 50px rgba(99, 102, 241, 0.8)) drop-shadow(0 0 80px rgba(34, 211, 238, 0.6)); }
                  100% { filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 60px rgba(6, 182, 212, 0.4)); }
                }
                
                @keyframes confetti-fall {
                  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
                  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                
                @keyframes winner-reveal {
                  0% { transform: scale(0.8); opacity: 0; }
                  50% { transform: scale(1.1); }
                  100% { transform: scale(1); opacity: 1; }
                }
                
                @keyframes ring-pulse {
                  0%, 100% { transform: scale(1); opacity: 0.5; }
                  50% { transform: scale(1.05); opacity: 0.8; }
                }
                
                @keyframes gradient-shift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                
                @keyframes ticker-bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(4px); }
                }
            `}</style>

            {/* Ambient particles */}
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        borderRadius: '50%',
                        background: 'rgba(6, 182, 212, 0.5)',
                        animation: `float ${p.duration}s ease-in-out infinite`,
                        animationDelay: `${p.delay}s`,
                        pointerEvents: 'none',
                    }}
                />
            ))}

            {/* Grid overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                pointerEvents: 'none',
            }} />

            {/* Confetti */}
            {showConfetti && Array.from({ length: 120 }, (_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${Math.random() * 100}%`,
                        top: '-20px',
                        width: Math.random() * 10 + 5,
                        height: Math.random() * 10 + 5,
                        background: ['#3B82F6', '#06B6D4', '#6366F1', '#60A5FA'][Math.floor(Math.random() * 4)],
                        borderRadius: Math.random() > 0.5 ? '50%' : '0',
                        animation: `confetti-fall ${Math.random() * 3 + 2}s linear forwards`,
                        animationDelay: `${Math.random() * 2}s`,
                        pointerEvents: 'none',
                        zIndex: 50
                    }}
                />
            ))}

            {/* Main container */}
            {/* Main Strict 3-Column Container */}
            <div style={{
                background: '#0f1419',
                borderRadius: 20,
                padding: '40px 24px',
                border: '1px solid rgba(0, 212, 170, 0.15)',
                boxShadow: `
                    0 0 0 1px rgba(0, 212, 170, 0.1),
                    0 40px 80px -12px rgba(0, 0, 0, 0.9),
                    0 0 60px rgba(0, 212, 170, 0.05)
                `,
                width: '100%',
                maxWidth: 1100,
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
            }}>
                {/* Close Button */}
                <button
                    onClick={() => { }}
                    style={{
                        position: 'absolute',
                        top: 24,
                        right: 24,
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        padding: 8,
                        zIndex: 50,
                    }}
                >
                    <X size={24} />
                </button>

                {/* LEFT COLUMN: Tech Alley Logo */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 20 }}>
                    <img
                        src="/tah-hero-logo.png"
                        alt="Tech Alley Henderson"
                        style={{
                            width: '100%',
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: 320,
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.3))'
                        }}
                    />
                </div>

                {/* CENTER COLUMN: Wheel & Controls */}
                <div style={{
                    flex: '0 0 340px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 20,
                }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
                            <span style={{ color: '#00D4AA', fontSize: 10 }}>●</span>
                            <span style={{
                                color: '#00D4AA',
                                fontSize: 12,
                                fontFamily: "'Space Mono', monospace",
                                letterSpacing: 3,
                                textTransform: 'uppercase',
                                fontWeight: 700
                            }}>LIVE RAFFLE</span>
                            <span style={{ color: '#00D4AA', fontSize: 10 }}>●</span>
                        </div>

                        <h2 style={{
                            fontSize: 38,
                            fontWeight: 900,
                            color: '#FFFFFF',
                            letterSpacing: 0,
                            margin: 0,
                            lineHeight: 1,
                            textTransform: 'uppercase',
                        }}>
                            WHEEL OF ALIGNMENT
                        </h2>

                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'rgba(0, 212, 170, 0.15)',
                            padding: '6px 16px',
                            borderRadius: 100,
                            marginTop: 16,
                            border: '1px solid rgba(0, 212, 170, 0.2)'
                        }}>
                            <span style={{ color: '#00D4AA', fontSize: 14 }}>✦</span>
                            <span style={{
                                color: '#00D4AA',
                                fontSize: 13,
                                fontWeight: 700,
                                fontFamily: "'Space Mono', monospace",
                                letterSpacing: 1
                            }}>
                                {entrants.length} ENTRANTS QUALIFIED
                            </span>
                            <span style={{ color: '#00D4AA', fontSize: 14 }}>✦</span>
                        </div>
                    </div>

                    {/* Wheel Section */}
                    <div style={{ position: 'relative', width: 320, height: 320, marginBottom: 32 }}>
                        {/* Ticker */}
                        <div style={{
                            position: 'absolute',
                            top: -24,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 30,
                            width: 0,
                            height: 0,
                            borderLeft: '15px solid transparent',
                            borderRight: '15px solid transparent',
                            borderTop: '40px solid #00D4AA',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                        }} />

                        {/* Outer Glow */}
                        <div style={{
                            position: 'absolute',
                            inset: -2,
                            borderRadius: '50%',
                            boxShadow: '0 0 40px rgba(0, 212, 170, 0.2)',
                            zIndex: 0
                        }} />

                        {/* Wheel */}
                        <div
                            ref={wheelRef}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                background: '#0a0e12',
                                border: '3px solid #00D4AA',
                                position: 'relative',
                                overflow: 'hidden',
                                transform: `rotate(${rotation}deg)`,
                                transition: isSpinning ? 'transform 5s cubic-bezier(0.15, 0.85, 0.35, 1)' : 'none',
                                zIndex: 10
                            }}
                        >
                            <svg width="100%" height="100%" viewBox="0 0 320 320">
                                {entrants.map((entrant, i) => {
                                    const count = entrants.length;
                                    const anglePerSegment = 360 / count;
                                    const startAngle = i * anglePerSegment - 90;
                                    const endAngle = (i + 1) * anglePerSegment - 90;
                                    const toRad = (deg: number) => deg * Math.PI / 180;

                                    // Line coords (center 160,160 radius 160)
                                    const x1 = 160 + 160 * Math.cos(toRad(endAngle));
                                    const y1 = 160 + 160 * Math.sin(toRad(endAngle));

                                    // Text coords
                                    const midAngle = startAngle + anglePerSegment / 2;
                                    const textRadius = 130;
                                    const tx = 160 + textRadius * Math.cos(toRad(midAngle));
                                    const ty = 160 + textRadius * Math.sin(toRad(midAngle));

                                    return (
                                        <g key={entrant.id || i}>
                                            <line x1="160" y1="160" x2={x1} y2={y1} stroke="#00D4AA" strokeWidth="1" />
                                            <text
                                                x={tx} y={ty}
                                                fill="white"
                                                fontSize={count > 20 ? 10 : 12}
                                                fontWeight="600"
                                                fontFamily="'Outfit', sans-serif"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                                                style={{ textTransform: 'uppercase' }}
                                            >
                                                {entrant.name}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Hub */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 76,
                            height: 76,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                            zIndex: 20,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '3px solid #0f1419'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                    </div>

                    {/* Status / Winner */}
                    <div style={{ height: 60, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {winner ? (
                            <div style={{ textAlign: 'center', animation: 'winner-reveal 0.6s ease-out' }}>
                                <div style={{ color: '#00D4AA', fontSize: 12, fontFamily: "'Space Mono', monospace", letterSpacing: 2, marginBottom: 4 }}>WINNER SELECTED</div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', textShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}>{winner.name}</div>
                            </div>
                        ) : (
                            <div style={{ color: '#6B7280', fontSize: 13, letterSpacing: 2, fontWeight: 500 }}>READY TO SPIN</div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <button
                            onClick={spinWheel}
                            disabled={isSpinning || entrants.length === 0}
                            style={{
                                width: '100%',
                                background: isSpinning ? '#1f2937' : '#3B82F6',
                                backgroundImage: isSpinning ? 'none' : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                                color: isSpinning ? '#4b5563' : '#fff',
                                border: 'none',
                                padding: '16px 32px',
                                borderRadius: 12,
                                fontSize: 18,
                                fontWeight: 800,
                                letterSpacing: 1.5,
                                cursor: isSpinning ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                transform: isSpinning ? 'scale(0.98)' : 'scale(1)',
                            }}
                        >
                            {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
                        </button>

                        {!isSpinning && (
                            <button
                                onClick={fetchEntrants}
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#9CA3AF',
                                    padding: '12px',
                                    borderRadius: 12,
                                    fontSize: 12,
                                    fontFamily: "'Space Mono', monospace",
                                    letterSpacing: 1,
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.2s',
                                }}
                            >
                                SYNC ENTRANTS
                            </button>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: 24, color: '#6B7280', fontSize: 12, textAlign: 'center' }}>
                        Powered by Social Alignment
                    </div>
                </div>

                {/* RIGHT COLUMN: Social Alignment Logo */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 20 }}>
                    <img
                        src="/sa-hero-logo.png"
                        alt="Social Alignment"
                        style={{
                            width: '100%',
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: 320,
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.3))'
                        }}
                    />
                </div>
            </div>
        </div >
    );
};
