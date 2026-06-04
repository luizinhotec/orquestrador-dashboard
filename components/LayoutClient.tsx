'use client'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import AuthGuard from './AuthGuard'

const PUBLIC_ROUTES = ['/login', '/register']

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const isPublic = PUBLIC_ROUTES.includes(path)

  if (isPublic) return <>{children}</>

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </AuthGuard>
  )
}
