"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export const WarpBackground = ({
    className,
    perspective = 100,
    beams = 20,
    gridColor = "rgba(120, 119, 198, 0.3)", // lighter indigo/purple
    children,
    ...props
}: {
    className?: string;
    perspective?: number;
    beams?: number;
    gridColor?: string;
    children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative flex h-full w-full items-center justify-center overflow-hidden bg-black",
                className,
            )}
            {...props}
        >
            {/* Grid beams */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    perspective: `${perspective}px`,
                }}
            >
                <div
                    className="absolute inset-0 animate-grid"
                    style={{
                        transformStyle: "preserve-3d",
                    }}
                >
                    {/* Horizontal lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_49%,var(--grid-color)_50%,transparent_51%)] bg-[length:100%_40px]" style={{ "--grid-color": gridColor } as any} />

                    {/* Vertical lines - creating depth */}
                    <div className="absolute top-0 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-[20%] origin-top bg-[linear-gradient(to_right,transparent_49%,var(--grid-color)_50%,transparent_51%)] bg-[length:60px_100%] [transform:rotateX(60deg)]" style={{ "--grid-color": gridColor } as any} />
                </div>
            </div>

            {/* Radial fade for depth */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
};
