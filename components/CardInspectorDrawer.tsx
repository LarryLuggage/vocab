'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Volume2,
  Sparkles,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  GitBranch,
  Layers,
  Quote,
  Clock,
  ArrowRight,
  RefreshCw,
  Check,
  MessageSquare,
} from 'lucide-react';
import { CardWithSrs, ProductionLog } from '@/types/lexis';
import { apiFetch, errorMessageOf, notifyCardsUpdated } from '@/lib/api-client';
import { getCardStateLabel, formatIntervalDisplay } from '@/lib/fsrs';
import { formatGenderBadge } from '@/lib/language';
import { cn } from '@/lib/utils';

export interface CardInspectorDrawerProps {
  card: CardWithSrs | null;
  onClose: () => void;
  onCardUpdated: (updatedCard: CardWithSrs) => void;
  onCardDeleted: (deletedId: string) => void;
}

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

function renderClozeHighlighted(sentence: string) {
  const parts = sentence.split(/(\{\{.*?\}\})/g);
  return parts.map((part, idx) => {
    if (part.startsWith('{{') && part.endsWith('}}')) {
      const target = part.slice(2, -2);
      return (
        <span
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-[#834832]/15 text-[#834832] font-bold underline decoration-[#834832]/40 underline-offset-2"
        >
          {target}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export function CardInspectorDrawer({
  card,
  onClose,
  onCardUpdated,
  onCardDeleted,
}: CardInspectorDrawerProps) {
  const [productionLogs, setProductionLogs] = useState<ProductionLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editDefinition, setEditDefinition] = useState('');
  const [editGloss, setEditGloss] = useState('');
  const [editNuance, setEditNuance] = useState('');
  const [editPos, setEditPos] = useState('');
  const [editPhonetic, setEditPhonetic] = useState('');
  const [editSentence, setEditSentence] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editSource, setEditSource] = useState('');
  const [editPage, setEditPage] = useState('');

  // Async action states
  const [isSaving, setIsSaving] = useState(false);
  const [isReenriching, setIsReenriching] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync form state & fetch full card dossier + production logs when card changes
  useEffect(() => {
    if (!card) return;

    setIsEditing(false);
    setConfirmDelete(false);
    setStatusMessage(null);
    setErrorMessage(null);

    setEditDefinition(card.primary_definition || '');
    setEditGloss(card.english_gloss || '');
    setEditNuance(card.nuance_note || '');
    setEditPos(card.part_of_speech || '');
    setEditPhonetic(card.phonetic || '');
    setEditSentence(card.source_context?.sentence || '');
    setEditAuthor(card.source_context?.author || '');
    setEditSource(card.source_context?.source || '');
    setEditPage(card.source_context?.page || '');

    setIsLoadingLogs(true);
    apiFetch<{ data: CardWithSrs; productionLogs?: ProductionLog[] }>(
      `/api/cards/${encodeURIComponent(card.id)}`
    )
      .then((res) => {
        if (Array.isArray(res.productionLogs)) {
          setProductionLogs(res.productionLogs);
        } else {
          setProductionLogs([]);
        }
      })
      .catch(() => {
        setProductionLogs([]);
      })
      .finally(() => {
        setIsLoadingLogs(false);
      });
  }, [card?.id]);

  // Escape key handler
  useEffect(() => {
    if (!card) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, onClose]);

  if (!card) return null;

  const isSpanish = (card.language || 'en') === 'es';
  const genderBadge = isSpanish ? formatGenderBadge(card.gender, card.part_of_speech) : null;
  const dueDate = new Date(card.srs.due);
  const isDue = dueDate.getTime() <= Date.now();

  const handlePlayPronunciation = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(card.term);
      utterance.lang = isSpanish ? 'es-ES' : 'en-US';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore synthesis errors in unsupported environments
    }
  };

  const handleReenrich = async () => {
    setIsReenriching(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const res = await apiFetch<{ data: CardWithSrs }>(
        `/api/cards/${encodeURIComponent(card.id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ reenrich: true }),
        }
      );
      notifyCardsUpdated();
      onCardUpdated(res.data);
      // Sync local form fields with newly enriched values
      setEditDefinition(res.data.primary_definition || '');
      setEditGloss(res.data.english_gloss || '');
      setEditNuance(res.data.nuance_note || '');
      setEditPos(res.data.part_of_speech || '');
      setEditPhonetic(res.data.phonetic || '');
      setStatusMessage('Card enriched while preserving your citation & FSRS schedule.');
    } catch (err) {
      setErrorMessage(errorMessageOf(err, 'Failed to re-enrich card with AI.'));
    } finally {
      setIsReenriching(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDefinition.trim()) {
      setErrorMessage('Primary definition cannot be empty.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const res = await apiFetch<{ data: CardWithSrs }>(
        `/api/cards/${encodeURIComponent(card.id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            primary_definition: editDefinition.trim(),
            english_gloss: editGloss.trim() || null,
            nuance_note: editNuance.trim() || null,
            part_of_speech: editPos.trim() || 'noun',
            phonetic: editPhonetic.trim() || null,
            source_context: {
              sentence: editSentence.trim() || null,
              author: editAuthor.trim() || null,
              source: editSource.trim() || null,
              page: editPage.trim() || null,
              url: card.source_context?.url || null,
            },
          }),
        }
      );
      notifyCardsUpdated();
      onCardUpdated(res.data);
      setIsEditing(false);
      setStatusMessage('Card changes saved.');
    } catch (err) {
      setErrorMessage(errorMessageOf(err, 'Failed to save changes.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await apiFetch(`/api/cards/${encodeURIComponent(card.id)}`, {
        method: 'DELETE',
      });
      notifyCardsUpdated();
      onCardDeleted(card.id);
      onClose();
    } catch (err) {
      setErrorMessage(errorMessageOf(err, 'Failed to delete card.'));
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-card-term"
    >
      <div
        className="relative w-full max-w-2xl bg-[#fbf9f5] h-full shadow-2xl border-l border-[#e7e5e4] flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header & Telemetry Bar */}
        <div className="bg-white border-b border-[#e7e5e4] px-6 py-5 space-y-4 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2
                  id="drawer-card-term"
                  className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917] capitalize tracking-tight"
                >
                  {card.term}
                </h2>
                {card.phonetic && (
                  <span className="font-mono text-xs text-[#78716c] px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
                    {card.phonetic}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handlePlayPronunciation}
                  title="Listen to pronunciation"
                  aria-label="Listen to pronunciation"
                  className="p-1.5 rounded-full text-stone-500 hover:text-[#834832] hover:bg-[#834832]/10 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                  {isSpanish ? '🇪🇸 ES' : '🇬🇧 EN'}
                </span>
                {genderBadge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-amber-50 text-amber-900 border border-amber-300">
                    {genderBadge.fullBadge}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-[#f2e8e5] text-[#834832] text-xs font-sans font-semibold">
                  {card.part_of_speech}
                </span>
                {card.is_fallback && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-amber-50 text-amber-900 border border-amber-300">
                    <AlertTriangle className="w-3 h-3" />
                    {fallbackSourceLabel(card.enrichment_source)}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close inspector drawer"
              className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FSRS Telemetry Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-sans">
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                card.srs.state === 0
                  ? 'bg-stone-100 text-stone-700'
                  : card.srs.state === 1
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              )}
            >
              {getCardStateLabel(card.srs.state)}
            </span>
            <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[11px] text-stone-700">
              S: {card.srs.stability.toFixed(1)}d
            </span>
            <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[11px] text-stone-700">
              D: {card.srs.difficulty.toFixed(1)}
            </span>
            <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[11px] text-stone-700">
              Reps: {card.srs.reps}
            </span>
            <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[11px] text-stone-700">
              Lapses: {card.srs.lapses}
            </span>
            <span
              className={cn(
                'px-2 py-0.5 rounded font-sans text-[11px] flex items-center gap-1 ml-auto',
                isDue
                  ? 'bg-[#fdf8f6] text-[#834832] font-semibold border border-[#eaddd7]'
                  : 'text-stone-500'
              )}
            >
              <Clock className="w-3 h-3" />
              <span>
                {isDue
                  ? 'Due now'
                  : `Due in ${formatIntervalDisplay(dueDate)} (${dueDate.toLocaleDateString()})`}
              </span>
            </span>
          </div>

          {/* Action Toolbar: Edit / Re-Enrich / Delete */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing((prev) => !prev);
                  setConfirmDelete(false);
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-semibold border transition-colors',
                  isEditing
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                )}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Card'}</span>
              </button>

              <button
                type="button"
                onClick={handleReenrich}
                disabled={isReenriching}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-semibold border border-[#834832]/30 bg-[#fdf8f6] text-[#834832] hover:bg-[#f2e8e5] disabled:opacity-50 transition-colors"
              >
                {isReenriching ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{isReenriching ? 'Re-Enriching…' : 'Re-Enrich'}</span>
              </button>
            </div>

            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-sans font-medium text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl">
                <span className="text-[11px] font-sans font-semibold text-rose-900">
                  Delete permanently?
                </span>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-2 py-0.5 rounded bg-rose-700 text-white text-[11px] font-sans font-semibold hover:bg-rose-800 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting…' : 'Confirm Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-0.5 rounded text-stone-600 hover:text-stone-900 text-[11px] font-sans"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status / Error Banners */}
          {statusMessage && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-emerald-900 text-xs font-sans">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2 text-rose-900 text-xs font-sans">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Prominent Fallback Callout Banner */}
          {card.is_fallback && (
            <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{fallbackSourceLabel(card.enrichment_source)} Active</span>
                </div>
                <p className="text-xs font-sans text-amber-800 leading-relaxed">
                  {card.fallback_reason ||
                    'This entry was created while the live AI pipeline was unavailable. Re-enrich now to generate deep roots, nuance notes, and cloze drills while keeping your citation and FSRS progress.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleReenrich}
                disabled={isReenriching}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#834832] text-white text-xs font-sans font-semibold hover:bg-[#693522] disabled:opacity-50 shrink-0 shadow-xs cursor-pointer"
              >
                {isReenriching ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{isReenriching ? 'Re-Enriching…' : 'Re-Enrich with AI'}</span>
              </button>
            </div>
          )}

          {isEditing ? (
            /* --- INLINE EDIT FORM --- */
            <form onSubmit={handleSaveEdit} className="bg-white border border-[#e7e5e4] rounded-2xl p-5 space-y-4 shadow-xs">
              <h3 className="text-sm font-serif font-bold text-[#1c1917] border-b border-stone-100 pb-2">
                Edit Lexical Entry & Citation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Part of Speech
                  </label>
                  <input
                    type="text"
                    value={editPos}
                    onChange={(e) => setEditPos(e.target.value)}
                    className="w-full text-xs font-sans px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#834832]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Phonetic (IPA)
                  </label>
                  <input
                    type="text"
                    value={editPhonetic}
                    onChange={(e) => setEditPhonetic(e.target.value)}
                    placeholder="/.../"
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#834832]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Primary Definition *
                </label>
                <textarea
                  rows={3}
                  value={editDefinition}
                  onChange={(e) => setEditDefinition(e.target.value)}
                  required
                  className="w-full text-sm font-serif px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#834832]"
                />
              </div>

              {(isSpanish || editGloss) && (
                <div>
                  <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[#0369a1] mb-1">
                    English Anchor / Gloss
                  </label>
                  <input
                    type="text"
                    value={editGloss}
                    onChange={(e) => setEditGloss(e.target.value)}
                    placeholder="Concise English equivalent..."
                    className="w-full text-xs font-serif px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#834832]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Connotative Nuance Note
                </label>
                <textarea
                  rows={3}
                  value={editNuance}
                  onChange={(e) => setEditNuance(e.target.value)}
                  className="w-full text-xs font-serif px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#834832]"
                />
              </div>

              <div className="pt-2 border-t border-stone-100 space-y-3">
                <span className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[#834832]">
                  Source Context & Bibliographic Citation
                </span>

                <div>
                  <label className="block text-[11px] font-sans text-stone-500 mb-1">
                    Captured Quote / Sentence
                  </label>
                  <textarea
                    rows={2}
                    value={editSentence}
                    onChange={(e) => setEditSentence(e.target.value)}
                    placeholder="Original sentence where you encountered this word..."
                    className="w-full text-xs font-serif italic px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#834832]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-sans text-stone-500 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                      placeholder="e.g., Jorge Luis Borges"
                      className="w-full text-xs font-sans px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#834832]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-sans text-stone-500 mb-1">
                      Book / Article Title
                    </label>
                    <input
                      type="text"
                      value={editSource}
                      onChange={(e) => setEditSource(e.target.value)}
                      placeholder="e.g., Ficciones"
                      className="w-full text-xs font-sans px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#834832]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-sans text-stone-500 mb-1">
                      Page / Location
                    </label>
                    <input
                      type="text"
                      value={editPage}
                      onChange={(e) => setEditPage(e.target.value)}
                      placeholder="e.g., p. 42"
                      className="w-full text-xs font-sans px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#834832]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-sans font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#834832] text-white text-xs font-sans font-semibold hover:bg-[#693522] disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving…' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* --- FULL LEXICAL DOSSIER (VIEW MODE) --- */
            <div className="space-y-5">
              {/* Primary Definition & English Gloss */}
              <div className="bg-white border border-[#e7e5e4] rounded-2xl p-5 space-y-3 shadow-xs">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-400 block">
                  Primary Definition
                </span>
                <p className="text-base font-serif text-[#1c1917] leading-relaxed">
                  {card.primary_definition}
                </p>

                {card.english_gloss && (
                  <div className="p-3 rounded-xl bg-[#f0f9ff] border border-[#bae6fd] text-xs font-serif text-[#0c4a6e] flex items-baseline gap-2">
                    <span className="font-sans font-semibold text-[10px] uppercase tracking-wider text-[#0369a1] shrink-0">
                      English Anchor:
                    </span>
                    <span className="italic font-medium">“{card.english_gloss}”</span>
                  </div>
                )}

                {card.nuance_note && (
                  <div className="p-3.5 rounded-xl bg-[#fdf8f6] border border-[#eaddd7] space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-[#834832] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Connotative Nuance & Register</span>
                    </div>
                    <p className="text-xs font-serif italic text-[#4f2416] leading-relaxed">
                      “{card.nuance_note}”
                    </p>
                  </div>
                )}
              </div>

              {/* Source Context & Bibliographic Citation */}
              {(card.source_context?.sentence ||
                card.source_context?.author ||
                card.source_context?.source) && (
                <div className="bg-white border border-[#e7e5e4] rounded-2xl p-5 space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold uppercase tracking-wider text-[#834832]">
                    <Quote className="w-3.5 h-3.5" />
                    <span>Reading Source & Citation</span>
                  </div>
                  {card.source_context.sentence && (
                    <blockquote className="text-sm font-serif italic text-stone-800 border-l-2 border-[#834832] pl-3 py-0.5 leading-relaxed">
                      “{card.source_context.sentence}”
                    </blockquote>
                  )}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-stone-600 pt-1">
                    {card.source_context.author && (
                      <span className="font-semibold text-stone-800">
                        {card.source_context.author}
                      </span>
                    )}
                    {card.source_context.source && (
                      <span className="italic text-stone-700">
                        {card.source_context.author ? `— ${card.source_context.source}` : card.source_context.source}
                      </span>
                    )}
                    {card.source_context.page && (
                      <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[11px] text-stone-600">
                        p. {card.source_context.page}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Etymological Roots & Cognates */}
              {(card.etymology?.roots?.length > 0 || card.etymology?.cognates?.length > 0) && (
                <div className="bg-white border border-[#e7e5e4] rounded-2xl p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-500">
                    <GitBranch className="w-3.5 h-3.5 text-[#834832]" />
                    <span>Etymological Roots & Cognates</span>
                  </div>
                  {card.etymology.roots?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {card.etymology.roots.map((r, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-xs font-sans text-stone-700"
                        >
                          <strong className="text-stone-900">{r.origin}</strong>:{' '}
                          <em className="text-[#834832] font-serif">{r.morpheme}</em> (“{r.meaning}”)
                        </span>
                      ))}
                    </div>
                  )}
                  {card.etymology.cognates?.length > 0 && (
                    <div className="text-xs font-sans text-stone-600">
                      <span className="font-semibold text-stone-700">Cognates: </span>
                      <span>{card.etymology.cognates.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Collocations & Cloze Sentences */}
              {(card.collocations?.length > 0 || card.cloze_sentences?.length > 0) && (
                <div className="bg-white border border-[#e7e5e4] rounded-2xl p-5 space-y-4 shadow-xs">
                  {card.collocations?.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-500">
                        <Layers className="w-3.5 h-3.5 text-[#834832]" />
                        <span>Scholarly Collocations</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {card.collocations.map((col, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-full bg-[#f2e8e5]/60 text-[#693522] text-xs font-sans"
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {card.cloze_sentences?.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-500">
                        <BookOpen className="w-3.5 h-3.5 text-[#834832]" />
                        <span>Contextual Cloze Drills</span>
                      </div>
                      <ul className="space-y-2">
                        {card.cloze_sentences.map((sent, idx) => (
                          <li
                            key={idx}
                            className="text-xs font-serif text-stone-700 bg-stone-50/80 border border-stone-200/80 rounded-xl p-3 leading-relaxed"
                          >
                            {renderClozeHighlighted(sent)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Distinction Matrix */}
              {card.distinction_matrix &&
                (card.distinction_matrix.nuanceComparison ||
                  card.distinction_matrix.synonyms?.length > 0) && (
                  <div className="bg-white border border-[#e7e5e4] rounded-2xl p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-500">
                        Synonym Distinction Matrix
                      </span>
                      {card.distinction_matrix.synonyms?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {card.distinction_matrix.synonyms.map((syn, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-stone-100 text-[11px] font-serif italic text-stone-700"
                            >
                              {syn}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {card.distinction_matrix.nuanceComparison && (
                      <p className="text-xs font-serif text-stone-700 leading-relaxed">
                        {card.distinction_matrix.nuanceComparison}
                      </p>
                    )}
                    {card.distinction_matrix.contextRecommendations?.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 pt-1">
                        {card.distinction_matrix.contextRecommendations.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-serif font-bold text-[#1c1917]">
                                {item.word}
                              </span>
                              <span className="text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 rounded bg-stone-200/70 text-stone-700">
                                {item.recommendedRegister}
                              </span>
                            </div>
                            <p className="font-serif italic text-stone-600">
                              “{item.exampleSentence}”
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              {/* Active Production History (ACT-03) */}
              <div className="bg-white border border-[#e7e5e4] rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-500">
                    <MessageSquare className="w-3.5 h-3.5 text-[#834832]" />
                    <span>Active Production History (ACT-03)</span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">
                    {productionLogs.length} {productionLogs.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>

                {isLoadingLogs ? (
                  <p className="text-xs font-sans text-stone-400 py-3">
                    Loading production history…
                  </p>
                ) : productionLogs.length === 0 ? (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 text-center space-y-2">
                    <p className="text-xs font-sans text-stone-500">
                      No active sentence compositions logged for <strong className="font-serif text-stone-700">{card.term}</strong> yet.
                    </p>
                    <Link
                      href={`/review?cardId=${encodeURIComponent(card.id)}`}
                      className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-[#834832] hover:text-[#693522]"
                    >
                      <span>Compose a sentence in Review Mode</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {productionLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider',
                              log.evaluation_status === 'pass'
                                ? 'bg-emerald-100 text-emerald-800'
                                : log.evaluation_status === 'awkward'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            )}
                          >
                            {log.evaluation_status === 'pass'
                              ? 'Pass'
                              : log.evaluation_status === 'awkward'
                              ? 'Awkward'
                              : 'Incorrect'}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">
                            {new Date(log.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs font-serif text-stone-800 italic">
                          “{log.user_sentence}”
                        </p>
                        {log.feedback && (
                          <p className="text-[11px] font-sans text-stone-600 leading-relaxed">
                            {log.feedback}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer CTA */}
        <div className="bg-white border-t border-[#e7e5e4] px-6 py-4 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-sans font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Close
          </button>

          <Link
            href={`/review?cardId=${encodeURIComponent(card.id)}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#834832] text-white text-xs font-sans font-semibold hover:bg-[#693522] transition-colors shadow-xs"
          >
            <span>Practice This Word Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
