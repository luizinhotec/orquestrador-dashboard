'use client'
import { useEffect, useState } from 'react'
import { getProjetos, criarProjeto, atualizarStatusProjeto } from '@/lib/api'
import { Plus, RefreshCw } from 'lucide-react'

const FUNIL = ['BACKLOG','ANÁLISE','DESENVOLVIMENTO','TESTES','HOMOLOGAÇÃO','PRODUÇÃO','CONCLUÍDO']

type Projeto = {
  id: number
  nome: string
  responsavel: string
  status: string
  data_inicio: string
  prazo: string
}

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome: '', responsavel: '', data_inicio: '', prazo: '' })
  const [salvando, setSalvando] = useState(false)

  async function carregar() {
    setLoading(true)
    const res = await getProjetos()
    setProjetos(res.data ?? [])
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  async function salvar() {
    if (!form.nome || !form.responsavel || !form.data_inicio || !form.prazo) return
    setSalvando(true)
    await criarProjeto(form)
    setForm({ nome: '', responsavel: '', data_inicio: '', prazo: '' })
    setShowForm(false)
    await carregar()
    setSalvando(false)
  }

  async function moverStatus(id: number, status: string) {
    await atualizarStatusProjeto(id, status, 'dashboard')
    await carregar()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projetos</h1>
        <div className="flex gap-2">
          <button onClick={carregar} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium">
            <Plus size={16} /> Novo Projeto
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Novo Projeto</h2>
          <div className="grid grid-cols-2 gap-4">
            <input className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" placeholder="Nome do projeto" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
            <input className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" placeholder="Responsável" value={form.responsavel} onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))} />
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Data de início</label>
              <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" value={form.data_inicio} onChange={e => setForm(f => ({ ...f, data_inicio: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Prazo</label>
              <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" value={form.prazo} onChange={e => setForm(f => ({ ...f, prazo: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700">Cancelar</button>
            <button onClick={salvar} disabled={salvando} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {projetos.map(p => (
            <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.nome}</p>
                <p className="text-xs text-gray-400 mt-0.5">{p.responsavel} · prazo {p.prazo ? new Date(p.prazo).toLocaleDateString('pt-BR') : '-'}</p>
              </div>
              <select
                value={p.status}
                onChange={e => moverStatus(p.id, e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs"
              >
                {FUNIL.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
          {projetos.length === 0 && <p className="text-gray-500 text-sm">Nenhum projeto cadastrado.</p>}
        </div>
      )}
    </div>
  )
}
