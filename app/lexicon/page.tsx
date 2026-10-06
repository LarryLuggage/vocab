'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Library,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileJson,
  Sparkles,
  GitBranch,
  Layers,
  Clock,
  ArrowRight,
  Plus,
  BookOpen,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { CardWithSrs, FSRSState } from '@/types/lexis';
import { apiFetch, errorMessageOf, CARDS_UPDATED_EVENT } from '@/lib/api-client';
import { getCardStateLabel } from '@/lib/fsrs';
import { cn } from '@/lib/utils';

export default function LexiconPage() {
  const [cards, setCards] = useState<CardWithSrs[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<'catalog' | 'roots'>('catalog');
  const [exportNotification, setExportNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Check URL search parameters on mount (search, q, or term)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get('search') || params.get('q') || params.get('term');
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    }

    const loadCards = () => {
      apiFetch<{ data: CardWithSrs[] }>('/api/cards')
        .then((payload) => {
          setCards(payload.data);
          setLoadError(null);
        })
        .catch((err) => setLoadError(errorMessageOf(err, 'Failed to load your lexicon.')))
        .finally(() => setIsLoading(false));
    };
    loadCards();

    window.addEventListener(CARDS_UPDATED_EVENT, loadCards);
    return () => window.removeEventListener(CARDS_UPDATED_EVENT, loadCards);
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    const total = cards.length;
    const newCards = cards.filter((c) => c.srs.state === 0).length;
    const learningCards = cards.filter((c) => c.srs.state === 1).length;
    const reviewCards = cards.filter((c) => c.srs.state === 2 || c.srs.state === 3).length;
    const dueCount = cards.filter(
      (c) => new Date(c.srs.due).getTime() <= Date.now()
    ).length;

    return { total, newCards, learningCards, reviewCards, dueCount };
  }, [cards]);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTerm = card.term.toLowerCase().includes(q);
        const matchesDef = card.primary_definition.toLowerCase().includes(q);
        const matchesNuance = card.nuance_note?.toLowerCase().includes(q) || false;
        const matchesCollocations = card.collocations.some((c) =>
          c.toLowerCase().includes(q)
        );
        const matchesRoots = card.etymology.roots.some(
          (r) =>
            r.morpheme.toLowerCase().includes(q) ||
            r.meaning.toLowerCase().includes(q) ||
            r.origin.toLowerCase().includes(q)
        );
        if (!matchesTerm && !matchesDef && !matchesNuance && !matchesCollocations && !matchesRoots) {
          return false;
        }
      }

      // Mastery Tier filter
      if (selectedTier !== 'all') {
        if (card.srs.state !== selectedTier) return false;
      }

      // Language Origin filter
      if (selectedOrigin !== 'all') {
        const hasOrigin = card.etymology.roots.some(
          (r) => r.origin.toLowerCase() === selectedOrigin.toLowerCase()
        );
        if (!hasOrigin) return false;
      }

      return true;
    });
  }, [cards, searchQuery, selectedTier, selectedOrigin]);

  // Grouping by root morphemes for "Morphological Roots" view
  const rootGroups = useMemo(() => {
    const groups: Record<
      string,
      {
        origin: string;
        meaning: string;
        cards: CardWithSrs[];
      }
    > = {};

    filteredCards.forEach((card) => {
      card.etymology.roots.forEach((root) => {
        const key = `${root.morpheme.toLowerCase()} (${root.origin})`;
        if (!groups[key]) {
          groups[key] = {
            origin: root.origin,
            meaning: root.meaning,
            cards: [],
          };
        }
        if (!groups[key].cards.some((c) => c.id === card.id)) {
          groups[key].cards.push(card);
        }
      });
    });

    return Object.entries(groups).sort((a, b) => b[1].cards.length - a[1].cards.length);
  }, [filteredCards]);

  // Export JSON
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(cards, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lexis-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotification(`Exported ${cards.length} cards as JSON successfully.`);
    setTimeout(() => setExportNotification(null), 4000);
  };

  // Export Anki CSV
  const handleExportAnkiCSV = () => {
    // Header format compatible with Anki tab/comma delimited import:
    // Front, Back, Tags
    const escapeCsvField = (field: string) => {
      if (field.includes('"') || field.includes(',') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const header = ['Front', 'Back', 'Tags'].join(',');
    const rows = cards.map((c) => {
      // Front: cloze drill or headword
      const front = c.cloze_sentences?.[0] || c.term;

      // Back: rich HTML formatted definition & nuance for Anki card reverse
      const rootsText = c.etymology.roots
        .map((r) => `${r.origin}: <em>${r.morpheme}</em> ("${r.meaning}")`)
        .join('; ');

      const back = [
        `<b>${c.term}</b> [${c.phonetic || ''}] (<i>${c.part_of_speech}</i>)<br><br>`,
        `<b>Definition:</b> ${c.primary_definition}<br>`,
        c.nuance_note ? `<b>Nuance:</b> ${c.nuance_note}<br>` : '',
        rootsText ? `<b>Roots:</b> ${rootsText}<br>` : '',
        c.collocations?.length > 0 ? `<b>Collocations:</b> ${c.collocations.join(', ')}` : '',
      ].join('');

      const tags = ['lexis', c.part_of_speech, c.etymology.roots[0]?.origin || 'general'].join(' ');

      return [escapeCsvField(front), escapeCsvField(back), escapeCsvField(tags)].join(',');
    });

    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lexis-anki-deck-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotification(`Exported ${cards.length} cards as Anki CSV successfully.`);
    setTimeout(() => setExportNotification(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Editorial Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e7e5e4] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#834832] font-semibold">
            <Library className="w-3.5 h-3.5" />
            <span>Curated Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917] tracking-tight">
            Personal Lexicon
          </h1>
          <p className="text-sm font-sans text-[#78716c] max-w-xl">
            Explore your captured vocabulary organized by morphological roots, mastery intervals, and
            connotative nuance boundaries.
          </p>
        </div>

        {/* Portability / Export Buttons */}
        <div className="flex items-center gap-2 self-start md:self-end">
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-sans font-medium text-stone-700 transition-colors shadow-sm"
          >
            <FileJson className="w-3.5 h-3.5 text-[#834832]" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={handleExportAnkiCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-sans font-medium text-stone-700 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#834832]" />
            <span>Export Anki CSV</span>
          </button>
        </div>
      </div>

      {loadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2.5 text-rose-900 text-xs font-sans">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>Could not load your lexicon: {loadError}</span>
        </div>
      )}

      {/* Export Toast Banner */}
      {exportNotification && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2.5 text-emerald-900 text-xs font-sans animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{exportNotification}</span>
        </div>
      )}

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-[#e7e5e4] rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-sans uppercase font-semibold text-[#a8a29e] tracking-wider block">
            Total Lexicon
          </span>
          <span className="text-2xl font-serif font-bold text-[#1c1917]">
            {stats.total}
          </span>
        </div>

        <div className="bg-white border border-[#e7e5e4] rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-sans uppercase font-semibold text-[#a8a29e] tracking-wider block">
            New
          </span>
          <span className="text-2xl font-serif font-bold text-stone-700">
            {stats.newCards}
          </span>
        </div>

        <div className="bg-white border border-[#e7e5e4] rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-sans uppercase font-semibold text-[#a8a29e] tracking-wider block">
            Learning
          </span>
          <span className="text-2xl font-serif font-bold text-amber-800">
            {stats.learningCards}
          </span>
        </div>

        <div className="bg-white border border-[#e7e5e4] rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-sans uppercase font-semibold text-[#a8a29e] tracking-wider block">
            Review
          </span>
          <span className="text-2xl font-serif font-bold text-emerald-800">
            {stats.reviewCards}
          </span>
        </div>

        <div className="bg-[#fdf8f6] border border-[#eaddd7] rounded-xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] font-sans uppercase font-semibold text-[#834832] tracking-wider block">
            Due Now
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-serif font-bold text-[#834832]">
              {stats.dueCount}
            </span>
            {stats.dueCount > 0 && (
              <Link
                href="/review"
                className="px-2 py-0.5 rounded text-[11px] font-sans font-semibold bg-[#834832] text-white hover:bg-[#693522]"
              >
                Review
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Instant search by term, morpheme root, collocation, or definition..."
              className="w-full text-sm font-sans pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#834832] focus:bg-white transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-sans text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-stone-200 p-1 bg-stone-50 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('catalog')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-1.5',
                viewMode === 'catalog'
                  ? 'bg-white shadow-xs text-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              )}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Card Catalog</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('roots')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-1.5',
                viewMode === 'roots'
                  ? 'bg-white shadow-xs text-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              )}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Etymological Roots</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100 text-xs font-sans">
          {/* Mastery Tier Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-stone-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Tier:</span>
            </span>

            <button
              type="button"
              onClick={() => setSelectedTier('all')}
              className={cn(
                'px-2.5 py-1 rounded-full transition-colors',
                selectedTier === 'all'
                  ? 'bg-[#834832] text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              )}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier(0)}
              className={cn(
                'px-2.5 py-1 rounded-full transition-colors',
                selectedTier === 0
                  ? 'bg-stone-800 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              )}
            >
              New
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier(1)}
              className={cn(
                'px-2.5 py-1 rounded-full transition-colors',
                selectedTier === 1
                  ? 'bg-amber-800 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              )}
            >
              Learning
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier(2)}
              className={cn(
                'px-2.5 py-1 rounded-full transition-colors',
                selectedTier === 2
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              )}
            >
              Review
            </button>
          </div>

          {/* Language Origin Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-stone-400 mr-1">Origin:</span>
            {['all', 'Latin', 'Greek'].map((orig) => (
              <button
                key={orig}
                type="button"
                onClick={() => setSelectedOrigin(orig)}
                className={cn(
                  'px-2.5 py-1 rounded-full capitalize transition-colors',
                  selectedOrigin === orig
                    ? 'bg-[#834832] text-white font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                )}
              >
                {orig}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content View */}
      {isLoading ? (
        <p className="text-sm font-sans text-[#a8a29e] py-12 text-center">Loading your lexicon…</p>
      ) : filteredCards.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white border border-[#e7e5e4] rounded-2xl shadow-sm space-y-4">
          <div className="inline-flex p-3 rounded-full bg-stone-100 text-stone-500">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-xl text-[#1c1917]">
              No words match your filters
            </h3>
            <p className="text-xs font-sans text-stone-500 max-w-sm mx-auto">
              Try clearing your search query or adjusting the tier/origin filters to view cards.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTier('all');
                setSelectedOrigin('all');
              }}
              className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-sans font-medium text-stone-700 hover:bg-stone-50"
            >
              Reset Filters
            </button>
            <Link
              href="/add"
              className="px-4 py-2 rounded-xl bg-[#834832] text-white text-xs font-sans font-semibold hover:bg-[#693522]"
            >
              Capture New Word
            </Link>
          </div>
        </div>
      ) : viewMode === 'catalog' ? (
        /* --- VIEW 1: CARD CATALOG GRID --- */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCards.map((card) => {
            const isDue = new Date(card.srs.due).getTime() <= Date.now();

            return (
              <div
                key={card.id}
                className="bg-white border border-[#e7e5e4] hover:border-[#834832]/40 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 group"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-2.5">
                        <h2 className="text-2xl font-serif font-bold text-[#1c1917] capitalize">
                          {card.term}
                        </h2>
                        {card.phonetic && (
                          <span className="text-xs font-mono text-[#78716c]">
                            {card.phonetic}
                          </span>
                        )}
                      </div>
                      <span className="inline-block mt-0.5 text-xs font-sans font-medium text-[#834832]">
                        {card.part_of_speech}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-col items-end">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider',
                          card.srs.state === 0
                            ? 'bg-stone-100 text-stone-700'
                            : card.srs.state === 1
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        )}
                      >
                        {getCardStateLabel(card.srs.state)}
                      </span>
                      {isDue && (
                        <span className="text-[10px] font-sans font-semibold text-[#834832] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Due for review</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Primary Definition */}
                  <p className="text-sm font-serif text-[#1c1917] leading-relaxed">
                    {card.primary_definition}
                  </p>

                  {/* Nuance Note */}
                  {card.nuance_note && (
                    <div className="p-3 rounded-xl bg-[#fdf8f6] border border-[#eaddd7] text-xs font-serif italic text-[#4f2416] leading-relaxed">
                      "{card.nuance_note}"
                    </div>
                  )}

                  {/* Roots */}
                  {card.etymology.roots?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {card.etymology.roots.map((r, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[11px] font-sans text-stone-700"
                        >
                          <strong className="font-semibold text-stone-900">{r.origin}</strong>: <em>{r.morpheme}</em> (“{r.meaning}”)
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Collocations */}
                  {card.collocations?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {card.collocations.slice(0, 3).map((col, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-[#f2e8e5]/60 text-[#693522] text-[11px] font-sans"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: FSRS Stability and Review Action */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-sans text-stone-500">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span>S: {card.srs.stability.toFixed(1)}d</span>
                    <span>•</span>
                    <span>Reps: {card.srs.reps}</span>
                  </div>

                  <Link
                    href="/review"
                    className="inline-flex items-center gap-1 text-[#834832] font-semibold hover:text-[#693522] group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Practice Drill</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* --- VIEW 2: MORPHOLOGICAL ROOTS GROUPING --- */
        <div className="space-y-6">
          {rootGroups.map(([rootKey, data], idx) => (
            <div
              key={idx}
              className="bg-white border border-[#e7e5e4] rounded-2xl p-6 shadow-sm space-y-4"
            >
              {/* Root Family Header */}
              <div className="flex items-baseline justify-between border-b border-stone-100 pb-3">
                <div className="flex items-baseline gap-3">
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-xs font-bold uppercase">
                    {data.origin}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#1c1917] italic">
                    {rootKey.split(' ')[0]}
                  </h3>
                  <span className="text-sm font-sans text-[#78716c]">
                    meaning: “{data.meaning}”
                  </span>
                </div>

                <span className="text-xs font-sans font-semibold text-[#834832] bg-[#834832]/10 px-2.5 py-0.5 rounded-full">
                  {data.cards.length} {data.cards.length === 1 ? 'word' : 'words'}
                </span>
              </div>

              {/* Connected Words in this Morpheme Family */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.cards.map((card) => (
                  <div
                    key={card.id}
                    className="p-3.5 rounded-xl border border-stone-200 bg-[#fdf8f6]/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-base text-[#1c1917] capitalize">
                        {card.term}
                      </span>
                      <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-stone-200/60 text-stone-700">
                        {card.part_of_speech}
                      </span>
                    </div>
                    <p className="text-xs font-serif text-stone-600 line-clamp-2">
                      {card.primary_definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
