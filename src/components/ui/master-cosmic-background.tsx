// components/ui/master-cosmic-background.tsx
'use client';

import { EnhancedSpaceBackground } from './enhanced-space-background';
import { CosmicOrbs } from './cosmic-orbs';
import { CosmicWormhole } from './cosmic-wormhole';

export const MasterCosmicBackground = () => {
  return (
    <>
      {/* Base cosmic background with stars, nebulae, etc. */}
      <EnhancedSpaceBackground />
      
      {/* Add cosmic orbs for large-scale movement */}
      <CosmicOrbs />
      
      {/* Optional: Add dramatic wormhole effect */}
      {/* <CosmicWormhole /> */}
      
      {/* Add a subtle noise texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[-2] opacity-[0.015]"
        style={{
          backgroundImage: 'url("/noise.png")', // You'll need to add this texture
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay'
        }}
      />
    </>
  );
};