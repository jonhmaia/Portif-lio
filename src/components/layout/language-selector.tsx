'use client'

import { useTransition } from 'react'
import { useParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/navigation'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Language {
  code: 'pt-BR' | 'en'
  name: string
  flag: string
  country: string
}

const languages: Language[] = [
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷', country: 'Brasil' },
  { code: 'en', name: 'English', flag: '🇺🇸', country: 'USA' },
]

export function LanguageSelector() {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const locale = useLocale() as 'pt-BR' | 'en'
  const [isPending, startTransition] = useTransition()

  const handleLanguageChange = (lang: 'pt-BR' | 'en') => {
    startTransition(() => {
      router.replace(
        { pathname, params: params as Record<string, string> } as any,
        { locale: lang }
      )
    })
  }

  const currentLanguage = languages.find((l) => l.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 hover:bg-accent"
          disabled={isPending}
        >
          <span className="text-xl leading-none">{currentLanguage?.flag}</span>
          <span className="hidden sm:inline font-medium">{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-3 cursor-pointer transition-colors ${
              locale === lang.code 
                ? 'bg-accent font-semibold' 
                : 'hover:bg-accent/50'
            }`}
          >
            <span className="text-2xl leading-none flex-shrink-0">{lang.flag}</span>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium leading-tight">{lang.name}</span>
              <span className="text-xs text-muted-foreground">{lang.country}</span>
            </div>
            {locale === lang.code && (
              <span className="text-xs text-primary ml-auto">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
