'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Github, Linkedin, Mail, MapPin, Send, Loader2, MessageSquare, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useLocale, useTranslations } from 'next-intl'

function createContactSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t('nameMin')),
    email: z.string().email(t('emailInvalid')),
    whatsapp: z.string().min(10, t('whatsappMin')),
  })
}

type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const locale = useLocale()
  const t = useTranslations('contact')
  const tVal = useTranslations('validation.contact')

  const contactSchema = useMemo(() => createContactSchema(tVal), [locale, tVal])

  const contactInfo = useMemo(
    () => [
      {
        icon: Mail,
        label: t('info.email'),
        value: 'contato@joaomarcos.dev',
        href: 'mailto:contato@joaomarcos.dev',
      },
      {
        icon: Github,
        label: 'GitHub',
        value: '@jonhmaia',
        href: 'https://github.com/jonhmaia',
      },
      {
        icon: Linkedin,
        label: 'LinkedIn',
        value: '/in/joaomarcosmaia',
        href: 'https://www.linkedin.com/in/joaomarcosmaia',
      },
      {
        icon: MapPin,
        label: t('info.location'),
        value: t('info.locationValue'),
        href: null,
      },
    ],
    [t]
  )

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      whatsapp: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('https://n8n.maiainteligencia.cloud/webhook/f3f13315-af7f-4c0d-874d-e619f308e028', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar formulário')
      }

      toast.success(t('toast.success'))
      form.reset()
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(t('toast.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-12 md:py-16">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground text-lg">
          {t('subtitle')}
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {t('info.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="font-medium">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Response Time */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Clock className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">{t('responseTime.title')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('responseTime.description')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">{t('availability.title')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('availability.description')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{t('form.title')}</CardTitle>
              <CardDescription>
                {t('form.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('form.nameLabel')}</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder={t('form.namePlaceholder')}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('form.emailLabel')}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder={t('form.emailPlaceholder')}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">{t('form.whatsappLabel')}</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    {...form.register('whatsapp')}
                    placeholder={t('form.whatsappPlaceholder')}
                  />
                  {form.formState.errors.whatsapp && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.whatsapp.message}
                    </p>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t('form.submit')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
