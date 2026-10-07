



































"use client";

import React, { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export interface GravityGridBackgroundProps {
  className?: string;
}

export default function GravityGridBackground({ className }: GravityGridBackgroundProps) {
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
    const cols = 40;
    const rows = 40;
    const gridSize = 40; // spacing in 3D units

    let time = 0;

    const resize = () => {
      // Create a high-res canvas
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resize);
    resize();

    // 3D Point projection
    const project = (x: number, y: number, z: number) => {
      const fov = 400;
      const viewDistance = 200;
      
      // Prevent division by zero or negative z behind camera
      const zOffset = z + viewDistance;
      if (zOffset <= 0) return null;

      const scale = fov / zOffset;
      
      return {
        x: (x * scale) + width / 2,
        y: (y * scale) + height / 3 * 2 // push down slightly
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Determine theme colors dynamically
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const lineColor = isDark ? "rgba(124, 58, 237, 0.4)" : "rgba(0, 0, 0, 0.15)";
      const highlightColor = isDark ? "rgba(37, 99, 235, 0.8)" : "rgba(37, 99, 235, 0.4)";

      // Generate grid points
      const points: { x: number, y: number, z: number, dist: number }[][] = [];
      
      // Calculate gravity well center
      const centerX = 0;
      const centerZ = rows * gridSize / 2;

      for (let z = 0; z < rows; z++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
          // World coordinates
          const worldX = (x - cols / 2) * gridSize;
          const worldZ = z * gridSize;

          // Calculate distance from center for gravity well
          const distToCenter = Math.sqrt(Math.pow(worldX - centerX, 2) + Math.pow(worldZ - centerZ, 2));
          
          // Wave + Gravity Well math
          // 1. Slow rolling waves across the grid
          let worldY = Math.sin(worldX * 0.02 + time * 0.5) * 15 + Math.cos(worldZ * 0.02 + time * 0.4) * 15;
          
          // 2. Deep gravity well in the center
          const wellRadius = 400;
          const depth = 250;
          if (distToCenter < wellRadius * 2) {
             const influence = Math.max(0, 1 - (distToCenter / (wellRadius * 1.5)));
             // Dropdown curve + pulsing sine wave inside the well
             const dip = -Math.pow(influence, 2) * depth;
             const ripple = Math.sin(distToCenter * 0.05 - time * 2) * (20 * influence);
             worldY += dip + ripple;
          }

          row.push({ x: worldX, y: worldY, z: worldZ, dist: distToCenter });
        }
        points.push(row);
      }

      ctx.lineWidth = 1;

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
        
        // Add distance fade-out
        const alpha = Math.max(0.05, 1 - (z / rows));
        ctx.strokeStyle = isDark 
          ? `rgba(124, 58, 237, ${alpha * 0.5})` 
          : `rgba(0, 0, 0, ${alpha * 0.2})`;
          
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

      // Draw a subtle glow in the center well
      const centerProj = project(centerX, -150, centerZ);
      if (centerProj) {
        const gradient = ctx.createRadialGradient(centerProj.x, centerProj.y, 0, centerProj.x, centerProj.y, 200);
        gradient.addColorStop(0, highlightColor);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerProj.x, centerProj.y, 200, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 0.03;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className={twMerge(
        "absolute inset-0 z-0 overflow-hidden pointer-events-none select-none",
        "[mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background: "transparent",
          // The canvas should be behind everything but cover the full hero section
          position: "absolute", 
          top: 0, 
          left: 0
        }}
      />
      {/* Subtle overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)] opacity-50" />
    </div>
  );
}
