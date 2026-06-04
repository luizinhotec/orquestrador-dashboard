import { NextRequest } from 'next/server'
import { proxyGet, proxyPost } from '../_proxy'

export async function GET() {
  return proxyGet('/webhook/projeto/listar')
}

export async function POST(req: NextRequest) {
  return proxyPost('/webhook/projeto/criar', await req.json())
}
