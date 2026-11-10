import {
  CardWithSrs,
  ProsePolishResult,
  ProsePolishSuggestion,
} from '@/types/lexis';
import { detectLanguage, normalizeDiacritics } from '@/lib/language';
import { getGeminiApiKey, extractJsonFromText } from './enricher';

export interface PolishProseOptions {
  draft: string;
  cards: CardWithSrs[];
  language?: 'auto' | 'en' | 'es';
  focusRoot?: string;
  maxSuggestions?: number;
}

interface HeuristicMappingRule {
  targetTerms: string[];
  triggers: RegExp[];
  replacementPhrase: (matchedFragment: string, card: CardWithSrs) => string;
  rationale: (card: CardWithSrs) => string;
}

const ENGLISH_HEURISTIC_RULES: HeuristicMappingRule[] = [
  {
    targetTerms: ['perspicacious'],
    triggers: [
      /\b(very\s+sharp|sharp|insightful|perceptive|clever|smart)\b/i,
    ],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Substitutes generic praise of mental sharpness with "${card.term}", foregrounding penetrating critical discernment (${card.primary_definition}).`,
  },
  {
    targetTerms: ['solipsism'],
    triggers: [
      /\b(self-centered(?:ness)?|isolated\s+mind|extreme\s+ego(?:ism|centricity)?|trapped\s+in\s+(?:one's|their|his|her)\s+own\s+mind)\b/i,
    ],
    replacementPhrase: () => 'epistemological solipsism',
    rationale: (card) =>
      `Elevates colloquial descriptions of insular self-absorption into "${card.term}", capturing philosophical enclosure within one's own consciousness.`,
  },
  {
    targetTerms: ['inchoate'],
    triggers: [
      /\b(unformed|early[- ]stage|not\s+fully\s+formed|half[- ]baked|rough\s+and\s+unfinished|rudimentary)\b/i,
    ],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Replaces informal developmental phrasing with "${card.term}", conveying nascent potential that has not yet crystallized into structure.`,
  },
  {
    targetTerms: ['apocryphal'],
    triggers: [
      /\b(fake|doubtful|probably\s+made[- ]up|questionable\s+truth|widely\s+believed\s+but\s+false)\b/i,
    ],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Refines blunt skepticism into "${card.term}", distinguishing stories of dubious provenance that nonetheless carry mythic currency.`,
  },
  {
    targetTerms: ['susurrus'],
    triggers: [
      /\b(soft\s+whisper(?:ing)?|low\s+murmur(?:ing)?|rustling\s+sound|quiet\s+whisper)\b/i,
    ],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Introduces the onomatopoetic Latinate noun "${card.term}" to evoke a continuous, lyrical acoustic murmur.`,
  },
  {
    targetTerms: ['aporia'],
    triggers: [
      /\b(hard\s+to\s+understand|contradiction|puzzle|dead\s+end|impasse|logical\s+knot)\b/i,
    ],
    replacementPhrase: () => 'structural aporia',
    rationale: (card) =>
      `Replaces everyday impasse phrasing with "${card.term}", framing the contradiction as an irreducible philosophical knot.`,
  },
  {
    targetTerms: ['pellucid'],
    triggers: [
      /\b(very\s+clear|crystal\s+clear|transparent|easy\s+to\s+follow)\b/i,
    ],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Elevates plain clarity to "${card.term}", suggesting luminous stylistic transparency.`,
  },
  {
    targetTerms: ['ephemeral'],
    triggers: [
      /\b(fleeting|short[- ]lived|passing\s+quickly|temporary)\b/i,
    ],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Uses "${card.term}" to impart classical transience rather than mundane brevity.`,
  },
  {
    targetTerms: ['reification'],
    triggers: [
      /\b(turning\s+into\s+a\s+thing|commodifying|treating\s+abstract\s+ideas\s+as\s+concrete)\b/i,
    ],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Deploys "${card.term}" to precisely name the transformation of abstract social relations into concrete objects.`,
  },
  {
    targetTerms: ['hegemony'],
    triggers: [
      /\b(dominant\s+power|cultural\s+dominance|ruling\s+control)\b/i,
    ],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Replaces general dominance phrasing with "${card.term}", signifying naturalized ideological leadership.`,
  },
  {
    targetTerms: ['hermeneutic', 'exegesis'],
    triggers: [
      /\b(deep\s+interpretation|critical\s+interpretation|close\s+reading|interpretation)\b/i,
    ],
    replacementPhrase: (_m, card) =>
      card.part_of_speech.toLowerCase().includes('adj')
        ? `${card.term} inquiry`
        : `rigorous ${card.term}`,
    rationale: (card) =>
      `Anchors the interpretive act in formal methodological vocabulary via "${card.term}".`,
  },
];

const SPANISH_HEURISTIC_RULES: HeuristicMappingRule[] = [
  {
    targetTerms: ['desasosiego', 'zozobra'],
    triggers: [
      /\b(inquietud|ansiedad|intranquilidad|nerviosismo|falta\s+de\s+paz)\b/i,
    ],
    replacementPhrase: (_m, card) => `hondo ${card.term}`,
    rationale: (card) =>
      `Sustituye la expresión cotidiana de inquietud por "${card.term}", elevando el pasaje hacia una resonancia existencial y literaria.`,
  },
  {
    targetTerms: ['quimera'],
    triggers: [
      /\b(ilusión\s+imposible|sueño\s+imposible|ilusión|fantasía\s+irreal)\b/i,
    ],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Reemplaza el vocablo general por "${card.term}", evocando un espejismo utópico que seduce la imaginación.`,
  },
  {
    targetTerms: ['inefable'],
    triggers: [
      /\b(imposible\s+de\s+expresar|que\s+no\s+se\s+puede\s+explicar|indescriptible)\b/i,
    ],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Condensa la perífrasis coloquial en el adjetivo culto "${card.term}", propio de la mística y la alta lírica.`,
  },
  {
    targetTerms: ['efímero', 'efimero'],
    triggers: [/\b(pasajero|muy\s+breve|fugaz|de\s+corta\s+duración)\b/i],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Aporta precisión helénica mediante "${card.term}" para subrayar la fugacidad irremediable del fenómeno.`,
  },
  {
    targetTerms: ['hastío', 'hastio'],
    triggers: [/\b(aburrimiento|cansancio\s+vital|tedio|monotonía)\b/i],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Transforma el cansancio ordinario en "${card.term}", término clave del spleen modernista y la filosofía existencial.`,
  },
  {
    targetTerms: ['añoranza', 'anoranza'],
    triggers: [/\b(nostalgia|recuerdo\s+triste|extrañar\s+el\s+pasado)\b/i],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Introduce "${card.term}" para matizar la memoria afectiva con una cadencia más íntima y castiza.`,
  },
  {
    targetTerms: ['palimpsesto'],
    triggers: [/\b(texto\s+antiguo|capas\s+de\s+memoria|escritura\s+sobre\s+otra)\b/i],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Incorpora la metáfora filológica del "${card.term}", donde las huellas pretéritas traslucen bajo la superficie presente.`,
  },
  {
    targetTerms: ['aporía', 'aporia'],
    triggers: [/\b(contradicción|callejón\s+sin\s+salida|paradoja\s+sin\s+solución)\b/i],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Eleva la paradoja al rango filosófico de "${card.term}", señalando una dificultad lógica insuperable.`,
  },
  {
    targetTerms: ['desahuciado'],
    triggers: [/\b(sin\s+esperanza|condenado\s+al\s+fracaso|desamparado)\b/i],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Emplea "${card.term}" con toda su gravedad trágica unamuniana para denotar irremediabilidad.`,
  },
  {
    targetTerms: ['acontecer'],
    triggers: [/\b(suceder|pasar|ocurrir\s+en\s+la\s+historia)\b/i],
    replacementPhrase: (_m, card) => card.term,
    rationale: (card) =>
      `Sustituye el verbo neutro por "${card.term}", dotando al enunciado de solemnidad historiográfica.`,
  },
];

function prioritizeCandidateCards(
  cards: CardWithSrs[],
  targetLang: 'en' | 'es',
  focusRoot?: string
): CardWithSrs[] {
  const langFiltered = cards.filter((c) => (c.language || 'en') === targetLang);
  const pool = langFiltered.length > 0 ? langFiltered : cards;

  const rootNeedle = focusRoot
    ? normalizeDiacritics(focusRoot).replace(/^[-*\s]+|[-*\s]+$/g, '')
    : '';

  return [...pool].sort((a, b) => {
    if (rootNeedle) {
      const aMatchesRoot = a.etymology?.roots?.some(
        (r) =>
          normalizeDiacritics(r.morpheme).includes(rootNeedle) ||
          normalizeDiacritics(r.meaning).includes(rootNeedle)
      );
      const bMatchesRoot = b.etymology?.roots?.some(
        (r) =>
          normalizeDiacritics(r.morpheme).includes(rootNeedle) ||
          normalizeDiacritics(r.meaning).includes(rootNeedle)
      );
      if (Boolean(aMatchesRoot) !== Boolean(bMatchesRoot)) {
        return aMatchesRoot ? -1 : 1;
      }
    }

    // Prioritize active learning / review cards (state > 0) and earlier due dates
    const aActive = (a.srs?.state ?? 0) > 0 ? 1 : 0;
    const bActive = (b.srs?.state ?? 0) > 0 ? 1 : 0;
    if (aActive !== bActive) return bActive - aActive;

    const aDue = a.srs?.due ? new Date(a.srs.due).getTime() : Number.MAX_SAFE_INTEGER;
    const bDue = b.srs?.due ? new Date(b.srs.due).getTime() : Number.MAX_SAFE_INTEGER;
    return aDue - bDue;
  });
}

function buildSynthesizedClause(
  card: CardWithSrs,
  lang: 'en' | 'es'
): { fragment: string; replacement: string; rationale: string } {
  const pos = (card.part_of_speech || 'noun').toLowerCase();
  const collocation = card.collocations?.[0] || card.term;

  if (lang === 'es') {
    if (pos.includes('adj')) {
      return {
        fragment: 'tono expositivo inicial',
        replacement: `con un matiz ${card.term} (${collocation})`,
        rationale: `Integra el adjetivo culto "${card.term}" (${card.primary_definition}) para enriquecer la precisión descriptiva del borrador.`,
      };
    }
    if (pos.includes('verb')) {
      return {
        fragment: 'desarrollo de la acción',
        replacement: `en cuyo horizonte viene a ${card.term}`,
        rationale: `Incorpora el verbo de alto registro "${card.term}" (${card.primary_definition}) para solemnizar el ritmo sintáctico.`,
      };
    }
    return {
      fragment: 'conclusión implícita del pasaje',
      replacement: `revelando así la profunda dimensión de ${collocation}`,
      rationale: `Articula el sustantivo "${card.term}" (${card.primary_definition}) como eje conceptual del argumento.`,
    };
  }

  if (pos.includes('adj')) {
    return {
      fragment: 'general analytical framing',
      replacement: `guided by a ${collocation}`,
      rationale: `Woven "${card.term}" (${card.primary_definition}) into the clause to sharpen analytical precision.`,
    };
  }
  if (pos.includes('verb')) {
    return {
      fragment: 'descriptive transition',
      replacement: `seeking to ${card.term} the underlying premise`,
      rationale: `Deployed the high-register verb "${card.term}" (${card.primary_definition}) to heighten rhetorical agency.`,
    };
  }
  return {
    fragment: 'conceptual conclusion',
    replacement: `illuminating the deeper ${collocation} at stake`,
    rationale: `Anchored the argument in "${card.term}" (${card.primary_definition}), elevating the prose from observation to critique.`,
  };
}

/**
 * Deterministic ACT-05 Prose Polisher fallback for offline reliability and fast unit tests.
 */
export function polishUserProseFallback(options: {
  draft: string;
  cards: CardWithSrs[];
  language?: 'en' | 'es';
  focusRoot?: string;
  maxSuggestions?: number;
}): ProsePolishResult {
  const originalDraft = (options.draft || '').trim();
  const detectedLanguage: 'en' | 'es' =
    options.language === 'en' || options.language === 'es'
      ? options.language
      : detectLanguage(originalDraft);

  const maxSuggestions = Math.max(1, Math.min(options.maxSuggestions ?? 3, 4));
  const prioritizedCards = prioritizeCandidateCards(
    options.cards || [],
    detectedLanguage,
    options.focusRoot
  );

  if (!originalDraft || prioritizedCards.length === 0) {
    return {
      originalDraft,
      elevatedDraft: originalDraft,
      registerDetected:
        detectedLanguage === 'es'
          ? 'Borrador coloquial / Ensayo en ciernes'
          : 'Conversational / Preliminary Draft',
      editorialSummary:
        detectedLanguage === 'es'
          ? 'No se encontraron tarjetas léxicas disponibles para sugerir sustituciones estilísticas.'
          : 'No lexicon cards were available to generate targeted stylistic substitutions.',
      suggestions: [],
      detectedLanguage,
      mode: 'heuristic',
    };
  }

  const rules =
    detectedLanguage === 'es' ? SPANISH_HEURISTIC_RULES : ENGLISH_HEURISTIC_RULES;

  let elevatedDraft = originalDraft;
  const suggestions: ProsePolishSuggestion[] = [];
  const usedCardIds = new Set<string>();

  // Step 1: Check explicit phrase-to-lexicon trigger rules against available cards
  for (const rule of rules) {
    if (suggestions.length >= maxSuggestions) break;

    const matchingCard = prioritizedCards.find(
      (c) =>
        !usedCardIds.has(c.id) &&
        rule.targetTerms.some(
          (t) => normalizeDiacritics(c.term) === normalizeDiacritics(t)
        )
    );
    if (!matchingCard) continue;

    for (const trigger of rule.triggers) {
      const match = elevatedDraft.match(trigger);
      if (match && match[0]) {
        const originalFragment = match[0];
        const elevatedReplacement = rule.replacementPhrase(
          originalFragment,
          matchingCard
        );
        elevatedDraft = elevatedDraft.replace(trigger, elevatedReplacement);
        usedCardIds.add(matchingCard.id);
        suggestions.push({
          cardId: matchingCard.id,
          term: matchingCard.term,
          language: (matchingCard.language || detectedLanguage) as 'en' | 'es',
          part_of_speech: matchingCard.part_of_speech,
          originalFragment,
          elevatedReplacement,
          rationale: rule.rationale(matchingCard),
          primary_definition: matchingCard.primary_definition,
        });
        break;
      }
    }
  }

  // Step 2: Ensure at least 1-3 suggestions by weaving top prioritized lexicon cards
  const targetCount = Math.min(
    maxSuggestions,
    Math.max(2, suggestions.length),
    prioritizedCards.length
  );

  const appendedPhrases: string[] = [];
  for (const card of prioritizedCards) {
    if (suggestions.length >= targetCount) break;
    if (usedCardIds.has(card.id)) continue;

    // Skip if term already appears verbatim in the draft
    const normDraft = normalizeDiacritics(elevatedDraft);
    const normTerm = normalizeDiacritics(card.term);
    if (normDraft.includes(normTerm)) {
      usedCardIds.add(card.id);
      suggestions.push({
        cardId: card.id,
        term: card.term,
        language: (card.language || detectedLanguage) as 'en' | 'es',
        part_of_speech: card.part_of_speech,
        originalFragment: card.term,
        elevatedReplacement: card.collocations?.[0] || card.term,
        rationale:
          detectedLanguage === 'es'
            ? `Refuerza el empleo ya presente de "${card.term}" mediante su colocación culta "${card.collocations?.[0] || card.term}".`
            : `Reinforces your deployment of "${card.term}" through its high-register collocation "${card.collocations?.[0] || card.term}".`,
        primary_definition: card.primary_definition,
      });
      continue;
    }

    const synth = buildSynthesizedClause(card, detectedLanguage);
    usedCardIds.add(card.id);
    appendedPhrases.push(synth.replacement);
    suggestions.push({
      cardId: card.id,
      term: card.term,
      language: (card.language || detectedLanguage) as 'en' | 'es',
      part_of_speech: card.part_of_speech,
      originalFragment: synth.fragment,
      elevatedReplacement: synth.replacement,
      rationale: synth.rationale,
      primary_definition: card.primary_definition,
    });
  }

  if (appendedPhrases.length > 0) {
    const baseClean = elevatedDraft.replace(/[.!?]+$/, '').trim();
    const capitalizedBase =
      baseClean.charAt(0).toUpperCase() + baseClean.slice(1);
    const connector = detectedLanguage === 'es' ? ', ' : ', ';
    elevatedDraft = `${capitalizedBase}${connector}${appendedPhrases.join(
      detectedLanguage === 'es' ? ' y ' : ' while '
    )}.`;
  } else {
    const hasTerminal = /[.!?]$/.test(elevatedDraft);
    elevatedDraft =
      elevatedDraft.charAt(0).toUpperCase() +
      elevatedDraft.slice(1) +
      (hasTerminal ? '' : '.');
  }

  const termsJoined = suggestions.map((s) => `"${s.term}"`).join(', ');

  return {
    originalDraft,
    elevatedDraft,
    registerDetected:
      detectedLanguage === 'es'
        ? 'Borrador discursivo → Prosa ensayística culta'
        : 'Conversational Draft → High-Register Critical Prose',
    editorialSummary:
      detectedLanguage === 'es'
        ? `Se ha elevado el registro estilístico integrando ${suggestions.length} término(s) de su léxico personal (${termsJoined}) para dotar al pasaje de mayor densidad conceptual y rigor filológico.`
        : `Elevated syntactic cadence and lexical precision by weaving ${suggestions.length} active lexicon term(s) (${termsJoined}) into your argument.`,
    suggestions,
    detectedLanguage,
    mode: 'heuristic',
  };
}

/**
 * Polishes user prose via Gemini (when configured) with automatic fallback to deterministic heuristics.
 */
export async function polishUserProse(
  options: PolishProseOptions
): Promise<ProsePolishResult> {
  const originalDraft = (options.draft || '').trim();
  const detectedLanguage: 'en' | 'es' =
    options.language === 'en' || options.language === 'es'
      ? options.language
      : detectLanguage(originalDraft);

  const maxSuggestions = Math.max(1, Math.min(options.maxSuggestions ?? 3, 4));

  if (!originalDraft || !options.cards || options.cards.length === 0) {
    return polishUserProseFallback({
      ...options,
      language: detectedLanguage,
      maxSuggestions,
    });
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return polishUserProseFallback({
      ...options,
      language: detectedLanguage,
      maxSuggestions,
    });
  }

  const candidateCards = prioritizeCandidateCards(
    options.cards,
    detectedLanguage,
    options.focusRoot
  ).slice(0, 30);

  const lexiconGlossary = candidateCards
    .map(
      (c) =>
        `- id: "${c.id}" | term: "${c.term}" (${c.part_of_speech}): ${c.primary_definition}${
          c.nuance_note ? ` [Nuance: ${c.nuance_note}]` : ''
        }`
    )
    .join('\n');

  const prompt =
    detectedLanguage === 'es'
      ? `Eres un editor literario y filólogo de la Real Academia Española. El usuario ha escrito el siguiente borrador en español y desea elevar su registro estilístico reemplazando frases genéricas o coloquiales por términos precisos de su léxico personal.

Borrador del usuario:
"""
${originalDraft}
"""

Términos candidatos del léxico personal del usuario (selecciona entre 2 y ${maxSuggestions} términos que encajen con naturalidad y rigor semántico):
${lexiconGlossary}

Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta estructura exacta:
{
  "elevatedDraft": "Versión reescrita y pulida del borrador que integra con maestría los términos seleccionados.",
  "registerDetected": "Descripción breve de la evolución del registro (ej. 'Coloquial -> Prosa ensayística culta')",
  "editorialSummary": "Resumen crítico de 1-2 oraciones explicando cómo las sustituciones enriquecen la precisión conceptual.",
  "suggestions": [
    {
      "cardId": "ID exacto de la tarjeta seleccionada",
      "term": "Término exacto de la tarjeta",
      "originalFragment": "Fragmento o idea del borrador original que se sustituye o amplía",
      "elevatedReplacement": "Frase o cláusula elevada empleada en elevatedDraft",
      "rationale": "Explicación estilística y semántica de por qué este término eleva el pasaje"
    }
  ]
}`
      : `You are an exacting literary editor for The New Yorker and London Review of Books. The user has written a prose draft and wants to elevate its stylistic register by replacing generic or imprecise phrasing with high-precision terms drawn directly from their personal lexicon.

User Draft:
"""
${originalDraft}
"""

Candidate Lexicon Terms (select 2 to ${maxSuggestions} terms that fit organically and intellectually):
${lexiconGlossary}

Return ONLY raw JSON matching this exact structure:
{
  "elevatedDraft": "Polished, high-register revision of the user's draft weaving the chosen lexicon terms naturally.",
  "registerDetected": "Brief register assessment (e.g. 'Informal Analytic -> Scholarly Literary Prose')",
  "editorialSummary": "1-2 sentence editorial critique explaining how the substitutions sharpen conceptual precision.",
  "suggestions": [
    {
      "cardId": "Exact id of the selected lexicon card",
      "term": "Exact term from the lexicon card",
      "originalFragment": "Specific phrase or clause from the original draft being elevated",
      "elevatedReplacement": "The elevated phrase or clause deployed in elevatedDraft",
      "rationale": "Concise explanation of why this lexicon term sharpens nuance and register"
    }
  ]
}`;

  const candidateModels = [
    process.env.GEMINI_MODEL,
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ].filter(Boolean) as string[];
  const modelsToTry = Array.from(new Set(candidateModels));

  for (const model of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7500);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.25,
          },
        }),
      });
      clearTimeout(timeout);

      if (!response.ok) continue;
      const json = await response.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;

      const parsed = extractJsonFromText(text) as any;
      if (
        !parsed ||
        typeof parsed.elevatedDraft !== 'string' ||
        !Array.isArray(parsed.suggestions) ||
        parsed.suggestions.length === 0
      ) {
        continue;
      }

      const mappedSuggestions: ProsePolishSuggestion[] = [];
      for (const item of parsed.suggestions) {
        const matchedCard =
          options.cards.find((c) => c.id === item.cardId) ||
          options.cards.find(
            (c) =>
              normalizeDiacritics(c.term) ===
              normalizeDiacritics(String(item.term || ''))
          );
        if (!matchedCard) continue;

        mappedSuggestions.push({
          cardId: matchedCard.id,
          term: matchedCard.term,
          language: (matchedCard.language || detectedLanguage) as 'en' | 'es',
          part_of_speech: matchedCard.part_of_speech,
          originalFragment: String(item.originalFragment || matchedCard.term),
          elevatedReplacement: String(
            item.elevatedReplacement || matchedCard.term
          ),
          rationale: String(
            item.rationale || matchedCard.nuance_note || matchedCard.primary_definition
          ),
          primary_definition: matchedCard.primary_definition,
        });
      }

      if (mappedSuggestions.length === 0) continue;

      return {
        originalDraft,
        elevatedDraft: parsed.elevatedDraft.trim(),
        registerDetected: String(
          parsed.registerDetected || 'Scholarly / Literary Prose'
        ),
        editorialSummary: String(parsed.editorialSummary || ''),
        suggestions: mappedSuggestions.slice(0, maxSuggestions),
        detectedLanguage,
        mode: 'gemini',
      };
    } catch (err: any) {
      console.warn(
        `[Gemini Prose Polisher] Model ${model} failed:`,
        err?.message || err
      );
    }
  }

  return polishUserProseFallback({
    ...options,
    language: detectedLanguage,
    maxSuggestions,
  });
}
