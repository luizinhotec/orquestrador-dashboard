import { getFunil } from '@/lib/server-api'

const ETAPAS = ['BACKLOG','ANÁLISE','DESENVOLVIMENTO','TESTES','HOMOLOGAÇÃO','PRODUÇÃO','CONCLUÍDO']

const etapaColor: Record<string, string> = {
  'BACKLOG': 'bg-gray-700 text-gray-300',
  'ANÁLISE': 'bg-blue-800 text-blue-200',
  'DESENVOLVIMENTO': 'bg-indigo-800 text-indigo-200',
  'TESTES': 'bg-yellow-800 text-yellow-200',
  'HOMOLOGAÇÃO': 'bg-orange-800 text-orange-200',
  'PRODUÇÃO': 'bg-purple-800 text-purple-200',
  'CONCLUÍDO': 'bg-green-800 text-green-200',
}

export default async function FunilPage() {
  const res = await getFunil()
  const projetos = res.data ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Funil Operacional</h1>

      {projetos.length === 0 ? (
        <p className="text-gray-500">Nenhum projeto com tarefas.</p>
      ) : (
        projetos.map((p: { projeto_id: number; projeto: string; etapas: Record<string, number> }) => (
          <div key={p.projeto_id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="font-semibold mb-4">{p.projeto}</h2>
            <div className="grid grid-cols-4 xl:grid-cols-7 gap-3">
              {ETAPAS.map(etapa => (
                <div key={etapa} className={`${etapaColor[etapa]} rounded-lg p-3 text-center`}>
                  <p className="text-2xl font-bold">{p.etapas[etapa] ?? 0}</p>
                  <p className="text-xs mt-1 leading-tight">{etapa}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
