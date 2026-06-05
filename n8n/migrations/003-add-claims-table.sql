-- Migration 003: tabela de claims de ações de IA
-- Cada linha representa uma ação assumida por um dev após análise da IA.
-- status: 'ativo' = em andamento | 'resolvido' = concluído

CREATE TABLE IF NOT EXISTS claims (
  id            SERIAL PRIMARY KEY,
  projeto_id    INTEGER NOT NULL,
  projeto_nome  TEXT    NOT NULL,
  acao          TEXT    NOT NULL,
  responsavel   TEXT    NOT NULL,
  status        TEXT    NOT NULL DEFAULT 'ativo',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  resolvido_em  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_claims_projeto_status ON claims (projeto_id, status);
