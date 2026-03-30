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
      console.error('[Contact API] WEBHOOK_CONTACT_URL environment variable is not set')
      return NextResponse.json(
        { error: 'Erro interno do servidor.' },
        { status: 500 }
      )
    }

    console.log('[Contact API] Sending request to webhook...')

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

    const responseText = await webhookResponse.text()
    console.log('[Contact API] Webhook status:', webhookResponse.status)
    console.log('[Contact API] Webhook response:', responseText)

    // n8n webhooks may return various status codes, accept any 2xx or even
    // responses that contain valid data regardless of status
    if (webhookResponse.ok) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Some n8n webhook nodes return non-standard codes but still process
    console.error('[Contact API] Webhook responded with status:', webhookResponse.status, responseText)
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação.' },
      { status: 502 }
    )
  } catch (error) {
    console.error('[Contact API] Error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}
