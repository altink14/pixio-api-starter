// src/app/(auth)/login/page.tsx
'use client';

import { LoginForm } from './login-form';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { LuShieldCheck, LuFingerprint } from 'react-icons/lu';

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Add subtle cursor follow effect
    const handleMouseMove = (e: MouseEvent) => {
      const cursor = document.getElementById('cursor-follow');
      if (cursor) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Early return with static placeholder during SSR
  if (!mounted) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-background/95 to-background">
        <div className="w-full max-w-md rounded-2xl bg-background/90 backdrop-blur-xl p-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/20"></div>
            </div>
            <div className="h-8 bg-white/10 rounded-md w-1/3 mx-auto"></div>
            <div className="h-4 bg-white/10 rounded-md w-2/3 mx-auto"></div>
            <div className="space-y-4 pt-4">
              <div className="h-10 bg-white/10 rounded-md"></div>
              <div className="h-10 bg-white/10 rounded-md"></div>
              <div className="h-10 bg-primary/10 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center relative overflow-hidden px-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-background/95 to-background">
      {/* Cursor follow effect */}
      <div 
        id="cursor-follow" 
        className="fixed w-36 h-36 rounded-full bg-primary/5 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 opacity-50 hidden md:block mix-blend-soft-light"
        style={{ top: 0, left: 0 }}
      />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-[0.02]" 
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(to right, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Background decorative elements - optimized for performance */}
      <div className="absolute w-full h-full inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 -right-24 w-96 h-96 rounded-full bg-gradient-to-bl from-secondary/10 to-transparent blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-32 left-1/3 w-64 h-64 rounded-full bg-gradient-to-tr from-accent/10 to-transparent blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Floating tech elements - optimized with transform */}
      <div className="absolute w-full h-full inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/80 to-primary/40 backdrop-blur-md flex items-center justify-center will-change-transform"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.8,
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 20,
            x: { duration: 10, repeat: Infinity, repeatType: "reverse" },
            y: { duration: 15, repeat: Infinity, repeatType: "reverse" },
            ease: "linear"
          }}
          style={{ boxShadow: '0 0 20px rgba(var(--primary), 0.3)' }}
        >
          <LuFingerprint className="text-primary-foreground w-6 h-6" />
        </motion.div>
        
        <motion.div 
          className="absolute top-40 right-20 w-10 h-10 rounded-full bg-gradient-to-br from-secondary/80 to-secondary/40 backdrop-blur-md flex items-center justify-center will-change-transform"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.8,
            x: [0, -15, 0],
            y: [0, 25, 0],
          }}
          transition={{ 
            duration: 15,
            x: { duration: 15, repeat: Infinity, repeatType: "reverse" },
            y: { duration: 10, repeat: Infinity, repeatType: "reverse", delay: 2 },
            ease: "linear"
          }}
          style={{ boxShadow: '0 0 20px rgba(var(--secondary), 0.3)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-secondary-foreground">
            <path d="M12 16.01C14.2091 16.01 16 14.2191 16 12.01C16 9.80087 14.2091 8.01001 12 8.01001C9.79086 8.01001 8 9.80087 8 12.01C8 14.2191 9.79086 16.01 12 16.01Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12.01C2 12.01 5 5.01001 12 5.01001C19 5.01001 22 12.01 22 12.01C22 12.01 19 19.01 12 19.01C5 19.01 2 12.01 2 12.01Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-20 left-1/4 w-16 h-8 rounded-2xl bg-gradient-to-br from-accent/60 to-accent/30 backdrop-blur-md flex items-center justify-center will-change-transform"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.7,
            rotate: [-8, 8, -8],
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 12,
            rotate: { duration: 8, repeat: Infinity, repeatType: "reverse" },
            x: { duration: 12, repeat: Infinity, repeatType: "reverse" },
            y: { duration: 8, repeat: Infinity, repeatType: "reverse", delay: 1 },
            ease: "linear"
          }}
          style={{ boxShadow: '0 0 20px rgba(var(--accent), 0.2)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent-foreground">
            <path d="M8 10V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5 10H19V20H5V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="15" r="2" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </motion.div>
      </div>
      
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Login container with refined 3D effect on hover */}
        <motion.div
          className="relative w-full"
          initial={{ perspective: 1000 }}
          animate={{ 
            rotateX: hoverEffect ? 3 : 0, 
            rotateY: hoverEffect ? -3 : 0,
            scale: hoverEffect ? 1.02 : 1,
            y: hoverEffect ? -5 : 0
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onHoverStart={() => setHoverEffect(true)}
          onHoverEnd={() => setHoverEffect(false)}
        >
          {/* Glowing border effect */}
          <div className="relative rounded-2xl">
            {/* Animated glow effect */}
            <motion.div 
              className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent opacity-75 blur-md"
              animate={{ 
                opacity: [0.7, 1, 0.7],
                background: [
                  'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
                  'linear-gradient(180deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
                  'linear-gradient(270deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
                  'linear-gradient(360deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
                  'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)'
                ],
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
              }}
            />
            
            {/* Card inner content with glass effect */}
            <div className="w-full bg-background/90 backdrop-blur-2xl rounded-2xl p-8 relative z-10">
              {/* Decorative accent elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
              
              {/* Shield logo */}
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <LuShieldCheck className="text-white w-8 h-8" />
                </div>
              </motion.div>
              
              {/* Login header */}
              <div className="space-y-1 mb-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                    Welcome Back
                  </h1>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="text-muted-foreground">
                    Secure access to your dashboard
                  </p>
                </motion.div>
              </div>
              
              {/* Login form */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-4"
              >
                <LoginForm />
              </motion.div>
              
              {/* Security badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex items-center gap-2 p-3 mb-6 bg-foreground/5 rounded-lg border border-foreground/10"
              >
                <div className="rounded-full p-1 bg-green-500/10">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                    <path d="M7 12L10 15L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <p className="text-xs text-muted-foreground">Enhanced security with end-to-end encryption</p>
              </motion.div>
              
              {/* Social login options with proper icons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative flex items-center gap-3 py-4"
              >
                <div className="flex-grow h-px bg-border"></div>
                <span className="text-xs text-muted-foreground font-medium">OR CONTINUE WITH</span>
                <div className="flex-grow h-px bg-border"></div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-2 gap-3 mb-6"
              >
                {/* Social login buttons for Google and GitHub only */}
                <motion.button
                  whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.03)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all"
                >
                  <FaGoogle className="text-[#EA4335]" />
                  <span className="text-sm font-medium">Google</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.03)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all"
                >
                  <FaGithub />
                  <span className="text-sm font-medium">GitHub</span>
                </motion.button>
              </motion.div>
              
              {/* Footer with additional links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-sm flex flex-col items-center space-y-4 text-center"
              >
                <p className="text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link 
                    href="/signup" 
                    className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                  >
                    Create account
                  </Link>
                </p>
                <div className="flex gap-6 text-xs text-muted-foreground/70">
                  <Link href="/help" className="hover:text-muted-foreground transition-colors">Help</Link>
                  <Link href="/privacy" className="hover:text-muted-foreground transition-colors">Privacy</Link>
                  <Link href="/terms" className="hover:text-muted-foreground transition-colors">Terms</Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}