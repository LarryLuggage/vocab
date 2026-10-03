import { describe, it, expect } from 'vitest';
import { ProductionEvaluationSchema } from '@/lib/llm/schema';
import { validateProductionSentence, validateProductionFallback } from '@/lib/llm/validator';

describe('Sentence Production Validator (ACT-03)', () => {
  it('passes a well-formed high-register sentence deploying target word', async () => {
    const result = await validateProductionSentence(
      'perspicacious',
      'The critic offered a perspicacious reading of the text that exposed its underlying contradictions.'
    );

    expect(result.evaluationStatus).toBe('pass');
    expect(result.feedback).toBeDefined();
    expect(result.registerDetected).toBeDefined();

    const parsed = ProductionEvaluationSchema.safeParse(result);
    expect(parsed.success).toBe(true);
  });

  it('rejects a sentence where target word is completely omitted', async () => {
    const result = await validateProductionSentence(
      'perspicacious',
      'The analyst explained the economic shifts clearly.'
    );

    expect(result.evaluationStatus).toBe('incorrect_usage');
    expect(result.feedback).toContain('was not detected');
  });

  it('flags an overly terse or under-developed sentence as awkward', async () => {
    const result = await validateProductionSentence('perspicacious', 'He is perspicacious.');

    expect(result.evaluationStatus).toBe('awkward');
    expect(result.revisedSentence).toBeDefined();
  });

  it('detects part of speech misuse (noun used as predicate adjective)', async () => {
    const result = await validateProductionSentence('solipsism', 'His worldview was solipsism and selfish.');

    expect(result.evaluationStatus).toBe('incorrect_usage');
    expect(result.feedback).toContain('noun');
  });

  it('recognizes grammatical morphological derivatives (e.g. adverb form of adjective)', async () => {
    const result = await validateProductionSentence(
      'perspicacious',
      'She perspicaciously discerned the subtle flaw in their methodology.'
    );

    expect(result.evaluationStatus).toBe('pass');
  });

  it('recommends punctuation and capitalization polish', async () => {
    const result = validateProductionFallback(
      'inchoate',
      'the council harbored inchoate plans for urban reform'
    );

    expect(result.evaluationStatus).toBe('pass');
    expect(result.revisedSentence?.endsWith('.')).toBe(true);
    expect(result.revisedSentence?.[0]).toBe('T');
  });
});
