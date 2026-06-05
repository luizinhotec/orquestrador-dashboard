'use client'
import { useState, useEffect } from 'react'
import { Sparkles, RefreshCw, AlertTriangle, ArrowRight, Loader2, Lock, CheckCircle2, User } from 'lucide-react'
import { getUsuario } from '@/lib/auth'

type Projeto = { id: number; nome: string }
type Acao = { prioridade: 'alta' | 'media' | 'baixa'; responsavel: string; projeto: string; acao: string }
type Analise = { analise_geral: string; alertas: string[]; acoes: Acao[]; gerado_em?: string }
type Claim = { id: number; projeto_id: number; acao: string; responsavel: string; created_at: string }

const prioridadeStyle: Record<string, string> = {
  alta:  'bg-red-900/40 border-red-700 text-red-300',
  media: 'bg-yellow-900/40 border-yellow-700 text-yellow-300',
  baixa: 'bg-blue-900/40 border-blue-700 text-blue-300',
}

export default function AnaliseWidget({ projetos }: { projetos: Projeto[] }) {
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null)
  const [analise, setAnalise] = useState<Analise | null>(null)
  const [claims, setClaims] = useState<Claim[]>([])
  const [carregando, setCarregando] = useState(false)
  const [claimando, setClaimando] = useState<string | null>(null)
  const [erro, setErro] = useState('')
  const [usuario, setUsuario] = useState<{ nome: string; email: string } | null>(null)

  useEffect(() => { setUsuario(getUsuario()) }, [])

  async function carregarClaims(projeto_id: number) {
    const res = await fetch(`/api/ia/claims?projeto_id=${projeto_id}`)
    const json = await res.json()
    setClaims(json.data ?? [])
  }

  async function analisar() {
    if (!selectedProjeto) return
    setCarregando(true)
    setErro('')
    setAnalise(null)
    try {
      const [anaRes, claimRes] = await Promise.all([
        fetch('/api/ia/analisar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projeto_id: selectedProjeto.id }),
        }),
        fetch(`/api/ia/claims?projeto_id=${selectedProjeto.id}`),
      ])
      const anaJson = await anaRes.json()
      const claimJson = await claimRes.json()
      if (anaJson.success && anaJson.data) setAnalise(anaJson.data)
      else setErro(anaJson.erro ?? 'Erro ao gerar análise.')
      setClaims(claimJson.data ?? [])
    } catch {
      setErro('Erro de conexão.')
    }
    setCarregando(false)
  }

  async function assumir(acao: string) {
    if (!selectedProjeto || !usuario) return
    setClaimando(acao)
    try {
      await fetch('/api/ia/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projeto_id:   selectedProjeto.id,
          projeto_nome: selectedProjeto.nome,
          acao,
          responsavel:  usuario.nome,
          usuario:      usuario.nome,
        }),
      })
      await carregarClaims(selectedProjeto.id)
    } catch { /* silently fail */ }
    setClaimando(null)
  }

  async function resolver(claim: Claim) {
    if (!usuario) return
    setClaimando(String(claim.id))
    try {
      await fetch('/api/ia/claims/resolver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: claim.id, usuario: usuario.nome }),
      })
      await carregarClaims(claim.projeto_id)
    } catch { /* silently fail */ }
    setClaimando(null)
  }

  function getClaimForAcao(acao: string): Claim | undefined {
    return claims.find(c => c.acao === acao)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
      <h2 className="font-semibold flex items-center gap-2">
        <Sparkles size={16} className="text-indigo-400" />
        Análise IA — Ações Recomendadas
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedProjeto?.id ?? ''}
          onChange={e => {
            const p = projetos.find(p => p.id === parseInt(e.target.value))
            setSelectedProjeto(p ?? null)
            setAnalise(null)
            setClaims([])
            setErro('')
          }}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Selecione um projeto para analisar...</option>
          {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <button
          onClick={analisar}
          disabled={!selectedProjeto || carregando}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {carregando
            ? <><Loader2 size={14} className="animate-spin" /> Analisando...</>
            : <><RefreshCw size={14} /> Analisar</>}
        </button>
      </div>

      {erro && (
        <p className="text-red-400 text-xs bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">{erro}</p>
      )}

      {!selectedProjeto && !carregando && (
        <p className="text-gray-500 text-sm">Selecione um projeto para a IA analisar e recomendar ações. Cada ação pode ser assumida por um dev — enquanto estiver em andamento, ninguém mais pode pegar a mesma.</p>
      )}

      {carregando && (
        <div className="flex items-center gap-3 text-gray-400 text-sm py-4">
          <Loader2 size={18} className="animate-spin text-indigo-400" />
          A IA está analisando o projeto e as tarefas...
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
              {analise.acoes.map((a, i) => {
                const claim = getClaimForAcao(a.acao)
                const isMineClaim  = claim && claim.responsavel === usuario?.nome
                const isOtherClaim = claim && !isMineClaim
                return (
                  <div key={i} className={`border rounded-lg px-4 py-3 space-y-2 ${prioridadeStyle[a.prioridade] ?? 'bg-gray-800 border-gray-700'}`}>
                    <div className="flex items-center gap-2 text-xs font-medium flex-wrap">
                      <span className="uppercase tracking-wider opacity-70">{a.prioridade}</span>
                      <ArrowRight size={10} />
                      <span>{a.responsavel}</span>
                      <span className="opacity-50">·</span>
                      <span className="opacity-70">{a.projeto}</span>
                    </div>
                    <p className="text-sm">{a.acao}</p>
                    <div className="pt-1">
                      {isOtherClaim && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-800/60 rounded-md px-2 py-1">
                          <Lock size={11} />
                          Em andamento por <strong className="ml-0.5">{claim.responsavel}</strong>
                        </span>
                      )}
                      {isMineClaim && (
                        <button
                          onClick={() => resolver(claim)}
                          disabled={claimando === String(claim.id)}
                          className="inline-flex items-center gap-1.5 text-xs bg-green-800/60 hover:bg-green-700/60 text-green-300 rounded-md px-2 py-1 transition-colors disabled:opacity-50"
                        >
                          {claimando === String(claim.id)
                            ? <Loader2 size={11} className="animate-spin" />
                            : <CheckCircle2 size={11} />}
                          Marcar como concluído
                        </button>
                      )}
                      {!claim && (
                        <button
                          onClick={() => assumir(a.acao)}
                          disabled={!!claimando}
                          className="inline-flex items-center gap-1.5 text-xs bg-indigo-800/60 hover:bg-indigo-700/60 text-indigo-300 rounded-md px-2 py-1 transition-colors disabled:opacity-50"
                        >
                          {claimando === a.acao
                            ? <Loader2 size={11} className="animate-spin" />
                            : <User size={11} />}
                          Assumir
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
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
