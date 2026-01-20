import { Github, Linkedin, Mail, Code2, Heart } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/jonhmaia',
    icon: Github,
    color: 'hover:text-gray-900 dark:hover:text-gray-100',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/joaomarcosmaia',
    icon: Linkedin,
    color: 'hover:text-blue-600 dark:hover:text-blue-400',
  },
  {
    name: 'Email',
    href: 'mailto:contato@joaomarcos.dev',
    icon: Mail,
    color: 'hover:text-primary',
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()
  const t = useTranslations('footer')

  const footerLinks = [
    {
      title: t('sections.navigation'),
      links: [
        { name: t('links.home'), href: '/' },
        { name: t('links.projects'), href: '/projetos' },
        { name: t('links.blog'), href: '/blog' },
        { name: t('links.resume'), href: '/curriculo' },
        { name: t('links.contact'), href: '/contact' },
      ],
    },
    {
      title: t('sections.resources'),
      links: [
        { name: t('links.sitemap'), href: '/sitemap.xml' },
        { name: t('links.admin'), href: '/admin' },
      ],
    },
  ]

  return (
    <footer className="relative border-t border-border/40 bg-gradient-to-b from-background to-muted/20">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container relative py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-3 font-bold text-xl group transition-transform hover:scale-105"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all">
                <Code2 className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                João Marcos
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              {t('description')}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Conecte-se
              </span>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-all duration-200 hover:bg-muted hover:scale-110 hover:-translate-y-0.5 ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href as any}
                      className="group relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-block"
                    >
                      <span className="relative z-10">{link.name}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8 bg-border/50" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-muted-foreground">
            {t('copyright', { year: currentYear })}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <span>{t('madeWith')}</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <span>{t('using')}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
