/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  useInView,
  AnimatePresence,
  useAnimation
} from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PRICING_TIERS, PricingTier, getTierByPriceId } from '@/lib/config/pricing';
import { Check, ExternalLink, ArrowRight, Star, Sparkles, Zap, Github, Crown } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Subscription } from '@/types/db_types';
import { Footer } from '@/components/shared/footer';
import { TextPressure } from '@/components/ui/text-pressure';
import { GradientTextPressure } from '@/components/ui/gradient-text-pressure';
import { OptimizedGalaxyBackground as GalaxyBackground } from '@/components/ui/optimized-galaxy-background';
import { MasterCosmicBackground } from '@/components/ui/master-cosmic-background';
import { EnhancedIconCloud } from '@/components/ui/enhanced-icon-cloud';
// Enhanced Space Background Component
interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
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

const EnhancedSpaceBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const nebulasRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const shootingStarControls = useAnimation();
  const lastShootingStarTime = useRef(0);
  
  // Generate stars
  useEffect(() => {
    if (!mounted) return;
    
    // Create stars with random properties
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2
    }));
    
    setStars(newStars);
    
    // Initialize shooting stars
    generateShootingStar();
    
    // Set up interval for occasional shooting stars
    const shootingStarInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of shooting star
        generateShootingStar();
      }
    }, 3000);
    
    return () => clearInterval(shootingStarInterval);
  }, [mounted]);
  
  // Handle mouse movement for parallax effect
  useEffect(() => {
    if (!mounted) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized position (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      setMousePosition({ x, y });
      
      // Move nebulas based on mouse position
      if (nebulasRef.current) {
        nebulasRef.current.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
      }
      
      // Move particles based on mouse position
      if (particlesRef.current) {
        particlesRef.current.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);
  
  // Function to generate a shooting star
  const generateShootingStar = () => {
    const now = Date.now();
    if (now - lastShootingStarTime.current < 1000) return; // Prevent too many shooting stars
    
    lastShootingStarTime.current = now;
    
    const id = Math.random();
    const startX = Math.random() * 30; // Start from the top left quadrant
    const startY = Math.random() * 30;
    const endX = startX + 30 + Math.random() * 40; // Move diagonally down-right
    const endY = startY + 30 + Math.random() * 40;
    const duration = Math.random() * 0.8 + 0.6; // 0.6-1.4 seconds
    const delay = Math.random() * 2;
    const size = Math.random() * 1 + 1;
    
    setShootingStars(prev => [...prev, {
      id, startX, startY, endX, endY, duration, delay, size
    }]);
    
    // Remove shooting star after animation completes
    setTimeout(() => {
      setShootingStars(prev => prev.filter(star => star.id !== id));
    }, (duration + delay + 0.5) * 1000);
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
      {/* Stars with twinkling effect */}
      <div className="absolute inset-0">
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
              opacity: [star.opacity, star.opacity * 0.3, star.opacity],
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
      
      {/* Moving nebulas */}
      <div 
        ref={nebulasRef} 
        className="absolute inset-0 transition-transform duration-[2000ms] ease-out"
        style={{ willChange: 'transform' }}
      >
        <div className="absolute top-[5%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/5 filter blur-[100px] animate-float" 
          style={{ animationDuration: '120s' }} />
        <div className="absolute bottom-[15%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-blue-500/5 filter blur-[100px] animate-float" 
          style={{ animationDuration: '100s', animationDelay: '10s', animationDirection: 'reverse' }} />
        <div className="absolute top-[40%] left-[20%] w-[25vw] h-[25vw] rounded-full bg-indigo-500/5 filter blur-[80px] animate-float" 
          style={{ animationDuration: '90s', animationDelay: '5s' }} />
      </div>
      
      {/* Floating particles */}
      <div 
        ref={particlesRef}
        className="absolute inset-0 transition-transform duration-[1500ms] ease-out"
        style={{ willChange: 'transform' }}
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
            animate={{
              y: [0, Math.random() * 30 - 15],
              x: [0, Math.random() * 30 - 15],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: `0 0 ${star.size * 3}px ${star.size}px rgba(255, 255, 255, 0.8)`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            left: [`${star.startX}%`, `${star.endX}%`],
            top: [`${star.startY}%`, `${star.endY}%`],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            ease: "easeOut",
          }}
        />
      ))}
      
      {/* Occasional glow bursts */}
      <motion.div
        className="absolute rounded-full bg-blue-500/10 filter blur-[80px]"
        style={{
          width: '20vw',
          height: '20vw',
        }}
        initial={{ opacity: 0, scale: 0.5, x: '30vw', y: '20vh' }}
        animate={{
          opacity: [0, 0.2, 0],
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
          opacity: [0, 0.2, 0],
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
  );
};

// Define prop types for components
interface WorkflowCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  index: number;
}

// --- MouseTrackCard with Border Glow ---
const MouseTrackCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Springs for animation - always initialize them
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  // Always create the motion template regardless of hover state
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`;

  // Client-side effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -8;
    const rotateYValue = ((x - centerX) / centerX) * 8;

    setMousePosition({ x: rotateYValue, y: rotateXValue });
  };

  // Update spring animations
  useEffect(() => {
    if (isHovered) {
      rotateX.set(mousePosition.y);
      rotateY.set(mousePosition.x);
    } else {
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [mousePosition, isHovered, rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformStyle: "preserve-3d", transform }}
    >
      {/* Border Glow effect - visible when mounted and hovered */}
      <motion.div
        className="absolute -inset-0.5 rounded-[inherit] z-[-1]"
        style={{
          // Apply a box shadow for the glow effect
          boxShadow: isMounted && isHovered
            ? '0 0 15px 3px oklch(var(--primary) / 0.5)' // Use primary color with alpha
            : 'none',
          opacity: isMounted && isHovered ? 1 : 0, // Control visibility
          transition: 'box-shadow 0.3s ease-in-out, opacity 0.3s ease-in-out', // Smooth transition
        }}
      />
      {children}
    </motion.div>
  );
};


// Fixed Animated Background to prevent hydration mismatch
const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Only run on client side
  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to viewport center
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Use consistent deterministic values for server rendering
  // Generate fixed positions for particles to prevent hydration mismatch
  const particlePositions = Array.from({ length: 20 }).map((_, i) => ({
    top: `${(i * 5) % 100}%`,
    left: `${(i * 7) % 100}%`,
    opacity: 0.3 + ((i % 5) * 0.1),
    animationDuration: `${10 + (i % 10)}s`,
    animationDelay: `${(i % 10) * 0.5}s`
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      {/* Grid pattern - only add mousemove effect after mount */}
      <div
        className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:10px_10px] bg-repeat opacity-5"
        style={mounted ? {
          transform: `translateX(${mousePosition.x * -5}px) translateY(${mousePosition.y * -5}px)`,
          transition: "transform 1s cubic-bezier(0.075, 0.82, 0.165, 1)"
        } : {}}
      />

      {/* Moving circles - large ones with conditional transforms */}
      <div
        className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-primary/5 filter blur-[100px] animate-float"
        style={{
          animationDuration: '30s',
          transform: mounted ? `translateX(${mousePosition.x * -30}px) translateY(${mousePosition.y * -30}px)` : 'none'
        }}
      />
      <div
        className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-secondary/5 filter blur-[100px] animate-float"
        style={{
          animationDuration: '25s',
          animationDelay: '2s',
          transform: mounted ? `translateX(${mousePosition.x * -20}px) translateY(${mousePosition.y * -20}px)` : 'none'
        }}
      />
      <div
        className="absolute bottom-[15%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-accent/5 filter blur-[100px] animate-float"
        style={{
          animationDuration: '28s',
          animationDelay: '1s',
          transform: mounted ? `translateX(${mousePosition.x * -25}px) translateY(${mousePosition.y * -25}px)` : 'none'
        }}
      />

      {/* Moving circles - medium ones */}
      <div className="absolute top-[30%] left-[25%] w-[20vw] h-[20vw] rounded-full bg-primary/10 filter blur-[80px] animate-float" style={{ animationDuration: '20s', animationDelay: '3s' }}></div>
      <div className="absolute top-[60%] right-[25%] w-[25vw] h-[25vw] rounded-full bg-secondary/10 filter blur-[80px] animate-float" style={{ animationDuration: '22s', animationDelay: '2.5s' }}></div>

      {/* Moving circles - small ones */}
      <div className="absolute top-[15%] right-[30%] w-[10vw] h-[10vw] rounded-full bg-accent/10 filter blur-[50px] animate-float" style={{ animationDuration: '18s', animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-[25%] right-[15%] w-[15vw] h-[15vw] rounded-full bg-primary/10 filter blur-[60px] animate-float" style={{ animationDuration: '15s', animationDelay: '1s' }}></div>
      <div className="absolute bottom-[45%] left-[10%] w-[12vw] h-[12vw] rounded-full bg-secondary/10 filter blur-[60px] animate-float" style={{ animationDuration: '17s', animationDelay: '0.5s' }}></div>

      {/* Animated particles with fixed positions to prevent hydration mismatch */}
      <div className="particles absolute inset-0 z-0">
        {particlePositions.map((pos, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 rounded-full bg-white/40"
            style={{
              top: pos.top,
              left: pos.left,
              opacity: pos.opacity,
              animation: `float ${pos.animationDuration} linear infinite`,
              animationDelay: pos.animationDelay
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Fixed MagneticButton - similar approach to MouseTrackCard
const MagneticButton: React.FC<{
  children: React.ReactNode,
  className?: string,
  onClick?: () => void,
  disabled?: boolean; // Added disabled prop
}> = ({ children, className, onClick, disabled }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Always initialize the springs
  const xMotion = useSpring(0, { damping: 20, stiffness: 200 });
  const yMotion = useSpring(0, { damping: 20, stiffness: 200 });

  // Client-side effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !isHovered || disabled) return; // Ignore if disabled

    const rect = buttonRef.current.getBoundingClientRect();
    // Calculate distance from center
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    // Scale down movement for subtlety (maximum 10px movement)
    setPosition({
      x: x * 0.2,
      y: y * 0.2
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  // Update springs in useEffect
  useEffect(() => {
    if (isMounted && !disabled) { // Only update if not disabled
      xMotion.set(position.x);
      yMotion.set(position.y);
    } else { // Reset if disabled
      xMotion.set(0);
      yMotion.set(0);
    }
  }, [position, xMotion, yMotion, isMounted, disabled]);

  return (
    <motion.button
      ref={buttonRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !disabled && setIsHovered(true)} // Only hover if not disabled
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled} // Pass disabled prop
      style={{
        x: xMotion,
        y: yMotion,
        transition: "transform 0.1s ease"
      }}
    >
      {children}
    </motion.button>
  );
};

// Enhanced underlined heading with gradient
const GradientHeading: React.FC<{
  children: React.ReactNode,
  className?: string,
  from?: string,
  via?: string,
  to?: string
}> = ({ children, className, from = "from-primary", via = "via-secondary", to = "to-accent" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`relative inline-block ${className || ''}`}
      initial={isMounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={isMounted && isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${from} ${via} ${to}`}>
        {children}
      </h2>
      {isMounted && (
        <motion.div
          className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r ${from} ${via} ${to} rounded-full`}
          initial={{ width: "0%" }}
          animate={isInView ? { width: "100%" } : { width: "0%" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </motion.div>
  );
};

// Workflow card component
const WorkflowCard = ({ title, description, link, icon, index }: WorkflowCardProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <MouseTrackCard className="h-full">
      <Card className="glass-card h-full backdrop-blur-lg border border-white/20 dark:border-white/10 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all duration-300 overflow-hidden">
        <motion.div
          initial={isMounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          whileInView={isMounted ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
          className="h-full flex flex-col"
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              {icon}
              <span>{title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
            <CardDescription className="text-sm text-foreground/80">{description}</CardDescription>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              variant="outline"
              className="gap-1 glass-button bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 hover:text-primary w-full justify-center group"
              asChild
            >
              <Link href={link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Open in Pixio API</span>
              </Link>
            </Button>
          </CardFooter>
        </motion.div>
      </Card>
    </MouseTrackCard>
  );
};

// Add these TypeScript interfaces for the component props
interface MachineFeaturedCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}

interface MachineCompactCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  link: string;
  index: number;
}

// --- Pricing section integrated for the homepage ---
interface PricingSectionProps {
  userTierId: string;
  isAuthenticated: boolean;
}

// PricingSection component with cyberpunk folder animation
const PricingSection = ({ userTierId, isAuthenticated }: PricingSectionProps) => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [isMounted, setIsMounted] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const switchRef = useRef<HTMLButtonElement>(null);
  const toggleAnimation = useRef(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Detect when section is in view
  useEffect(() => {
    if (!isMounted || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 } // Trigger when 30% visible
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isMounted]);

  // Animate the toggle switch on initial render - only on client
  useEffect(() => {
    if (isMounted && !toggleAnimation.current && switchRef.current) {
      setTimeout(() => {
        setBillingInterval('yearly');
        setTimeout(() => {
          setBillingInterval('monthly');
          toggleAnimation.current = true;
        }, 1500);
      }, 1000);
    }
  }, [isMounted]);

  // Function to handle subscription with redirect checkout
  const handleSubscribe = async (priceId: string) => {
    if (!isAuthenticated) return;
    setIsLoading(priceId);

    try {const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message || 'Something went wrong');
      setIsLoading(null);
    }
  };

  return (
    <div ref={sectionRef} className="relative py-20 z-10">
      <div className="absolute inset-0 cyberpunk-bg-overlay"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <GradientHeading className="mb-4 justify-center mx-auto text-center">
            Subscription Plans
          </GradientHeading>
          
          <motion.p
            className="text-lg text-muted-foreground mb-8"
            initial={isMounted ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
            whileInView={isMounted ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Choose the perfect plan for your needs. All plans include access to Tini Studio machines.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            className="flex items-center justify-center space-x-4 mb-16"
            initial={isMounted ? { opacity: 0 } : { opacity: 1 }}
            whileInView={isMounted ? { opacity: 1 } : {}}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className={`text-sm ${billingInterval === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              ref={switchRef}
              type="button"
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary/20 backdrop-blur-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 cyber-switch"
              role="switch"
              aria-checked={billingInterval === 'yearly'}
              onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
            >
              <motion.span
                aria-hidden="true"
                className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-all duration-300 cyber-switch-handle"
                animate={isMounted ? {
                  x: billingInterval === 'yearly' ? 20 : 0
                } : {}}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              />
              <span className="sr-only">{billingInterval === 'monthly' ? 'Switch to yearly billing' : 'Switch to monthly billing'}</span>

              {/* Particle effects on toggle */}
              {isMounted && (
                <AnimatePresence>
                  {billingInterval === 'yearly' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-0 top-0"
                    >
                      {[...Array(5)].map((_, i: number) => (
                        <motion.div
                          key={i}
                          className="absolute h-1 w-1 rounded-full bg-accent/50"
                          initial={{
                            x: 0,
                            y: 0,
                            opacity: 1,
                            scale: 0.5 + (i * 0.1)
                          }}
                          animate={{
                            x: ((i % 3) - 1) * 10,
                            y: ((i % 3) - 1) * 10,
                            opacity: 0,
                            scale: 0
                          }}
                          transition={{
                            duration: 0.4 + (i * 0.1),
                            ease: "easeOut"
                          }}
                          style={{
                            top: `${(i * 20) + 10}%`,
                            right: `${(i * 10) + 10}%`
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </button>
            <span className={`text-sm flex items-center gap-1.5 ${billingInterval === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Yearly
              <motion.span
                className="inline-block px-1.5 py-0.5 text-xs rounded-full bg-accent/10 text-accent/90 font-medium backdrop-blur-sm cyber-discount-badge"
                animate={isMounted ? {
                  scale: billingInterval === 'yearly' ? [1, 1.1, 1] : 1
                } : {}}
                transition={{
                  duration: 0.4,
                  times: [0, 0.5, 1],
                  ease: "easeInOut"
                }}
              >
                Save up to 16%
              </motion.span>
            </span>
          </motion.div>
        </div>

     {/* Cyberpunk folder with pricing cards */}
<div className="cyber-folder-container">
  {/* Folder */}
  <motion.div 
  className="folder-container-neon"
  data-state={isInView ? "active" : "inactive"}
  initial={{ opacity: 0, y: 20 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8, delay: 0.2 }}
>
  <div className="doc-sheet sheet-1"></div>
  <div className="doc-sheet sheet-2"></div>
  <div className="doc-sheet sheet-3"></div>

  <div className="folder-card-neon">
    <div className="flex justify-center items-center h-full">
      <div className="flex items-center space-x-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 folder-icon-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-xl font-semibold folder-title-neon">PLANS</h2>
      </div>
    </div>
  </div>
</motion.div>

          {/* Pricing tiers that slide out from the folder */}
          <div className="cyber-pricing-cards">
            {PRICING_TIERS.map((tier, index) => {
              const price = tier.pricing[billingInterval];
              const isCurrentPlan = userTierId === tier.id;

              // Determine button content and action
              let buttonContent: React.ReactNode;
              let buttonAction: (() => void) | undefined;
              let buttonLink: string | undefined;
              let buttonDisabled = false;
              let buttonStyleClass = tier.popular
                ? 'cyber-btn-premium'
                : 'cyber-btn-standard';

              if (!isAuthenticated) {
                buttonContent = "Sign up";
                buttonLink = "/signup";
              } else {
                if (price.priceId) {
                  if (isCurrentPlan) {
                    buttonContent = "Current Plan";
                    buttonDisabled = true;
                    buttonStyleClass += ' cyber-btn-disabled';
                  } else {
                    buttonContent = isLoading === price.priceId ? 'Processing...' : 'Subscribe';
                    buttonAction = () => handleSubscribe(price.priceId!);
                    buttonDisabled = isLoading === price.priceId;
                  }
                } else {
                  if (isCurrentPlan) {
                    buttonContent = "Current Plan";
                    buttonDisabled = true;
                    buttonStyleClass += ' cyber-btn-disabled';
                  } else {
                    buttonContent = "Get Started";
                    buttonLink = "/dashboard";
                  }
                }
              }

              return (
                <motion.div
                  key={tier.id}
                  className={`cyber-pricing-card ${tier.popular ? 'cyber-card-popular' : ''}`}
                  initial={{ 
                    opacity: 0, 
                    x: index === 0 ? -80 : (index === 2 ? 80 : 0), 
                    y: index === 1 ? -50 : 0,
                    rotateZ: index === 0 ? -15 : (index === 2 ? 15 : 0)
                  }}
                  animate={isInView ? { 
                    opacity: 1, 
                    x: index === 0 ? -200 : (index === 2 ? 200 : 0),
                    y: index === 1 ? -100 : 0,
                    rotateZ: index === 0 ? -5 : (index === 2 ? 5 : 0)
                  } : {}}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.6 + (index * 0.2),
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                >
                  {tier.popular && (
                    <div className="cyber-badge">
                      <Star className="h-3 w-3" />
                      <span>Popular</span>
                    </div>
                  )}

                  <div className="cyber-card-header">
                    <h3 className={`cyber-card-title ${tier.popular ? "text-primary" : ""}`}>{tier.name}</h3>
                    <p className="cyber-card-desc">{tier.description}</p>
                    
                    <div className="cyber-price-container">
                      {price.amount ? (
                        <div className="cyber-price">
                          <motion.span
                            className="cyber-price-amount"
                            key={`${price.amount}-${billingInterval}`}
                            initial={isMounted ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                            animate={isMounted ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            {formatPrice(price.amount)}
                          </motion.span>
                          <span className="cyber-price-period">/{billingInterval === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                      ) : (
                        <span className="cyber-price-free">Free</span>
                      )}

                      {isMounted && billingInterval === 'yearly' && tier.pricing.yearly.discount && (
                        <motion.p
                          className="cyber-discount"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key="yearly-discount"
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          Save {tier.pricing.yearly.discount}% with annual billing
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="cyber-card-content">
                    <ul className="cyber-features">
                      {tier.features.map((feature: string, i: number) => (
                        <motion.li
                          key={i}
                          className="cyber-feature-item"
                          initial={isMounted ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                          whileInView={isMounted ? { opacity: 1, x: 0 } : {}}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.05 * i }}
                        >
                          <Check className="cyber-check-icon" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="cyber-card-footer">
                    <button
                      onClick={buttonAction}
                      disabled={buttonDisabled}
                      className={`cyber-btn ${buttonStyleClass}`}
                    >
                      {buttonLink ? (
                        <Link href={buttonLink} className="cyber-btn-content">
                          {buttonContent}
                        </Link>
                      ) : (
                        <span className="cyber-btn-content">{buttonContent}</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cyberpunk styles - leave your CSS here */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Poppins:wght@400;600&display=swap');
        
        .cyber-folder-container {
          position: relative;
          display: flex;
          justify-content: center;
          min-height: 600px;
          margin-top: 3rem;
          perspective: 2000px;
        }
        
        .cyberpunk-bg-overlay::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(126, 87, 194, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(126, 87, 194, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          z-index: 0;
        }
        
        .cyber-folder-container {
          position: relative;
          display: flex;
          justify-content: center;
          min-height: 600px;
          margin-top: 3rem;
          perspective: 2000px;
        }

        /* Folder and docs styles */
        .folder-container-neon {
          position: absolute;
          width: 280px;
          height: 300px;
          transition: transform 0.6s ease-out;
          transform-style: preserve-3d;
          z-index: 1;
          top: 0;
        }

        .doc-sheet {
          position: absolute;
          bottom: 115px;
          left: 50%;
          width: 80px;
          background-color: rgba(10, 10, 30, 0.6);
          border-radius: 4px 4px 0 0;
          transform-origin: bottom center;
          opacity: 0.7;
          transition: all 0.5s ease-out;
          border: 1px solid currentColor;
          border-bottom: none;
          box-shadow: 0 0 10px currentColor, 0 0 15px currentColor;
        }
        
        .sheet-1 {
          color: #00ffff;
          height: 30px;
          transform: translateX(calc(-50% - 55px)) rotate(-12deg);
          z-index: 1; 
        }
        
        .sheet-2 {
          color: #ff00ff;
          height: 35px;
          transform: translateX(-50%) rotate(0deg);
          z-index: 2; 
          width: 90px;
        }
        
        .sheet-3 {
          color: #00ff00;
          height: 28px;
          transform: translateX(calc(-50% + 55px)) rotate(12deg);
          z-index: 1; 
        }

        .folder-card-neon {
          position: absolute;
          bottom: 40px;
          left: 0;
          width: 100%;
          height: 120px;
          background-color: rgba(20, 20, 50, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 255, 255, 0.4);
          border-radius: 0 8px 16px 16px;
          box-shadow:
            0 0 10px rgba(0, 255, 255, 0.5),
            0 0 15px rgba(255, 0, 255, 0.4),
            0 0 20px rgba(0, 255, 0, 0.3),
            inset 0 0 8px rgba(0,0,0,0.4);
          padding: 1.5rem 2rem;
          z-index: 5;
          transition: all 0.6s ease-out;
          font-family: 'Orbitron', sans-serif;
          border-top: none;
          transform-style: preserve-3d;
        }
        
        .folder-card-neon::before {
          content: '';
          position: absolute;
          top: -20px;
          left: -1px;
          height: 20px;
          width: 120px;
          background-color: rgba(20, 20, 50, 0.95);
          border: 1px solid rgba(0, 255, 255, 0.4);
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          box-shadow: 0 -3px 8px rgba(0, 255, 255, 0.3);
        }

        .folder-icon-neon {
          color: #00ffff;
          filter: drop-shadow(0 0 8px #00ffff) drop-shadow(0 0 12px #00ffff);
        }
        
        .folder-title-neon {
          color: #e0e0e0;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-shadow:
            0 0 4px #00ffff,
            0 0 8px #ff00ff,
            0 0 12px #00ff00;
        }
        
        /* Folder active state (triggered by isInView) */
        .cyber-folder-container:has(.folder-container-neon[data-state="active"]) .sheet-1 {
          height: 90px;
          opacity: 0.9;
          box-shadow: 0 0 15px currentColor, 0 0 25px currentColor;
          transform: translateX(calc(-50% - 60px)) rotate(-15deg) translateZ(10px);
        }
        
        .cyber-folder-container:has(.folder-container-neon[data-state="active"]) .sheet-2 {
          height: 100px;
          opacity: 0.9;
          box-shadow: 0 0 15px currentColor, 0 0 25px currentColor;
          transform: translateX(-50%) rotate(0deg) translateZ(15px);
        }
        
        .cyber-folder-container:has(.folder-container-neon[data-state="active"]) .sheet-3 {
          height: 85px;
          opacity: 0.8;
          box-shadow: 0 0 15px currentColor, 0 0 25px currentColor;
          transform: translateX(calc(-50% + 60px)) rotate(15deg) translateZ(10px);
        }
        
        /* Pricing cards */
        .cyber-pricing-cards {
          display: flex;
          justify-content: center;
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 280px; /* Space for the folder */
        }
        
        .cyber-pricing-card {
          position: relative;
          width: 300px;
          background-color: rgba(20, 20, 50, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 255, 255, 0.3);
          box-shadow:
            0 0 10px rgba(0, 255, 255, 0.3),
            0 0 15px rgba(255, 0, 255, 0.2),
            inset 0 0 8px rgba(0,0,0,0.4);
          border-radius: 8px;
          padding: 1.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          opacity: 0;
          z-index: 10;
        }
        
        .cyber-pricing-card:hover {
          transform: translateY(-10px) scale(1.03) !important;
          box-shadow:
            0 0 15px rgba(0, 255, 255, 0.5),
            0 0 25px rgba(255, 0, 255, 0.3),
            inset 0 0 8px rgba(0,0,0,0.4);
        }
        
        .cyber-card-popular {
          border: 1px solid rgba(0, 255, 255, 0.6);
          background-color: rgba(30, 30, 60, 0.9);
          box-shadow:
            0 0 20px rgba(0, 255, 255, 0.5),
            0 0 30px rgba(255, 0, 255, 0.3),
            inset 0 0 10px rgba(0,0,0,0.5);
          z-index: 11;
        }
        
        .cyber-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: linear-gradient(to right, rgba(0, 255, 255, 0.7), rgba(255, 0, 255, 0.7));
          text-align: center;
          padding: 0.5rem 1rem;
          border-radius: 0 8px 0 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        }
        
        .cyber-card-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 255, 255, 0.3);
          margin-bottom: 1rem;
        }
        
        .cyber-card-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #ffffff, #00ffff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
        }
        
        .cyber-card-desc {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        
        .cyber-price-container {
          margin-top: 1rem;
        }
        
        .cyber-price {
          display: flex;
          align-items: flex-end;
        }
        
        .cyber-price-amount {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          text-shadow:
            0 0 5px rgba(0, 255, 255, 0.7),
            0 0 10px rgba(0, 255, 255, 0.5);
        }
        
        .cyber-price-period {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          margin-left: 0.25rem;
          margin-bottom: 0.25rem;
        }
        
        .cyber-price-free {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          text-shadow:
            0 0 5px rgba(0, 255, 255, 0.7),
            0 0 10px rgba(0, 255, 255, 0.5);
        }
        
        .cyber-discount {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #00ff88;
          text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
        }
        
        .cyber-features {
          padding: 0;
          margin: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .cyber-feature-item {
          display: flex;
          align-items: start;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
        }
        
        .cyber-check-icon {
          color: #00ffaa;
          width: 1rem;
          height: 1rem;
          margin-top: 0.125rem;
          filter: drop-shadow(0 0 3px rgba(0, 255, 170, 0.5));
        }
        
        .cyber-card-footer {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 255, 255, 0.3);
        }
        
        .cyber-btn {
          width: 100%;
          display: block;
          padding: 0.6rem 1rem;
          font-family: 'Orbitron', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          text-align: center;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          border: none;
        }
        
        .cyber-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: all 0.6s ease;
        }
        
        .cyber-btn:hover::before {
          left: 100%;
        }
        
        .cyber-btn-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        
        .cyber-btn-standard {
          background-color: rgba(0, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(0, 255, 255, 0.5);
          box-shadow:
            0 0 5px rgba(0, 255, 255, 0.3),
            0 0 10px rgba(0, 255, 255, 0.2),
            inset 0 0 5px rgba(0, 255, 255, 0.1);
          text-shadow: 0 0.cyber-btn-standard {
          background-color: rgba(0, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(0, 255, 255, 0.5);
          box-shadow:
            0 0 5px rgba(0, 255, 255, 0.3),
            0 0 10px rgba(0, 255, 255, 0.2),
            inset 0 0 5px rgba(0, 255, 255, 0.1);
          text-shadow: 0 0 4px rgba(0, 255, 255, 0.5);
        }
        
        .cyber-btn-standard:hover {
          background-color: rgba(0, 255, 255, 0.3);
          box-shadow:
            0 0 10px rgba(0, 255, 255, 0.5),
            0 0 15px rgba(0, 255, 255, 0.3),
            inset 0 0 8px rgba(0, 255, 255, 0.2);
        }
        
        .cyber-btn-premium {
          background: linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.3));
          color: white;
          border: 1px solid rgba(255, 0, 255, 0.5);
          box-shadow:
            0 0 10px rgba(255, 0, 255, 0.4),
            0 0 15px rgba(0, 255, 255, 0.3),
            inset 0 0 8px rgba(255, 0, 255, 0.2);
          text-shadow:
            0 0 4px rgba(255, 0, 255, 0.5),
            0 0 8px rgba(0, 255, 255, 0.4);
        }
        
        .cyber-btn-premium:hover {
          background: linear-gradient(135deg, rgba(0, 255, 255, 0.4), rgba(255, 0, 255, 0.4));
          box-shadow:
            0 0 15px rgba(255, 0, 255, 0.6),
            0 0 25px0 0 15px rgba(255, 0, 255, 0.6),
            0 0 25px rgba(0, 255, 255, 0.4),
            inset 0 0 12px rgba(255, 0, 255, 0.3);
        }
        
        .cyber-btn-disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .cyber-btn-disabled:hover::before {
          left: -100%;
        }
        
        /* Switch styling */
        .cyber-switch {
          background: linear-gradient(to right, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2));
          border: 1px solid rgba(0, 255, 255, 0.4);
          box-shadow: 
            0 0 5px rgba(0, 255, 255, 0.4), 
            0 0 10px rgba(255, 0, 255, 0.3);
        }
        
        .cyber-switch-handle {
          background: linear-gradient(135deg, #ffffff, #e0e0e0);
          box-shadow: 
            0 0 5px rgba(0, 255, 255, 0.5),
            0 0 8px rgba(255, 0, 255, 0.3);
        }
        
        .cyber-discount-badge {
          background: linear-gradient(to right, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2));
          border: 1px solid rgba(0, 255, 255, 0.4);
          box-shadow: 
            0 0 5px rgba(0, 255, 255, 0.3), 
            0 0 8px rgba(255, 0, 255, 0.2);
          color: white;
          text-shadow: 0 0 4px rgba(0, 255, 255, 0.6);
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .cyber-pricing-cards {
            padding-top: 320px;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }
          
          .cyber-pricing-card {
            transform: none !important;
            opacity: 0;
          }
        }
        
        @media (max-width: 640px) {
          .folder-container-neon {
            transform: scale(0.8);
          }
          
          .cyber-pricing-card {
            width: 85%;
            max-width: 300px;
          }
        }
        
        /* Animation for the folder elements on in-view */
        @keyframes folder-active-glow {
          0%, 100% {
            box-shadow:
              0 0 10px rgba(0, 255, 255, 0.5),
              0 0 15px rgba(255, 0, 255, 0.4),
              0 0 20px rgba(0, 255, 0, 0.3),
              inset 0 0 8px rgba(0,0,0,0.4);
          }
          50% {
            box-shadow:
              0 0 15px rgba(0, 255, 255, 0.7),
              0 0 25px rgba(255, 0, 255, 0.6),
              0 0 35px rgba(0, 255, 0, 0.5),
              inset 0 0 12px rgba(0,0,0,0.5);
          }
        }
        
        /* Apply the animation when the section is in view */
        .folder-container-neon[data-state="active"] .folder-card-neon {
          transform: translateY(-10px) scale(1.03);
          animation: folder-active-glow 2s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
};

// Update components with TypeScript interfaces
const MachineFeaturedCard: React.FC<MachineFeaturedCardProps> = ({ title, description, image, link, tags }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <motion.div
      className="rounded-2xl overflow-hidden bg-black/30 backdrop-blur-lg border border-white/10 shadow-xl"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Machine Visualization */}
        <div className="relative w-full md:w-1/2 aspect-video md:aspect-square overflow-hidden">
          {/* Placeholder gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/80 to-accent/80"></div>
          
          {/* Optional image */}
          {image && (
            <div className="absolute inset-0 z-10">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>
            </div>
          )}
          
          {/* Machine type badge */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-xs font-medium text-white border border-white/10">
            Featured Machine
          </div>
        </div>
        
        {/* Content */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              {title}
            </h3>
            <p className="text-white/70 mb-6">{description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="px-2.5 py-1 text-xs rounded-full bg-white/10 text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Action button */}
          <div className="flex gap-3 mt-auto">
            <Button 
              className="flex-1 bg-gradient-to-r from-primary/90 to-secondary/90 text-white hover:opacity-90"
              asChild
            >
              <Link href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full">
                <span>Try Now</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MachineCompactCard: React.FC<MachineCompactCardProps> = ({ title, description, icon, color, link, index }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <motion.div
      className="relative w-[280px] flex-shrink-0"
      initial={isMounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      whileInView={isMounted ? { opacity: 1, y: 0 } : {}}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <Link href={link} target="_blank" rel="noopener noreferrer">
        <motion.div 
          className="h-full rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {/* Icon/Visual */}
          <div className={`p-6 bg-gradient-to-r ${color} flex justify-center items-center`}>
            <span className="text-4xl">{icon}</span>
          </div>
          
          {/* Content */}
          <div className="p-5">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-foreground/70">{description}</p>
            
            {/* Action link */}
            <div className="mt-4 flex justify-end">
              <div className="flex items-center gap-1 text-xs font-medium text-primary/90">
                <span>Explore</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

// --- Main Landing Page Component ---
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  const progressBarScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // State for user and subscription data
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userTierId, setUserTierId] = useState<string>('free'); // Default to free

  // Fetch user and subscription data on client-side
  useEffect(() => {
    setMounted(true);

    const checkAuthAndSubscription = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        // Fetch subscription if user is logged in
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*, prices(id, products(*))')
          .eq('user_id', user.id)
          .in('status', ['trialing', 'active'])
          .maybeSingle();

        if (subscription) {
          const priceId = subscription.prices?.id;
          const { tier } = getTierByPriceId(priceId);
          if (tier) {
            setUserTierId(tier.id);
          }
        } else {
          setUserTierId('free'); // User is logged in but has no active subscription
        }
      } else {
        setUserTierId('free'); // User is not logged in
      }
    };

    checkAuthAndSubscription();
  }, []);

  return (
    <>
      {/* Progress bar - only on client */}
      {mounted && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-50 origin-left"
          style={{ scaleX: progressBarScaleX }}
        />
      )}

      {/* Enhanced Space Background */}
      <EnhancedSpaceBackground />

      {/* Animated background */}
      <AnimatedBackground />

      {/* Hero section */}
      <motion.section
        className="relative py-24 md:py-36 z-10"
        style={mounted ? { opacity: heroOpacity, y: heroY } : {}}
      >
        <div className="container mx-auto px-4 relative">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
  className="inline-block mb-4 px-4 py-1.5 bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-full text-foreground/90 text-sm border border-white/20 shadow-lg"
  initial={mounted ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
  animate={mounted ? { opacity: 1, y: 0 } : {}}
  transition={{ delay: 0.1, duration: 0.6 }}
>
  <span className="flex items-center gap-1.5">
    Powered by 
    <span className="relative inline-flex items-center">
      <Crown className="absolute h-4 w-4 text-purple-500 top-[-15px] left-[80%] transform -translate-x-1/2 rotate-[15deg]" />
      {/* Enhanced clickable link to Pixio */}
      <Link 
        href="https://pixio.myapps.ai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="font-medium text-purple-500 hover:text-purple-400 transition-colors relative group"
      >
        Pixio
        <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      </Link>
    </span>
  </span>
</motion.div>

            <motion.div
  initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
  animate={mounted ? { opacity: 1, y: 0 } : {}}
  transition={{ delay: 0.3, duration: 0.8 }}
>
  <GradientTextPressure
    text="Welcome To Tini Studio"
    className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
    minFontSize={36}
    width={true}
    weight={true}
    italic={true}
  />
</motion.div>

            <motion.p
              className="text-lg sm:text-xl text-foreground/80 mb-8 leading-relaxed"
              initial={mounted ? { opacity: 0 } : { opacity: 1 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Unleash AI creativity with powerful machines for stunning image and video generation,
              powered by Supabase and a flexible credit system
            </motion.p>

           <motion.div
  className="flex justify-center"
  initial={mounted ? { opacity: 0 } : { opacity: 1 }}
  animate={mounted ? { opacity: 1 } : {}}
  transition={{ delay: 0.7, duration: 0.8 }}
>
  <MagneticButton className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white rounded-md py-3 px-6 font-medium shadow-md hover:shadow-lg transition-shadow">
    <Link href="http://localhost:3000/login" target="_blank" rel="noopener noreferrer" className="flex items-center">
      <ExternalLink className="mr-2 h-4 w-4" />
      Get Started
    </Link>
  </MagneticButton>
</motion.div>
          </motion.div>
        </div>

        {/* Bouncing arrow indicator - client-side only */}
{mounted && (
  <motion.div
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    animate={{
      y: [0, 10, 0]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatType: "loop"
    }}
  >
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary/70"
      whileHover={{ scale: 1.2 }}
    >
      <path d="M12 5v14M5 12l7 7 7-7"/>
    </motion.svg>
  </motion.div>
)}
      </motion.section>{/* Features section */}
      <section className="py-20 z-10 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <GradientHeading className="mx-auto justify-center">
              Powerful AI Generation Features
            </GradientHeading>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <MouseTrackCard>
              <motion.div
                className="glass-card rounded-xl p-6 backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Image Generation</h3>
                <p className="text-foreground/80">
                Experience the creative potential of our AI. Turn descriptive text into compelling visuals that elevate your projects and bring clarity to your ideas.
                </p>
              </motion.div>
            </MouseTrackCard>

            {/* Feature 2 */}
            <MouseTrackCard>
              <motion.div
                className="glass-card rounded-xl p-6 backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-secondary/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-secondary">Video Generation</h3>
                <p className="text-foreground/80">
                Elevate storytelling through motion. Our AI video generation transforms your concepts into seamless animations, adding a new dimension to your creative projects.                </p>
              </motion.div>
            </MouseTrackCard>

            {/* Feature 3 */}
            <MouseTrackCard>
              <motion.div
                className="glass-card rounded-xl p-6 backdrop-blur-lg border border-white/20 dark:border-white/10 h-full"
                initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="w-12 h-12 bg-accent/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-accent/90">Credit System</h3>
                <p className="text-foreground/80">
                  Flexible credit-based system with pay-as-you-go options. Use credits for different generation types based on your needs.
                </p>
              </motion.div>
            </MouseTrackCard>
          </div>
        </div>
      </section>

      {/* Tini Studio Machines section - Simplified to fix TypeScript errors */}
<section className="py-20 z-10 relative overflow-hidden" id="machines">
  <div className="container mx-auto px-4">
    {/* Section header */}
    <div className="text-center mb-16">
      <GradientHeading 
        className="mx-auto justify-center mb-4" 
        from="from-[#FF6CAB]" 
        via="via-[#7366FF]" 
        to="to-[#3B82F6]"
      >
        Tini Studio Creative Engines
      </GradientHeading>
      
      <motion.p
        className="text-center text-foreground/80 max-w-2xl mx-auto"
        initial={mounted ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        whileInView={mounted ? { opacity: 1, y: 0 } : {}}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Ready-to-use AI machines for stunning image and video generation
      </motion.p>
    </div>

    {/* Featured machine */}
    <div className="mb-16">
      <motion.div
        initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        whileInView={mounted ? { opacity: 1, y: 0 } : {}}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <MachineFeaturedCard 
          title="Flux AI Art Generator"
          description="Create stunning illustrations and artwork with advanced LoRA fine-tuning capabilities. Perfect for digital artists, designers, and creative professionals looking to push boundaries."
          image=""
          link="https://api.myapps.ai/share/alisher-farhadi-book-illustrations"
          tags={["Stable Diffusion XL", "LoRA", "Controlnet", "Artist Styles"]}
        />
      </motion.div>
    </div>
    
    {/* Machine categories */}
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      <button className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/90 to-secondary/90 text-white shadow-lg">
        All Machines
      </button>
      <button className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-foreground/80 hover:bg-white/15">
        Image Generation
      </button>
      <button className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-foreground/80 hover:bg-white/15">
        Video Creation
      </button>
      <button className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-foreground/80 hover:bg-white/15">
        Animation
      </button>
    </div>

    {/* Specialized machines */}
    <div className="mb-12">
      <h3 className="text-xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
        Specialized Machines
      </h3>

      {/* Scrollable container */}
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
          <MachineCompactCard
            title="Wan 2.1 Video Generator"
            description="Transform text into smooth, high-quality video animations with minimal effort"
            icon="🎬"
            color="from-blue-500 to-purple-600"
            link="https://api.myapps.ai/share/alisher-farhadi-wan"
            index={0}
          />
          
          <MachineCompactCard
            title="Frame-to-Frame Animator"
            description="Create fluid animations between start and end images with precision control"
            icon="🎭"
            color="from-purple-500 to-pink-600"
            link="https://api.myapps.ai/share/alisher-farhadi-wan-2-1-first-to-last-frame"
            index={1}
          />
          
          <MachineCompactCard
            title="Character Creator"
            description="Design consistent characters with customizable attributes and poses"
            icon="👤"
            color="from-amber-500 to-rose-600"
            link="#"
            index={2}
          />
          
          <MachineCompactCard
            title="Landscape Designer"
            description="Generate breathtaking landscapes with mood and lighting controls"
            icon="🏞️"
            color="from-emerald-500 to-cyan-600"
            link="#"
            index={3}
          />
        </div>
      </div>
    </div>

    {/* CTA Banner */}
    <div className="rounded-xl overflow-hidden glass-card backdrop-blur-lg border border-white/10 p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-2/3">
          <h3 className="text-xl md:text-2xl font-bold mb-3">Ready to bring your ideas to life?</h3>
          <p className="text-foreground/80">Tini Studio machines are available now with our flexible credit system.</p>
        </div>
        
        <div className="w-full md:w-1/3 flex justify-center md:justify-end">
          <MagneticButton className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white rounded-md py-3 px-6 font-medium shadow-md hover:shadow-lg transition-shadow">
            <Link href="/signup" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Start Creating</span>
            </Link>
          </MagneticButton>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* How it works section */}
<section className="py-20 z-10 relative">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <GradientHeading className="mx-auto justify-center" from="from-pink-500" via="via-purple-500" to="to-blue-500">
        How Tini Studio Works
      </GradientHeading>
    </div>

    <div className="grid md:grid-cols-3 gap-10 relative">
      {/* Connecting line with animated gradient - client-side only */}
      {mounted && (
        <div className="hidden md:block absolute top-24 left-[10%] right-[10%] h-1.5 overflow-hidden rounded-full">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      )}

      {/* Step 1 */}
      <MouseTrackCard>
        <motion.div
          className="relative glass-card py-10 px-6 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full rounded-xl overflow-hidden shadow-xl"
          initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
          whileInView={mounted ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Corner accent */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-pink-500/10 rounded-full blur-lg"></div>
          
          {/* Step number */}
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20 blur-lg"></div>
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 z-10 relative shadow-lg">
              {mounted ? (
                <motion.span
                  className="text-xl font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  1
                </motion.span>
              ) : (
                <span className="text-xl font-bold">1</span>
              )}
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">Choose Your Type</h3>
          
          <p className="text-foreground/80 leading-relaxed">
            Select from our library of sophisticated image and video generation models in our intuitive dashboard interface.
          </p>
          
          {/* Updated icon for Step 1 */}
          {mounted && (
            <motion.div 
              className="absolute bottom-4 right-4 text-pink-500/20"
              animate={{ rotate: [0, 10, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <rect x="4" y="4" width="6" height="6" rx="1"></rect>
  <rect x="14" y="4" width="6" height="6" rx="1"></rect>
  <rect x="4" y="14" width="6" height="6" rx="1"></rect>
  <rect x="14" y="14" width="6" height="6" rx="1"></rect>
  <circle cx="7" cy="7" r="1"></circle>
  <circle cx="17" cy="17" r="1"></circle>
</svg>
            </motion.div>
          )}
        </motion.div>
      </MouseTrackCard>

      {/* Step 2 */}
      <MouseTrackCard>
        <motion.div
          className="relative glass-card py-10 px-6 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full rounded-xl overflow-hidden shadow-xl"
          initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
          whileInView={mounted ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Corner accent */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/10 rounded-full blur-lg"></div>
          
          {/* Step number */}
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-lg"></div>
            <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 z-10 relative shadow-lg">
              {mounted ? (
                <motion.span
                  className="text-xl font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                >
                  2
                </motion.span>
              ) : (
                <span className="text-xl font-bold">2</span>
              )}
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500">Craft Your Prompt</h3>
          
          <p className="text-foreground/80 leading-relaxed">
            Create detailed prompts with our guidance system to precisely control your creative output and achieve desired results.
          </p>
          
          {/* Updated icon for Step 2 */}
          {mounted && (
            <motion.div 
              className="absolute bottom-4 right-4 text-purple-500/20"
              animate={{ rotate: [0, -10, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </motion.div>
          )}
        </motion.div>
      </MouseTrackCard>

      {/* Step 3 */}
      <MouseTrackCard>
        <motion.div
          className="relative glass-card py-10 px-6 text-center backdrop-blur-lg border border-white/20 dark:border-white/10 h-full rounded-xl overflow-hidden shadow-xl"
          initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
          whileInView={mounted ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Corner accent */}
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-lg"></div>
          
          {/* Step number */}
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-lg"></div>
            <div className="bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 z-10 relative shadow-lg">
              {mounted ? (
                <motion.span
                  className="text-xl font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                >
                  3
                </motion.span>
              ) : (
                <span className="text-xl font-bold">3</span>
              )}
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500">Create & Download</h3>
          
          <p className="text-foreground/80 leading-relaxed">
            Generate high-quality assets using your available credits and instantly download your professional creations.
          </p>
          
          {/* Decorative icon */}
          {mounted && (
            <motion.div 
              className="absolute bottom-4 right-4 text-blue-500/20"
              animate={{ rotate: [0, 10, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </motion.div>
          )}
        </motion.div>
      </MouseTrackCard>
    </div>
  </div>
</section>

      {/* Pricing section - Pass user data */}
      <section className="py-20 z-10 relative" id="pricing">
        <div className="container mx-auto px-4">
          <PricingSection userTierId={userTierId} isAuthenticated={isAuthenticated} />
        </div>
      </section>

      {/* Tech stack section */}
{/* Tech stack section */}
<motion.section
  className="py-20 z-10 relative" 
  style={{ transform: 'translateY(-3rem)' }}
  initial={mounted ? { opacity: 0 } : { opacity: 1 }}
  whileInView={mounted ? { opacity: 1 } : {}}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <GradientHeading className="mx-auto justify-center" from="from-primary" via="via-secondary" to="to-accent">
        Built With Modern Tech
      </GradientHeading>
    </div>

    <motion.p
      className="text-center text-foreground/80 mb-8 max-w-3xl mx-auto"
      initial={mounted ? { opacity: 0 } : { opacity: 1 }}
      whileInView={mounted ? { opacity: 1 } : {}}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      A powerful stack of technologies to provide a seamless experience
    </motion.p>

    {/* Improved cloud container with better responsiveness */}
    <div className="relative">
      {/* Background elements */}
      {mounted && (
        <>
          <motion.div 
            className="absolute top-[-10%] left-[20%] w-[20vw] h-[20vw] rounded-full bg-primary/5 filter blur-[80px] z-0"
            animate={{ 
              y: [0, -15, 0],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div 
            className="absolute bottom-[-5%] right-[25%] w-[15vw] h-[15vw] rounded-full bg-secondary/5 filter blur-[70px] z-0"
            animate={{ 
              y: [0, 20, 0],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
          />
        </>
      )}

      {/* Custom responsive cloud container */}
      <div className="relative">
        {/* Enhanced responsive cloud */}
        <motion.div
          initial={mounted ? { opacity: 0 } : { opacity: 1 }}
          whileInView={mounted ? { opacity: 1 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 h-[450px] md:h-[550px] -mx-4 sm:mx-0 overflow-visible border-0 outline-none pb-10"
          style={{ boxShadow: 'none' }}
        >
          {mounted && (
            <>
              {/* Enhanced IconCloud with properly typed props */}
              <EnhancedIconCloud 
                iconSlugs={[
                  // Core stack from your original list
                  "nextdotjs", 
                  "supabase", 
                  "stripe", 
                  "tailwindcss", 
                  "typescript", 
                  "react",
                  "comfyui", // For image generation
                  "openai", // For AI capabilities
                  "nvidia", // For GPU processing (relevant to ComfyUI)
                  "cloudflare", // For API concepts (PixioAPI alternative)
                  "vercel", // For deployment
                  
                  // Frontend technologies
                  "html5",
                  "css3",
                  "javascript",
                  "framermotion",
                  "figma",
                  
                  // Backend & database
                  "postgresql", 
                  "nodedotjs",
                  
                  // Development tools
                  "git",
                  "github",
                  "gitlab",
                  "vscode",
                  "docker",
                  "npm",
                  
                  // Additional relevant tech
                  "threedotjs", // For 3D effects
                  "netlify", // For deployment alternatives
                  "eslint", // For code quality
                ]}
                randomRotation={true}
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  </div>
</motion.section>

      {/* CTA section */}
      <motion.section
        className="py-20 z-10 relative"
        initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
        whileInView={mounted ? { opacity: 1, y: 0 } : {}}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="glass-card p-8 max-w-4xl mx-auto border border-white/20 dark:border-white/10 backdrop-blur-lg relative overflow-hidden rounded-xl"
            initial={mounted ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
            whileInView={mounted ? { opacity: 1, scale: 1 } : {}}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated highlights - client-side only */}
            {mounted && (
              <>
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse opacity-70"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse opacity-70" style={{ animationDelay: '1s' }}></div>
              </>
            )}

            <motion.div
  className="relative z-10"
  initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
  whileInView={mounted ? { opacity: 1, y: 0 } : {}}
  viewport={{ once: true }}
  transition={{ duration: 0.8, delay: 0.2 }}
>
  <div className="bg-white/10 backdrop-blur-xl w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6">
    <Zap className="h-8 w-8 text-primary" />
  </div>

  <h2 className="text-3xl md:text-4xl font-bold mb-6 relative">
    <span className="inline-block cyber-glitch-text bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
      What Will You Create?
    </span>
    
    {/* Animated underline - now longer and lower */}
    {mounted && (
      <motion.div 
        className="absolute -bottom-3 left-1/2 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full"
        initial={{ width: "0%", x: "-50%" }}
        animate={{ width: "400px", x: "-50%" }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
    )}
  </h2>

  <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
Your digital studio awaits.  </p>

  <MagneticButton className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white rounded-md py-3 px-6 font-medium shadow-md hover:shadow-lg transition-shadow">
    <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="flex items-center">
      {isAuthenticated ? "Go to Dashboard" : "Get Started"} <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  </MagneticButton>

  {/* Adding just the CSS for the glowing text effect */}
  <style jsx global>{`
    .cyber-glitch-text {
      position: relative;
    }
    
    @media (hover: hover) {
      .cyber-glitch-text:hover {
        text-shadow: 
          0 0 5px rgba(236, 72, 153, 0.7),
          0 0 10px rgba(139, 92, 246, 0.5);
      }
    }
  `}</style>
</motion.div>
            
          </motion.div>
          
        </div>
       
      </motion.section>
      
    </>
  );
}