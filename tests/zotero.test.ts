import { describe, it, expect } from 'vitest';
import { parseZoteroCitation } from '@/lib/zotero-parser';

describe('Zotero Academic Citation Parser', () => {
  it('parses author, title, and page from standard Zotero annotation copy', () => {
    const input = '"The inchoate thoughts of an early philosophy..." (Adorno, Negative Dialectics, p. 112)';
    const parsed = parseZoteroCitation(input);

    expect(parsed.cleanedSentence).toBe('The inchoate thoughts of an early philosophy...');
    expect(parsed.author).toBe('Adorno');
    expect(parsed.sourceTitle).toBe('Negative Dialectics');
    expect(parsed.page).toBe('p. 112');
  });

  it('parses author, year, and page colon notation', () => {
    const input = '"Her perspicacious insight..." (Therborn 2020: 45)';
    const parsed = parseZoteroCitation(input);

    expect(parsed.cleanedSentence).toBe('Her perspicacious insight...');
    expect(parsed.author).toBe('Therborn');
    expect(parsed.year).toBe('2020');
    expect(parsed.page).toBe('p. 45');
  });

  it('extracts single word highlights', () => {
    const input = '"inchoate" (Theodor Adorno, 1966, p. 14)';
    const parsed = parseZoteroCitation(input);

    expect(parsed.targetTerm).toBe('inchoate');
    expect(parsed.author).toBe('Theodor Adorno');
    expect(parsed.year).toBe('1966');
    expect(parsed.page).toBe('p. 14');
  });

  it('handles plain sentences without citations', () => {
    const input = 'A purely isolated sentence without parenthetical reference.';
    const parsed = parseZoteroCitation(input);

    expect(parsed.cleanedSentence).toBe('A purely isolated sentence without parenthetical reference.');
    expect(parsed.author).toBeUndefined();
    expect(parsed.page).toBeUndefined();
  });
});
