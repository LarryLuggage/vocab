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

  describe('Spanish Sentence Validation (Subjuntivo, Ser vs Estar, Concordancia)', () => {
    it('passes a well-formed literary Spanish sentence deploying target word', async () => {
      const result = await validateProductionSentence(
        'añoranza',
        'La anciana marquesa sentía una profunda añoranza de su juventud en los salones vieneses.'
      );

      expect(result.evaluationStatus).toBe('pass');
      expect(result.feedback).toBeDefined();
      expect(result.registerDetected).toBeDefined();
      expect(ProductionEvaluationSchema.safeParse(result).success).toBe(true);
    });

    it('recognizes Spanish verb inflections (e.g. preterite "sobrecogió" for target "sobrecoger")', async () => {
      const result = await validateProductionSentence(
        'sobrecoger',
        'El silencio de la catedral gótica sobrecogió a todos los peregrinos.'
      );

      expect(result.evaluationStatus).toBe('pass');
      expect(result.feedback).toBeDefined();
    });

    it('rejects indicative verb when "ojalá" requires subjunctive mood', async () => {
      const result = await validateProductionSentence(
        'ojalá',
        'Ojalá llueve torrencialmente sobre los campos secos.'
      );

      expect(result.evaluationStatus).toBe('incorrect_usage');
      expect(result.feedback).toContain('subjuntivo');
      expect(result.revisedSentence).toContain('llueva');
    });

    it('passes when "ojalá" correctly triggers the subjunctive mood', async () => {
      const result = await validateProductionSentence(
        'ojalá',
        'Ojalá llueva torrencialmente sobre los campos secos de la meseta.'
      );

      expect(result.evaluationStatus).toBe('pass');
    });

    it('detects gender agreement discordance for Spanish feminine noun (un añoranza)', async () => {
      const result = await validateProductionSentence(
        'añoranza',
        'El escritor sintió un añoranza amarga por la tierra perdida.'
      );

      expect(result.evaluationStatus).toBe('incorrect_usage');
      expect(result.feedback).toContain('femenino');
      expect(result.revisedSentence).toContain('una añoranza');
    });

    it('flags ser vs estar mismatch for clinical condition with "desahuciado"', async () => {
      const result = await validateProductionSentence(
        'desahuciado',
        'El enfermo es desahuciado por la gravedad de su condición terminal.'
      );

      expect(result.evaluationStatus).toBe('awkward');
      expect(result.feedback).toContain('estar');
      expect(result.revisedSentence).toContain('está desahuciado');
    });
  });
});
