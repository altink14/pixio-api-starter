// src/components/ui/gradient-text-pressure.tsx
'use client';

import { TextPressure } from '@/components/ui/text-pressure'; 
import { useEffect, useState } from 'react';

export function GradientTextPressure({ 
  text, 
  className, 
  ...props 
}: { 
  text: string;
  className?: string;
  [key: string]: unknown;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Important: Apply gradient directly to spans after they're created
    const applyGradient = () => {
      const spans = document.querySelectorAll('.text-pressure-title span');
      spans.forEach(span => {
        // Apply the same gradient style to each individual span
        (span as HTMLElement).style.background = 'linear-gradient(to right, #7068F4, #FF64B4, #ffac4c)';
        (span as HTMLElement).style.backgroundSize = '200% 200%';
        (span as HTMLElement).style.webkitBackgroundClip = 'text';
        (span as HTMLElement).style.backgroundClip = 'text';
        (span as HTMLElement).style.color = 'transparent';
        
        if (mounted) {
          (span as HTMLElement).style.animation = 'gradientMove 15s ease infinite';
        }
      });
    };

    // Apply initially and whenever mouse moves
    applyGradient();
    
    const handleMouseMove = () => {
      setTimeout(applyGradient, 10); // Re-apply after the spans update
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);

  return (
    <TextPressure
      text={text}
      className={className}
      textColor="transparent" // This is needed for the gradient to show
      {...props}
    />
  );
}