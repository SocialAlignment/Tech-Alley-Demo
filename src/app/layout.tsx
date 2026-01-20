import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { IdentityProvider } from '@/context/IdentityContext';
import { QuestionsProvider } from '@/context/QuestionsContext';
import { Suspense } from 'react';
import Sidebar from '@/components/Sidebar';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Innovation Henderson Alignment Hub | Tech Alley Henderson',
  description: 'The official companion experience for Tech Alley Henderson.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tech Alley',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased bg-background text-foreground overflow-x-hidden`} suppressHydrationWarning>
        <IdentityProvider>
          <QuestionsProvider>
            {children}
          </QuestionsProvider>
        </IdentityProvider>
      </body>
    </html>
  );
}
