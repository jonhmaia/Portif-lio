'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function FlowingLights() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Light 1 - Top Left */}
      <div 
        className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-40 animate-flow-1
          ${isDark ? 'bg-blue-600/30' : 'bg-blue-400/20'}`}
      />

      {/* Light 2 - Top Right */}
      <div 
        className={`absolute top-[-5%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-30 animate-flow-2
          ${isDark ? 'bg-purple-600/30' : 'bg-purple-400/20'}`}
      />

      {/* Light 3 - Bottom Left */}
      <div 
        className={`absolute bottom-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full blur-[110px] opacity-30 animate-flow-3
          ${isDark ? 'bg-cyan-600/30' : 'bg-cyan-400/20'}`}
      />

      {/* Light 4 - Center/Bottom Right */}
      <div 
        className={`absolute bottom-[10%] right-[10%] w-[35%] h-[35%] rounded-full blur-[90px] opacity-20 animate-flow-1
          ${isDark ? 'bg-indigo-600/30' : 'bg-indigo-400/20'}`}
      />
      
      {/* Overlay Noise */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  )
}
