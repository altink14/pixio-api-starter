// components/ui/cosmic-wormhole.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const CosmicWormhole = () => {
  const [mounted, setMounted] = useState(false);
  const wormholeRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);
  
  useEffect(() => {
    if (!mounted || !wormholeRef.current) return;
    
    // Apply subtle movement based on mouse position
    wormholeRef.current.style.transform = `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`;
  }, [mousePosition, mounted]);
  
  if (!mounted) return null;
  
  return (
    <div 
      ref={wormholeRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none transition-transform duration-[2000ms] ease-out z-[-3]"
      style={{ willChange: 'transform' }}
    >
      {/* Wormhole rings */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
          style={{
            width: `${100 - i * 10}%`,
            height: `${100 - i * 10}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { 
              duration: 100 - i * 10, 
              repeat: Infinity, 
              ease: "linear" 
            },
            scale: { 
              duration: 8, 
              repeat: Infinity, 
              repeatType: "reverse", 
              ease: "easeInOut" 
            }
          }}
        />
      ))}
      
      {/* Center glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20%] h-[20%] rounded-full bg-gradient-radial from-white/20 via-purple-500/10 to-transparent"
        style={{
          filter: 'blur(15px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    </div>
  );
};