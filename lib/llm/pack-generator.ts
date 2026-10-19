import { CardWithSrs } from '@/types/lexis';
import { ALL_CURATED_PACKS, findCuratedPackById } from '@/lib/db/thematic-packs';
import { DEFAULT_USER_ID } from '@/lib/db/seed-data';
import { createInitialSrsCard } from '@/lib/fsrs';
import { enrichWord, detectLanguage } from './enricher';

export interface GeneratedPackResult {
  cards: CardWithSrs[];
  mode: 'curated' | 'gemini' | 'heuristic';
  title: string;
}

export async function generateTopicPack(options: {
  packId?: string;
  topic?: string;
  language?: 'en' | 'es';
  count?: number;
}): Promise<GeneratedPackResult> {
  const count = Math.min(Math.max(options.count || 8, 1), 100);

  if (options.packId) {
    const matched = findCuratedPackById(options.packId);
    if (matched) {
      return {
        cards: options.count ? matched.cards.slice(0, count) : matched.cards,
        mode: 'curated',
        title: matched.title,
      };
    }
  }

  const rawTopic = (options.topic || '').trim();
  const targetLang: 'en' | 'es' =
    options.language || (rawTopic ? detectLanguage('', rawTopic) : 'en');

  if (!rawTopic) {
    const fallbackPack = ALL_CURATED_PACKS.find((p) => p.language === targetLang) || ALL_CURATED_PACKS[0];
    return {
      cards: fallbackPack.cards.slice(0, count),
      mode: 'curated',
      title: fallbackPack.title,
    };
  }

  // Extract keywords from topic
  const topicKeywords = rawTopic
    .toLowerCase()
    .split(/[\s,;&/|-]+/)
    .map((w) => w.replace(/[^a-z0-9áéíóúüñ]/g, ''))
    .filter((w) => w.length >= 3 && !['and', 'the', 'for', 'with', 'los', 'las', 'del', 'por', 'con'].includes(w));

  // Collect all unique curated cards for the requested language
  const poolMap = new Map<string, { card: CardWithSrs; packTitle: string; packCategory: string }>();
  for (const pack of ALL_CURATED_PACKS) {
    if (pack.language !== targetLang) continue;
    for (const card of pack.cards) {
      const key = card.term.toLowerCase().trim();
      if (!poolMap.has(key)) {
        poolMap.set(key, {
          card,
          packTitle: pack.title,
          packCategory: pack.category,
        });
      }
    }
  }

  // Score every card in the pool against topic keywords
  const scoredPool: Array<{ card: CardWithSrs; score: number }> = [];
  for (const { card, packTitle, packCategory } of poolMap.values()) {
    let score = 0;
    const termLower = card.term.toLowerCase();
    const defLower = card.primary_definition.toLowerCase();
    const nuanceLower = (card.nuance_note || '').toLowerCase();
    const sourceLower = (card.source_context?.source || '').toLowerCase();
    const authorLower = (card.source_context?.author || '').toLowerCase();
    const rootsText = card.etymology.roots
      .map((r) => `${r.morpheme} ${r.meaning} ${r.origin}`)
      .join(' ')
      .toLowerCase();
    const catLower = `${packTitle} ${packCategory}`.toLowerCase();

    for (const kw of topicKeywords) {
      if (termLower === kw) score += 25;
      else if (termLower.includes(kw)) score += 12;
      if (catLower.includes(kw)) score += 10;
      if (defLower.includes(kw)) score += 8;
      if (nuanceLower.includes(kw)) score += 6;
      if (authorLower.includes(kw) || sourceLower.includes(kw)) score += 7;
      if (rootsText.includes(kw)) score += 5;
    }

    scoredPool.push({ card, score });
  }

  scoredPool.sort((a, b) => b.score - a.score);

  const selected: CardWithSrs[] = [];
  const selectedTerms = new Set<string>();

  // If the user provided comma-separated specific terms that aren't in the curated pool, enrich them first
  if (rawTopic.includes(',')) {
    const explicitTokens = rawTopic
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length >= 3 && !t.includes(' '));

    for (const token of explicitTokens) {
      if (selected.length >= count) break;
      const lower = token.toLowerCase();
      const existingInPool = poolMap.get(lower);
      if (existingInPool) {
        selected.push(existingInPool.card);
        selectedTerms.add(lower);
      } else {
        const enriched = await enrichWord(token, undefined, `Topic Pack: ${rawTopic}`, targetLang);
        const id = crypto.randomUUID();
        selected.push({
          id,
          user_id: DEFAULT_USER_ID,
          term: enriched.term,
          language: targetLang,
          gender: enriched.gender || null,
          english_gloss: enriched.english_gloss || null,
          part_of_speech: enriched.part_of_speech,
          phonetic: enriched.phonetic || null,
          primary_definition: enriched.primary_definition,
          nuance_note: enriched.nuance_note || null,
          etymology: enriched.etymology,
          collocations: enriched.collocations,
          source_context: {
            sentence: enriched.source_context?.sentence || null,
            source: enriched.source_context?.source || `Curated Topic: ${rawTopic}`,
          },
          cloze_sentences: enriched.cloze_sentences,
          distinction_matrix: enriched.distinction_matrix || null,
          is_fallback: enriched.is_fallback,
          enrichment_source: enriched.enrichment_source as CardWithSrs['enrichment_source'],
          created_at: new Date().toISOString(),
          srs: createInitialSrsCard(id, DEFAULT_USER_ID),
        });
        selectedTerms.add(enriched.term.toLowerCase());
      }
    }
  }

  // Fill remaining slots from highest-scoring curated cards
  for (const item of scoredPool) {
    if (selected.length >= count) break;
    const key = item.card.term.toLowerCase();
    if (!selectedTerms.has(key)) {
      selected.push(item.card);
      selectedTerms.add(key);
    }
  }

  return {
    cards: selected.slice(0, count),
    mode: 'heuristic',
    title: `Custom Topic Pack: ${rawTopic}`,
  };
}
