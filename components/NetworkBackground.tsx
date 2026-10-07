'use client';

import React, { useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

interface NetworkBackgroundProps {
  className?: string;
  particleColor1?: string;
  particleColor2?: string;
  lineColor?: string;
}

export const NetworkBackground: React.FC<NetworkBackgroundProps> = ({ 
  className,
  particleColor1 = '#2563eb', // Cobalt Blue
  particleColor2 = '#7c3aed', // Electric Violet 
  lineColor = '107, 100, 119' // RGB for Quishub muted (#6b6477)
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', resize);
    
    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        
        // Add a slight glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Reset shadow for performance on lines
        ctx.shadowBlur = 0;
      }

      update(width: number, height: number) {
        if (this.x > width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
      }
    }

    const init = () => {
      particlesArray = [];
      // Adjust density based on screen size, limit maximum particles to keep it performant
      const density = 15000;
      const numberOfParticles = Math.min((canvas.width * canvas.height) / density, 100);
      
      for (let i = 0; i < numberOfParticles; i++) {
        const size = (Math.random() * 2) + 1;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const directionX = (Math.random() * 0.6) - 0.3; // Very slow movement
        const directionY = (Math.random() * 0.6) - 0.3;
        const color = Math.random() > 0.5 ? particleColor1 : particleColor2;

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    };

    const connect = () => {
      let opacityValue = 1;
      // max squared distance (approx 150 pixels)
      const maxDistance = 22500; 
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const distance = 
            ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
            ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
          
          if (distance < maxDistance) {
            opacityValue = 1 - (distance / maxDistance);
            ctx!.strokeStyle = `rgba(${lineColor}, ${opacityValue * 0.3})`;
            ctx!.lineWidth = 1;
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
      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(canvas.width, canvas.height);
      }
      connect();
    };

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleColor1, particleColor2, lineColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className={twMerge("fixed inset-0 w-full h-full pointer-events-none -z-40", className)} 
    />
  );
};

export default NetworkBackground;
