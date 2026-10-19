'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  BarChart3,
  Calendar,
  AlertTriangle,
  Award,
  TrendingUp,
  Layers,
  Eye,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CardWithSrs } from '@/types/lexis';
import { getCardStateLabel } from '@/lib/fsrs';
import { formatGenderBadge } from '@/lib/language';
import { cn } from '@/lib/utils';

export interface RetentionAnalyticsProps {
  cards: CardWithSrs[];
  onInspectCard: (cardId: string) => void;
}

interface DayForecast {
  dayOffset: number;
  label: string;
  weekday: string;
  dateStr: string;
  enCount: number;
  esCount: number;
  totalCount: number;
  cards: CardWithSrs[];
}

export function RetentionAnalytics({ cards, onInspectCard }: RetentionAnalyticsProps) {
  const [selectedDayOffset, setSelectedDayOffset] = useState<number | null>(null);

  // 1. Summary KPI Telemetry
  const telemetry = useMemo(() => {
    const total = cards.length;
    if (total === 0) {
      return {
        total: 0,
        meanStability: 0,
        meanDifficulty: 0,
        matureCount: 0,
        maturePct: 0,
        youngReviewCount: 0,
        learningCount: 0,
        newCount: 0,
        totalReps: 0,
        totalLapses: 0,
        reviewedCount: 0,
      };
    }

    const reviewedCards = cards.filter((c) => c.srs.reps > 0 || c.srs.state > 0);
    const stabilityPool = reviewedCards.length > 0 ? reviewedCards : cards;
    const meanStability =
      stabilityPool.reduce((acc, c) => acc + (c.srs.stability || 0), 0) /
      stabilityPool.length;

    const difficultyPool = reviewedCards.length > 0 ? reviewedCards : cards;
    const meanDifficulty =
      difficultyPool.reduce((acc, c) => acc + (c.srs.difficulty || 0), 0) /
      difficultyPool.length;

    const newCount = cards.filter((c) => c.srs.state === 0 && (c.srs.stability || 0) < 21).length;
    const learningCount = cards.filter(
      (c) => (c.srs.state === 1 || c.srs.state === 3) && (c.srs.stability || 0) < 21
    ).length;
    const matureCount = cards.filter((c) => (c.srs.stability || 0) >= 21).length;
    const youngReviewCount = cards.filter(
      (c) => c.srs.state === 2 && (c.srs.stability || 0) < 21
    ).length;

    const maturePct = Math.round((matureCount / total) * 100);
    const totalReps = cards.reduce((acc, c) => acc + (c.srs.reps || 0), 0);
    const totalLapses = cards.reduce((acc, c) => acc + (c.srs.lapses || 0), 0);

    return {
      total,
      meanStability,
      meanDifficulty,
      matureCount,
      maturePct,
      youngReviewCount,
      learningCount,
      newCount,
      totalReps,
      totalLapses,
      reviewedCount: reviewedCards.length,
    };
  }, [cards]);

  // 2. 14-Day Review Workload Forecast
  const forecast = useMemo<DayForecast[]>(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msPerDay = 24 * 60 * 60 * 1000;

    const days: DayForecast[] = Array.from({ length: 14 }, (_, d) => {
      const targetDate = new Date(startOfToday.getTime() + d * msPerDay);
      const weekday = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = targetDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return {
        dayOffset: d,
        label: d === 0 ? 'Today' : `+${d}d`,
        weekday,
        dateStr,
        enCount: 0,
        esCount: 0,
        totalCount: 0,
        cards: [],
      };
    });

    const endOfTodayMs = startOfToday.getTime() + msPerDay - 1;

    for (const card of cards) {
      const dueMs = new Date(card.srs.due).getTime();
      if (Number.isNaN(dueMs)) continue;

      let bucketIdx = -1;
      if (dueMs <= endOfTodayMs) {
        bucketIdx = 0;
      } else {
        const diffDays = Math.floor((dueMs - startOfToday.getTime()) / msPerDay);
        if (diffDays >= 1 && diffDays < 14) {
          bucketIdx = diffDays;
        }
      }

      if (bucketIdx >= 0 && bucketIdx < 14) {
        const bucket = days[bucketIdx];
        const isEs = card.language === 'es';
        if (isEs) {
          bucket.esCount += 1;
        } else {
          bucket.enCount += 1;
        }
        bucket.totalCount += 1;
        bucket.cards.push(card);
      }
    }

    return days;
  }, [cards]);

  const maxDailyCount = useMemo(() => {
    return Math.max(4, ...forecast.map((d) => d.totalCount));
  }, [forecast]);

  const total14DayScheduled = useMemo(() => {
    return forecast.reduce((sum, d) => sum + d.totalCount, 0);
  }, [forecast]);

  // 3. High-Difficulty & Leech Watchlist
  const watchlist = useMemo(() => {
    const flagged = cards
      .filter((c) => (c.srs.lapses || 0) >= 1 || (c.srs.difficulty || 0) >= 6.0)
      .sort((a, b) => {
        if ((b.srs.lapses || 0) !== (a.srs.lapses || 0)) {
          return (b.srs.lapses || 0) - (a.srs.lapses || 0);
        }
        if ((b.srs.difficulty || 0) !== (a.srs.difficulty || 0)) {
          return (b.srs.difficulty || 0) - (a.srs.difficulty || 0);
        }
        return (a.srs.stability || 0) - (b.srs.stability || 0);
      });

    if (flagged.length > 0) {
      return { items: flagged.slice(0, 6), isFallbackPool: false };
    }

    // Fallback: top 6 highest-difficulty / lowest-stability cards
    const fallbackSorted = [...cards].sort((a, b) => {
      if ((b.srs.difficulty || 0) !== (a.srs.difficulty || 0)) {
        return (b.srs.difficulty || 0) - (a.srs.difficulty || 0);
      }
      return (a.srs.stability || 0) - (b.srs.stability || 0);
    });

    return { items: fallbackSorted.slice(0, 6), isFallbackPool: true };
  }, [cards]);

  const selectedDayData =
    selectedDayOffset !== null
      ? forecast.find((d) => d.dayOffset === selectedDayOffset) || null
      : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Section 1: Summary KPI Strip (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Mean Stability (S) */}
        <div className="bg-white border border-[#e7e5e4] rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-sans font-semibold uppercase tracking-wider text-[#834832]">
            <span>Mean Stability (S)</span>
            <TrendingUp className="w-4 h-4 text-[#834832]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#1c1917]">
              {telemetry.meanStability.toFixed(1)}d
            </span>
            <span className="text-xs font-mono text-stone-500">
              ({telemetry.reviewedCount} active)
            </span>
          </div>
          <p className="text-xs font-sans text-[#78716c]">
            Expected 90% recall horizon
          </p>
        </div>

        {/* Card 2: Mean Difficulty (D) */}
        <div className="bg-white border border-[#e7e5e4] rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-sans font-semibold uppercase tracking-wider text-stone-600">
            <span>Mean Difficulty (D)</span>
            <Activity className="w-4 h-4 text-amber-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#1c1917]">
              {telemetry.meanDifficulty.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-stone-500">/ 10.0</span>
          </div>
          <p className="text-xs font-sans text-[#78716c]">
            FSRS item complexity
          </p>
        </div>

        {/* Card 3: Retention Maturity */}
        <div className="bg-white border border-[#e7e5e4] rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-sans font-semibold uppercase tracking-wider text-emerald-800">
            <span>Retention Maturity</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-emerald-800">
              {telemetry.maturePct}%
            </span>
            <span className="text-xs font-mono text-stone-500">
              ({telemetry.matureCount} mature / {telemetry.youngReviewCount} young)
            </span>
          </div>
          <p className="text-xs font-sans text-[#78716c]">
            Mature cards with S ≥ 21 days
          </p>
        </div>

        {/* Card 4: Total Active Reps */}
        <div className="bg-[#fdf8f6] border border-[#eaddd7] rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-sans font-semibold uppercase tracking-wider text-[#834832]">
            <span>Total Active Reps</span>
            <BarChart3 className="w-4 h-4 text-[#834832]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#1c1917]">
              {telemetry.totalReps}
            </span>
            <span className="text-xs font-mono text-rose-700">
              ({telemetry.totalLapses} {telemetry.totalLapses === 1 ? 'lapse' : 'lapses'})
            </span>
          </div>
          <p className="text-xs font-sans text-[#78716c]">
            Cumulative FSRS retrievals logged
          </p>
        </div>
      </div>

      {/* Section 2: 14-Day Review Workload Forecast Chart */}
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-[#834832]">
              <Calendar className="w-3.5 h-3.5" />
              <span>FSRS Memory Horizon</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1c1917]">
              14-Day Review Workload Forecast
            </h2>
            <p className="text-xs font-sans text-[#78716c]">
              Projected daily review volume across your bilingual lexicon ({total14DayScheduled}{' '}
              {total14DayScheduled === 1 ? 'card' : 'cards'} scheduled over the next 14 days).
            </p>
          </div>

          {/* Language Legend */}
          <div className="flex items-center gap-4 text-xs font-sans self-start sm:self-auto bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#834832] inline-block" />
              <span className="text-stone-700 font-medium">🇬🇧 EN</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" />
              <span className="text-stone-700 font-medium">🇪🇸 ES</span>
            </div>
          </div>
        </div>

        {/* 14-Column Bar Chart */}
        <div className="pt-2">
          <div className="grid grid-cols-7 sm:grid-cols-[repeat(14,minmax(0,1fr))] gap-1.5 sm:gap-2 items-end pt-4 pb-2 px-1">
            {forecast.map((day) => {
              const heightPct =
                day.totalCount > 0
                  ? Math.max(12, Math.round((day.totalCount / maxDailyCount) * 100))
                  : 0;
              const enSharePct =
                day.totalCount > 0 ? Math.round((day.enCount / day.totalCount) * 100) : 0;
              const esSharePct = day.totalCount > 0 ? 100 - enSharePct : 0;
              const isSelected = selectedDayOffset === day.dayOffset;

              return (
                <button
                  key={day.dayOffset}
                  type="button"
                  onClick={() =>
                    setSelectedDayOffset((prev) =>
                      prev === day.dayOffset ? null : day.dayOffset
                    )
                  }
                  title={`${day.label} (${day.dateStr}): ${day.totalCount} due (${day.enCount} EN, ${day.esCount} ES)`}
                  className={cn(
                    'group flex flex-col items-center justify-end rounded-xl p-1 transition-all cursor-pointer focus:outline-none',
                    isSelected
                      ? 'bg-[#fdf8f6] ring-1 ring-[#834832]/40'
                      : 'hover:bg-stone-50'
                  )}
                >
                  {/* Count Label Above Bar */}
                  <span
                    className={cn(
                      'text-[11px] font-mono mb-1.5 transition-colors',
                      day.totalCount > 0
                        ? day.dayOffset === 0
                          ? 'font-bold text-[#834832]'
                          : 'font-semibold text-stone-700'
                        : 'text-stone-300'
                    )}
                  >
                    {day.totalCount}
                  </span>

                  {/* Bar Track */}
                  <div className="w-full max-w-[30px] h-32 flex items-end justify-center bg-stone-100/80 rounded-lg overflow-hidden p-0.5">
                    {day.totalCount > 0 ? (
                      <div
                        className="w-full rounded-md overflow-hidden flex flex-col justify-end transition-all duration-300 shadow-2xs"
                        style={{ height: `${heightPct}%` }}
                      >
                        {day.esCount > 0 && (
                          <div
                            className="w-full bg-amber-500 transition-all"
                            style={{ height: `${esSharePct}%` }}
                          />
                        )}
                        {day.enCount > 0 && (
                          <div
                            className="w-full bg-[#834832] transition-all"
                            style={{ height: `${enSharePct}%` }}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-1 bg-stone-200 rounded-full" />
                    )}
                  </div>

                  {/* Day Offset Label */}
                  <span
                    className={cn(
                      'mt-2 text-[10px] font-sans tracking-tight leading-none',
                      day.dayOffset === 0
                        ? 'font-bold text-[#834832]'
                        : 'font-medium text-stone-600'
                    )}
                  >
                    {day.label}
                  </span>
                  <span className="text-[9px] font-mono text-stone-400 mt-0.5 hidden sm:inline">
                    {day.weekday}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Drilldown Drawer */}
        {selectedDayData && (
          <div className="p-4 rounded-xl bg-[#fdf8f6] border border-[#eaddd7] space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-sans">
                <span className="font-bold text-[#834832] uppercase tracking-wider">
                  {selectedDayData.label} ({selectedDayData.weekday}, {selectedDayData.dateStr})
                </span>
                <span className="text-stone-600">
                  • {selectedDayData.totalCount}{' '}
                  {selectedDayData.totalCount === 1 ? 'card' : 'cards'} scheduled (
                  {selectedDayData.enCount} 🇬🇧 EN, {selectedDayData.esCount} 🇪🇸 ES)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDayOffset(null)}
                className="text-xs font-sans text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            {selectedDayData.cards.length === 0 ? (
              <p className="text-xs font-serif italic text-stone-500">
                No cards scheduled on this day.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedDayData.cards.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onInspectCard(c.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#eaddd7] hover:border-[#834832] text-xs font-serif font-semibold text-[#1c1917] shadow-2xs transition-all cursor-pointer"
                  >
                    <span>{(c.language || 'en') === 'es' ? '🇪🇸' : '🇬🇧'}</span>
                    <span className="capitalize">{c.term}</span>
                    <span className="text-[10px] font-mono text-stone-500">
                      (S: {c.srs.stability.toFixed(1)}d)
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 3: Mastery & Stability Distribution Bar */}
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-[#834832]">
              <Layers className="w-3.5 h-3.5" />
              <span>Retention Distribution</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1c1917]">
              Mastery & Stability Tiers
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500">
            {telemetry.total} Total Cards
          </span>
        </div>

        {/* Segmented Progress Bar */}
        <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-stone-200">
          {telemetry.total > 0 && (
            <>
              {telemetry.newCount > 0 && (
                <div
                  className="h-full bg-stone-400 first:rounded-l-full last:rounded-r-full transition-all"
                  style={{ width: `${(telemetry.newCount / telemetry.total) * 100}%` }}
                  title={`New (state 0): ${telemetry.newCount}`}
                />
              )}
              {telemetry.learningCount > 0 && (
                <div
                  className="h-full bg-amber-500 first:rounded-l-full last:rounded-r-full transition-all"
                  style={{ width: `${(telemetry.learningCount / telemetry.total) * 100}%` }}
                  title={`Learning (state 1/3): ${telemetry.learningCount}`}
                />
              )}
              {telemetry.youngReviewCount > 0 && (
                <div
                  className="h-full bg-sky-500 first:rounded-l-full last:rounded-r-full transition-all"
                  style={{ width: `${(telemetry.youngReviewCount / telemetry.total) * 100}%` }}
                  title={`Young Review (S < 21d): ${telemetry.youngReviewCount}`}
                />
              )}
              {telemetry.matureCount > 0 && (
                <div
                  className="h-full bg-emerald-600 first:rounded-l-full last:rounded-r-full transition-all"
                  style={{ width: `${(telemetry.matureCount / telemetry.total) * 100}%` }}
                  title={`Mature Review (S >= 21d): ${telemetry.matureCount}`}
                />
              )}
            </>
          )}
        </div>

        {/* Breakdown Legend Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-400 shrink-0" />
              <span className="text-xs font-sans font-medium text-stone-700">
                New (state 0)
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-stone-900">
              {telemetry.newCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span className="text-xs font-sans font-medium text-amber-900">
                Learning (state 1/3)
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-900">
              {telemetry.learningCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
              <span className="text-xs font-sans font-medium text-sky-900">
                Young Review (S &lt; 21d)
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-sky-900">
              {telemetry.youngReviewCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
              <span className="text-xs font-sans font-medium text-emerald-900">
                Mature Review (S ≥ 21d)
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-900">
              {telemetry.matureCount}
            </span>
          </div>
        </div>
      </div>

      {/* Section 4: High-Difficulty & Leech Watchlist */}
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-rose-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Cognitive Friction Telemetry</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1c1917]">
              High-Difficulty & Leech Watchlist
            </h2>
            <p className="text-xs font-sans text-[#78716c]">
              {watchlist.isFallbackPool
                ? 'No high-lapse leeches detected yet — showing highest-complexity / lowest-stability items for proactive reinforcement.'
                : 'Cards with recorded lapses (≥ 1) or elevated FSRS difficulty (D ≥ 6.0) requiring targeted active production.'}
            </p>
          </div>
          <Link
            href="/review?modality=ACT-04"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#fdf8f6] hover:bg-[#f2e8e5] border border-[#eaddd7] text-xs font-sans font-semibold text-[#834832] transition-colors self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Synthesis Weave (ACT-04)</span>
          </Link>
        </div>

        {watchlist.items.length === 0 ? (
          <p className="text-sm font-sans text-stone-500 py-8 text-center">
            No cards in your lexicon to analyze yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.items.map((card) => {
              const isSpanish = (card.language || 'en') === 'es';
              const genderBadge = isSpanish
                ? formatGenderBadge(card.gender, card.part_of_speech)
                : null;

              return (
                <div
                  key={card.id}
                  className="p-4 rounded-xl border border-stone-200 hover:border-[#834832]/50 bg-stone-50/40 hover:bg-white transition-all flex flex-col justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-serif font-bold text-lg text-[#1c1917] capitalize">
                          {card.term}
                        </h3>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-bold bg-stone-100 text-stone-700 border border-stone-200">
                          {isSpanish ? '🇪🇸 ES' : '🇬🇧 EN'}
                        </span>
                        {genderBadge && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-bold bg-amber-50 text-amber-900 border border-amber-300">
                            {genderBadge.article}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700">
                        {getCardStateLabel(card.srs.state)}
                      </span>
                    </div>

                    <p className="text-xs font-serif text-stone-600 line-clamp-2">
                      {card.primary_definition}
                    </p>

                    {/* Telemetry Pills */}
                    <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] font-mono">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded border',
                          card.srs.difficulty >= 6.0
                            ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
                            : 'bg-white border-stone-200 text-stone-700'
                        )}
                      >
                        D: {card.srs.difficulty.toFixed(1)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                        S: {card.srs.stability.toFixed(1)}d
                      </span>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded border',
                          card.srs.lapses >= 1
                            ? 'bg-rose-50 border-rose-200 text-rose-800 font-semibold'
                            : 'bg-white border-stone-200 text-stone-600'
                        )}
                      >
                        Lapses: {card.srs.lapses}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2.5 border-t border-stone-200/70 flex items-center justify-between text-xs font-sans">
                    <button
                      type="button"
                      onClick={() => onInspectCard(card.id)}
                      className="inline-flex items-center gap-1 text-stone-600 hover:text-[#1c1917] font-medium cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <Link
                      href={`/review?cardId=${encodeURIComponent(card.id)}`}
                      className="inline-flex items-center gap-1 text-[#834832] hover:text-[#693522] font-semibold"
                    >
                      <span>Drill Now →</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
