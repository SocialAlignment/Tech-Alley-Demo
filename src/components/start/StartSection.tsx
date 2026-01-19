'use client';

import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StartSectionProps {
    id: string;
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    children: ReactNode;
    color?: 'cyan' | 'magenta' | 'purple' | 'lime' | 'orange';
}

export default function StartSection({ id, title, subtitle, icon: Icon, children, color = 'cyan' }: StartSectionProps) {
    const colorStyles = {
        cyan: 'text-cyan-400 border-cyan-500/30',
        magenta: 'text-fuchsia-400 border-fuchsia-500/30',
        purple: 'text-violet-400 border-violet-500/30',
        lime: 'text-lime-400 border-lime-500/30',
        orange: 'text-orange-400 border-orange-500/30',
    };

    return (
        <section id={id} className="py-16 px-6 md:px-12 lg:px-20 bg-[#020617] border-t border-slate-800/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-start gap-4 mb-10">
                    {Icon && (
                        <div className={`p-3 rounded-xl bg-slate-900 border ${colorStyles[color]} border-opacity-50`}>
                            <Icon size={24} className={colorStyles[color].split(' ')[0]} />
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide">{title}</h2>
                        {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
                    </div>
                </div>

                <div className="bg-[#0B1121] rounded-3xl border border-slate-800/50 p-6 md:p-8 shadow-xl">
                    {children}
                </div>
            </div>
        </section>
    );
}
