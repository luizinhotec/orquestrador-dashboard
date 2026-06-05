# n8n — Workflows e Infraestrutura

Motor de orquestração do projeto. Os workflows rodam no container `n8n-orq` na VPS (`185.135.137.113:5678`).

## Estrutura

```
workflows/    ← JSONs exportados do n8n (importáveis pelo editor)
migrations/   ← Scripts SQL para executar no postgres-orq antes de ativar workflows
infra/        ← Referência de infraestrutura Docker (ver README.md dentro)
```

## Como importar um workflow

1. Acesse http://185.135.137.113:5678
2. Menu → Workflows → Import from file
3. Selecione o JSON em `workflows/`
4. Ative o workflow após importar

## Workflows e pré-requisitos

| Arquivo | Migration necessária antes |
|---------|---------------------------|
| `auth-login.json`, `auth-register.json` | `001-add-auth-columns.sql` |
| `fase6-analise-ia.json`, `fase6-analise-buscar.json` | `002-add-analises-table.sql` |
| `fase7-claims-*.json` | `003-add-claims-table.sql` |

## Variáveis de ambiente necessárias no n8n

Configurar no `docker-compose.yml` do container `n8n-orq`:

| Variável | Descrição |
|----------|-----------|
| `N8N_API_KEY` | Chave de API gerada no editor do n8n |
| `ANTHROPIC_API_KEY` | Necessário para workflows de IA (Fase 6+) |

## Documentação completa

Ver `docs/workflows.md` para lista com status de todos os workflows.
