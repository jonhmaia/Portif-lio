import { ImageResponse } from 'next/og'

// Configuração da rota de imagem
export const runtime = 'edge'
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Gera o ícone para Apple (maior resolução)
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'monospace',
          fontWeight: 'bold',
        }}
      >
        JM
      </div>
    ),
    {
      ...size,
    }
  )
}
