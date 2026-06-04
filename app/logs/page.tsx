import { getLogs } from '@/lib/api'

type Log = { id: number; usuario: string; acao: string; entidade: string; entidade_id: number; detalhe: string; created_at: string }

const acaoColor: Record<string, string> = {
  'CRIOU_PROJETO': 'text-indigo-400',
  'ATUALIZOU_STATUS': 'text-yellow-400',
  'CRIOU_TAREFA': 'text-blue-400',
  'MOVEU_TAREFA': 'text-purple-400',
}

export default async function LogsPage() {
  const res = await getLogs()
  const logs: Log[] = res.data ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Auditoria</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-left">
              <th className="px-5 py-3">Data/Hora</th>
              <th className="px-5 py-3">Usuário</th>
              <th className="px-5 py-3">Ação</th>
              <th className="px-5 py-3">Entidade</th>
              <th className="px-5 py-3">Detalhe</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString('pt-BR')}
                </td>
                <td className="px-5 py-3">{log.usuario}</td>
                <td className={`px-5 py-3 font-mono text-xs ${acaoColor[log.acao] ?? 'text-gray-300'}`}>{log.acao}</td>
                <td className="px-5 py-3 text-gray-400 text-xs">{log.entidade} #{log.entidade_id}</td>
                <td className="px-5 py-3 text-gray-500 text-xs font-mono truncate max-w-xs">{log.detalhe}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500">Nenhum log registrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
