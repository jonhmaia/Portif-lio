import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderKanban, FileText, Eye, Tag, ArrowUpRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

async function DashboardStats() {
  const supabase = await createClient()

  // Get counts
  const [
    { count: projectsCount },
    { count: articlesCount },
    { count: tagsCount },
    { data: projectViews },
    { data: articleViews },
    { data: recentProjects },
    { data: recentArticles },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('tags').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('views_count'),
    supabase.from('articles').select('views_count'),
    supabase.from('projects').select('id, title, slug, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('articles').select('id, title, slug, status, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const totalProjectViews =
    (projectViews as Array<{ views_count: number | null }> | null)?.reduce(
      (acc, p) => acc + (p.views_count ?? 0),
      0
    ) ?? 0
  const totalArticleViews =
    (articleViews as Array<{ views_count: number | null }> | null)?.reduce(
      (acc, a) => acc + (a.views_count ?? 0),
      0
    ) ?? 0
  const totalViews = totalProjectViews + totalArticleViews

  const stats = [
    {
      title: 'Total de Projetos',
      value: projectsCount || 0,
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total de Artigos',
      value: articlesCount || 0,
      icon: FileText,
      href: '/admin/articles',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total de Tags',
      value: tagsCount || 0,
      icon: Tag,
      href: '/admin/tags',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Visualizações',
      value: totalViews,
      icon: Eye,
      href: '#',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ]

  const recentProjectsList =
    (recentProjects as
      | Array<{
          id: number
          title: string
          slug: string
          status: string
          created_at: string
        }>
      | null) ?? []

  const recentArticlesList =
    (recentArticles as
      | Array<{
          id: number
          title: string
          slug: string
          status: string
          created_at: string
        }>
      | null) ?? []

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.href !== '#' && (
                <Link href={stat.href} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-1">
                  Ver todos
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Projetos Recentes</CardTitle>
              <CardDescription>Últimos projetos adicionados</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/projects/new">Novo Projeto</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentProjectsList.length > 0 ? (
              <div className="space-y-3">
                {recentProjectsList.map((project) => (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}/edit`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'concluido' 
                        ? 'bg-green-500/10 text-green-500' 
                        : project.status === 'dev'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {project.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Nenhum projeto encontrado
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Articles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Artigos Recentes</CardTitle>
              <CardDescription>Últimos artigos criados</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/articles/new">Novo Artigo</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentArticlesList.length > 0 ? (
              <div className="space-y-3">
                {recentArticlesList.map((article) => (
                  <Link
                    key={article.id}
                    href={`/admin/articles/${article.id}/edit`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium">{article.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(article.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      article.status === 'published'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Nenhum artigo encontrado
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsLoading() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu portfólio e blog</p>
      </div>

      <Suspense fallback={<StatsLoading />}>
        <DashboardStats />
      </Suspense>
    </div>
  )
}
