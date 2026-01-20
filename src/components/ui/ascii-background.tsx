'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

interface AsciiBackgroundProps {
  className?: string
}

export function AsciiBackground({ className }: AsciiBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const characters = '?$#+%'
    
    // Configuração responsiva
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    // Sistema de partículas/grid
    const fontSize = 14
    const columns = Math.ceil(canvas.width / fontSize)
    const rows = Math.ceil(canvas.height / fontSize)
    
    // Simulação de "terreno" usando noise simples (senoide composta)
    const getTerrainHeight = (x: number) => {
      const normalizedX = x / canvas.width
      // Cria ondas suaves
      const wave1 = Math.sin(normalizedX * 10 + Date.now() * 0.0005) * 50
      const wave2 = Math.sin(normalizedX * 25 + Date.now() * 0.001) * 25
      const wave3 = Math.sin(normalizedX * 5) * 100
      
      // Base height (quanto mais alto o valor, mais baixo na tela)
      const baseHeight = canvas.height * 0.65
      
      return baseHeight + wave1 + wave2 + wave3
    }

    const draw = () => {
      // Limpar com fade para rastro suave ou limpar total
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Cor base dependendo do tema (embora o componente seja transparente, desenhamos o texto)
      const isDark = theme === 'dark' || document.documentElement.classList.contains('dark')
      
      // Cores
      const primaryColor = isDark ? '#3B82F6' : '#2563EB'
      const secondaryColor = isDark ? '#9CA3AF' : '#6B7280'
      
      ctx.font = `${fontSize}px monospace`
      ctx.textAlign = 'center'
      
      const time = Date.now() * 0.001

      for (let x = 0; x < columns; x++) {
        const xPos = x * fontSize
        const terrainY = getTerrainHeight(xPos)
        
        for (let y = 0; y < rows; y++) {
          const yPos = y * fontSize
          
          // Se estiver abaixo da linha do terreno, desenha com mais densidade/opacidade
          if (yPos > terrainY) {
            // Probabilidade de desenhar caractere
            if (Math.random() > 0.7) continue

            const char = characters[Math.floor(Math.random() * characters.length)]
            
            // Distância da superfície do terreno
            const depth = (yPos - terrainY) / (canvas.height - terrainY)
            
            // Opacidade baseada na profundidade e um pouco de aleatoriedade (flicker)
            const alpha = Math.min(0.8, depth * 0.8 + Math.random() * 0.2)
            
            // Mistura de azul e cinza
            if (Math.random() > 0.6) {
              ctx.fillStyle = primaryColor
              ctx.globalAlpha = alpha * 0.5 // Azul mais sutil
            } else {
              ctx.fillStyle = secondaryColor
              ctx.globalAlpha = alpha * 0.3
            }
            
            ctx.fillText(char, xPos, yPos)
          } 
          // "Chuva" caindo acima do terreno (opcional, para dar movimento)
          else if (Math.random() > 0.995) {
             const char = characters[Math.floor(Math.random() * characters.length)]
             ctx.fillStyle = primaryColor
             ctx.globalAlpha = 0.15
             ctx.fillText(char, xPos, yPos)
          }
        }
      }
      
      // Reset global alpha
      ctx.globalAlpha = 1.0
      
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-0 pointer-events-none ${className}`}
      style={{ opacity: 0.6 }}
    />
  )
}
