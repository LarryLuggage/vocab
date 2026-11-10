'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Feather,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Download,
  Eye,
  Clock,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import {
  CardWithSrs,
  ProsePolishResult,
  ProductionLogWithCard,
} from '@/types/lexis';
import { apiFetch, errorMessageOf, notifyCardsUpdated } from '@/lib/api-client';
import { cn } from '@/lib/utils';

export interface WritingPortfolioProps {
  cards: CardWithSrs[];
  onInspectCard: (cardId: string) => void;
}

const SAMPLE_ENGLISH_DRAFT =
  'Modern political arguments often seem short-lived and unclear, driven by stubborn partisanship rather than calm reflection. Even when a speaker sounds fluent on the surface, the underlying claim can be false or rambling, leaving readers searching for a more lasting and careful interpretation of public life.';

const SAMPLE_SPANISH_DRAFT =
  'En la literatura moderna, la belleza parece algo pasajero y a veces incomprensible para el lector apresurado. Frente al ruido cotidiano y el discurso vacío, el autor busca un sentido oculto y profundo que rescate la memoria antes de caer en el olvido.';

export function WritingPortfolio({ cards, onInspectCard }: WritingPortfolioProps) {
  // Section 1: Prose Polisher state
  const [draft, setDraft] = useState('');
  const [selectedLang, setSelectedLang] = useState<'auto' | 'en' | 'es'>('auto');
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishError, setPolishError] = useState<string | null>(null);
  const [polishResult, setPolishResult] = useState<ProsePolishResult | null>(null);
  const [copiedElevated, setCopiedElevated] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitSuccessMessage, setCommitSuccessMessage] = useState<string | null>(null);

  // Section 2: Chronological Production Archive state
  const [logs, setLogs] = useState<ProductionLogWithCard[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [archiveLangFilter, setArchiveLangFilter] = useState<'all' | 'en' | 'es'>('all');
  const [archiveStatusFilter, setArchiveStatusFilter] = useState<'all' | 'pass' | 'polish'>('all');

  const fetchProductionLogs = useCallback(async () => {
    setIsLoadingLogs(true);
    setLogsError(null);
    try {
      const rawRes = await apiFetch<
        { data?: ProductionLogWithCard[]; logs?: ProductionLogWithCard[] } | ProductionLogWithCard[]
      >('/api/production-logs');
      const items = Array.isArray(rawRes)
        ? rawRes
        : Array.isArray(rawRes?.data)
        ? rawRes.data
        : Array.isArray(rawRes?.logs)
        ? rawRes.logs
        : [];
      setLogs(items);
    } catch (err) {
      setLogsError(errorMessageOf(err, 'Failed to load production archive.'));
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    fetchProductionLogs();
  }, [fetchProductionLogs]);

  // Enrich logs with fallback card lookup from `cards` prop if needed
  const enrichedLogs = useMemo(() => {
    const cardMap = new Map(cards.map((c) => [c.id, c]));
    return logs.map((log) => {
      if (log.card && log.card.term) return log;
      const found = cardMap.get(log.card_id);
      if (!found) return log;
      return {
        ...log,
        card: {
          id: found.id,
          term: found.term,
          language: found.language,
          part_of_speech: found.part_of_speech,
          primary_definition: found.primary_definition,
          phonetic: found.phonetic,
        },
      };
    });
  }, [logs, cards]);

  // Filtered production logs
  const filteredLogs = useMemo(() => {
    return enrichedLogs.filter((log) => {
      if (archiveLangFilter !== 'all') {
        const logLang = log.card?.language || 'en';
        if (logLang !== archiveLangFilter) return false;
      }
      if (archiveStatusFilter === 'pass') {
        if (log.evaluation_status !== 'pass') return false;
      } else if (archiveStatusFilter === 'polish') {
        if (log.evaluation_status === 'pass') return false;
      }
      return true;
    });
  }, [enrichedLogs, archiveLangFilter, archiveStatusFilter]);

  const handleLoadSample = (lang: 'en' | 'es') => {
    setPolishError(null);
    setCommitSuccessMessage(null);
    if (lang === 'en') {
      setDraft(SAMPLE_ENGLISH_DRAFT);
      setSelectedLang('en');
    } else {
      setDraft(SAMPLE_SPANISH_DRAFT);
      setSelectedLang('es');
    }
  };

  const handlePolishProse = async () => {
    if (!draft.trim() || isPolishing) return;
    setIsPolishing(true);
    setPolishError(null);
    setCommitSuccessMessage(null);

    try {
      const payload: { draft: string; language?: 'en' | 'es' } = {
        draft: draft.trim(),
      };
      if (selectedLang !== 'auto') {
        payload.language = selectedLang;
      }

      const rawRes = await apiFetch<{ data?: ProsePolishResult } & Partial<ProsePolishResult>>(
        '/api/polish-prose',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      const result: ProsePolishResult =
        rawRes && typeof rawRes === 'object' && 'data' in rawRes && rawRes.data
          ? rawRes.data
          : (rawRes as ProsePolishResult);

      setPolishResult(result);
    } catch (err) {
      setPolishError(errorMessageOf(err, 'Failed to analyze and polish your draft.'));
    } finally {
      setIsPolishing(false);
    }
  };

  const handleCopyElevated = async () => {
    if (!polishResult?.elevatedDraft) return;
    try {
      await navigator.clipboard.writeText(polishResult.elevatedDraft);
      setCopiedElevated(true);
      setTimeout(() => setCopiedElevated(false), 2500);
    } catch {
      // Ignore clipboard failures in restricted contexts
    }
  };

  const handleCommitRevision = async () => {
    if (!polishResult || isCommitting) return;
    setIsCommitting(true);
    setPolishError(null);
    setCommitSuccessMessage(null);

    try {
      const commitIds =
        polishResult.suggestions.length > 0
          ? polishResult.suggestions.map((s) => s.cardId)
          : cards[0]
          ? [cards[0].id]
          : [];

      await apiFetch('/api/polish-prose', {
        method: 'POST',
        body: JSON.stringify({
          commitCardIds: commitIds,
          committedDraft: polishResult.elevatedDraft,
        }),
      });

      notifyCardsUpdated();
      await fetchProductionLogs();
      setCommitSuccessMessage(
        `Committed elevated revision to your Writing Portfolio (${commitIds.length} lexicon ${
          commitIds.length === 1 ? 'entry' : 'entries'
        } credited).`
      );
    } catch (err) {
      setPolishError(errorMessageOf(err, 'Failed to commit revision to portfolio.'));
    } finally {
      setIsCommitting(false);
    }
  };

  const handleExportPortfolioMarkdown = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const header = [
      `# Lexis Engine — Personal Writing & Active Production Portfolio`,
      `- **Exported**: ${dateStr}`,
      `- **Total Logged Compositions**: ${enrichedLogs.length}`,
      ``,
      `---`,
      ``,
    ];

    const entries = enrichedLogs.map((log, index) => {
      const termLabel = log.card?.term ? `**${log.card.term}** (${log.card.part_of_speech})` : `Card \`${log.card_id}\``;
      const langBadge = (log.card?.language || 'en') === 'es' ? '🇪🇸 ES' : '🇬🇧 EN';
      const statusBadge =
        log.evaluation_status === 'pass'
          ? '✓ Pass'
          : log.evaluation_status === 'awkward'
          ? 'Needs Polish (Awkward)'
          : 'Needs Polish';
      const createdDate = new Date(log.created_at).toLocaleDateString();

      return [
        `### ${index + 1}. ${termLabel} [${langBadge}] — *${statusBadge}* (${createdDate})`,
        ``,
        `> “${log.user_sentence}”`,
        ``,
        log.feedback ? `- **Editorial Note**: ${log.feedback}` : null,
        log.card?.primary_definition ? `- **Lexical Definition**: ${log.card.primary_definition}` : null,
        ``,
      ]
        .filter((line) => line !== null)
        .join('\n');
    });

    const mdContent = [...header, ...entries].join('\n');
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lexis-writing-portfolio-${dateStr}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* =====================================================================
          SECTION 1: ACT-05 WRITING REVISION & REGISTER COACH ("PROSE POLISHER")
         ===================================================================== */}
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#834832] font-semibold">
              <Feather className="w-3.5 h-3.5" />
              <span>ACT-05 • Active Revision &amp; Register Coach</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917]">
              Prose Polisher &amp; Lexicon Infuser
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#78716c] max-w-2xl">
              Paste a paragraph from an essay, article, or journal draft. Lexis scans your personal
              vocabulary library to recommend high-register C1/C2 substitutions where flat phrasing
              can be sharpened with words you are actively mastering.
            </p>
          </div>

          {/* 1-Click Sample Draft Loaders */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => handleLoadSample('en')}
              className="px-3 py-1.5 rounded-xl border border-[#eaddd7] bg-[#fdf8f6] hover:bg-[#f2e8e5] text-xs font-sans font-semibold text-[#834832] transition-colors cursor-pointer"
            >
              🇬🇧 Load English Essay Draft
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('es')}
              className="px-3 py-1.5 rounded-xl border border-[#eaddd7] bg-[#fdf8f6] hover:bg-[#f2e8e5] text-xs font-sans font-semibold text-[#834832] transition-colors cursor-pointer"
            >
              🇪🇸 Cargar Borrador de Ensayo
            </button>
          </div>
        </div>

        {/* Draft Input & Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label
              htmlFor="prose-polisher-textarea"
              className="text-xs font-sans uppercase tracking-wider font-semibold text-[#57534e]"
            >
              Your Draft Paragraph or Argument
            </label>

            {/* Language Selector */}
            <div className="inline-flex items-center rounded-xl border border-stone-200 p-0.5 bg-stone-100/80 text-xs font-sans self-start">
              {(
                [
                  { id: 'auto', label: 'Auto' },
                  { id: 'en', label: '🇬🇧 EN' },
                  { id: 'es', label: '🇪🇸 ES' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedLang(opt.id)}
                  className={cn(
                    'px-3 py-1 rounded-lg font-medium transition-all cursor-pointer',
                    selectedLang === opt.id
                      ? 'bg-white text-[#834832] font-semibold shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            id="prose-polisher-textarea"
            rows={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Paste or compose a paragraph in English or Spanish to elevate using your personal lexicon..."
            className="w-full text-base font-serif p-4 rounded-xl border border-stone-300 bg-[#fbf9f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#834832] leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-sans text-stone-500">
              {draft.trim()
                ? `${draft.trim().split(/\s+/).length} words • Scanning against ${cards.length} lexicon entries`
                : `0 words • ${cards.length} lexicon entries ready for matching`}
            </span>

            <button
              type="button"
              disabled={isPolishing || !draft.trim()}
              onClick={handlePolishProse}
              className="px-6 py-3 rounded-xl bg-[#834832] hover:bg-[#693522] text-white text-xs sm:text-sm font-sans font-semibold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isPolishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Consulting Your Lexicon…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Polish Prose with My Lexicon</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error or Commit Feedback Banner */}
        {polishError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs font-sans text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{polishError}</span>
          </div>
        )}

        {commitSuccessMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs font-sans text-emerald-900 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{commitSuccessMessage}</span>
          </div>
        )}

        {/* Rendered ProsePolishResult */}
        {polishResult && (
          <div className="pt-4 border-t border-stone-200 space-y-6 animate-in fade-in duration-300">
            {/* Telemetry & Editorial Summary Strip */}
            <div className="p-4 rounded-xl bg-[#fdf8f6] border border-[#eaddd7] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider bg-[#834832] text-white">
                    {polishResult.registerDetected}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase bg-white border border-[#eaddd7] text-[#834832]">
                    {polishResult.mode === 'gemini' ? 'AI Coach' : 'Lexical Coach'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase bg-stone-100 text-stone-700">
                    {polishResult.detectedLanguage === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                  </span>
                </div>
                <span className="text-xs font-sans font-semibold text-[#834832]">
                  {polishResult.suggestions.length}{' '}
                  {polishResult.suggestions.length === 1
                    ? 'Lexicon Substitution'
                    : 'Lexicon Substitutions'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-serif text-[#4f2416] leading-relaxed">
                {polishResult.editorialSummary}
              </p>
            </div>

            {/* Elevated Rewrite Box */}
            <div className="bg-[#fbf9f5] border border-[#e7e5e4] rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/70 pb-3">
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#834832] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Elevated Rewrite with Your Lexicon</span>
                </span>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleCopyElevated}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-sans font-semibold text-stone-700 transition-colors cursor-pointer"
                  >
                    {copiedElevated ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#834832]" />
                        <span>Copy Elevated Prose</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isCommitting}
                    onClick={handleCommitRevision}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#834832] hover:bg-[#693522] text-white text-xs font-sans font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isCommitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Committing…</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Commit Revision to Portfolio</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <blockquote className="text-base sm:text-lg font-serif text-[#1c1917] leading-relaxed border-l-3 border-[#834832] pl-4 py-1">
                {polishResult.elevatedDraft}
              </blockquote>
            </div>

            {/* Lexicon Substitution Cards */}
            {polishResult.suggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-stone-500">
                  Recommended Substitutions from Your Lexicon ({polishResult.suggestions.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {polishResult.suggestions.map((s, idx) => (
                    <div
                      key={`${s.cardId}-${idx}`}
                      className="p-4 rounded-xl border border-[#e7e5e4] bg-white hover:border-[#834832]/40 transition-all flex flex-col justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap text-xs font-sans">
                            <span className="line-through text-stone-400 font-serif">
                              “{s.originalFragment}”
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#834832]" />
                            <span className="px-2 py-0.5 rounded-md bg-[#fdf8f6] border border-[#eaddd7] font-serif font-bold text-sm text-[#834832]">
                              {s.elevatedReplacement}
                            </span>
                          </div>

                          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-stone-100 text-stone-700">
                            {s.part_of_speech}
                          </span>
                        </div>

                        <p className="text-xs font-serif text-[#1c1917] leading-relaxed">
                          <strong className="font-sans text-[11px] uppercase tracking-wider text-stone-500 mr-1">
                            {s.term}:
                          </strong>
                          {s.primary_definition}
                        </p>

                        <p className="text-xs font-serif italic text-[#4f2416] bg-[#fdf8f6]/70 border border-[#eaddd7]/70 rounded-lg p-2.5 leading-relaxed">
                          {s.rationale}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-sans">
                        <span className="text-[11px] font-mono text-stone-400">
                          {s.language === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}
                        </span>
                        <button
                          type="button"
                          onClick={() => onInspectCard(s.cardId)}
                          className="inline-flex items-center gap-1 text-[#834832] hover:text-[#693522] font-semibold cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Card</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =====================================================================
          SECTION 2: CHRONOLOGICAL PRODUCTION & SYNTHESIS ARCHIVE
         ===================================================================== */}
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#834832] font-semibold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Active Composition Journal (ACT-03 • ACT-04 • ACT-05)</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1c1917]">
              Chronological Production &amp; Synthesis Archive
            </h2>
            <p className="text-xs font-sans text-[#78716c]">
              Every original sentence, multi-word synthesis weave, and committed prose revision
              logged across your practice sessions.
            </p>
          </div>

          <button
            type="button"
            disabled={enrichedLogs.length === 0}
            onClick={handleExportPortfolioMarkdown}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-sans font-semibold text-stone-700 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer self-start sm:self-center"
          >
            <Download className="w-3.5 h-3.5 text-[#834832]" />
            <span>Export Writing Portfolio (.md)</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
          {/* Language Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-stone-400 mr-1">Language:</span>
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'en', label: '🇬🇧 EN' },
                { id: 'es', label: '🇪🇸 ES' },
              ] as const
            ).map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setArchiveLangFilter(pill.id)}
                className={cn(
                  'px-2.5 py-1 rounded-full transition-colors cursor-pointer',
                  archiveLangFilter === pill.id
                    ? 'bg-[#834832] text-white font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                )}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Evaluation Status Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-stone-400 mr-1">Status:</span>
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'pass', label: '✓ Pass' },
                { id: 'polish', label: 'Needs Polish' },
              ] as const
            ).map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setArchiveStatusFilter(pill.id)}
                className={cn(
                  'px-2.5 py-1 rounded-full transition-colors cursor-pointer',
                  archiveStatusFilter === pill.id
                    ? 'bg-[#834832] text-white font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                )}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Archive Feed */}
        {logsError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs font-sans text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{logsError}</span>
          </div>
        )}

        {isLoadingLogs ? (
          <div className="py-12 text-center text-xs font-sans text-stone-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#834832]" />
            <span>Loading your writing archive…</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#fbf9f5] border border-[#e7e5e4] text-center space-y-2">
            <BookOpen className="w-7 h-7 text-stone-400 mx-auto" />
            <h3 className="text-base font-serif font-bold text-[#1c1917]">
              No logged compositions match your filter
            </h3>
            <p className="text-xs font-sans text-stone-500 max-w-md mx-auto">
              Polish and commit a paragraph above, or compose original sentences in Review Mode
              (`ACT-03` &amp; `ACT-04`) to build your personal writing portfolio.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const isPass = log.evaluation_status === 'pass';
              const isSpanish = (log.card?.language || 'en') === 'es';

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-[#fbf9f5]/70 border border-[#e7e5e4] hover:border-[#834832]/40 transition-all space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {log.card ? (
                        <button
                          type="button"
                          onClick={() => onInspectCard(log.card_id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-[#834832] text-xs font-serif font-bold text-[#1c1917] hover:text-[#834832] transition-colors cursor-pointer capitalize"
                        >
                          <span>{isSpanish ? '🇪🇸' : '🇬🇧'}</span>
                          <span>{log.card.term}</span>
                          <span className="text-[10px] font-sans font-normal text-stone-500">
                            ({log.card.part_of_speech})
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onInspectCard(log.card_id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-mono text-stone-600 cursor-pointer"
                        >
                          Card {log.card_id}
                        </button>
                      )}

                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider',
                          isPass
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        )}
                      >
                        {isPass ? '✓ Pass' : 'Needs Polish'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <blockquote className="text-sm sm:text-base font-serif italic text-[#1c1917] border-l-2 border-[#834832] pl-3 py-0.5 leading-relaxed">
                    “{log.user_sentence}”
                  </blockquote>

                  {log.feedback && (
                    <p className="text-xs font-sans text-stone-600 leading-relaxed">
                      {log.feedback}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
