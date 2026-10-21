'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Send,
  RefreshCw,
  Trophy,
  ArrowRight,
  BookOpen,
  Volume2,
  GitBranch,
  Layers,
  Flame,
  Award,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';
import {
  CardWithSrs,
  FSRSRating,
  EvaluationStatus,
  ProductionValidationResult,
  DistinctionMatrixItem,
} from '@/types/lexis';
import { apiFetch, errorMessageOf, notifyCardsUpdated } from '@/lib/api-client';
import {
  getSchedulePreviews,
  getCardStateLabel,
} from '@/lib/fsrs';
import {
  validateProductionSentence,
  validateSynthesisPassage,
} from '@/lib/production-validator';
import { normalizeDiacritics, formatGenderBadge } from '@/lib/language';
import { cn, extractClozeToken } from '@/lib/utils';
import { buildDistinctionQuiz, gradeDistinctionChoice } from '@/lib/distinction-quiz';

type ModalityMode = 'ACT-01' | 'ACT-02' | 'ACT-03' | 'ACT-04';

function CardFullDetails({
  card,
  onPlayPronunciation,
}: {
  card: CardWithSrs;
  onPlayPronunciation: (word: string, language?: string) => void;
}) {
  const isSpanish = (card.language || 'en') === 'es';
  const genderBadge = isSpanish ? formatGenderBadge(card.gender, card.part_of_speech) : null;

  return (
    <div className="space-y-4 text-left">
      {/* Header: Term, Phonetic, Audio, Language Badge, POS, Gender Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="font-serif font-bold text-2xl text-[#1c1917] capitalize tracking-tight">
            {card.term}
          </h3>
          {card.phonetic && (
            <span className="font-mono text-xs text-[#78716c] px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
              {card.phonetic}
            </span>
          )}
          <button
            type="button"
            onClick={() => onPlayPronunciation(card.term, card.language)}
            title="Listen to pronunciation"
            aria-label="Listen to pronunciation"
            className="p-1 rounded-full text-stone-400 hover:text-[#834832] hover:bg-[#834832]/10 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          {/* Language Indicator Badge */}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
            {isSpanish ? '🇪🇸 Español' : '🇬🇧 English'}
          </span>
          {/* Grammatical Gender Badge for Spanish Cards */}
          {genderBadge && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1">
              <span className="font-serif italic font-bold">{genderBadge.article}</span>
              <span>•</span>
              <span>{genderBadge.label}</span>
            </span>
          )}
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#f2e8e5] text-[#834832] text-xs font-sans font-semibold shrink-0">
          {card.part_of_speech}
        </span>
      </div>

      {/* Primary Definition */}
      <div className="space-y-1">
        <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-400">
          Primary Definition
        </span>
        <p className="text-sm sm:text-base font-serif text-[#292524] leading-relaxed">
          {card.primary_definition}
        </p>
      </div>

      {/* English Gloss Anchor (For Spanish cards) */}
      {isSpanish && card.english_gloss && (
        <div className="p-3 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl text-xs space-y-1 animate-in fade-in">
          <div className="flex items-center gap-1.5 font-sans font-semibold text-[#0369a1] uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>English Anchor / Gloss</span>
          </div>
          <p className="font-serif italic text-[#0c4a6e] font-medium leading-relaxed text-sm">
            “{card.english_gloss}”
          </p>
        </div>
      )}

      {/* Nuance Note */}
      {card.nuance_note && (
        <div className="p-3.5 bg-[#fdf8f6] border border-[#eaddd7] rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-sans font-semibold text-[#834832]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nuance & Connotative Precision</span>
          </div>
          <p className="font-serif text-[#4f2416] leading-relaxed">
            {card.nuance_note}
          </p>
        </div>
      )}

      {/* Etymological Roots */}
      {card.etymology?.roots?.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-stone-500">
            <GitBranch className="w-3.5 h-3.5 text-[#834832]" />
            <span>Etymological Roots</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs font-sans text-stone-700">
            {card.etymology.roots.map((r, idx) => (
              <span key={idx} className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                <strong className="text-stone-800">{r.origin}</strong>: <em className="text-[#834832]">{r.morpheme}</em> (“{r.meaning}”)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Scholarly Collocations */}
      {card.collocations?.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-stone-500">
            <Layers className="w-3.5 h-3.5 text-[#834832]" />
            <span>Collocations & Phrasal Patterns</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {card.collocations.map((c, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-serif italic border border-stone-200"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Source Citation Context */}
      {card.source_context?.sentence && (
        <div className="pt-2 border-t border-stone-100 text-xs font-serif italic text-stone-600 space-y-0.5">
          <p>“{card.source_context.sentence}”</p>
          {(card.source_context.author || card.source_context.source) && (
            <p className="not-italic font-sans text-stone-500 text-[11px]">
              — {[card.source_context.author, card.source_context.source, card.source_context.page].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewPage() {
  const [rawQueue, setRawQueue] = useState<CardWithSrs[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'en' | 'es'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drillAll, setDrillAll] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSavingRating, setIsSavingRating] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<{
    cardId?: string;
    root?: string;
    source?: string;
  } | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cardId = params.get('cardId') || undefined;
      const root = params.get('root') || undefined;
      const source = params.get('source') || undefined;
      if (cardId || root || source) {
        return { cardId, root, source };
      }
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cardId = params.get('cardId') || undefined;
      const root = params.get('root') || undefined;
      const source = params.get('source') || undefined;
      const modalityParam = params.get('modality')?.toUpperCase();
      if (
        modalityParam === 'ACT-01' ||
        modalityParam === 'ACT-02' ||
        modalityParam === 'ACT-03' ||
        modalityParam === 'ACT-04'
      ) {
        setActiveModality(modalityParam);
      }
      if (cardId || root || source) {
        setActiveFilter((prev) => {
          if (
            prev?.cardId === cardId &&
            prev?.root === root &&
            prev?.source === source
          ) {
            return prev;
          }
          return { cardId, root, source };
        });
      }
    }
  }, []);

  // Queue Counts for Language Filter Pills
  const languageCounts = useMemo(() => {
    const totalDue = rawQueue.length;
    const enDue = rawQueue.filter((c) => (c.language || 'en') === 'en').length;
    const esDue = rawQueue.filter((c) => c.language === 'es').length;
    return { totalDue, enDue, esDue };
  }, [rawQueue]);

  // Filtered queue based on selected language
  const queue = useMemo(() => {
    if (selectedLanguage === 'all') return rawQueue;
    return rawQueue.filter((c) => (c.language || 'en') === selectedLanguage);
  }, [rawQueue, selectedLanguage]);

  // Session Statistics
  const [reviewedCount, setReviewedCount] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Active Modality Mode
  const [activeModality, setActiveModality] = useState<ModalityMode>('ACT-01');

  // Modality 1: Cloze state
  const [clozeSentenceIndex, setClozeSentenceIndex] = useState(0);
  const [clozeInput, setClozeInput] = useState('');
  const [clozeChecked, setClozeChecked] = useState(false);
  const [clozeIsCorrect, setClozeIsCorrect] = useState<boolean | null>(null);
  const [omittedAccents, setOmittedAccents] = useState(false);

  // Modality 2: Distinction Matrix state
  const [selectedSynonym, setSelectedSynonym] = useState<string | null>(null);
  const [distinctionFeedback, setDistinctionFeedback] = useState<{
    correct: boolean;
    explanation: string;
  } | null>(null);

  // Modality 3: Production Sandbox state
  const [productionSentence, setProductionSentence] = useState('');
  const [isVerifyingProduction, setIsVerifyingProduction] = useState(false);
  const [productionResult, setProductionResult] =
    useState<ProductionValidationResult | null>(null);

  // Modality 4: Synthesis Weave (ACT-04) state
  const [synthesisCount, setSynthesisCount] = useState<2 | 3>(2);
  const [synthesisPassage, setSynthesisPassage] = useState('');
  const [isVerifyingSynthesis, setIsVerifyingSynthesis] = useState(false);
  const [synthesisResult, setSynthesisResult] =
    useState<ProductionValidationResult | null>(null);
  const [showSynthesisDrawer, setShowSynthesisDrawer] = useState(false);
  const [gradeAllSynthesisCards, setGradeAllSynthesisCards] = useState(true);

  // Strict Answer Masking state (spoiler prevention)
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [showSandboxHints, setShowSandboxHints] = useState(false);

  // Pronunciation audio synthesis with dual-language support
  const playPronunciation = useCallback((word: string, language?: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Load the due queue (or every card, for drill-all, or targeted filter) from the server
  const refreshQueue = useCallback(
    async (
      includeAll: boolean = false,
      filterOverride?: { cardId?: string; root?: string; source?: string } | null
    ) => {
      setIsLoadingQueue(true);
      setLoadError(null);
      try {
        const effectiveFilter =
          filterOverride !== undefined ? filterOverride : activeFilter;
        let endpoint = includeAll ? '/api/cards' : '/api/review';
        if (!includeAll && effectiveFilter) {
          const qs = new URLSearchParams();
          if (effectiveFilter.cardId) qs.set('cardId', effectiveFilter.cardId);
          if (effectiveFilter.root) qs.set('root', effectiveFilter.root);
          if (effectiveFilter.source) qs.set('source', effectiveFilter.source);
          const queryStr = qs.toString();
          if (queryStr) {
            endpoint = `/api/review?${queryStr}`;
          }
        }
        const res = await apiFetch<{ data: CardWithSrs[] }>(endpoint);
        setRawQueue(res.data);
        setCurrentIndex(0);
        setSessionCompleted(res.data.length === 0);
      } catch (err) {
        setLoadError(errorMessageOf(err, 'Failed to load the review queue.'));
      } finally {
        setIsLoadingQueue(false);
      }
    },
    [activeFilter]
  );

  const handleExitFocusedDrill = useCallback(() => {
    setActiveFilter(null);
    setDrillAll(false);
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/review');
    }
    refreshQueue(false, null);
  }, [refreshQueue]);

  useEffect(() => {
    refreshQueue(drillAll);
  }, [drillAll, refreshQueue]);

  // Current Card
  const currentCard: CardWithSrs | undefined = queue[currentIndex];

  // Synthesis Companion Selection (ACT-04)
  const synthesisCards = useMemo<CardWithSrs[]>(() => {
    if (!currentCard) return [];
    const targetLang = currentCard.language || 'en';
    const candidatePool = queue.length >= synthesisCount ? queue : rawQueue;
    const sameLangCompanions: CardWithSrs[] = [];
    const otherCompanions: CardWithSrs[] = [];

    // Rotate starting from currentIndex + 1 so each card gets distinct companions
    const totalPool = candidatePool.length;
    for (let offset = 1; offset < totalPool; offset++) {
      const candidate = candidatePool[(currentIndex + offset) % totalPool];
      if (!candidate || candidate.id === currentCard.id) continue;
      if ((candidate.language || 'en') === targetLang) {
        if (!sameLangCompanions.some((c) => c.id === candidate.id)) {
          sameLangCompanions.push(candidate);
        }
      } else {
        if (!otherCompanions.some((c) => c.id === candidate.id)) {
          otherCompanions.push(candidate);
        }
      }
    }

    const picked = [...sameLangCompanions, ...otherCompanions].slice(
      0,
      synthesisCount - 1
    );
    return [currentCard, ...picked];
  }, [currentCard, queue, rawQueue, synthesisCount, currentIndex]);

  // Live Client-Side Word Detection for ACT-04
  const synthesisWordDetection = useMemo(() => {
    const normPassage = normalizeDiacritics(synthesisPassage.toLowerCase());
    const detectedMap: Record<string, boolean> = {};

    for (const card of synthesisCards) {
      const normTerm = normalizeDiacritics(card.term.trim().toLowerCase());
      if (!normPassage || !normTerm) {
        detectedMap[card.id] = false;
        continue;
      }
      const exactMatch = normPassage.includes(normTerm);
      const stemPrefix =
        normTerm.length >= 6 ? normTerm.slice(0, Math.max(4, normTerm.length - 2)) : normTerm;
      const stemMatch = stemPrefix.length >= 4 && normPassage.includes(stemPrefix);
      detectedMap[card.id] = exactMatch || stemMatch;
    }

    return detectedMap;
  }, [synthesisCards, synthesisPassage]);

  // Previews for FSRS 4 ratings
  const schedulePreviews = useMemo(() => {
    if (!currentCard) return [];
    return getSchedulePreviews(currentCard.srs);
  }, [currentCard]);

  // Reset modality inputs & answer masking whenever the active card changes
  useEffect(() => {
    const sentenceCount = currentCard?.cloze_sentences?.length || 1;
    setClozeSentenceIndex((currentCard?.srs.reps ?? 0) % sentenceCount);
    setClozeInput('');
    setClozeChecked(false);
    setClozeIsCorrect(null);
    setOmittedAccents(false);
    setSelectedSynonym(null);
    setDistinctionFeedback(null);
    setProductionSentence('');
    setProductionResult(null);
    setSynthesisPassage('');
    setSynthesisResult(null);
    setShowSynthesisDrawer(false);
    setIsAnswerRevealed(false);
    setShowSandboxHints(false);
  }, [currentIndex, currentCard?.id, currentCard?.srs.reps, currentCard?.cloze_sentences?.length]);

  // Handle explicit answer revelation
  const handleRevealAnswer = useCallback(() => {
    setIsAnswerRevealed(true);
    if (activeModality === 'ACT-01') {
      setClozeChecked(true);
      setClozeIsCorrect((prev) => (prev === null ? false : prev));
    }
    if (activeModality === 'ACT-03') {
      setShowSandboxHints(true);
    }
    if (activeModality === 'ACT-04') {
      setShowSynthesisDrawer(true);
    }
  }, [activeModality]);

  // Handle checking cloze answer with diacritic-tolerant verification for Spanish
  const handleCheckCloze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentCard || clozeChecked) return;

    const trimmedInput = clozeInput.trim();
    const target = currentCard.term.trim();

    const normInput = normalizeDiacritics(trimmedInput);
    const normTarget = normalizeDiacritics(target);

    // Diacritic-tolerant verification
    const isExactMatch = normInput === normTarget;
    const isPrefixMatch = normTarget.startsWith(normInput) && normInput.length >= 4;
    const isMatch = isExactMatch || isPrefixMatch;

    const hadOmittedAccents = isMatch && trimmedInput.toLowerCase() !== target.toLowerCase();
    setOmittedAccents(hadOmittedAccents);
    setClozeIsCorrect(isMatch);
    setClozeChecked(true);
    setIsAnswerRevealed(true);

    setTotalAttempts((prev) => prev + 1);
    if (isMatch) setCorrectAttempts((prev) => prev + 1);
  };

  // Distinction matrix question. Choices are shuffled once per card; the
  // correct answer is the term itself, not a fixed button index.
  const distinctionData = useMemo(() => {
    if (!currentCard) return null;
    return buildDistinctionQuiz(currentCard);
  }, [currentCard]);

  // Handle distinction selection
  const handleSelectSynonym = (chosenWord: string) => {
    if (!distinctionData || selectedSynonym) return;
    setSelectedSynonym(chosenWord);

    const isCorrect = gradeDistinctionChoice(chosenWord, distinctionData.correctWord);

    const isSpanish = (currentCard?.language || 'en') === 'es';
    const explanation = isCorrect
      ? (isSpanish
          ? `¡Correcto! "${chosenWord}" se ajusta al registro especificado (${distinctionData.promptTone}).`
          : `Correct! "${chosenWord}" matches the specified register (${distinctionData.promptTone}).`)
      : (isSpanish
          ? `No del todo. "${chosenWord}" tiene un matiz diferente; "${distinctionData.correctWord}" es la opción idónea para ${distinctionData.promptTone}.`
          : `Not quite. "${chosenWord}" carries a different tone; "${distinctionData.correctWord}" is calibrated for ${distinctionData.promptTone}.`);

    setDistinctionFeedback({
      correct: isCorrect,
      explanation,
    });

    setTotalAttempts((prev) => prev + 1);
    if (isCorrect) setCorrectAttempts((prev) => prev + 1);
    setIsAnswerRevealed(true);
  };

  // Handle production sentence verification
  const handleVerifyProduction = async () => {
    if (!currentCard || !productionSentence.trim()) return;

    setIsVerifyingProduction(true);
    setProductionResult(null);

    try {
      const result = await validateProductionSentence(
        currentCard.term,
        productionSentence,
        currentCard.id
      );
      setProductionResult(result);
      setIsAnswerRevealed(true);
      setShowSandboxHints(true);
      setTotalAttempts((prev) => prev + 1);
      if (result.evaluationStatus === 'pass') {
        setCorrectAttempts((prev) => prev + 1);
      }
    } catch {
      setProductionResult({
        evaluationStatus: 'awkward',
        registerDetected: 'Unverified',
        feedback: 'Verification service unreachable, but sentence recorded.',
      });
      setIsAnswerRevealed(true);
      setShowSandboxHints(true);
    } finally {
      setIsVerifyingProduction(false);
    }
  };

  // Handle multi-word synthesis passage verification (ACT-04)
  const handleVerifySynthesis = async () => {
    if (!currentCard || synthesisCards.length === 0 || !synthesisPassage.trim()) return;

    setIsVerifyingSynthesis(true);
    setSynthesisResult(null);

    const terms = synthesisCards.map((c) => c.term);
    const cardIds = synthesisCards.map((c) => c.id);

    try {
      const result = await validateSynthesisPassage(terms, synthesisPassage, cardIds);
      setSynthesisResult(result);
      setIsAnswerRevealed(true);
      setShowSynthesisDrawer(true);
      setTotalAttempts((prev) => prev + 1);
      if (result.evaluationStatus === 'pass') {
        setCorrectAttempts((prev) => prev + 1);
      }
    } catch {
      const detected = synthesisCards
        .filter((c) => synthesisWordDetection[c.id])
        .map((c) => c.term);
      const missing = synthesisCards
        .filter((c) => !synthesisWordDetection[c.id])
        .map((c) => c.term);

      setSynthesisResult({
        evaluationStatus: missing.length === 0 ? 'pass' : 'awkward',
        registerDetected: 'Unverified',
        termsDetected: detected,
        missingTerms: missing,
        feedback: 'Verification service unreachable, but synthesis passage recorded.',
      });
      setIsAnswerRevealed(true);
      setShowSynthesisDrawer(true);
    } finally {
      setIsVerifyingSynthesis(false);
    }
  };

  // Handle FSRS Rating submission — the server schedules and persists; we only
  // advance once the rating is saved, so a failed save is never silently lost.
  const handleRateCard = async (rating: FSRSRating) => {
    if (!currentCard || isSavingRating) return;

    const isBatchSynthesis =
      activeModality === 'ACT-04' &&
      gradeAllSynthesisCards &&
      synthesisCards.length > 1;
    const targetIds = isBatchSynthesis
      ? synthesisCards.map((c) => c.id)
      : [currentCard.id];

    setIsSavingRating(true);
    setRatingError(null);
    try {
      await apiFetch('/api/review', {
        method: 'POST',
        body: JSON.stringify({
          cardId: currentCard.id,
          cardIds: targetIds,
          rating,
        }),
      });
    } catch (err) {
      setRatingError(`Rating not saved: ${errorMessageOf(err, 'unknown error')}. Try again.`);
      return;
    } finally {
      setIsSavingRating(false);
    }

    notifyCardsUpdated();
    setReviewedCount((prev) => prev + targetIds.length);

    if (isBatchSynthesis) {
      const companionIdSet = new Set(synthesisCards.slice(1).map((c) => c.id));
      const laterCompanionIds = new Set(
        queue
          .slice(currentIndex + 1)
          .filter((c) => companionIdSet.has(c.id))
          .map((c) => c.id)
      );

      if (laterCompanionIds.size > 0) {
        const nextQueueLength = queue.length - laterCompanionIds.size;
        setRawQueue((prev) => prev.filter((c) => !laterCompanionIds.has(c.id)));
        if (currentIndex + 1 < nextQueueLength) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setSessionCompleted(true);
        }
        return;
      }
    }

    // Move to next card or complete session
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  // Keyboard navigation for Spacebar (reveal answer) and FSRS rating (keys 1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Spacebar to reveal answer and card details
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleRevealAnswer();
        return;
      }

      if (e.key === '1') handleRateCard(1);
      if (e.key === '2') handleRateCard(2);
      if (e.key === '3') handleRateCard(3);
      if (e.key === '4') handleRateCard(4);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRevealAnswer, currentIndex, queue, currentCard, isSavingRating]);

  // Progress percentage
  const progressPercent = queue.length > 0 ? Math.round((currentIndex / queue.length) * 100) : 100;

  if (isLoadingQueue) {
    return (
      <p className="max-w-2xl mx-auto py-16 text-center text-sm font-sans text-[#a8a29e]">
        Loading your review queue…
      </p>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 space-y-4 text-center">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800 text-left">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span className="text-sm font-sans">Could not load your review queue: {loadError}</span>
        </div>
        <button
          type="button"
          onClick={() => refreshQueue(drillAll)}
          className="px-5 py-2.5 rounded-xl bg-[#834832] hover:bg-[#693522] text-white text-xs font-sans font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  // Session Completed Screen
  if (sessionCompleted || !currentCard) {
    if (rawQueue.length > 0 && queue.length === 0) {
      return (
        <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6 animate-in fade-in duration-300">
          <div className="inline-flex p-4 rounded-full bg-[#834832]/10 text-[#834832] ring-8 ring-[#834832]/5">
            <BookOpen className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold text-[#1c1917]">
              No {selectedLanguage === 'es' ? 'Spanish' : 'English'} Cards Due
            </h1>
            <p className="text-sm font-sans text-[#78716c] max-w-md mx-auto">
              There are no {selectedLanguage === 'es' ? 'Spanish' : 'English'} cards currently due in your review queue. You have {rawQueue.length} total card{rawQueue.length === 1 ? '' : 's'} available to practice across all languages.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedLanguage('all');
                setCurrentIndex(0);
                setSessionCompleted(false);
              }}
              className="px-6 py-3 rounded-full bg-[#834832] text-white text-sm font-sans font-semibold hover:bg-[#693522] transition-colors shadow-sm"
            >
              Practice All Languages ({rawQueue.length} cards)
            </button>
            <Link
              href="/lexicon"
              className="px-6 py-3 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-sans font-semibold transition-colors"
            >
              Return to Lexicon
            </Link>
          </div>
        </div>
      );
    }

    const accuracy =
      totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;

    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-8 animate-in fade-in duration-300">
        <div className="inline-flex p-4 rounded-full bg-[#834832]/10 text-[#834832] ring-8 ring-[#834832]/5">
          <Trophy className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1c1917]">
            Review Session Concluded
          </h1>
          <p className="text-sm font-sans text-[#78716c] max-w-md mx-auto">
            Your retention stability curves have been updated using the Free Spaced Repetition Scheduler (FSRS).
          </p>
        </div>

        {/* Session Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white border border-[#e7e5e4] rounded-2xl shadow-sm text-left">
          <div className="space-y-1">
            <span className="text-[11px] font-sans uppercase font-semibold text-[#a8a29e] tracking-wider">
              Cards Reviewed
            </span>
            <p className="text-2xl font-serif font-bold text-[#1c1917]">
              {reviewedCount > 0 ? reviewedCount : queue.length}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-sans uppercase font-semibold text-[#a8a29e] tracking-wider">
              Accuracy Rate
            </span>
            <p className="text-2xl font-serif font-bold text-emerald-700">
              {accuracy}%
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-sans uppercase font-semibold text-[#a8a29e] tracking-wider">
              Drill Mode
            </span>
            <p className="text-2xl font-serif font-bold text-[#834832]">
              FSRS
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-sans uppercase font-semibold text-[#a8a29e] tracking-wider">
              Next Due
            </span>
            <p className="text-2xl font-serif font-bold text-[#57534e]">
              Tomorrow
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setDrillAll(true);
              refreshQueue(true);
              setSessionCompleted(false);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#834832] text-white text-sm font-sans font-semibold hover:bg-[#693522] transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice All Cards Again</span>
          </button>

          <Link
            href="/lexicon"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-sans font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Return to Lexicon</span>
          </Link>

          <Link
            href="/add"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-sans font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>Capture New Word</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Cloze sentence for ACT-01
  const activeClozeSentence =
    currentCard.cloze_sentences?.[
      clozeSentenceIndex % Math.max(1, currentCard.cloze_sentences.length)
    ] ||
    currentCard.cloze_sentences?.[0] ||
    `The concept of {{${currentCard.term}}} is central to this inquiry.`;
  const clozeRaw = activeClozeSentence;
  const clozeDisplay = clozeRaw.replace(/{{([^}]+)}}/g, '_______');

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Targeted Drill Banner */}
      {activeFilter && (
        <div className="bg-[#fdf8f6] border border-[#eaddd7] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs font-sans text-[#4f2416]">
            <GitBranch className="w-4 h-4 text-[#834832] shrink-0" />
            <span className="font-semibold">
              {activeFilter.root
                ? `Focused Morpheme Cluster Drill: "${activeFilter.root}" (${queue.length} ${
                    queue.length === 1 ? 'card' : 'cards'
                  })`
                : activeFilter.cardId
                ? `Focused Word Drill: "${currentCard?.term || 'Selected Card'}"`
                : `Focused Source Drill: "${activeFilter.source}" (${queue.length} ${
                    queue.length === 1 ? 'card' : 'cards'
                  })`}
            </span>
          </div>
          <button
            type="button"
            onClick={handleExitFocusedDrill}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#eaddd7] text-[#834832] text-xs font-sans font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            Exit Focused Drill
          </button>
        </div>
      )}

      {/* Top Header: Queue Manager & Progress */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold uppercase tracking-wider text-[#834832]">
              FSRS Review Queue
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#f2e8e5] text-[#834832] font-semibold text-[11px]">
              Card {queue.length > 0 ? currentIndex + 1 : 0} of {queue.length}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono text-[11px]">
              {getCardStateLabel(currentCard.srs.state)}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px] uppercase border border-stone-200">
              {(currentCard.language || 'en') === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}
            </span>
            {(currentCard.language || 'en') === 'es' && currentCard.gender && (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold text-[10px] border border-amber-300">
                {formatGenderBadge(currentCard.gender, currentCard.part_of_speech)?.article || currentCard.gender}
              </span>
            )}
          </div>

          {/* Queue Language Filter Pill */}
          <div className="inline-flex items-center rounded-lg border border-stone-200 p-0.5 bg-stone-100/70 text-xs font-sans self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedLanguage('all');
                setCurrentIndex(0);
              }}
              className={cn(
                'px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1',
                selectedLanguage === 'all'
                  ? 'bg-white text-[#834832] shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              )}
            >
              <span>All</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-stone-200/80 text-stone-700">
                {languageCounts.totalDue}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedLanguage('en');
                setCurrentIndex(0);
              }}
              className={cn(
                'px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1',
                selectedLanguage === 'en'
                  ? 'bg-white text-[#834832] shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              )}
            >
              <span>🇬🇧 English</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-stone-200/80 text-stone-700">
                {languageCounts.enDue}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedLanguage('es');
                setCurrentIndex(0);
              }}
              className={cn(
                'px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1',
                selectedLanguage === 'es'
                  ? 'bg-white text-[#834832] shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              )}
            >
              <span>🇪🇸 Español</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-stone-200/80 text-stone-700">
                {languageCounts.esDue}
              </span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#834832] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Modality Mode Selector Tabs */}
      <div className="flex items-center justify-between border-b border-[#e7e5e4] pb-2 overflow-x-auto gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveModality('ACT-01')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all whitespace-nowrap',
              activeModality === 'ACT-01'
                ? 'bg-[#834832] text-white shadow-sm'
                : 'text-[#57534e] hover:bg-stone-200/60'
            )}
          >
            ACT-01: Contextual Cloze
          </button>

          <button
            type="button"
            onClick={() => setActiveModality('ACT-02')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all whitespace-nowrap',
              activeModality === 'ACT-02'
                ? 'bg-[#834832] text-white shadow-sm'
                : 'text-[#57534e] hover:bg-stone-200/60'
            )}
          >
            ACT-02: Distinction Matrix
          </button>

          <button
            type="button"
            onClick={() => setActiveModality('ACT-03')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all whitespace-nowrap',
              activeModality === 'ACT-03'
                ? 'bg-[#834832] text-white shadow-sm'
                : 'text-[#57534e] hover:bg-stone-200/60'
            )}
          >
            ACT-03: Production Sandbox
          </button>

          <button
            type="button"
            onClick={() => setActiveModality('ACT-04')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all whitespace-nowrap',
              activeModality === 'ACT-04'
                ? 'bg-[#834832] text-white shadow-sm'
                : 'text-[#57534e] hover:bg-stone-200/60'
            )}
          >
            ACT-04: Synthesis Weave
          </button>
        </div>

        {/* FSRS Stats Chip */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0 text-[11px] font-mono text-[#a8a29e]">
          <span>S: {currentCard.srs.stability.toFixed(1)}d</span>
          <span>•</span>
          <span>D: {currentCard.srs.difficulty.toFixed(1)}</span>
        </div>
      </div>

      {/* Main Drill Card Surface */}
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* --- MODALITY 1: CONTEXTUAL CLOZE FILL (ACT-01) --- */}
        {activeModality === 'ACT-01' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#a8a29e]">
                  Fill the Missing Word
                </span>
                {(currentCard.cloze_sentences?.length ?? 0) > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setClozeSentenceIndex(
                        (prev) => (prev + 1) % currentCard.cloze_sentences.length
                      )
                    }
                    className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-[#f2e8e5] border border-stone-200 hover:border-[#834832]/40 text-[11px] font-sans font-semibold text-[#834832] transition-colors cursor-pointer"
                  >
                    Context{' '}
                    {(clozeSentenceIndex % currentCard.cloze_sentences.length) + 1} of{' '}
                    {currentCard.cloze_sentences.length} • Cycle ↻
                  </button>
                )}
              </div>
              <p className="text-xl sm:text-2xl font-serif text-[#1c1917] leading-relaxed">
                {clozeRaw.split(/({{[^}]+}})/g).map((part, idx) => {
                  if (part.startsWith('{{') && part.endsWith('}}')) {
                    const hiddenWord = extractClozeToken(part);
                    return (
                      <span
                        key={idx}
                        className={cn(
                          'inline-block px-3 py-0.5 mx-1.5 rounded-lg border-b-2 font-mono text-base font-bold transition-all',
                          clozeChecked || isAnswerRevealed
                            ? clozeIsCorrect
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-500'
                              : 'bg-rose-100 text-rose-900 border-rose-500'
                            : 'bg-stone-100 border-[#834832] text-[#834832]'
                        )}
                      >
                        {clozeChecked || isAnswerRevealed ? hiddenWord : '_______'}
                      </span>
                    );
                  }
                  return <span key={idx}>{part}</span>;
                })}
              </p>
            </div>

            {/* Inline Check Form */}
            {!clozeChecked && !isAnswerRevealed ? (
              <form onSubmit={handleCheckCloze} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={clozeInput}
                    onChange={(e) => setClozeInput(e.target.value)}
                    placeholder={
                      (currentCard.language || 'en') === 'es'
                        ? 'Escribe la palabra objetivo...'
                        : 'Type the target word...'
                    }
                    className="flex-1 text-base font-serif px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#834832]"
                  />
                  <button
                    type="submit"
                    disabled={!clozeInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#834832] text-white text-xs font-sans font-semibold hover:bg-[#693522] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {(currentCard.language || 'en') === 'es' ? 'Comprobar' : 'Check'}
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs font-sans text-[#78716c]">
                  <span>
                    Hint: {currentCard.part_of_speech}
                    {(currentCard.language || 'en') === 'es' && currentCard.gender
                      ? ` (${formatGenderBadge(currentCard.gender, currentCard.part_of_speech)?.label || currentCard.gender})`
                      : ''}{' '}
                    • {currentCard.etymology.roots[0]?.origin || 'Lexical'} root
                  </span>
                  <button
                    type="button"
                    onClick={handleRevealAnswer}
                    className="underline text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    {(currentCard.language || 'en') === 'es' ? 'Mostrar respuesta' : 'Show Answer'}
                  </button>
                </div>
              </form>
            ) : (
              /* Revealed Feedback */
              <div
                className={cn(
                  'p-4 rounded-xl space-y-2 border animate-in fade-in',
                  clozeIsCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                )}
              >
                <div className="flex items-center gap-2 font-sans font-semibold text-sm">
                  {clozeIsCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>
                        Correct Recall!
                        {omittedAccents && (
                          <span className="font-normal text-emerald-800 ml-1.5">
                            (Accented form:{' '}
                            <strong className="font-serif capitalize">{currentCard.term}</strong>)
                          </span>
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-amber-600" />
                      <span>
                        Target Word:{' '}
                        <strong className="font-serif capitalize">{currentCard.term}</strong>
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm font-serif">
                  {currentCard.primary_definition}
                </p>
                {(currentCard.language || 'en') === 'es' && currentCard.english_gloss && (
                  <p className="text-xs font-serif italic text-emerald-950 pt-1.5 border-t border-emerald-200/60">
                    English Anchor: “{currentCard.english_gloss}”
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- MODALITY 2: REGISTER & DISTINCTION MATRIX (ACT-02) --- */}
        {activeModality === 'ACT-02' && distinctionData && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#a8a29e]">
                  {currentCard.language === 'es' ? 'Diferenciación de Registro y Matiz' : 'Tone & Register Differentiation'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                  {currentCard.language === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                </span>
              </div>
              <p className="text-base sm:text-lg font-serif text-[#1c1917]">
                {currentCard.language === 'es' ? (
                  <>
                    ¿Cuál de las siguientes palabras es más apropiada para el registro:{' '}
                    <strong className="text-[#834832] underline decoration-stone-300">
                      {distinctionData.promptTone}
                    </strong>
                    ?
                  </>
                ) : (
                  <>
                    Which of the following words is most appropriate for:{' '}
                    <strong className="text-[#834832] underline decoration-stone-300">
                      {distinctionData.promptTone}
                    </strong>
                    ?
                  </>
                )}
              </p>
            </div>

            {/* 3 Interactive Synonym Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {distinctionData.options.map((option, idx) => {
                const isSelected = selectedSynonym === option;
                const isCorrectWord = gradeDistinctionChoice(option, distinctionData.correctWord);

                let cardStyle =
                  'border-stone-200 bg-stone-50/60 hover:bg-stone-100 hover:border-stone-300 text-stone-900';

                if (selectedSynonym || isAnswerRevealed) {
                  if (isCorrectWord) {
                    cardStyle =
                      'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20';
                  } else if (isSelected) {
                    cardStyle =
                      'border-rose-400 bg-rose-50 text-rose-900';
                  } else {
                    cardStyle = 'border-stone-200 opacity-60 bg-stone-50 text-stone-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!!selectedSynonym || isAnswerRevealed}
                    onClick={() => handleSelectSynonym(option)}
                    className={cn(
                      'p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer disabled:cursor-default',
                      cardStyle
                    )}
                  >
                    <span className="font-serif font-bold text-lg capitalize">
                      {option}
                    </span>
                    <span className="text-[11px] font-sans text-[#78716c]">
                      {currentCard.language === 'es' ? `Opción ${idx + 1}` : `Option ${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback and Nuance Comparison */}
            {(distinctionFeedback || isAnswerRevealed) && (
              <div className="p-4 rounded-xl bg-[#fdf8f6] border border-[#eaddd7] space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-sans font-semibold text-xs text-[#834832]">
                  <Sparkles className="w-4 h-4" />
                  <span>Nuance Analysis</span>
                </div>
                <p className="text-sm font-serif text-[#4f2416] leading-relaxed">
                  {distinctionFeedback ? distinctionFeedback.explanation : distinctionData.comparison}
                </p>
                {distinctionFeedback && (
                  <p className="text-xs font-serif text-stone-600 pt-1 border-t border-[#eaddd7]/70">
                    {distinctionData.comparison}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- MODALITY 3: ACTIVE PRODUCTION SANDBOX (ACT-03) --- */}
        {activeModality === 'ACT-03' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#a8a29e]">
                  {currentCard.language === 'es' ? 'Taller de Producción Activa' : 'Active Production Sandbox'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                  {currentCard.language === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                </span>
              </div>
              <p className="text-sm font-sans text-[#57534e]">
                {currentCard.language === 'es' ? (
                  <>
                    Escribe una frase original en español desplegando{' '}
                    <strong className="font-serif text-base text-[#1c1917] capitalize">
                      "{currentCard.term}"
                    </strong>{' '}
                    con precisión formal o literaria.
                  </>
                ) : (
                  <>
                    Compose an original sentence deploying{' '}
                    <strong className="font-serif text-base text-[#1c1917] capitalize">
                      "{currentCard.term}"
                    </strong>{' '}
                    accurately in formal or literary prose.
                  </>
                )}
              </p>
            </div>

            {/* Sandbox Textarea */}
            <div className="space-y-2">
              <textarea
                rows={3}
                value={productionSentence}
                onChange={(e) => setProductionSentence(e.target.value)}
                placeholder={
                  currentCard.language === 'es'
                    ? `Escribe una frase en español usando "${currentCard.term}"...`
                    : `e.g. Write a rich clause using "${currentCard.term}"...`
                }
                className="w-full text-base font-serif p-3.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#834832]"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-stone-500">
                  {productionSentence.trim()
                    ? `${productionSentence.trim().split(/\s+/).length} ${currentCard.language === 'es' ? 'palabras' : 'words'}`
                    : `0 ${currentCard.language === 'es' ? 'palabras' : 'words'}`}
                </span>
                <button
                  type="button"
                  disabled={isVerifyingProduction || !productionSentence.trim()}
                  onClick={handleVerifyProduction}
                  className="px-4 py-2 rounded-xl bg-[#834832] text-white text-xs font-sans font-semibold hover:bg-[#693522] transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isVerifyingProduction ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{currentCard.language === 'es' ? 'Analizando sintaxis...' : 'Inspecting Syntax...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{currentCard.language === 'es' ? 'Verificar uso' : 'Verify Usage'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* LLM Real-Time Critique */}
            {productionResult && (
              <div
                className={cn(
                  'p-4 rounded-xl border space-y-2 animate-in fade-in',
                  productionResult.evaluationStatus === 'pass'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : productionResult.evaluationStatus === 'awkward'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider',
                        productionResult.evaluationStatus === 'pass'
                          ? 'bg-emerald-200 text-emerald-900'
                          : productionResult.evaluationStatus === 'awkward'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-rose-200 text-rose-900'
                      )}
                    >
                      {productionResult.evaluationStatus === 'pass'
                        ? 'Pass'
                        : productionResult.evaluationStatus === 'awkward'
                        ? 'Awkward'
                        : 'Incorrect'}
                    </span>
                    <span className="text-xs font-sans text-stone-600">
                      Detected: {productionResult.registerDetected}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-serif leading-relaxed">
                  {productionResult.feedback}
                </p>

                {productionResult.revisedSentence && (
                  <p className="text-xs font-serif italic text-stone-600 pt-1 border-t border-stone-200/60">
                    Suggested Revision: "{productionResult.revisedSentence}"
                  </p>
                )}
              </div>
            )}

            {/* Collapsible Definition & Hints Drawer (ACT-03) */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <button
                type="button"
                onClick={() => setShowSandboxHints((prev) => !prev)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-sans font-semibold text-[#834832] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#834832]" />
                  <span>Definition & Hints Drawer</span>
                  <span className="text-[11px] font-mono font-normal text-stone-500">
                    ({showSandboxHints || isAnswerRevealed ? 'Visible' : 'Collapsed — recall meaning on your own'})
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-stone-500 transition-transform duration-200',
                    (showSandboxHints || isAnswerRevealed) && 'rotate-180'
                  )}
                />
              </button>

              {!(showSandboxHints || isAnswerRevealed) && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-stone-50/50 rounded-xl border border-dashed border-stone-300">
                  <span className="text-xs font-sans text-stone-500">
                    Draft your sentence before referencing the definition or roots.
                  </span>
                  <button
                    type="button"
                    onClick={handleRevealAnswer}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-[#834832] text-xs font-sans font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal Hints</span>
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono text-stone-500">
                      Space
                    </kbd>
                  </button>
                </div>
              )}

              {(showSandboxHints || isAnswerRevealed) && (
                <div className="pt-2 animate-in fade-in duration-300">
                  <CardFullDetails card={currentCard} onPlayPronunciation={playPronunciation} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- MODALITY 4: MULTI-WORD SYNTHESIS WEAVE STUDIO (ACT-04) --- */}
        {activeModality === 'ACT-04' && (
          <div className="space-y-6">
            {/* Header & Weave Count Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#834832] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {currentCard.language === 'es'
                        ? 'Estudio de Síntesis Léxica (ACT-04)'
                        : 'Multi-Word Synthesis Studio (ACT-04)'}
                    </span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                    {currentCard.language === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                  </span>
                </div>
                <p className="text-sm font-sans text-[#57534e]">
                  {currentCard.language === 'es'
                    ? 'Entrelaza todas las palabras objetivo en un único pasaje coherente con precisión estilística y semántica.'
                    : 'Weave all target headwords into a single cohesive sentence or short passage with scholarly precision.'}
                </p>
              </div>

              {/* 2 Words vs 3 Words Toggle */}
              <div className="inline-flex items-center rounded-xl border border-stone-200 p-0.5 bg-stone-100/80 text-xs font-sans self-start shrink-0">
                <button
                  type="button"
                  onClick={() => setSynthesisCount(2)}
                  className={cn(
                    'px-3 py-1 rounded-lg font-medium transition-all cursor-pointer',
                    synthesisCount === 2
                      ? 'bg-white text-[#834832] font-semibold shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  )}
                >
                  2 Words
                </button>
                <button
                  type="button"
                  onClick={() => setSynthesisCount(3)}
                  className={cn(
                    'px-3 py-1 rounded-lg font-medium transition-all cursor-pointer',
                    synthesisCount === 3
                      ? 'bg-white text-[#834832] font-semibold shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  )}
                >
                  3 Words
                </button>
              </div>
            </div>

            {/* Interactive Target Word Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {synthesisCards.map((card, idx) => {
                const isDetected = Boolean(synthesisWordDetection[card.id]);
                const isPrimary = idx === 0;
                const isCardEs = (card.language || 'en') === 'es';
                const cardGenderBadge = isCardEs
                  ? formatGenderBadge(card.gender, card.part_of_speech)
                  : null;

                return (
                  <div
                    key={card.id}
                    className={cn(
                      'p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2',
                      isDetected
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-500/20'
                        : isPrimary
                        ? 'bg-[#fdf8f6] border-[#eaddd7]'
                        : 'bg-stone-50/70 border-stone-200'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-serif font-bold text-lg text-[#1c1917] capitalize">
                          {card.term}
                        </span>
                        <button
                          type="button"
                          onClick={() => playPronunciation(card.term, card.language)}
                          title="Listen to pronunciation"
                          aria-label={`Listen to ${card.term}`}
                          className="p-1 rounded-full text-stone-400 hover:text-[#834832] transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        {cardGenderBadge && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-bold bg-amber-50 text-amber-900 border border-amber-300">
                            {cardGenderBadge.article}
                          </span>
                        )}
                      </div>

                      {/* Live Status Indicator */}
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider shrink-0 transition-colors',
                          isDetected
                            ? 'bg-emerald-200/80 text-emerald-900'
                            : 'bg-stone-200/70 text-stone-600'
                        )}
                      >
                        {isDetected ? '✓ Woven' : '○ Pending'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-sans text-stone-500">
                      <span className="font-medium text-[#834832]">
                        {card.part_of_speech}
                      </span>
                      <span className="font-mono text-[10px]">
                        {isPrimary ? 'Primary Anchor' : `Companion #${idx}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Synthesis Passage Textarea */}
            <div className="space-y-2">
              <textarea
                rows={4}
                value={synthesisPassage}
                onChange={(e) => setSynthesisPassage(e.target.value)}
                placeholder={
                  currentCard.language === 'es'
                    ? `Escribe un pasaje que integre ${synthesisCards
                        .map((c) => `"${c.term}"`)
                        .join(' y ')}...`
                    : `Compose a cohesive passage weaving together ${synthesisCards
                        .map((c) => `"${c.term}"`)
                        .join(', ')}...`
                }
                className="w-full text-base font-serif p-4 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#834832]"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-xs font-sans text-stone-500">
                  <span>
                    {synthesisPassage.trim()
                      ? `${synthesisPassage.trim().split(/\s+/).length} ${
                          currentCard.language === 'es' ? 'palabras' : 'words'
                        }`
                      : `0 ${currentCard.language === 'es' ? 'palabras' : 'words'}`}
                  </span>
                  <span>•</span>
                  <span className="font-medium text-[#834832]">
                    {
                      synthesisCards.filter((c) => synthesisWordDetection[c.id])
                        .length
                    }{' '}
                    of {synthesisCards.length} target words woven
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isVerifyingSynthesis || !synthesisPassage.trim()}
                  onClick={handleVerifySynthesis}
                  className="px-4 py-2 rounded-xl bg-[#834832] text-white text-xs font-sans font-semibold hover:bg-[#693522] transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isVerifyingSynthesis ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>
                        {currentCard.language === 'es'
                          ? 'Evaluando síntesis...'
                          : 'Evaluating Weave...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Verify Synthesis Weave</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Synthesis Verification Result */}
            {synthesisResult && (
              <div
                className={cn(
                  'p-4 rounded-xl border space-y-3 animate-in fade-in',
                  synthesisResult.evaluationStatus === 'pass'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : synthesisResult.evaluationStatus === 'awkward'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider',
                        synthesisResult.evaluationStatus === 'pass'
                          ? 'bg-emerald-200 text-emerald-900'
                          : synthesisResult.evaluationStatus === 'awkward'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-rose-200 text-rose-900'
                      )}
                    >
                      {synthesisResult.evaluationStatus === 'pass'
                        ? 'Pass'
                        : synthesisResult.evaluationStatus === 'awkward'
                        ? 'Awkward'
                        : 'Incorrect'}
                    </span>
                    <span className="text-xs font-sans text-stone-600">
                      Detected: {synthesisResult.registerDetected}
                    </span>
                  </div>
                </div>

                {/* Detected vs Missing Terms Breakdown */}
                {(synthesisResult.termsDetected?.length ||
                  synthesisResult.missingTerms?.length) ? (
                  <div className="flex flex-wrap items-center gap-2 text-xs font-sans pt-0.5">
                    {synthesisResult.termsDetected?.map((t) => (
                      <span
                        key={`det-${t}`}
                        className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 font-medium"
                      >
                        ✓ {t}
                      </span>
                    ))}
                    {synthesisResult.missingTerms?.map((t) => (
                      <span
                        key={`mis-${t}`}
                        className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 border border-rose-300 font-medium"
                      >
                        ✗ Missing: {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                <p className="text-sm font-serif leading-relaxed">
                  {synthesisResult.feedback}
                </p>

                {synthesisResult.revisedSentence && (
                  <p className="text-xs font-serif italic text-stone-600 pt-1.5 border-t border-stone-200/60">
                    Suggested Synthesis: &ldquo;{synthesisResult.revisedSentence}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* Collapsible Synthesis Lexical Reference Drawer */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <button
                type="button"
                onClick={() => setShowSynthesisDrawer((prev) => !prev)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-sans font-semibold text-[#834832] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#834832]" />
                  <span>Synthesis Lexical Reference Drawer</span>
                  <span className="text-[11px] font-mono font-normal text-stone-500">
                    ({showSynthesisDrawer || isAnswerRevealed
                      ? `Showing all ${synthesisCards.length} target definitions`
                      : 'Collapsed — recall definitions before peeking'})
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-stone-500 transition-transform duration-200',
                    (showSynthesisDrawer || isAnswerRevealed) && 'rotate-180'
                  )}
                />
              </button>

              {(showSynthesisDrawer || isAnswerRevealed) && (
                <div className="grid grid-cols-1 gap-4 pt-2 animate-in fade-in duration-300">
                  {synthesisCards.map((card) => (
                    <div
                      key={`ref-${card.id}`}
                      className="p-4 rounded-xl bg-stone-50/70 border border-stone-200 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-lg text-[#1c1917] capitalize">
                            {card.term}
                          </h4>
                          <span className="text-xs font-sans text-[#834832] font-medium">
                            ({card.part_of_speech})
                          </span>
                        </div>
                        {card.english_gloss && (
                          <span className="text-xs font-serif italic text-[#0369a1]">
                            “{card.english_gloss}”
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-serif text-[#292524] leading-relaxed">
                        {card.primary_definition}
                      </p>
                      {card.nuance_note && (
                        <p className="text-xs font-serif italic text-[#4f2416]">
                          Nuance: {card.nuance_note}
                        </p>
                      )}
                      {card.collocations?.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {card.collocations.map((col, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full bg-white border border-stone-200 text-[11px] font-serif italic text-stone-700"
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Card Details Section for ACT-01 and ACT-02 (Masked until revealed) --- */}
        {activeModality !== 'ACT-03' && activeModality !== 'ACT-04' && (
          <>
            {!isAnswerRevealed ? (
              <div className="pt-4 border-t border-stone-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-stone-50/80 rounded-xl border border-dashed border-stone-300">
                  <div className="flex items-center gap-2 text-stone-600 text-xs font-sans">
                    <EyeOff className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>Card details are masked to test your active recall.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRevealAnswer}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#834832] text-white hover:bg-[#693522] text-xs font-sans font-semibold transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>Reveal Answer & Card Details</span>
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-black/20 rounded text-[10px] font-mono text-white/90">
                      Space
                    </kbd>
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-stone-200 animate-in fade-in duration-300">
                <CardFullDetails card={currentCard} onPlayPronunciation={playPronunciation} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Ergonomic 4-Button FSRS Rating Bar (SRS-01, SRS-02) */}
      <div
        className={cn(
          'backdrop-blur-md border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 transition-all duration-300',
          isAnswerRevealed
            ? 'bg-white border-[#834832]/30 ring-1 ring-[#834832]/10'
            : 'bg-white/95 border-[#e7e5e4]'
        )}
      >
        <div className="flex items-center justify-between text-xs font-sans text-[#78716c]">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-[#57534e]">
              Grade Recall (FSRS DSR Model)
            </span>
            {isAnswerRevealed ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-sans font-semibold animate-in fade-in">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Recall Revealed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200 text-[10px] font-sans font-medium">
                <EyeOff className="w-3 h-3 text-stone-400" />
                Answer Masked
              </span>
            )}
          </div>
          <span className="hidden sm:inline font-mono text-[11px] text-[#a8a29e]">
            Keyboard Shortcuts: [ 1 ] [ 2 ] [ 3 ] [ 4 ]
          </span>
        </div>

        {ratingError && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2.5 text-rose-900 text-xs font-sans">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{ratingError}</span>
          </div>
        )}

        {activeModality === 'ACT-04' && synthesisCards.length > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#fdf8f6] border border-[#eaddd7] text-xs font-sans">
            <button
              type="button"
              onClick={() => setGradeAllSynthesisCards((prev) => !prev)}
              className="flex items-center gap-2 text-left text-[#4f2416] font-medium cursor-pointer"
            >
              <span
                className={cn(
                  'w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0',
                  gradeAllSynthesisCards
                    ? 'bg-[#834832] border-[#834832] text-white'
                    : 'bg-white border-stone-300 text-transparent'
                )}
              >
                ✓
              </span>
              <span>
                {gradeAllSynthesisCards
                  ? `Batch FSRS Grade: Apply rating to all ${
                      synthesisCards.length
                    } woven words (${synthesisCards.map((c) => c.term).join(', ')})`
                  : `Single Card Grade: Only rate ${currentCard.term}`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setGradeAllSynthesisCards((prev) => !prev)}
              className="self-start sm:self-auto px-2.5 py-1 rounded-lg bg-white hover:bg-stone-50 border border-[#eaddd7] text-[#834832] font-semibold text-[11px] transition-colors shrink-0 cursor-pointer"
            >
              {gradeAllSynthesisCards ? 'Switch to Single Card' : 'Switch to Batch Grade'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {schedulePreviews.map((preview) => {
            let buttonStyle = 'border-stone-200 hover:border-stone-400 bg-stone-50';
            let labelColor = 'text-stone-900';
            let badgeBg = 'bg-stone-200 text-stone-800';

            if (preview.rating === 1) {
              buttonStyle =
                'border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 hover:border-rose-300';
              labelColor = 'text-rose-900';
              badgeBg = 'bg-rose-200 text-rose-900';
            } else if (preview.rating === 2) {
              buttonStyle =
                'border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 hover:border-amber-300';
              labelColor = 'text-amber-900';
              badgeBg = 'bg-amber-200 text-amber-900';
            } else if (preview.rating === 3) {
              buttonStyle =
                'border-stone-300 bg-[#fdf8f6] hover:bg-[#f2e8e5] hover:border-[#834832]';
              labelColor = 'text-[#834832]';
              badgeBg = 'bg-[#eaddd7] text-[#4f2416]';
            } else if (preview.rating === 4) {
              buttonStyle =
                'border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 hover:border-blue-300';
              labelColor = 'text-blue-900';
              badgeBg = 'bg-blue-200 text-blue-900';
            }

            return (
              <button
                key={preview.rating}
                type="button"
                onClick={() => handleRateCard(preview.rating)}
                disabled={isSavingRating}
                className={cn(
                  'p-3 sm:p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1 shadow-sm active:scale-98',
                  buttonStyle
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-[#a8a29e]">
                    {preview.rating}.
                  </span>
                  <span className={cn('font-sans font-bold text-sm', labelColor)}>
                    {preview.label}
                  </span>
                </div>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-mono font-medium',
                    badgeBg
                  )}
                >
                  +{preview.intervalDisplay}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
