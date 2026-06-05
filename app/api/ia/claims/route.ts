import { NextRequest, NextResponse } from 'next/server'

const N8N = process.env.N8N_URL

export async function GET(req: NextRequest) {
  const projeto_id = req.nextUrl.searchParams.get('projeto_id') ?? '0'
  const res = await fetch(`${N8N}/webhook/claims/listar?projeto_id=${projeto_id}`, { cache: 'no-store' })
  const text = await res.text()
  try { return NextResponse.json(JSON.parse(text)) } catch { return NextResponse.json({ success: false, data: [] }) }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const res = await fetch(`${N8N}/webhook/claims/criar`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  try { return NextResponse.json(JSON.parse(text)) } catch { return NextResponse.json({ success: false }) }
}
