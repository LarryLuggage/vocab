'use client';

import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { VocabCard, CardWithSrs } from '@/types/lexis';
import { createInitialSrsCard } from '@/lib/fsrs';
import {
  getClientCards,
  addOrUpdateClientCard,
} from '@/lib/sample-data';
import { enrichWordClientFallback } from '@/lib/enrichment-fallback';
import { parseZoteroCitation } from '@/lib/zotero-parser';
import { cn } from '@/lib/utils';

export default function QuickCapturePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Form inputs
  const [term, setTerm] = useState('');
  const [contextSentence, setContextSentence] = useState('');
  const [source, setSource] = useState('');
  const [author, setAuthor] = useState('');
  const [page, setPage] = useState('');
  const [showSourceFields, setShowSourceFields] = useState(false);

  // Processing state
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalLatency, setFinalLatency] = useState<number | null>(null);

  // Enrichment & deduplication results
  const [previewCard, setPreviewCard] = useState<VocabCard | null>(null);
  const [duplicateMatch, setDuplicateMatch] = useState<CardWithSrs | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Autofocus word input on mount & detect Android Web Share Target params
  useEffect(() => {
    inputRef.current?.focus();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const incomingText = params.get('text');
      const incomingTitle = params.get('title');
      const incomingUrl = params.get('url');

      if (incomingText) {
        const parsed = parseZoteroCitation(incomingText);
        if (parsed.targetTerm) {
          setTerm(parsed.targetTerm);
        } else if (!incomingText.includes(' ') && incomingText.length > 1) {
          setTerm(incomingText);
        }
        if (parsed.cleanedSentence && parsed.cleanedSentence !== parsed.targetTerm) {
          setContextSentence(parsed.cleanedSentence);
        }
        if (parsed.author) {
          setAuthor(parsed.author);
          setShowSourceFields(true);
        }
        if (parsed.sourceTitle) {
          setSource(parsed.sourceTitle);
          setShowSourceFields(true);
        } else if (incomingTitle) {
          setSource(incomingTitle);
          setShowSourceFields(true);
        }
        if (parsed.page) {
          setPage(parsed.page);
          setShowSourceFields(true);
        }
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

  // Live duplicate check as user types
  const checkDuplicate = (query: string): CardWithSrs | null => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return null;
    const cards = getClientCards();
    return cards.find((c) => c.term.toLowerCase() === trimmed) || null;
  };

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
      let enriched: VocabCard | null = null;

      // Try calling server endpoint /api/enrich
      try {
        const res = await fetch('/api/enrich', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            term: cleanTerm,
            contextSentence: contextSentence.trim() || undefined,
            source: source.trim() || undefined,
            author: author.trim() || undefined,
            page: page.trim() || undefined,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const raw = json.card || json.data || (json.term ? json : null);
          if (raw && (raw.term || raw.primary_definition)) {
            enriched = {
              id: raw.id || `card-${(raw.term || cleanTerm).toLowerCase()}-${Date.now()}`,
              user_id: raw.user_id || 'default-user',
              created_at: raw.created_at || new Date().toISOString(),
              term: raw.term || cleanTerm,
              part_of_speech: raw.part_of_speech || 'noun',
              phonetic: raw.phonetic || null,
              primary_definition: raw.primary_definition || '',
              nuance_note: raw.nuance_note || null,
              etymology: raw.etymology || { roots: [], cognates: [] },
              collocations: raw.collocations || [],
              source_context: {
                sentence: contextSentence.trim() || raw.source_context?.sentence || null,
                source: source.trim() || raw.source_context?.source || null,
                author: author.trim() || raw.source_context?.author || null,
                page: page.trim() || raw.source_context?.page || null,
                url: null,
              },
              cloze_sentences: raw.cloze_sentences || [],
              distinction_matrix: raw.distinction_matrix || null,
              is_fallback: Boolean(raw.is_fallback),
              enrichment_source: raw.enrichment_source || (raw.is_fallback ? 'dictionary' : 'gemini'),
              fallback_reason: raw.fallback_reason || null,
            };
          }
        }
      } catch {
        // Network / server not available - fallback gracefully
      }

      // If backend was not reached or returned incomplete data, use smart client fallback
      if (!enriched || !enriched.primary_definition) {
        // Add small realistic delay to showcase the smooth latency gauge
        await new Promise((r) => setTimeout(r, 650));
        enriched = await enrichWordClientFallback(cleanTerm, contextSentence.trim());
      }

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
  const handleAppendContext = () => {
    if (!duplicateMatch) return;
    const cleanSentence = contextSentence.trim();
    if (!cleanSentence) {
      setErrorMessage('Please enter a context sentence to append.');
      return;
    }

    const updatedCard: CardWithSrs = {
      ...duplicateMatch,
      cloze_sentences: [
        ...duplicateMatch.cloze_sentences,
        cleanSentence.replace(new RegExp(`\\b${duplicateMatch.term}\\b`, 'gi'), `{{${duplicateMatch.term}}}`),
      ],
      source_context: {
        sentence: cleanSentence,
        source: duplicateMatch.source_context?.source || 'Appended Reader Context',
      },
    };

    addOrUpdateClientCard(updatedCard);
    window.dispatchEvent(new Event('lexis-cards-updated'));

    // Attempt background persistence to Supabase API
    try {
      fetch(`/api/cards/${duplicateMatch.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: cleanSentence }),
      }).catch(() => {});
    } catch {
      // offline safe
    }

    setSuccessMessage(
      `Context sentence successfully appended to existing entry "${duplicateMatch.term}".`
    );
    setDuplicateMatch(null);
    setTerm('');
    setContextSentence('');
    setPreviewCard(null);
  };

  // Save new card to lexicon
  const handleSaveToLexicon = (startReviewNow: boolean = false) => {
    if (!previewCard) return;

    const initialSrs = createInitialSrsCard(previewCard.id, previewCard.user_id);
    const cardWithSrs: CardWithSrs = {
      ...previewCard,
      srs: initialSrs,
    };

    addOrUpdateClientCard(cardWithSrs);
    window.dispatchEvent(new Event('lexis-cards-updated'));

    // Attempt background persistence to Supabase API
    try {
      fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card: previewCard,
          srs: initialSrs,
        }),
      }).catch(() => {});
    } catch {
      // offline safe
    }

    setSuccessMessage(`"${previewCard.term}" successfully saved to your personal Lexicon!`);
    setPreviewCard(null);
    setTerm('');
    setContextSentence('');

    if (startReviewNow) {
      router.push('/review');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="space-y-1.5 border-b border-[#e7e5e4] pb-4">
        <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#834832] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ingestion Pipeline (ING-01)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917] tracking-tight">
          Quick Capture
        </h1>
        <p className="text-sm font-sans text-[#78716c]">
          Enter an unfamiliar word encountered in your reading. The pipeline parses morphological roots,
          nuance boundaries, collocations, and cloze drills within ≤ 2.5 seconds.
        </p>
      </div>

      {/* Capture Input Card */}
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleEnrich} className="space-y-5">
          {/* Word Input */}
          <div className="space-y-2">
            <label
              htmlFor="term-input"
              className="block text-xs font-sans uppercase tracking-wider font-semibold text-[#57534e]"
            >
              Target Word or Lemma <span className="text-[#834832]">*</span>
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="term-input"
                type="text"
                autoComplete="off"
                value={term}
                onChange={handleTermChange}
                disabled={isLoading}
                placeholder="e.g. pellucid, hermeneutic, sesquipedalian"
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
              disabled={!contextSentence.trim()}
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
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl font-serif font-bold text-[#1c1917] capitalize">
                  {previewCard.term}
                </h2>
                {previewCard.phonetic && (
                  <span className="text-sm font-mono text-[#78716c]">
                    {previewCard.phonetic}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-[#834832]/10 text-[#834832]">
                  {previewCard.part_of_speech}
                </span>
              </div>
            </div>

            {previewCard.is_fallback ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-amber-50 text-amber-900 border border-amber-300 self-start">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>
                  {previewCard.enrichment_source === 'dictionary'
                    ? 'Dictionary Fallback'
                    : 'Offline Fallback'}
                </span>
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
                <strong>Notice:</strong> AI service offline or unconfigured on Vercel. Definition retrieved via factual dictionary fallback.
              </span>
              <a
                href="/api/diagnostic"
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
                {previewCard.etymology.roots.map((root, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs font-sans"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-mono text-[10px] font-bold">
                        {root.origin}
                      </span>
                      <span className="font-serif italic font-bold text-sm text-[#1c1917]">
                        {root.morpheme}
                      </span>
                    </div>
                    <span className="text-[#57534e]">“{root.meaning}”</span>
                  </div>
                ))}
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
                        [ {part.slice(2, -2)} ]
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
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#834832] hover:bg-[#693522] text-white text-xs font-sans font-semibold transition-all shadow-sm shadow-[#834832]/20"
            >
              Save to Personal Lexicon
            </button>
            <button
              type="button"
              onClick={() => handleSaveToLexicon(true)}
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
