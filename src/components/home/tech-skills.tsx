'use client'

import Image from 'next/image'
import { 
  Database, 
  Github, 
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

// SVG Icons for skills without images
const SupabaseIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[60%] h-[60%]" fill="currentColor" color="#3ECF8E">
    <path d="M12 2L2 12h8v10l10-10h-8V2z"/>
  </svg>
)

interface Skill {
  name: string
  imageSrc?: string
  icon?: React.ElementType
}

const skills: Skill[] = [
  { name: 'Python', imageSrc: '/python.png' },
  { name: 'JavaScript', imageSrc: '/javascript.png' },
  { name: 'Django', imageSrc: '/django.png' },
  { name: 'Node.js', imageSrc: '/nodejs.png' },
  { name: 'HTML5', imageSrc: '/html.png' },
  { name: 'CSS3', imageSrc: '/css.png' },
  { name: 'PostgreSQL', imageSrc: '/postgres.png' },
  { name: 'Docker', imageSrc: '/docker.png' },
  { name: 'N8N', imageSrc: '/N8n.png' },
  { name: 'Bubble.io', imageSrc: '/bubbleio.png' },
  { name: 'Supabase', icon: SupabaseIcon },
  { name: 'C/C++', imageSrc: '/c.png' },
  { name: 'SQL', icon: Database },
  { name: 'MCP', imageSrc: '/mcp.png' },
  { name: 'GitHub', icon: Github },
  { name: 'Lovable', imageSrc: '/lovable.png' },
  { name: 'Flutter', imageSrc: '/flutter.png' },
  { name: 'Bootstrap', imageSrc: '/bootsstrap.png' },
]

// Separa em linhas (rows) para simular a colmeia do Apple Watch
const rows = [
  skills.slice(0, 3),    // Row 0 (3 items)
  skills.slice(3, 7),    // Row 1 (4 items)
  skills.slice(7, 12),   // Row 2 (5 items) -> Centro
  skills.slice(12, 16),  // Row 3 (4 items)
  skills.slice(16, 18),  // Row 4 (2 items)
]

// Todos os ícones com o mesmo tamanho, sem o efeito esférico/olho de peixe
const getSizeClass = () => {
  return 'w-20 h-20 md:w-28 md:h-28'; 
}

// Tamanho fixo e proporcional para os logotipos internos
const getIconSizeClass = () => {
  return 'w-10 h-10 md:w-14 md:h-14';
}

export function TechSkills() {
  const t = useTranslations('home.techSkills')

  return (
    <section className="py-20 md:py-32 relative z-10 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
            {t('title', { fallback: 'Habilidades Técnicas' })}
          </h2>
          <p className="text-[#9ca3af] text-lg max-w-2xl mx-auto">
            {t('subtitle', { fallback: 'As ferramentas e linguagens que domino.' })}
          </p>
        </div>

        {/* Apple Watch Cluster Wrapper */}
        <div className="flex flex-col items-center justify-center max-w-5xl mx-auto overflow-visible py-8 md:py-16 gap-3 md:gap-5 perspective-1000">
          
          {rows.map((row, rowIndex) => {
            // Espaçamento limpo e proporcional entre cada card (sem sobreposições de margens negativas pesadas)
            // Removido o z-index e relative da linha para que os tooltips possam flutuar livremente sobre outras linhas
            return (
              <div 
                key={rowIndex} 
                className="flex justify-center items-center gap-3 md:gap-5"
              >
                {row.map((skill, colIndex) => {
                  const sizeClass = getSizeClass()
                  const iconSizeClass = getIconSizeClass()

                  // Adicionar leve delay na animação baseado na distância do centro (Efeito de Onda)
                  const distY = Math.abs(rowIndex - 2);
                  const midX = (row.length - 1) / 2;
                  const distX = Math.abs(colIndex - midX);
                  const delay = (distY + distX) * 0.1;

                  return (
                    <motion.div
                      key={skill.name}
                      whileHover={{ scale: 1.15, zIndex: 50 }}
                      initial={{ opacity: 0, scale: 0, filter: 'blur(10px)' }}
                      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      viewport={{ once: true, margin: "0px" }}
                      transition={{ 
                        duration: 0.6, 
                        delay: delay,
                        type: 'spring',
                        bounce: 0.4
                      }}
                      className="group relative cursor-pointer"
                    >
                      {/* Aura Brilhante Verde Água no hover */}
                      <div className="absolute inset-0 bg-[#00ffcc] opacity-0 group-hover:opacity-30 blur-2xl rounded-full transition-opacity duration-500" />
                      
                      {/* Círculo do Aplicativo (Estilo WatchOS + Glassmorphism) */}
                      <div 
                        className={`
                          relative flex flex-col items-center justify-center
                          rounded-full
                          ${sizeClass}
                          bg-[#1a1a24]/60 backdrop-blur-xl /* Fundo Vidro mais opaco */
                          border border-white/10
                          shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_4px_10px_rgba(255,255,255,0.1),_0_5px_15px_rgba(0,0,0,0.6)]
                          group-hover:bg-[#1a1a24]/80 group-hover:backdrop-blur-2xl
                          group-hover:border-[#00ffcc]/50
                          group-hover:shadow-[inset_0_4px_15px_rgba(255,255,255,0.2),_0_10px_30px_rgba(0,255,204,0.3)]
                          transition-all duration-300 overflow-hidden
                        `}
                      >
                        {/* Brilho esférico (Glossy / Glass 3D Highlight) no topo do círculo */}
                        <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none" />
                        
                        {/* Ícone */}
                        <div className="relative text-[#9ca3af] group-hover:text-white transition-colors duration-300 z-10 flex items-center justify-center">
                          {skill.imageSrc ? (
                            <div className={`relative ${iconSizeClass}`}>
                              <Image 
                                src={skill.imageSrc} 
                                alt={skill.name}
                                fill
                                className="object-contain drop-shadow-xl"
                              />
                            </div>
                          ) : (
                            skill.icon && <skill.icon className={iconSizeClass} />
                          )}
                        </div>
                      </div>

                      {/* Tooltip do Nome Hover */}
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-bottom-10 transition-all duration-300 pointer-events-none z-50">
                        <span className="block px-3 py-1 bg-[#1a1a24]/90 border border-[#00ffcc]/30 backdrop-blur-sm rounded-full text-xs font-semibold text-[#00ffcc] whitespace-nowrap drop-shadow-[0_0_10px_rgba(0,255,204,0.4)]">
                          {skill.name}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
