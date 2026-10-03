-- ==========================================
-- Lexis Engine PostgreSQL Schema (Supabase)
-- ==========================================

-- Vocabulary Cards Table
CREATE TABLE IF NOT EXISTS vocab_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    term VARCHAR(100) NOT NULL,
    part_of_speech VARCHAR(50) NOT NULL,
    phonetic VARCHAR(100),
    primary_definition TEXT NOT NULL,
    nuance_note TEXT,
    etymology JSONB DEFAULT '{"roots": [], "cognates": []}'::jsonb,
    collocations TEXT[] DEFAULT '{}',
    source_context JSONB DEFAULT '{"sentence": null, "source": null}'::jsonb,
    cloze_sentences TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Spaced Repetition Tracking (FSRS Schema)
CREATE TABLE IF NOT EXISTS srs_cards (
    card_id UUID PRIMARY KEY REFERENCES vocab_cards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    due TIMESTAMP WITH TIME ZONE NOT NULL,
    stability REAL NOT NULL DEFAULT 0,
    difficulty REAL NOT NULL DEFAULT 0,
    elapsed_days INTEGER NOT NULL DEFAULT 0,
    scheduled_days INTEGER NOT NULL DEFAULT 0,
    reps INTEGER NOT NULL DEFAULT 0,
    lapses INTEGER NOT NULL DEFAULT 0,
    state INTEGER NOT NULL DEFAULT 0, -- 0: New, 1: Learning, 2: Review, 3: Relearning
    last_review TIMESTAMP WITH TIME ZONE
);

-- Production Attempts Log
CREATE TABLE IF NOT EXISTS production_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID REFERENCES vocab_cards(id) ON DELETE CASCADE,
    user_sentence TEXT NOT NULL,
    evaluation_status VARCHAR(20) NOT NULL, -- 'pass' | 'incorrect_usage' | 'awkward'
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_srs_due ON srs_cards (user_id, due);
CREATE INDEX IF NOT EXISTS idx_vocab_term ON vocab_cards (user_id, term);

-- Row Level Security (RLS)
ALTER TABLE vocab_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE srs_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_logs ENABLE ROW LEVEL SECURITY;

-- Default RLS Policies (User owns their cards)
CREATE POLICY "Users can manage their own vocab cards" ON vocab_cards
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own srs cards" ON srs_cards
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own production logs" ON production_logs
    FOR ALL USING (
        card_id IN (SELECT id FROM vocab_cards WHERE user_id = auth.uid())
    );
