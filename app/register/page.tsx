'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register, salvarSessao } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmar: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (form.senha !== form.confirmar) {
      setErro('As senhas não coincidem')
      return
    }
    setLoading(true)
    const res = await register(form.nome, form.email, form.senha)
    setLoading(false)
    if (res.success === false) {
      setErro(res.erro ?? 'Erro ao cadastrar')
      return
    }
    salvarSessao('token-temp', { nome: form.nome, email: form.email })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-indigo-400">Orquestrador</h1>
          <p className="text-gray-500 text-sm mt-1">N8N + Claude</p>
        </div>

        <form onSubmit={cadastrar} className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-5">
          <h2 className="text-lg font-semibold">Criar conta</h2>

          {erro && <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">{erro}</p>}

          <div className="space-y-1">
            <label className="text-xs text-gray-400">Nome</label>
            <input
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
            />
          </div>

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
              minLength={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              value={form.senha}
              onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400">Confirmar senha</label>
            <input
              type="password"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              value={form.confirmar}
              onChange={e => setForm(f => ({ ...f, confirmar: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </button>

          <p className="text-center text-xs text-gray-500">
            Já tem conta?{' '}
            <Link href="/login" className="text-indigo-400 hover:underline">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
