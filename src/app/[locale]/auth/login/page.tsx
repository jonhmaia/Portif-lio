import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'
import { Code2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/navigation'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Acesse o painel administrativo',
}

export default async function LoginPage() {
  const t = await getTranslations('auth.loginPage')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Code2 className="h-7 w-7" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground text-center mt-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Back to site */}
        <div className="text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            {t('backToSite')}
          </Link>
        </div>
      </div>
    </div>
  )
}
