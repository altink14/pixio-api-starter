// src/components/ui/text-pressure.tsx (or your path)
'use client';

import * as React from "react"
import { useEffect, useRef, useState } from 'react';

interface TextPressureProps {
    text?: string;
    fontFamily?: string;
    fontUrl?: string;
    width?: boolean;
    weight?: boolean; // This prop seems unused if font-variation-settings directly uses a calculated 'wght'
    italic?: boolean;
    alpha?: boolean;
    flex?: boolean;
    stroke?: boolean;
    scale?: boolean;
    textColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    className?: string;
    minFontSize?: number;
}

const TextPressure: React.FC<TextPressureProps> = ({
    text = 'Compressa',
    fontFamily = 'Compressa VF',
    fontUrl = 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',
    width = true, // Controls 'wdth' in font-variation-settings
    weight = true, // Controls 'wght' in font-variation-settings (prop 'weight' above is different)
    italic = true, // Controls 'ital' in font-variation-settings
    alpha = false,
    flex = true,
    stroke = false,
    scale = false,
    textColor = '#FFFFFF', // Default text color if not overridden
    strokeColor = '#FF0000',
    strokeWidth = 2,
    className = '', // For passing Tailwind classes like font size, weight, etc.
    minFontSize = 24,
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

    const mouseRef = useRef({ x: 0, y: 0 });
    const cursorRef = useRef({ x: 0, y: 0 });

    const [fontSize, setFontSize] = useState(minFontSize);
    const [scaleY, setScaleY] = useState(1);
    const [lineHeight, setLineHeight] = useState(1);
    const [debug, setDebug] = useState(false); // Default to false for production

    const chars = text.split('');

    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    useEffect(() => {
        if (debug) console.log('TextPressure component mounted');
        
        const handleMouseMove = (e: MouseEvent) => {
            cursorRef.current.x = e.clientX;
            cursorRef.current.y = e.clientY;
        };
        
        const handleTouchMove = (e: TouchEvent) => {
            const t = e.touches[0];
            cursorRef.current.x = t.clientX;
            cursorRef.current.y = t.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        if (containerRef.current) {
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            mouseRef.current.x = left + width / 2;
            mouseRef.current.y = top + height / 2;
            cursorRef.current.x = mouseRef.current.x;
            cursorRef.current.y = mouseRef.current.y;
            if (debug) console.log('Container initialized:', { left, top, width, height });
        }

        let logInterval: NodeJS.Timeout | undefined;
        if (debug) {
            logInterval = setInterval(() => {
                console.log('Mouse tracking:', {
                    cursor: cursorRef.current,
                    mouse: mouseRef.current
                });
            }, 3000);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            if (logInterval) clearInterval(logInterval);
        };
    }, [debug]);

    const setSize = () => {
        if (!containerRef.current || !titleRef.current) return;

        const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

        let newFontSize = containerW / (chars.length / 2); // This can lead to very large font sizes
        newFontSize = Math.max(newFontSize, minFontSize);
        // Consider capping max font size as well, or relating it to container height
        // For example: newFontSize = Math.min(newFontSize, containerH * 0.8);


        setFontSize(newFontSize);
        setScaleY(1);
        setLineHeight(1); // Default line height

        requestAnimationFrame(() => {
            if (!titleRef.current) return;
            const textRect = titleRef.current.getBoundingClientRect();

            // The `scale` prop controls if the text scales vertically to fit container.
            if (scale && textRect.height > 0 && containerH > 0) {
                const yRatio = containerH / textRect.height;
                setScaleY(yRatio);
                // When scaling text, line height might also need adjustment if not using transform
                // but transform: scaleY handles visual height. LineHeight applied to fontSize here.
            }
            
            if (debug) {
                console.log('Size set:', { 
                    fontSize: newFontSize, 
                    containerWidth: containerW,
                    containerHeight: containerH,
                    textHeight: textRect.height,
                    calculatedScaleY: (scale && textRect.height > 0 && containerH > 0) ? containerH / textRect.height : 1,
                    appliedScaleY: scaleY,
                    appliedLineHeight: lineHeight
                });
            }
        });
    };

    useEffect(() => {
        setSize(); // Initial size calculation
        window.addEventListener('resize', setSize);
        return () => window.removeEventListener('resize', setSize);
    }, [scale, text, minFontSize, debug]); // Added minFontSize to dependencies

    useEffect(() => {
        let rafId: number;
        const animate = () => {
            mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
            mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

            if (titleRef.current) {
                const titleRect = titleRef.current.getBoundingClientRect();
                const maxDist = titleRect.width / 2; // Can be 0 if width is 0 initially

                if (maxDist === 0 && spansRef.current.length > 0) { // Avoid division by zero
                    if (debug) console.warn("maxDist is 0, skipping font variation update.");
                    rafId = requestAnimationFrame(animate);
                    return;
                }


                spansRef.current.forEach((span, i) => {
                    if (!span) return;

                    const rect = span.getBoundingClientRect();
                    const charCenter = {
                        x: rect.left + rect.width / 2, // Use rect.left instead of rect.x for wider browser support
                        y: rect.top + rect.height / 2,  // Use rect.top
                    };

                    const d = dist(mouseRef.current, charCenter);

                    const getAttr = (distance: number, minVal: number, maxVal: number) => {
                        if (maxDist === 0) return minVal; // Prevent division by zero
                        // Ensure val doesn't become negative or excessively large before Math.max
                        let val = maxVal - Math.abs((maxVal * distance) / maxDist);
                        val = Math.min(val, maxVal); // Cap at maxVal
                        return Math.max(minVal, val + minVal); // Original logic seems to add minVal twice if val is positive
                                                              // Corrected logic: maxVal - (range * normalized_distance)
                                                              // Let's stick to user's original getAttr logic for now, but it might need review.
                                                              // A common way: minVal + (maxVal - minVal) * (1 - Math.min(1, distance / maxDist));
                        return Math.max(minVal, (maxVal - ( (maxVal-minVal) * Math.min(1, d/maxDist) ) ) ) ;


                    };
                     const getAttrRevised = (distance: number, baseVal: number, targetVal: number, effectRadius: number) => {
                        const normalizedDistance = Math.min(1, distance / effectRadius);
                        return baseVal + (targetVal - baseVal) * (1 - normalizedDistance);
                    };


                    // 'wdth' (width) axis: 5 to 200
                    // 'wght' (weight) axis: 100 to 900
                    // 'ital' (italic) axis: 0 to 1 (often 0 or 1, or a range for oblique)

                    const normDist = maxDist > 0 ? Math.min(1, d / maxDist) : 1; // Normalized distance: 0 (at cursor) to 1 (far away)
                    
                    const currentWdth = width ? (5 + (200 - 5) * (1 - normDist)) : 100;
                    const currentWght = weight ? (100 + (900 - 100) * (1 - normDist)) : 400; // Default to 400 if weight effect is off
                    const currentItal = italic ? (1 * (1 - normDist)) : 0;
                    const currentAlpha = alpha ? (0.2 + (1 - 0.2) * (1 - normDist)) : 1; // Example: min opacity 0.2


                    if (debug && i === 0 && Math.random() < 0.01 && titleRef.current) {
                        console.log('Char animation:', {
                            char: chars[i], distance: d, maxDist,
                            wdth: Math.floor(currentWdth), wght: Math.floor(currentWght), ital: currentItal.toFixed(2),
                            mousePos: mouseRef.current, charPos: charCenter, titleWidth: titleRef.current.getBoundingClientRect().width
                        });
                    }

                    span.style.opacity = `${currentAlpha}`;
                    span.style.fontVariationSettings = `'wght' ${Math.floor(currentWght)}, 'wdth' ${Math.floor(currentWdth)}, 'ital' ${currentItal.toFixed(2)}`;
                });
            }

            rafId = requestAnimationFrame(animate);
        };

        // Only start animation if the component is effectively visible and sized
        if (titleRef.current && titleRef.current.getBoundingClientRect().width > 0) {
            animate();
        } else {
            // Poll for width if not immediately available (e.g. display:none initially)
            const initialSizingPoll = setInterval(() => {
                if (titleRef.current && titleRef.current.getBoundingClientRect().width > 0) {
                    clearInterval(initialSizingPoll);
                    setSize(); // Recalculate size once width is available
                    animate();
                }
            }, 100);
            // Clear poll after some time to prevent infinite loop if it never becomes visible
            setTimeout(() => clearInterval(initialSizingPoll), 2000);
        }


        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [width, weight, italic, alpha, chars, debug, text]); // Added 'text' to re-run if chars array changes

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-transparent pointer-events-auto" // pointer-events-auto is good
            // style={{ zIndex: 20 }} // zIndex might not be needed here, can be controlled by parent
        >
            <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}') format('woff2'); /* Ensure format is specified */
          font-style: normal; /* Variable fonts often cover various styles */
          font-weight: 100 900; /* Define the supported weight range */
          font-stretch: 25% 151%; /* Define the supported width range if applicable */
        }
        /* Stroke styles are only applied if the 'stroke' class is added to h1 */
        .text-pressure-title.stroke span {
          position: relative;
          color: ${textColor}; /* Base color for stroke effect */
        }
        .text-pressure-title.stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent; /* Make pseudo-element's own color transparent */
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
        .text-pressure-title {
          position: relative; /* Good for z-index context if needed */
          /* zIndex: 10; */ /* Can be handled by parent or if stacking locally */
          pointer-events: auto; /* Ensure h1 itself can be interacted with if needed */
        }
        .text-pressure-title span {
          display: inline-block; /* Ensures transform works correctly on spans if needed, already default for spans */
          pointer-events: auto; /* Allow mouse events on individual characters */
          position: relative; /* For potential future use with pseudo-elements on spans */
          /* Smoother transition for font variations */
          transition: font-variation-settings 0.05s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
      `}</style>

            <h1
                ref={titleRef}
                // The className prop from parent (page.tsx) will apply Tailwind classes for font-size, font-weight etc.
                // The 'stroke' class is conditionally added based on the 'stroke' prop.
                className={`text-pressure-title ${className} ${flex ? 'flex justify-between' : ''} ${stroke ? 'stroke' : ''} uppercase text-center`}
                style={{
                    fontFamily, // Applies the variable font
                    fontSize: `${fontSize}px`, // Ensure unit is applied
                    lineHeight: `${lineHeight}`, // Unitless is fine for line-height
                    transform: `scale(1, ${scaleY})`,
                    transformOrigin: 'center top',
                    margin: 0, // Reset margin
                    // fontWeight is now primarily controlled by the `className` prop (e.g., `font-bold` from Tailwind)
                    // The `color` is determined by the `textColor` prop.
                    // If `textColor="transparent"` is passed, this h1 will be transparent,
                    // allowing a parent div's `background-image` (clipped to text) to show as the text color.
                    color: stroke ? undefined : textColor, // If stroke is true, color is default to allow stroke to be primary.
                                                          // If stroke is false, `textColor` prop is used.
                    // zIndex: 10, // Can be handled by parent
                }}
            >
                {chars.map((char, i) => (
                    <span
                        key={i}
                        ref={(el) => { spansRef.current[i] = el; }}
                        data-char={char}
                        // className="inline-block" // Already inline-block by default, styled in CSS block if needed
                    >
                        {char === ' ' ? '\u00A0' : char} {/* Render non-breaking space for actual spaces */}
                    </span>
                ))}
            </h1>
            
            {debug && (
                <div 
                    style={{
                        position: 'fixed', top: 0, left: 0, // Example to show it's a global fixed element
                        width: '10px', height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'lime', // Changed color for differentiation
                        // transform: `translate(${cursorRef.current.x}px, ${cursorRef.current.y}px)`, // Track raw cursor
                        transform: `translate(${mouseRef.current.x -5}px, ${mouseRef.current.y -5}px)`, // Track smoothed mouse
                        zIndex: 9999,
                        pointerEvents: 'none',
                        opacity: 0.7
                    }}
                />
            )}
        </div>
    );
};

export { TextPressure };