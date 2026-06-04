const BASE = process.env.NEXT_PUBLIC_N8N_URL

export async function getDashboard() {
  const res = await fetch(`${BASE}/webhook/dashboard`, { cache: 'no-store' })
  return res.json()
}

export async function getProjetos() {
  const res = await fetch(`${BASE}/webhook/projeto/listar`, { cache: 'no-store' })
  return res.json()
}

export async function criarProjeto(data: {
  nome: string
  responsavel: string
  data_inicio: string
  prazo: string
}) {
  const res = await fetch(`${BASE}/webhook/projeto/criar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function atualizarStatusProjeto(id: number, status: string, usuario: string) {
  const res = await fetch(`${BASE}/webhook/projeto/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status, usuario }),
  })
  return res.json()
}

export async function getTarefas(projeto_id?: number) {
  const url = projeto_id
    ? `${BASE}/webhook/tarefa/listar?projeto_id=${projeto_id}`
    : `${BASE}/webhook/tarefa/listar`
  const res = await fetch(url, { cache: 'no-store' })
  return res.json()
}

export async function criarTarefa(data: {
  projeto_id: number
  titulo: string
  responsavel: string
  descricao?: string
}) {
  const res = await fetch(`${BASE}/webhook/tarefa/criar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function moverTarefa(id: number, status: string, usuario: string) {
  const res = await fetch(`${BASE}/webhook/tarefa/mover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status, usuario }),
  })
  return res.json()
}

export async function getFunil() {
  const res = await fetch(`${BASE}/webhook/funil/status`, { cache: 'no-store' })
  return res.json()
}

export async function getLogs(params?: { entidade?: string; entidade_id?: number; usuario?: string }) {
  const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
  const res = await fetch(`${BASE}/webhook/auditoria/logs${qs}`, { cache: 'no-store' })
  return res.json()
}
