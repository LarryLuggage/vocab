-- ==========================================
-- Align the schema with what the app writes
-- ==========================================
-- Idempotent: safe on a database built from 20261003_init_schema.sql or from
-- the schema in spec.md.

-- Columns every card insert includes. Without distinction_matrix, inserts
-- built from the init migration were rejected.
ALTER TABLE vocab_cards ADD COLUMN IF NOT EXISTS distinction_matrix JSONB DEFAULT NULL;

-- Enrichment provenance, so fallback-enriched cards can be found and re-enriched
ALTER TABLE vocab_cards ADD COLUMN IF NOT EXISTS is_fallback BOOLEAN DEFAULT false;
ALTER TABLE vocab_cards ADD COLUMN IF NOT EXISTS enrichment_source TEXT;
ALTER TABLE vocab_cards ADD COLUMN IF NOT EXISTS fallback_reason TEXT;

-- Access model: the Next.js server authenticates the single user itself
-- (LEXIS_SECRET_TOKEN) and connects with the service-role key, which bypasses
-- RLS. The auth.uid() policies never matched anything (there are no Supabase
-- Auth users). Keep RLS enabled with no policies so the public anon key can
-- read or write nothing.
DROP POLICY IF EXISTS "Users can manage their own vocab cards" ON vocab_cards;
DROP POLICY IF EXISTS "Users can manage their own srs cards" ON srs_cards;
DROP POLICY IF EXISTS "Users can manage their own production logs" ON production_logs;

ALTER TABLE vocab_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE srs_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_logs ENABLE ROW LEVEL SECURITY;
