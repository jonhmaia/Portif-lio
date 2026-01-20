'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Menu, Sun, Moon } from 'lucide-react'
import { useState, Suspense } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { LanguageSelector } from './language-selector'
import { Link, usePathname } from '@/navigation'

function HeaderContent() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const tNav = useTranslations('nav')
  const tActions = useTranslations('actions')
  const tA11y = useTranslations('a11y')

  const navigation = [
    { name: tNav('home'), href: '/' },
    { name: tNav('projects'), href: '/projetos' },
    { name: tNav('blog'), href: '/blog' },
    { name: tNav('resume'), href: '/curriculo' },
    { name: tNav('contact'), href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-bold text-xl hover:opacity-90 transition-opacity">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-primary/20 shadow-sm">
            <Image
              src="/foto.png"
              alt="João Marcos"
              fill
              className="object-cover"
            />
          </div>
          <span className="hidden sm:inline-block tracking-tight">João Marcos</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href as any}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{tActions('toggleTheme')}</span>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetTitle className="sr-only">{tA11y('navigationMenu')}</SheetTitle>
              <nav className="flex flex-col gap-2 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href as any}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'px-4 py-3 text-base font-medium rounded-lg transition-colors',
                      pathname === item.href
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export function Header() {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HeaderContent />
    </Suspense>
  )
}

function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur h-16">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
          <div className="h-6 w-24 rounded bg-muted animate-pulse hidden sm:block" />
        </div>
        <div className="hidden md:flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-16 rounded bg-muted animate-pulse" />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded bg-muted animate-pulse" />
          <div className="h-9 w-9 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </header>
  )
}
