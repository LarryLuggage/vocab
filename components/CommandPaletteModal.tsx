'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Sparkles,
  BookOpen,
  ArrowRight,
  GitBranch,
  BarChart3,
  Feather,
  Quote,
  Layers,
  Eye,
  Command,
} from 'lucide-react';
import { CardWithSrs } from '@/types/lexis';
import { apiFetch, CARDS_UPDATED_EVENT } from '@/lib/api-client';
import { getCardStateLabel } from '@/lib/fsrs';
import { cn } from '@/lib/utils';

export interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StudioNavCommand {
  id: string;
  label: string;
  subtitle: string;
  href: string;
  keywords: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STUDIO_NAV_COMMANDS: StudioNavCommand[] = [
  {
    id: 'nav-review',
    label: 'Open Review Queue (/review)',
    subtitle: 'Practice due cards across Cloze, Distinction Matrix, Production & Synthesis',
    href: '/review',
    keywords: 'review queue drill practice srs fsrs due',
    icon: Sparkles,
  },
  {
    id: 'nav-review-en',
    label: 'Review English Queue Only (/review?language=en)',
    subtitle: 'Fast-paced active recall isolated to 🇬🇧 English vocabulary',
    href: '/review?language=en',
    keywords: 'review english en queue drill fast english only vocabulary',
    icon: BookOpen,
  },
  {
    id: 'nav-review-es',
    label: 'Review Spanish Queue Only (/review?language=es)',
    subtitle: 'Dedicated active recall isolated to 🇪🇸 Español vocabulary',
    href: '/review?language=es',
    keywords: 'review spanish es espanol español queue drill spanish only vocabulary',
    icon: BookOpen,
  },
  {
    id: 'nav-portfolio',
    label: 'Open Prose Polisher & Writing Portfolio (/lexicon?view=portfolio)',
    subtitle: 'ACT-05 Writing Revision Coach & Chronological Production Archive',
    href: '/lexicon?view=portfolio',
    keywords: 'prose polisher writing portfolio act-05 essay draft coach revision archive',
    icon: Feather,
  },
  {
    id: 'nav-synthesis',
    label: 'Open Synthesis Weave Studio (/review?modality=ACT-04)',
    subtitle: 'Weave 2–3 due vocabulary words into a single cohesive passage',
    href: '/review?modality=ACT-04',
    keywords: 'synthesis weave studio act-04 multi-word passage',
    icon: GitBranch,
  },
  {
    id: 'nav-passage',
    label: 'Open Bulk Passage & Highlight Extractor (/add?mode=passage)',
    subtitle: 'Extract & batch-enrich C1/C2 vocabulary from pasted essays or highlights',
    href: '/add?mode=passage',
    keywords: 'bulk passage highlight extractor ingest batch zotero kindle',
    icon: Quote,
  },
  {
    id: 'nav-packs',
    label: 'Open Vocabulary Pack Studio (/lexicon?packStudio=open)',
    subtitle: 'Browse 6 curated thematic packs or synthesize a custom AI domain pack',
    href: '/lexicon?packStudio=open',
    keywords: 'vocabulary pack studio custom topic generator curriculum seed',
    icon: Layers,
  },
  {
    id: 'nav-analytics',
    label: 'Open FSRS 14-Day Retention Analytics (/lexicon?view=analytics)',
    subtitle: 'Inspect stability curves, 14-day review forecast, and high-difficulty leeches',
    href: '/lexicon?view=analytics',
    keywords: 'fsrs 14-day retention analytics stability difficulty forecast leeches',
    icon: BarChart3,
  },
];

type PaletteActionItem =
  | {
      kind: 'card';
      card: CardWithSrs;
      href: string;
    }
  | {
      kind: 'capture';
      term: string;
      href: string;
    }
  | {
      kind: 'command';
      command: StudioNavCommand;
      href: string;
    };

export function CommandPaletteModal({ isOpen, onClose }: CommandPaletteModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState<CardWithSrs[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Fetch and cache cards when opened or when CARDS_UPDATED_EVENT fires
  useEffect(() => {
    const fetchLexicon = () => {
      setIsLoading(true);
      apiFetch<{ data: CardWithSrs[] }>('/api/cards')
        .then((res) => {
          setCards(res.data || []);
        })
        .catch(() => {})
        .finally(() => {
          setIsLoading(false);
        });
    };

    if (isOpen && cards.length === 0) {
      fetchLexicon();
    }

    const handleCardsUpdated = () => {
      fetchLexicon();
    };
    window.addEventListener(CARDS_UPDATED_EVENT, handleCardsUpdated);
    return () => window.removeEventListener(CARDS_UPDATED_EVENT, handleCardsUpdated);
  }, [isOpen, cards.length]);

  // Autofocus input & reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const trimmedQuery = query.trim();
  const normQuery = trimmedQuery.toLowerCase();

  // Live Lexicon Matches (up to 6)
  const matchedCards = useMemo(() => {
    if (!normQuery) {
      return cards.slice(0, 4);
    }

    const scored: Array<{ card: CardWithSrs; score: number }> = [];
    for (const card of cards) {
      let score = 0;
      const termLower = card.term.toLowerCase();
      if (termLower === normQuery) score += 100;
      else if (termLower.startsWith(normQuery)) score += 60;
      else if (termLower.includes(normQuery)) score += 40;

      if (card.primary_definition?.toLowerCase().includes(normQuery)) score += 20;
      if (card.english_gloss?.toLowerCase().includes(normQuery)) score += 25;
      if (
        card.etymology?.roots?.some(
          (r) =>
            r.morpheme.toLowerCase().includes(normQuery) ||
            r.meaning.toLowerCase().includes(normQuery)
        )
      ) {
        score += 25;
      }
      if (
        card.source_context?.author?.toLowerCase().includes(normQuery) ||
        card.source_context?.source?.toLowerCase().includes(normQuery)
      ) {
        score += 15;
      }

      if (score > 0) {
        scored.push({ card, score });
      }
    }

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((s) => s.card);
  }, [cards, normQuery]);

  // Studio Navigation Commands filtered by query
  const matchedCommands = useMemo(() => {
    if (!normQuery) return STUDIO_NAV_COMMANDS;
    return STUDIO_NAV_COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(normQuery) ||
        cmd.subtitle.toLowerCase().includes(normQuery) ||
        cmd.keywords.toLowerCase().includes(normQuery)
    );
  }, [normQuery]);

  // Unified flat list of selectable items for keyboard navigation
  const selectableItems = useMemo<PaletteActionItem[]>(() => {
    const items: PaletteActionItem[] = [];

    for (const card of matchedCards) {
      items.push({
        kind: 'card',
        card,
        href: `/lexicon?inspect=${encodeURIComponent(card.id)}`,
      });
    }

    if (trimmedQuery.length > 0) {
      items.push({
        kind: 'capture',
        term: trimmedQuery,
        href: `/add?term=${encodeURIComponent(trimmedQuery)}`,
      });
    }

    for (const command of matchedCommands) {
      items.push({
        kind: 'command',
        command,
        href: command.href,
      });
    }

    return items;
  }, [matchedCards, trimmedQuery, matchedCommands]);

  // Keep selectedIndex in bounds when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigateTo = (href: string) => {
    onClose();
    router.push(href);
  };

  // Keyboard navigation handler (ArrowUp, ArrowDown, Enter, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (selectableItems.length > 0) {
          setSelectedIndex((prev) => (prev + 1) % selectableItems.length);
        }
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectableItems.length > 0) {
          setSelectedIndex(
            (prev) => (prev - 1 + selectableItems.length) % selectableItems.length
          );
        }
        return;
      }

      if (e.key === 'Enter') {
        const activeItem = selectableItems[selectedIndex];
        if (activeItem) {
          e.preventDefault();
          navigateTo(activeItem.href);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectableItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  let runningIdx = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Global Command Palette and Lexicon Search"
    >
      <div
        className="w-full max-w-2xl bg-[#fbf9f5] border border-[#e7e5e4] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="bg-white border-b border-[#e7e5e4] px-4 py-3.5 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#834832] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your lexicon by headword, root, author, or run a studio command..."
            aria-label="Command palette search input"
            className="flex-1 text-sm sm:text-base font-sans bg-transparent text-[#1c1917] placeholder:text-stone-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs font-sans text-stone-400 hover:text-stone-700 px-2 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Results & Commands Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* 1. Live Lexicon Results */}
          {matchedCards.length > 0 && (
            <div className="space-y-1.5">
              <div className="px-2 flex items-center justify-between text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-400">
                <span>
                  {normQuery
                    ? `Live Lexicon Matches (${matchedCards.length})`
                    : 'Recent Lexicon Entries'}
                </span>
                <span>{isLoading ? 'Syncing…' : `${cards.length} total cards`}</span>
              </div>

              <div className="space-y-1">
                {matchedCards.map((card) => {
                  runningIdx += 1;
                  const itemIndex = runningIdx;
                  const isSelected = selectedIndex === itemIndex;
                  const isSpanish = (card.language || 'en') === 'es';

                  return (
                    <div
                      key={card.id}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      onClick={() =>
                        navigateTo(`/lexicon?inspect=${encodeURIComponent(card.id)}`)
                      }
                      className={cn(
                        'p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5',
                        isSelected
                          ? 'bg-[#fdf8f6] border-[#834832] shadow-2xs'
                          : 'bg-white border-[#e7e5e4] hover:border-stone-300'
                      )}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">
                            {isSpanish ? '🇪🇸 ES' : '🇬🇧 EN'}
                          </span>
                          <span className="font-serif font-bold text-base text-[#1c1917] capitalize">
                            {card.term}
                          </span>
                          <span className="text-xs font-sans text-[#834832] font-medium">
                            {card.part_of_speech}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-stone-100 text-stone-600">
                            {getCardStateLabel(card.srs.state)}
                          </span>
                          <span className="text-[11px] font-mono text-stone-400">
                            S: {card.srs.stability.toFixed(1)}d
                          </span>
                        </div>
                        <p className="text-xs font-serif text-stone-600 line-clamp-1">
                          {card.primary_definition}
                        </p>
                      </div>

                      <div
                        className="flex items-center gap-1.5 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            navigateTo(`/lexicon?inspect=${encodeURIComponent(card.id)}`)
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-[11px] font-sans font-semibold text-stone-700 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-[#834832]" />
                          <span>Inspect Dossier</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            navigateTo(`/review?cardId=${encodeURIComponent(card.id)}`)
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#834832] hover:bg-[#693522] text-[11px] font-sans font-semibold text-white transition-colors cursor-pointer"
                        >
                          <span>Drill Now</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Instant Capture Action when query is non-empty */}
          {trimmedQuery.length > 0 && (
            <div className="space-y-1.5">
              <div className="px-2 text-[11px] font-sans font-semibold uppercase tracking-wider text-[#834832]">
                Instant Lexical Capture
              </div>
              {(() => {
                runningIdx += 1;
                const itemIndex = runningIdx;
                const isSelected = selectedIndex === itemIndex;
                return (
                  <button
                    type="button"
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    onClick={() =>
                      navigateTo(`/add?term=${encodeURIComponent(trimmedQuery)}`)
                    }
                    className={cn(
                      'w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer',
                      isSelected
                        ? 'bg-[#834832] text-white border-[#834832] shadow-sm'
                        : 'bg-[#fdf8f6] text-[#834832] border-[#eaddd7] hover:bg-[#f2e8e5]'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span className="text-xs sm:text-sm font-sans font-semibold">
                        ✨ Capture &amp; Enrich &ldquo;{trimmedQuery}&rdquo; in Quick Capture →
                      </span>
                    </div>
                    <span
                      className={cn(
                        'text-[11px] font-mono px-2 py-0.5 rounded',
                        isSelected
                          ? 'bg-[#693522] text-[#fdf8f6]'
                          : 'bg-white text-[#834832] border border-[#eaddd7]'
                      )}
                    >
                      /add
                    </span>
                  </button>
                );
              })()}
            </div>
          )}

          {/* 3. Quick Studio Navigation Commands */}
          {matchedCommands.length > 0 && (
            <div className="space-y-1.5">
              <div className="px-2 text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-400">
                Studio Navigation &amp; Tools
              </div>
              <div className="space-y-1">
                {matchedCommands.map((cmd) => {
                  runningIdx += 1;
                  const itemIndex = runningIdx;
                  const isSelected = selectedIndex === itemIndex;
                  const Icon = cmd.icon;

                  return (
                    <button
                      key={cmd.id}
                      type="button"
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      onClick={() => navigateTo(cmd.href)}
                      className={cn(
                        'w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer',
                        isSelected
                          ? 'bg-[#fdf8f6] border-[#834832] text-[#1c1917] shadow-2xs'
                          : 'bg-white border-transparent hover:border-[#e7e5e4] text-stone-700'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                            isSelected
                              ? 'bg-[#834832] text-white'
                              : 'bg-stone-100 text-[#834832]'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-sans font-semibold text-[#1c1917] truncate">
                            {cmd.label}
                          </div>
                          <div className="text-[11px] font-sans text-stone-500 truncate">
                            {cmd.subtitle}
                          </div>
                        </div>
                      </div>
                      <ArrowRight
                        className={cn(
                          'w-4 h-4 shrink-0 transition-transform',
                          isSelected ? 'text-[#834832] translate-x-0.5' : 'text-stone-400'
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Keyboard Hints */}
        <div className="bg-white border-t border-[#e7e5e4] px-4 py-2.5 flex items-center justify-between text-[11px] font-sans text-stone-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 font-mono text-[10px]">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 font-mono text-[10px]">
                ↵
              </kbd>
              <span>Open</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 font-mono text-[10px]">
                Esc
              </kbd>
              <span>Close</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-stone-400">
            <Command className="w-3 h-3" />
            <span>Lexis Global Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
}
