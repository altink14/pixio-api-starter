"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function GalaxyBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);
    
    // Camera position
    camera.position.z = 30;
    
    // Create galaxy particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    
    // Create positions for the particles (3 values per vertex - x, y, z)
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    // Parameters for the galaxy shape
    const galaxyRadius = 15;
    const branches = 5;
    const spin = 1;
    const randomness = 0.5;
    const randomnessPower = 3;
    const insideColor = new THREE.Color('#4a00a0'); // Purple-blue
    const outsideColor = new THREE.Color('#0047ab'); // Cosmic blue
    
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
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / galaxyRadius);
      
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    // Stars
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Add some ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the galaxy slowly
      particles.rotation.y += 0.001;
      particles.rotation.z += 0.0005;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  return (
    <div className="galaxy-container" ref={containerRef}>
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