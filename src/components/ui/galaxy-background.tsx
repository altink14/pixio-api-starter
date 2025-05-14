// src/components/ui/galaxy-background.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function OptimizedGalaxyBackground({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/50 to-black" />
      
      {/* Stars effect */}
      <div className="stars-container absolute inset-0">
        <div className="stars-small" />
        <div className="stars-medium" />
        <div className="stars-large" />
      </div>
    </div>
  );
}