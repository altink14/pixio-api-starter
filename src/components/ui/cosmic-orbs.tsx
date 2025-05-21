// components/ui/cosmic-orbs.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const CosmicOrbs = () => {
  const [mounted, setMounted] = useState(false);
  const [orbs, setOrbs] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    rotation: number;
    duration: number;
  }>>([]);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    // Create cosmic orbs
    const newOrbs = Array.from({ length: 3 }, (_, i) => {
      return {
        id: i,
        x: 20 + (i * 25),
        y: 30 + (i * 15) * (i % 2 === 0 ? 1 : -1),
        size: 150 + (i * 50),
        color: i === 0 ? 'from-blue-600/10 via-indigo-600/5 to-transparent' : 
               i === 1 ? 'from-purple-600/10 via-pink-600/5 to-transparent' :
               'from-teal-600/10 via-cyan-600/5 to-transparent',
        rotation: i * 30,
        duration: 180 + (i * 40)
      };
    });
    
    setOrbs(newOrbs);
  }, [mounted]);
  
  if (!mounted) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-4]">
      {orbs.map(orb => (
        <motion.div
          key={orb.id}
          className={`absolute rounded-full bg-gradient-radial ${orb.color}`}
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            filter: 'blur(60px)',
            transform: `rotate(${orb.rotation}deg)`
          }}
          animate={{
            rotate: [orb.rotation, orb.rotation + 360],
            scale: [1, 1.1, 0.9, 1],
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{
            rotate: { duration: orb.duration, repeat: Infinity, ease: "linear" },
            scale: { duration: orb.duration / 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
            x: { duration: orb.duration / 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
            y: { duration: orb.duration / 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
          }}
        />
      ))}
    </div>
  );
};