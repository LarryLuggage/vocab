export interface ParsedZoteroCitation {
  rawText: string;
  cleanedSentence: string;
  targetTerm?: string;
  author?: string;
  sourceTitle?: string;
  year?: string;
  page?: string;
}

/**
 * Parses Zotero annotations and academic highlight copies.
 * Examples:
 *  - "The inchoate thoughts of an early philosophy..." (Adorno, Negative Dialectics, p. 112)
 *  - "Her perspicacious insight..." (Therborn 2020: 45)
 *  - "perspicacious" (Göran Therborn, 1999, p. 14)
 *  - (Adorno 1973, p. 54) "A laconic expression..."
 */
export function parseZoteroCitation(rawInput: string): ParsedZoteroCitation {
  const text = rawInput.trim();
  if (!text) {
    return { rawText: '', cleanedSentence: '' };
  }

  let cleanedSentence = text;
  let author: string | undefined;
  let sourceTitle: string | undefined;
  let year: string | undefined;
  let page: string | undefined;
  let targetTerm: string | undefined;

  // 1. Look for trailing citation in parentheses: e.g. (Author, Title, p. 123) or (Author 2020: 45)
  const trailingCitationMatch = text.match(/^(.*?)[(（]([^()]+)[)）]\s*$/s);

  if (trailingCitationMatch) {
    cleanedSentence = trailingCitationMatch[1].trim().replace(/^["“]|["”]$/g, '').trim();
    const citationBody = trailingCitationMatch[2].trim();

    // Check for page patterns: "p. 123", "pp. 123-125", ": 45"
    const pageMatch = citationBody.match(/(?:(?:pp?\.?|pages?)\s*(\d+(?:-\d+)?)|:\s*(\d+(?:-\d+)?))/i);
    if (pageMatch) {
      page = pageMatch[1] || pageMatch[2];
    }

    // Check for 4-digit year: e.g. 1999, 2024
    const yearMatch = citationBody.match(/\b(18\d{2}|19\d{2}|20\d{2})\b/);
    if (yearMatch) {
      year = yearMatch[1];
    }

    // Remove page and year from citation body to extract author & title
    let remaining = citationBody
      .replace(/(?:(?:pp?\.?|pages?)\s*\d+(?:-\d+)?|:\s*\d+(?:-\d+)?)/gi, '')
      .replace(/\b(18\d{2}|19\d{2}|20\d{2})\b/g, '')
      .trim();

    // Split remaining by comma
    const parts = remaining.split(/[,;]/).map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      author = parts[0];
      sourceTitle = parts.slice(1).join(', ');
    } else if (parts.length === 1) {
      author = parts[0];
    }
  }

  // 2. If cleaned sentence is a single word or wrapped in quotes, identify target word
  if (!cleanedSentence.includes(' ') && cleanedSentence.length > 1) {
    targetTerm = cleanedSentence.toLowerCase();
  } else {
    // If quote has a specifically marked word like *word* or _word_
    const emphasisMatch = cleanedSentence.match(/[*_]([a-zA-Z-]+)[*_]/);
    if (emphasisMatch) {
      targetTerm = emphasisMatch[1].toLowerCase();
    }
  }

  return {
    rawText: text,
    cleanedSentence,
    targetTerm,
    author,
    sourceTitle,
    year,
    page: page ? (page.startsWith('p') ? page : `p. ${page}`) : undefined,
  };
}
