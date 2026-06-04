'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login, salvarSessao } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const res = await login(form.email, form.senha)
    setLoading(false)
    if (res.success === false) {
      setErro(res.erro ?? 'Erro ao fazer login')
      return
    }
    salvarSessao(res.token, res.usuario)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-indigo-400">Orquestrador</h1>
          <p className="text-gray-500 text-sm mt-1">N8N + Claude</p>
        </div>

        <form onSubmit={entrar} className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-5">
          <h2 className="text-lg font-semibold">Entrar</h2>

          {erro && <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">{erro}</p>}

          <div className="space-y-1">
            <label className="text-xs text-gray-400">Email</label>
            <input
              type="email"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400">Senha</label>
            <input
              type="password"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              value={form.senha}
              onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="text-center text-xs text-gray-500">
            Não tem conta?{' '}
            <Link href="/register" className="text-indigo-400 hover:underline">Cadastrar</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
