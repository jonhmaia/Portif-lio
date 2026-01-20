import { z } from 'zod'

// Schema para tradução de projeto
export const projectTranslationSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200),
  subtitle: z.string().max(200).optional().nullable(),
  short_description: z.string().max(300).optional().nullable(),
  full_description: z.string().optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
})

// Schema principal do projeto com traduções
export const projectSchema = z.object({
  slug: z.string().min(1, 'Slug é obrigatório').max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  cover_image_url: z.string().url().optional().nullable().or(z.literal('')),
  repo_url: z.string().url().optional().nullable().or(z.literal('')),
  deploy_url: z.string().url().optional().nullable().or(z.literal('')),
  is_featured: z.boolean().default(false),
  display_order: z.number().int().min(0).default(0),
  status: z.enum(['dev', 'concluido', 'pausado', 'arquivado']).default('dev'),
  is_active: z.boolean().default(true),
  meta_keywords: z.array(z.string()).optional().nullable(),
  technology_ids: z.array(z.number()).optional(),
  tag_ids: z.array(z.number()).optional(),
  // Traduções - PT-BR é obrigatório, EN é opcional
  translations: z.object({
    pt: projectTranslationSchema,
    en: projectTranslationSchema.partial().optional(),
  }),
})

// Schema legado (para compatibilidade)
export const projectLegacySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200),
  slug: z.string().min(1, 'Slug é obrigatório').max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  subtitle: z.string().max(200).optional().nullable(),
  short_description: z.string().max(300).optional().nullable(),
  full_description: z.string().optional().nullable(),
  cover_image_url: z.string().url().optional().nullable(),
  repo_url: z.string().url().optional().nullable(),
  deploy_url: z.string().url().optional().nullable(),
  is_featured: z.boolean().default(false),
  display_order: z.number().int().min(0).default(0),
  status: z.enum(['dev', 'concluido', 'pausado', 'arquivado']).default('dev'),
  is_active: z.boolean().default(true),
  language: z.enum(['pt-BR', 'en']).default('pt-BR'),
  meta_description: z.string().max(160).optional().nullable(),
  meta_keywords: z.array(z.string()).optional().nullable(),
  technology_ids: z.array(z.number()).optional(),
  tag_ids: z.array(z.number()).optional(),
})

export const projectUpdateSchema = projectSchema.partial()

export type ProjectTranslationInput = z.infer<typeof projectTranslationSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>
export type ProjectLegacyInput = z.infer<typeof projectLegacySchema>
