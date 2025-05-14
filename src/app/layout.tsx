// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { Navbar } from '@/components/shared/navbar';
import { OptimizedGalaxyBackground } from '@/components/ui/galaxy-background';

// Your existing font configuration
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tini Studio - Create AI Images with Ease',
  description: 'Generate stunning AI images with our easy-to-use API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {/* Add the galaxy background - positioned on the right side */}
        <OptimizedGalaxyBackground />  {/* <- Change to match the import */}
        
        {/* Your existing layout */}
        <Navbar />
        <main className="flex min-h-screen flex-col pt-20">
          {children}
        </main>
        
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}