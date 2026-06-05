'use client'
import { useState } from 'react'
import { Sparkles, RefreshCw, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react'

type Acao = { prioridade: 'alta' | 'media' | 'baixa'; responsavel: string; projeto: string; acao: string }

type Analise = {
  analise_geral: string
  alertas: string[]
  acoes: Acao[]
  gerado_em?: string
}

const prioridadeStyle: Record<string, string> = {
  alta:  'bg-red-900/40 border-red-700 text-red-300',
  media: 'bg-yellow-900/40 border-yellow-700 text-yellow-300',
  baixa: 'bg-blue-900/40 border-blue-700 text-blue-300',
}

export default function AnaliseWidget({ inicial }: { inicial: Analise | null }) {
  const [analise, setAnalise] = useState<Analise | null>(inicial)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function analisar() {
    setCarregando(true)
    setErro('')
    try {
      const res = await fetch('/api/ia/analisar', { method: 'POST' })
      const json = await res.json()
      if (json.success && json.data) setAnalise(json.data)
      else setErro('Erro ao gerar análise. Verifique se a chave da API está configurada no n8n.')
    } catch {
      setErro('Erro de conexão ao gerar análise.')
    }
    setCarregando(false)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-semibold flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-400" />
          Análise IA — Ações Recomendadas
        </h2>
        <button
          onClick={analisar}
          disabled={carregando}
          className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {carregando
            ? <><Loader2 size={13} className="animate-spin" /> Analisando...</>
            : <><RefreshCw size={13} /> Analisar agora</>}
        </button>
      </div>

      {erro && (
        <p className="text-red-400 text-xs bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">{erro}</p>
      )}

      {!analise && !carregando && (
        <p className="text-gray-500 text-sm">Nenhuma análise realizada. Clique em "Analisar agora" para a IA avaliar os projetos.</p>
      )}

      {carregando && (
        <div className="flex items-center gap-3 text-gray-400 text-sm py-4">
          <Loader2 size={18} className="animate-spin text-indigo-400" />
          A IA está analisando os projetos e tarefas...
        </div>
      )}

      {analise && !carregando && (
        <div className="space-y-4">
          {analise.analise_geral && (
            <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-indigo-600 pl-3">
              {analise.analise_geral}
            </p>
          )}

          {analise.alertas?.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Alertas</p>
              {analise.alertas.map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-yellow-300">
                  <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                  {a}
                </div>
              ))}
            </div>
          )}

          {analise.acoes?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Ações Recomendadas</p>
              {analise.acoes.map((a, i) => (
                <div key={i} className={`border rounded-lg px-4 py-3 space-y-1 ${prioridadeStyle[a.prioridade] ?? 'bg-gray-800 border-gray-700'}`}>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="uppercase tracking-wider opacity-70">{a.prioridade}</span>
                    <ArrowRight size={10} />
                    <span>{a.responsavel}</span>
                    <span className="opacity-50">·</span>
                    <span className="opacity-70">{a.projeto}</span>
                  </div>
                  <p className="text-sm">{a.acao}</p>
                </div>
              ))}
            </div>
          )}

          {analise.gerado_em && (
            <p className="text-xs text-gray-600 text-right">
              Gerado em {new Date(analise.gerado_em).toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
