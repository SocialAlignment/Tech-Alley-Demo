import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Compass, ShieldAlert, X } from 'lucide-react';
import { GlassButton } from './sign-up';

interface InAppBrowserOverlayProps {
    onDismiss?: () => void;
}

export const InAppBrowserOverlay: React.FC<InAppBrowserOverlayProps> = ({ onDismiss }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
                {/* Glow Effect */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-red-500/20 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                        <ShieldAlert className="w-8 h-8 text-red-400" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Browser Action Required</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Google Sign-In is blocked by this app's built-in browser for security reasons.
                        </p>
                    </div>

                    <div className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">How to Fix</h3>
                        <ol className="text-left text-sm text-slate-300 space-y-3 list-decimal list-inside px-2">
                            <li className="pl-2">Tap the <span className="font-bold text-white">...</span> or <span className="font-bold text-white">Share</span> menu icon (usually top right).</li>
                            <li className="pl-2">Select <span className="font-bold text-white">Open in Browser</span> or <span className="font-bold text-white">Open in Chrome/Safari</span>.</li>
                            <li className="pl-2">Register securely properly.</li>
                        </ol>
                    </div>

                    <div className="w-full pt-2">
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-4 animate-pulse">
                            <ArrowUpRight className="w-4 h-4" />
                            <span>Look for the menu icon above</span>
                        </div>
                    </div>

                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="text-xs text-slate-600 hover:text-slate-400 transition-colors underline decoration-slate-700 underline-offset-4"
                        >
                            I'm not in an in-app browser (Dismiss)
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
