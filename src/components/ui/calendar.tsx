"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BentoCard } from "@/components/ui/bento-card";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface Event {
    date: string | Date;
    [key: string]: any;
}

interface CalendarProps {
    events?: Event[];
    selectedDate?: Date | null;
    onDateSelect?: (date: Date | null) => void;
    className?: string;
}

const CalendarDay: React.FC<{
    day: number | string;
    isHeader?: boolean;
    isSelected?: boolean;
    isToday?: boolean;
    hasEvent?: boolean;
    onClick?: () => void;
}> = ({
    day,
    isHeader,
    isSelected,
    isToday,
    hasEvent,
    onClick
}) => {
        // Style logic
        let bgClass = "text-slate-400 hover:bg-slate-800/50 hover:text-cyan-400 transition-colors duration-200";

        if (isSelected) {
            bgClass = "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]";
        } else if (isToday) {
            bgClass = "bg-slate-800 text-white font-bold border border-slate-600";
        } else if (hasEvent) {
            bgClass = "text-slate-200 font-bold hover:bg-slate-800 hover:text-cyan-300";
        }

        if (isHeader) {
            bgClass = "text-[10px] font-bold text-slate-500 tracking-wider";
        }

        return (
            <div
                className={cn(
                    "col-span-1 row-span-1 flex h-10 w-10 items-center justify-center transition-all duration-200 cursor-pointer relative",
                    !isHeader && "rounded-lg",
                    bgClass
                )}
                onClick={!isHeader ? onClick : undefined}
            >
                <span className={cn("font-medium", isHeader ? "text-[10px]" : "text-sm")}>
                    {day}
                </span>
                {hasEvent && !isSelected && !isHeader && (
                    <span className={cn("absolute bottom-1.5 w-1 h-1 rounded-full shadow-[0_0_5px_currentColor]", isToday ? "bg-cyan-400" : "bg-magenta-500 bg-fuchsia-500")} />
                )}
            </div>
        );
    };

export function Calendar({ events = [], selectedDate, onDateSelect, className }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Normalize events
    const eventDates = new Set(
        events.map((e) => {
            const d = new Date(e.date);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
    );

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const currentMonthName = currentDate.toLocaleString("default", { month: "long" });

    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(year, month, day);
        if (selectedDate &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year) {
            onDateSelect?.(null);
        } else {
            onDateSelect?.(clickedDate);
        }
    };

    const renderCalendarDays = () => {
        const today = new Date();

        let days: React.ReactNode[] = [
            ...dayNames.map((day, i) => (
                <CalendarDay key={`header-${day}`} day={day} isHeader />
            )),
            ...Array(firstDayOfWeek).map((_, i) => (
                <div
                    key={`empty-start-${i}`}
                    className="col-span-1 row-span-1 h-8 w-8"
                />
            )),
            ...Array(daysInMonth)
                .fill(null)
                .map((_, i) => {
                    const day = i + 1;
                    const dateKey = `${year}-${month}-${day}`;
                    const hasEvent = eventDates.has(dateKey);
                    const isToday = today.getMonth() === month && today.getFullYear() === year && day === today.getDate();
                    const isSelected = selectedDate ? (
                        selectedDate.getDate() === day &&
                        selectedDate.getMonth() === month &&
                        selectedDate.getFullYear() === year
                    ) : false;

                    return (
                        <CalendarDay
                            key={`date-${day}`}
                            day={day}
                            hasEvent={hasEvent}
                            isToday={isToday}
                            isSelected={isSelected}
                            onClick={() => handleDateClick(day)}
                        />
                    );
                }),
        ];

        return days;
    };

    return (
        <div className={cn("relative group/calendar w-full", className)}>
            {/* Main Panel */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50 backdrop-blur-md p-6">
                {/* Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />

                {/* Header Section */}
                <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="h-[1px] w-8 bg-cyan-500/50" />
                                <span className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase">Event Calendar</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                {currentMonthName} <span className="text-slate-500">{year}</span>
                            </h2>
                        </div>

                        <div className="flex gap-1">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white border border-transparent hover:border-slate-700">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white border border-transparent hover:border-slate-700">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="w-full">
                        <div className="grid grid-cols-7 gap-1 place-items-center">
                            {renderCalendarDays()}
                        </div>
                    </div>

                    {/* Footer / Filter Status */}
                    <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
                        {selectedDate ? (
                            <Button
                                onClick={() => onDateSelect?.(null)}
                                variant="ghost"
                                className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 -ml-2 h-8"
                            >
                                Clear Filter
                            </Button>
                        ) : (
                            <span className="text-xs text-slate-600 italic">Select a date to filter</span>
                        )}

                        {/* Decorative dots */}
                        <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Outer Glow/Border Effect */}
            <div className="absolute inset-0 rounded-2xl border border-cyan-500/20 shadow-[0_0_40px_-10px_rgba(34,211,238,0.1)] pointer-events-none" />
        </div>
    );
}
