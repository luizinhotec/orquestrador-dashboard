'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, ListTodo, GitBranch, ScrollText } from 'lucide-react'

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projetos', label: 'Projetos', icon: FolderKanban },
  { href: '/tarefas', label: 'Tarefas', icon: ListTodo },
  { href: '/funil', label: 'Funil', icon: GitBranch },
  { href: '/logs', label: 'Auditoria', icon: ScrollText },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col py-6 px-4 gap-1 shrink-0">
      <div className="mb-6 px-2">
        <span className="text-lg font-bold text-indigo-400">Orquestrador</span>
        <p className="text-xs text-gray-500 mt-0.5">N8N + Claude</p>
      </div>
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
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
    </aside>
  )
}
