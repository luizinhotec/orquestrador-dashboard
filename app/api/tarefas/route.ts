import { NextRequest } from 'next/server'
import { proxyGet, proxyPost } from '../_proxy'

export async function GET(req: NextRequest) {
  const projeto_id = req.nextUrl.searchParams.get('projeto_id')
  const params = new URLSearchParams()
  if (projeto_id) params.set('projeto_id', projeto_id)
  return proxyGet('/webhook/tarefa/listar', params)
}

export async function POST(req: NextRequest) {
  return proxyPost('/webhook/tarefa/criar', await req.json())
}
