import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const res = await fetch(`${process.env.N8N_URL}/webhook/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  if (!text) return NextResponse.json({ success: false, erro: 'Sem resposta do servidor' }, { status: 500 })
  try {
    return NextResponse.json(JSON.parse(text))
  } catch {
    return NextResponse.json({ success: false, erro: text }, { status: 500 })
  }
}
