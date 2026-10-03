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

// ============================================================================
// Supabase Client Initialization
// ============================================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isLiveSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseKey) return false;
  if (supabaseUrl.includes('your-project.supabase.co')) return false;
  if (supabaseKey === 'your-anon-key' || supabaseKey === 'your-service-role-key') return false;
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

// ============================================================================
// In-Memory Persistent Fallback Store
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

    const existingSentence = card.source_context?.sentence;
    const newSentence = existingSentence ? `${existingSentence}\n\n${sentence}` : sentence;
    const newSource = source || card.source_context?.source || null;

    const updated: VocabCard = {
      ...card,
      source_context: {
        sentence: newSentence,
        source: newSource,
      },
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

// Global in-memory singleton
const globalStore = new LocalVocabStore();

export function resetDbStore(): void {
  globalStore.reset();
}

// ============================================================================
// Public Data Layer Methods (Hybrid: Supabase with Local Fallback)
// ============================================================================

export async function findCardByTerm(
  term: string,
  userId: string = DEFAULT_USER_ID
): Promise<VocabCard | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const cleanTerm = term.toLowerCase().trim();
      const { data, error } = await supabase
        .from('vocab_cards')
        .select('*')
        .eq('user_id', userId)
        .ilike('term', cleanTerm)
        .maybeSingle();

      if (!error && data) {
        return data as VocabCard;
      }

      // If not exact match, query cards for user to check variant lemmas
      const { data: allUserCards, error: listError } = await supabase
        .from('vocab_cards')
        .select('*')
        .eq('user_id', userId);

      if (!listError && allUserCards) {
        const match = allUserCards.find(c => areTermsVariants(term, c.term));
        if (match) return match as VocabCard;
      }
    } catch (err) {
      console.warn('[Lexis DB] Supabase query failed, falling back to local store:', err);
    }
  }

  return globalStore.findByTerm(term, userId);
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

  if (supabase) {
    try {
      let query = supabase
        .from('vocab_cards')
        .select('*, srs:srs_cards(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (params?.pos) {
        query = query.ilike('part_of_speech', params.pos);
      }
      if (params?.search) {
        query = query.or(
          `term.ilike.%${params.search}%,primary_definition.ilike.%${params.search}%,nuance_note.ilike.%${params.search}%`
        );
      }
      if (params?.limit) {
        const offset = params.offset || 0;
        query = query.range(offset, offset + params.limit - 1);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((item: any) => {
          const srs = Array.isArray(item.srs) ? item.srs[0] : item.srs;
          return {
            ...item,
            srs: srs || createInitialSrsCard(item.id, userId),
          } as CardWithSrs;
        });
      }
    } catch (err) {
      console.warn('[Lexis DB] Supabase list failed, falling back to local store:', err);
    }
  }

  return globalStore.list(params);
}

export async function getCardById(
  id: string,
  userId: string = DEFAULT_USER_ID
): Promise<CardWithSrs | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vocab_cards')
        .select('*, srs:srs_cards(*)')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        const srs = Array.isArray(data.srs) ? data.srs[0] : data.srs;
        return {
          ...data,
          srs: srs || createInitialSrsCard(data.id, data.user_id),
        } as CardWithSrs;
      }
    } catch (err) {
      console.warn('[Lexis DB] Supabase getCardById failed, falling back:', err);
    }
  }

  return globalStore.getById(id, userId);
}

export async function createCard(
  cardData: Omit<VocabCard, 'id' | 'created_at'> & { id?: string; created_at?: string },
  srsData?: Partial<SrsCard>
): Promise<CardWithSrs> {
  const userId = cardData.user_id || DEFAULT_USER_ID;
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const id = cardData.id || crypto.randomUUID();
      const created_at = cardData.created_at || new Date().toISOString();

      const insertVocab = {
        ...cardData,
        id,
        user_id: userId,
        created_at,
      };

      const { data: createdVocab, error: vocabErr } = await supabase
        .from('vocab_cards')
        .insert(insertVocab)
        .select()
        .single();

      if (!vocabErr && createdVocab) {
        const initialSrs = createInitialSrsCard(id, userId);
        const insertSrs: SrsCard = {
          ...initialSrs,
          ...(srsData || {}),
          card_id: id,
          user_id: userId,
        };

        const { data: createdSrs, error: srsErr } = await supabase
          .from('srs_cards')
          .insert(insertSrs)
          .select()
          .single();

        return {
          ...(createdVocab as VocabCard),
          srs: (createdSrs || insertSrs) as SrsCard,
        };
      }
    } catch (err) {
      console.warn('[Lexis DB] Supabase createCard failed, falling back to local store:', err);
    }
  }

  return globalStore.create(cardData, srsData);
}

export async function updateCard(
  id: string,
  updates: Partial<VocabCard>,
  userId: string = DEFAULT_USER_ID
): Promise<VocabCard | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vocab_cards')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (!error && data) {
        return data as VocabCard;
      }
    } catch (err) {
      console.warn('[Lexis DB] Supabase updateCard failed, falling back:', err);
    }
  }

  return globalStore.update(id, updates, userId);
}

export async function appendContextSentence(
  id: string,
  sentence: string,
  source?: string,
  userId: string = DEFAULT_USER_ID
): Promise<VocabCard | null> {
  const existing = await getCardById(id, userId);
  if (!existing) return null;

  const currentSentence = existing.source_context?.sentence;
  const newSentence = currentSentence ? `${currentSentence}\n\n${sentence}` : sentence;
  const newSource = source || existing.source_context?.source || null;

  const newSourceContext = {
    sentence: newSentence,
    source: newSource,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vocab_cards')
        .update({ source_context: newSourceContext })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return data as VocabCard;
      }
    } catch (err) {
      console.warn('[Lexis DB] Supabase appendContextSentence failed, falling back:', err);
    }
  }

  return globalStore.appendContext(id, sentence, source, userId);
}

export async function deleteCard(
  id: string,
  userId: string = DEFAULT_USER_ID
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('vocab_cards')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (!error) return true;
    } catch (err) {
      console.warn('[Lexis DB] Supabase deleteCard failed, falling back:', err);
    }
  }

  return globalStore.delete(id, userId);
}

export async function getDueCards(
  userId: string = DEFAULT_USER_ID,
  asOf: Date = new Date()
): Promise<CardWithSrs[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('srs_cards')
        .select('*, vocab:vocab_cards(*)')
        .eq('user_id', userId)
        .lte('due', asOf.toISOString())
        .order('due', { ascending: true });

      if (!error && data) {
        return data.map((item: any) => {
          const vocab = Array.isArray(item.vocab) ? item.vocab[0] : item.vocab;
          const { vocab: _, ...srs } = item;
          return {
            ...vocab,
            srs,
          } as CardWithSrs;
        });
      }
    } catch (err) {
      console.warn('[Lexis DB] Supabase getDueCards failed, falling back:', err);
    }
  }

  return globalStore.getDue(userId, asOf);
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
    try {
      const { error } = await supabase
        .from('srs_cards')
        .update(updatedSrs)
        .eq('card_id', cardId);

      if (!error) {
        return {
          card: { ...existing, srs: updatedSrs },
          recordLog,
        };
      }
    } catch (err) {
      console.warn('[Lexis DB] Supabase recordReview update failed, falling back:', err);
    }
  }

  globalStore.updateSrs(updatedSrs);
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
  if (supabase) {
    try {
      const id = crypto.randomUUID();
      const insert = {
        id,
        card_id: cardId,
        user_sentence: userSentence,
        evaluation_status: evaluationStatus,
        feedback: feedback || null,
        created_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from('production_logs')
        .insert(insert)
        .select()
        .single();

      if (!error && data) {
        return data as ProductionLog;
      }
    } catch (err) {
      console.warn('[Lexis DB] Supabase logProductionAttempt failed, falling back:', err);
    }
  }

  return globalStore.logProduction(cardId, userSentence, evaluationStatus, feedback);
}

export async function getProductionLogs(cardId: string): Promise<ProductionLog[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('production_logs')
        .select('*')
        .eq('card_id', cardId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as ProductionLog[];
      }
    } catch (err) {
      console.warn('[Lexis DB] Supabase getProductionLogs failed, falling back:', err);
    }
  }

  return globalStore.getProductionLogs(cardId);
}
