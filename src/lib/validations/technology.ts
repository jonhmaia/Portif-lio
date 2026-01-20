import { z } from 'zod'

export const technologySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  slug: z.string().min(1, 'Slug é obrigatório').max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  icon_class: z.string().max(100).optional().nullable(),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').default('#000000'),
  category: z.enum(['language', 'framework', 'lib', 'db', 'tool', 'other']).default('other'),
  is_active: z.boolean().default(true),
})

export const technologyUpdateSchema = technologySchema.partial()

export type TechnologyInput = z.infer<typeof technologySchema>
export type TechnologyUpdateInput = z.infer<typeof technologyUpdateSchema>
