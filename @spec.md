# Product Requirement Document (PRD)

## Product Name: Lexis Engine (Working Title)
- **Document Status**: Draft / Ready for Review
- **Target Platform**: Web (Responsive Desktop & Mobile PWA)
- **Primary Tech Stack**: Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL), LLM API (Structured JSON Mode), ts-fsrs

---

## 1. Executive Summary & Problem Statement

### 1.1 The Problem
Traditional flashcard platforms (Anki, Quizlet) optimize for passive recognition, presenting words as isolated definitions without deep etymological context, collocations, or register distinctions. Conversely, commercial vocabulary apps (WordUp, Vocabulary.com) rely on fixed pre-curated curricula rather than capturing words encountered organically across reading.

### 1.2 The Solution
A streamlined, private vocabulary operating system designed to:
1. Capture words in real time with minimal friction from any text source.
2. Automatically enrich captured entries with structural etymology, subtle connotative nuances, collocations, and cloze exercises via an LLM pipeline.
3. Train productive (active) vocabulary using the Free Spaced Repetition Scheduler (FSRS) algorithm through cloze testing, synonym differentiation, and validated sentence production.

---

## 2. User Personas & Core Workflows

### 2.1 Target Persona
- **The High-Register Reader & Writer**: Reads dense nonfiction, literature, and technical prose. Needs to capture low-frequency words seamlessly, understand subtle differences between near-synonyms, and actively deploy new vocabulary into essays, reports, and daily discourse.

### 2.2 Core Workflows
1. **Quick Ingestion**: User highlights a sentence while reading or enters a word manually -> Pipeline enriches data within 2 seconds -> Saved to personal lexicon.
2. **Daily Practice Loop**: User opens `/review` -> Reviews cards scheduled for that day across 3 active modalities (Cloze, Distinction Matrix, Production Sandbox) -> FSRS updates interval based on performance rating.
3. **Lexicon Exploration**: User searches personal library by root morpheme, date added, or mastery tier to review etymological relationships.

---

## 3. Key Features & Functional Requirements

### 3.1 Ingestion & Enrichment Pipeline
| Feature ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **ING-01** | Quick Capture UI | Minimalist web view (`/add`) containing two inputs: Word (autofocused) and optional Context Sentence. | P0 |
| **ING-02** | LLM Lexical Parser | API route (`/api/enrich`) that queries an LLM with strict JSON schema enforcement to parse roots, definitions, register, and generate cloze drills. | P0 |
| **ING-03** | Webhook / API Ingestion | Authenticated REST endpoint allowing external capture from browser extensions, iOS Shortcuts, or reading apps. | P1 |
| **ING-04** | Deduplication & Variant Handling | Checks if the base root or lemma already exists in the database. If present, prompts to append the new context sentence rather than duplicating. | P1 |

### 3.2 Spaced Repetition System (SRS)
| Feature ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **SRS-01** | FSRS Algorithm Integration | Implement `ts-fsrs` to govern scheduling. Track stability, difficulty, state, and last_review. | P0 |
| **SRS-02** | Rating Controls | Standard 4-button grading: Again (1), Hard (2), Good (3), Easy (4). | P0 |
| **SRS-03** | Queue Management | Dedicated `/review` dashboard prioritizing cards where `due <= current_timestamp`. | P0 |

### 3.3 Active Practice Modalities
| Feature ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **ACT-01** | Contextual Cloze Fill | Displays original or generated sentence with target word masked. User types the exact word or lemma. | P0 |
| **ACT-02** | Register & Distinction Matrix | Presents target word alongside two close synonyms (e.g., pedantic vs. didactic vs. erudite); prompts user to select the word matching a specific tone or social register. | P1 |
| **ACT-03** | Active Production Sandbox | User writes an original sentence. An LLM validator inspects the sentence in real time for grammatical accuracy, idiomatic naturalness, and proper register, providing immediate corrections. | P1 |

---

## 4. Technical Architecture & Data Model

### 4.1 Data Architecture
```
[ Client: Next.js PWA ] 
       │ 
       ├── POST /api/enrich ──> [ LLM API (Structured JSON) ]
       │ 
       └── CRUD Operations  ──> [ Supabase (PostgreSQL) ]
```

### 4.2 Database Schema (PostgreSQL / Supabase)
```sql
-- Vocabulary Cards Table
CREATE TABLE vocab_cards (
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
CREATE TABLE srs_cards (
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
CREATE TABLE production_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID REFERENCES vocab_cards(id) ON DELETE CASCADE,
    user_sentence TEXT NOT NULL,
    evaluation_status VARCHAR(20) NOT NULL, -- 'pass' | 'incorrect_usage' | 'awkward'
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_srs_due ON srs_cards (user_id, due);
CREATE INDEX idx_vocab_term ON vocab_cards (user_id, term);
```

---

## 5. Non-Functional Requirements
- **Latency**: The enrichment pipeline (`/api/enrich`) must return a fully validated payload within $\le 2.5$ seconds using fast-inference models (e.g., streaming structured outputs).
- **Responsive Design**: Optimized for single-thumb mobile interaction during daily review sessions.
- **Data Portability**: Full JSON/CSV export functionality at any time, allowing seamless backup into Anki `.apkg` format.
- **Security**: Row Level Security (RLS) enabled on all database tables via Supabase auth.

---

## 6. Release Phases & Milestones
- **Phase 1: MVP Core**: Ingestion & Basic Review
  - Supabase database setup with initial tables.
  - Next.js `/add` screen with LLM structured parsing.
  - Basic FSRS review queue (`/review`) with Cloze mode only.
- **Phase 2: Active Modules**: Production & Nuance Drills
  - Distinction Matrix module implementation.
  - Production Sandbox with instant LLM usage evaluation.
  - iOS Shortcut / Webhook setup for instant browser capture.
- **Phase 3: Lexicon Network**: Morphological Mapping
  - Etymological root visualizer (grouping words sharing common Latin/Greek morphemes).
  - Bulk Anki import/export engine.
