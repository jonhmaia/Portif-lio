import Image from 'next/image'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/navigation'

import { TechSkills } from '@/components/home/tech-skills'
import { FlowingLights } from '@/components/ui/flowing-lights'
import { HeroWrapper, HeroContent, AnimatedElement, BioWrapper } from '@/components/home/wrappers'

export default async function Home() {
  const t = await getTranslations('home')

  return (
    <div className="flex flex-col min-h-screen relative">
      <FlowingLights />
      
      {/* Hero Section */}
      <HeroWrapper>
        <HeroContent>
          
          {/* Profile Image - Clean & Minimal */}
          <AnimatedElement className="relative mb-6 group">
            {/* Main container */}
            <div className="relative h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl shadow-primary/20">
              <Image
                src="/foto.png"
                alt="João Marcos"
                fill
                className="object-cover"
                priority
              />
            </div>
          </AnimatedElement>

          {/* Main Title */}
          <AnimatedElement>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-widest text-foreground uppercase drop-shadow-lg text-center">
              {t('hero.title')}
            </h1>
          </AnimatedElement>

          {/* Subtitle/Roles */}
          <AnimatedElement>
            <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide max-w-3xl mx-auto text-center">
              N8N Expert | Software Engineer | RPA | Python | AI Engineer
            </p>
          </AnimatedElement>

          {/* Contact Info & CTA Bar */}
          <AnimatedElement className="w-full">
            <div className="flex flex-col md:flex-row items-center gap-6 mt-8 md:mt-12 w-full justify-center">
              
              {/* Contact Details */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base text-muted-foreground/80 font-medium">
                <a href="mailto:contato@maiainteligencia.com" className="flex items-center gap-2 hover:text-primary transition-colors group">
                  <div className="p-2 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span>contato@maiainteligencia.com</span>
                </a>
                <a href="tel:+5562999018119" className="flex items-center gap-2 hover:text-primary transition-colors group">
                   <div className="p-2 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>(62) 99901-8119</span>
                </a>
                <div className="flex items-center gap-2">
                   <div className="p-2 rounded-full bg-primary/5">
                    <MapPin className="h-4 w-4" />
                  </div>
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
                  className="rounded-full border border-primary/50 hover:border-primary hover:bg-primary/10 text-primary font-bold tracking-widest uppercase px-8 py-6 transition-all duration-300 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]"
                >
                  {t('hero.cta')}
                </Button>
              </Link>
            </div>
          </AnimatedElement>

          {/* Bio Card - Glassmorphism */}
          <div className="w-full">
            <BioWrapper>
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
            </BioWrapper>
          </div>

          {/* Tech Skills Section */}
          <AnimatedElement className="w-full pt-16">
             <TechSkills />
          </AnimatedElement>

        </HeroContent>
      </HeroWrapper>
    </div>
  )
}
