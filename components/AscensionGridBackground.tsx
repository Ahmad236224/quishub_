"use client";

import React, { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export interface AscensionGridBackgroundProps {
  className?: string;
}

export default function AscensionGridBackground({ className }: AscensionGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Grid configuration
    const cols = 50;
    const rows = 40;
    const gridSize = 60; // spacing in 3D units

    let time = 0;

    // Mouse tracking
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2 + 100;
    let targetGridX = 0;
    let targetGridZ = rows * gridSize / 2;
    let currentGridX = 0;
    let currentGridZ = rows * gridSize / 2;

    // Camera
    const fov = 400;
    const yOffset = 250; // Camera height above the ground plane
    const zStart = 50;   // Start distance

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    // Ripples on click (flattens the peak temporarily)
    const shockwaves: { x: number, z: number, time: number }[] = [];
    const handleClick = () => {
      shockwaves.push({ x: currentGridX, z: currentGridZ, time: 0 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("click", handleClick);

    // 3D Point projection
    const project = (x: number, y: number, z: number) => {
      if (z <= 0) return null;
      const scale = fov / z;
      return {
        x: (x * scale) + width / 2,
        y: ((yOffset - y) * scale) + height / 2 - 20 // -20 shifts the horizon up
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Determine theme colors dynamically
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const lineColor = isDark ? "rgba(124, 58, 237, 0.4)" : "rgba(0, 0, 0, 0.15)";
      const highlightColor = isDark ? "rgba(37, 99, 235, 0.8)" : "rgba(37, 99, 235, 0.3)";
      const peakHighlightColor = isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.8)";

      // 1. Calculate the 3D grid coordinate corresponding to the mouse
      const horizonY = height / 2 - 20;
      const yDelta = Math.max(5, mouseY - horizonY); 
      targetGridZ = (yOffset * fov) / yDelta;
      targetGridX = (mouseX - width / 2) * targetGridZ / fov;

      // Smoothly move the actual peak to the target
      currentGridX += (targetGridX - currentGridX) * 0.08;
      currentGridZ += (targetGridZ - currentGridZ) * 0.08;

      // Generate grid points
      const points: { x: number, y: number, z: number }[][] = [];
      
      for (let z = 0; z < rows; z++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
          const worldX = (x - cols / 2) * gridSize;
          const worldZ = zStart + z * gridSize;

          const distToMouse = Math.sqrt(Math.pow(worldX - currentGridX, 2) + Math.pow(worldZ - currentGridZ, 2));
          
          // Base rolling terrain
          let worldY = Math.sin(worldX * 0.015 + time * 0.5) * 8 + Math.cos(worldZ * 0.015 + time * 0.4) * 8;
          
          // Ascension Peak (Rises Up)
          const peakRadius = 450;
          let peakHeight = 220; // The height of the peak

          // Apply shockwaves (flattens the peak)
          for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            const distToShockwave = Math.sqrt(Math.pow(worldX - sw.x, 2) + Math.pow(worldZ - sw.z, 2));
            const shockRadius = sw.time * 300;
            const distanceDelta = Math.abs(distToShockwave - shockRadius);
            
            if (distanceDelta < 200) {
              const intensity = (1 - distanceDelta / 200) * Math.max(0, 1 - sw.time / 6);
              // Push the terrain down forcefully
              worldY -= 60 * intensity;
              // Reduce peak height
              peakHeight -= 150 * intensity;
            }
          }

          if (distToMouse < peakRadius * 1.5) {
             const influence = Math.max(0, 1 - (distToMouse / peakRadius));
             // Ascension curve
             const rise = Math.pow(influence, 2.2) * Math.max(0, peakHeight);
             worldY += rise;
          }

          row.push({ x: worldX, y: worldY, z: worldZ });
        }
        points.push(row);
      }

      // Update shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        shockwaves[i].time += 0.1;
        if (shockwaves[i].time > 6) {
          shockwaves.splice(i, 1);
        }
      }

      ctx.lineWidth = 1.5;

      // Draw horizontal lines
      for (let z = 0; z < rows; z++) {
        ctx.beginPath();
        let started = false;
        
        for (let x = 0; x < cols; x++) {
          const p = points[z][x];
          const proj = project(p.x, p.y, p.z);
          
          if (proj) {
            if (!started) {
              ctx.moveTo(proj.x, proj.y);
              started = true;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }
        }
        
        const alpha = Math.max(0.02, 1 - (z / rows));
        ctx.strokeStyle = isDark 
          ? `rgba(124, 58, 237, ${alpha * 0.7})` 
          : `rgba(0, 0, 0, ${alpha * 0.3})`;
          
        ctx.stroke();
      }

      // Draw vertical lines
      for (let x = 0; x < cols; x++) {
        ctx.beginPath();
        let started = false;
        
        for (let z = 0; z < rows; z++) {
          const p = points[z][x];
          const proj = project(p.x, p.y, p.z);
          
          if (proj) {
            if (!started) {
              ctx.moveTo(proj.x, proj.y);
              started = true;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }
        }
        
        ctx.strokeStyle = lineColor;
        ctx.stroke();
      }

      // Draw a glowing node at the very tip of the peak
      const topProj = project(currentGridX, 220, currentGridZ);
      if (topProj && topProj.y > 0) {
        // Outer glow
        const gradient = ctx.createRadialGradient(topProj.x, topProj.y, 0, topProj.x, topProj.y, 100);
        gradient.addColorStop(0, highlightColor);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(topProj.x, topProj.y, 100, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright node
        ctx.fillStyle = peakHighlightColor;
        ctx.beginPath();
        ctx.arc(topProj.x, topProj.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 0.05;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={twMerge("absolute inset-0 z-0 overflow-hidden pointer-events-auto select-none", className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background: "transparent",
          position: "absolute", 
          top: 0, 
          left: 0
        }}
      />
      {/* Overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)] opacity-70 pointer-events-none" />
    </div>
  );
}
