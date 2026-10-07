"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

export interface AntigravityBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export default function AntigravityBackground({ className, children }: AntigravityBackgroundProps) {
  return (
    <div className={twMerge("relative w-full min-h-screen overflow-hidden bg-[#000000]", className)}>
      {/* Subtle platinum grid overlay (opacity 0.05) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E5E5E4 1px, transparent 1px),
            linear-gradient(to bottom, #E5E5E4 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />

      {/* Main Background Container */}
      <div className="fixed inset-0 w-full min-h-screen overflow-hidden pointer-events-none -z-10">
        {/* Blue Orb 1 */}
        <div 
          className="absolute top-[10%] -left-[10%] md:left-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full blur-[150px] md:blur-[200px] opacity-30 animate-slow-float mix-blend-screen"
          style={{ background: "radial-gradient(circle, #2563eb 0%, transparent 70%)" }}
        />
        
        {/* Purple Orb */}
        <div 
          className="absolute top-[30%] -right-[20%] md:right-[5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full blur-[150px] md:blur-[200px] opacity-20 animate-pulse-glow mix-blend-screen" 
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", animationDelay: "1s" }} 
        />
        
        {/* Blue Orb 2 */}
        <div 
          className="absolute -bottom-[10%] left-[20%] w-[350px] md:w-[450px] h-[350px] md:h-[450px] rounded-full blur-[150px] md:blur-[200px] opacity-30 animate-slow-float mix-blend-screen" 
          style={{ background: "radial-gradient(circle, #2563eb 0%, transparent 70%)", animationDelay: "2.5s" }} 
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
