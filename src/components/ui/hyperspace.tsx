"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface HyperspaceProps {
    density?: number;
    speed?: number;
    color?: string;
    className?: string;
}

export const Hyperspace: React.FC<HyperspaceProps> = ({
    density = 40,
    speed = 1.5,
    color = "#22d3ee", // Cyan default
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Star/Line properties
        const stars: { x: number; y: number; z: number; length: number }[] = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Initialize stars
        for (let i = 0; i < density; i++) {
            stars.push({
                x: Math.random() * canvas.width - centerX,
                y: Math.random() * canvas.height - centerY,
                z: Math.random() * canvas.width,
                length: 0,
            });
        }

        let animationFrameId: number;

        const render = () => {
            // Clear canvas with a fade effect for trails (optional, but clean clear is better for this style)
            ctx.fillStyle = "rgba(2, 4, 10, 1)"; // Match background color roughly
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = color;
            ctx.lineWidth = 2; // Thicker lines for impact

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            stars.forEach((star) => {
                // Move star closer
                star.z -= speed * 10;

                // Reset if it passes the screen
                if (star.z <= 0) {
                    star.x = Math.random() * canvas.width - cx;
                    star.y = Math.random() * canvas.height - cy;
                    star.z = canvas.width;
                    star.length = 0;
                }

                // Calculate positions
                const k = 128.0 / star.z;
                const px = star.x * k + cx;
                const py = star.y * k + cy;

                // Calculate size/length based on depth
                if (star.z < canvas.width) {
                    const size = (1 - star.z / canvas.width) * 2; // Gets bigger as it gets closer

                    // Draw the star/streak
                    ctx.beginPath();
                    const prevX = star.x * (128.0 / (star.z + speed * 15)) + cx;
                    const prevY = star.y * (128.0 / (star.z + speed * 15)) + cy;

                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(px, py);

                    // Opacity controlled by depth
                    const alpha = (1 - star.z / canvas.width);
                    ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`; // Cyan with alpha
                    ctx.lineWidth = size;
                    ctx.stroke();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [density, speed, color]);

    return (
        <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
                style={{ background: "#02040a" }} // Deep dark background
            />
            {/* Overlay gradient for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#02040a_90%)]" />
        </div>
    );
};
