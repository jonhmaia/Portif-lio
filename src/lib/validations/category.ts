import { z } from 'zod'

// Schema para tradução de categoria
export const categoryTranslationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().max(500).optional().nullable(),
})

// Schema principal da categoria com traduções
export const categorySchema = z.object({
  slug: z.string().min(1, 'Slug é obrigatório').max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').default('#000000'),
  display_order: z.number().int().min(0).default(0),
  // Traduções - PT-BR é obrigatório, EN é opcional
  translations: z.object({
    pt: categoryTranslationSchema,
    en: categoryTranslationSchema.partial().optional(),
  }),
})

// Schema legado (para compatibilidade)
export const categoryLegacySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  slug: z.string().min(1, 'Slug é obrigatório').max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  description: z.string().max(500).optional().nullable(),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').default('#000000'),
  display_order: z.number().int().min(0).default(0),
})

export const categoryUpdateSchema = categorySchema.partial()

export type CategoryTranslationInput = z.infer<typeof categoryTranslationSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>
export type CategoryLegacyInput = z.infer<typeof categoryLegacySchema>
