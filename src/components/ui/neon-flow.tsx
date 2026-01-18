import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"; // We'll define this or use inline

// Helper for random colors
const randomColors = (count: number) => {
    return new Array(count)
        .fill(0)
        .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

interface TubesBackgroundProps {
    children?: React.ReactNode;
    className?: string;
    enableClickInteraction?: boolean;
}

export function TubesBackground({
    children,
    className,
    enableClickInteraction = true
}: TubesBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const tubesRef = useRef<any>(null);

    useEffect(() => {
        let mounted = true;
        let app: any = null;
        let resizeObserver: ResizeObserver | null = null;

        const initTubes = async () => {
            // 1. Wait for canvas ref
            if (!canvasRef.current) return;

            // 2. Wait for dimensions (prevent 0x0 crash)
            if (canvasRef.current.clientWidth === 0 || canvasRef.current.clientHeight === 0) {
                // Retry in next frame if dimensions are missing
                requestAnimationFrame(initTubes);
                return;
            }

            // Probe for WebGL context availability to prevent library crash
            try {
                const gl = (canvasRef.current.getContext('webgl') || canvasRef.current.getContext('experimental-webgl')) as WebGLRenderingContext | null;
                if (!gl) {
                    console.warn("WebGL context not available - skipping 3D init to prevent crash.");
                    setIsLoaded(false); // Ensure loaded state is false
                    return;
                }
                // Release the context immediately so the library can acquire it
                const ext = gl.getExtension('WEBGL_lose_context');
                if (ext) ext.loseContext();

                // We use the specific build locally to avoid Turbopack CDN import errors
                // @ts-ignore
                const module = await import('@/lib/threejs-tubes-cdn.js');
                const TubesCursor = module.default;

                if (!mounted) return;
                // Double check ref after await
                if (!canvasRef.current) return;
                // Prevent double init
                if (tubesRef.current) return;

                app = TubesCursor(canvasRef.current, {
                    tubes: {
                        colors: ["#f967fb", "#53bc28", "#6958d5"],
                        lights: {
                            intensity: 200,
                            colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
                        }
                    }
                });

                tubesRef.current = app;
                setIsLoaded(true);

            } catch (error) {
                console.error("Failed to load TubesCursor:", error);
            }
        };

        // Start initialization attempt
        initTubes();

        // Use ResizeObserver to detect when container has size (better than window resize)
        if (canvasRef.current) {
            resizeObserver = new ResizeObserver(() => {
                // If not loaded and now has size, try init
                if (!tubesRef.current && mounted) {
                    initTubes();
                }
            });
            resizeObserver.observe(canvasRef.current);
        }

        return () => {
            mounted = false;
            if (resizeObserver) resizeObserver.disconnect();

            // Attempt to destroy if the library exposes it, or at least help GC
            if (tubesRef.current && typeof tubesRef.current.destroy === 'function') {
                tubesRef.current.destroy();
            }
            tubesRef.current = null;
        };
    }, []);

    const handleClick = () => {
        if (!enableClickInteraction || !tubesRef.current) return;

        const colors = randomColors(3);
        const lightsColors = randomColors(4);

        tubesRef.current.tubes.setColors(colors);
        tubesRef.current.tubes.setLightsColors(lightsColors);
    };

    return (
        <div
            className={cn("relative w-full h-full min-h-[400px] overflow-hidden bg-background", className)}
            onClick={handleClick}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full block"
                style={{ touchAction: 'none' }}
            />

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full pointer-events-none">
                {children}
            </div>
        </div>
    );
}

// Default export
export default TubesBackground;
