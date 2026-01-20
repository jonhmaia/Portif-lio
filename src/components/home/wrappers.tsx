'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function HeroWrapper({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <section className={cn("relative flex-1 flex flex-col justify-center items-center py-20 md:py-32 overflow-hidden", className)}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container px-4 md:px-6 relative z-10"
      >
        {children}
      </motion.div>
    </section>
  )
}

export function HeroContent({ children }: { children: ReactNode }) {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2
          }
        }
      }}
      className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8"
    >
      {children}
    </motion.div>
  )
}

export function AnimatedElement({ children, className, delay = 0 }: { children: ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function BioWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="mt-16 md:mt-20 max-w-5xl mx-auto p-8 md:p-12 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md shadow-2xl relative overflow-hidden text-left group hover:border-primary/20 transition-colors duration-500"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      {children}
    </motion.div>
  )
}
