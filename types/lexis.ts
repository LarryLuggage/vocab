export interface EtymologyRoot {
  morpheme: string;
  meaning: string;
  origin: string; // e.g., 'Latin', 'Greek'
}

export interface Etymology {
  roots: EtymologyRoot[];
  cognates: string[];
}

export interface SourceContext {
  sentence: string | null;
  source: string | null;
  author?: string | null;
  page?: string | null;
  url?: string | null;
}

export interface IngestRequestPayload {
  term: string;
  contextSentence?: string;
  source?: string;
  author?: string;
  page?: string;
  url?: string;
}

export interface DistinctionMatrixItem {
  word: string;
  recommendedRegister: string;
  exampleSentence: string;
}

export interface DistinctionMatrix {
  synonyms: string[];
  nuanceComparison: string;
  contextRecommendations: DistinctionMatrixItem[];
}

export interface VocabCard {
  id: string;
  user_id: string;
  term: string;
  part_of_speech: string;
  phonetic?: string | null;
  primary_definition: string;
  nuance_note?: string | null;
  etymology: Etymology;
  collocations: string[];
  source_context: SourceContext;
  cloze_sentences: string[];
  distinction_matrix?: DistinctionMatrix | null;
  is_fallback?: boolean;
  enrichment_source?: 'gemini' | 'openai' | 'curated' | 'dictionary' | 'offline-stub';
  fallback_reason?: string;
  created_at: string;
}

export type FSRSState = 0 | 1 | 2 | 3; // 0: New, 1: Learning, 2: Review, 3: Relearning
export type FSRSRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export interface SrsCard {
  card_id: string;
  user_id: string;
  due: string; // ISO 8601 string
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: FSRSState;
  last_review?: string | null;
}

export type EvaluationStatus = 'pass' | 'incorrect_usage' | 'awkward';

export interface ProductionLog {
  id: string;
  card_id: string;
  user_sentence: string;
  evaluation_status: EvaluationStatus;
  feedback?: string | null;
  created_at: string;
}

export interface CardWithSrs extends VocabCard {
  srs: SrsCard;
}

export interface ReviewSchedulePreview {
  rating: FSRSRating;
  label: 'Again' | 'Hard' | 'Good' | 'Easy';
  intervalDisplay: string;
}

export interface ProductionValidationResult {
  evaluationStatus: EvaluationStatus;
  feedback: string;
  revisedSentence?: string;
  registerDetected: string;
}
