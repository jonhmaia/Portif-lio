'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ArrowLeft, Save, Eye, Globe } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils/slugify'
import { ImageUploader } from './image-uploader'
import { GalleryManager, type GalleryImage } from './gallery-manager'
import type { Project, Technology, Tag, ProjectTranslation, ProjectImage } from '@/lib/types/database'

// Schema de tradução
const translationSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  short_description: z.string().optional(),
  full_description: z.string().optional(),
  meta_description: z.string().optional(),
})

// Schema do formulário
const formSchema = z.object({
  slug: z.string().min(1, 'Slug é obrigatório'),
  repo_url: z.string().url('URL inválida').optional().or(z.literal('')),
  deploy_url: z.string().url('URL inválida').optional().or(z.literal('')),
  is_featured: z.boolean(),
  display_order: z.number().int().min(0),
  status: z.enum(['dev', 'concluido', 'pausado', 'arquivado']),
  is_active: z.boolean(),
  translations: z.object({
    pt: translationSchema,
    en: translationSchema.partial().optional(),
  }),
})

type FormData = z.infer<typeof formSchema>

interface ProjectFormProps {
  project?: Project & {
    technology_ids?: number[]
    tag_ids?: number[]
    images?: ProjectImage[]
    translations?: {
      pt?: ProjectTranslation
      en?: ProjectTranslation
    }
  }
  technologies: Technology[]
  tags: Tag[]
}

export function ProjectForm({ project, technologies, tags }: ProjectFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTechnologies, setSelectedTechnologies] = useState<number[]>(
    project?.technology_ids || []
  )
  const [selectedTags, setSelectedTags] = useState<number[]>(project?.tag_ids || [])
  const [activeTab, setActiveTab] = useState<'pt' | 'en'>('pt')
  
  // Estados para imagens
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    project?.cover_image_url || null
  )
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(
    project?.images?.map((img) => ({
      id: img.id,
      image_url: img.image_url,
      caption: img.caption,
      display_order: img.display_order,
    })) || []
  )

  const isEditing = !!project

  // Extrair traduções existentes ou usar dados legados
  const existingPtTranslation: any = project?.translations?.pt ? {
    title: project.translations.pt.title,
    subtitle: project.translations.pt.subtitle ?? undefined,
    short_description: project.translations.pt.short_description ?? undefined,
    full_description: project.translations.pt.full_description ?? undefined,
    meta_description: project.translations.pt.meta_description ?? undefined,
  } : {
    title: project?.title || '',
    subtitle: project?.subtitle ?? undefined,
    short_description: project?.short_description ?? undefined,
    full_description: project?.full_description ?? undefined,
    meta_description: project?.meta_description ?? undefined,
  }

  const existingEnTranslation: any = project?.translations?.en ? {
    title: project.translations.en.title,
    subtitle: project.translations.en.subtitle ?? undefined,
    short_description: project.translations.en.short_description ?? undefined,
    full_description: project.translations.en.full_description ?? undefined,
    meta_description: project.translations.en.meta_description ?? undefined,
  } : {
    title: '',
    subtitle: undefined,
    short_description: undefined,
    full_description: undefined,
    meta_description: undefined,
  }

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: project?.slug || '',
      repo_url: project?.repo_url || '',
      deploy_url: project?.deploy_url || '',
      is_featured: project?.is_featured || false,
      display_order: project?.display_order || 0,
      status: project?.status || 'dev',
      is_active: project?.is_active ?? true,
      translations: {
        pt: existingPtTranslation,
        en: existingEnTranslation,
      },
    },
  })

  const handleTitleChange = (lang: 'pt' | 'en', value: string) => {
    form.setValue(`translations.${lang}.title`, value)
    // Gerar slug automaticamente baseado no título em PT
    if (lang === 'pt' && (!isEditing || !project?.slug)) {
      form.setValue('slug', slugify(value))
    }
  }

  const toggleTechnology = (id: number) => {
    setSelectedTechnologies((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsSubmitting(true)

    try {
      const payload = {
        slug: data.slug,
        cover_image_url: coverImageUrl,
        repo_url: data.repo_url || null,
        deploy_url: data.deploy_url || null,
        is_featured: data.is_featured,
        display_order: data.display_order,
        status: data.status,
        is_active: data.is_active,
        technology_ids: selectedTechnologies,
        tag_ids: selectedTags,
        images: galleryImages.map((img, index) => ({
          id: img.id,
          image_url: img.image_url,
          caption: img.caption,
          display_order: index,
        })),
        translations: {
          pt: {
            title: data.translations.pt.title,
            subtitle: data.translations.pt.subtitle || null,
            short_description: data.translations.pt.short_description || null,
            full_description: data.translations.pt.full_description || null,
            meta_description: data.translations.pt.meta_description || null,
          },
          en: data.translations.en?.title ? {
            title: data.translations.en.title,
            subtitle: data.translations.en.subtitle || null,
            short_description: data.translations.en.short_description || null,
            full_description: data.translations.en.full_description || null,
            meta_description: data.translations.en.meta_description || null,
          } : null,
        },
      }

      const url = isEditing ? `/api/projects/${project.id}` : '/api/projects'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao salvar projeto')
      }

      toast.success(isEditing ? 'Projeto atualizado!' : 'Projeto criado!')
      router.push('/admin/projects')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar projeto')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Componente para campos de tradução
  const TranslationFields = ({ lang }: { lang: 'pt' | 'en' }) => {
    const isRequired = lang === 'pt'
    const prefix = `translations.${lang}` as const

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${lang}-title`}>
            Título {isRequired && '*'}
          </Label>
          <Input
            id={`${lang}-title`}
            {...form.register(`${prefix}.title`)}
            onChange={(e) => handleTitleChange(lang, e.target.value)}
            placeholder={lang === 'pt' ? 'Nome do projeto' : 'Project name'}
          />
          {form.formState.errors.translations?.[lang]?.title && (
            <p className="text-sm text-destructive">
              {form.formState.errors.translations[lang]?.title?.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${lang}-subtitle`}>
            Subtítulo
          </Label>
          <Input
            id={`${lang}-subtitle`}
            {...form.register(`${prefix}.subtitle`)}
            placeholder={lang === 'pt' ? 'Uma breve linha sobre o projeto' : 'A brief line about the project'}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${lang}-short_description`}>
            Descrição Curta
          </Label>
          <Textarea
            id={`${lang}-short_description`}
            {...form.register(`${prefix}.short_description`)}
            placeholder={lang === 'pt' ? 'Descrição que aparece nos cards' : 'Description shown on cards'}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${lang}-full_description`}>
            Descrição Completa (Markdown)
          </Label>
          <Textarea
            id={`${lang}-full_description`}
            {...form.register(`${prefix}.full_description`)}
            placeholder={lang === 'pt' ? 'Descrição detalhada do projeto...' : 'Detailed project description...'}
            rows={10}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${lang}-meta_description`}>
            Meta Descrição (SEO)
          </Label>
          <Textarea
            id={`${lang}-meta_description`}
            {...form.register(`${prefix}.meta_description`)}
            placeholder={lang === 'pt' ? 'Descrição para mecanismos de busca' : 'Description for search engines'}
            rows={2}
          />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div className="flex gap-2">
          {isEditing && project?.slug && (
            <Button variant="outline" asChild>
              <Link href={`/projetos/${project.slug}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </Link>
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEditing ? 'Salvar Alterações' : 'Criar Projeto'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Slug (não traduzível) */}
          <Card>
            <CardHeader>
              <CardTitle>Identificador</CardTitle>
              <CardDescription>O slug é único e não é traduzido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...form.register('slug')}
                  placeholder="nome-do-projeto"
                />
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Translations Tabs */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>Conteúdo Traduzível</CardTitle>
              </div>
              <CardDescription>
                Preencha o conteúdo em Português (obrigatório) e opcionalmente em Inglês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'pt' | 'en')}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="pt" className="gap-2">
                    🇧🇷 Português
                    {form.formState.errors.translations?.pt && (
                      <span className="h-2 w-2 bg-destructive rounded-full" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="en" className="gap-2">
                    🇺🇸 English
                    {form.watch('translations.en.title') && (
                      <span className="h-2 w-2 bg-green-500 rounded-full" />
                    )}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pt">
                  <TranslationFields lang="pt" />
                </TabsContent>
                <TabsContent value="en">
                  <TranslationFields lang="en" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle>Imagem de Capa</CardTitle>
              <CardDescription>
                Imagem principal que aparece nos cards e no topo da página do projeto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={coverImageUrl}
                onChange={setCoverImageUrl}
                bucket="projects"
                folder="covers"
                aspectRatio="video"
                placeholder="Arraste ou clique para enviar a imagem de capa"
              />
            </CardContent>
          </Card>

          {/* Gallery */}
          <GalleryManager
            images={galleryImages}
            onChange={setGalleryImages}
            bucket="projects"
            folder="gallery"
          />

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="repo_url">URL do Repositório</Label>
                  <Input
                    id="repo_url"
                    {...form.register('repo_url')}
                    placeholder="https://github.com/..."
                    type="url"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deploy_url">URL do Deploy</Label>
                  <Input
                    id="deploy_url"
                    {...form.register('deploy_url')}
                    placeholder="https://..."
                    type="url"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status e Visibilidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.watch('status')}
                  onValueChange={(value: any) => form.setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Em Desenvolvimento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input
                  id="display_order"
                  type="number"
                  min={0}
                  {...form.register('display_order', { valueAsNumber: true })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Ativo</Label>
                <Switch
                  id="is_active"
                  checked={form.watch('is_active')}
                  onCheckedChange={(checked) => form.setValue('is_active', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Destaque</Label>
                <Switch
                  id="is_featured"
                  checked={form.watch('is_featured')}
                  onCheckedChange={(checked) => form.setValue('is_featured', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle>Tecnologias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge
                    key={tech.id}
                    variant={selectedTechnologies.includes(tech.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTechnology(tech.id)}
                    style={
                      selectedTechnologies.includes(tech.id)
                        ? { backgroundColor: tech.color_hex }
                        : undefined
                    }
                  >
                    {tech.name}
                  </Badge>
                ))}
                {technologies.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma tecnologia cadastrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.id)}
                    style={
                      selectedTags.includes(tag.id)
                        ? { backgroundColor: tag.color_hex }
                        : undefined
                    }
                  >
                    {tag.name}
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma tag cadastrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
