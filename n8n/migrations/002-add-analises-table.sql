-- Migration 002 — Tabela de análises geradas pela IA
-- Executar no banco: orquestrador (container postgres-orq)
-- psql -h 185.135.137.113 -p 5433 -U orq -d orquestrador -f 002-add-analises-table.sql

CREATE TABLE IF NOT EXISTS analises (
  id          SERIAL PRIMARY KEY,
  conteudo    JSONB        NOT NULL,
  created_at  TIMESTAMP    DEFAULT NOW()
);

-- Verificar
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'analises';
