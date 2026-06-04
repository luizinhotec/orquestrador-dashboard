import { NextRequest } from 'next/server'
import { proxyGet } from '../_proxy'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const params = new URLSearchParams()
  for (const [k, v] of searchParams.entries()) params.set(k, v)
  return proxyGet('/webhook/auditoria/logs', params)
}
