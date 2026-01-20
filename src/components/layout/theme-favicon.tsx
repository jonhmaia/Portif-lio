'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function ThemeFavicon() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    // Remove ícones existentes
    const existingIcons = document.querySelectorAll('link[rel="icon"]')
    existingIcons.forEach(icon => icon.remove())

    // Cria novo ícone baseado no tema
    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/png'
    
    if (resolvedTheme === 'dark') {
      link.href = '/icon'
    } else {
      link.href = '/icon-light'
    }
    
    document.head.appendChild(link)
  }, [resolvedTheme])

  return null
}
