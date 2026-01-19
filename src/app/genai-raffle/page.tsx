import React from 'react';
import { GenAINavbar } from '@/components/landing/GenAINavbar';
import { GenAIHero } from '@/components/landing/GenAIHero';
import { GenAIPortfolio } from '@/components/landing/GenAIPortfolio';
import { GenAICTA } from '@/components/landing/GenAICTA';
import Link from 'next/link';
import Image from 'next/image';

export default function GenAIRafflePage() {
    // Video Data
    const videos = [
        {
            src: 'https://cdn.pixabay.com/video/2023/10/22/186175-877239162_large.mp4',
            alt: 'Abstract Neon Art',
            poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
        },
        {
            src: 'https://cdn.pixabay.com/video/2022/03/13/110680-688320141_large.mp4',
            alt: 'Cyberpunk City',
            poster: 'https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=600&auto=format&fit=crop'
        },
        {
            src: 'https://cdn.pixabay.com/video/2024/02/09/200000-911689889_large.mp4',
            alt: 'AI Neural Network',
            poster: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop'
        },
        {
            src: 'https://cdn.pixabay.com/video/2023/10/26/186639-878502392_large.mp4',
            alt: 'Digital Grid',
            poster: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop'
        },
        {
            src: 'https://cdn.pixabay.com/video/2023/11/12/188859-884025828_large.mp4',
            alt: 'Futuristic HUD',
            poster: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop'
        },
    ];

    return (
        <main className="bg-slate-950 min-h-screen text-white selection:bg-blue-500/30">
            <GenAINavbar />
            <GenAIHero />
            <GenAIPortfolio videos={videos} />
            <GenAICTA />

            {/* Minimal Footer */}
            <footer className="py-8 bg-slate-950 border-t border-white/5 text-center px-6">
                <div className="flex flex-col items-center gap-4">
                    <Link href="/" className="relative h-8 w-24 opacity-50 hover:opacity-100 transition-opacity">
                        <Image
                            src="/logos/new/logo-1.png"
                            alt="Social Alignment"
                            fill
                            className="object-contain"
                        />
                    </Link>
                    <p className="text-slate-600 text-sm">
                        GenAI-driven social video systems for brands and founders.
                    </p>
                    <p className="text-slate-700 text-xs">
                        &copy; {new Date().getFullYear()} Social Alignment. All rights reserved.
                    </p>
                </div>
            </footer>
        </main>
    );
}
