'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Github, Linkedin, Mail, MapPin, Send, Loader2, MessageSquare, Clock, Phone, User, FileText, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

function createContactSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t('nameMin')),
    email: z.string().email(t('emailInvalid')),
    whatsapp: z.string().min(10, t('whatsappMin')),
    subject: z.string().min(5, t('subjectMin')),
    message: z.string().min(10, t('messageMin')),
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
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
      },
      {
        icon: Github,
        label: 'GitHub',
        value: '@jonhmaia',
        href: 'https://github.com/jonhmaia',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
      },
      {
        icon: Linkedin,
        label: 'LinkedIn',
        value: '/in/joaomarcosmaia',
        href: 'https://www.linkedin.com/in/joaomarcosmaia',
        color: 'text-blue-700',
        bg: 'bg-blue-700/10',
      },
      {
        icon: MapPin,
        label: t('info.location'),
        value: t('info.locationValue'),
        href: null,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
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
      subject: '',
      message: '',
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
          subject: data.subject,
          message: data.message,
          locale: locale,
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
    <div className="container py-12 md:py-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-16">
        <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-primary/10 text-primary">
          <MessageSquare className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium font-mono uppercase tracking-wider">Get in Touch</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5 text-primary" />
                {t('info.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110", info.bg)}>
                    <info.icon className={cn("h-6 w-6", info.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="font-semibold text-foreground">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <Clock className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{t('responseTime.title')}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t('responseTime.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-mono text-green-500 uppercase tracking-wider">Status</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{t('availability.title')}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t('availability.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <Card className="border-border/50 shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
             <div className="absolute bottom-0 left-0 p-32 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
             
            <CardHeader className="relative">
              <CardTitle className="text-2xl">{t('form.title')}</CardTitle>
              <CardDescription className="text-base">
                {t('form.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">{t('form.nameLabel')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        className="pl-9 bg-background/50"
                        {...form.register('name')}
                        placeholder={t('form.namePlaceholder')}
                      />
                    </div>
                    {form.formState.errors.name && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-sm font-medium">{t('form.whatsappLabel')}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="whatsapp"
                        type="tel"
                        className="pl-9 bg-background/50"
                        {...form.register('whatsapp')}
                        placeholder={t('form.whatsappPlaceholder')}
                      />
                    </div>
                    {form.formState.errors.whatsapp && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                         <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                        {form.formState.errors.whatsapp.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">{t('form.emailLabel')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-9 bg-background/50"
                      {...form.register('email')}
                      placeholder={t('form.emailPlaceholder')}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                       <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">{t('form.subjectLabel')}</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="subject"
                      className="pl-9 bg-background/50"
                      {...form.register('subject')}
                      placeholder={t('form.subjectPlaceholder')}
                    />
                  </div>
                  {form.formState.errors.subject && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                       <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                      {form.formState.errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">{t('form.messageLabel')}</Label>
                  <Textarea
                    id="message"
                    className="min-h-[120px] bg-background/50 resize-y"
                    {...form.register('message')}
                    placeholder={t('form.messagePlaceholder')}
                  />
                  {form.formState.errors.message && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                       <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-lg hover:shadow-primary/20" 
                  disabled={isSubmitting}
                >
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
