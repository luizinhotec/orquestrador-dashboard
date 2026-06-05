# Log de Mudanças

**Summary**: Histórico cronológico de todas as mudanças relevantes no projeto.
**Last updated**: 2026-06-05

---

## 2026-06-05

### Migracao do repositorio orquestrador-n8n para orquestrador-dashboard
- Workflows, migrations e documentacao consolidados neste repositorio
- Estrutura criada: n8n/workflows/, n8n/migrations/, n8n/infra/, docs/
- CLAUDE.md expandido com contexto completo do projeto
- .env.example criado com todas as variaveis de ambiente
- Repo orquestrador-n8n arquivado (read-only) no GitHub
- TODO pendente: versionar docker-compose.yml da VPS em n8n/infra/

---

## 2026-06-04

### Estrutura inicial do projeto
- Repositório criado: https://github.com/luizinhotec/orquestrador-n8n
- Wiki base criada: index, arquitetura, banco, workflows, dashboard
- Infraestrutura validada: postgres-orq, n8n-orq, metabase-orq operacionais
- Campos do projeto definidos: nome, responsavel, data_inicio, prazo, status
- Próximo passo: implementar workflow Fase 1 — Criar Projeto

### Fase 3 — Funil Operacional (workflow reescrito)
- Workflow `fase3-funil.json` criado do zero — versão anterior no n8n tinha encoding corrompido nas etapas acentuadas (ANÁLISE, HOMOLOGAÇÃO, PRODUÇÃO, CONCLUÍDO apareciam como AN?LISE etc.)
- Causa: workflow anterior criado via UI n8n com charset incorreto
- Correção: Code node agora usa strings UTF-8 literais no JSON; todas as etapas pré-populadas com 0 antes de preencher com dados do banco
- **Ação pendente:** excluir workflow funil antigo no n8n e reimportar `workflows/fase3-funil.json`

### Auth — diagnóstico e migration
- Identificado: `/webhook/auth/login` retorna 404 — workflows de auth nunca foram importados no n8n
- Identificado: tabela `usuarios` não tem colunas `senha` e `perfil` necessárias pelos workflows
- Criada migration `raw/migrations/001-add-auth-columns.sql`
- **Ação pendente:** executar migration + importar `auth-login.json` e `auth-register.json` no n8n

### Fase 2 — Workflows de Tarefas operacionais
- Criar Tarefa, Listar Tarefas e Mover Tarefa testados e publicados
- Listar retorna nome do projeto via JOIN
- Schema tarefas ajustado: created_at e updated_at adicionados via ALTER TABLE

### Fase 1 — Workflow Criar Projeto operacional
- Workflow importado no N8N e publicado
- Credencial PostgreSQL configurada (postgres-orq)
- Schema real do banco difere do planejado — colunas adicionadas via ALTER TABLE:
  - `projetos`: responsavel, data_inicio, prazo, updated_at, created_at
  - `logs`: entidade, entidade_id, detalhe, created_at
- Teste bem-sucedido: POST /webhook/projeto/criar retornou `{"success":true}`
- Wiki banco.md atualizada com schema real
