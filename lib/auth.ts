import Cookies from 'js-cookie'

const BASE = process.env.NEXT_PUBLIC_N8N_URL

async function safeFetch(url: string, options: RequestInit) {
  const res = await fetch(url, options)
  const text = await res.text()
  if (!text) return { success: false, erro: 'Sem resposta do servidor' }
  try { return JSON.parse(text) } catch { return { success: false, erro: text } }
}

export async function login(email: string, senha: string) {
  return safeFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  })
}

export async function register(nome: string, email: string, senha: string) {
  return safeFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha }),
  })
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
  Cookies.set('auth_token', token, { expires: 7, sameSite: 'lax' })
}

export function limparSessao() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  Cookies.remove('auth_token')
}

export function estaAutenticado(): boolean {
  return !!getToken()
}
