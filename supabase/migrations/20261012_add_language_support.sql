-- 20261012_add_language_support.sql
-- Dual-language schema support
ALTER TABLE vocab_cards ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en' NOT NULL;
ALTER TABLE vocab_cards ADD COLUMN IF NOT EXISTS gender VARCHAR(20) DEFAULT NULL;
ALTER TABLE vocab_cards ADD COLUMN IF NOT EXISTS english_gloss TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_vocab_language ON vocab_cards (user_id, language);
