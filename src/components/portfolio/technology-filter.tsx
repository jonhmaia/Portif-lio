'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { Technology } from '@/lib/types/database'

interface TechnologyFilterProps {
  technologies: Technology[]
}

export function TechnologyFilter({ technologies }: TechnologyFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTech = searchParams.get('technology')

  const handleFilter = (techSlug: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (techSlug) {
      params.set('technology', techSlug)
    } else {
      params.delete('technology')
    }
    router.push(`/portfolio?${params.toString()}`)
  }

  return (
    <div className="w-full">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          <Button
            variant={!currentTech ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilter(null)}
            className="shrink-0"
          >
            Todos
          </Button>
          {technologies.map((tech) => (
            <Button
              key={tech.id}
              variant={currentTech === tech.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilter(tech.slug)}
              className="shrink-0 gap-2"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tech.color_hex }}
              />
              {tech.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
