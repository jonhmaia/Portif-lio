import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, email, whatsapp, subject, message, locale } = body

    // Basic validation
    if (!name || !email || !whatsapp || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      )
    }

    const webhookUrl = process.env.WEBHOOK_CONTACT_URL

    if (!webhookUrl) {
      console.error('WEBHOOK_CONTACT_URL environment variable is not set')
      return NextResponse.json(
        { error: 'Erro interno do servidor.' },
        { status: 500 }
      )
    }

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        whatsapp,
        subject,
        message,
        locale: locale || 'pt-BR',
      }),
    })

    if (!webhookResponse.ok) {
      console.error('Webhook responded with status:', webhookResponse.status)
      return NextResponse.json(
        { error: 'Erro ao processar a solicitação.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error in contact API route:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}
