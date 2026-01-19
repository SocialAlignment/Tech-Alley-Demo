"use client";

import * as React from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- TYPES ---
interface ThreeDCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
    videos: { src: string; alt: string; poster?: string }[];
}

// --- 3D CAROUSEL COMPONENT ---
export const ThreeDCarousel = React.forwardRef<HTMLDivElement, ThreeDCarouselProps>(
    ({ videos, className, ...props }, ref) => {
        const [currentIndex, setCurrentIndex] = React.useState(Math.floor(videos.length / 2));

        const handleNext = React.useCallback(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
        }, [videos.length]);

        const handlePrev = () => {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
        };

        // Auto-advance
        React.useEffect(() => {
            const timer = setInterval(() => {
                handleNext();
            }, 5000);
            return () => clearInterval(timer);
        }, [handleNext]);

        return (
            <div
                ref={ref}
                className={cn(
                    'relative w-full h-[500px] md:h-[600px] flex items-center justify-center [perspective:1000px] overflow-hidden py-10',
                    className
                )}
                {...props}
            >
                {/* Carousel Wrapper */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {videos.map((video, index) => {
                        const offset = index - currentIndex;
                        const total = videos.length;
                        let pos = (offset + total) % total;
                        if (pos > Math.floor(total / 2)) {
                            pos = pos - total;
                        }

                        // Limit visibility range
                        if (Math.abs(pos) > 2) return null;

                        const isCenter = pos === 0;
                        const isAdjacent = Math.abs(pos) === 1;

                        return (
                            <div
                                key={index}
                                className={cn(
                                    'absolute w-[260px] h-[460px] md:w-[320px] md:h-[560px] transition-all duration-500 ease-in-out',
                                    'flex items-center justify-center bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10'
                                )}
                                style={{
                                    transform: `
                translateX(${(pos) * 60}%) 
                scale(${isCenter ? 1 : 0.8})
                rotateY(${(pos) * -15}deg)
                translateZ(${isCenter ? 0 : -100}px)
              `,
                                    zIndex: isCenter ? 20 : 10 - Math.abs(pos),
                                    opacity: isCenter ? 1 : 0.6,
                                    filter: isCenter ? 'blur(0px)' : 'blur(2px)',
                                    pointerEvents: isCenter ? 'auto' : 'none',
                                }}
                            >
                                <video
                                    src={video.src}
                                    poster={video.poster}
                                    autoPlay={isCenter}
                                    muted
                                    loop
                                    playsInline
                                    className="object-cover w-full h-full"
                                />
                                {/* Overlay / Gradient */}
                                <div
                                    className={cn(
                                        "absolute inset-0 transition-opacity duration-300 pointer-events-none",
                                        isCenter ? "bg-transparent" : "bg-black/40"
                                    )}
                                />

                                {/* Play Icon Overlay for non-center items (Visual cue) */}
                                {!isCenter && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="rounded-full bg-white/10 backdrop-blur-md p-4 text-white/50">
                                            <Play className="fill-current w-6 h-6" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Buttons */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 md:left-12 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 z-30 hover:bg-white/10 text-white"
                    onClick={handlePrev}
                >
                    <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 md:right-12 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 z-30 hover:bg-white/10 text-white"
                    onClick={handleNext}
                >
                    <ChevronRight className="h-8 w-8" />
                </Button>
            </div>
        );
    }
);
ThreeDCarousel.displayName = 'ThreeDCarousel';
