import { ImageResponse } from 'next/og'

// Configuração da rota de imagem
export const runtime = 'edge'
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Gera o ícone para modo claro
export default function IconLight() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
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
