"use client";

import React, { useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";

export interface GlowButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ children, className, icon, onClick, ...props }, ref) => {
    const [isRippling, setIsRippling] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsRippling(false); // Reset animation if clicked quickly
      setTimeout(() => setIsRippling(true), 10);
      
      setTimeout(() => setIsRippling(false), 600);

      if (onClick) {
        onClick(e);
      }
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{
          boxShadow: "0 0 30px rgba(229, 229, 228, 0.4)",
          scale: 1.02,
        }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={twMerge(
          "relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-quishub-white text-[#160E20] font-semibold transition-all duration-300 focus:outline-none",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {icon}
          {children}
        </span>

        {/* Shockwave ripple effect */}
        {isRippling && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-[#E5E5E4]/50 pointer-events-none origin-center"
          />
        )}
      </motion.button>
    );
  }
);

GlowButton.displayName = "GlowButton";

export default GlowButton;
