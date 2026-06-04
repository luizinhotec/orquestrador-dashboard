'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsuario, limparSessao } from '@/lib/auth'
import { LogOut, User } from 'lucide-react'

export default function UserMenu() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<{ nome: string; email: string } | null>(null)

  useEffect(() => { setUsuario(getUsuario()) }, [])

  function sair() {
    limparSessao()
    router.push('/login')
  }

  if (!usuario) return null

  return (
    <div className="mt-auto border-t border-gray-800 pt-4 px-2 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center shrink-0">
        <User size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{usuario.nome}</p>
        <p className="text-xs text-gray-500 truncate">{usuario.email}</p>
      </div>
      <button onClick={sair} className="text-gray-500 hover:text-red-400 transition-colors">
        <LogOut size={15} />
      </button>
    </div>
  )
}
