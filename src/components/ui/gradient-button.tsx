// src/components/ui/gradient-button.tsx (ensure this is its path)
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
// Removed duplicate import of React

const gradientButtonVariants = cva(
  [
    "gradient-button", // This is the KEY class styled by your new global.css
    "inline-flex items-center justify-center",
    "rounded-[11px]", // Keep your desired border-radius
    // Padding and min-width will be applied by your navbar specific overrides if needed
    // "min-w-[132px] px-9 py-4", // Default sizing, can be overridden
    "text-base leading-[19px] font-medium text-white", // Using font-medium for 500 weight
    "font-sans", // Assuming font-sans is your desired family
    // "font-bold", // Removed as font-medium is specified. Choose one.
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", // Improved focus
    "disabled:pointer-events-none disabled:opacity-50",
    // The complex transition is now handled by the CSS for --custom-properties
  ],
  {
    variants: {
      variant: {
        default: "", // Relies entirely on .gradient-button styles from your new global.css
        variant: "gradient-button-variant", // Adds this class, also styled by new global.css
      },
      // You could add a size variant here for the navbar if you prefer
      // size: {
      //   default: "min-w-[132px] px-9 py-4",
      //   navbar: "text-sm px-6 py-2.5 min-w-[100px]",
      // }
    },
    defaultVariants: {
      variant: "default",
      // size: "default",
    },
  }
)

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, asChild, /*size,*/ ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(gradientButtonVariants({ variant, /*size,*/ className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
GradientButton.displayName = "GradientButton"

export { GradientButton, gradientButtonVariants }