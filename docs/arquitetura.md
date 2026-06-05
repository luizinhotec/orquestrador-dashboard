# Arquitetura

**Summary**: Stack completa, containers Docker em produção, portas e variáveis de ambiente.
**Sources**: docker-compose.yml (na VPS), containers em produção
**Last updated**: 2026-06-04

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Orquestração | N8N 2.23.3 |
| Banco de dados | PostgreSQL (container postgres-orq) |
| Dashboard analítico | Metabase (container metabase-orq) |
| Proxy | Nginx (container nginx — compartilhado) |
| Agent model | Claude Haiku (API Anthropic) |

## Containers em Produção

| Container | Função | Porta |
|-----------|--------|-------|
| nginx | Proxy web compartilhado | 80/443 |
| postgres | Banco principal (outros projetos) | 5432 |
| material-agent | Sistema Material Construction Agent | — |
| diagnostico-erp | Sistema Diagnóstico ERP | — |
| postgres-orq | Banco exclusivo do orquestrador | 5433 |
| n8n-orq | Motor de workflows | 5678 |
| metabase-orq | Dashboard analítico | 3000 |

## Variáveis de Ambiente N8N

| Variável | Valor |
|----------|-------|
| N8N_SECURE_COOKIE | false (temporário — pendente TLS) |
| DB_TYPE | postgresdb |
| DB_POSTGRESDB_HOST | postgres-orq |
| DB_POSTGRESDB_DATABASE | orquestrador |
| DB_POSTGRESDB_USER | orq |

## Pendências de Segurança

- [ ] Configurar TLS no Nginx para n8n-orq (porta 5678)
- [ ] Configurar TLS no Nginx para metabase-orq (porta 3000)
- [ ] Reverter N8N_SECURE_COOKIE para true após TLS
- [ ] Configurar backup automático do postgres-orq

## Links

- [[banco]] — schema do banco
- [[workflows]] — workflows ativos no N8N
