'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  GitBranch,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowRight,
  Sparkles,
  BookOpen,
  Layers,
} from 'lucide-react';
import { CardWithSrs } from '@/types/lexis';
import { cn } from '@/lib/utils';

export interface MorphemeGraphProps {
  cards: CardWithSrs[];
}

interface RootCluster {
  key: string;
  morpheme: string;
  origin: string;
  meaning: string;
  cards: CardWithSrs[];
}

interface RootNodePosition extends RootCluster {
  x: number;
  y: number;
}

interface WordNodePosition {
  card: CardWithSrs;
  x: number;
  y: number;
  rootKeys: string[];
}

interface CognateEdge {
  fromCardId: string;
  toCardId: string;
  sharedCognate: string;
}

function getOriginPalette(origin: string) {
  const norm = origin.toLowerCase();
  if (norm.includes('greek') || norm.includes('grieg')) {
    return {
      fill: '#0284c7',
      lightFill: '#e0f2fe',
      stroke: '#0369a1',
      badge: 'bg-sky-100 text-sky-900 border-sky-300',
      label: 'Greek',
    };
  }
  if (norm.includes('árabe') || norm.includes('arabe') || norm.includes('arab')) {
    return {
      fill: '#059669',
      lightFill: '#d1fae5',
      stroke: '#047857',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      label: 'Árabe',
    };
  }
  return {
    fill: '#834832',
    lightFill: '#f2e8e5',
    stroke: '#693522',
    badge: 'bg-[#f2e8e5] text-[#834832] border-[#eaddd7]',
    label: origin || 'Latin',
  };
}

export function MorphemeGraph({ cards }: MorphemeGraphProps) {
  // Build all root clusters from cards
  const allRootClusters = useMemo<RootCluster[]>(() => {
    const map = new Map<string, RootCluster>();

    for (const card of cards) {
      for (const root of card.etymology?.roots || []) {
        const cleanMorpheme = root.morpheme.trim();
        if (!cleanMorpheme) continue;
        const key = cleanMorpheme.toLowerCase();
        const existing = map.get(key);
        if (!existing) {
          map.set(key, {
            key,
            morpheme: cleanMorpheme,
            origin: root.origin || 'Latin',
            meaning: root.meaning || '',
            cards: [card],
          });
        } else {
          if (!existing.cards.some((c) => c.id === card.id)) {
            existing.cards.push(card);
          }
        }
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => b.cards.length - a.cards.length || a.morpheme.localeCompare(b.morpheme)
    );
  }, [cards]);

  const sharedClustersCount = useMemo(
    () => allRootClusters.filter((r) => r.cards.length >= 2).length,
    [allRootClusters]
  );

  const [clusterFilter, setClusterFilter] = useState<'all' | 'shared'>('all');

  useEffect(() => {
    if (sharedClustersCount >= 3) {
      setClusterFilter('shared');
    } else {
      setClusterFilter('all');
    }
  }, [sharedClustersCount]);

  // Visible root clusters (cap at 18 hubs so SVG constellation stays legible)
  const visibleRootClusters = useMemo(() => {
    const filtered =
      clusterFilter === 'shared'
        ? allRootClusters.filter((c) => c.cards.length >= 2)
        : allRootClusters;
    const list = filtered.length > 0 ? filtered : allRootClusters;
    return list.slice(0, 18);
  }, [allRootClusters, clusterFilter]);

  // Selection state: either a root key or a card ID
  const [selectedType, setSelectedType] = useState<'root' | 'word'>('root');
  const [selectedId, setSelectedId] = useState<string>('');

  // Ensure default selection points to the largest visible root cluster
  useEffect(() => {
    if (visibleRootClusters.length === 0) return;
    if (selectedType === 'root') {
      const exists = visibleRootClusters.some((r) => r.key === selectedId);
      if (!exists) {
        setSelectedId(visibleRootClusters[0].key);
      }
    } else if (selectedType === 'word') {
      const exists = cards.some((c) => c.id === selectedId);
      if (!exists) {
        setSelectedType('root');
        setSelectedId(visibleRootClusters[0].key);
      }
    }
  }, [visibleRootClusters, cards, selectedType, selectedId]);

  // Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Compute deterministic radial constellation layout within 860x540
  const { rootNodes, wordNodes, cognateEdges } = useMemo(() => {
    const cx = 430;
    const cy = 270;
    const count = visibleRootClusters.length;

    const placedRoots: RootNodePosition[] = visibleRootClusters.map((cluster, idx) => {
      if (count === 1) {
        return { ...cluster, x: cx, y: cy };
      }
      // Multi-ring or single elliptical ring
      const useInnerRing = count > 8 && idx < 4;
      const ringIndex = useInnerRing ? idx : count > 8 ? idx - 4 : idx;
      const ringTotal = useInnerRing ? 4 : count > 8 ? count - 4 : count;
      const rx = useInnerRing ? 125 : count <= 5 ? 195 : 255;
      const ry = useInnerRing ? 85 : count <= 5 ? 135 : 170;
      const angle = (2 * Math.PI * ringIndex) / ringTotal - Math.PI / 2;

      return {
        ...cluster,
        x: Math.round(cx + rx * Math.cos(angle)),
        y: Math.round(cy + ry * Math.sin(angle)),
      };
    });

    const rootByKey = new Map(placedRoots.map((r) => [r.key, r]));

    // Collect unique cards connected to placed roots
    const cardToRoots = new Map<string, { card: CardWithSrs; rootKeys: string[] }>();
    for (const root of placedRoots) {
      for (const card of root.cards) {
        const entry = cardToRoots.get(card.id);
        if (!entry) {
          cardToRoots.set(card.id, { card, rootKeys: [root.key] });
        } else if (!entry.rootKeys.includes(root.key)) {
          entry.rootKeys.push(root.key);
        }
      }
    }

    // Track how many single-root words orbit each hub for clean angular spacing
    const orbitCounters = new Map<string, number>();
    const orbitTotals = new Map<string, number>();
    for (const { rootKeys } of cardToRoots.values()) {
      if (rootKeys.length === 1) {
        const k = rootKeys[0];
        orbitTotals.set(k, (orbitTotals.get(k) || 0) + 1);
      }
    }

    const placedWords: WordNodePosition[] = [];
    let bridgeIdx = 0;

    for (const { card, rootKeys } of cardToRoots.values()) {
      if (rootKeys.length >= 2) {
        // Bridge word between multiple root hubs: position near centroid of its hubs
        const hubs = rootKeys.map((k) => rootByKey.get(k)!).filter(Boolean);
        const avgX = hubs.reduce((acc, h) => acc + h.x, 0) / hubs.length;
        const avgY = hubs.reduce((acc, h) => acc + h.y, 0) / hubs.length;
        const offsetAngle = (bridgeIdx * 2.1) % (2 * Math.PI);
        const offsetRadius = 18 + (bridgeIdx % 3) * 10;
        bridgeIdx++;
        placedWords.push({
          card,
          rootKeys,
          x: Math.max(55, Math.min(805, Math.round(avgX + offsetRadius * Math.cos(offsetAngle)))),
          y: Math.max(40, Math.min(500, Math.round(avgY + offsetRadius * Math.sin(offsetAngle)))),
        });
      } else {
        const rootKey = rootKeys[0];
        const hub = rootByKey.get(rootKey)!;
        const idxInOrbit = orbitCounters.get(rootKey) || 0;
        orbitCounters.set(rootKey, idxInOrbit + 1);
        const totalInOrbit = orbitTotals.get(rootKey) || 1;

        // Angle outward from center so satellites fan out toward the exterior
        const baseOutwardAngle = Math.atan2(hub.y - cy, hub.x - cx);
        const spread = Math.min(Math.PI * 1.35, Math.max(0.7, totalInOrbit * 0.48));
        const offset =
          totalInOrbit === 1
            ? 0
            : -spread / 2 + (spread * idxInOrbit) / Math.max(1, totalInOrbit - 1);
        const orbitRadius = 64 + (idxInOrbit % 2) * 18;
        const angle = baseOutwardAngle + offset;

        const wx = Math.max(55, Math.min(805, Math.round(hub.x + orbitRadius * Math.cos(angle))));
        const wy = Math.max(38, Math.min(502, Math.round(hub.y + orbitRadius * Math.sin(angle))));

        placedWords.push({
          card,
          rootKeys,
          x: wx,
          y: wy,
        });
      }
    }

    // Detect cognate connections between placed words
    const cognates: CognateEdge[] = [];
    for (let i = 0; i < placedWords.length; i++) {
      for (let j = i + 1; j < placedWords.length; j++) {
        const a = placedWords[i].card;
        const b = placedWords[j].card;
        const aCogs = (a.etymology?.cognates || []).map((c) => c.toLowerCase());
        const bCogs = (b.etymology?.cognates || []).map((c) => c.toLowerCase());

        const directMatch =
          aCogs.some((c) => c.includes(b.term.toLowerCase())) ||
          bCogs.some((c) => c.includes(a.term.toLowerCase()));
        const sharedCog = aCogs.find((c) => bCogs.includes(c));

        if (directMatch || sharedCog) {
          cognates.push({
            fromCardId: a.id,
            toCardId: b.id,
            sharedCognate: sharedCog || b.term,
          });
        }
      }
    }

    return { rootNodes: placedRoots, wordNodes: placedWords, cognateEdges: cognates };
  }, [visibleRootClusters]);

  const selectedRoot = useMemo(
    () =>
      selectedType === 'root'
        ? allRootClusters.find((r) => r.key === selectedId) || visibleRootClusters[0] || null
        : null,
    [selectedType, selectedId, allRootClusters, visibleRootClusters]
  );

  const selectedCard = useMemo(
    () => (selectedType === 'word' ? cards.find((c) => c.id === selectedId) || null : null),
    [selectedType, selectedId, cards]
  );

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if ((e.target as HTMLElement).closest('[data-node="true"]')) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  if (allRootClusters.length === 0) {
    return (
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-12 text-center space-y-3 shadow-sm">
        <GitBranch className="w-8 h-8 text-[#834832] mx-auto" />
        <h3 className="font-serif font-bold text-xl text-[#1c1917]">
          No Etymological Roots Available
        </h3>
        <p className="text-xs font-sans text-stone-500 max-w-md mx-auto">
          Capture vocabulary words with Latin, Greek, or Arabic root annotations to explore your interactive morpheme network.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Left 2 Columns: Interactive SVG Network Canvas */}
      <div className="lg:col-span-2 bg-white border border-[#e7e5e4] rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Graph Controls & Legend Bar */}
        <div className="p-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-[#fdf8f6]/60">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-sans">
            <button
              type="button"
              onClick={() => setClusterFilter('all')}
              className={cn(
                'px-3 py-1 rounded-lg font-medium transition-all',
                clusterFilter === 'all'
                  ? 'bg-white text-[#834832] font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              )}
            >
              All Root Clusters ({allRootClusters.length})
            </button>
            <button
              type="button"
              onClick={() => setClusterFilter('shared')}
              className={cn(
                'px-3 py-1 rounded-lg font-medium transition-all',
                clusterFilter === 'shared'
                  ? 'bg-white text-[#834832] font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              )}
            >
              Shared Roots (2+ Words) ({sharedClustersCount})
            </button>
          </div>

          {/* Origin Legend & Zoom Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-[11px] font-sans text-stone-600">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#834832] inline-block" />
                Latin
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" />
                Greek
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                Árabe
              </span>
            </div>

            <div className="flex items-center gap-1 border border-stone-200 rounded-lg bg-white p-0.5">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.2).toFixed(2)))}
                title="Zoom In"
                aria-label="Zoom In"
                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))}
                title="Zoom Out"
                aria-label="Zoom Out"
                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetView}
                title="Reset View"
                aria-label="Reset View"
                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* SVG Graph Viewport */}
        <div className="relative w-full bg-[#fafaf9] select-none overflow-hidden">
          <svg
            viewBox="0 0 860 540"
            className={cn(
              'w-full h-[420px] sm:h-[500px] block',
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <defs>
              <radialGradient id="constellationGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#834832" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#834832" stopOpacity="0" />
              </radialGradient>
            </defs>

            <g
              transform={`translate(${pan.x}, ${pan.y}) translate(430, 270) scale(${zoom}) translate(-430, -270)`}
            >
              {/* Subtle orbital background rings */}
              <circle
                cx={430}
                cy={270}
                r={245}
                fill="url(#constellationGlow)"
                stroke="#e7e5e4"
                strokeDasharray="4 6"
                strokeWidth={1}
              />
              <circle
                cx={430}
                cy={270}
                r={140}
                fill="none"
                stroke="#e7e5e4"
                strokeDasharray="3 5"
                strokeWidth={1}
              />

              {/* Cognate Dashed Bridges between words */}
              {cognateEdges.map((edge, idx) => {
                const fromNode = wordNodes.find((w) => w.card.id === edge.fromCardId);
                const toNode = wordNodes.find((w) => w.card.id === edge.toCardId);
                if (!fromNode || !toNode) return null;
                const isHighlighted =
                  selectedType === 'word' &&
                  (selectedId === edge.fromCardId || selectedId === edge.toCardId);
                return (
                  <line
                    key={`cog-${idx}`}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isHighlighted ? '#834832' : '#d6d3d1'}
                    strokeWidth={isHighlighted ? 2 : 1.2}
                    strokeDasharray="4 4"
                    opacity={isHighlighted ? 0.9 : 0.55}
                  />
                );
              })}

              {/* Root-to-Word Edges */}
              {wordNodes.map((wNode) =>
                wNode.rootKeys.map((rKey) => {
                  const rNode = rootNodes.find((r) => r.key === rKey);
                  if (!rNode) return null;
                  const palette = getOriginPalette(rNode.origin);
                  const isHighlighted =
                    (selectedType === 'root' && selectedId === rKey) ||
                    (selectedType === 'word' && selectedId === wNode.card.id);

                  return (
                    <line
                      key={`edge-${rKey}-${wNode.card.id}`}
                      x1={rNode.x}
                      y1={rNode.y}
                      x2={wNode.x}
                      y2={wNode.y}
                      stroke={isHighlighted ? palette.fill : '#d6d3d1'}
                      strokeWidth={isHighlighted ? 2.4 : 1.25}
                      opacity={isHighlighted ? 0.95 : 0.45}
                    />
                  );
                })
              )}

              {/* Word Satellite Nodes */}
              {wordNodes.map((wNode) => {
                const isSelected = selectedType === 'word' && selectedId === wNode.card.id;
                const isConnectedToSelectedRoot =
                  selectedType === 'root' && wNode.rootKeys.includes(selectedId);
                const isBridge = wNode.rootKeys.length >= 2;

                return (
                  <g
                    key={`word-${wNode.card.id}`}
                    data-node="true"
                    transform={`translate(${wNode.x}, ${wNode.y})`}
                    onClick={() => {
                      setSelectedType('word');
                      setSelectedId(wNode.card.id);
                    }}
                    className="cursor-pointer group"
                  >
                    <circle
                      r={isSelected ? 15 : isBridge ? 13 : 11}
                      fill={
                        isSelected
                          ? '#1c1917'
                          : isConnectedToSelectedRoot
                          ? '#fff7ed'
                          : '#ffffff'
                      }
                      stroke={
                        isSelected
                          ? '#834832'
                          : isConnectedToSelectedRoot
                          ? '#834832'
                          : '#a8a29e'
                      }
                      strokeWidth={isSelected || isConnectedToSelectedRoot ? 2.5 : 1.5}
                    />
                    <text
                      y={isSelected ? 26 : 23}
                      textAnchor="middle"
                      className="font-serif text-[11px] fill-[#1c1917] font-semibold pointer-events-none"
                    >
                      {wNode.card.term}
                    </text>
                  </g>
                );
              })}

              {/* Root Hub Nodes */}
              {rootNodes.map((rNode) => {
                const palette = getOriginPalette(rNode.origin);
                const isSelected = selectedType === 'root' && selectedId === rNode.key;
                const isConnectedToSelectedWord =
                  selectedType === 'word' &&
                  rNode.cards.some((c) => c.id === selectedId);
                const radius = Math.min(30, 20 + rNode.cards.length * 2);

                return (
                  <g
                    key={`root-${rNode.key}`}
                    data-node="true"
                    transform={`translate(${rNode.x}, ${rNode.y})`}
                    onClick={() => {
                      setSelectedType('root');
                      setSelectedId(rNode.key);
                    }}
                    className="cursor-pointer"
                  >
                    {(isSelected || isConnectedToSelectedWord) && (
                      <circle
                        r={radius + 6}
                        fill="none"
                        stroke={palette.fill}
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        opacity={0.75}
                      />
                    )}
                    <circle
                      r={radius}
                      fill={isSelected ? palette.fill : palette.lightFill}
                      stroke={palette.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                    />
                    <text
                      y={-2}
                      textAnchor="middle"
                      className={cn(
                        'font-serif italic text-[11px] font-bold pointer-events-none',
                        isSelected ? 'fill-white' : 'fill-[#1c1917]'
                      )}
                    >
                      {rNode.morpheme}
                    </text>
                    <text
                      y={11}
                      textAnchor="middle"
                      className={cn(
                        'font-mono text-[9px] font-semibold pointer-events-none',
                        isSelected ? 'fill-stone-100' : 'fill-stone-600'
                      )}
                    >
                      {rNode.cards.length}w
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          <div className="px-4 py-2.5 bg-white/90 border-t border-stone-100 flex items-center justify-between text-[11px] font-sans text-stone-500">
            <span>
              Click any <strong>Root Hub</strong> or <strong>Vocabulary Node</strong> to inspect connections & launch a targeted drill.
            </span>
            <span className="hidden sm:inline font-mono text-stone-400">
              Drag canvas to pan • Zoom {(zoom * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Morpheme / Word Inspector Panel */}
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-6 shadow-sm space-y-5">
        {selectedType === 'root' && selectedRoot ? (
          <>
            <div className="space-y-2 border-b border-stone-100 pb-4">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border',
                    getOriginPalette(selectedRoot.origin).badge
                  )}
                >
                  {selectedRoot.origin} Root Hub
                </span>
                <span className="text-xs font-mono text-stone-500">
                  {selectedRoot.cards.length}{' '}
                  {selectedRoot.cards.length === 1 ? 'connected word' : 'connected words'}
                </span>
              </div>

              <h3 className="text-2xl font-serif font-bold italic text-[#1c1917]">
                {selectedRoot.morpheme}
              </h3>
              <p className="text-sm font-sans text-[#57534e]">
                Meaning: <span className="font-serif italic text-[#1c1917]">“{selectedRoot.meaning}”</span>
              </p>
            </div>

            {/* Connected Vocabulary Cards */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-400 block">
                Connected Lexicon Entries
              </span>
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {selectedRoot.cards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      setSelectedType('word');
                      setSelectedId(card.id);
                    }}
                    className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-[#834832] bg-[#fdf8f6]/50 hover:bg-[#fdf8f6] transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-base text-[#1c1917] capitalize group-hover:text-[#834832]">
                          {card.term}
                        </span>
                        <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                          {(card.language || 'en') === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-500">
                        {card.part_of_speech} • S:{card.srs.stability.toFixed(1)}d
                      </span>
                    </div>
                    <p className="text-xs font-serif text-stone-600 line-clamp-2">
                      {card.primary_definition}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Targeted Root Cluster Drill CTA */}
            <Link
              href={`/review?root=${encodeURIComponent(selectedRoot.morpheme)}`}
              className="w-full py-3 px-4 rounded-xl bg-[#834832] hover:bg-[#693522] text-white text-xs font-sans font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>
                Drill This Root Cluster ({selectedRoot.cards.length}{' '}
                {selectedRoot.cards.length === 1 ? 'word' : 'words'})
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        ) : selectedType === 'word' && selectedCard ? (
          <>
            <div className="space-y-2 border-b border-stone-100 pb-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                  {(selectedCard.language || 'en') === 'es' ? '🇪🇸 Español' : '🇬🇧 English'} •{' '}
                  {selectedCard.part_of_speech}
                </span>
                <span className="text-xs font-mono text-stone-500">
                  S: {selectedCard.srs.stability.toFixed(1)}d
                </span>
              </div>

              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-2xl font-serif font-bold text-[#1c1917] capitalize">
                  {selectedCard.term}
                </h3>
                {selectedCard.phonetic && (
                  <span className="text-xs font-mono text-stone-500">
                    {selectedCard.phonetic}
                  </span>
                )}
              </div>

              <p className="text-sm font-serif text-[#1c1917] leading-relaxed">
                {selectedCard.primary_definition}
              </p>

              {selectedCard.english_gloss && (
                <div className="p-2 rounded-lg bg-[#f0f9ff] border border-[#bae6fd] text-xs font-serif italic text-[#0c4a6e]">
                  <strong className="font-sans not-italic text-[10px] uppercase tracking-wider text-[#0369a1] mr-1.5">
                    English Anchor:
                  </strong>
                  “{selectedCard.english_gloss}”
                </div>
              )}
            </div>

            {selectedCard.nuance_note && (
              <div className="p-3 rounded-xl bg-[#fdf8f6] border border-[#eaddd7] text-xs font-serif italic text-[#4f2416] space-y-1">
                <div className="flex items-center gap-1 font-sans not-italic font-semibold text-[#834832] text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Nuance</span>
                </div>
                <p>“{selectedCard.nuance_note}”</p>
              </div>
            )}

            {/* Clickable Root Breakdown Pills */}
            {selectedCard.etymology?.roots?.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-400 block">
                  Morpheme Hubs (Click to Pivot)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCard.etymology.roots.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedType('root');
                        setSelectedId(r.morpheme.trim().toLowerCase());
                      }}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#f2e8e5] border border-stone-200 hover:border-[#834832] text-xs font-sans text-stone-800 transition-colors"
                    >
                      <strong>{r.origin}</strong>: <em>{r.morpheme}</em> (“{r.meaning}”)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cognates */}
            {selectedCard.etymology?.cognates?.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-400 block">
                  Cross-Lingual & Etymological Cognates
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCard.etymology.cognates.map((cog, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-serif italic border border-stone-200"
                    >
                      {cog}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Single-Card Focused Drill CTA */}
            <Link
              href={`/review?cardId=${encodeURIComponent(selectedCard.id)}`}
              className="w-full py-3 px-4 rounded-xl bg-[#834832] hover:bg-[#693522] text-white text-xs font-sans font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Practice “{selectedCard.term}” Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}
