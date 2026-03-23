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

import { FlowingLights } from '@/components/ui/flowing-lights'

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
        value: 'contato@maiainteligencia.com',
        href: 'mailto:contato@maiainteligencia.com',
        color: 'text-[#00ffcc]',
        bg: 'bg-[#00ffcc]/10',
      },
      {
        icon: Github,
        label: 'GitHub',
        value: '@jonhmaia',
        href: 'https://github.com/jonhmaia',
        color: 'text-white',
        bg: 'bg-white/10',
      },
      {
        icon: Linkedin,
        label: 'LinkedIn',
        value: '/in/joaomarcosmaia',
        href: 'https://www.linkedin.com/in/joaomarcosmaia',
        color: 'text-[#0077b5]',
        bg: 'bg-[#0077b5]/20',
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
    <div className="relative min-h-screen pt-24 md:pt-32 pb-12 flex flex-col">
      <FlowingLights />
      <div className="container relative z-10 flex-1 animate-in fade-in duration-500 max-w-6xl mx-auto">
        <div className="bg-black/20 backdrop-blur-md shadow-2xl rounded-3xl p-8 md:p-12 border-none">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white uppercase drop-shadow-lg">{t('title')}</h1>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed font-light">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Contact Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="border-none shadow-xl bg-black/20 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-white">
                    <User className="h-5 w-5 text-[#00ffcc]" />
                    {t('info.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.label} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-black/40 transition-colors">
                      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110", info.bg)}>
                        <info.icon className={cn("h-6 w-6", info.color)} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            target={info.href.startsWith('http') ? '_blank' : undefined}
                            rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="font-semibold text-white hover:text-[#00ffcc] transition-colors flex items-center gap-1"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="font-semibold text-white">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="bg-black/20 border-none shadow-xl backdrop-blur-md">
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00ffcc]/10">
                        <Clock className="h-5 w-5 text-[#00ffcc]" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-white">{t('responseTime.title')}</p>
                        <p className="text-xs text-white/50 leading-relaxed font-light">
                          {t('responseTime.description')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-none shadow-xl backdrop-blur-md">
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffcc] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ffcc]"></span>
                        </span>
                        <span className="text-xs font-mono text-[#00ffcc] uppercase tracking-wider">Status</span>
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-white">{t('availability.title')}</p>
                        <p className="text-xs text-white/50 leading-relaxed font-light">
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
              <Card className="border-none shadow-2xl overflow-hidden relative bg-black/20 backdrop-blur-md">
                <div className="absolute top-0 right-0 p-32 bg-[#00ffcc]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <CardHeader className="relative">
                  <CardTitle className="text-2xl text-white">{t('form.title')}</CardTitle>
                  <CardDescription className="text-base text-white/50 font-light">
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
      </div>
    </div>
  )
}
