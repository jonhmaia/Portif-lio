import Image from 'next/image'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/navigation'

import { TechSkills } from '@/components/home/tech-skills'

export default async function Home() {
  const t = await getTranslations('home')

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col justify-center items-center py-20 md:py-32 overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8">
            
            {/* Profile Image - Clean & Minimal */}
            <div className="relative mb-6 group">
              {/* Main container */}
              <div className="relative h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden">
                <Image
                  src="/foto.png"
                  alt="João Marcos"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-widest text-foreground uppercase drop-shadow-lg">
              {t('hero.title')}
            </h1>

            {/* Subtitle/Roles */}
            <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide max-w-3xl mx-auto">
              N8N Expert | Software Engineer | RPA | Python | AI Engineer
            </p>

            {/* Contact Info & CTA Bar */}
            <div className="flex flex-col md:flex-row items-center gap-6 mt-8 md:mt-12 w-full justify-center">
              
              {/* Contact Details */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base text-muted-foreground/80 font-medium">
                <a href="mailto:joaomaia@discente.ufg.br" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>joaomaia@discente.ufg.br</span>
                </a>
                <a href="tel:+5562999018119" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4" />
                  <span>(62) 99901-8119</span>
                </a>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{t('hero.location')}</span>
                </div>
              </div>

              {/* Vertical Divider (Hidden on mobile) */}
              <div className="hidden md:block w-px h-8 bg-border/50" />

              {/* CTA Button */}
              <Link href="/projetos">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-none border-2 border-primary/50 hover:border-primary hover:bg-primary/10 text-primary font-bold tracking-widest uppercase px-8 py-6 transition-all duration-300"
                >
                  {t('hero.cta')}
                </Button>
              </Link>
            </div>

            {/* Bio Card - Glassmorphism */}
            <div className="mt-16 md:mt-20 max-w-5xl mx-auto p-6 md:p-10 rounded-2xl border border-white/5 bg-black/20 backdrop-blur-md shadow-2xl relative overflow-hidden text-left group hover:border-primary/20 transition-colors duration-500">
              {/* Decorative gradients */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 opacity-50" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -z-10 opacity-50" />
              
              <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed font-light">
                <p>
                  {t.rich('bio.p1', {
                    emphasis: (chunks) => (
                      <span className="text-foreground font-medium">{chunks}</span>
                    ),
                  })}
                </p>
                <p>
                  {t.rich('bio.p2', {
                    emphasis: (chunks) => (
                      <span className="text-foreground font-medium">{chunks}</span>
                    ),
                  })}
                </p>
                <p>
                  {t.rich('bio.p3', {
                    emphasis: (chunks) => (
                      <span className="text-foreground font-medium">{chunks}</span>
                    ),
                  })}
                </p>
                <p>
                  {t.rich('bio.p4', {
                    emphasis: (chunks) => (
                      <span className="text-foreground font-medium">{chunks}</span>
                    ),
                  })}
                </p>
              </div>
            </div>

            {/* Tech Skills Section */}
            <TechSkills />
 
          </div>
        </div>
      </section>
    </div>
  )
}
