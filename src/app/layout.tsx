import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { IdentityProvider } from '@/context/IdentityContext';
import { Suspense } from 'react';
import Sidebar from '@/components/Sidebar';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Tech Alley Henderson | Innovation Hub',
  description: 'The official companion experience for Tech Alley Henderson.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased bg-background text-foreground overflow-x-hidden`}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-primary">Loading Tech Alley Experience...</div>}>
          <IdentityProvider>
            {children}
          </IdentityProvider>
        </Suspense>
      </body>
    </html>
  );
}
