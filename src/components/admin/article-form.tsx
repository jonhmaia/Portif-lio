'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ArrowLeft, Save, Eye, FileText, Sparkles, Globe } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils/slugify'
import { MarkdownRenderer } from '@/components/blog/markdown-renderer'
import { articleFormSchema, type ArticleFormInput } from '@/lib/validations/article'
import type { Article, Category, Tag, Project, ArticleTranslation } from '@/lib/types/database'

// Usar o schema centralizado de formulário
const formSchema = articleFormSchema

type FormData = ArticleFormInput

interface TranslationFieldsProps {
  lang: 'pt' | 'en'
  form: UseFormReturn<FormData>
  editorTab: 'write' | 'preview'
  setEditorTab: (v: 'write' | 'preview') => void
  handleTitleChange: (lang: 'pt' | 'en', value: string) => void
}

function TranslationFields({ lang, form, editorTab, setEditorTab, handleTitleChange }: TranslationFieldsProps) {
  const isRequired = lang === 'pt'
  const prefix = `translations.${lang}` as const
  const watchContent = form.watch(`${prefix}.content`)

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${lang}-title`}>
            Título {isRequired && '*'}
          </Label>
          <Input
            id={`${lang}-title`}
            {...form.register(`${prefix}.title`)}
            onChange={(e) => {
              form.register(`${prefix}.title`).onChange(e)
              handleTitleChange(lang, e.target.value)
            }}
            placeholder={lang === 'pt' ? 'Título do artigo' : 'Article title'}
          />
          {form.formState.errors.translations?.[lang]?.title && (
            <p className="text-sm text-destructive">
              {form.formState.errors.translations[lang]?.title?.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${lang}-summary`}>Resumo</Label>
          <Textarea
            id={`${lang}-summary`}
            {...form.register(`${prefix}.summary`)}
            placeholder={lang === 'pt' ? 'Breve resumo do artigo' : 'Brief summary of the article'}
            rows={2}
          />
        </div>
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <Label>
          Conteúdo {isRequired && '*'}
        </Label>
        <Tabs value={editorTab} onValueChange={(v) => setEditorTab(v as 'write' | 'preview')}>
          <TabsList className="mb-4">
            <TabsTrigger value="write">
              <FileText className="mr-2 h-4 w-4" />
              Escrever
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="mt-0">
            <Textarea
              {...form.register(`${prefix}.content`)}
              placeholder={lang === 'pt' ? 'Escreva seu artigo em Markdown...' : 'Write your article in Markdown...'}
              rows={20}
              className="font-mono text-sm resize-y min-h-[400px]"
            />
            {form.formState.errors.translations?.[lang]?.content && (
              <p className="text-sm text-destructive mt-2">
                {form.formState.errors.translations[lang]?.content?.message}
              </p>
            )}
          </TabsContent>
          <TabsContent value="preview" className="mt-0">
            <div className="min-h-[400px] border rounded-lg p-6 bg-background">
              {watchContent ? (
                <MarkdownRenderer content={watchContent} />
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {lang === 'pt' ? 'Nenhum conteúdo para visualizar' : 'No content to preview'}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* SEO */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          SEO
        </h4>
        <div className="space-y-2">
          <Label htmlFor={`${lang}-excerpt`}>Excerpt</Label>
          <Textarea
            id={`${lang}-excerpt`}
            {...form.register(`${prefix}.excerpt`)}
            placeholder={lang === 'pt' ? 'Resumo estendido para SEO' : 'Extended summary for SEO'}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${lang}-meta_description`}>Meta Descrição</Label>
          <Textarea
            id={`${lang}-meta_description`}
            {...form.register(`${prefix}.meta_description`)}
            placeholder={lang === 'pt' ? 'Descrição para mecanismos de busca' : 'Description for search engines'}
            rows={2}
          />
        </div>
      </div>
    </div>
  )
}

interface ArticleFormProps {
  article?: Article & {
    tag_ids?: number[]
    project_ids?: number[]
    translations?: {
      pt?: ArticleTranslation
      en?: ArticleTranslation
    }
  }
  categories: Category[]
  tags: Tag[]
  projects: Pick<Project, 'id' | 'title' | 'slug'>[]
}

export function ArticleForm({ article, categories, tags, projects }: ArticleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTags, setSelectedTags] = useState<number[]>(article?.tag_ids || [])
  const [selectedProjects, setSelectedProjects] = useState<number[]>(article?.project_ids || [])
  const [langTab, setLangTab] = useState<'pt' | 'en'>('pt')
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write')

  const isEditing = !!article

  // Extrair traduções existentes ou usar dados legados
  const existingPtTranslation = article?.translations?.pt || {
    title: article?.title || '',
    content: article?.content || '',
    summary: article?.summary || '',
    excerpt: article?.excerpt || '',
    meta_description: article?.meta_description || '',
  }

  const existingEnTranslation = article?.translations?.en || {
    title: '',
    content: '',
    summary: '',
    excerpt: '',
    meta_description: '',
  }

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      slug: article?.slug || '',
      cover_image_url: article?.cover_image_url || '',
      status: article?.status || 'draft',
      category_id: article?.category_id || null,
      translations: {
        pt: existingPtTranslation,
        en: existingEnTranslation,
      },
    },
  })

  const handleTitleChange = (lang: 'pt' | 'en', value: string) => {
    form.setValue(`translations.${lang}.title`, value)
    // Gerar slug automaticamente baseado no título em PT
    if (lang === 'pt' && (!isEditing || !article?.slug)) {
      form.setValue('slug', slugify(value))
    }
  }

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const toggleProject = (id: number) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsSubmitting(true)

    try {
      const payload = {
        slug: data.slug,
        cover_image_url: data.cover_image_url || null,
        status: data.status,
        category_id: data.category_id,
        tag_ids: selectedTags,
        project_ids: selectedProjects,
        translations: {
          pt: {
            title: data.translations.pt.title,
            content: data.translations.pt.content,
            summary: data.translations.pt.summary || null,
            excerpt: data.translations.pt.excerpt || null,
            meta_description: data.translations.pt.meta_description || null,
          },
          en: data.translations.en?.title && data.translations.en?.content ? {
            title: data.translations.en.title,
            content: data.translations.en.content,
            summary: data.translations.en.summary || null,
            excerpt: data.translations.en.excerpt || null,
            meta_description: data.translations.en.meta_description || null,
          } : null,
        },
      }

      const url = isEditing ? `/api/articles/${article.id}` : '/api/articles'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao salvar artigo')
      }

      toast.success(isEditing ? 'Artigo atualizado!' : 'Artigo criado!')
      router.push('/admin/articles')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar artigo')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Componente para campos de tradução removido daqui (foi movido para fora)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/articles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div className="flex gap-2">
          {isEditing && article?.status === 'published' && article?.slug && (
            <Button variant="outline" asChild>
              <Link href={`/blog/${article.slug}`} target="_blank">
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
            {isEditing ? 'Salvar Alterações' : 'Criar Artigo'}
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...form.register('slug')}
                  placeholder="titulo-do-artigo"
                />
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_image_url">URL da Imagem de Capa</Label>
                <Input
                  id="cover_image_url"
                  {...form.register('cover_image_url')}
                  placeholder="https://..."
                  type="url"
                />
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
              <Tabs value={langTab} onValueChange={(v) => setLangTab(v as 'pt' | 'en')}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="pt" className="gap-2">
                    🇧🇷 Português
                    {form.formState.errors.translations?.pt && (
                      <span className="h-2 w-2 bg-destructive rounded-full" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="en" className="gap-2">
                    🇺🇸 English
                    {form.watch('translations.en.title') && form.watch('translations.en.content') && (
                      <span className="h-2 w-2 bg-green-500 rounded-full" />
                    )}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pt">
                <TranslationFields
                  lang="pt"
                  form={form}
                  editorTab={editorTab}
                  setEditorTab={setEditorTab}
                  handleTitleChange={handleTitleChange}
                />
              </TabsContent>
              <TabsContent value="en">
                <TranslationFields
                  lang="en"
                  form={form}
                  editorTab={editorTab}
                  setEditorTab={setEditorTab}
                  handleTitleChange={handleTitleChange}
                />
              </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Publicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.watch('status')}
                  onValueChange={(value: 'draft' | 'published') => form.setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Categoria</Label>
                <Select
                  value={form.watch('category_id')?.toString() || undefined}
                  onValueChange={(value) => form.setValue('category_id', value ? parseInt(value) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {article?.reading_time_minutes && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Tempo de leitura: <span className="font-medium">{article.reading_time_minutes} min</span>
                  </p>
                </div>
              )}
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

          {/* Related Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Projetos Relacionados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {projects.map((project) => (
                  <label
                    key={project.id}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-accent"
                  >
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => toggleProject(project.id)}
                    />
                    <span className="text-sm">{project.title}</span>
                  </label>
                ))}
                {projects.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum projeto disponível
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
