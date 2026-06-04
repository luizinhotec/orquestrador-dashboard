import { NextRequest } from 'next/server'
import { proxyPost } from '../../_proxy'

export async function POST(req: NextRequest) {
  return proxyPost('/webhook/projeto/status', await req.json())
}
