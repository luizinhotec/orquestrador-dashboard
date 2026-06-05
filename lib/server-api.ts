// Chamadas diretas ao n8n — usar APENAS em server components (sem 'use client')
// Server components não têm CORS e precisam de URL absoluta.
const N8N = process.env.N8N_URL

async function n8nGet(path: string) {
  const res = await fetch(`${N8N}${path}`, { cache: 'no-store' })
  const text = await res.text()
  if (!text) return { success: false, data: null }
  try { return JSON.parse(text) } catch { return { success: false, data: null } }
}

export async function getDashboard() {
  return n8nGet('/webhook/dashboard')
}

export async function getFunil() {
  return n8nGet('/webhook/funil/status')
}

export async function getLogs(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return n8nGet(`/webhook/auditoria/logs${qs}`)
}

export async function getAnalise() {
  return n8nGet('/webhook/ia/analise')
}
