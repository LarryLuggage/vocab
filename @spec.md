# Product Requirement Document (PRD)

## Product Name: Lexis Engine — Personal Vocabulary Operating System
- **Document Status**: Active / Single-User Personal OS
- **Target Platform**: Web (Desktop & Mobile PWA), Chrome Extension (Manifest V3), iOS Shortcuts
- **Primary Tech Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL), Gemini / OpenAI Structured JSON, ts-fsrs

---

## 1. Executive Summary & Problem Statement

### 1.1 The Problem
Traditional flashcard platforms (Anki, Quizlet) optimize for passive recognition, presenting words as isolated definitions without deep etymological context, collocations, or register distinctions. Conversely, commercial vocabulary apps (WordUp, Vocabulary.com) rely on fixed pre-curated curricula rather than capturing words encountered organically across personal reading.

### 1.2 The Solution: Single-User Personal OS
A streamlined, private, zero-friction vocabulary operating system designed exclusively for personal intellectual use:
1. **Frictionless "Everywhere" Capture**: Capture words in real time with zero friction from any reading source (Chrome Extension on desktop, iOS Share Sheet on mobile, or web UI) into a personal cloud lexicon.
2. **Instant Deep Enrichment**: Automatically enrich captured entries with structural Greek/Latin etymology, subtle connotative nuances, collocations, and cloze exercises via an LLM pipeline in $\le 2.5$ seconds.
3. **Productive Active Practice**: Train productive (active) vocabulary using the Free Spaced Repetition Scheduler (FSRS) algorithm through cloze testing, synonym differentiation, and validated sentence production.
4. **Single-User Architecture**: Completely free of multi-tenant auth walls, passwords, or login prompts. Remote external captures are secured via a private bearer token (`LEXIS_SECRET_TOKEN`).

---

## 2. User Persona & Core Workflows

### 2.1 Persona
- **The Solo High-Register Reader & Writer**: Reads dense nonfiction, literary prose, philosophy, and academic essays. Needs to capture low-frequency words seamlessly while reading, understand subtle differences between near-synonyms, and actively deploy new vocabulary into personal writing.

### 2.2 Core Workflows
1. **In-Reading Capture**:
   - **Desktop**: Highlight word while reading an article/paper $\rightarrow$ right-click "Send to Lexis" or press hotkey $\rightarrow$ background enrichment parses roots and saves to cloud database.
   - **Mobile**: Highlight word in Safari/Books $\rightarrow$ Share to "Add to Lexis" iOS Shortcut.
   - **Web App**: Direct manual entry via `/add` (`⌘K`).
2. **Daily Practice Loop**: User opens `/review` $\rightarrow$ Reviews cards scheduled for that day across 3 active recall modalities (Cloze, Distinction Matrix, Production Sandbox) $\rightarrow$ FSRS updates interval based on performance rating.
3. **Lexicon & Reading Source Exploration**: User searches personal library by reading source/author, root morpheme, date added, or mastery tier to review etymological relationships.

---

## 3. Key Features & Functional Requirements

### 3.1 Ingestion & Enrichment Pipeline
| Feature ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **ING-01** | Quick Capture UI | Minimalist web view (`/add`) containing Word (autofocused), optional Context Sentence, and Reading Source/Author field. | P0 |
| **ING-02** | LLM Lexical Parser | API route (`/api/enrich`) that queries Gemini/OpenAI with strict JSON schema enforcement to parse roots, definitions, register, and cloze drills. | P0 |
| **ING-03** | Webhook / API Ingestion | Authenticated endpoint (`/api/ingest`) using private bearer token (`LEXIS_SECRET_TOKEN`) for browser extensions and iOS Shortcuts. | P0 |
| **ING-04** | Deduplication & Variant Handling | Checks if the base root or lemma already exists in the database. If present, prompts or automatically appends the new context sentence. | P0 |
| **ING-05** | Chrome Browser Extension | Manifest V3 extension with context-menu capture, automatic sentence boundary detection, and status badge. | P0 |
| **ING-06** | iOS Shortcut Webhook | Native iOS Share Sheet integration capturing selected text directly to Lexis. | P1 |

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
| **ACT-02** | Register & Distinction Matrix | Presents target word alongside two close synonyms; prompts user to select word matching a specific tone or social register. | P0 |
| **ACT-03** | Active Production Sandbox | User writes an original sentence. LLM validator inspects sentence for grammatical accuracy, idiomatic naturalness, and proper register. | P0 |

---

## 4. Technical Architecture & Data Model

### 4.1 Single-User Cloud Architecture
```
[ Chrome Extension / iOS Shortcut ]
       │  (Bearer: LEXIS_SECRET_TOKEN)
       ▼
[ Next.js API Routes: /api/ingest ] ──> [ LLM API: Gemini 2.0 Flash ]
       │
       ▼
[ Supabase PostgreSQL ] ◄─── [ Next.js PWA Client (/review, /lexicon, /add) ]
```

### 4.2 Database Schema (PostgreSQL / Supabase)
```sql
CREATE TABLE IF NOT EXISTS vocab_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) DEFAULT 'owner' NOT NULL,
    term VARCHAR(100) NOT NULL,
    part_of_speech VARCHAR(50) NOT NULL,
    phonetic VARCHAR(100),
    primary_definition TEXT NOT NULL,
    nuance_note TEXT,
    etymology JSONB DEFAULT '{"roots": [], "cognates": []}'::jsonb,
    collocations TEXT[] DEFAULT '{}',
    source_context JSONB DEFAULT '{"sentence": null, "source": null, "author": null, "url": null}'::jsonb,
    cloze_sentences TEXT[] DEFAULT '{}',
    distinction_matrix JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS srs_cards (
    card_id UUID PRIMARY KEY REFERENCES vocab_cards(id) ON DELETE CASCADE,
    user_id VARCHAR(50) DEFAULT 'owner' NOT NULL,
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

CREATE TABLE IF NOT EXISTS production_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID REFERENCES vocab_cards(id) ON DELETE CASCADE,
    user_sentence TEXT NOT NULL,
    evaluation_status VARCHAR(20) NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_srs_due ON srs_cards (due);
CREATE INDEX IF NOT EXISTS idx_vocab_term ON vocab_cards (term);
```

---

## 5. Release Phases & Milestones

- **Phase 1: Core Engine & Multi-Modal Practice (Complete)**:
  - FSRS scheduling engine with `ts-fsrs`.
  - LLM structured JSON enrichment (`/api/enrich`) with $\le 2.5\text{s}$ latency.
  - Three active practice modalities (`ACT-01`, `ACT-02`, `ACT-03`).
  - Personal Lexicon catalog & morphological grouping.

- **Phase 2: Everywhere Capture & Personal Integration (Current Milestone)**:
  - Private token ingestion API (`/api/ingest`) with secret token verification.
  - Reading source and author tracking in card metadata.
  - Dedicated Manifest V3 Chrome Extension:
    - Context menu capture with auto-sentence extraction.
    - Keyboard shortcut capture.
    - Extension popup for instant lookup, capture status, and settings.
  - Native iOS Shortcut recipe for mobile reading capture.

- **Phase 3: Knowledge Graph & Second-Brain Sync**:
  - Interactive Morpheme Root Network visualizer.
  - Obsidian & Markdown bulk export / sync with YAML frontmatter.
  - Offline PWA caching with Service Worker.
