import { describe, it, expect } from 'vitest';
import {
  detectLanguage,
  normalizeDiacritics,
  isDiacriticMatch,
  formatGenderBadge,
} from '@/lib/language';

describe('Language Utilities', () => {
  describe('detectLanguage', () => {
    it('detects Spanish with accented characters and inverted punctuation', () => {
      expect(detectLanguage('desahuciado')).toBe('es');
      expect(detectLanguage('incómodo')).toBe('es');
      expect(detectLanguage('árbol')).toBe('es');
      expect(detectLanguage('¿Cómo estás?')).toBe('es');
      expect(detectLanguage('¡Qué maravilla!')).toBe('es');
      expect(detectLanguage('añoranza')).toBe('es');
    });

    it('detects Spanish with common grammatical words and context', () => {
      expect(detectLanguage('La soledad de los campos')).toBe('es');
      expect(detectLanguage('El desasosiego provocado por la crisis')).toBe('es');
      expect(detectLanguage('Un silencio lleno de incertidumbre')).toBe('es');
    });

    it('detects English terms and sentences', () => {
      expect(detectLanguage('perspicacious')).toBe('en');
      expect(detectLanguage('solipsism')).toBe('en');
      expect(detectLanguage('The quick brown fox jumps over the lazy dog')).toBe('en');
      expect(detectLanguage('Her prose was so pellucid that all abstraction vanished')).toBe('en');
    });
  });

  describe('normalizeDiacritics & isDiacriticMatch', () => {
    it('strips accents and normalizes case', () => {
      expect(normalizeDiacritics('Desahuciado')).toBe('desahuciado');
      expect(normalizeDiacritics('incómodo')).toBe('incomodo');
      expect(normalizeDiacritics('Árbol')).toBe('arbol');
      expect(normalizeDiacritics('niño')).toBe('nino');
    });

    it('matches user inputs with or without accents', () => {
      expect(isDiacriticMatch('desahuciado', 'desahuciado')).toBe(true);
      expect(isDiacriticMatch('incomodo', 'incómodo')).toBe(true);
      expect(isDiacriticMatch('incómodo', 'incomodo')).toBe(true);
      expect(isDiacriticMatch('arbol', 'árbol')).toBe(true);
      expect(isDiacriticMatch('nino', 'niño')).toBe(true);
      expect(isDiacriticMatch('diff', 'same')).toBe(false);
    });
  });

  describe('formatGenderBadge', () => {
    it('formats masculine nouns with "el • sustantivo masculino"', () => {
      const badge = formatGenderBadge('masculine', 'noun');
      expect(badge?.article).toBe('el');
      expect(badge?.label).toBe('sustantivo masculino');
      expect(badge?.fullBadge).toBe('el • sustantivo masculino');
    });

    it('formats feminine nouns with "la • sustantivo femenino"', () => {
      const badge = formatGenderBadge('feminine', 'sustantivo');
      expect(badge?.article).toBe('la');
      expect(badge?.label).toBe('sustantivo femenino');
      expect(badge?.fullBadge).toBe('la • sustantivo femenino');
    });

    it('formats non-noun adjectives correctly', () => {
      const badge = formatGenderBadge('masculine', 'adjective');
      expect(badge?.article).toBe('el');
      expect(badge?.label).toBe('masculino');
      expect(badge?.fullBadge).toBe('masculino');
    });

    it('returns null for missing gender', () => {
      expect(formatGenderBadge(null)).toBeNull();
      expect(formatGenderBadge(undefined)).toBeNull();
    });
  });
});
