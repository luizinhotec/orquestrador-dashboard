# Workflows N8N

**Summary**: Todos os workflows ativos no N8N, seus webhooks e status de implementação.
**Sources**: N8N em http://185.135.137.113:5678, pasta workflows/ no repo
**Last updated**: 2026-06-04

## Convenção de Nomenclatura

- Arquivo JSON: `workflows/<fase>-<nome>.json`
- Webhook path: `/webhook/<entidade>/<acao>`

## Fase 1 — Gestão de Projetos

| Workflow | Webhook | Arquivo | Status |
|----------|---------|---------|--------|
| Criar Projeto | POST /webhook/projeto/criar | workflows/fase1-criar-projeto.json | ✅ Ativo |
| Listar Projetos | GET /webhook/projeto/listar | workflows/fase1-listar-projetos.json | ✅ Ativo |
| Atualizar Status | POST /webhook/projeto/status | workflows/fase1-atualizar-status.json | ✅ Ativo |

## Fase 2 — Gestão de Tarefas

| Workflow | Webhook | Arquivo | Status |
|----------|---------|---------|--------|
| Criar Tarefa | POST /webhook/tarefa/criar | workflows/fase2-criar-tarefa.json | ✅ Ativo |
| Listar Tarefas | GET /webhook/tarefa/listar | workflows/fase2-listar-tarefas.json | ✅ Ativo |
| Mover Tarefa no Funil | POST /webhook/tarefa/mover | workflows/fase2-mover-tarefa.json | ✅ Ativo |

## Fase 3 — Funil Operacional

| Workflow | Webhook | Arquivo | Status |
|----------|---------|---------|--------|
| Status do Funil | GET /webhook/funil/status | workflows/fase3-funil.json | ⚠️ Reimportar — versão anterior com encoding quebrado |

> **Ação necessária:** no n8n, excluir o workflow "Funil" existente e importar `workflows/fase3-funil.json`.
> O encoding das etapas acentuadas (ANÁLISE, HOMOLOGAÇÃO, PRODUÇÃO, CONCLUÍDO) estava corrompido.

## Fluxo Padrão de Todo Workflow

```
Webhook Trigger
    ↓
Validar campos obrigatórios
    ↓
Executar ação no PostgreSQL
    ↓
Registrar em logs
    ↓
(Opcional) Notificar responsável
    ↓
Retornar JSON { success, data }
```

## Auth

| Workflow | Webhook | Arquivo | Status |
|----------|---------|---------|--------|
| Login | POST /webhook/auth/login | workflows/auth-login.json | ❌ Não importado no n8n |
| Register | POST /webhook/auth/register | workflows/auth-register.json | ❌ Não importado no n8n |

> **Ação necessária antes de importar:**
> 1. Executar migration `raw/migrations/001-add-auth-columns.sql` no banco
> 2. Importar `auth-login.json` e `auth-register.json` no n8n e ativar

## Fase 6 — Análise IA

| Workflow | Webhook | Arquivo | Status |
|----------|---------|---------|--------|
| Analisar Projetos | POST /webhook/ia/analisar | workflows/fase6-analise-ia.json | ⚠️ Importar no n8n |
| Buscar Última Análise | GET /webhook/ia/analise | workflows/fase6-analise-buscar.json | ⚠️ Importar no n8n |

> **Pré-requisito:** variável `ANTHROPIC_API_KEY` configurada no ambiente do n8n.
> No docker-compose: adicionar `ANTHROPIC_API_KEY=sk-ant-...` em `environment` do serviço `n8n-orq`.
> Executar `raw/migrations/002-add-analises-table.sql` antes de ativar.

## Links

- [[banco]] — tabelas que os workflows escrevem
- [[dashboard]] — como o dashboard chama os webhooks
