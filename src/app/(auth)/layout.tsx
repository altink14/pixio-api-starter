// src/app/(auth)/layout.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define fixed particle positions to avoid randomness
const FIXED_PARTICLES = [
  { top: "0%", left: "0%", size: "1px", opacity: 0.3, duration: "10s", delay: "0s" },
  { top: "21%", left: "27%", size: "1px", opacity: 0.6, duration: "13s", delay: "1.5s" },
  { top: "28%", left: "36%", size: "1px", opacity: 0.7, duration: "14s", delay: "2s" },
  { top: "35%", left: "45%", size: "3px", opacity: 0.3, duration: "15s", delay: "2.5s" },
  { top: "42%", left: "54%", size: "3px", opacity: 0.4, duration: "16s", delay: "3s" },
  { top: "56%", left: "72%", size: "2px", opacity: 0.6, duration: "18s", delay: "4s" },
  { top: "70%", left: "90%", size: "2px", opacity: 0.3, duration: "10s", delay: "0s" },
  { top: "77%", left: "99%", size: "1px", opacity: 0.4, duration: "11s", delay: "0.5s" },
  { top: "84%", left: "8%", size: "2px", opacity: 0.5, duration: "12s", delay: "1s" },
  { top: "91%", left: "17%", size: "1px", opacity: 0.6, duration: "13s", delay: "1.5s" },
  { top: "98%", left: "26%", size: "1px", opacity: 0.7, duration: "14s", delay: "2s" },
  { top: "14%", left: "63%", size: "2px", opacity: 0.4, duration: "17s", delay: "3.5s" },
  { top: "49%", left: "81%", size: "1px", opacity: 0.5, duration: "19s", delay: "4.5s" },
  { top: "63%", left: "35%", size: "3px", opacity: 0.3, duration: "20s", delay: "5s" },
  { top: "7%", left: "72%", size: "2px", opacity: 0.7, duration: "15s", delay: "2.5s" }
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] bg-[length:10px_10px] bg-repeat opacity-5"></div>
      
      {/* Moving circles */}
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-primary/5 filter blur-[100px] animate-float" style={{ animationDuration: '30s' }}></div>
      <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-secondary/5 filter blur-[100px] animate-float" style={{ animationDuration: '25s', animationDelay: '2s' }}></div>
      
      {/* Particles - now using fixed predefined values */}
      <div className="particles absolute inset-0 -z-10">
        {FIXED_PARTICLES.map((particle, i) => (
          <div 
            key={i} 
            className="particle absolute rounded-full bg-white/40"
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              animation: `float ${particle.duration} linear infinite`,
              animationDelay: particle.delay
            }}
          />
        ))}
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        {/* Removed the Tini Studio logo link here */}
        
        <AnimatePresence>
          {mounted && (
            <motion.div 
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-4 text-center text-sm text-muted-foreground relative z-10">
        <p>
          © {new Date().getFullYear()} Tini Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
}