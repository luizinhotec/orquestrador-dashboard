-- Migration 001 — Adiciona colunas de autenticação à tabela usuarios
-- Executar no banco: orquestrador (container postgres-orq)
-- Comando: psql -h 185.135.137.113 -p 5433 -U orq -d orquestrador -f 001-add-auth-columns.sql

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS senha  VARCHAR(255),
  ADD COLUMN IF NOT EXISTS perfil VARCHAR(50) DEFAULT 'user';

-- Verificar resultado
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;
