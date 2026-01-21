# Portfolio - João Marcos

Meu Portfólio profissional desenvolvido com Next.js 16, apresentando projetos, artigos técnicos e experiência profissional em desenvolvimento Full Stack e Inteligência Artificial.

## 📋 Sobre o Projeto

Este é um portfólio moderno e responsivo desenvolvido com as mais recentes tecnologias web, incluindo:

- **Interface multilingue** (Português e Inglês) com next-intl
- **Sistema de blog** integrado com editor Markdown
- **Galeria de projetos** com filtros por tecnologias e tags
- **Painel administrativo** completo para gerenciamento de conteúdo
- **SEO otimizado** com sitemap e metadados dinâmicos
- **Arquitetura moderna** com Server Components e App Router

---

## 👨‍💻 Sobre João Marcos

### Perfil Profissional

Desenvolvedor Full Stack especializado em **Engenharia de Software** e **Inteligência Artificial**, com sólida experiência em desenvolvimento web moderno e automação de processos.

**Formação:**
- 🎓 Graduando em Engenharia de Software na **Universidade Federal de Goiás (UFG)**
- 📚 Pesquisador em Sistemas Inteligentes com publicação no **JEMS (Joint Event on Microservices)**
- 📍 Localização: Goiânia, GO, Brasil

### Experiência Profissional

#### 🔷 Watrix Tecnologia (2024 - Atual)
**Desenvolvedor Full Stack**

- Desenvolvimento de sistemas web com React, Next.js e TypeScript
- Implementação de integrações com APIs e automações com n8n
- Criação de soluções com IA generativa e LLMs
- Gestão de banco de dados PostgreSQL e Supabase

#### 🔷 Flex ON (2023 - 2024)
**Desenvolvedor Full Stack**

- Desenvolvimento de plataformas web responsivas
- Implementação de automações e integrações de sistemas
- Otimização de performance e experiência do usuário

#### 🔷 CEIA - Centro de Empreendedorismo e Inovação (2022 - 2023)
**Desenvolvedor Full Stack**

- Desenvolvimento de soluções web para empreendedores
- Criação de dashboards e ferramentas de análise
- Suporte técnico e manutenção de sistemas

### Projetos Destacados

#### 🎯 Maestro AI
Plataforma de IA generativa para automação de processos
- **Stack:** n8n, OpenAI, Supabase
- Sistema completo de automação e geração de conteúdo

#### 🎯 Camapum
Plataforma web para gestão de projetos
- **Stack:** React, Supabase, n8n
- Interface moderna e responsiva com gestão completa de dados

#### 🎯 Cashmed (Fintech)
Solução financeira desenvolvida com Django
- **Stack:** Python (Django), PostgreSQL
- Sistema completo de gestão financeira

### Competências Técnicas

#### 💻 Desenvolvimento Full Stack
- **Linguagens:** Python, TypeScript, JavaScript, C/C++, SQL
- **Frontend:** React, Next.js, HTML5, CSS3, Tailwind CSS
- **Backend:** Node.js, Django, Express.js
- **Bancos de Dados:** PostgreSQL, MongoDB, Supabase

#### 🤖 Inteligência Artificial & Automação
- **IA Generativa:** LLM Fine-Tuning, NLP, RAG, Generative AI
- **Automação:** n8n, RPA, Data Governance, Observability
- **Integrações:** APIs RESTful, Webhooks, Automações

#### 🛠️ Ferramentas & DevOps
- **Controle de Versão:** Git, GitHub
- **Containerização:** Docker
- **CI/CD:** Pipelines de deploy automatizados
- **Ferramentas:** VS Code, Bubble.io, Supabase

#### 📊 Liderança & Estratégia
- Liderança Técnica
- Engenharia de Receita
- Arquitetura de Software
- Scrum/Agile

### Idiomas
- 🇧🇷 **Português:** Nativo
- 🇺🇸 **Inglês:** Avançado

---

## 🛠️ Requisitos Técnicos

### Tecnologias Principais

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| **Framework** | Next.js | 16.1.3 |
| **Runtime** | React | 19.2.3 |
| **Linguagem** | TypeScript | ^5 |
| **Styling** | Tailwind CSS | ^4 |
| **Backend** | Supabase | ^2.90.1 |
| **Internacionalização** | next-intl | ^4.7.0 |
| **Formulários** | react-hook-form | ^7.71.1 |
| **Validação** | Zod | ^4.3.5 |
| **Estado** | TanStack Query | ^5.90.19 |
| **UI Components** | Radix UI | ^1.x |

### Principais Dependências

#### Frontend
```json
{
  "next": "16.1.3",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "next-intl": "^4.7.0",
  "tailwindcss": "^4",
  "next-themes": "^0.4.6",
  "lucide-react": "^0.562.0"
}
```

#### Backend & Database
```json
{
  "@supabase/ssr": "^0.8.0",
  "@supabase/supabase-js": "^2.90.1",
  "@tanstack/react-query": "^5.90.19"
}
```

#### Forms & Validation
```json
{
  "react-hook-form": "^7.71.1",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.3.5"
}
```

#### UI Components
```json
{
  "@radix-ui/react-avatar": "^1.1.11",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-tabs": "^1.1.13"
}
```

#### Content & Markdown
```json
{
  "react-markdown": "^10.1.0",
  "remark-gfm": "^4.0.1",
  "rehype-highlight": "^7.0.2"
}
```

### Requisitos de Sistema

- **Node.js:** 18.x ou superior
- **npm:** 9.x ou superior
- **Banco de Dados:** PostgreSQL (via Supabase)
- **Deploy:** Vercel (recomendado) ou similar

---

### Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# Execute o banco de dados (migrações do Supabase)
# Certifique-se de que o Supabase está configurado e as migrações foram aplicadas

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento na porta 3000

# Build
npm run build        # Cria build de produção otimizado

# Produção
npm start            # Inicia servidor de produção

# Linting
npm run lint         # Executa ESLint
```

---

## 📁 Estrutura do Projeto

```
portfolio-nextjs/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── [locale]/          # Rotas internacionalizadas
│   │   │   ├── (public)/      # Rotas públicas
│   │   │   │   ├── blog/      # Blog e artigos
│   │   │   │   ├── projetos/  # Galeria de projetos
│   │   │   │   └── ...
│   │   │   └── (admin)/       # Painel administrativo
│   │   └── api/               # API Routes
│   ├── components/            # Componentes React
│   │   ├── admin/            # Componentes do admin
│   │   ├── blog/             # Componentes do blog
│   │   ├── layout/           # Header, Footer, etc.
│   │   └── ui/               # Componentes UI reutilizáveis
│   ├── lib/                  # Utilitários e configurações
│   │   ├── supabase/         # Cliente Supabase
│   │   ├── types/            # Tipos TypeScript
│   │   └── validations/      # Schemas Zod
│   ├── messages/             # Traduções (i18n)
│   └── i18n/                 # Configuração de internacionalização
├── public/                   # Arquivos estáticos
├── supabase/
│   └── migrations/           # Migrações do banco de dados
└── package.json
```

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no dashboard
3. Deploy automático a cada push

### Configuração no Vercel

1. Acesse **Settings** → **Environment Variables**
2. Adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (opcional)
3. Faça o deploy

---

## 📚 Funcionalidades

### Públicas
- ✅ Portfólio de projetos com filtros
- ✅ Blog com artigos técnicos
- ✅ Sistema de tags e categorias
- ✅ Página de currículo
- ✅ Contato e links sociais
- ✅ SEO otimizado (sitemap, robots.txt, metadados)

### Administrativas
- ✅ CRUD completo de projetos
- ✅ CRUD completo de artigos (Markdown)
- ✅ Gestão de categorias e tags
- ✅ Gestão de tecnologias
- ✅ Upload de imagens (Supabase Storage)
- ✅ Sistema de traduções (PT-BR / EN)
- ✅ Autenticação e autorização

---

## 📄 Licença

Este projeto é privado e de propriedade de João Marcos.

---

## 📞 Contato

- **Email:** contato@maiainteligencia.com
- **Telefone:** (62) 99901-8119
- **LinkedIn:** [linkedin.com/in/joaomarcosmaia](https://www.linkedin.com/in/joaomarcosmaia)
- **GitHub:** [github.com/jonhmaia](https://github.com/jonhmaia)
- **Localização:** Goiânia, GO, Brasil

---

## 🙏 Agradecimentos

Projeto desenvolvido com as melhores práticas de desenvolvimento web moderno, utilizando tecnologias de ponta e seguindo padrões de código limpo e arquitetura escalável.
