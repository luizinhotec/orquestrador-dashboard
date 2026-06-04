import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Orquestrador N8N',
  description: 'Plataforma de gerenciamento de projetos e equipes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen flex`}>
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </body>
    </html>
  )
}
