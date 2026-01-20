'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function ThemeFavicon() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    // Função para atualizar ou criar o favicon
    const updateFavicon = () => {
      const iconUrl = resolvedTheme === 'dark' ? '/icon' : '/icon-light'
      
      // Procura o favicon existente que nós gerenciamos ou cria um novo
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
      
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        link.type = 'image/png'
        document.head.appendChild(link)
      }
      
      link.href = iconUrl
    }

    // Função para gerenciar o Apple Touch Icon (geralmente estático, mas podemos definir)
    const updateAppleIcon = () => {
      let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement
      
      if (!appleLink) {
        appleLink = document.createElement('link')
        appleLink.rel = 'apple-touch-icon'
        appleLink.sizes = '180x180'
        appleLink.href = '/apple-icon'
        document.head.appendChild(appleLink)
      }
    }

    updateFavicon()
    updateAppleIcon()
    
    // Não retornamos função de limpeza que remove o nó, pois queremos que o favicon persista
    // até ser atualizado novamente. O navegador lida bem com isso.
  }, [resolvedTheme])

  return null
}
