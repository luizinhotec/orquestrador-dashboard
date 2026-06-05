@AGENTS.md

# Contexto do Projeto — Orquestrador Dashboard

Wiki interna para agentes Claude. Leia `docs/index.md` para o mapa completo antes de abrir arquivos avulsos.

## Estrutura do Repositorio

```
app/                 <- Next.js pages e API routes
components/          <- Componentes React
lib/                 <- Utilitarios e clientes de API
n8n/
  workflows/         <- JSONs exportados do n8n (importaveis)
  migrations/        <- Scripts SQL do postgres-orq
  infra/             <- Referencia de infraestrutura Docker
docs/                <- Documentacao tecnica (arquitetura, banco, workflows, log)
```

## Infraestrutura

- VPS: Contabo 185.135.137.113
- N8N: http://185.135.137.113:5678
- Metabase: http://185.135.137.113:3000
- Banco: postgres-orq, banco orquestrador, usuario orq

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend/API | Next.js (App Router) |
| Orquestracao | N8N 2.23.3 |
| Banco de dados | PostgreSQL (container postgres-orq) |
| Dashboard analitico | Metabase |
| Agent model | Claude Haiku (rotineiro) / Sonnet (decisoes complexas) |

## Variaveis de Ambiente

- N8N_URL : URL interna do n8n (server components e API routes)
- NEXT_PUBLIC_N8N_URL : URL publica do n8n (client components)
- ANTHROPIC_API_KEY : API da Anthropic (usada em app/api/ia/)

## Convencoes

- Idioma: pt-BR para docs e commits; ingles para variaveis e funcoes
- Commits: pt-BR, prefixo feat: / fix: / docs: / workflow:
- Ao alterar qualquer coisa, atualize docs/ correspondente E docs/log.md no mesmo commit
