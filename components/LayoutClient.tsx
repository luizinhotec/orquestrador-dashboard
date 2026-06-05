'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import AuthGuard from './AuthGuard'

const PUBLIC_ROUTES = ['/login', '/register']

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isPublic = PUBLIC_ROUTES.includes(path)

  if (isPublic) return <>{children}</>

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white p-1"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <span className="text-sm font-bold text-indigo-400">Orquestrador</span>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
