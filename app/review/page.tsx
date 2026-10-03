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
  RotateCcw,
} from 'lucide-react';
import {
  CardWithSrs,
  FSRSRating,
  EvaluationStatus,
  ProductionValidationResult,
  DistinctionMatrixItem,
} from '@/types/lexis';
import {
  getClientCards,
  getDueCards,
  updateClientCardSrs,
} from '@/lib/sample-data';
import {
  scheduleCardWithRating,
  getSchedulePreviews,
  getCardStateLabel,
} from '@/lib/fsrs';
import { validateProductionSentence } from '@/lib/production-validator';
import { cn } from '@/lib/utils';

type ModalityMode = 'ACT-01' | 'ACT-02' | 'ACT-03';

export default function ReviewPage() {
  const [cards, setCards] = useState<CardWithSrs[]>([]);
  const [queue, setQueue] = useState<CardWithSrs[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drillAll, setDrillAll] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Session Statistics
  const [reviewedCount, setReviewedCount] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Active Modality Mode
  const [activeModality, setActiveModality] = useState<ModalityMode>('ACT-01');

  // Modality 1: Cloze state
  const [clozeInput, setClozeInput] = useState('');
  const [clozeChecked, setClozeChecked] = useState(false);
  const [clozeIsCorrect, setClozeIsCorrect] = useState<boolean | null>(null);

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

  // Load cards from local storage / API
  const refreshQueue = useCallback((includeAll: boolean = false) => {
    const all = getClientCards();
    setCards(all);
    const due = includeAll ? all : getDueCards(all);
    setQueue(due);
    setCurrentIndex(0);
    setSessionCompleted(due.length === 0);
  }, []);

  useEffect(() => {
    refreshQueue(drillAll);
  }, [drillAll, refreshQueue]);

  // Current Card
  const currentCard: CardWithSrs | undefined = queue[currentIndex];

  // Previews for FSRS 4 ratings
  const schedulePreviews = useMemo(() => {
    if (!currentCard) return [];
    return getSchedulePreviews(currentCard.srs);
  }, [currentCard]);

  // Reset modality inputs whenever the active card changes
  useEffect(() => {
    setClozeInput('');
    setClozeChecked(false);
    setClozeIsCorrect(null);
    setSelectedSynonym(null);
    setDistinctionFeedback(null);
    setProductionSentence('');
    setProductionResult(null);
  }, [currentIndex, currentCard?.id]);

  // Handle checking cloze answer
  const handleCheckCloze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentCard || clozeChecked) return;

    const trimmedInput = clozeInput.trim().toLowerCase();
    const target = currentCard.term.toLowerCase();

    // Check if input matches target or target lemma
    const isMatch = trimmedInput === target || target.startsWith(trimmedInput) && trimmedInput.length >= 4;
    setClozeIsCorrect(isMatch);
    setClozeChecked(true);

    setTotalAttempts((prev) => prev + 1);
    if (isMatch) setCorrectAttempts((prev) => prev + 1);
  };

  // Distinction matrix dynamic question and options
  const distinctionData = useMemo(() => {
    if (!currentCard) return null;

    if (currentCard.distinction_matrix) {
      const matrix = currentCard.distinction_matrix;
      const targetRecommendation =
        matrix.contextRecommendations.find(
          (r) => r.word.toLowerCase() === currentCard.term.toLowerCase()
        ) || matrix.contextRecommendations[0];

      return {
        promptTone: targetRecommendation
          ? targetRecommendation.recommendedRegister
          : 'High Literary & Scholarly Register',
        options: matrix.synonyms,
        correctWord: currentCard.term,
        comparison: matrix.nuanceComparison,
        recommendations: matrix.contextRecommendations,
      };
    }

    // Fallback distinction trio if not explicitly pre-configured
    return {
      promptTone: 'High Literary & Scholarly Register',
      options: [currentCard.term, 'general synonym', 'colloquial parallel'],
      correctWord: currentCard.term,
      comparison: `"${currentCard.term}" provides refined connotative precision suitable for literary and academic prose.`,
      recommendations: [
        {
          word: currentCard.term,
          recommendedRegister: 'Literary & Scholarly Register',
          exampleSentence: `The scholar noted the ${currentCard.term} nature of the passage.`,
        },
      ],
    };
  }, [currentCard]);

  // Handle distinction selection
  const handleSelectSynonym = (chosenWord: string) => {
    if (!distinctionData || selectedSynonym) return;
    setSelectedSynonym(chosenWord);

    const isCorrect =
      chosenWord.toLowerCase() === distinctionData.correctWord.toLowerCase();
    setDistinctionFeedback({
      correct: isCorrect,
      explanation: isCorrect
        ? `Correct! "${chosenWord}" matches the specified register (${distinctionData.promptTone}).`
        : `Not quite. "${chosenWord}" carries a different tone; "${distinctionData.correctWord}" is calibrated for ${distinctionData.promptTone}.`,
    });

    setTotalAttempts((prev) => prev + 1);
    if (isCorrect) setCorrectAttempts((prev) => prev + 1);
  };

  // Handle production sentence verification
  const handleVerifyProduction = async () => {
    if (!currentCard || !productionSentence.trim()) return;

    setIsVerifyingProduction(true);
    setProductionResult(null);

    try {
      const result = await validateProductionSentence(
        currentCard.term,
        productionSentence
      );
      setProductionResult(result);
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
    } finally {
      setIsVerifyingProduction(false);
    }
  };

  // Handle FSRS Rating submission
  const handleRateCard = async (rating: FSRSRating) => {
    if (!currentCard) return;

    const { updatedSrs } = scheduleCardWithRating(currentCard.srs, rating);

    // Save locally
    updateClientCardSrs(currentCard.id, updatedSrs);
    window.dispatchEvent(new Event('lexis-cards-updated'));

    // Attempt to persist to /api/review in background
    try {
      fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.id,
          rating,
          updatedSrs,
        }),
      }).catch(() => {});
    } catch {
      // offline / mock safe
    }

    setReviewedCount((prev) => prev + 1);

    // Move to next card or complete session
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  // Keyboard navigation for FSRS rating (keys 1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === '1') handleRateCard(1);
      if (e.key === '2') handleRateCard(2);
      if (e.key === '3') handleRateCard(3);
      if (e.key === '4') handleRateCard(4);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, queue, currentCard]);

  // Progress percentage
  const progressPercent = queue.length > 0 ? Math.round((currentIndex / queue.length) * 100) : 100;

  // Session Completed Screen
  if (sessionCompleted || !currentCard) {
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
  const clozeRaw =
    currentCard.cloze_sentences?.[0] ||
    `The author deployed the concept of {{${currentCard.term}}} to illuminate the discourse.`;
  const clozeDisplay = clozeRaw.replace(/{{([^}]+)}}/g, '_______');

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header: Queue Manager & Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-[#834832]">
              FSRS Review Queue
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#f2e8e5] text-[#834832] font-semibold text-[11px]">
              Card {currentIndex + 1} of {queue.length}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono text-[11px]">
              {getCardStateLabel(currentCard.srs.state)}
            </span>
          </div>

          <div className="text-[#78716c] font-mono text-[11px]">
            {queue.length - currentIndex} remaining
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
      <div className="flex items-center justify-between border-b border-[#e7e5e4] pb-2 overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveModality('ACT-01')}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all whitespace-nowrap',
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
              'px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all whitespace-nowrap',
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
              'px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all whitespace-nowrap',
              activeModality === 'ACT-03'
                ? 'bg-[#834832] text-white shadow-sm'
                : 'text-[#57534e] hover:bg-stone-200/60'
            )}
          >
            ACT-03: Production Sandbox
          </button>
        </div>

        {/* FSRS Stats Chip */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-[#a8a29e]">
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
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#a8a29e]">
                Fill the Missing Word
              </span>
              <p className="text-xl sm:text-2xl font-serif text-[#1c1917] leading-relaxed">
                {clozeRaw.split(/({{[^}]+}})/g).map((part, idx) => {
                  if (part.startsWith('{{') && part.endsWith('}}')) {
                    return (
                      <span
                        key={idx}
                        className={cn(
                          'inline-block px-3 py-0.5 mx-1.5 rounded-lg border-b-2 font-mono text-base font-bold transition-all',
                          clozeChecked
                            ? clozeIsCorrect
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-500'
                              : 'bg-rose-100 text-rose-900 border-rose-500'
                            : 'bg-stone-100 border-[#834832] text-[#834832]'
                        )}
                      >
                        {clozeChecked ? part.slice(2, -2) : '_______'}
                      </span>
                    );
                  }
                  return <span key={idx}>{part}</span>;
                })}
              </p>
            </div>

            {/* Inline Check Form */}
            {!clozeChecked ? (
              <form onSubmit={handleCheckCloze} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={clozeInput}
                    onChange={(e) => setClozeInput(e.target.value)}
                    placeholder="Type the target word..."
                    className="flex-1 text-base font-serif px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#834832]"
                  />
                  <button
                    type="submit"
                    disabled={!clozeInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#834832] text-white text-xs font-sans font-semibold hover:bg-[#693522] transition-colors disabled:opacity-50"
                  >
                    Check
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs font-sans text-[#78716c]">
                  <span>Hint: {currentCard.part_of_speech} • {currentCard.etymology.roots[0]?.origin} root</span>
                  <button
                    type="button"
                    onClick={() => {
                      setClozeChecked(true);
                      setClozeIsCorrect(false);
                    }}
                    className="underline text-stone-500 hover:text-stone-800"
                  >
                    Show Answer
                  </button>
                </div>
              </form>
            ) : (
              /* Revealed Feedback */
              <div
                className={cn(
                  'p-4 rounded-xl space-y-2 border',
                  clozeIsCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                )}
              >
                <div className="flex items-center gap-2 font-sans font-semibold text-sm">
                  {clozeIsCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Correct Recall!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-amber-600" />
                      <span>Target Word: <strong className="font-serif capitalize">{currentCard.term}</strong></span>
                    </>
                  )}
                </div>
                <p className="text-sm font-serif">
                  {currentCard.primary_definition}
                </p>
              </div>
            )}
          </div>
        )}

        {/* --- MODALITY 2: REGISTER & DISTINCTION MATRIX (ACT-02) --- */}
        {activeModality === 'ACT-02' && distinctionData && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#a8a29e]">
                Tone & Register Differentiation
              </span>
              <p className="text-base sm:text-lg font-serif text-[#1c1917]">
                Which of the following words is most appropriate for:{' '}
                <strong className="text-[#834832] underline decoration-stone-300">
                  {distinctionData.promptTone}
                </strong>
                ?
              </p>
            </div>

            {/* 3 Interactive Synonym Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {distinctionData.options.map((option, idx) => {
                const isSelected = selectedSynonym === option;
                const isCorrectWord =
                  option.toLowerCase() === distinctionData.correctWord.toLowerCase();

                let cardStyle =
                  'border-stone-200 bg-stone-50/60 hover:bg-stone-100 hover:border-stone-300 text-stone-900';

                if (selectedSynonym) {
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
                    disabled={!!selectedSynonym}
                    onClick={() => handleSelectSynonym(option)}
                    className={cn(
                      'p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1',
                      cardStyle
                    )}
                  >
                    <span className="font-serif font-bold text-lg capitalize">
                      {option}
                    </span>
                    <span className="text-[11px] font-sans text-[#78716c]">
                      Option {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback and Nuance Comparison */}
            {distinctionFeedback && (
              <div className="p-4 rounded-xl bg-[#fdf8f6] border border-[#eaddd7] space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-sans font-semibold text-xs text-[#834832]">
                  <Sparkles className="w-4 h-4" />
                  <span>Nuance Analysis</span>
                </div>
                <p className="text-sm font-serif text-[#4f2416] leading-relaxed">
                  {distinctionData.comparison}
                </p>
              </div>
            )}
          </div>
        )}

        {/* --- MODALITY 3: ACTIVE PRODUCTION SANDBOX (ACT-03) --- */}
        {activeModality === 'ACT-03' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#a8a29e]">
                Active Production Sandbox
              </span>
              <p className="text-sm font-sans text-[#57534e]">
                Compose an original sentence deploying{' '}
                <strong className="font-serif text-base text-[#1c1917] capitalize">
                  "{currentCard.term}"
                </strong>{' '}
                accurately in formal or literary prose.
              </p>
            </div>

            {/* Sandbox Textarea */}
            <div className="space-y-2">
              <textarea
                rows={3}
                value={productionSentence}
                onChange={(e) => setProductionSentence(e.target.value)}
                placeholder={`e.g. Write a rich clause using "${currentCard.term}"...`}
                className="w-full text-base font-serif p-3.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#834832]"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-stone-500">
                  {productionSentence.trim() ? `${productionSentence.trim().split(/\s+/).length} words` : '0 words'}
                </span>
                <button
                  type="button"
                  disabled={isVerifyingProduction || !productionSentence.trim()}
                  onClick={handleVerifyProduction}
                  className="px-4 py-2 rounded-xl bg-[#834832] text-white text-xs font-sans font-semibold hover:bg-[#693522] transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isVerifyingProduction ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Inspecting Syntax...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Verify Usage</span>
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
          </div>
        )}

        {/* Collapsible Card Details: Pronunciation, Roots & Nuance */}
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <h3 className="font-serif font-bold text-xl text-[#1c1917] capitalize">
                {currentCard.term}
              </h3>
              {currentCard.phonetic && (
                <span className="font-mono text-xs text-[#78716c]">
                  {currentCard.phonetic}
                </span>
              )}
            </div>
            <span className="text-xs font-sans text-[#834832] font-semibold">
              {currentCard.part_of_speech}
            </span>
          </div>

          <p className="text-sm font-serif text-[#44403c]">
            {currentCard.primary_definition}
          </p>

          {currentCard.etymology.roots?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs font-sans text-stone-600">
              <GitBranch className="w-3.5 h-3.5 text-[#834832]" />
              {currentCard.etymology.roots.map((r, idx) => (
                <span key={idx} className="bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  {r.origin}: <em>{r.morpheme}</em> (“{r.meaning}”)
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ergonomic 4-Button FSRS Rating Bar (SRS-01, SRS-02) */}
      <div className="bg-white/95 backdrop-blur-md border border-[#e7e5e4] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-sans text-[#78716c]">
          <span className="font-semibold uppercase tracking-wider text-[#57534e]">
            Grade Recall (FSRS DSR Model)
          </span>
          <span className="hidden sm:inline font-mono text-[11px] text-[#a8a29e]">
            Keyboard Shortcuts: [ 1 ] [ 2 ] [ 3 ] [ 4 ]
          </span>
        </div>

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
