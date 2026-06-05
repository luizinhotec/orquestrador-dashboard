# Dashboard

**Summary**: Frontend do orquestrador, rotas, como interagir com os webhooks N8N.
**Sources**: a definir (HTML estático servido pelo Nginx)
**Last updated**: 2026-06-04

## Stack

- HTML + CSS (Tailwind via CDN) + JavaScript vanilla
- Servido pelo Nginx já existente na VPS
- Comunicação com N8N via `fetch()` para os webhooks

## Páginas Planejadas

| Página | Rota | Função |
|--------|------|--------|
| Projetos | /projetos | Listar, criar, atualizar status |
| Tarefas | /tarefas | Listar por projeto, mover no funil |
| Dashboard | / | Indicadores, resumo geral |
| Logs | /logs | Histórico de ações |

## Exemplo de Chamada ao N8N

```javascript
async function criarProjeto(dados) {
  const res = await fetch('http://185.135.137.113:5678/webhook/projeto/criar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  return res.json();
}
```

## Status

⏳ Pendente — aguarda Fase 1 do N8N estar funcional

## Links

- [[workflows]] — endpoints disponíveis
- [[arquitetura]] — Nginx e portas
