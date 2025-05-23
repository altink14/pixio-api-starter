// src/components/ui/optimized-galaxy-background.tsx
"use client";

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';

function Galaxy({ isMobile }: { isMobile: boolean }) {
  const points = useRef<THREE.Points>(null);
  
  // Galaxy parameters - fewer particles for mobile
  const particlesCount = isMobile ? 2000 : 5000;
  const galaxyRadius = 15;
  const branches = 5;
  const spin = 1;
  const randomness = 0.5;
  const randomnessPower = 3;
  const insideColor = '#4a00a0'; // Purple-blue
  const outsideColor = '#0047ab'; // Cosmic blue
  
  // Create particles
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    const colorInside = new THREE.Color(insideColor);
    const colorOutside = new THREE.Color(outsideColor);
    
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      // Position
      const radius = Math.random() * galaxyRadius;
      const branchAngle = (i % branches) / branches * Math.PI * 2;
      const spinAngle = radius * spin;
      
      // Add randomness
      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;
      
      // Calculate position based on angle and radius
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
      
      // Colors
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / galaxyRadius);
      
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    
    return { positions, colors };
  }, [particlesCount, galaxyRadius, branches, spin, randomness, randomnessPower, insideColor, outsideColor]);
  
  // Animation - slower rotation on mobile for better performance
  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += isMobile ? 0.0005 : 0.001;
      points.current.rotation.z += isMobile ? 0.0002 : 0.0005;
    }
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        size={isMobile ? 0.07 : 0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        transparent
        opacity={0.8}
      />
    </points>
  );
}

export function OptimizedGalaxyBackground() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if mobile and set state
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <div className="galaxy-container">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[1, isMobile ? 1.5 : 2]} // Lower resolution on mobile
      >
        <ambientLight intensity={0.5} />
        <Galaxy isMobile={isMobile} />
        <AdaptiveDpr pixelated />
      </Canvas>
      <div className="galaxy-gradient"></div>
      
      <style jsx>{`
        .galaxy-container {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          pointer-events: none;
          z-index: -1;
        }
        
        .galaxy-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            /* Stronger gradient from left to ensure text readability */
            linear-gradient(
              to right, 
              rgba(13, 14, 18, 0.95) 0%, 
              rgba(13, 14, 18, 0.9) 20%, 
              rgba(13, 14, 18, 0.6) 60%,
              rgba(13, 14, 18, 0.4) 100%
            ),
            /* Adding top-to-bottom gradient for header readability */
            linear-gradient(
              to bottom,
              rgba(13, 14, 18, 0.9) 0%,
              rgba(13, 14, 18, 0.7) 5%,
              rgba(13, 14, 18, 0.2) 30%,
              rgba(13, 14, 18, 0.6) 90%,
              rgba(13, 14, 18, 0.9) 100%
            );
          pointer-events: none;
        }
        
        /* Media query for mobile devices */
        @media (max-width: 768px) {
          .galaxy-gradient {
            background: 
              linear-gradient(
                to right, 
                rgba(13, 14, 18, 0.95) 0%, 
                rgba(13, 14, 18, 0.95) 30%, 
                rgba(13, 14, 18, 0.9) 100%
              ),
              linear-gradient(
                to bottom,
                rgba(13, 14, 18, 0.9) 0%,
                rgba(13, 14, 18, 0.8) 50%,
                rgba(13, 14, 18, 0.9) 100%
              );
          }
        }
      `}</style>
    </div>
  );
}