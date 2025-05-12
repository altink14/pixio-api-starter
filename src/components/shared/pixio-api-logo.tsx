'use client';

import { TextPressure } from '@/components/ui/text-pressure';
import Link from 'next/link';
import { useState } from 'react';

interface PixioAPILogoProps {
  href?: string;
}

export function PixioAPILogo({ href = '/' }: PixioAPILogoProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Link 
      href={href} 
      className="flex items-center space-x-2"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering ? (
        <div className="h-8 w-[180px] overflow-hidden">
          <TextPressure
            text="PIXIO API STARTER"
            fontFamily="Inter"
            fontUrl="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
            width={true}
            weight={true}
            italic={false}
            alpha={false}
            flex={true}
            stroke={false}
            scale={true}
            textColor="transparent"
            className="bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent"
            minFontSize={16}
          />
        </div>
      ) : (
        <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
          Pixio<span className="font-bold">API</span> Starter
        </span>
      )}
    </Link>
  );
}