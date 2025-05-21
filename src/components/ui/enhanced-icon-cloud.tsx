// components/ui/enhanced-icon-cloud.tsx
"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { useTheme } from "next-themes"
import {
  Cloud,
  fetchSimpleIcons,
  ICloud,
  renderSimpleIcon,
  SimpleIcon,
} from "react-icon-cloud"
import React from "react"

// Optimized cloud props for smoother rotation
export const getCloudProps = (isMobile: boolean, randomRotation: boolean): Omit<ICloud, "children"> => ({
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      padding: 0,
    },
  },
  options: {
    reverse: !randomRotation,
    depth: isMobile ? 0.5 : 0.8,
    wheelZoom: false,
    imageScale: isMobile ? 1.2 : 1.6,
    activeCursor: "grab",
    dragControl: true,
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    
    // OPTIMIZED FOR SMOOTHER ROTATION:
    maxSpeed: 0.015, // Reduced for smoother motion
    minSpeed: 0.01,  // Kept minimum consistent
    decel: 0.98,     // Increased from 0.95 for smoother deceleration
    
    // Performance optimizations
    freezeActive: true, // Pause cloud when interacting for better performance
    animTiming: "Linear", // Linear timing for smoother animation
    
    // Better distribution for smoother rotation
    radiusX: 0.9,
    radiusY: 0.9, 
    radiusZ: 0.9,
    
    // Shape optimized for smooth rotation
    shape: "sphere",
    
    // Other settings
    shuffleTags: true,
    frontSelect: true,
    fadeIn: 800,
    pinchZoom: true,
    padding: 1,
    zoom: 1.1,
    
    // Higher FPS target
    interval: 16, // ~60fps instead of default 20ms
    
    // Limit initial animation to reduce perceived lag
    // initial: [0, 0], // Removed duplicate property
    lock: null, // Don't lock any axis for more natural motion
  },
})

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
  const bgHex = theme === "light" ? "#f9f9fa" : "#080510"
  const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff"
  const minContrastRatio = theme === "dark" ? 2.5 : 1.5

  // Optimized size for better performance
  const iconSize = 32 + (icon.title.length > 10 ? -4 : 0) // Slightly smaller for better performance

  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: iconSize,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
      },
      "aria-label": `${icon.title} icon`,
      style: { padding: 0, margin: 0 },
    },
  })
}

// Updated interface with randomRotation property
export type EnhancedCloudProps = {
  iconSlugs: string[];
  randomRotation?: boolean;
}

// Optimized media query hook with reduced re-renders
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query)
      setMatches(media.matches)

      const listener = (e: MediaQueryListEvent) => {
        setMatches(e.matches)
      }

      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    }
    return undefined
  }, [query])

  return matches
}

export function EnhancedIconCloud({ iconSlugs, randomRotation = false }: EnhancedCloudProps) {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchSimpleIcons>> | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()
  const cloudRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // Only fetch icons once and cache the result
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true)
    
    fetchSimpleIcons({ slugs: iconSlugs })
      .then(data => {
        if (isMounted) {
          setData(data)
          setIsLoading(false)
        }
      })
      .catch(error => {
        if (isMounted) {
          console.error("Failed to fetch icons:", error)
          setError(error)
          setIsLoading(false)
        }
      })
      
    return () => { isMounted = false; }
  }, [iconSlugs])

  // Optimize for mobile - reduced touch event binding
  useEffect(() => {
    if (cloudRef.current && isMobile) {
      const touchHandler = () => {}
      cloudRef.current.addEventListener('touchstart', touchHandler, { passive: true }) // Add passive flag for performance
      return () => {
        if (cloudRef.current) {
          cloudRef.current.removeEventListener('touchstart', touchHandler)
        }
      }
    }
  }, [isMobile])

  // Memoize rendered icons to prevent unnecessary re-renders
  const renderedIcons = useMemo(() => {
    if (!data) return null
    return Object.values(data.simpleIcons).map((icon) =>
      renderCustomIcon(icon, theme || "light")
    )
  }, [data, theme])

  // Performance optimization: Prevent unnecessary cloud re-renders
  const cloudProps = useMemo(() => getCloudProps(isMobile, randomRotation), [isMobile, randomRotation]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-center text-foreground/60">
          <div className="inline-block w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mb-2" />
          <p>Loading tech stack...</p>
        </div>
      </div>
    )
  }

  // Show error UI if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>Failed to load tech stack</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={cloudRef} 
      className="w-full h-full border-0" 
      style={{ 
        outline: 'none', 
        borderWidth: 0,
        overflow: "visible",
        touchAction: "manipulation",
        willChange: "transform", // Performance hint for browsers
      }}
    >
      <Cloud {...cloudProps}>
        <>{renderedIcons}</>
      </Cloud>
    </div>
  );
}

// Add this export to make it compatible with your original import
export { EnhancedIconCloud as IconCloud };