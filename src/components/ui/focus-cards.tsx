"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageData } from "@/components/ui/img-sphere";

export const Card = React.memo(
    ({
        card,
        index,
        hovered,
        setHovered,
    }: {
        card: ImageData;
        index: number;
        hovered: number | null;
        setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    }) => {
        return (
            <div
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                    "rounded-xl relative bg-slate-900 overflow-hidden h-[400px] md:h-[500px] w-full transition-all duration-300 ease-out",
                    hovered !== null && hovered !== index && "blur-sm scale-[0.98] grayscale",
                    hovered === index && "scale-[1.02] ring-2 ring-indigo-500 z-10"
                )}
            >
                <img
                    src={card.src}
                    alt={card.alt}
                    className="object-cover absolute inset-0 w-full h-full"
                />
                <div
                    className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end py-8 px-4 transition-opacity duration-300",
                        hovered === index ? "opacity-100" : "opacity-0"
                    )}
                >
                    <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                        {card.title}
                    </div>
                    <p className="text-sm text-neutral-300 mt-2">
                        {card.description}
                    </p>
                </div>
            </div>
        );
    }
);

Card.displayName = "Card";

export function FocusCards({ cards }: { cards: ImageData[] }) {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
            {cards.map((card, index) => (
                <Card
                    key={card.id || index}
                    card={card}
                    index={index}
                    hovered={hovered}
                    setHovered={setHovered}
                />
            ))}
        </div>
    );
}
