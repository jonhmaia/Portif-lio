## Situação Atual (o que existe hoje)
- O projeto tem `next-intl` instalado, mas não está integrado ao App Router.
- A “troca de idioma” atual é via `?lang=pt-BR|en` + `localStorage` e alguns ternários no frontend.
- O conteúdo (projects/articles/categories/tags) já tem tabelas de tradução no Supabase e as rotas de API já conseguem “mesclar” tradução por `lang`.

## Objetivo
- Ter i18n real (pt-BR e en) para todas as páginas (públicas, admin e login), controlado pelo seletor de idiomas.
- Exibir conteúdo do banco no idioma correto automaticamente.
- Manter URLs amigáveis, com PT como padrão e EN acessível em `/en/...`.

## Decisões Técnicas
- Usar `next-intl` (já instalado) com App Router.
- Idiomas: `pt-BR` (default) e `en`.
- Prefixo de locale: `as-needed` (pt-BR sem prefixo; inglês com `/en`).
- Rotas com caminhos traduzidos onde faz sentido (ex.: `/projetos` → `/en/projects`, `/curriculo` → `/en/resume`) via `pathnames` do `next-intl`.

## Implementação (passo a passo)
1) **Infra de i18n**
- Criar `src/i18n/routing.ts` com `locales`, `defaultLocale`, `localePrefix` e `pathnames`.
- Criar `src/i18n/request.ts` para carregar mensagens (`src/messages/pt-BR.json` e `src/messages/en.json`).
- Criar `src/navigation.ts` (wrappers `Link`, `useRouter`, `usePathname`, etc. do `next-intl`) para links/rotas respeitarem locale e pathnames.

2) **Reorganização das páginas para suportar locale**
- Introduzir `src/app/[locale]/layout.tsx` como layout internacionalizado.
- Mover as páginas atuais para dentro de `src/app/[locale]/...`:
  - `src/app/(public)` → `src/app/[locale]/(public)`
  - `src/app/(admin)` → `src/app/[locale]/(admin)`
  - `src/app/auth` → `src/app/[locale]/auth`
- Manter `src/app/api` fora do `[locale]` (APIs continuam em `/api/...`).

3) **Middleware (i18n + Supabase auth) em um só**
- Unificar o middleware do `next-intl` com o middleware existente do Supabase.
- Ajustar regras de proteção:
  - Proteger `/admin` (com e sem prefixo, pois o middleware pode reescrever para o default locale).
  - Redirecionar não logado para `/{locale}/auth/login`.
  - Redirecionar logado que tenta abrir login para `/{locale}/admin`.

4) **Atualizar o seletor de idiomas**
- Trocar o comportamento de `?lang=` por navegação de locale do `next-intl`.
- Remover dependência de `localStorage`/querystring (o cookie de locale do `next-intl` resolve persistência).

5) **Traduzir todas as strings da UI (páginas + componentes)**
- Criar chaves de tradução para:
  - Header/menus, footer, botões, labels, textos estáticos (home, projetos, blog, currículo, contato, admin, login).
  - Mensagens de erro/empty-state exibidas nas páginas.
- Substituir hardcodes por:
  - Server Components: `getTranslations()`/`getMessages()`
  - Client Components: `useTranslations()`

6) **Conteúdo do Supabase no idioma correto**
- Padronizar seleção de tradução baseada no locale atual (sem `?lang`).
- Onde a página busca direto do Supabase (ex.: listagem de projetos), incluir `*_translations` e mesclar conforme locale (reaproveitando a mesma lógica que já existe nas rotas de API).
- Nas rotas de API, manter suporte a `lang` (compatibilidade), mas priorizar locale vindo do request (header/cookie) quando `lang` não existir.

7) **SEO/Metadata/Sitemap/Robots**
- Trocar `metadata` estático por `generateMetadata` por locale nas páginas relevantes.
- Ajustar `openGraph.locale` e alternates.
- Atualizar `sitemap.ts` para incluir URLs por idioma (pt-BR e en) e os caminhos traduzidos (`/projects`, `/resume`, etc.).

8) **Verificação**
- Rodar lint/build.
- Validar manualmente:
  - troca de idioma preserva a página atual,
  - header/nav/links geram paths corretos,
  - páginas dinâmicas (`/projetos/[slug]` e `/blog/[slug]`) funcionam em ambos idiomas,
  - admin/login redirecionam corretamente com locale.

## Resultado Esperado
- Site em pt-BR por padrão em `/`.
- Versão em inglês em `/en/...`.
- Seletor muda idioma sem querystring e mantém o usuário na mesma seção.
- Conteúdo do banco e toda a UI (incluindo admin/login) exibidos no idioma selecionado.