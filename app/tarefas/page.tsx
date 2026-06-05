'use client'
import { useEffect, useState } from 'react'
import { getTarefas, getProjetos, criarTarefa, moverTarefa } from '@/lib/api'
import { Plus, RefreshCw } from 'lucide-react'

const FUNIL = ['BACKLOG','ANÁLISE','DESENVOLVIMENTO','TESTES','HOMOLOGAÇÃO','PRODUÇÃO','CONCLUÍDO']

type Tarefa = { id: number; titulo: string; responsavel: string; status: string; projeto_nome: string; projeto_id: number }
type Projeto = { id: number; nome: string }

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ projeto_id: '', titulo: '', responsavel: '', descricao: '' })
  const [salvando, setSalvando] = useState(false)

  async function carregar() {
    setLoading(true)
    const [t, p] = await Promise.all([getTarefas(), getProjetos()])
    setTarefas(t.data ?? [])
    setProjetos(p.data ?? [])
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  async function salvar() {
    if (!form.projeto_id || !form.titulo || !form.responsavel) return
    setSalvando(true)
    await criarTarefa({ ...form, projeto_id: parseInt(form.projeto_id) })
    setForm({ projeto_id: '', titulo: '', responsavel: '', descricao: '' })
    setShowForm(false)
    await carregar()
    setSalvando(false)
  }

  async function mover(id: number, status: string) {
    await moverTarefa(id, status, 'dashboard')
    await carregar()
  }

  const statusColor: Record<string, string> = {
    'BACKLOG': 'bg-gray-700',
    'ANÁLISE': 'bg-blue-900',
    'DESENVOLVIMENTO': 'bg-indigo-900',
    'TESTES': 'bg-yellow-900',
    'HOMOLOGAÇÃO': 'bg-orange-900',
    'PRODUÇÃO': 'bg-purple-900',
    'CONCLUÍDO': 'bg-green-900',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <div className="flex gap-2">
          <button onClick={carregar} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400"><RefreshCw size={16} /></button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium">
            <Plus size={16} /> Nova Tarefa
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Nova Tarefa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" value={form.projeto_id} onChange={e => setForm(f => ({ ...f, projeto_id: e.target.value }))}>
              <option value="">Selecione o projeto</option>
              {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <input className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" placeholder="Título" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
            <input className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" placeholder="Responsável" value={form.responsavel} onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))} />
            <input className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" placeholder="Descrição (opcional)" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700">Cancelar</button>
            <button onClick={salvar} disabled={salvando} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {loading ? <p className="text-gray-500">Carregando...</p> : (
        <div className="space-y-3">
          {tarefas.map(t => (
            <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{t.titulo}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.responsavel} · {t.projeto_nome}</p>
              </div>
              <select
                value={t.status}
                onChange={e => mover(t.id, e.target.value)}
                className={`${statusColor[t.status] ?? 'bg-gray-800'} border border-gray-700 rounded-lg px-3 py-1.5 text-xs w-full sm:w-auto`}
              >
                {FUNIL.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
          {tarefas.length === 0 && <p className="text-gray-500 text-sm">Nenhuma tarefa cadastrada.</p>}
        </div>
      )}
    </div>
  )
}
