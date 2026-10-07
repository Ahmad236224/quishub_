"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

export function FloatingPicturesBackground({ 
  className, 
  images,
  variant = "vibrant"
}: { 
  className?: string; 
  images?: string[];
  variant?: "vibrant" | "grayscale";
}) {
  const defaultImages = [
    "/images/ai_network.png",
    "/images/ai_cybernetic.png",
    "/images/ai_abstract.png"
  ];
  
  const displayImages = images && images.length === 3 ? images : defaultImages;

  const opacityClass = variant === "grayscale" ? "opacity-20 md:opacity-30 mix-blend-luminosity" : "opacity-40 md:opacity-60";
  const imgClass = variant === "grayscale" ? "w-full h-auto object-cover grayscale" : "w-full h-auto object-cover";

  return (
    <div className={twMerge("absolute inset-0 z-0 overflow-hidden pointer-events-none select-none", className)}>
      {/* Picture 1 */}
      <motion.div 
        className={`absolute top-[10%] left-[5%] md:left-[15%] w-[150px] md:w-[250px] rounded-2xl overflow-hidden shadow-2xl ${opacityClass}`}
        animate={{ y: [0, -20, 0], rotate: [-5, -8, -5] }}
        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
      >
        <img src={displayImages[0]} alt="Floating graphic 1" className={imgClass} />
      </motion.div>

      {/* Picture 2 */}
      <motion.div 
        className={`absolute top-[30%] right-[5%] md:right-[15%] w-[120px] md:w-[200px] rounded-2xl overflow-hidden shadow-2xl ${opacityClass}`}
        animate={{ y: [0, 25, 0], rotate: [10, 15, 10] }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, delay: 1 }}
      >
        <img src={displayImages[1]} alt="Floating graphic 2" className={imgClass} />
      </motion.div>

      {/* Picture 3 */}
      <motion.div 
        className={`absolute -bottom-[10%] left-[40%] w-[180px] md:w-[300px] rounded-2xl overflow-hidden shadow-2xl ${opacityClass}`}
        animate={{ y: [0, -30, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity, delay: 2 }}
      >
        <img src={displayImages[2]} alt="Floating graphic 3" className={imgClass} />
      </motion.div>
    </div>
  );
}
