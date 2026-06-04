import { NextResponse } from 'next/server'

const N8N = process.env.N8N_URL

export async function proxyGet(path: string, searchParams?: URLSearchParams) {
  const qs = searchParams?.toString() ? `?${searchParams}` : ''
  const res = await fetch(`${N8N}${path}${qs}`, { cache: 'no-store' })
  const text = await res.text()
  if (!text) return NextResponse.json({ success: false, erro: 'Sem resposta' }, { status: 500 })
  try { return NextResponse.json(JSON.parse(text)) } catch { return NextResponse.json({ success: false, erro: text }, { status: 500 }) }
}

export async function proxyPost(path: string, body: unknown) {
  const res = await fetch(`${N8N}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  if (!text) return NextResponse.json({ success: false, erro: 'Sem resposta' }, { status: 500 })
  try { return NextResponse.json(JSON.parse(text)) } catch { return NextResponse.json({ success: false, erro: text }, { status: 500 }) }
}
