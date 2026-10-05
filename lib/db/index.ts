import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  VocabCard,
  SrsCard,
  CardWithSrs,
  ProductionLog,
  EvaluationStatus,
  FSRSRating,
} from '@/types/lexis';
import { createInitialSrsCard, scheduleCardWithRating } from '@/lib/fsrs';
import { RecordLogItem } from 'ts-fsrs';
import { createSampleCards, DEFAULT_USER_ID } from './seed-data';
export { DEFAULT_USER_ID };

// ============================================================================
// Supabase Client Initialization
// ============================================================================
// Server-side only: the app authenticates users itself (lib/auth.ts), so it
// talks to Postgres with the service-role key. The anon key is never used —
// RLS has no policies, which locks anon access out entirely.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

function isLiveSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseKey) return false;
  if (supabaseUrl.includes('your-project.supabase.co')) return false;
  if (
    supabaseKey === 'your-anon-key' ||
    supabaseKey === 'your-service-role-key'
  )
    return false;
  return true;
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isLiveSupabaseConfigured()) return null;
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl!, supabaseKey!);
    } catch (err) {
      console.warn('[Lexis DB] Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

// ============================================================================
// Lemma & Suffix Stemmer for Variant Deduplication (ING-04)
// ============================================================================
export function extractLemmaStem(word: string): string {
  const normalized = word.toLowerCase().trim();
  // Strip non-alphanumeric
  const cleaned = normalized.replace(/[^a-z]/g, '');

  // Common high-register derivational and inflectional suffixes
  const suffixes = [
    'istically', 'istical', 'istic', 'istically',
    'ously', 'aciousness', 'acity', 'acious',
    'ical', 'ishly', 'fully', 'ingly',
    'ness', 'ment', 'able', 'ible', 'tion', 'sion',
    'ence', 'ance', 'ling', 'hood', 'less',
    'ism', 'ist', 'ive', 'ous', 'ing', 'ied', 'ies',
    'ed', 'er', 'est', 'ly', 'es', 's'
  ];

  for (const suffix of suffixes) {
    if (cleaned.length > suffix.length + 3 && cleaned.endsWith(suffix)) {
      return cleaned.slice(0, -suffix.length);
    }
  }

  return cleaned;
}

export function areTermsVariants(term1: string, term2: string): boolean {
  const t1 = term1.toLowerCase().trim();
  const t2 = term2.toLowerCase().trim();
  if (t1 === t2) return true;

  const stem1 = extractLemmaStem(t1);
  const stem2 = extractLemmaStem(t2);

  // If stems match and are at least 4 chars
  if (stem1.length >= 4 && stem1 === stem2) return true;

  // Check prefix containment if length >= 5 (e.g. perspicac-ious vs perspicac-ity)
  const minLen = Math.min(t1.length, t2.length);
  if (minLen >= 6) {
    const commonPrefixLen = getCommonPrefixLength(t1, t2);
    if (commonPrefixLen >= 6 && Math.abs(t1.length - t2.length) <= 5) {
      return true;
    }
  }

  return false;
}

function getCommonPrefixLength(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++;
  }
  return i;
}

// Appending a sighting keeps the card's existing author/page/url metadata and,
// when the sentence contains the term, adds it as a new cloze drill.
export function buildAppendedContext(
  card: VocabCard,
  sentence: string,
  source?: string
): Pick<VocabCard, 'source_context' | 'cloze_sentences'> {
  const existingSentence = card.source_context?.sentence;
  const cloze_sentences = [...(card.cloze_sentences || [])];

  const termPattern = new RegExp(
    `\\b${card.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[a-z]*\\b`,
    'i'
  );
  if (termPattern.test(sentence)) {
    const masked = sentence.replace(termPattern, (match) => `{{c1::${match}}}`);
    if (!cloze_sentences.includes(masked)) cloze_sentences.push(masked);
  }

  return {
    source_context: {
      ...card.source_context,
      sentence: existingSentence ? `${existingSentence}\n\n${sentence}` : sentence,
      source: source || card.source_context?.source || null,
    },
    cloze_sentences,
  };
}

// ============================================================================
// In-Memory Store (local development & tests only)
// ============================================================================
class LocalVocabStore {
  private cards: Map<string, VocabCard> = new Map();
  private srs: Map<string, SrsCard> = new Map();
  private productionLogs: ProductionLog[] = [];

  constructor() {
    this.seed();
  }

  public seed(userId: string = DEFAULT_USER_ID): void {
    this.cards.clear();
    this.srs.clear();
    this.productionLogs = [];

    const samples = createSampleCards(userId);
    for (const sample of samples) {
      const { srs, ...vocab } = sample;
      this.cards.set(vocab.id, vocab);
      this.srs.set(srs.card_id, srs);
    }
  }

  public reset(): void {
    this.seed();
  }

  public findByTerm(term: string, userId: string = DEFAULT_USER_ID): VocabCard | null {
    const clean = term.toLowerCase().trim();
    for (const card of this.cards.values()) {
      if (card.user_id === userId && areTermsVariants(clean, card.term)) {
        return card;
      }
    }
    return null;
  }

  public getById(id: string, userId: string = DEFAULT_USER_ID): CardWithSrs | null {
    const card = this.cards.get(id);
    if (!card) return null;
    if (userId && card.user_id !== userId && card.user_id !== DEFAULT_USER_ID) {
      return null;
    }
    const srs = this.srs.get(id) || createInitialSrsCard(id, card.user_id);
    return { ...card, srs };
  }

  public list(params?: {
    search?: string;
    pos?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): CardWithSrs[] {
    const userId = params?.userId || DEFAULT_USER_ID;
    const search = params?.search?.toLowerCase().trim();
    const pos = params?.pos?.toLowerCase().trim();

    let results: CardWithSrs[] = [];

    for (const card of this.cards.values()) {
      if (userId && card.user_id !== userId && card.user_id !== DEFAULT_USER_ID) {
        continue;
      }
      if (pos && card.part_of_speech.toLowerCase() !== pos) {
        continue;
      }
      if (search) {
        const matchesTerm = card.term.toLowerCase().includes(search);
        const matchesDef = card.primary_definition.toLowerCase().includes(search);
        const matchesNuance = card.nuance_note?.toLowerCase().includes(search) ?? false;
        const matchesRoots = card.etymology.roots.some(
          r => r.morpheme.toLowerCase().includes(search) || r.meaning.toLowerCase().includes(search)
        );
        if (!matchesTerm && !matchesDef && !matchesNuance && !matchesRoots) {
          continue;
        }
      }

      const srs = this.srs.get(card.id) || createInitialSrsCard(card.id, card.user_id);
      results.push({ ...card, srs });
    }

    // Sort by created_at descending
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? results.length;
    return results.slice(offset, offset + limit);
  }

  public create(
    cardData: Omit<VocabCard, 'id' | 'created_at'> & { id?: string; created_at?: string },
    srsData?: Partial<SrsCard>
  ): CardWithSrs {
    const id = cardData.id || crypto.randomUUID();
    const created_at = cardData.created_at || new Date().toISOString();
    const userId = cardData.user_id || DEFAULT_USER_ID;

    const vocabCard: VocabCard = {
      ...cardData,
      id,
      user_id: userId,
      created_at,
    };

    const initialSrs = createInitialSrsCard(id, userId);
    const srsCard: SrsCard = {
      ...initialSrs,
      ...(srsData || {}),
      card_id: id,
      user_id: userId,
    };

    this.cards.set(id, vocabCard);
    this.srs.set(id, srsCard);

    return { ...vocabCard, srs: srsCard };
  }

  public update(id: string, updates: Partial<VocabCard>, userId: string = DEFAULT_USER_ID): VocabCard | null {
    const existing = this.cards.get(id);
    if (!existing) return null;
    if (userId && existing.user_id !== userId && existing.user_id !== DEFAULT_USER_ID) return null;

    const updated: VocabCard = {
      ...existing,
      ...updates,
      id: existing.id,
      user_id: existing.user_id,
      created_at: existing.created_at,
    };

    this.cards.set(id, updated);
    return updated;
  }

  public appendContext(
    id: string,
    sentence: string,
    source?: string,
    userId: string = DEFAULT_USER_ID
  ): VocabCard | null {
    const card = this.cards.get(id);
    if (!card) return null;

    const updated: VocabCard = {
      ...card,
      ...buildAppendedContext(card, sentence, source),
    };

    this.cards.set(id, updated);
    return updated;
  }

  public delete(id: string, userId: string = DEFAULT_USER_ID): boolean {
    const card = this.cards.get(id);
    if (!card) return false;
    if (userId && card.user_id !== userId && card.user_id !== DEFAULT_USER_ID) return false;

    this.cards.delete(id);
    this.srs.delete(id);
    this.productionLogs = this.productionLogs.filter(p => p.card_id !== id);
    return true;
  }

  public getDue(userId: string = DEFAULT_USER_ID, asOf: Date = new Date()): CardWithSrs[] {
    const dueTime = asOf.getTime();
    const dueCards: CardWithSrs[] = [];

    for (const card of this.cards.values()) {
      if (userId && card.user_id !== userId && card.user_id !== DEFAULT_USER_ID) continue;
      const srs = this.srs.get(card.id);
      if (srs) {
        const cardDueDate = new Date(srs.due).getTime();
        if (cardDueDate <= dueTime) {
          dueCards.push({ ...card, srs });
        }
      }
    }

    // Sort by due date ascending (most overdue first)
    dueCards.sort((a, b) => new Date(a.srs.due).getTime() - new Date(b.srs.due).getTime());
    return dueCards;
  }

  public updateSrs(srs: SrsCard): SrsCard {
    this.srs.set(srs.card_id, srs);
    return srs;
  }

  public logProduction(
    cardId: string,
    userSentence: string,
    evaluationStatus: EvaluationStatus,
    feedback?: string
  ): ProductionLog {
    const log: ProductionLog = {
      id: crypto.randomUUID(),
      card_id: cardId,
      user_sentence: userSentence,
      evaluation_status: evaluationStatus,
      feedback: feedback || null,
      created_at: new Date().toISOString(),
    };
    this.productionLogs.unshift(log);
    return log;
  }

  public getProductionLogs(cardId: string): ProductionLog[] {
    return this.productionLogs.filter(log => log.card_id === cardId);
  }
}

// ============================================================================
// Store Selection
// ----------------------------------------------------------------------------
// With Supabase configured, every query error throws (routes turn it into a
// 500 the UI shows). Without Supabase, the in-memory store serves local dev
// and tests — but never production, where each write would vanish on the next
// serverless cold start while the API reported success.
// ============================================================================
export class DbError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DbError';
  }
}

// Kept on globalThis so `next dev` module reloads don't wipe it mid-session
const globalForStore = globalThis as unknown as { __lexisMemoryStore?: LocalVocabStore };

function memoryStore(): LocalVocabStore {
  if (process.env.NODE_ENV === 'production' && process.env.LEXIS_ALLOW_MEMORY_STORE !== 'true') {
    const hint = supabaseUrl && !supabaseKey
      ? 'NEXT_PUBLIC_SUPABASE_URL is set but SUPABASE_SERVICE_ROLE_KEY is missing.'
      : 'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.';
    throw new DbError(
      `Database not configured: ${hint} Refusing to use the in-memory store in production because writes would be lost.`
    );
  }
  if (!globalForStore.__lexisMemoryStore) {
    globalForStore.__lexisMemoryStore = new LocalVocabStore();
  }
  return globalForStore.__lexisMemoryStore;
}

export function resetDbStore(): void {
  memoryStore().reset();
}

function check(error: { message: string } | null, operation: string): void {
  if (error) {
    throw new DbError(`Database ${operation} failed: ${error.message}`);
  }
}

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (m) => `\\${m}`);
}

function withSrs(item: any, userId: string): CardWithSrs {
  const { srs: rawSrs, ...vocab } = item;
  const srs = Array.isArray(rawSrs) ? rawSrs[0] : rawSrs;
  return {
    ...vocab,
    srs: srs || createInitialSrsCard(item.id, item.user_id || userId),
  } as CardWithSrs;
}

// ============================================================================
// Public Data Layer Methods
// ============================================================================

export async function findCardByTerm(
  term: string,
  userId: string = DEFAULT_USER_ID
): Promise<VocabCard | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return memoryStore().findByTerm(term, userId);

  const cleanTerm = term.toLowerCase().trim();
  const { data: exact, error: exactErr } = await supabase
    .from('vocab_cards')
    .select('*')
    .eq('user_id', userId)
    .ilike('term', escapeLikePattern(cleanTerm))
    .limit(1);
  check(exactErr, 'term lookup');
  if (exact && exact.length > 0) return exact[0] as VocabCard;

  // No exact match: scan the user's terms for lemma variants
  const { data: allTerms, error: listErr } = await supabase
    .from('vocab_cards')
    .select('*')
    .eq('user_id', userId);
  check(listErr, 'variant lookup');

  const match = (allTerms || []).find((c) => areTermsVariants(term, c.term));
  return (match as VocabCard) || null;
}

export async function listCards(params?: {
  search?: string;
  pos?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}): Promise<CardWithSrs[]> {
  const userId = params?.userId || DEFAULT_USER_ID;
  const supabase = getSupabaseClient();
  if (!supabase) return memoryStore().list(params);

  let query = supabase
    .from('vocab_cards')
    .select('*, srs:srs_cards(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (params?.pos) {
    query = query.ilike('part_of_speech', escapeLikePattern(params.pos));
  }
  if (params?.search) {
    const s = escapeLikePattern(params.search).replace(/[,()]/g, ' ');
    query = query.or(
      `term.ilike.%${s}%,primary_definition.ilike.%${s}%,nuance_note.ilike.%${s}%`
    );
  }
  if (params?.limit) {
    const offset = params.offset || 0;
    query = query.range(offset, offset + params.limit - 1);
  }

  const { data, error } = await query;
  check(error, 'card list');
  return (data || []).map((item: any) => withSrs(item, userId));
}

export async function getCardById(
  id: string,
  userId: string = DEFAULT_USER_ID
): Promise<CardWithSrs | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return memoryStore().getById(id, userId);

  const { data, error } = await supabase
    .from('vocab_cards')
    .select('*, srs:srs_cards(*)')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();
  check(error, 'card fetch');
  return data ? withSrs(data, userId) : null;
}

export async function createCard(
  cardData: Omit<VocabCard, 'id' | 'created_at'> & { id?: string; created_at?: string },
  srsData?: Partial<SrsCard>
): Promise<CardWithSrs> {
  const userId = cardData.user_id || DEFAULT_USER_ID;
  const supabase = getSupabaseClient();
  if (!supabase) return memoryStore().create(cardData, srsData);

  const id = cardData.id || crypto.randomUUID();
  const created_at = cardData.created_at || new Date().toISOString();

  const { data: createdVocab, error: vocabErr } = await supabase
    .from('vocab_cards')
    .insert({ ...cardData, id, user_id: userId, created_at })
    .select()
    .single();
  check(vocabErr, 'card insert');

  const insertSrs: SrsCard = {
    ...createInitialSrsCard(id, userId),
    ...(srsData || {}),
    card_id: id,
    user_id: userId,
  };

  const { data: createdSrs, error: srsErr } = await supabase
    .from('srs_cards')
    .insert(insertSrs)
    .select()
    .single();

  if (srsErr) {
    // Don't leave a card that can never come due
    await supabase.from('vocab_cards').delete().eq('id', id);
    check(srsErr, 'schedule insert');
  }

  return {
    ...(createdVocab as VocabCard),
    srs: createdSrs as SrsCard,
  };
}

export async function updateCard(
  id: string,
  updates: Partial<VocabCard>,
  userId: string = DEFAULT_USER_ID
): Promise<VocabCard | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return memoryStore().update(id, updates, userId);

  const { data, error } = await supabase
    .from('vocab_cards')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .maybeSingle();
  check(error, 'card update');
  return (data as VocabCard) || null;
}

export async function appendContextSentence(
  id: string,
  sentence: string,
  source?: string,
  userId: string = DEFAULT_USER_ID
): Promise<VocabCard | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return memoryStore().appendContext(id, sentence, source, userId);

  const existing = await getCardById(id, userId);
  if (!existing) return null;

  const { data, error } = await supabase
    .from('vocab_cards')
    .update(buildAppendedContext(existing, sentence, source))
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .maybeSingle();
  check(error, 'context append');
  return (data as VocabCard) || null;
}

export async function deleteCard(
  id: string,
  userId: string = DEFAULT_USER_ID
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return memoryStore().delete(id, userId);

  const { data, error } = await supabase
    .from('vocab_cards')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select('id');
  check(error, 'card delete');
  return (data || []).length > 0;
}

export async function getDueCards(
  userId: string = DEFAULT_USER_ID,
  asOf: Date = new Date()
): Promise<CardWithSrs[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return memoryStore().getDue(userId, asOf);

  const { data, error } = await supabase
    .from('srs_cards')
    .select('*, vocab:vocab_cards(*)')
    .eq('user_id', userId)
    .lte('due', asOf.toISOString())
    .order('due', { ascending: true });
  check(error, 'due queue');

  return (data || [])
    .map((item: any) => {
      const { vocab: rawVocab, ...srs } = item;
      const vocab = Array.isArray(rawVocab) ? rawVocab[0] : rawVocab;
      return vocab ? ({ ...vocab, srs } as CardWithSrs) : null;
    })
    .filter((c): c is CardWithSrs => c !== null);
}

export async function recordReview(
  cardId: string,
  rating: FSRSRating,
  reviewTime: Date = new Date(),
  userId: string = DEFAULT_USER_ID
): Promise<{ card: CardWithSrs; recordLog: RecordLogItem } | null> {
  const existing = await getCardById(cardId, userId);
  if (!existing) return null;

  const { updatedSrs, recordLog } = scheduleCardWithRating(existing.srs, rating, reviewTime);

  const supabase = getSupabaseClient();
  if (supabase) {
    // Upsert so a card whose schedule row is missing gets one
    const { error } = await supabase
      .from('srs_cards')
      .upsert(updatedSrs, { onConflict: 'card_id' });
    check(error, 'review save');
  } else {
    memoryStore().updateSrs(updatedSrs);
  }

  return {
    card: { ...existing, srs: updatedSrs },
    recordLog,
  };
}

export async function logProductionAttempt(
  cardId: string,
  userSentence: string,
  evaluationStatus: EvaluationStatus,
  feedback?: string,
  userId: string = DEFAULT_USER_ID
): Promise<ProductionLog> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return memoryStore().logProduction(cardId, userSentence, evaluationStatus, feedback);
  }

  const { data, error } = await supabase
    .from('production_logs')
    .insert({
      id: crypto.randomUUID(),
      card_id: cardId,
      user_sentence: userSentence,
      evaluation_status: evaluationStatus,
      feedback: feedback || null,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  check(error, 'production log insert');
  return data as ProductionLog;
}

export async function getProductionLogs(cardId: string): Promise<ProductionLog[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return memoryStore().getProductionLogs(cardId);

  const { data, error } = await supabase
    .from('production_logs')
    .select('*')
    .eq('card_id', cardId)
    .order('created_at', { ascending: false });
  check(error, 'production log fetch');
  return (data || []) as ProductionLog[];
}
