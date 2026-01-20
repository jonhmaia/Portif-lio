# Portfolio Next.js

Projeto de portfólio desenvolvido com Next.js, TypeScript, Supabase e Next-intl.

## Configuração de Variáveis de Ambiente

Este projeto requer as seguintes variáveis de ambiente para funcionar corretamente:

### Variáveis Obrigatórias

1. **NEXT_PUBLIC_SUPABASE_URL** - URL do seu projeto Supabase
   - Encontre esta URL em: https://supabase.com/dashboard/project/_/settings/api
   - Exemplo: `https://xxxxxxxxxxxxx.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Chave anônima (pública) do Supabase
   - Encontre esta chave em: https://supabase.com/dashboard/project/_/settings/api
   - Esta é a chave `anon` ou `public`

### Variável Opcional (para operações admin)

3. **SUPABASE_SERVICE_ROLE_KEY** - Chave de serviço do Supabase (usada apenas server-side)
   - Encontre esta chave em: https://supabase.com/dashboard/project/_/settings/api
   - ⚠️ **IMPORTANTE**: Nunca exponha esta chave no cliente. Ela só deve ser usada em rotas de API server-side.

## Configuração no Vercel

Para configurar as variáveis de ambiente no Vercel:

1. Acesse seu projeto no Vercel Dashboard
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL` (valor: sua URL do Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (valor: sua chave anônima)
   - `SUPABASE_SERVICE_ROLE_KEY` (valor: sua chave de serviço - opcional mas recomendado para funcionalidades admin)

4. Certifique-se de que as variáveis estão configuradas para os ambientes corretos:
   - Production
   - Preview (opcional)
   - Development (opcional)

5. Após adicionar as variáveis, você precisará fazer um novo deploy para que as mudanças tenham efeito.

## Como Obter as Credenciais do Supabase

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Settings** → **API**
4. Na seção **Project API keys**, você encontrará:
   - **Project URL** → Use como `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → Use como `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → Use como `SUPABASE_SERVICE_ROLE_KEY` (manter em segredo!)

## Configuração Local

Para desenvolvimento local, crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Não commite o arquivo `.env.local`** - ele já está no `.gitignore`.

## Troubleshooting

Se você estiver vendo erros sobre variáveis de ambiente faltando:

1. Verifique se as variáveis estão configuradas corretamente no Vercel
2. Certifique-se de que fez um novo deploy após adicionar as variáveis
3. Verifique se os nomes das variáveis estão corretos (case-sensitive)
4. Para variáveis `NEXT_PUBLIC_*`, certifique-se de que elas estão acessíveis no cliente (isso é automático no Next.js)

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```
