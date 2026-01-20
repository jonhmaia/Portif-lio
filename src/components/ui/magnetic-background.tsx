'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

interface MagneticBackgroundProps {
  className?: string
}

export function MagneticBackground({ className }: MagneticBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const mouse = useRef({ x: -1000, y: -1000 }) // Start off-screen

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      density: number
      friction: number

      constructor(x: number, y: number, isDark: boolean) {
        this.x = x
        this.y = y
        this.vx = (Math.random() - 0.5) * 0.2 // Slower initial velocity
        this.vy = (Math.random() - 0.5) * 0.2 // Slower initial velocity
        this.size = Math.random() * 2 + 1
        this.density = Math.random() * 20 + 10 
        this.friction = 0.96 // Slightly more friction to dampen movement
        
        // Colors based on theme - User Request: Dark Blue and Orange
        const colors = isDark 
          ? ['rgba(37, 99, 235, ', 'rgba(249, 115, 22, '] // Dark Blue (Royal), Orange
          : ['rgba(30, 58, 138, ', 'rgba(234, 88, 12, '] // Navy Blue, Burnt Orange
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        // Fade out particle
        ctx.fillStyle = `${this.color}1)`
        ctx.fill()
      }

      update() {
        if (!canvas) return
        
        // Physics Calculation
        
        // 1. Mouse Interaction (Magnet)
        const dx = mouse.current.x - this.x
        const dy = mouse.current.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 300 // Radius of magnetic field

        if (distance < maxDistance) {
            // Attraction Force (Inverse Square Law-ish but clamped)
            // The closer, the stronger the pull
            const force = (maxDistance - distance) / maxDistance
            
            // Calculate direction vector
            const forceDirectionX = dx / distance
            const forceDirectionY = dy / distance
            
            // Apply acceleration towards mouse
            // density affects how heavy/light the particle feels
            const acceleration = force * 0.5 
            
            this.vx += forceDirectionX * acceleration
            this.vy += forceDirectionY * acceleration
        }

        // 2. Anti-gravity / Ambient Float
        // Always drift slightly upwards and randomly
        this.vy -= 0.015 // Gentle upward float
        this.vx += (Math.random() - 0.5) * 0.01 // Subtle Brownian motion
        
        // 3. Apply Velocity & Friction
        this.vx *= this.friction
        this.vy *= this.friction
        
        this.x += this.vx
        this.y += this.vy

        // 4. Boundary Handling
        // Wrap around screen for continuous flow
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        
        // If it goes off top, reappear at bottom
        if (this.y < 0) {
            this.y = canvas.height
            this.x = Math.random() * canvas.width // Randomize x entry
            this.vy = (Math.random() - 0.5) // Reset vertical velocity slightly
        }
        // If somehow goes below (strong magnet push), wrap to top
        if (this.y > canvas.height) this.y = 0
      }
    }

    const initParticles = () => {
      if (!canvas) return
      
      particles = []
      // Density control: fewer particles on small screens
      const particleCount = Math.floor((canvas.width * canvas.height) / 12000)
      const isDark = theme === 'dark' || document.documentElement.classList.contains('dark')
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        particles.push(new Particle(x, y, isDark))
      }
    }

    const connect = () => {
        const isDark = theme === 'dark' || document.documentElement.classList.contains('dark')
        const maxDistance = 120
        const opacityBase = isDark ? 0.2 : 0.15
        
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x
                const dy = particles[a].y - particles[b].y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < maxDistance) {
                    const opacity = opacityBase * (1 - distance / maxDistance)
                    ctx.strokeStyle = isDark 
                        ? `rgba(148, 163, 184, ${opacity})` 
                        : `rgba(71, 85, 105, ${opacity})`
                    ctx.lineWidth = 1
                    ctx.beginPath()
                    ctx.moveTo(particles[a].x, particles[a].y)
                    ctx.lineTo(particles[b].x, particles[b].y)
                    ctx.stroke()
                }
            }
        }
    }

    const animate = () => {
      if (!canvas || !ctx) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })
      
      connect()
      
      animationFrameId = requestAnimationFrame(animate)
    }

    // Event Listeners
    const handleMouseMove = (e: MouseEvent) => {
        mouse.current.x = e.x
        mouse.current.y = e.y
    }
    
    const handleMouseLeave = () => {
        mouse.current.x = -1000
        mouse.current.y = -1000
    }

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseLeave)
    
    // Init
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseout', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 -z-10 bg-transparent transition-colors duration-500 ${className}`}
    />
  )
}
