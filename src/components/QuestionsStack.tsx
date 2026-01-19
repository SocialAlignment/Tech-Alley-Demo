"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Question } from '@/context/QuestionsContext';

const SQRT_5000 = Math.sqrt(5000);

interface QuestionsStackProps {
    questions: Question[];
    cardSize?: number;
    onMarkAnswered?: (id: string) => void;
}

const QuestionCard: React.FC<{
    position: number;
    question: Question;
    handleMove: (steps: number) => void;
    cardSize: number;
    onMarkAnswered?: (id: string) => void;
}> = ({ position, question, handleMove, cardSize, onMarkAnswered }) => {
    const isCenter = position === 0;

    return (
        <div
            onClick={() => handleMove(position)}
            className={cn(
                "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out bg-card",
                isCenter
                    ? "z-10 bg-primary text-primary-foreground border-primary"
                    : "z-0 bg-card text-card-foreground border-border hover:border-primary/50"
            )}
            style={{
                width: cardSize,
                height: cardSize,
                clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
                transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
                boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent"
            }}
        >
            {/* Corner Decoration */}
            <span
                className="absolute block origin-top-right rotate-45 bg-white/20"
                style={{
                    right: -2,
                    top: 48,
                    width: SQRT_5000,
                    height: 2
                }}
            />

            {/* From Badge */}
            <div className={cn(
                "mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                isCenter ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            )}>
                <User size={12} />
                <span>From: {question.from}</span>
            </div>

            {/* Question Content */}
            <h3 className={cn(
                "text-lg sm:text-xl font-medium leading-relaxed line-clamp-4",
                isCenter ? "text-primary-foreground" : "text-foreground"
            )}>
                "{question.content}"
            </h3>

            {/* Topic Footer */}
            <p className={cn(
                "absolute bottom-20 left-8 right-8 mt-2 text-sm italic font-medium",
                isCenter ? "text-primary-foreground/80" : "text-muted-foreground"
            )}>
                Topic: {question.topic}
            </p>

            {/* Mark Answered Button (Only for specific questions or all, user requested capability) */}
            {isCenter && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onMarkAnswered && onMarkAnswered(question.id);
                    }}
                    className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-full font-bold text-sm shadow-lg transition-all transform hover:scale-105"
                >
                    <Check size={16} />
                    <span>Mark Answered</span>
                </button>
            )}
        </div>
    );
};

export const QuestionsStack: React.FC<QuestionsStackProps> = ({ questions, onMarkAnswered }) => {
    const [cardSize, setCardSize] = useState(365);
    // We maintain a local state for the ordered list to allow shifting
    const [displayList, setDisplayList] = useState<Question[]>([]);

    useEffect(() => {
        setDisplayList(questions);
    }, [questions]);

    const handleMove = (steps: number) => {
        if (displayList.length === 0) return;

        const newList = [...displayList];
        if (steps > 0) {
            for (let i = steps; i > 0; i--) {
                const item = newList.shift();
                if (!item) return;
                newList.push(item);
            }
        } else {
            for (let i = steps; i < 0; i++) {
                const item = newList.pop();
                if (!item) return;
                newList.unshift(item);
            }
        }
        setDisplayList(newList);
    };

    useEffect(() => {
        const updateSize = () => {
            const { matches } = window.matchMedia("(min-width: 640px)");
            setCardSize(matches ? 365 : 290);
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    if (displayList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] text-slate-500">
                <p>No questions submitted yet.</p>
                <p className="text-sm">Be the first to ask!</p>
            </div>
        )
    }

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ height: 600 }}
        >
            {displayList.map((q, index) => {
                const position = displayList.length % 2
                    ? index - (displayList.length + 1) / 2
                    : index - displayList.length / 2;
                return (
                    <QuestionCard
                        key={q.id} // Use stable ID
                        question={q}
                        handleMove={handleMove}
                        position={position}
                        cardSize={cardSize}
                        onMarkAnswered={onMarkAnswered}
                    />
                );
            })}

            {displayList.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-20">
                    <button
                        onClick={() => handleMove(-1)}
                        className={cn(
                            "flex h-14 w-14 items-center justify-center text-2xl transition-colors rounded-full",
                            "bg-slate-900 border-2 border-slate-800 text-slate-400 hover:bg-cyan-500 hover:text-white hover:border-cyan-400",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        )}
                        aria-label="Previous question"
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        onClick={() => handleMove(1)}
                        className={cn(
                            "flex h-14 w-14 items-center justify-center text-2xl transition-colors rounded-full",
                            "bg-slate-900 border-2 border-slate-800 text-slate-400 hover:bg-cyan-500 hover:text-white hover:border-cyan-400",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        )}
                        aria-label="Next question"
                    >
                        <ChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
};
