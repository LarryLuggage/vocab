import { z } from 'zod';
import type {
  Etymology,
  EtymologyRoot,
  SourceContext,
  DistinctionMatrix,
  DistinctionMatrixItem,
  EvaluationStatus,
  ProductionValidationResult,
} from '@/types/lexis';

export const EtymologyRootSchema = z.object({
  morpheme: z.string().min(1, 'Morpheme cannot be empty'),
  meaning: z.string().min(1, 'Morpheme meaning cannot be empty'),
  origin: z.string().min(1, 'Origin cannot be empty'),
});

export const EtymologySchema = z.object({
  roots: z.array(EtymologyRootSchema),
  cognates: z.array(z.string()),
});

export const SourceContextSchema = z.object({
  sentence: z.string().nullable().optional().default(null),
  source: z.string().nullable().optional().default(null),
});

export const DistinctionMatrixItemSchema = z.object({
  word: z.string().min(1),
  recommendedRegister: z.string().min(1),
  exampleSentence: z.string().min(1),
});

export const DistinctionMatrixSchema = z.object({
  synonyms: z.array(z.string()).min(1),
  nuanceComparison: z.string().min(1),
  contextRecommendations: z.array(DistinctionMatrixItemSchema),
});

export const LexicalEnrichmentSchema = z.object({
  term: z.string().min(1, 'Term is required'),
  part_of_speech: z.string().min(1, 'Part of speech is required'),
  phonetic: z.string().nullable().optional(),
  primary_definition: z.string().min(1, 'Primary definition is required'),
  nuance_note: z.string().nullable().optional(),
  etymology: EtymologySchema.optional().default({ roots: [], cognates: [] }),
  collocations: z.array(z.string()).optional().default([]),
  source_context: SourceContextSchema.optional().default({ sentence: null, source: null }),
  cloze_sentences: z.array(z.string()).optional().default([]),
  distinction_matrix: DistinctionMatrixSchema.nullable().optional(),
  is_fallback: z.boolean().optional(),
  enrichment_source: z.string().optional(),
  fallback_reason: z.string().nullable().optional(),
});

export type LexicalEnrichmentPayload = z.infer<typeof LexicalEnrichmentSchema>;

export const ProductionEvaluationSchema = z.object({
  evaluationStatus: z.enum(['pass', 'incorrect_usage', 'awkward']),
  feedback: z.string().min(1, 'Feedback is required'),
  revisedSentence: z.string().nullable().optional(),
  registerDetected: z.string().min(1, 'Detected register is required'),
});

export type ProductionEvaluationPayload = z.infer<typeof ProductionEvaluationSchema>;
