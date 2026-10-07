"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { forwardRef, useState, ReactNode } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm";
  children?: ReactNode;
}


const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
    const [isGlowing, setIsGlowing] = useState(false);

    const handleAnimationComplete = () => {
      if (isGlowing) {
        setIsGlowing(false);
      }
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{
          boxShadow: variant === "ghost" 
            ? "0 0 15px rgba(124, 58, 237, 0.15)" 
            : "0 0 20px rgba(124, 58, 237, 0.35)",
          scale: 1.02,
        }}
        whileTap={{ scale: 0.96 }}
        onTap={() => {
          setIsGlowing(false);
          requestAnimationFrame(() => setIsGlowing(true));
        }}
        className={cn(
          "font-ui relative inline-flex items-center justify-center overflow-hidden font-medium tracking-[0.02em] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-quishub-light disabled:pointer-events-none disabled:opacity-50",
          size === "default" && "h-11 px-6 text-sm rounded-lg",
          size === "sm" && "h-9 px-4 text-sm rounded-lg",
          variant === "primary" &&
            "text-[var(--button-primary-fg)] [background:var(--button-primary-bg)] hover:opacity-95 shadow-[0_8px_24px_-10px_rgba(124,58,237,0.6),0_8px_24px_-10px_rgba(37,99,235,0.6)] dark:shadow-none",
          variant === "secondary" &&
            "border text-[var(--button-secondary-fg)] [border-color:var(--button-secondary-border)] [background:var(--button-secondary-bg)] hover:[background:var(--button-hover-bg)]",
          variant === "ghost" &&
            "text-[var(--button-ghost-fg)] bg-transparent hover:[background:var(--button-hover-bg)]",
          className
        )}
        {...props}
      >
        <AnimatePresence>
          {isGlowing && (
            <motion.span
              key="universal-glow"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] origin-center z-0"
              style={{
                background: variant === "primary" 
                  ? "radial-gradient(circle at center, rgba(124,58,237,0.5) 0%, rgba(37,99,235,0.4) 40%, rgba(229,229,228,0) 80%)"
                  : "radial-gradient(circle at center, rgba(124,58,237,0.2) 0%, rgba(37,99,235,0.1) 40%, rgba(229,229,228,0) 80%)",
                mixBlendMode: "screen",
              }}
              initial={{ opacity: 0.8, scale: 0.2 }}
              animate={{ opacity: 0, scale: 2.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onAnimationComplete={handleAnimationComplete}
            />
          )}
        </AnimatePresence>
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
