import { getDashboard } from '@/lib/api'
import { FolderOpen, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react'

export default async function Home() {
  const res = await getDashboard()
  const { indicadores, produtividade, tarefas_por_status } = res.data ?? {}

  const cards = [
    { label: 'Projetos Ativos', value: indicadores?.projetos_ativos ?? 0, icon: FolderOpen, color: 'text-indigo-400' },
    { label: 'Projetos Concluídos', value: indicadores?.projetos_concluidos ?? 0, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Tarefas em Aberto', value: indicadores?.tarefas_abertas ?? 0, icon: Clock, color: 'text-yellow-400' },
    { label: 'Tarefas Concluídas', value: indicadores?.tarefas_concluidas ?? 0, icon: CheckCircle, color: 'text-green-400' },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Executivo</h1>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <Icon className={`${color} shrink-0`} size={28} />
            <div>
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Users size={16} /> Produtividade por Responsável</h2>
          {produtividade?.length ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-left border-b border-gray-800">
                  <th className="pb-2">Responsável</th>
                  <th className="pb-2 text-right">Total</th>
                  <th className="pb-2 text-right">Concluídas</th>
                </tr>
              </thead>
              <tbody>
                {produtividade.map((p: { responsavel: string; total: number; concluidas: number }) => (
                  <tr key={p.responsavel} className="border-b border-gray-800/50">
                    <td className="py-2">{p.responsavel}</td>
                    <td className="py-2 text-right">{p.total}</td>
                    <td className="py-2 text-right text-green-400">{p.concluidas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm">Nenhuma tarefa registrada.</p>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><AlertTriangle size={16} /> Tarefas por Etapa</h2>
          {tarefas_por_status?.length ? (
            <div className="space-y-3">
              {tarefas_por_status.map((t: { status: string; total: number }) => (
                <div key={t.status} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-36 shrink-0">{t.status}</span>
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (t.total / Math.max(indicadores?.tarefas_abertas ?? 1, 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono w-4 text-right">{t.total}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhuma tarefa registrada.</p>
          )}
        </div>
      </div>
    </div>
  )
}
