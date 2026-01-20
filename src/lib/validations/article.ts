import { z } from 'zod'

// Schema para tradução de artigo
export const articleTranslationSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  summary: z.string().max(300).optional().nullable(),
  excerpt: z.string().max(500).optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
})

// Schema principal do artigo com traduções
export const articleSchema = z.object({
  slug: z.string().min(1, 'Slug é obrigatório').max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  cover_image_url: z.string().url().optional().nullable().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('draft'),
  category_id: z.number().optional().nullable(),
  meta_keywords: z.array(z.string()).optional().nullable(),
  tag_ids: z.array(z.number()).optional(),
  project_ids: z.array(z.number()).optional(),
  // Traduções - PT-BR é obrigatório, EN é opcional
  translations: z.object({
    pt: articleTranslationSchema,
    en: articleTranslationSchema.partial().optional(),
  }),
})

// Schema específico para o formulário (permite campos vazios na tradução opcional)
export const articleFormSchema = articleSchema.extend({
  translations: z.object({
    pt: articleTranslationSchema,
    en: z.object({
      title: z.string().max(200).optional().or(z.literal('')),
      content: z.string().optional().or(z.literal('')),
      summary: z.string().max(300).optional().nullable().or(z.literal('')),
      excerpt: z.string().max(500).optional().nullable().or(z.literal('')),
      meta_description: z.string().max(160).optional().nullable().or(z.literal('')),
    }).optional(),
  }),
})

export const articleUpdateSchema = articleSchema.partial()

export type ArticleTranslationInput = z.infer<typeof articleTranslationSchema>
export type ArticleInput = z.infer<typeof articleSchema>
export type ArticleFormInput = z.infer<typeof articleFormSchema>
export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>
