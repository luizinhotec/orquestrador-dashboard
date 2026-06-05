'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, ListTodo, GitBranch, ScrollText, X } from 'lucide-react'
import UserMenu from './UserMenu'

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projetos', label: 'Projetos', icon: FolderKanban },
  { href: '/tarefas', label: 'Tarefas', icon: ListTodo },
  { href: '/funil', label: 'Funil', icon: GitBranch },
  { href: '/logs', label: 'Auditoria', icon: ScrollText },
]

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname()
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-56 bg-gray-900 border-r border-gray-800
        flex flex-col py-6 px-4 gap-1 shrink-0
        transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="mb-6 px-2 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-indigo-400">Orquestrador</span>
            <p className="text-xs text-gray-500 mt-0.5">N8N + Claude</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              path === href
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
        <UserMenu />
      </aside>
    </>
  )
}
