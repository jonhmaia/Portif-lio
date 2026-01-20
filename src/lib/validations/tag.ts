import { z } from 'zod'

// Schema para tradução de tag
export const tagTranslationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50),
})

// Schema principal da tag com traduções
export const tagSchema = z.object({
  slug: z.string().min(1, 'Slug é obrigatório').max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').default('#000000'),
  // Traduções - PT-BR é obrigatório, EN é opcional
  translations: z.object({
    pt: tagTranslationSchema,
    en: tagTranslationSchema.partial().optional(),
  }),
})

// Schema legado (para compatibilidade)
export const tagLegacySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50),
  slug: z.string().min(1, 'Slug é obrigatório').max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').default('#000000'),
})

export const tagUpdateSchema = tagSchema.partial()

export type TagTranslationInput = z.infer<typeof tagTranslationSchema>
export type TagInput = z.infer<typeof tagSchema>
export type TagUpdateInput = z.infer<typeof tagUpdateSchema>
export type TagLegacyInput = z.infer<typeof tagLegacySchema>
