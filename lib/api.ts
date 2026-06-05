async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(path, { cache: 'no-store', ...options })
  return res.json()
}

export async function getDashboard() {
  return apiFetch('/api/dashboard')
}

export async function getProjetos() {
  return apiFetch('/api/projetos')
}

export async function criarProjeto(data: {
  nome: string
  responsavel: string
  data_inicio: string
  prazo: string
}) {
  return apiFetch('/api/projetos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function atualizarStatusProjeto(id: number, status: string, usuario: string) {
  return apiFetch('/api/projetos/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status, usuario }),
  })
}

export async function getTarefas(projeto_id?: number) {
  const qs = projeto_id ? `?projeto_id=${projeto_id}` : ''
  return apiFetch(`/api/tarefas${qs}`)
}

export async function criarTarefa(data: {
  projeto_id: number
  titulo: string
  responsavel: string
  descricao?: string
}) {
  return apiFetch('/api/tarefas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function moverTarefa(id: number, status: string, usuario: string) {
  return apiFetch('/api/tarefas/mover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status, usuario }),
  })
}

export async function getFunil() {
  return apiFetch('/api/funil')
}

export async function getLogs(params?: { entidade?: string; entidade_id?: number; usuario?: string }) {
  const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
  return apiFetch(`/api/logs${qs}`)
}

export async function getAnalise() {
  return apiFetch('/api/ia/analise')
}
