'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Timer,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  GitBranch,
  Layers,
  Quote,
  Flame,
  PlusCircle,
  RefreshCw,
  Check,
  FileText,
} from 'lucide-react';
import { VocabCard, CardWithSrs } from '@/types/lexis';
import { apiFetch, ApiError, errorMessageOf, notifyCardsUpdated } from '@/lib/api-client';
import { parseShareTargetPayload } from '@/lib/share-parser';
import { detectLanguage, formatGenderBadge } from '@/lib/language';
import { cn, extractClozeToken } from '@/lib/utils';

interface ExtractedPassageCandidate {
  term: string;
  surfaceForm: string;
  part_of_speech: string;
  phonetic: string;
  language: 'en' | 'es';
  gender?: 'masculine' | 'feminine' | 'neuter' | 'invariable' | null;
  english_gloss?: string | null;
  primary_definition: string;
  nuance_note: string;
  etymology: {
    roots: Array<{ morpheme: string; meaning: string; origin: string }>;
    cognates: string[];
  };
  collocations: string[];
  cloze_sentences: string[];
  distinction_matrix?: VocabCard['distinction_matrix'];
  contextSentence: string;
  alreadyExists: boolean;
  existingCardId?: string | null;
}

const ENGLISH_SAMPLE_PASSAGE = `The fundamental aporia of modern epistemology lies in its inability to reconcile teleology with the contingency of ontic experience. Even when critical theory unmasks cultural hegemony, the hermeneutic horizon remains haunted by reification and dialectical sublation. Only a pellucid genealogy of conceptual forms can rescue philosophical inquiry from solipsism. (Derrida, Writing and Difference, p. 42)`;

const SPANISH_SAMPLE_PASSAGE = `En la penumbra de aquella biblioteca infinita, una honda zozobra y un persistente desasosiego envolvían al lector frente al palimpsesto indescifrable. La quimera de alcanzar lo inefable se tornaba efímera ante la Vorágine del tiempo y la abulia de la memoria. (Borges, Ficciones, p. 88)`;

function fallbackSourceLabel(source?: string | null): string {
  switch (source) {
    case 'dictionary':
      return 'Dictionary Fallback';
    case 'curated':
      return 'Curated Fallback';
    case 'offline-heuristic':
    case 'offline-stub':
      return 'Offline Fallback';
    default:
      return 'Fallback';
  }
}

export default function QuickCapturePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Capture mode toggle: single word vs bulk passage extractor
  const [captureMode, setCaptureMode] = useState<'single' | 'passage'>('single');

  // Form inputs (Single Word mode)
  const [term, setTerm] = useState('');
  const [contextSentence, setContextSentence] = useState('');
  const [source, setSource] = useState('');
  const [author, setAuthor] = useState('');
  const [page, setPage] = useState('');
  const [showSourceFields, setShowSourceFields] = useState(false);

  // Passage & Highlight Bulk Extractor state (ING-09)
  const [passageText, setPassageText] = useState('');
  const [passageSource, setPassageSource] = useState('');
  const [passageAuthor, setPassageAuthor] = useState('');
  const [passagePage, setPassagePage] = useState('');
  const [passageLanguage, setPassageLanguage] = useState<'auto' | 'en' | 'es'>('auto');
  const [isExtractingPassage, setIsExtractingPassage] = useState(false);
  const [extractedCandidates, setExtractedCandidates] = useState<
    ExtractedPassageCandidate[] | null
  >(null);
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, boolean>>({});
  const [isBatchSaving, setIsBatchSaving] = useState(false);
  const [batchSummary, setBatchSummary] = useState<{
    createdCount: number;
    mergedCount: number;
    message: string;
  } | null>(null);

  // Language selection & auto-detection
  const [selectedLanguage, setSelectedLanguage] = useState<'auto' | 'en' | 'es'>('auto');
  const [detectedLanguage, setDetectedLanguage] = useState<'en' | 'es'>('en');
  const effectiveLanguage: 'en' | 'es' =
    selectedLanguage === 'auto' ? detectedLanguage : selectedLanguage;

  // Dynamically detect language as user types or shared text is loaded
  useEffect(() => {
    const combined = `${term} ${contextSentence}`.trim();
    if (combined) {
      setDetectedLanguage(detectLanguage(combined));
    }
  }, [term, contextSentence]);

  // Processing state
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalLatency, setFinalLatency] = useState<number | null>(null);

  // Enrichment & deduplication results
  const [previewCard, setPreviewCard] = useState<VocabCard | null>(null);
  const [duplicateMatch, setDuplicateMatch] = useState<CardWithSrs | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Existing lexicon, for the live duplicate check
  const [existingCards, setExistingCards] = useState<CardWithSrs[]>([]);

  useEffect(() => {
    apiFetch<{ data: CardWithSrs[] }>('/api/cards')
      .then((payload) => setExistingCards(payload.data))
      .catch((err) => setErrorMessage(`Could not load your lexicon: ${errorMessageOf(err, 'unknown error')}`));
  }, []);

  // Live duplicate check as user types
  const checkDuplicate = (query: string): CardWithSrs | null => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return null;
    return existingCards.find((c) => c.term.toLowerCase() === trimmed) || null;
  };

  // Re-check once the lexicon arrives (e.g. a term pre-filled by the share target)
  useEffect(() => {
    if (existingCards.length > 0 && term.trim()) {
      setDuplicateMatch(checkDuplicate(term));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingCards]);

  const sourceCitation = () =>
    [source.trim(), author.trim(), page.trim()].filter(Boolean).join(' • ') || undefined;

  // Autofocus word input on mount & detect Android Web Share Target / mode params
  useEffect(() => {
    inputRef.current?.focus();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'passage') {
        setCaptureMode('passage');
      }
      const result = parseShareTargetPayload({
        text: params.get('text'),
        title: params.get('title'),
        url: params.get('url'),
        term: params.get('term'),
        q: params.get('q'),
        search: params.get('search'),
      });

      if (result.targetTerm) {
        setTerm(result.targetTerm);
        const dup = checkDuplicate(result.targetTerm);
        setDuplicateMatch(dup);
      }
      if (result.contextSentence) {
        setContextSentence(result.contextSentence);
      }
      if (result.author) {
        setAuthor(result.author);
        setShowSourceFields(true);
      }
      if (result.sourceTitle) {
        setSource(result.sourceTitle);
        setShowSourceFields(true);
      }
      if (result.page) {
        setPage(result.page);
        setShowSourceFields(true);
      }
    }
  }, []);

  // Latency timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      const startTime = performance.now();
      interval = setInterval(() => {
        setElapsedMs(Math.round(performance.now() - startTime));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    setErrorMessage(null);
    setSuccessMessage(null);
    const dup = checkDuplicate(value);
    setDuplicateMatch(dup);
  };

  const handleEnrich = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTerm = term.trim();
    if (!cleanTerm) {
      setErrorMessage('Please enter a word to enrich.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setPreviewCard(null);
    setFinalLatency(null);

    const startTime = performance.now();

    try {
      const json = await apiFetch<{ card?: any; data?: any }>('/api/enrich', {
        method: 'POST',
        body: JSON.stringify({
          term: cleanTerm,
          language: effectiveLanguage,
          contextSentence: contextSentence.trim() || undefined,
          source: source.trim() || undefined,
          author: author.trim() || undefined,
          page: page.trim() || undefined,
        }),
      });

      const raw = json.card || json.data;
      if (!raw || !raw.primary_definition) {
        throw new Error('Enrichment returned an incomplete entry.');
      }

      const enriched: VocabCard = {
        id: raw.id,
        user_id: raw.user_id,
        created_at: raw.created_at || new Date().toISOString(),
        term: raw.term || cleanTerm,
        language: raw.language || effectiveLanguage,
        gender: raw.gender || null,
        english_gloss: raw.english_gloss || null,
        part_of_speech: raw.part_of_speech || 'noun',
        phonetic: raw.phonetic || null,
        primary_definition: raw.primary_definition,
        nuance_note: raw.nuance_note || null,
        etymology: raw.etymology || { roots: [], cognates: [] },
        collocations: raw.collocations || [],
        source_context: {
          sentence: contextSentence.trim() || raw.source_context?.sentence || null,
          source: sourceCitation() || raw.source_context?.source || null,
          author: author.trim() || raw.source_context?.author || null,
          page: page.trim() || raw.source_context?.page || null,
          url: null,
        },
        cloze_sentences: raw.cloze_sentences || [],
        distinction_matrix: raw.distinction_matrix || null,
        is_fallback: Boolean(raw.is_fallback),
        enrichment_source: raw.enrichment_source,
        fallback_reason: raw.fallback_reason || undefined,
      };

      const latency = Math.round(performance.now() - startTime);
      setFinalLatency(latency);
      setPreviewCard(enriched);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Enrichment failed';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle ING-04: Append context sentence to existing card
  const handleAppendContext = async () => {
    if (!duplicateMatch) return;
    const cleanSentence = contextSentence.trim();
    if (!cleanSentence) {
      setErrorMessage('Please enter a context sentence to append.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      await apiFetch(`/api/cards/${duplicateMatch.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ sentence: cleanSentence, source: sourceCitation() }),
      });
      notifyCardsUpdated();
      setSuccessMessage(
        `Context sentence successfully appended to existing entry "${duplicateMatch.term}".`
      );
      setDuplicateMatch(null);
      setTerm('');
      setContextSentence('');
      setPreviewCard(null);
    } catch (err) {
      setErrorMessage(`Could not append context: ${errorMessageOf(err, 'unknown error')}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Save new card to lexicon. `force` saves even when the server reports a lemma variant.
  const handleSaveToLexicon = async (startReviewNow: boolean = false, force: boolean = false) => {
    if (!previewCard) return;

    setIsSaving(true);
    setErrorMessage(null);
    try {
      const { id: _id, user_id: _user, created_at: _created, ...content } = previewCard;
      const res = await apiFetch<{ data: CardWithSrs }>('/api/cards', {
        method: 'POST',
        body: JSON.stringify({ ...content, force }),
      });

      setExistingCards((prev) => [res.data, ...prev]);
      notifyCardsUpdated();
      setSuccessMessage(`"${res.data.term}" successfully saved to your personal Lexicon!`);
      setDuplicateMatch(null);
      setPreviewCard(null);
      setTerm('');
      setContextSentence('');

      if (startReviewNow) {
        router.push('/review');
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 409 && err.body?.existingCard) {
        setDuplicateMatch(err.body.existingCard);
      } else {
        setErrorMessage(`Could not save: ${errorMessageOf(err, 'unknown error')}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle ING-09: Extract C1/C2 candidates from a reading passage or book highlights
  const handleExtractPassage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPassage = passageText.trim();
    if (!cleanPassage) {
      setErrorMessage('Please paste a passage or reading highlights to extract vocabulary from.');
      return;
    }

    setIsExtractingPassage(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setBatchSummary(null);
    setExtractedCandidates(null);

    try {
      const res = await apiFetch<{
        data: {
          candidates: ExtractedPassageCandidate[];
          detectedLanguage: 'en' | 'es';
          parsedCitation?: {
            author?: string | null;
            source?: string | null;
            page?: string | null;
          };
          mode: 'gemini' | 'heuristic';
        };
      }>('/api/extract-passage', {
        method: 'POST',
        body: JSON.stringify({
          passage: cleanPassage,
          language: passageLanguage,
          source: passageSource.trim() || undefined,
          author: passageAuthor.trim() || undefined,
          maxCandidates: 8,
        }),
      });

      const candidates = res.data?.candidates || [];
      setExtractedCandidates(candidates);

      if (res.data?.parsedCitation) {
        if (!passageAuthor.trim() && res.data.parsedCitation.author) {
          setPassageAuthor(res.data.parsedCitation.author);
        }
        if (!passageSource.trim() && res.data.parsedCitation.source) {
          setPassageSource(res.data.parsedCitation.source);
        }
        if (!passagePage.trim() && res.data.parsedCitation.page) {
          setPassagePage(res.data.parsedCitation.page);
        }
      }

      // Default select all candidates
      const nextSelection: Record<string, boolean> = {};
      candidates.forEach((c) => {
        nextSelection[c.term] = true;
      });
      setSelectedCandidates(nextSelection);
    } catch (err) {
      setErrorMessage(errorMessageOf(err, 'Failed to extract vocabulary candidates from passage.'));
    } finally {
      setIsExtractingPassage(false);
    }
  };

  // Handle ING-09: Batch ingest selected extracted candidates into Lexicon
  const handleBatchIngest = async () => {
    if (!extractedCandidates) return;
    const chosen = extractedCandidates.filter((c) => selectedCandidates[c.term]);
    if (chosen.length === 0) {
      setErrorMessage('Please select at least one candidate word to ingest.');
      return;
    }

    setIsBatchSaving(true);
    setErrorMessage(null);
    try {
      const items = chosen.map((c) => ({
        term: c.term,
        contextSentence: c.contextSentence,
        source: passageSource.trim() || undefined,
        author: passageAuthor.trim() || undefined,
        page: passagePage.trim() || undefined,
        language: c.language,
        candidateData: {
          term: c.term,
          language: c.language,
          gender: (c.gender === 'invariable' ? 'neuter' : c.gender) || null,
          english_gloss: c.english_gloss || null,
          part_of_speech: c.part_of_speech,
          phonetic: c.phonetic,
          primary_definition: c.primary_definition,
          nuance_note: c.nuance_note,
          etymology: c.etymology,
          collocations: c.collocations,
          cloze_sentences: c.cloze_sentences,
          distinction_matrix: c.distinction_matrix || null,
        } as Partial<VocabCard>,
      }));

      const res = await apiFetch<{
        createdCount: number;
        mergedCount: number;
        data: CardWithSrs[];
        message: string;
      }>('/api/cards/batch', {
        method: 'POST',
        body: JSON.stringify({ items }),
      });

      notifyCardsUpdated();
      const updatedLexicon = await apiFetch<{ data: CardWithSrs[] }>('/api/cards');
      setExistingCards(updatedLexicon.data);

      setBatchSummary({
        createdCount: res.createdCount ?? 0,
        mergedCount: res.mergedCount ?? 0,
        message:
          res.message ||
          `Created ${res.createdCount ?? 0} new cards & merged ${res.mergedCount ?? 0} literary sightings.`,
      });
      setExtractedCandidates(null);
    } catch (err) {
      setErrorMessage(errorMessageOf(err, 'Batch ingestion failed.'));
    } finally {
      setIsBatchSaving(false);
    }
  };

  const selectedCandidateCount = extractedCandidates
    ? extractedCandidates.filter((c) => selectedCandidates[c.term]).length
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-[#e7e5e4] pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#834832] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ingestion Pipeline (ING-01 • ING-09)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917] tracking-tight">
            {captureMode === 'single'
              ? 'Quick Capture'
              : 'Passage & Highlight Extractor'}
          </h1>
          <p className="text-sm font-sans text-[#78716c]">
            {captureMode === 'single'
              ? 'Enter an unfamiliar word encountered in your reading. The pipeline parses morphological roots, nuance boundaries, collocations, and cloze drills within ≤ 2.5 seconds.'
              : 'Paste book highlights, Readwise/Kindle notes, or philosophical paragraphs to automatically extract C1/C2 vocabulary candidates and ingest them in bulk.'}
          </p>
        </div>

        {/* Mode Switcher Pill Bar */}
        <div className="inline-flex items-center rounded-xl border border-[#e7e5e4] p-1 bg-stone-100/80 text-xs font-sans">
          <button
            type="button"
            onClick={() => {
              setCaptureMode('single');
              setErrorMessage(null);
            }}
            className={cn(
              'px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 cursor-pointer',
              captureMode === 'single'
                ? 'bg-white text-[#834832] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Single Word Capture</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCaptureMode('passage');
              setErrorMessage(null);
            }}
            className={cn(
              'px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 cursor-pointer',
              captureMode === 'passage'
                ? 'bg-white text-[#834832] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Passage & Highlight Extractor (Bulk)</span>
          </button>
        </div>
      </div>

      {/* --- MODE 2: PASSAGE & HIGHLIGHT BULK EXTRACTOR (ING-09) --- */}
      {captureMode === 'passage' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white border border-[#e7e5e4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <form onSubmit={handleExtractPassage} className="space-y-5">
              {/* Textarea Header + Quick Sample Loaders */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label
                    htmlFor="passage-textarea"
                    className="block text-xs font-sans uppercase tracking-wider font-semibold text-[#57534e]"
                  >
                    Reading Passage, Kindle Highlights, or Seminar Excerpt{' '}
                    <span className="text-[#834832]">*</span>
                  </label>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setPassageText(ENGLISH_SAMPLE_PASSAGE);
                        setPassageAuthor('Jacques Derrida');
                        setPassageSource('Writing and Difference');
                        setPassagePage('p. 42');
                        setPassageLanguage('en');
                        setErrorMessage(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#fdf8f6] hover:bg-[#f2e8e5] border border-[#eaddd7] text-[11px] font-sans font-semibold text-[#834832] transition-colors cursor-pointer"
                    >
                      🇬🇧 Load English Philosophical Sample
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPassageText(SPANISH_SAMPLE_PASSAGE);
                        setPassageAuthor('Jorge Luis Borges');
                        setPassageSource('Ficciones');
                        setPassagePage('p. 88');
                        setPassageLanguage('es');
                        setErrorMessage(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#fdf8f6] hover:bg-[#f2e8e5] border border-[#eaddd7] text-[11px] font-sans font-semibold text-[#834832] transition-colors cursor-pointer"
                    >
                      🇪🇸 Load Spanish Literary Sample
                    </button>
                  </div>
                </div>

                <textarea
                  id="passage-textarea"
                  rows={6}
                  value={passageText}
                  onChange={(e) => setPassageText(e.target.value)}
                  disabled={isExtractingPassage}
                  placeholder="Paste a paragraph from an essay, book highlight, or literary text. Lexis will identify C1/C2 candidate words, lemmatize them, and preserve the exact sentence sighting..."
                  className="w-full text-sm sm:text-base font-serif text-[#1c1917] bg-[#fdf8f6]/40 border border-[#e7e5e4] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#834832] transition-all leading-relaxed placeholder:text-[#a8a29e]"
                />
              </div>

              {/* Shared Source Metadata & Language Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#fdf8f6]/70 border border-[#eaddd7] rounded-xl">
                <div className="space-y-1">
                  <label
                    htmlFor="passage-source"
                    className="block text-[11px] font-sans font-semibold text-[#78716c] uppercase"
                  >
                    Source Title (Book / Essay)
                  </label>
                  <input
                    id="passage-source"
                    type="text"
                    value={passageSource}
                    onChange={(e) => setPassageSource(e.target.value)}
                    placeholder="e.g. Writing and Difference"
                    className="w-full text-xs font-serif text-[#1c1917] bg-white border border-[#e7e5e4] rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#834832]"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="passage-author"
                    className="block text-[11px] font-sans font-semibold text-[#78716c] uppercase"
                  >
                    Author
                  </label>
                  <input
                    id="passage-author"
                    type="text"
                    value={passageAuthor}
                    onChange={(e) => setPassageAuthor(e.target.value)}
                    placeholder="e.g. Jacques Derrida"
                    className="w-full text-xs font-serif text-[#1c1917] bg-white border border-[#e7e5e4] rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#834832]"
                  />
                </div>

                <div className="space-y-1">
                  <span className="block text-[11px] font-sans font-semibold text-[#78716c] uppercase">
                    Language
                  </span>
                  <div className="flex items-center gap-1 bg-white border border-[#e7e5e4] rounded-lg p-1">
                    {(['auto', 'en', 'es'] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setPassageLanguage(lang)}
                        className={cn(
                          'flex-1 py-1 rounded text-[11px] font-sans font-semibold transition-all cursor-pointer',
                          passageLanguage === lang
                            ? 'bg-[#834832] text-white'
                            : 'text-stone-600 hover:text-stone-900'
                        )}
                      >
                        {lang === 'auto' ? 'Auto' : lang === 'en' ? '🇬🇧 EN' : '🇪🇸 ES'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="text-xs font-sans text-stone-500">
                  Extracts up to 8 high-register lemmas with context sightings
                </span>

                <button
                  type="submit"
                  disabled={isExtractingPassage || !passageText.trim()}
                  className="px-6 py-3 rounded-xl bg-[#834832] hover:bg-[#693522] text-white text-sm font-sans font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isExtractingPassage ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Extracting C1/C2 Candidates…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Extract C1/C2 Candidates</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Batch Ingestion Completion Banner */}
          {batchSummary && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-emerald-950 shadow-xs animate-in fade-in">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-sans font-bold">
                    Created {batchSummary.createdCount} new cards &amp; merged{' '}
                    {batchSummary.mergedCount} literary sightings
                  </h3>
                  <p className="text-xs font-sans text-emerald-800">
                    {batchSummary.message}
                  </p>
                </div>
              </div>

              <Link
                href="/review"
                className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-sans font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-center shrink-0"
              >
                <span>Drill Newly Captured Words</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Extracted Candidates Selection Grid */}
          {extractedCandidates && (
            <div className="bg-white border border-[#e7e5e4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-xl font-serif font-bold text-[#1c1917]">
                    Extracted {extractedCandidates.length} High-Register Candidates
                  </h2>
                  <p className="text-xs font-sans text-stone-500">
                    {selectedCandidateCount} of {extractedCandidates.length} candidates selected for batch ingestion
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const all: Record<string, boolean> = {};
                      extractedCandidates.forEach((c) => {
                        all[c.term] = true;
                      });
                      setSelectedCandidates(all);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-sans font-medium text-stone-700 cursor-pointer"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCandidates({})}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-sans font-medium text-stone-700 cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {extractedCandidates.length === 0 ? (
                <p className="text-sm font-sans text-stone-500 py-8 text-center">
                  No C1/C2 candidate terms were detected in this passage. Try pasting a longer literary or academic excerpt.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {extractedCandidates.map((cand) => {
                      const isChecked = Boolean(selectedCandidates[cand.term]);
                      return (
                        <div
                          key={cand.term}
                          onClick={() =>
                            setSelectedCandidates((prev) => ({
                              ...prev,
                              [cand.term]: !prev[cand.term],
                            }))
                          }
                          className={cn(
                            'p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3',
                            isChecked
                              ? 'border-[#834832] bg-[#fdf8f6]/50 ring-1 ring-[#834832]/20'
                              : 'border-stone-200 bg-white opacity-70 hover:opacity-100'
                          )}
                        >
                          <div
                            className={cn(
                              'w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-colors',
                              isChecked
                                ? 'bg-[#834832] border-[#834832] text-white'
                                : 'bg-white border-stone-300'
                            )}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div className="flex items-baseline gap-1.5 flex-wrap">
                                <h3 className="font-serif font-bold text-lg text-[#1c1917] capitalize">
                                  {cand.term}
                                </h3>
                                {cand.phonetic && (
                                  <span className="text-[11px] font-mono text-stone-500">
                                    {cand.phonetic}
                                  </span>
                                )}
                                <span className="text-[10px] font-sans font-bold uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                                  {cand.language === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}
                                </span>
                                <span className="text-[11px] font-sans font-medium text-[#834832]">
                                  {cand.part_of_speech}
                                </span>
                              </div>

                              {cand.alreadyExists ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                                  In Lexicon • Append Sighting
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                  New Card
                                </span>
                              )}
                            </div>

                            <p className="text-xs font-serif text-[#1c1917] leading-relaxed">
                              {cand.primary_definition}
                            </p>

                            {cand.etymology?.roots?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {cand.etymology.roots.map((r, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-[10px] font-sans text-stone-700"
                                  >
                                    <strong>{r.origin}</strong>: <em>{r.morpheme}</em> (“{r.meaning}”)
                                  </span>
                                ))}
                              </div>
                            )}

                            {cand.contextSentence && (
                              <blockquote className="text-[11px] font-serif italic text-stone-600 border-l-2 border-[#834832]/40 pl-2.5 line-clamp-2">
                                “{cand.contextSentence}”
                              </blockquote>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Sticky / Prominent Bottom CTA Bar */}
                  <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs font-sans text-stone-600">
                      Novel words will be created with full FSRS schedules; existing words will have this literary sighting appended.
                    </span>

                    <button
                      type="button"
                      disabled={isBatchSaving || selectedCandidateCount === 0}
                      onClick={handleBatchIngest}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#834832] hover:bg-[#693522] text-white text-xs font-sans font-semibold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isBatchSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Ingesting Selected Words…</span>
                        </>
                      ) : (
                        <>
                          <span>
                            Ingest {selectedCandidateCount} Selected{' '}
                            {selectedCandidateCount === 1 ? 'Word' : 'Words'} into Lexicon
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- MODE 1: SINGLE WORD CAPTURE --- */}
      {captureMode === 'single' && (
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleEnrich} className="space-y-5">
          {/* Word Input & Language Pill Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label
                htmlFor="term-input"
                className="block text-xs font-sans uppercase tracking-wider font-semibold text-[#57534e]"
              >
                Target Word or Lemma <span className="text-[#834832]">*</span>
              </label>

              {/* Language Selection Pill Toggle */}
              <div className="inline-flex items-center rounded-lg border border-[#e7e5e4] p-0.5 bg-[#fdf8f6]/80 text-xs font-sans">
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('auto')}
                  className={cn(
                    'px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5',
                    selectedLanguage === 'auto'
                      ? 'bg-white text-[#834832] shadow-xs font-semibold'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  )}
                >
                  <span>Auto</span>
                  {selectedLanguage === 'auto' && (
                    <span className="text-[10px] font-normal text-[#834832]/80">
                      ({detectedLanguage === 'es' ? '🇪🇸 Español' : '🇬🇧 English'})
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLanguage('en')}
                  className={cn(
                    'px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1',
                    selectedLanguage === 'en'
                      ? 'bg-white text-[#834832] shadow-xs font-semibold'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  )}
                >
                  <span>🇬🇧 English</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLanguage('es')}
                  className={cn(
                    'px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1',
                    selectedLanguage === 'es'
                      ? 'bg-white text-[#834832] shadow-xs font-semibold'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  )}
                >
                  <span>🇪🇸 Español</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                ref={inputRef}
                id="term-input"
                type="text"
                autoComplete="off"
                value={term}
                onChange={handleTermChange}
                disabled={isLoading}
                placeholder={
                  effectiveLanguage === 'es'
                    ? 'p. ej. desahuciado, soledad, desasosiego'
                    : 'e.g. pellucid, hermeneutic, sesquipedalian'
                }
                className="w-full text-xl sm:text-2xl font-serif text-[#1c1917] bg-[#fdf8f6]/50 border border-[#e7e5e4] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#834832] focus:border-transparent transition-all placeholder:text-[#a8a29e]"
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-xs font-mono text-[#834832]">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#834832]" />
                  <span>{(elapsedMs / 1000).toFixed(1)}s</span>
                </div>
              )}
            </div>
          </div>

          {/* Context Sentence (Optional) */}
          <div className="space-y-2">
            <label
              htmlFor="context-input"
              className="block text-xs font-sans uppercase tracking-wider font-semibold text-[#57534e] flex items-center justify-between"
            >
              <span>Source Context Sentence (Optional)</span>
              <span className="text-[11px] font-normal text-[#a8a29e] lowercase">
                Helps tailor nuance and cloze context
              </span>
            </label>
            <textarea
              id="context-input"
              rows={3}
              value={contextSentence}
              onChange={(e) => setContextSentence(e.target.value)}
              disabled={isLoading}
              placeholder="e.g. Her prose was so pellucid that even the most Byzantine philosophical abstractions seemed immediately graspable."
              className="w-full text-sm font-serif text-[#1c1917] bg-[#fdf8f6]/30 border border-[#e7e5e4] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#834832] focus:border-transparent transition-all placeholder:text-[#a8a29e]"
            />
          </div>

          {/* Reading Source & Citation (Zotero) */}
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={() => setShowSourceFields((prev) => !prev)}
              className="text-xs font-sans font-medium text-[#834832] hover:text-[#693522] flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {showSourceFields ? 'Hide Citation & Reading Source' : '+ Add Reading Source / Zotero Citation'}
              </span>
            </button>

            {showSourceFields && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#fdf8f6]/70 border border-[#eaddd7] rounded-xl animate-in fade-in">
                <div className="space-y-1 sm:col-span-1">
                  <label htmlFor="source-author" className="block text-[11px] font-sans font-semibold text-[#78716c] uppercase">
                    Author
                  </label>
                  <input
                    id="source-author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Theodor Adorno"
                    className="w-full text-xs font-serif text-[#1c1917] bg-white border border-[#e7e5e4] rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#834832]"
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label htmlFor="source-title" className="block text-[11px] font-sans font-semibold text-[#78716c] uppercase">
                    Book / Article Title
                  </label>
                  <input
                    id="source-title"
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. Negative Dialectics"
                    className="w-full text-xs font-serif text-[#1c1917] bg-white border border-[#e7e5e4] rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#834832]"
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label htmlFor="source-page" className="block text-[11px] font-sans font-semibold text-[#78716c] uppercase">
                    Page / Location
                  </label>
                  <input
                    id="source-page"
                    type="text"
                    value={page}
                    onChange={(e) => setPage(e.target.value)}
                    placeholder="e.g. p. 112"
                    className="w-full text-xs font-serif text-[#1c1917] bg-white border border-[#e7e5e4] rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#834832]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-sans text-[#78716c]">
              <Timer className="w-3.5 h-3.5 text-[#834832]" />
              <span>Target Latency: ≤ 2.5s</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !term.trim()}
              className={cn(
                'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-sans text-sm font-semibold text-white transition-all shadow-sm',
                isLoading || !term.trim()
                  ? 'bg-[#d2bab0] cursor-not-allowed opacity-70'
                  : 'bg-[#834832] hover:bg-[#693522] active:scale-98 shadow-[#834832]/20'
              )}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Enriching Morphology...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Enrich Word & Generate Drills</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      )}

      {/* ING-04: Deduplication Alert Banner */}
      {duplicateMatch && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="font-sans font-semibold text-sm text-amber-900">
                Deduplication Notice (ING-04)
              </h2>
              <p className="font-sans text-xs text-amber-800 leading-relaxed">
                <strong className="font-serif text-sm capitalize">"{duplicateMatch.term}"</strong> already
                exists in your personal lexicon (added{' '}
                {new Date(duplicateMatch.created_at).toLocaleDateString()}). Rather than creating a duplicate
                card, you can append your new context sentence to deepen recall.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1 pl-8">
            <button
              type="button"
              onClick={handleAppendContext}
              disabled={!contextSentence.trim() || isSaving}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-sans font-semibold transition-all flex items-center gap-1.5 shadow-sm',
                contextSentence.trim()
                  ? 'bg-amber-800 text-white hover:bg-amber-900'
                  : 'bg-amber-200 text-amber-600 cursor-not-allowed'
              )}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Append Context Sentence</span>
            </button>
            {previewCard &&
              previewCard.term.toLowerCase() !== duplicateMatch.term.toLowerCase() && (
                <button
                  type="button"
                  onClick={() => handleSaveToLexicon(false, true)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg text-xs font-sans font-semibold border border-amber-300 text-amber-900 hover:bg-amber-100 transition-all"
                >
                  Save &ldquo;{previewCard.term}&rdquo; as a separate word
                </button>
              )}
            <span className="text-[11px] font-sans text-amber-700">
              {!contextSentence.trim() && '(Type a context sentence above to append)'}
            </span>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-sans font-medium">{successMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span className="text-sm font-sans">{errorMessage}</span>
        </div>
      )}

      {/* Rich Preview Card */}
      {previewCard && (
        <div className="bg-white border-2 border-[#834832]/30 rounded-2xl p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in slide-in-from-bottom-3">
          {/* Card Top / Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#e7e5e4] pb-4">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <h2 className="text-3xl font-serif font-bold text-[#1c1917] capitalize">
                  {previewCard.term}
                </h2>
                {previewCard.phonetic && (
                  <span className="text-sm font-mono text-[#78716c]">
                    {previewCard.phonetic}
                  </span>
                )}
                {/* Language Badge */}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                  {previewCard.language === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                </span>
                {/* Part of Speech */}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-[#834832]/10 text-[#834832]">
                  {previewCard.part_of_speech}
                </span>
                {/* Distinctive Grammatical Gender Badge (Spanish) */}
                {previewCard.language === 'es' && previewCard.gender && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-amber-50 text-amber-900 border border-amber-300">
                    {formatGenderBadge(previewCard.gender, previewCard.part_of_speech)?.fullBadge || previewCard.gender}
                  </span>
                )}
              </div>
            </div>

            {previewCard.is_fallback ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-amber-50 text-amber-900 border border-amber-300 self-start">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>{fallbackSourceLabel(previewCard.enrichment_source)}</span>
              </div>
            ) : finalLatency !== null ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 self-start">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enriched in {(finalLatency / 1000).toFixed(2)}s</span>
              </div>
            ) : null}
          </div>

          {/* Fallback Notice Banner */}
          {previewCard.is_fallback && (
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs font-sans text-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="leading-relaxed">
                <strong>Notice:</strong>{' '}
                {previewCard.fallback_reason
                  ? previewCard.fallback_reason
                  : 'AI service offline or unconfigured on Vercel. Definition retrieved via factual dictionary fallback.'}
              </span>
              <a
                href="/api/diagnostic?enrichment=true"
                target="_blank"
                rel="noreferrer"
                className="underline font-semibold text-amber-900 shrink-0 hover:text-amber-700 inline-flex items-center gap-1"
              >
                Inspect Diagnostics →
              </a>
            </div>
          )}

          {/* Primary Definition */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-sans uppercase tracking-wider text-[#78716c] font-semibold">
              Primary Definition
            </h3>
            <p className="text-lg font-serif text-[#1c1917] leading-relaxed">
              {previewCard.primary_definition}
            </p>
          </div>

          {/* English Anchor / Gloss Callout (Spanish cards) */}
          {previewCard.language === 'es' && previewCard.english_gloss && (
            <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-4 space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#0369a1] uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>English Anchor / Gloss</span>
              </div>
              <p className="text-base font-serif italic text-[#0c4a6e] font-medium leading-relaxed">
                “{previewCard.english_gloss}”
              </p>
            </div>
          )}

          {/* Connotative Nuance Badge */}
          {previewCard.nuance_note && (
            <div className="bg-[#fdf8f6] border border-[#eaddd7] rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#834832] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Connotative Nuance & Register</span>
              </div>
              <p className="text-sm font-serif italic text-[#4f2416] leading-relaxed">
                "{previewCard.nuance_note}"
              </p>
            </div>
          )}

          {/* Etymological Tree Roots */}
          {previewCard.etymology && previewCard.etymology.roots?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#78716c] font-semibold">
                <GitBranch className="w-3.5 h-3.5 text-[#834832]" />
                <span>Etymological Roots & Morphemes</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {previewCard.etymology.roots.map((root, idx) => {
                  const origLower = (root.origin || '').toLowerCase();
                  const isArabic = origLower.includes('árabe') || origLower.includes('arabe') || origLower.includes('arabic');
                  const isGreek = origLower.includes('griego') || origLower.includes('greek');
                  const isLatin = origLower.includes('lat') || origLower.includes('latín');

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs font-sans"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'px-1.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase',
                            isArabic
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isGreek
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : isLatin
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-stone-200 text-stone-700'
                          )}
                        >
                          {root.origin}
                        </span>
                        <span className="font-serif italic font-bold text-sm text-[#1c1917]">
                          {root.morpheme}
                        </span>
                      </div>
                      <span className="text-[#57534e]">“{root.meaning}”</span>
                    </div>
                  );
                })}
              </div>

              {previewCard.etymology.cognates?.length > 0 && (
                <div className="pt-1 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-sans text-[#78716c]">Cognates:</span>
                  {previewCard.etymology.cognates.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full text-xs font-serif bg-stone-100 text-stone-700 border border-stone-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Collocations */}
          {previewCard.collocations?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#78716c] font-semibold">
                <Layers className="w-3.5 h-3.5 text-[#834832]" />
                <span>Idiomatic Collocations</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {previewCard.collocations.map((col, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-sans font-medium bg-[#f2e8e5] text-[#693522] border border-[#eaddd7]"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Generated Cloze Sentence */}
          {previewCard.cloze_sentences?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#78716c] font-semibold">
                <Quote className="w-3.5 h-3.5 text-[#834832]" />
                <span>Generated Cloze Drill Preview</span>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 font-serif text-sm leading-relaxed text-[#1c1917]">
                {previewCard.cloze_sentences[0].split(/({{[^}]+}})/g).map((part, i) => {
                  if (part.startsWith('{{') && part.endsWith('}}')) {
                    return (
                      <span
                        key={i}
                        className="px-2 py-0.5 mx-1 font-mono font-bold text-xs rounded bg-[#834832] text-white"
                      >
                        [ {extractClozeToken(part)} ]
                      </span>
                    );
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            </div>
          )}

          {/* Save Action Buttons */}
          <div className="pt-4 border-t border-[#e7e5e4] flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setPreviewCard(null)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs font-sans font-medium transition-colors"
            >
              Discard Preview
            </button>
            <button
              type="button"
              onClick={() => handleSaveToLexicon(false)}
              disabled={isSaving}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#834832] hover:bg-[#693522] text-white text-xs font-sans font-semibold transition-all shadow-sm shadow-[#834832]/20"
            >
              Save to Personal Lexicon
            </button>
            <button
              type="button"
              onClick={() => handleSaveToLexicon(true)}
              disabled={isSaving}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#36160b] hover:bg-[#1c1917] text-white text-xs font-sans font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Save & Review Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
