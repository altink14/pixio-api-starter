// components/ui/enhanced-space-background.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  depth: number; // Added depth for parallax
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
  size: number;
}

interface CosmicDust {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  drift: {
    x: number;
    y: number;
    duration: number;
  };
}

interface Constellation {
  id: number;
  stars: {
    id: string;
    x: number;
    y: number;
    size: number;
  }[];
  connections: {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }[];
  duration: number;
  opacity: number;
}

interface Aurora {
  id: number;
  side: 'top' | 'bottom';
  startX: number;
  width: number;
  height: number;
  color: string;
  duration: number;
}

export const EnhancedSpaceBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [stars, setStars] = useState<Star[]>([]);
  const [cosmicDust, setCosmicDust] = useState<CosmicDust[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [auroras, setAuroras] = useState<Aurora[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const nebulasRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);
  const lastShootingStarTime = useRef(0);
  
  // Initialize dimensions
  useEffect(() => {
    if (mounted) {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [mounted]);
  
  // Generate stars with depth
  useEffect(() => {
    if (!mounted || dimensions.width === 0) return;
    
    // Create stars with varying depths
    const newStars = Array.from({ length: 200 }, (_, i) => {
      const depth = Math.random();
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.max(0.5, Math.random() * 3 * depth),
        opacity: Math.max(0.1, Math.random() * depth),
        depth,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 2
      };
    });
    
    setStars(newStars);
    
    // Create cosmic dust particles
    const newDust = Array.from({ length: 40 }, (_, i) => {
      const size = Math.random() * 60 + 20;
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        opacity: Math.max(0.01, Math.random() * 0.08),
        rotation: Math.random() * 360,
        drift: {
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2,
          duration: Math.random() * 100 + 100
        }
      };
    });
    
    setCosmicDust(newDust);
    
    // Generate initial constellation and aurora
    generateConstellation();
    generateAurora();
    
    // Set up intervals for cosmic events
    const shootingStarInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        generateShootingStar();
      }
    }, 3000);
    
    const constellationInterval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance
        generateConstellation();
      }
    }, 10000);
    
    const auroraInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        generateAurora();
      }
    }, 15000);
    
    return () => {
      clearInterval(shootingStarInterval);
      clearInterval(constellationInterval);
      clearInterval(auroraInterval);
    };
  }, [mounted, dimensions]);
  
  // Handle mouse movement for parallax effect
  useEffect(() => {
    if (!mounted) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized position (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);
  
  // Apply parallax effect to layers
  useEffect(() => {
    if (!mounted) return;
    
    // Apply parallax to different layers
    if (nebulasRef.current) {
      nebulasRef.current.style.transform = `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`;
    }
    
    if (starsRef.current) {
      starsRef.current.style.transform = `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`;
    }
    
    if (dustRef.current) {
      dustRef.current.style.transform = `translate(${mousePosition.x * -5}px, ${mousePosition.y * -5}px)`;
    }
    
    if (foregroundRef.current) {
      foregroundRef.current.style.transform = `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`;
    }
    
  }, [mousePosition, mounted]);
  
  // Function to generate a shooting star
  const generateShootingStar = () => {
    const now = Date.now();
    if (now - lastShootingStarTime.current < 1000) return; // Prevent too many shooting stars
    
    lastShootingStarTime.current = now;
    
    // More dynamic shooting stars from different directions
    const quadrant = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    
    let startX, startY, endX, endY;
    
    // Generate start and end positions based on quadrant
    switch (quadrant) {
      case 0: // top
        startX = Math.random() * 100;
        startY = 0;
        endX = startX + (Math.random() - 0.5) * 60;
        endY = 30 + Math.random() * 40;
        break;
      case 1: // right
        startX = 100;
        startY = Math.random() * 50;
        endX = 30 + Math.random() * 40;
        endY = startY + (Math.random() - 0.5) * 60;
        break;
      case 2: // bottom (less common)
        if (Math.random() > 0.7) {
          startX = Math.random() * 100;
          startY = 100;
          endX = startX + (Math.random() - 0.5) * 60;
          endY = 30 + Math.random() * 30;
        } else {
          // Default to top if we don't want bottom
          startX = Math.random() * 100;
          startY = 0;
          endX = startX + (Math.random() - 0.5) * 60;
          endY = 30 + Math.random() * 40;
        }
        break;
      case 3: // left
        startX = 0;
        startY = Math.random() * 50;
        endX = 60 + Math.random() * 30;
        endY = startY + (Math.random() - 0.5) * 60;
        break;
      default:
        startX = Math.random() * 30;
        startY = Math.random() * 30;
        endX = startX + 30 + Math.random() * 40;
        endY = startY + 30 + Math.random() * 40;
    }
    
    const duration = Math.random() * 1.5 + 1; // 1-2.5 seconds
    const delay = Math.random() * 0.5;
    const size = Math.random() * 2 + 1;
    
    setShootingStars(prev => [...prev, {
      id: Math.random(),
      startX, 
      startY, 
      endX, 
      endY, 
      duration, 
      delay, 
      size
    }]);
    
    // Remove shooting star after animation completes
    setTimeout(() => {
      setShootingStars(prev => prev.filter(star => star.id !== Math.random()));
    }, (duration + delay + 0.5) * 1000);
  };
  
  // Function to generate a constellation
  const generateConstellation = () => {
    if (dimensions.width === 0) return;
    
    const id = Date.now();
    const numStars = Math.floor(Math.random() * 6) + 3; // 3-8 stars
    const centerX = Math.random() * 100;
    const centerY = Math.random() * 100;
    const radius = Math.random() * 10 + 5;
    
    // Generate constellation stars
    const stars = Array.from({ length: numStars }, (_, i) => {
      const angle = (i / numStars) * Math.PI * 2;
      const distance = radius * (0.3 + Math.random() * 0.7);
      
      return {
        id: `${id}-star-${i}`,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: Math.random() * 2 + 1
      };
    });
    
    // Generate connections between stars
    const connections = [];
    for (let i = 0; i < stars.length; i++) {
      // Connect to next star
      const nextIdx = (i + 1) % stars.length;
      connections.push({
        id: `${id}-conn-${i}`,
        x1: stars[i].x,
        y1: stars[i].y,
        x2: stars[nextIdx].x,
        y2: stars[nextIdx].y
      });
      
      // Sometimes add an extra connection
      if (Math.random() > 0.7 && stars.length > 3) {
        const randomIdx = (i + 2 + Math.floor(Math.random() * (stars.length - 3))) % stars.length;
        connections.push({
          id: `${id}-conn-extra-${i}`,
          x1: stars[i].x,
          y1: stars[i].y,
          x2: stars[randomIdx].x,
          y2: stars[randomIdx].y
        });
      }
    }
    
    const newConstellation = {
      id,
      stars,
      connections,
      duration: Math.random() * 5 + 15, // 15-20 seconds
      opacity: Math.random() * 0.3 + 0.1
    };
    
    setConstellations(prev => [...prev, newConstellation]);
    
    // Remove constellation after duration
    setTimeout(() => {
      setConstellations(prev => prev.filter(c => c.id !== id));
    }, newConstellation.duration * 1000);
  };
  
  // Function to generate an aurora
const generateAurora = () => {
  if (dimensions.width === 0) return;
  
  const id = Date.now();
  // Fix: Use a type assertion or directly use the literal type
  const side = Math.random() > 0.5 ? 'top' as const : 'bottom' as const;
  const startX = Math.random() * 80;
  const width = 30 + Math.random() * 50;
  const height = 20 + Math.random() * 30;
  
  // Random color from a cosmic palette
  const colors = [
    'from-green-500/20 to-blue-500/20',
    'from-purple-500/20 to-pink-500/20',
    'from-blue-500/20 to-teal-500/20',
    'from-pink-500/20 to-purple-500/20',
    'from-indigo-500/20 to-cyan-500/20'
  ];
  
  const color = colors[Math.floor(Math.random() * colors.length)];
  const duration = Math.random() * 10 + 20; // 20-30 seconds
  
  const newAurora: Aurora = {
    id,
    side,
    startX,
    width,
    height,
    color,
    duration
  };
  
  setAuroras(prev => [...prev, newAurora]);
  
  // Remove aurora after duration
  setTimeout(() => {
    setAuroras(prev => prev.filter(a => a.id !== id));
  }, duration * 1000);
};
  
  // Client-side only
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-5]">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-indigo-950"></div>
      
      {/* Nebula clouds - deep background */}
      <div 
        ref={nebulasRef} 
        className="absolute inset-0 transition-transform duration-[3000ms] ease-out"
        style={{ willChange: 'transform' }}
      >
        <div className="absolute top-[10%] left-[5%] w-[60vw] h-[60vw] rounded-full bg-purple-900/10 filter blur-[120px] animate-float-slow" 
          style={{ animationDuration: '150s' }} />
        <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/10 filter blur-[120px] animate-float-slow" 
          style={{ animationDuration: '170s', animationDelay: '10s', animationDirection: 'reverse' }} />
        <div className="absolute top-[40%] left-[25%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/10 filter blur-[100px] animate-float-slow" 
          style={{ animationDuration: '130s', animationDelay: '5s' }} />
        <div className="absolute bottom-[30%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-pink-900/5 filter blur-[150px] animate-float-slow" 
          style={{ animationDuration: '160s', animationDelay: '15s' }} />
      </div>
      
      {/* Stars with depth and parallax */}
      <div 
        ref={starsRef}
        className="absolute inset-0 transition-transform duration-[2000ms] ease-out"
        style={{ willChange: 'transform' }}
      >
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.4, star.opacity],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Cosmic dust particles with drift */}
      <div 
        ref={dustRef}
        className="absolute inset-0 transition-transform duration-[1500ms] ease-out"
        style={{ willChange: 'transform' }}
      >
        {cosmicDust.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/30 blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              rotate: `${particle.rotation}deg`,
            }}
            animate={{
              x: [0, particle.drift.x * 100, 0],
              y: [0, particle.drift.y * 100, 0],
              rotate: [`${particle.rotation}deg`, `${particle.rotation + 20}deg`, `${particle.rotation}deg`]
            }}
            transition={{
              duration: particle.drift.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Constellations - animated star patterns */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {constellations.map((constellation) => (
            <motion.div
              key={constellation.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: constellation.opacity }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute inset-0"
            >
              {/* Constellation connections (lines) */}
              {constellation.connections.map((connection) => (
                <motion.div
                  key={connection.id}
                  className="absolute bg-white/30"
                  style={{
                    left: `${connection.x1}%`,
                    top: `${connection.y1}%`,
                    width: `${Math.sqrt(Math.pow(connection.x2 - connection.x1, 2) + Math.pow(connection.y2 - connection.y1, 2))}%`,
                    height: '1px',
                    transformOrigin: 'left center',
                    transform: `rotate(${Math.atan2(connection.y2 - connection.y1, connection.x2 - connection.x1)}rad)`,
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              ))}
              
              {/* Constellation stars */}
              {constellation.stars.map((star, index) => (
                <motion.div
                  key={star.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 1],
                    opacity: 1,
                    boxShadow: ['0 0 0px 0px rgba(255,255,255,0)', '0 0 10px 2px rgba(255,255,255,0.5)', '0 0 5px 1px rgba(255,255,255,0.3)']
                  }}
                  transition={{ 
                    duration: 2,
                    delay: index * 0.2,
                    times: [0, 0.6, 1]
                  }}
                />
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Aurora effects */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {auroras.map((aurora) => (
            <motion.div
              key={aurora.id}
              className={`absolute bg-gradient-to-b ${aurora.color} rounded-[100%] filter blur-[60px]`}
              style={{
                left: `${aurora.startX}%`,
                [aurora.side]: '0',
                width: `${aurora.width}%`,
                height: `${aurora.height}%`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0, 0.7, 0],
                scale: [0.8, 1, 0.9],
                x: [0, aurora.width * 0.1, aurora.width * -0.1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: aurora.duration, times: [0, 0.2, 1] },
                scale: { duration: aurora.duration },
                x: { duration: aurora.duration, repeat: Infinity, repeatType: 'reverse' }
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ 
            opacity: 0,
            x: `${star.startX}%`,
            y: `${star.startY}%`,
            scale: 0
          }}
          animate={{
            opacity: [0, 1, 0],
            x: [`${star.startX}%`, `${star.endX}%`],
            y: [`${star.startY}%`, `${star.endY}%`],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            ease: "easeOut",
          }}
          className="absolute z-10"
        >
          {/* Shooting star head */}
          <div 
            className="absolute rounded-full bg-white"
            style={{
              width: `${star.size * 2}px`,
              height: `${star.size * 2}px`,
              boxShadow: `0 0 ${star.size * 4}px ${star.size}px rgba(255, 255, 255, 0.8)`,
            }}
          />
          
          {/* Shooting star trail */}
          <div
            className="absolute bg-gradient-to-r from-white via-white to-transparent"
            style={{
              width: `${star.size * 20}px`,
              height: `${star.size}px`,
              borderRadius: '100px',
              transform: 'translateX(-100%)',
              opacity: 0.6,
            }}
          />
        </motion.div>
      ))}
      
      {/* Foreground elements with opposite parallax */}
      <div 
        ref={foregroundRef}
        className="absolute inset-0 transition-transform duration-[1000ms] ease-out"
        style={{ willChange: 'transform' }}
      >
        {/* Cosmic lens flares */}
        <motion.div
          className="absolute w-[200px] h-[200px] rounded-full opacity-0"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
            left: '20%',
            top: '30%'
          }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut"
          }}
        />
        
        {/* Occasional glow bursts */}
        <motion.div
          className="absolute rounded-full bg-blue-500/10 filter blur-[80px]"
          style={{
            width: '20vw',
            height: '20vw',
          }}
          initial={{ opacity: 0, scale: 0.5, x: '30vw', y: '20vh' }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatDelay: 15,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute rounded-full bg-purple-500/10 filter blur-[80px]"
          style={{
            width: '15vw',
            height: '15vw',
          }}
          initial={{ opacity: 0, scale: 0.5, x: '70vw', y: '60vh' }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 8,
            delay: 10,
            repeat: Infinity,
            repeatDelay: 20,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/40 pointer-events-none"></div>
      
      {/* Optional grid overlay for sci-fi feel */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.03] pointer-events-none"></div>
    </div>
  );
};