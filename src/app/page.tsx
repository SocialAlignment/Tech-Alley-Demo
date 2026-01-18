'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WarpBackground } from '@/components/ui/warp-background';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-900">
      {/* Background - Neon Portal Warp Grid (Consistent with Photo Booth) */}
      <div className="absolute inset-0 z-0">
        <WarpBackground className="w-full h-full" gridColor="rgba(168, 85, 247, 0.6)" />
        {/* Deep dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 text-center pointer-events-none">

        {/* Branding Section */}


        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-4 mb-20 pointer-events-auto"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-[0_0_20px_rgba(0,0,0,1)] select-none">
            Hello<br />Henderson
          </h1>
          <p className="text-lg md:text-xl text-white/50 font-medium tracking-wide">
            The Innovation Journey Starts Here
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/login')}
          className="group relative pointer-events-auto px-8 py-5 bg-white text-slate-900 rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.6)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.8)] transition-all duration-300 flex items-center gap-3 overflow-hidden"
        >
          <span className="relative z-10">Lets Innovate</span>
          <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />

          {/* Button Shine Effect */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
        </motion.button>


        {/* Centered Footer with Watermark - Updated Size/Spacing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-0 w-full flex flex-col items-center justify-center gap-0 z-20 pointer-events-none leading-none"
        >
          <div className="flex flex-row items-center justify-center gap-0 opacity-90 hover:opacity-100 transition-opacity pointer-events-auto select-none">
            <span className="text-sm uppercase tracking-[0.2em] text-white font-semibold">Powered By</span>
            <img
              src="/social-alignment-icon.png"
              alt="Social Alignment"
              className="h-28 w-auto object-contain mix-blend-screen"
            />
          </div>
          {/* Negative margin to pull text up into the logo's whitespace */}
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium -mt-6">Tech Alley Henderson • Community Hub</p>
        </motion.div>

      </div>
    </main>
  );
}
