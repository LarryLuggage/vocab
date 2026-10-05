import { describe, it, expect } from 'vitest';
import { parseShareTargetPayload } from '@/lib/share-parser';

describe('Web Share Target Payload Parser (lib/share-parser.ts)', () => {
  it('parses direct term parameter', () => {
    const res = parseShareTargetPayload({ term: 'perspicacious' });
    expect(res.targetTerm).toBe('perspicacious');
  });

  it('parses q and search fallback parameters', () => {
    const resQ = parseShareTargetPayload({ q: 'inchoate' });
    expect(resQ.targetTerm).toBe('inchoate');

    const resSearch = parseShareTargetPayload({ search: 'laconic' });
    expect(resSearch.targetTerm).toBe('laconic');
  });

  it('parses Zotero academic citation text payload', () => {
    const res = parseShareTargetPayload({
      text: '"The inchoate thoughts of early critique..." (Adorno, Negative Dialectics, p. 112)',
    });
    expect(res.contextSentence).toBe('The inchoate thoughts of early critique...');
    expect(res.author).toBe('Adorno');
    expect(res.sourceTitle).toBe('Negative Dialectics');
    expect(res.page).toBe('p. 112');
  });

  it('parses single word text payload as targetTerm', () => {
    const res = parseShareTargetPayload({ text: 'propitiate' });
    expect(res.targetTerm).toBe('propitiate');
  });

  it('merges title and url parameters when citation does not contain them', () => {
    const res = parseShareTargetPayload({
      text: 'A profound sentence demonstrating erudition.',
      title: 'London Review of Books',
      url: 'https://lrb.co.uk/sample',
    });
    expect(res.contextSentence).toBe('A profound sentence demonstrating erudition.');
    expect(res.sourceTitle).toBe('London Review of Books');
    expect(res.sourceUrl).toBe('https://lrb.co.uk/sample');
  });
});
