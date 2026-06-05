# Infraestrutura Docker

O `docker-compose.yml` vive na VPS e ainda nao esta versionado aqui.

## TODO — Versionar o docker-compose.yml

Para recuperar o arquivo e versionar, rode na sua maquina:

```bash
ssh user@185.135.137.113 "cat ~/docker-compose.yml"
# ou dependendo do caminho:
ssh user@185.135.137.113 "find / -name docker-compose.yml 2>/dev/null"
```

Salve o output como `n8n/infra/docker-compose.yml` e faca commit.

## Servicos relevantes

| Container | Porta | Funcao |
|-----------|-------|--------|
| `n8n-orq` | 5678 | Motor de workflows |
| `postgres-orq` | 5433 | Banco do orquestrador |
| `metabase-orq` | 3000 | Dashboard analitico |
| `nginx` | 80/443 | Proxy compartilhado |

## Pendencias de seguranca

- [ ] Configurar TLS no Nginx para n8n-orq (porta 5678)
- [ ] Configurar TLS no Nginx para metabase-orq (porta 3000)
- [ ] Reverter N8N_SECURE_COOKIE=true apos TLS
- [ ] Configurar backup automatico do postgres-orq
