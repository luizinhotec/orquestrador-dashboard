import { NextResponse } from 'next/server'

const N8N = process.env.N8N_URL
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY

export async function POST() {
  if (!ANTHROPIC_KEY) {
    return NextResponse.json({ success: false, erro: 'ANTHROPIC_API_KEY não configurada no servidor' })
  }

  // 1. Buscar projetos e tarefas via n8n (já funcionando)
  const [projRes, tarefRes] = await Promise.all([
    fetch(`${N8N}/webhook/projeto/listar`, { cache: 'no-store' }),
    fetch(`${N8N}/webhook/tarefa/listar`, { cache: 'no-store' }),
  ])
  const projData = await projRes.json()
  const tarefData = await tarefRes.json()

  const projetos: { id: number; nome: string; responsavel: string; status: string; prazo: string }[] = projData.data ?? []
  const tarefas: { projeto_id: number; titulo: string; responsavel: string; status: string }[] = tarefData.data ?? []

  // 2. Montar contexto para o Claude
  const hoje = new Date().toLocaleDateString('pt-BR')
  const mapa: Record<number, { nome: string; responsavel: string; status: string; prazo: string; tarefas: string[] }> = {}
  for (const p of projetos) {
    mapa[p.id] = { nome: p.nome, responsavel: p.responsavel, status: p.status, prazo: p.prazo ?? 'sem prazo', tarefas: [] }
  }
  for (const t of tarefas) {
    mapa[t.projeto_id]?.tarefas.push(`[${t.status}] ${t.titulo} (${t.responsavel})`)
  }

  const contexto = Object.values(mapa).map(p =>
    `Projeto: ${p.nome}\nStatus: ${p.status}\nResponsável: ${p.responsavel}\nPrazo: ${p.prazo}\nTarefas:\n${p.tarefas.length ? p.tarefas.map(t => `  - ${t}`).join('\n') : '  (sem tarefas)'}`
  ).join('\n\n')

  const prompt = `Você é um assistente de gestão de projetos de software. Hoje é ${hoje}.\n\nAnalise o estado atual dos projetos abaixo e identifique ações concretas que os desenvolvedores devem tomar agora.\n\n${contexto}\n\nRetorne APENAS JSON válido (sem markdown) neste formato:\n{"analise_geral":"resumo em 2-3 frases","alertas":["alerta 1"],"acoes":[{"prioridade":"alta","responsavel":"Nome","projeto":"Nome","acao":"O que fazer"}]}`

  // 3. Chamar Claude diretamente
  const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!claudeRes.ok) {
    const err = await claudeRes.text()
    return NextResponse.json({ success: false, erro: `Anthropic API: ${claudeRes.status} — ${err}` })
  }

  const claudeData = await claudeRes.json()
  const texto = claudeData.content?.[0]?.text ?? '{}'

  let analise
  try { analise = JSON.parse(texto) } catch { analise = { analise_geral: texto, alertas: [], acoes: [] } }
  analise.gerado_em = new Date().toISOString()

  return NextResponse.json({ success: true, data: analise })
}
