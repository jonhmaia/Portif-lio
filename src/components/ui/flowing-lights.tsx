'use client'

import { useEffect, useRef, useState } from 'react'

// Util functions
function getBezierXY(t: number, sx: number, sy: number, cp1x: number, cp1y: number, cp2x: number, cp2y: number, ex: number, ey: number) {
  t = Math.max(0, Math.min(1, t));
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  const x = sx*mt3 + 3*cp1x*mt2*t + 3*cp2x*mt*t2 + ex*t3;
  const y = sy*mt3 + 3*cp1y*mt2*t + 3*cp2y*mt*t2 + ey*t3;
  return { x, y };
}

function hexToRgb(hex: string) {
  if (hex === '#ffffff') return '255, 255, 255';
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '255, 255, 255';
}

export function FlowingLights() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let animationFrameId: number
    const numPaths = 50;
    const colors = ['#00ffcc', '#0d9488', '#2dd4bf', '#ffffff', '#9ca3af', '#4b5563'];

    class Particle {
      progress: number;
      speed: number;
      trailLength: number;
      opacity: number;
      delay: number;

      constructor(spread = true) {
        this.progress = spread ? Math.random() : 0;
        this.speed = 0.0005 + Math.random() * 0.002;
        this.trailLength = 0.02 + Math.random() * 0.08; 
        this.opacity = 0.4 + Math.random() * 0.6;
        this.delay = spread ? 0 : Math.random() * 200;
      }

      updateAndDraw(ctx: CanvasRenderingContext2D, path: FlowPath) {
        if (this.delay > 0) {
          this.delay--;
          return;
        }

        this.progress += this.speed;
        if (this.progress > 1 + this.trailLength) {
          this.progress = -this.trailLength;
          this.delay = Math.random() * 100;
        }

        const p1 = getBezierXY(this.progress, path.startX, path.startY, path.cp1x, path.cp1y, path.cp2x, path.cp2y, path.endX, path.endY);
        const p2 = getBezierXY(Math.max(0, this.progress - this.trailLength * 0.5), path.startX, path.startY, path.cp1x, path.cp1y, path.cp2x, path.cp2y, path.endX, path.endY);
        const p3 = getBezierXY(Math.max(0, this.progress - this.trailLength), path.startX, path.startY, path.cp1x, path.cp1y, path.cp2x, path.cp2y, path.endX, path.endY);

        if (!p1 || !p3) return;

        // Draw particle head
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, path.lineWidth * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();

        // Draw trail
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
        gradient.addColorStop(0, `rgba(${hexToRgb(path.color)}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${hexToRgb(path.color)}, 0)`);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(p2.x, p2.y, p3.x, p3.y);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = path.lineWidth * 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.shadowBlur = 10;
        ctx.shadowColor = path.color;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }
    }

    class FlowPath {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      cp1x: number;
      cp1y: number;
      cp2x: number;
      cp2y: number;
      color: string;
      lineWidth: number;
      alpha: number;
      particles: Particle[];

      constructor(canvasWidth: number, canvasHeight: number) {
        this.startX = canvasWidth * 0.1 + Math.random() * (canvasWidth * 0.8);
        this.startY = -100 - Math.random() * 100;
        
        this.endX = canvasWidth * 0.1 + Math.random() * (canvasWidth * 0.8);
        this.endY = canvasHeight + 100 + Math.random() * 100;

        const midY = canvasHeight / 2;
        const flex = canvasWidth * 0.2;
        
        this.cp1x = this.startX + (Math.random() - 0.5) * flex;
        this.cp1y = midY * 0.5;
        
        this.cp2x = this.endX + (Math.random() - 0.5) * flex;
        this.cp2y = midY * 1.5;

        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.lineWidth = 0.5 + Math.random() * 2;
        this.alpha = 0.05 + Math.random() * 0.15; 
        
        this.particles = [];
        const numParticles = Math.floor(1 + Math.random() * 3);
        for(let i = 0; i < numParticles; i++) {
          this.particles.push(new Particle(true));
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw the static path track
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.endX, this.endY);
        ctx.strokeStyle = `rgba(${hexToRgb(this.color)}, ${this.alpha})`;
        ctx.lineCap = 'round';
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();

        // Update and draw path's particles
        this.particles.forEach(p => p.updateAndDraw(ctx, this));
      }
    }

    let paths: FlowPath[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      paths = Array.from({ length: numPaths }, () => new FlowPath(canvas.width, canvas.height));
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 13, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      paths.forEach(path => path.draw(ctx));
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 bg-[#0a0a0d] overflow-hidden pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full opacity-90 mix-blend-screen"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0d]/80 via-transparent to-[#0a0a0d] opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0d] via-transparent to-[#0a0a0d] opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
    </div>
  )
}
