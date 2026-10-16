import { CardWithSrs, ProductionLog } from '@/types/lexis';

const FSRS_STATE_LABELS: Record<number, string> = {
  0: 'New',
  1: 'Learning',
  2: 'Review',
  3: 'Relearning',
};

export function formatLexiconAsMarkdown(
  cards: CardWithSrs[],
  logsByCardId: Record<string, ProductionLog[]> = {}
): string {
  const exportedAt = new Date().toISOString();
  const languages = Array.from(new Set(cards.map((c) => c.language || 'en')));

  const lines: string[] = [
    '---',
    'title: "Lexis Engine — Personal Vocabulary & Etymology Knowledge Base"',
    `exported_at: "${exportedAt}"`,
    `total_cards: ${cards.length}`,
    `languages: [${languages.join(', ')}]`,
    'tags: [lexis-engine, second-brain, notebooklm, obsidian, vocabulary]',
    '---',
    '',
    '# Lexis Engine — Personal Vocabulary & Etymology Knowledge Base',
    '',
    '> Structured lexical dossier exported for **NotebookLM** synthesis and **Obsidian** Second-Brain graph linking.',
    '',
  ];

  // Section 1: Morphological Root Index
  lines.push('## Morphological Root Index');
  lines.push('');

  const rootMap = new Map<
    string,
    { morpheme: string; origin: string; meaning: string; terms: Set<string> }
  >();

  for (const card of cards) {
    for (const root of card.etymology?.roots || []) {
      const key = root.morpheme.toLowerCase().trim();
      const existing = rootMap.get(key);
      if (existing) {
        existing.terms.add(card.term);
      } else {
        rootMap.set(key, {
          morpheme: root.morpheme,
          origin: root.origin,
          meaning: root.meaning,
          terms: new Set([card.term]),
        });
      }
    }
  }

  if (rootMap.size === 0) {
    lines.push('_No morphological roots indexed._');
    lines.push('');
  } else {
    for (const entry of rootMap.values()) {
      const termLinks = Array.from(entry.terms)
        .map((t) => `[[${t}]]`)
        .join(', ');
      lines.push(
        `- **[[${entry.morpheme}]]** (${entry.origin} — "${entry.meaning}"): ${termLinks}`
      );
    }
    lines.push('');
  }

  // Section 2: Lexical Entries
  lines.push('## Lexical Entries');
  lines.push('');

  for (const card of cards) {
    const lang = card.language || 'en';
    const stateLabel = FSRS_STATE_LABELS[card.srs?.state ?? 0] || 'New';
    const stability = (card.srs?.stability ?? 0).toFixed(1);
    const difficulty = (card.srs?.difficulty ?? 0).toFixed(1);
    const reps = card.srs?.reps ?? 0;

    lines.push(`### ${card.term}`);
    lines.push('');

    const metaParts: string[] = [
      `**Part of Speech:** ${card.part_of_speech}`,
    ];
    if (card.phonetic) {
      metaParts.push(`**IPA:** \`${card.phonetic}\``);
    }
    metaParts.push(`**Language:** \`${lang}\``);
    if (card.gender) {
      metaParts.push(`**Gender:** ${card.gender}`);
    }
    metaParts.push(
      `**FSRS:** ${stateLabel} (\`S: ${stability}d\`, \`D: ${difficulty}\`, \`Reps: ${reps}\`)`
    );

    lines.push(metaParts.join(' | '));
    lines.push('');

    lines.push(`- **Primary Definition:** ${card.primary_definition}`);
    if (card.english_gloss) {
      lines.push(`- **English Anchor / Gloss:** ${card.english_gloss}`);
    }
    if (card.nuance_note) {
      lines.push(`- **Connotative Nuance & Register:** ${card.nuance_note}`);
    }

    if (card.etymology?.roots?.length > 0 || card.etymology?.cognates?.length > 0) {
      lines.push('- **Etymological Roots & Cognates:**');
      if (card.etymology.roots?.length > 0) {
        const rootsFormatted = card.etymology.roots
          .map((r) => `[[${r.morpheme}]] (${r.origin}: "${r.meaning}")`)
          .join('; ');
        lines.push(`  - *Roots:* ${rootsFormatted}`);
      }
      if (card.etymology.cognates?.length > 0) {
        const cognatesFormatted = card.etymology.cognates
          .map((c) => `[[${c}]]`)
          .join(', ');
        lines.push(`  - *Cognates:* ${cognatesFormatted}`);
      }
    }

    if (card.collocations?.length > 0) {
      lines.push(
        `- **Collocations:** ${card.collocations.map((c) => `_${c}_`).join(' • ')}`
      );
    }

    if (card.distinction_matrix) {
      const dm = card.distinction_matrix;
      lines.push('- **Distinction Matrix:**');
      if (dm.synonyms?.length > 0) {
        lines.push(
          `  - *Synonyms:* ${dm.synonyms.map((s) => `[[${s}]]`).join(', ')}`
        );
      }
      if (dm.nuanceComparison) {
        lines.push(`  - *Comparison:* ${dm.nuanceComparison}`);
      }
      if (dm.contextRecommendations?.length > 0) {
        for (const rec of dm.contextRecommendations) {
          lines.push(
            `  - **${rec.word}** (${rec.recommendedRegister}): "${rec.exampleSentence}"`
          );
        }
      }
    }

    if (
      card.source_context &&
      (card.source_context.sentence ||
        card.source_context.source ||
        card.source_context.author)
    ) {
      const sc = card.source_context;
      lines.push('- **Reading Source & Citation:**');
      if (sc.sentence) {
        lines.push(`  > "${sc.sentence}"`);
      }
      const citationBits: string[] = [];
      if (sc.author) citationBits.push(sc.author);
      if (sc.source) citationBits.push(`*${sc.source}*`);
      if (sc.page) citationBits.push(`p. ${sc.page}`);
      if (citationBits.length > 0) {
        lines.push(`  - *Attribution:* — ${citationBits.join(', ')}`);
      }
    }

    const cardLogs = logsByCardId[card.id] || [];
    if (cardLogs.length > 0) {
      lines.push('- **Active Production Log:**');
      for (const log of cardLogs) {
        const feedbackPart = log.feedback ? ` — *Feedback:* ${log.feedback}` : '';
        lines.push(
          `  - [${log.evaluation_status.toUpperCase()}] "${log.user_sentence}"${feedbackPart}`
        );
      }
    }

    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}
