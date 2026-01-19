import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventCardProps {
    heading: string;
    description: string;
    date: Date;
    imageUrl?: string;
    imageAlt?: string;
    eventName: string;
    location: string;
    time: string;
    actionLabel: string;
    onActionClick: () => void;
    className?: string;
}

const EventCard = React.forwardRef<HTMLDivElement, EventCardProps>(
    (
        {
            heading,
            description,
            date,
            imageUrl,
            imageAlt,
            eventName,
            location,
            time,
            actionLabel,
            onActionClick,
            className,
        },
        ref
    ) => {
        // Format date parts
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const day = date.getDate();
        const fullDateString = `${dayOfWeek} · ${month} ${day} · ${time}`;

        return (
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                ref={ref}
                className={cn(
                    "group relative w-full rounded-2xl transition-all duration-300 hover:scale-[1.02]",
                    className
                )}
            >
                {/* Neon Gradient Border Container */}
                <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-[1px] -z-10 rounded-[15px] bg-slate-950" />

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-1 backdrop-blur-md hover:border-cyan-500/30 transition-colors">
                    <div className="flex flex-col md:flex-row gap-6 p-5">

                        {/* Content Section */}
                        <div className="flex-1 flex flex-col justify-between space-y-4">
                            <div>
                                {/* Category Badge */}
                                <div className="inline-flex items-center gap-2 mb-3">
                                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-cyan-950/50 text-cyan-400 border border-cyan-900/50">
                                        {heading || "Event"}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-100 transition-colors leading-tight">
                                    {eventName}
                                </h3>

                                {/* Presenter */}
                                <p className="text-xs text-slate-500 mt-2 font-medium uppercase tracking-wide">
                                    Presented By: <span className="text-slate-400">Social Alignment</span>
                                </p>

                                {/* Description */}
                                <p className="mt-3 text-sm text-slate-400 leading-relaxed line-clamp-2">
                                    {description}
                                </p>
                            </div>

                            {/* Meta Data */}
                            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-1.5 text-blue-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{fullDateString}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Image & Action Section */}
                        <div className="flex flex-col gap-4 md:w-48 shrink-0">
                            {imageUrl && (
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 group-hover:border-cyan-500/20 transition-colors">
                                    <img
                                        src={imageUrl}
                                        alt={imageAlt || eventName}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    />
                                    {/* Image Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                                </div>
                            )}

                            <button
                                onClick={onActionClick}
                                className="mt-auto w-full group/btn relative flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-cyan-500/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-cyan-400 transition-all hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] border border-cyan-500/20 hover:border-cyan-400"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {actionLabel} <CalendarIcon className="w-3 h-3" />
                                </span>
                            </button>
                        </div>

                    </div>
                </div>
            </motion.div>
        );
    }
);

EventCard.displayName = "EventCard";

export { EventCard };
