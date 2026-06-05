import { NextRequest, NextResponse } from 'next/server'

const N8N = process.env.N8N_URL

export async function POST(req: NextRequest) {
  const body = await req.json()
  const res = await fetch(`${N8N}/webhook/claims/resolver`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  try { return NextResponse.json(JSON.parse(text)) } catch { return NextResponse.json({ success: false }) }
}
