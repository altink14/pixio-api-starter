// src/components/ui/galaxy-background.tsx
"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import Spline dynamically with no SSR to avoid server-side rendering issues
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent"></div>
});

export function GalaxyBackground() {
  return (
    <div className="galaxy-container">
      <Suspense fallback={<div className="w-full h-full bg-transparent"></div>}>
        <Spline 
          className="galaxy-spline" 
          scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode" 
        />
      </Suspense>
      <div className="galaxy-gradient"></div>
      
      <style jsx>{`
        .galaxy-container {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          pointer-events: none;
          z-index: -1;
          opacity: 0.7; /* Reduced overall opacity for better readability */
        }
        
        .galaxy-spline {
          position: absolute;
          top: 0;
          right: -20%;
          width: 120%;
          height: 110vh;
          transform: scale(1.1);
        }
        
        .galaxy-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            /* Stronger gradient from left to ensure text readability */
            linear-gradient(
              to right, 
              rgba(13, 14, 18, 0.95) 0%, 
              rgba(13, 14, 18, 0.9) 20%, 
              rgba(13, 14, 18, 0.6) 60%,
              rgba(13, 14, 18, 0.4) 100%
            ),
            /* Adding top-to-bottom gradient for header readability */
            linear-gradient(
              to bottom,
              rgba(13, 14, 18, 0.9) 0%,
              rgba(13, 14, 18, 0.7) 5%,
              rgba(13, 14, 18, 0.2) 30%,
              rgba(13, 14, 18, 0.6) 90%,
              rgba(13, 14, 18, 0.9) 100%
            );
          pointer-events: none;
        }
        
        /* Media query for mobile devices */
        @media (max-width: 768px) {
          .galaxy-container {
            opacity: 0.5; /* Even lower opacity on mobile */
          }
          
          .galaxy-gradient {
            background: 
              linear-gradient(
                to right, 
                rgba(13, 14, 18, 0.95) 0%, 
                rgba(13, 14, 18, 0.95) 30%, 
                rgba(13, 14, 18, 0.9) 100%
              ),
              linear-gradient(
                to bottom,
                rgba(13, 14, 18, 0.9) 0%,
                rgba(13, 14, 18, 0.8) 50%,
                rgba(13, 14, 18, 0.9) 100%
              );
          }
        }
      `}</style>
    </div>
  );
}