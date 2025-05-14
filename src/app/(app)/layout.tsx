// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
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
        {/* Add the galaxy background as a global element */}
        <OptimizedGalaxyBackground />
        
        {/* The children will be the route group layouts */}
        {children}
        
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}