import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pt-BR', 'en'],
  defaultLocale: 'pt-BR',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/contact': '/contact',
    '/curriculo': {
      'pt-BR': '/curriculo',
      en: '/resume',
    },
    '/projetos': {
      'pt-BR': '/projetos',
      en: '/projects',
    },
    '/projetos/[slug]': {
      'pt-BR': '/projetos/[slug]',
      en: '/projects/[slug]',
    },
    '/admin': '/admin',
    '/admin/articles': '/admin/articles',
    '/admin/articles/new': '/admin/articles/new',
    '/admin/articles/[id]/edit': '/admin/articles/[id]/edit',
    '/admin/projects': '/admin/projects',
    '/admin/projects/new': '/admin/projects/new',
    '/admin/projects/[id]/edit': '/admin/projects/[id]/edit',
    '/admin/categories': '/admin/categories',
    '/admin/tags': '/admin/tags',
    '/admin/technologies': '/admin/technologies',
    '/auth/login': '/auth/login',
  },
})

export type Locale = (typeof routing.locales)[number]

