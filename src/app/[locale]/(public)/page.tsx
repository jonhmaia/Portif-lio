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
          {/* Main Profile Card (BioWrapper) */}
          <div className="w-full">
            <BioWrapper>
              <div className="flex flex-col items-center p-2 md:p-6">
                
                {/* Profile Image - Premium Glass & Glow */}
                <div className="relative mb-8 group cursor-pointer">
                  {/* Halo de fundo verde-água no Hover */}
                  <div className="absolute inset-0 bg-[#00ffcc] opacity-0 group-hover:opacity-40 blur-2xl rounded-full transition-opacity duration-700" />
                  
                  {/* Borda Gradiente com Padding */}
                  <div className="relative h-40 w-40 md:h-48 md:w-48 rounded-full p-[3px] bg-gradient-to-tr from-[#00ffcc]/60 via-white/10 to-[#1a1a24] group-hover:from-[#00ffcc] group-hover:to-[#2dd4bf] transition-all duration-500 shadow-[0_0_20px_rgba(0,255,204,0.15)] group-hover:shadow-[0_0_40px_rgba(0,255,204,0.4)]">
                    
                    {/* Máscara da Imagem */}
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-[#1a1a24]">
                      <Image
                        src="/foto.png"
                        alt="João Marcos"
                        fill
                        quality={100}
                        sizes="(max-width: 768px) 160px, 192px"
                        className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                        priority
                      />
                      {/* Reflexo Vidro por cima mais sutil e sem destruir contraste original */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-40 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Main Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-widest text-foreground uppercase drop-shadow-lg text-center mt-4">
                  {t('hero.title')}
                </h1>

                {/* Subtitle/Roles */}
                <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide max-w-3xl mx-auto text-center mt-4">
                  N8N Expert | Software Engineer | RPA | Python | AI Engineer
                </p>

                {/* Contact Info */}
                <div className="w-full flex flex-col items-center gap-6 mt-8 md:mt-10 justify-center pb-8 border-b border-white/10">
                  {/* Contact Details */}
                  <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base text-muted-foreground/80 font-medium">
                    <a href="mailto:contato@maiainteligencia.com" className="flex items-center gap-2 hover:text-[#00ffcc] transition-colors group">
                      <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#00ffcc]/10 transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span>contato@maiainteligencia.com</span>
                    </a>
                    <a href="tel:+5562999018119" className="flex items-center gap-2 hover:text-[#00ffcc] transition-colors group">
                      <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#00ffcc]/10 transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      <span>(62) 99901-8119</span>
                    </a>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-white/5">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span>{t('hero.location')}</span>
                    </div>
                  </div>
                </div>

                {/* Bio Text */}
                <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed font-light text-center mt-10 px-4 md:px-8">
                  <p>
                    {t.rich('bio.p1', {
                      emphasis: (chunks) => (
                        <span className="text-white font-medium">{chunks}</span>
                      ),
                    })}
                  </p>
                  <p>
                    {t.rich('bio.p2', {
                      emphasis: (chunks) => (
                        <span className="text-white font-medium">{chunks}</span>
                      ),
                    })}
                  </p>
                  <p>
                    {t.rich('bio.p3', {
                      emphasis: (chunks) => (
                        <span className="text-white font-medium">{chunks}</span>
                      ),
                    })}
                  </p>
                  <p>
                    {t.rich('bio.p4', {
                      emphasis: (chunks) => (
                        <span className="text-white font-medium">{chunks}</span>
                      ),
                    })}
                  </p>
                </div>

                {/* Main CTA Button - Moved Below and Redesigned */}
                <div className="mt-14 mb-4">
                  <Link href="/projetos">
                    <button className="group relative inline-flex items-center justify-center px-10 py-5 font-bold tracking-widest text-[#1a1a24] uppercase transition-all duration-300 bg-[#00ffcc] rounded-full hover:scale-105 hover:bg-white shadow-[0_0_20px_rgba(0,255,204,0.4)] hover:shadow-[0_0_40px_rgba(0,255,204,0.7)] overflow-hidden">
                      <span className="relative z-10">{t('hero.cta')}</span>
                      
                      {/* Efeito luminoso de brilho varrendo */}
                      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] skew-x-[30deg] transition-all duration-700 ease-in-out group-hover:translate-x-[150%]" />
                    </button>
                  </Link>
                </div>
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
