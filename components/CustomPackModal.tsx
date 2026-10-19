'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  GitBranch,
  Check,
} from 'lucide-react';
import { CardWithSrs, VocabCard } from '@/types/lexis';
import { apiFetch, errorMessageOf, notifyCardsUpdated } from '@/lib/api-client';
import { cn } from '@/lib/utils';

export interface CustomPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPackSeeded: (message: string) => void;
}

interface PackMetadata {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  language: 'en' | 'es';
  category: string;
  totalCards: number;
  ownedCount: number;
  remainingCount: number;
  sampleTerms: string[];
}

type PreviewCardItem = CardWithSrs & { alreadyOwned?: boolean };

const QUICK_TOPICS: Array<{ label: string; topic: string; lang: 'en' | 'es' }> = [
  { label: 'Stoic Ethics', topic: 'Stoic Ethics & Classical Rhetoric', lang: 'en' },
  { label: 'Aesthetics & Cinema', topic: 'Aesthetics, Poetics & Film Theory', lang: 'en' },
  { label: 'Byzantine History', topic: 'Byzantine Statecraft & Historiography', lang: 'en' },
  { label: 'Realismo Mágico', topic: 'Realismo Mágico y Literatura del Boom', lang: 'es' },
  { label: 'Existentialism', topic: 'Phenomenology, Existentialism & Ontology', lang: 'en' },
];

export function CustomPackModal({
  isOpen,
  onClose,
  onPackSeeded,
}: CustomPackModalProps) {
  const [activeTab, setActiveTab] = useState<'curated' | 'custom'>('curated');
  const [packs, setPacks] = useState<PackMetadata[]>([]);
  const [isLoadingPacks, setIsLoadingPacks] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Custom Topic Generator state
  const [customTopic, setCustomTopic] = useState('');
  const [customLanguage, setCustomLanguage] = useState<'en' | 'es'>('en');
  const [customCount, setCustomCount] = useState<5 | 8 | 10>(8);

  // Preview & Seeding state
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewPackId, setPreviewPackId] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'curated' | 'gemini' | 'heuristic'>('curated');
  const [previewLanguage, setPreviewLanguage] = useState<'en' | 'es'>('en');
  const [previewCards, setPreviewCards] = useState<PreviewCardItem[] | null>(null);
  const [selectedTerms, setSelectedTerms] = useState<Record<string, boolean>>({});
  const [isSeeding, setIsSeeding] = useState<string | null>(null);

  // Load curated packs metadata when modal opens
  const fetchPacks = async () => {
    setIsLoadingPacks(true);
    setErrorMsg(null);
    try {
      const res = await apiFetch<{ data: PackMetadata[] }>('/api/cards/packs');
      setPacks(res.data || []);
    } catch (err) {
      setErrorMsg(errorMessageOf(err, 'Could not load curated packs.'));
    } finally {
      setIsLoadingPacks(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPacks();
      setPreviewCards(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Preview a Curated Pack or Custom Topic Pack
  const handlePreview = async (options: {
    packId?: string;
    topic?: string;
    language?: 'en' | 'es';
    count?: number;
    titleLabel?: string;
  }) => {
    setIsPreviewLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiFetch<{
        data: PreviewCardItem[];
        title?: string;
        mode: 'curated' | 'gemini' | 'heuristic';
        language: 'en' | 'es';
        packId: string | null;
      }>('/api/cards/packs', {
        method: 'POST',
        body: JSON.stringify({
          action: 'preview',
          packId: options.packId,
          topic: options.topic,
          language: options.language,
          count: options.count,
        }),
      });

      const items = res.data || [];
      setPreviewCards(items);
      setPreviewPackId(options.packId || null);
      setPreviewTitle(res.title || options.titleLabel || options.topic || 'Vocabulary Pack');
      setPreviewMode(res.mode || 'curated');
      setPreviewLanguage(res.language || options.language || 'en');

      // Default selection: check all unowned cards (or all if all are owned)
      const initialSelection: Record<string, boolean> = {};
      const hasUnowned = items.some((c) => !c.alreadyOwned);
      for (const item of items) {
        initialSelection[item.term] = hasUnowned ? !item.alreadyOwned : true;
      }
      setSelectedTerms(initialSelection);
    } catch (err) {
      setErrorMsg(errorMessageOf(err, 'Failed to generate pack preview.'));
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Direct 1-click seed for a Curated Pack
  const handleQuickSeedPack = async (pack: PackMetadata) => {
    setIsSeeding(pack.id);
    setErrorMsg(null);
    try {
      const res = await apiFetch<{
        added: number;
        skipped: number;
        total: number;
        message: string;
      }>('/api/cards/packs', {
        method: 'POST',
        body: JSON.stringify({
          action: 'seed',
          packId: pack.id,
        }),
      });
      notifyCardsUpdated();
      await fetchPacks();
      onPackSeeded(
        res.message || `Seeded ${pack.title} (+${res.added} new words, ${res.total} total).`
      );
      onClose();
    } catch (err) {
      setErrorMsg(errorMessageOf(err, 'Failed to seed pack.'));
    } finally {
      setIsSeeding(null);
    }
  };

  // Seed selected words from the Interactive Preview Checklist
  const handleSeedSelectedFromPreview = async () => {
    if (!previewCards) return;
    const chosenTerms = previewCards
      .filter((c) => selectedTerms[c.term])
      .map((c) => c.term);

    if (chosenTerms.length === 0) {
      setErrorMsg('Please select at least one word to seed into your lexicon.');
      return;
    }

    setIsSeeding('preview');
    setErrorMsg(null);
    try {
      const chosenCards: Array<Partial<VocabCard>> = previewCards
        .filter((c) => selectedTerms[c.term])
        .map(({ srs: _srs, alreadyOwned: _owned, ...cardFields }) => cardFields);

      const res = await apiFetch<{
        added: number;
        skipped: number;
        total: number;
        message: string;
      }>('/api/cards/packs', {
        method: 'POST',
        body: JSON.stringify({
          action: 'seed',
          packId: previewPackId || undefined,
          topic: !previewPackId ? customTopic.trim() || previewTitle : undefined,
          language: previewLanguage,
          selectedTerms: chosenTerms,
          customCards: !previewPackId ? chosenCards : undefined,
        }),
      });

      notifyCardsUpdated();
      onPackSeeded(
        res.message ||
          `Seeded ${res.added} selected words from "${previewTitle}" into your Lexicon.`
      );
      onClose();
    } catch (err) {
      setErrorMsg(errorMessageOf(err, 'Failed to seed selected words.'));
    } finally {
      setIsSeeding(null);
    }
  };

  const selectedCount = previewCards
    ? previewCards.filter((c) => selectedTerms[c.term]).length
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#fdf8f6] border border-[#e7e5e4] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-[#e7e5e4] flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-widest text-[#834832] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curriculum & Thematic Studio (CUR-03)</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1c1917]">
              Vocabulary Pack Studio & Topic Generator
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Pack Studio"
            className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs (hidden while inspecting a specific pack preview) */}
        {!previewCards && (
          <div className="px-6 pt-3 bg-white border-b border-[#e7e5e4] flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('curated');
                setErrorMsg(null);
              }}
              className={cn(
                'px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer',
                activeTab === 'curated'
                  ? 'border-[#834832] text-[#834832]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              )}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curated & Thematic Packs ({packs.length || 6} Packs)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('custom');
                setErrorMsg(null);
              }}
              className={cn(
                'px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer',
                activeTab === 'custom'
                  ? 'border-[#834832] text-[#834832]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Topic Generator (AI Studio)</span>
            </button>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs font-sans text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {previewCards ? (
            /* --- INTERACTIVE PREVIEW & SELECTIVE SEEDING VIEW --- */
            <div className="space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#e7e5e4] rounded-xl p-4">
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setPreviewCards(null)}
                    className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-[#834832] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Pack Studio</span>
                  </button>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-serif font-bold text-[#1c1917]">
                      {previewTitle}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">
                      {previewLanguage === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#f2e8e5] text-[#834832]">
                      {previewMode === 'gemini'
                        ? 'AI Enriched'
                        : previewMode === 'curated'
                        ? 'Curated Dossier'
                        : 'Scholarly Fallback'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      const next: Record<string, boolean> = {};
                      previewCards.forEach((c) => {
                        next[c.term] = true;
                      });
                      setSelectedTerms(next);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-sans font-medium text-stone-700 cursor-pointer"
                  >
                    Select All ({previewCards.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTerms({})}
                    className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-sans font-medium text-stone-700 cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Candidate Cards Checklist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {previewCards.map((card) => {
                  const isChecked = Boolean(selectedTerms[card.term]);
                  return (
                    <div
                      key={card.term}
                      onClick={() =>
                        setSelectedTerms((prev) => ({
                          ...prev,
                          [card.term]: !prev[card.term],
                        }))
                      }
                      className={cn(
                        'p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 bg-white',
                        isChecked
                          ? 'border-[#834832] ring-1 ring-[#834832]/20 bg-[#fdf8f6]/40'
                          : 'border-stone-200 opacity-75 hover:opacity-100'
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

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-serif font-bold text-lg text-[#1c1917] capitalize">
                              {card.term}
                            </span>
                            {card.phonetic && (
                              <span className="text-[11px] font-mono text-stone-500">
                                {card.phonetic}
                              </span>
                            )}
                            <span className="text-[11px] font-sans text-[#834832] font-medium">
                              {card.part_of_speech}
                            </span>
                          </div>

                          {card.alreadyOwned ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              In Lexicon
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              New Entry
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-serif text-stone-700 leading-relaxed line-clamp-2">
                          {card.primary_definition}
                        </p>

                        {card.etymology?.roots?.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {card.etymology.roots.slice(0, 2).map((r, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 text-[10px] font-sans text-stone-700"
                              >
                                <strong>{r.origin}</strong>: <em>{r.morpheme}</em>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeTab === 'curated' ? (
            /* --- TAB 1: CURATED & THEMATIC PACKS --- */
            isLoadingPacks ? (
              <div className="py-16 text-center text-sm font-sans text-stone-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#834832]" />
                <span>Loading curated domain packs…</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packs.map((pack) => {
                  const progressPct =
                    pack.totalCards > 0
                      ? Math.round((pack.ownedCount / pack.totalCards) * 100)
                      : 0;

                  return (
                    <div
                      key={pack.id}
                      className="bg-white border border-[#e7e5e4] hover:border-[#834832]/40 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                            {pack.language === 'es' ? '🇪🇸 Español' : '🇬🇧 English'} •{' '}
                            {pack.category}
                          </span>
                          <span className="text-xs font-mono text-stone-500">
                            {pack.totalCards} words
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-serif font-bold text-[#1c1917]">
                            {pack.title}
                          </h3>
                          <p className="text-xs font-sans font-medium text-[#834832]">
                            {pack.subtitle}
                          </p>
                        </div>

                        <p className="text-xs font-sans text-stone-600 leading-relaxed">
                          {pack.description}
                        </p>

                        {/* Sample Terms */}
                        {pack.sampleTerms?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {pack.sampleTerms.slice(0, 6).map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded-md bg-[#fdf8f6] border border-[#eaddd7] text-[11px] font-serif italic text-[#4f2416]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 pt-2 border-t border-stone-100">
                        {/* Ownership Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-sans text-stone-500">
                            <span>
                              In Lexicon: <strong>{pack.ownedCount}</strong> / {pack.totalCards}
                            </span>
                            <span>{progressPct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#834832] transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isPreviewLoading || isSeeding !== null}
                            onClick={() =>
                              handlePreview({
                                packId: pack.id,
                                titleLabel: pack.title,
                                language: pack.language,
                              })
                            }
                            className="flex-1 py-2 px-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-sans font-semibold text-stone-700 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Preview Words
                          </button>

                          <button
                            type="button"
                            disabled={isSeeding !== null || isPreviewLoading}
                            onClick={() => handleQuickSeedPack(pack)}
                            className="flex-1 py-2 px-3 rounded-xl bg-[#834832] hover:bg-[#693522] text-white text-xs font-sans font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {isSeeding === pack.id ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Seeding…</span>
                              </>
                            ) : (
                              <>
                                <span>
                                  {pack.remainingCount > 0
                                    ? `Seed Pack (+${pack.remainingCount} New)`
                                    : 'Re-Verify Pack'}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* --- TAB 2: CUSTOM TOPIC GENERATOR (AI STUDIO) --- */
            <div className="bg-white border border-[#e7e5e4] rounded-2xl p-6 space-y-5 shadow-xs">
              <div className="space-y-1">
                <h3 className="text-xl font-serif font-bold text-[#1c1917]">
                  Synthesize a Custom Thematic Pack
                </h3>
                <p className="text-xs font-sans text-stone-600">
                  Enter any intellectual domain, seminar syllabus, or literary movement. Lexis will curate high-register C1/C2 headwords with full morphological roots, nuance notes, and cloze drills.
                </p>
              </div>

              {/* Topic Input */}
              <div className="space-y-2">
                <label
                  htmlFor="custom-topic-input"
                  className="block text-xs font-sans uppercase tracking-wider font-semibold text-[#57534e]"
                >
                  Intellectual Topic, Movement, or Syllabus
                </label>
                <input
                  id="custom-topic-input"
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Stoic Ethics & Rhetoric, Architecture & Urbanism, Mística del Siglo de Oro..."
                  className="w-full text-base font-serif px-4 py-3 rounded-xl border border-stone-300 bg-[#fdf8f6]/50 focus:outline-none focus:ring-2 focus:ring-[#834832] focus:bg-white"
                />

                {/* Quick Suggestion Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] font-sans text-stone-400 mr-1">
                    Suggestions:
                  </span>
                  {QUICK_TOPICS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setCustomTopic(item.topic);
                        setCustomLanguage(item.lang);
                      }}
                      className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-[#f2e8e5] text-stone-700 hover:text-[#834832] text-xs font-sans font-medium transition-colors cursor-pointer"
                    >
                      {item.lang === 'es' ? '🇪🇸 ' : '🇬🇧 '}
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language & Pack Size Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <span className="block text-xs font-sans uppercase tracking-wider font-semibold text-[#57534e]">
                    Target Language
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomLanguage('en')}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-xl border text-xs font-sans font-semibold transition-all cursor-pointer',
                        customLanguage === 'en'
                          ? 'bg-[#834832] text-white border-[#834832]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      )}
                    >
                      🇬🇧 English (C1/C2)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomLanguage('es')}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-xl border text-xs font-sans font-semibold transition-all cursor-pointer',
                        customLanguage === 'es'
                          ? 'bg-[#834832] text-white border-[#834832]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      )}
                    >
                      🇪🇸 Español (Culto / Literario)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-xs font-sans uppercase tracking-wider font-semibold text-[#57534e]">
                    Pack Size
                  </span>
                  <div className="flex items-center gap-2">
                    {([5, 8, 10] as const).map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setCustomCount(cnt)}
                        className={cn(
                          'flex-1 py-2 px-3 rounded-xl border text-xs font-sans font-semibold transition-all cursor-pointer',
                          customCount === cnt
                            ? 'bg-[#834832] text-white border-[#834832]'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        )}
                      >
                        {cnt} Words
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={isPreviewLoading || !customTopic.trim()}
                  onClick={() =>
                    handlePreview({
                      topic: customTopic.trim(),
                      language: customLanguage,
                      count: customCount,
                      titleLabel: customTopic.trim(),
                    })
                  }
                  className="px-6 py-3 rounded-xl bg-[#834832] hover:bg-[#693522] text-white text-xs font-sans font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isPreviewLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Curating Thematic Pack…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Topic Pack Preview</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer when Previewing Words */}
        {previewCards && (
          <div className="px-6 py-4 bg-white border-t border-[#e7e5e4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-sans text-stone-600">
              <strong>{selectedCount}</strong> of {previewCards.length} words selected for ingestion
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewCards(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-sans font-semibold text-stone-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSeeding !== null || selectedCount === 0}
                onClick={handleSeedSelectedFromPreview}
                className="px-5 py-2.5 rounded-xl bg-[#834832] hover:bg-[#693522] text-white text-xs font-sans font-semibold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSeeding === 'preview' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Seeding into Lexicon…</span>
                  </>
                ) : (
                  <>
                    <span>Seed {selectedCount} Selected Words into Lexicon</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
