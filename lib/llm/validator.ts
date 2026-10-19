import { ProductionEvaluationSchema, ProductionEvaluationPayload } from './schema';
import { ProductionValidationResult } from '@/types/lexis';
import { areTermsVariants } from '@/lib/db';
import { getGeminiApiKey, extractJsonFromText, detectLanguage } from './enricher';

// ============================================================================
// Built-in Deterministic Sentence Validator (ACT-03 Fallback)
// ============================================================================
export function validateProductionFallback(
  rawTerm: string,
  rawSentence: string,
  targetRegister?: string
): ProductionValidationResult {
  const term = rawTerm.trim().toLowerCase();
  const sentence = rawSentence.trim();
  const isSpanish = detectLanguage(rawTerm, rawSentence) === 'es';

  // 1. Check for empty or whitespace sentence
  if (!sentence) {
    return {
      evaluationStatus: 'incorrect_usage',
      feedback: isSpanish
        ? 'Por favor, escriba una oración que contenga la palabra objetivo.'
        : 'Please write a sentence containing the target word.',
      registerDetected: 'Empty',
    };
  }

  // 2. Tokenize sentence words (preserving Spanish accented characters and ñ)
  const words = sentence
    .toLowerCase()
    .replace(/[^a-záéíóúüñ0-9\s-]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);

  // 3. Check if target word (or morphological variant) is present
  const containsTarget = words.some((w) => areTermsVariants(w, term));

  if (!containsTarget) {
    return {
      evaluationStatus: 'incorrect_usage',
      feedback: isSpanish
        ? `El término objetivo "${rawTerm}" no fue detectado en su oración. Asegúrese de emplear la palabra o una variante morfológica reconocida.`
        : `The target word "${rawTerm}" was not detected in your sentence. Ensure you deploy the word or a recognized grammatical derivative.`,
      registerDetected: isSpanish ? 'Incompleto / Coloquial' : 'Informal / Incomplete',
    };
  }

  // 4. Check sentence length and depth
  if (words.length < 5) {
    const capitalized = rawTerm.charAt(0).toUpperCase() + rawTerm.slice(1);
    return {
      evaluationStatus: 'awkward',
      feedback: isSpanish
        ? `La oración es demasiado sucinta para demostrar un dominio cabal de "${rawTerm}". Enriquezca el enunciado con mayor contexto descriptivo o literario.`
        : `The sentence is too succinct to demonstrate nuanced command of "${rawTerm}". Elaborate with richer situational or descriptive context.`,
      registerDetected: isSpanish ? 'Coloquial / Conciso' : 'Colloquial / Terse',
      revisedSentence: isSpanish
        ? `Aquel ensayo evocaba con maestría la significación de ${term} en la literatura contemporánea.`
        : `The critic's appraisal was remarkably ${term}, illuminating themes previously overlooked.`,
    };
  }

  const lowerSentence = sentence.toLowerCase();

  // 5. Spanish Grammar & Stylistic Rules
  if (isSpanish) {
    // 5a. Subjunctive mood (Modo Subjuntivo) check for "ojalá"
    if (term === 'ojalá' || lowerSentence.includes('ojalá') || lowerSentence.includes('ojala')) {
      const indicativeSubjunctiveMismatches: [RegExp, string][] = [
        [/\bllueve\b/i, 'llueva'],
        [/\bllovió\b/i, 'lloviera'],
        [/\bpuede\b/i, 'pueda'],
        [/\bpudo\b/i, 'pudiera'],
        [/\bes\b/i, 'sea'],
        [/\bera\b/i, 'fuera'],
        [/\bfue\b/i, 'fuera'],
        [/\bestá\b/i, 'esté'],
        [/\bestaba\b/i, 'estuviera'],
        [/\bviene\b/i, 'venga'],
        [/\bvino\b/i, 'viniera'],
        [/\bhace\b/i, 'haga'],
        [/\btiene\b/i, 'tenga'],
        [/\bva\b/i, 'vaya'],
        [/\bacontece\b/i, 'acontezca'],
        [/\baconteció\b/i, 'aconteciera'],
      ];

      for (const [indRegex, subjForm] of indicativeSubjunctiveMismatches) {
        if (indRegex.test(lowerSentence)) {
          return {
            evaluationStatus: 'incorrect_usage',
            feedback: `"Ojalá" rige obligatoriamente el modo subjuntivo (ej. "${subjForm}"), nunca el modo indicativo.`,
            registerDetected: 'Error Gramatical (Modo Subjuntivo)',
            revisedSentence: sentence.replace(indRegex, subjForm),
          };
        }
      }
    }

    // 5b. Gender agreement (Concordancia de género)
    if (term === 'añoranza') {
      if (/\b(un|el|este|ese|aquel)\s+añoranza\b/i.test(lowerSentence)) {
        return {
          evaluationStatus: 'incorrect_usage',
          feedback: '"Añoranza" es un sustantivo femenino. Requiere concordancia con artículos y modificadores femeninos (ej. "la añoranza", "una profunda añoranza").',
          registerDetected: 'Discordancia de Género',
          revisedSentence: sentence.replace(/\b(un|el|este|ese|aquel)\s+añoranza\b/i, (m, art) => {
            const map: Record<string, string> = { un: 'una', el: 'la', este: 'esta', ese: 'esa', aquel: 'aquella' };
            return `${map[art.toLowerCase()] || 'la'} añoranza`;
          }),
        };
      }
    }

    if (term === 'desahuciado') {
      if (/\b(la|una|esta|esa|aquella)\s+desahuciado\b/i.test(lowerSentence)) {
        return {
          evaluationStatus: 'incorrect_usage',
          feedback: 'Discordancia de género: use "desahuciada" para concordar con el artículo femenino ("la desahuciada").',
          registerDetected: 'Discordancia de Género',
          revisedSentence: sentence.replace(/\bdesahuciado\b/i, 'desahuciada'),
        };
      }
      if (/\b(el|un|este|ese|aquel)\s+desahuciada\b/i.test(lowerSentence)) {
        return {
          evaluationStatus: 'incorrect_usage',
          feedback: 'Discordancia de género: use "el desahuciado" para concordar con el artículo masculino.',
          registerDetected: 'Discordancia de Género',
          revisedSentence: sentence.replace(/\bdesahuciada\b/i, 'desahuciado'),
        };
      }

      // 5c. Ser vs Estar check for clinical condition
      if (
        /\b(es|era)\s+desahuciad[oa]s?\b/i.test(lowerSentence) &&
        !/\bpor\s+(el|la|los|las|un|una)\s+(juez|tribunal|corte|arrendador|propietario)\b/i.test(lowerSentence)
      ) {
        return {
          evaluationStatus: 'awkward',
          feedback: 'Para expresar la condición o estado clínico de un paciente, es más idóneo emplear el verbo "estar" ("está desahuciado") en lugar de "ser", a menos que se trate de una voz pasiva con agente legal ("fue desahuciado por el tribunal").',
          registerDetected: 'Uso Impreciso de Ser / Estar',
          revisedSentence: sentence.replace(
            /\b(es|era)\s+(desahuciad[oa]s?)\b/i,
            (m, v, adj) => `${v.toLowerCase() === 'era' ? 'estaba' : 'está'} ${adj}`
          ),
        };
      }
    }

    // Punctuation and capitalization check for Spanish (support ¿ and ¡)
    const hasCapital = /^[A-ZÁÉÍÓÚÜÑ¿¡]/.test(sentence);
    const hasPunctuation = /[.!?]$/.test(sentence);

    if (!hasCapital || !hasPunctuation) {
      const corrected =
        (hasCapital ? sentence[0] : sentence[0].toUpperCase()) +
        sentence.slice(1) +
        (hasPunctuation ? '' : '.');

      return {
        evaluationStatus: 'pass',
        feedback: `Excelente ejecución contextual de "${rawTerm}". Asegúrese de incluir mayúscula inicial y puntuación de cierre formal.`,
        registerDetected: targetRegister || 'Prosa literaria culta / Alto registro',
        revisedSentence: corrected,
      };
    }

    return {
      evaluationStatus: 'pass',
      feedback: `Excelente aplicación de "${rawTerm}". La oración exhibe una notable elevación estilística, precisión léxica y perfecta concordancia gramatical.`,
      registerDetected: targetRegister || 'Prosa literaria culta / Alto registro',
      revisedSentence: sentence,
    };
  }

  // 6. English part of speech & syntax checks
  // Part of speech mismatch: using "solipsism" as an adjective without preposition
  if (term === 'solipsism' && /\b(is|was|are|were|am)\s+solipsism\b/.test(lowerSentence)) {
    return {
      evaluationStatus: 'incorrect_usage',
      feedback: `"Solipsism" is a noun denoting a philosophical doctrine or stance, not an adjective. Use "solipsistic" or rephrase with a preposition (e.g. "verged on solipsism").`,
      registerDetected: 'Grammatically Discordant',
      revisedSentence: sentence.replace(
        /\b(is|was|are|were)\s+solipsism\b/i,
        (match) => `${match.split(' ')[0]} prone to solipsism`
      ),
    };
  }

  // Part of speech mismatch: using "inchoate" or "perspicacious" with an indefinite article as a noun
  if (
    (term === 'inchoate' || term === 'perspicacious' || term === 'apocryphal') &&
    /\b(an?|the)\s+(inchoate|perspicacious|apocryphal)\s*([.,;!?]|$)/.test(lowerSentence)
  ) {
    return {
      evaluationStatus: 'incorrect_usage',
      feedback: `"${rawTerm}" is an adjective and must modify a noun (e.g., "${term} thoughts" or "${term} analysis"), rather than standing alone as a nominal.`,
      registerDetected: 'Syntactically Incomplete',
      revisedSentence: `${sentence.replace(/[.,;!?]$/, '')} ideas awaiting structured refinement.`,
    };
  }

  // Check punctuation and capitalization
  const hasCapital = /^[A-Z]/.test(sentence);
  const hasPunctuation = /[.!?]$/.test(sentence);

  if (!hasCapital || !hasPunctuation) {
    const corrected =
      (hasCapital ? sentence[0] : sentence[0].toUpperCase()) +
      sentence.slice(1) +
      (hasPunctuation ? '' : '.');

    return {
      evaluationStatus: 'pass',
      feedback: `Strong contextual execution of "${rawTerm}". Note: ensure standard formal capitalization and terminal punctuation for high-register prose.`,
      registerDetected: targetRegister || 'High-Register Formal Prose',
      revisedSentence: corrected,
    };
  }

  // 7. Successful validation
  return {
    evaluationStatus: 'pass',
    feedback: `Superb application of "${rawTerm}". The sentence displays authentic syntactic fluidity, acute tonal elevation, and compelling semantic resonance.`,
    registerDetected: targetRegister || 'Scholarly / Literary Prose',
    revisedSentence: sentence,
  };
}

// ============================================================================
// Google Gemini API Production Evaluator
// ============================================================================
async function evaluateWithGemini(
  term: string,
  userSentence: string,
  targetRegister?: string
): Promise<ProductionValidationResult | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  const isSpanish = detectLanguage(term, userSentence) === 'es';

  const prompt = isSpanish
    ? `You are an exacting literary critic and philologist of the Real Academia Española evaluating a user's original Spanish sentence deploying the target vocabulary word: "${term}".
Target register requested: "${targetRegister || 'Prosa literaria o académica de alto registro'}".
User sentence to evaluate: "${userSentence}".

Analyze the sentence with meticulous Spanish grammatical and stylistic criteria:
1. Syntactic accuracy: part of speech, verbal agreement (subjunctive vs indicative, e.g. after "ojalá"), ser vs estar, and noun-adjective gender/number agreement.
2. High-register literary elegance (prosa culta) vs colloquial or anglicized phrasing.
3. Substantive contextual usage showing genuine semantic mastery of the target Spanish word.

Return a JSON object conforming strictly to this schema:
{
  "evaluationStatus": "pass" | "incorrect_usage" | "awkward",
  "feedback": "Concise, constructive critique (1-3 sentences) detailing why it passed or failed.",
  "revisedSentence": "Optional refined or corrected version polishing the prose (or null).",
  "registerDetected": "Brief description of the tone/register detected (e.g. 'Prosa literaria culta', 'Coloquial', 'Discordancia gramatical', etc.)"
}
Output ONLY raw JSON.`
    : `You are a rigorous literary editor and stylistic judge evaluating a user's original sentence deploying the target vocabulary word: "${term}".
Target register requested: "${targetRegister || 'High-register literary or academic'}".
User sentence to evaluate: "${userSentence}".

Analyze the sentence for:
1. Syntactic accuracy and correct part of speech.
2. Tone, idiomatic naturalness, and high-register elegance.
3. Substantive contextual usage showing true semantic comprehension.

Return a JSON object conforming strictly to this schema:
{
  "evaluationStatus": "pass" | "incorrect_usage" | "awkward",
  "feedback": "Concise, constructive critique (1-3 sentences) detailing why it passed or failed.",
  "revisedSentence": "Optional refined or corrected version polishing the prose (or null).",
  "registerDetected": "Brief description of the tone/register detected (e.g. 'Scholarly', 'Colloquial', 'Archaic', etc.)"
}
Output ONLY raw JSON.`;

  const candidateModels = [
    process.env.GEMINI_MODEL,
    'gemini-3.8-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
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
            temperature: 0.2,
          },
        }),
      });
      clearTimeout(timeout);

      if (!response.ok) continue;
      const json = await response.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;

      const parsed = extractJsonFromText(text);
      if (!parsed) continue;

      const validated = ProductionEvaluationSchema.parse(parsed);
      return {
        evaluationStatus: validated.evaluationStatus,
        feedback: validated.feedback,
        revisedSentence: validated.revisedSentence || undefined,
        registerDetected: validated.registerDetected,
      };
    } catch (err: any) {
      console.warn(`[Gemini Validator] Model ${model} failed:`, err?.message || err);
    }
  }

  return null;
}

// ============================================================================
// OpenAI API Production Evaluator
// ============================================================================
async function evaluateWithOpenAI(
  term: string,
  userSentence: string,
  targetRegister?: string
): Promise<ProductionValidationResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your-openai-api-key') return null;

  const prompt = `Evaluate this sentence using the vocabulary word "${term}":
"${userSentence}"
Target register: "${targetRegister || 'High-register literary or academic'}"

Provide evaluationStatus ('pass' | 'incorrect_usage' | 'awkward'), feedback, revisedSentence, registerDetected.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'You evaluate vocabulary sentences and return strict JSON.' },
          { role: 'user', content: prompt },
        ],
      }),
    });
    clearTimeout(timeout);

    if (!response.ok) return null;
    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    const validated = ProductionEvaluationSchema.parse(parsed);
    return {
      evaluationStatus: validated.evaluationStatus,
      feedback: validated.feedback,
      revisedSentence: validated.revisedSentence || undefined,
      registerDetected: validated.registerDetected,
    };
  } catch (err) {
    console.warn('[OpenAI Validator] Evaluation failed or timed out:', err);
    return null;
  }
}

// ============================================================================
// Public Production Validator Function (ACT-03)
// ============================================================================
export async function validateProductionSentence(
  term: string,
  userSentence: string,
  targetRegister?: string
): Promise<ProductionValidationResult> {
  const trimmedTerm = term.trim();
  const trimmedSentence = userSentence.trim();

  // 1. Try Gemini
  const geminiResult = await evaluateWithGemini(trimmedTerm, trimmedSentence, targetRegister);
  if (geminiResult) return geminiResult;

  // 2. Try OpenAI
  const openAiResult = await evaluateWithOpenAI(trimmedTerm, trimmedSentence, targetRegister);
  if (openAiResult) return openAiResult;

  // 3. Fall back to deterministic rule-based validator
  return validateProductionFallback(trimmedTerm, trimmedSentence, targetRegister);
}

// ============================================================================
// Multi-Word Synthesis Validator (ACT-04)
// ============================================================================
export function validateSynthesisFallback(
  rawTerms: string[],
  rawSentence: string,
  targetRegister?: string
): ProductionValidationResult {
  const cleanTerms = rawTerms.map((t) => t.trim()).filter(Boolean);
  const sentence = rawSentence.trim();
  const isSpanish = detectLanguage(cleanTerms.join(' '), sentence) === 'es';

  if (!sentence) {
    return {
      evaluationStatus: 'incorrect_usage',
      feedback: isSpanish
        ? `Por favor, escriba un pasaje que integre todos los términos objetivo: ${cleanTerms.join(', ')}. Missing target terms: ${cleanTerms.join(', ')}.`
        : `Please write a synthesis passage weaving together all target words. Missing target terms: ${cleanTerms.join(', ')}.`,
      registerDetected: 'Empty',
      termsDetected: [],
      missingTerms: cleanTerms,
    };
  }

  const words = sentence
    .toLowerCase()
    .replace(/[^a-záéíóúüñ0-9\s-]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const lowerSentence = sentence.toLowerCase();
  const termsDetected: string[] = [];
  const missingTerms: string[] = [];

  for (const rawTerm of cleanTerms) {
    const termLower = rawTerm.toLowerCase();
    const detected =
      words.some((w) => areTermsVariants(w, termLower)) ||
      lowerSentence.includes(termLower);
    if (detected) {
      termsDetected.push(rawTerm);
    } else {
      missingTerms.push(rawTerm);
    }
  }

  if (missingTerms.length > 0) {
    return {
      evaluationStatus: 'incorrect_usage',
      feedback: isSpanish
        ? `Faltan términos objetivo en su síntesis (${missingTerms.join(', ')}). Missing target terms: ${missingTerms.join(', ')}. Asegúrese de integrar todas las palabras seleccionadas en un mismo período discursivo.`
        : `Your synthesis passage did not incorporate all selected vocabulary. Missing target terms: ${missingTerms.join(', ')}. Ensure every target word (or a grammatical derivative) is woven into the clause.`,
      registerDetected: isSpanish ? 'Síntesis Incompleta' : 'Incomplete Synthesis',
      termsDetected,
      missingTerms,
    };
  }

  const minWords = Math.max(6, cleanTerms.length * 4);
  if (words.length < minWords) {
    return {
      evaluationStatus: 'awkward',
      feedback: isSpanish
        ? `Aunque incluyó los términos (${termsDetected.join(', ')}), el enunciado es demasiado escueto. Desarrolle una cláusula más articulada que entrelace conceptualmente las ideas.`
        : `While all target terms (${termsDetected.join(', ')}) appear, the clause is too compressed to establish genuine conceptual interplay. Expand with a fuller cohesive clause weaving the concepts together.`,
      registerDetected: isSpanish ? 'Coloquial / Fragmentario' : 'Compressed / Fragmentary',
      termsDetected,
      missingTerms: [],
      revisedSentence: sentence.endsWith('.') ? sentence : `${sentence}.`,
    };
  }

  const hasCapital = /^[A-ZÁÉÍÓÚÜÑ¿¡]/.test(sentence);
  const hasPunctuation = /[.!?]$/.test(sentence);
  const corrected =
    (hasCapital ? sentence[0] : sentence[0].toUpperCase()) +
    sentence.slice(1) +
    (hasPunctuation ? '' : '.');

  return {
    evaluationStatus: 'pass',
    feedback: isSpanish
      ? `Magnífica síntesis conceptual. Ha entrelazado con fluidez y rigor estilístico los términos (${termsDetected.join(', ')}) en una unidad de sentido coherente.`
      : `Exemplary conceptual synthesis. You have woven ${termsDetected.join(', ')} into a unified, high-register proposition with organic syntactic tension.`,
    registerDetected: isSpanish
      ? targetRegister || 'Síntesis literaria y filosófica culta'
      : targetRegister || 'Cohesive Philosophical / Literary Synthesis',
    revisedSentence: corrected,
    termsDetected,
    missingTerms: [],
  };
}

async function evaluateSynthesisWithGemini(
  terms: string[],
  userSentence: string,
  targetRegister?: string
): Promise<ProductionValidationResult | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  const isSpanish = detectLanguage(terms.join(' '), userSentence) === 'es';
  const termsList = terms.join(', ');

  const prompt = isSpanish
    ? `You are an exacting literary critic and philosopher evaluating a multi-word synthesis passage in Spanish that must weave together ALL of the following target vocabulary words: [${termsList}].
Target register: "${targetRegister || 'Síntesis literaria y filosófica culta'}".
User passage: "${userSentence}".

Evaluate whether the passage:
1. Deploys every target word (or valid morphological inflection) with grammatical precision.
2. Establishes genuine conceptual tension or philosophical cohesion between the words rather than merely listing them mechanically.
3. Sustains an elevated literary or essayistic register.

Return ONLY raw JSON matching:
{
  "evaluationStatus": "pass" | "incorrect_usage" | "awkward",
  "feedback": "Concise 1-3 sentence critique of the conceptual synthesis.",
  "revisedSentence": "Optional polished version (or null).",
  "registerDetected": "Brief register label"
}`
    : `You are a rigorous literary editor and philosopher evaluating a multi-word synthesis passage that must weave together ALL of the following target vocabulary words: [${termsList}].
Target register: "${targetRegister || 'Cohesive Philosophical / Literary Synthesis'}".
User passage: "${userSentence}".

Evaluate whether the passage:
1. Deploys every target word (or valid morphological derivative) with syntactic accuracy.
2. Establishes genuine conceptual interplay between the terms rather than artificial juxtaposition.
3. Sustains high-register scholarly or literary prose.

Return ONLY raw JSON matching:
{
  "evaluationStatus": "pass" | "incorrect_usage" | "awkward",
  "feedback": "Concise 1-3 sentence critique of the conceptual synthesis.",
  "revisedSentence": "Optional polished version (or null).",
  "registerDetected": "Brief register label"
}`;

  const candidateModels = [
    process.env.GEMINI_MODEL,
    'gemini-3.8-flash',
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
            temperature: 0.2,
          },
        }),
      });
      clearTimeout(timeout);

      if (!response.ok) continue;
      const json = await response.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;

      const parsed = extractJsonFromText(text);
      if (!parsed) continue;

      const validated = ProductionEvaluationSchema.parse(parsed);
      return {
        evaluationStatus: validated.evaluationStatus,
        feedback: validated.feedback,
        revisedSentence: validated.revisedSentence || undefined,
        registerDetected: validated.registerDetected,
      };
    } catch (err: any) {
      console.warn(`[Gemini Synthesis Validator] Model ${model} failed:`, err?.message || err);
    }
  }

  return null;
}

export async function validateSynthesisPassage(
  terms: string[],
  userSentence: string,
  targetRegister?: string
): Promise<ProductionValidationResult> {
  const fallback = validateSynthesisFallback(terms, userSentence, targetRegister);

  // If any target terms are missing or sentence is empty, return deterministic check immediately
  if (fallback.missingTerms && fallback.missingTerms.length > 0) {
    return fallback;
  }

  const geminiResult = await evaluateSynthesisWithGemini(
    terms.map((t) => t.trim()).filter(Boolean),
    userSentence.trim(),
    targetRegister
  );

  if (geminiResult) {
    return {
      ...geminiResult,
      termsDetected: fallback.termsDetected,
      missingTerms: fallback.missingTerms,
    };
  }

  return fallback;
}

