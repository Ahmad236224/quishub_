"use client";

import React, { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export interface InteractiveGridBackgroundProps {
  className?: string;
}

export default function InteractiveGridBackground({ className }: InteractiveGridBackgroundProps) {
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
    const yOffset = 180; // Camera height above the ground plane
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

    // Ripples on click
    const ripples: { x: number, z: number, time: number }[] = [];
    const handleClick = () => {
      ripples.push({ x: currentGridX, z: currentGridZ, time: 0 });
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
        y: ((yOffset - y) * scale) + height / 2 - 50 // -50 shifts the horizon up
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Determine theme colors dynamically
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const lineColor = isDark ? "rgba(124, 58, 237, 0.4)" : "rgba(0, 0, 0, 0.15)";
      const highlightColor = isDark ? "rgba(37, 99, 235, 0.8)" : "rgba(37, 99, 235, 0.3)";

      // 1. Calculate the 3D grid coordinate corresponding to the mouse
      // reverse projection: screenY = (yOffset * fov / z) + height/2 - 50
      // z = yOffset * fov / (screenY - height/2 + 50)
      const horizonY = height / 2 - 50;
      const yDelta = Math.max(5, mouseY - horizonY); // Clamp to prevent division by zero or negative z
      targetGridZ = (yOffset * fov) / yDelta;
      
      // screenX = (x * fov / z) + width/2
      // x = (screenX - width/2) * z / fov
      targetGridX = (mouseX - width / 2) * targetGridZ / fov;

      // Smoothly move the actual well to the target
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
          let worldY = Math.sin(worldX * 0.015 + time * 0.5) * 10 + Math.cos(worldZ * 0.015 + time * 0.4) * 10;
          
          // Mouse gravity well
          const wellRadius = 500;
          const depth = 200;
          if (distToMouse < wellRadius * 1.5) {
             const influence = Math.max(0, 1 - (distToMouse / wellRadius));
             // Gaussian-like drop
             const dip = -Math.pow(influence, 2.5) * depth;
             worldY += dip;
          }

          // Apply click ripples
          for (let i = ripples.length - 1; i >= 0; i--) {
            const r = ripples[i];
            const distToRipple = Math.sqrt(Math.pow(worldX - r.x, 2) + Math.pow(worldZ - r.z, 2));
            const rippleRadius = r.time * 200;
            const distanceDelta = Math.abs(distToRipple - rippleRadius);
            
            if (distanceDelta < 150) {
              const intensity = (1 - distanceDelta / 150) * Math.max(0, 1 - r.time / 8);
              worldY += Math.sin(distanceDelta * 0.1) * 40 * intensity;
            }
          }

          row.push({ x: worldX, y: worldY, z: worldZ });
        }
        points.push(row);
      }

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].time += 0.1;
        if (ripples[i].time > 8) {
          ripples.splice(i, 1);
        }
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
        
        const alpha = Math.max(0.02, 1 - (z / rows));
        ctx.strokeStyle = isDark 
          ? `rgba(124, 58, 237, ${alpha * 0.6})` 
          : `rgba(0, 0, 0, ${alpha * 0.25})`;
          
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

      // Draw a subtle glow inside the gravity well
      const centerProj = project(currentGridX, -100, currentGridZ);
      if (centerProj && centerProj.y > horizonY) {
        // Only draw if the well is somewhat visible
        const gradient = ctx.createRadialGradient(centerProj.x, centerProj.y, 0, centerProj.x, centerProj.y, 150);
        gradient.addColorStop(0, highlightColor);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerProj.x, centerProj.y, 150, 0, Math.PI * 2);
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
    <div 
      className={twMerge(
        "absolute inset-0 z-0 overflow-hidden pointer-events-auto select-none",
        "[mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]",
        className
      )}
    >
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
      {/* Subtle overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)] opacity-60 pointer-events-none" />
    </div>
  );
}
