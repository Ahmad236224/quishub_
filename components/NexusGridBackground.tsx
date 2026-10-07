"use client";

import React, { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export interface NexusGridBackgroundProps {
  className?: string;
}

export default function NexusGridBackground({ className }: NexusGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    
    // Mouse interaction
    let mouse = { x: -1000, y: -1000, radius: 200 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      init(); // Re-initialize on resize to fix density
    };

    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      color: string;
      glowColor: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.8; // Slow drift
        this.vy = (Math.random() - 0.5) * 0.8;
        this.baseSize = Math.random() * 2 + 1.5;
        this.size = this.baseSize;
        
        // Randomly assign Blue or Purple
        const isBlue = Math.random() > 0.5;
        this.color = isBlue ? "rgba(96, 165, 250, 1)" : "rgba(167, 139, 250, 1)"; // Solid inner
        this.glowColor = isBlue ? "rgba(37, 99, 235, 0.8)" : "rgba(124, 58, 237, 0.8)"; // Outer glow
      }

      draw() {
        if (!ctx) return;
        
        // Draw glow
        const glowRadius = this.size * 5;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
        
        // Use the exact RGB values for the transparent stop to avoid grey smudging
        const isBlue = this.color === "rgba(96, 165, 250, 1)";
        const transparentColor = isBlue ? "rgba(37, 99, 235, 0)" : "rgba(124, 58, 237, 0)";
        
        gradient.addColorStop(0, this.glowColor);
        gradient.addColorStop(1, transparentColor);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw solid core
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        // Boundary check
        if (this.x > width || this.x < 0) this.vx = -this.vx;
        if (this.y > height || this.y < 0) this.vy = -this.vy;

        // Mouse interaction - gentle push away
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          // The closer the mouse, the stronger the push
          const force = (mouse.radius - distance) / mouse.radius;
          const pushX = forceDirectionX * force * -2;
          const pushY = forceDirectionY * force * -2;
          
          this.x += pushX;
          this.y += pushY;
          
          // Slightly increase size when interacted with
          this.size = this.baseSize + (force * 3);
        } else {
          // Return to base size smoothly
          if (this.size > this.baseSize) {
            this.size -= 0.1;
          }
        }

        this.x += this.vx;
        this.y += this.vy;

        this.draw();
      }
    }

    let particlesArray: Particle[] = [];

    const init = () => {
      particlesArray = [];
      const numberOfParticles = Math.min(Math.floor((width * height) / 18000), 120); // Responsive density
      
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particlesArray.push(new Particle(x, y));
      }
    };

    resize();

    const connect = () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      // Dynamic line color based on theme
      const lineBase = isDark ? "167, 139, 250" : "124, 58, 237"; // Purple base
      
      const maxDistance = 25000; // Squared distance (approx 158px)
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distanceSq = dx * dx + dy * dy;
          
          if (distanceSq < maxDistance) {
            const opacityValue = 1 - (distanceSq / maxDistance);
            ctx!.strokeStyle = `rgba(${lineBase}, ${opacityValue * (isDark ? 0.35 : 0.2)})`;
            ctx!.lineWidth = isDark ? 1.5 : 1;
            ctx!.beginPath();
            ctx!.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx!.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx!.stroke();
          }
        }
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ctx!.clearRect(0, 0, width, height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)] opacity-60 pointer-events-none" />
    </div>
  );
}
