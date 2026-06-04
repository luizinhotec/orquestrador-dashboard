const BASE = process.env.NEXT_PUBLIC_N8N_URL

export async function login(email: string, senha: string) {
  const res = await fetch(`${BASE}/webhook/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  })
  return res.json()
}

export async function register(nome: string, email: string, senha: string) {
  const res = await fetch(`${BASE}/webhook/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha }),
  })
  return res.json()
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export function getUsuario() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('usuario')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function salvarSessao(token: string, usuario: object) {
  localStorage.setItem('token', token)
  localStorage.setItem('usuario', JSON.stringify(usuario))
}

export function limparSessao() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
}

export function estaAutenticado(): boolean {
  return !!getToken()
}
