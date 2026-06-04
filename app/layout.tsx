import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LayoutClient from '@/components/LayoutClient'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Orquestrador N8N',
  description: 'Plataforma de gerenciamento de projetos e equipes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
