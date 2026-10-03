import { ProductionEvaluationSchema, ProductionEvaluationPayload } from './schema';
import { ProductionValidationResult } from '@/types/lexis';
import { areTermsVariants } from '@/lib/db';

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

  // 1. Check for empty or whitespace sentence
  if (!sentence) {
    return {
      evaluationStatus: 'incorrect_usage',
      feedback: 'Please write a sentence containing the target word.',
      registerDetected: 'Empty',
    };
  }

  // 2. Tokenize sentence words
  const words = sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  // 3. Check if target word (or morphological variant) is present
  const containsTarget = words.some((w) => areTermsVariants(w, term));

  if (!containsTarget) {
    return {
      evaluationStatus: 'incorrect_usage',
      feedback: `The target word "${rawTerm}" was not detected in your sentence. Ensure you deploy the word or a recognized grammatical derivative.`,
      registerDetected: 'Informal / Incomplete',
    };
  }

  // 4. Check sentence length and depth
  if (words.length < 5) {
    const capitalized = rawTerm.charAt(0).toUpperCase() + rawTerm.slice(1);
    return {
      evaluationStatus: 'awkward',
      feedback: `The sentence is too succinct to demonstrate nuanced command of "${rawTerm}". Elaborate with richer situational or descriptive context.`,
      registerDetected: 'Colloquial / Terse',
      revisedSentence: `The critic's appraisal was remarkably ${term}, illuminating themes previously overlooked.`,
    };
  }

  // 5. Part of speech & syntax checks
  const lowerSentence = sentence.toLowerCase();

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

  // 6. Successful validation
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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key') return null;

  const prompt = `You are a rigorous literary editor and stylistic judge evaluating a user's original sentence deploying the target vocabulary word: "${term}".
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

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
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

    if (!response.ok) return null;
    const json = await response.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    const validated = ProductionEvaluationSchema.parse(parsed);
    return {
      evaluationStatus: validated.evaluationStatus,
      feedback: validated.feedback,
      revisedSentence: validated.revisedSentence || undefined,
      registerDetected: validated.registerDetected,
    };
  } catch (err) {
    console.warn('[Gemini Validator] Evaluation failed or timed out:', err);
    return null;
  }
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
