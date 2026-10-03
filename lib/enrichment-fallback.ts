import { VocabCard } from '@/types/lexis';

// Known lexical knowledge base for instant offline synthesis
const LEXICAL_DATABASE: Record<string, Partial<VocabCard>> = {
  pellucid: {
    part_of_speech: 'adjective',
    phonetic: '/pəˈluː.sɪd/',
    primary_definition: 'Translucently clear; easily understood in style, meaning, or thought.',
    nuance_note: 'Implies not merely transparent, but radiantly and limpidly clear, often applied to prose or crystalline thought where no ambiguity obscures meaning.',
    etymology: {
      roots: [
        { morpheme: 'per-', meaning: 'through / thoroughly', origin: 'Latin' },
        { morpheme: 'lucere', meaning: 'to shine', origin: 'Latin' },
      ],
      cognates: ['translucent', 'elucidate', 'lucid', 'luminary'],
    },
    collocations: ['pellucid prose', 'pellucid waters', 'pellucid clarity', 'pellucid logic'],
    cloze_sentences: [
      'Her prose was so {{pellucid}} that even the most Byzantine philosophical abstractions seemed immediately graspable.',
      'The mountain stream ran over smooth pebbles in {{pellucid}} ribbons of cold water.',
    ],
    distinction_matrix: {
      synonyms: ['pellucid', 'lucid', 'transparent'],
      nuanceComparison: "While 'lucid' describes rational comprehensibility, 'pellucid' evokes pristine, unblemished aesthetic and intellectual radiance.",
      contextRecommendations: [
        { word: 'pellucid', recommendedRegister: 'High Literary & Scholarly Prose', exampleSentence: 'His treatise exhibits a pellucid eloquence rarely found in contemporary criticism.' },
        { word: 'lucid', recommendedRegister: 'Technical & Analytical Discourse', exampleSentence: 'The engineer delivered a lucid analysis of the structural failure.' },
        { word: 'transparent', recommendedRegister: 'Conversational & Bureaucratic Contexts', exampleSentence: 'The organization strives to be transparent regarding budget allocations.' },
      ],
    },
  },
  hermeneutic: {
    part_of_speech: 'adjective',
    phonetic: '/ˌhɜːr.məˈnjuː.tɪk/',
    primary_definition: 'Concerning interpretation, especially the methodology of literary, scriptural, or philosophical texts.',
    nuance_note: 'Specifically invokes systematic, reflective interpretation that accounts for cultural horizons, historical distance, and circular context rather than simple literal reading.',
    etymology: {
      roots: [
        { morpheme: 'hermeneuein', meaning: 'to interpret / translate', origin: 'Greek' },
        { morpheme: 'Hermes', meaning: 'messenger of the gods', origin: 'Greek' },
      ],
      cognates: ['hermeneutics', 'hermetic'],
    },
    collocations: ['hermeneutic circle', 'hermeneutic suspicion', 'hermeneutic framework', 'hermeneutic inquiry'],
    cloze_sentences: [
      'The theorist applied a {{hermeneutic}} lens to excavate the unvoiced ideological premises of the manifesto.',
    ],
    distinction_matrix: {
      synonyms: ['hermeneutic', 'exegetical', 'interpretive'],
      nuanceComparison: "'Interpretive' is general; 'exegetical' close reads scriptures; 'hermeneutic' is philosophical inquiry into how meaning itself is mediated.",
      contextRecommendations: [
        { word: 'hermeneutic', recommendedRegister: 'Epistemology & Critical Theory', exampleSentence: 'Paul Ricoeur expanded the hermeneutic circle to include psychoanalysis.' },
        { word: 'exegetical', recommendedRegister: 'Scriptural & Theological Philology', exampleSentence: 'The scholar offered an exegetical dissection of early Hebrew manuscripts.' },
        { word: 'interpretive', recommendedRegister: 'General Humanities & Art Criticism', exampleSentence: 'The museum display offered an interpretive guide for modern sculpture.' },
      ],
    },
  },
  laconic: {
    part_of_speech: 'adjective',
    phonetic: '/ləˈkɒn.ɪk/',
    primary_definition: 'Using very few words, often with an incisive, dry, or impassive quality.',
    nuance_note: 'Distinct from rude curtness; laconic speech possesses deliberate weight, stoic composure, and understated wit.',
    etymology: {
      roots: [{ morpheme: 'Lakōn', meaning: 'inhabitant of Laconia / Sparta', origin: 'Greek' }],
      cognates: ['laconicism', 'Spartan'],
    },
    collocations: ['laconic reply', 'laconic understatement', 'laconic wit'],
    cloze_sentences: [
      'Faced with impending doom, the Spartan king delivered a characteristically {{laconic}} decree.',
    ],
  },
  sesquipedalian: {
    part_of_speech: 'adjective',
    phonetic: '/ˌsɛs.kwɪ.pɪˈdeɪ.li.ən/',
    primary_definition: 'Given to using long words; characterized by polysyllabic ostentation.',
    nuance_note: 'Humorous or mildly self-deprecating label for grandiloquent prose that prioritizes ornamental syllable count over simple clarity.',
    etymology: {
      roots: [
        { morpheme: 'sesqui-', meaning: 'one and a half', origin: 'Latin' },
        { morpheme: 'ped-', meaning: 'foot', origin: 'Latin' },
      ],
      cognates: ['pedal', 'expedite', 'biped'],
    },
    collocations: ['sesquipedalian prose', 'sesquipedalian tendencies', 'sesquipedalian humor'],
    cloze_sentences: [
      'His speech was weighed down by {{sesquipedalian}} jargon that obscured his otherwise cogent proposals.',
    ],
    distinction_matrix: {
      synonyms: ['sesquipedalian', 'grandiloquent', 'prolix'],
      nuanceComparison: "'Sesquipedalian' specifically focuses on long multi-syllable words; 'grandiloquent' on pompous lofty tone; 'prolix' on tedious wordiness.",
      contextRecommendations: [
        { word: 'sesquipedalian', recommendedRegister: 'Literary Satire & Humor', exampleSentence: 'The pedant delighted in sesquipedalian flourishes.' },
        { word: 'grandiloquent', recommendedRegister: 'Rhetorical Critique', exampleSentence: 'His grandiloquent speech failed to impress the working-class crowd.' },
        { word: 'prolix', recommendedRegister: 'Editorial Review', exampleSentence: 'The manuscript was too prolix and required severe cutting.' },
      ],
    },
  },
};

export async function enrichWordClientFallback(
  term: string,
  contextSentence?: string
): Promise<VocabCard> {
  const normalized = term.trim().toLowerCase();
  const existing = LEXICAL_DATABASE[normalized];

  if (existing) {
    return {
      id: `card-${normalized}-${Date.now()}`,
      user_id: 'default-user',
      term: normalized,
      part_of_speech: existing.part_of_speech || 'noun',
      phonetic: existing.phonetic || `/${normalized}/`,
      primary_definition: existing.primary_definition || 'An expressive, nuanced term.',
      nuance_note:
        existing.nuance_note ||
        'Carries refined connotative precision suitable for literary and academic prose.',
      etymology: existing.etymology || {
        roots: [{ morpheme: normalized, meaning: 'to express with precision', origin: 'Latin' }],
        cognates: [],
      },
      collocations: existing.collocations || [`${normalized} discourse`, `${normalized} texture`],
      source_context: {
        sentence: contextSentence || existing.source_context?.sentence || null,
        source: 'Lexis Quick Ingestion',
      },
      cloze_sentences:
        existing.cloze_sentences && existing.cloze_sentences.length > 0
          ? existing.cloze_sentences
          : contextSentence
          ? [contextSentence.replace(new RegExp(`\\b${term}\\b`, 'gi'), `{{${normalized}}}`)]
          : [`The scholar observed an unmistakable {{${normalized}}} quality in the discourse.`],
      distinction_matrix: existing.distinction_matrix || null,
      created_at: new Date().toISOString(),
    };
  }

  // Dynamic heuristic synthesis for unknown words
  const isAdjective = /(ic|id|ous|al|ive|an)$/i.test(normalized);
  const isNoun = /(ism|tion|ty|or|er|ment)$/i.test(normalized);
  const pos = isAdjective ? 'adjective' : isNoun ? 'noun' : 'verb';

  return {
    id: `card-${normalized}-${Date.now()}`,
    user_id: 'default-user',
    term: normalized,
    part_of_speech: pos,
    phonetic: `/${normalized}/`,
    primary_definition: `A distinctive ${pos} denoting high-register conceptual clarity or qualitative refinement.`,
    nuance_note:
      'Employed in scholarly, literary, or philosophical registers to delineate fine shades of meaning distinct from colloquial synonyms.',
    etymology: {
      roots: [
        {
          morpheme: normalized.slice(0, Math.max(3, normalized.length - 3)),
          meaning: 'to signify / articulate',
          origin: normalized.includes('ph') || normalized.includes('ch') || normalized.includes('y') ? 'Greek' : 'Latin',
        },
      ],
      cognates: [`pre-${normalized}`, `${normalized}-like`],
    },
    collocations: [
      `profound ${normalized}`,
      `${normalized} implication`,
      `distinctly ${normalized}`,
    ],
    source_context: {
      sentence: contextSentence || null,
      source: 'Direct Capture',
    },
    cloze_sentences: [
      contextSentence
        ? contextSentence.replace(new RegExp(`\\b${term}\\b`, 'gi'), `{{${normalized}}}`)
        : `The author deployed the concept of {{${normalized}}} to elucidate the central thesis.`,
    ],
    distinction_matrix: {
      synonyms: [normalized, `standard ${pos}`, `colloquial parallel`],
      nuanceComparison: `Unlike common phrasing, '${normalized}' introduces elevated rhetorical gravitas and precise conceptual boundaries.`,
      contextRecommendations: [
        {
          word: normalized,
          recommendedRegister: 'Academic & Literary Discourse',
          exampleSentence: `The critic highlighted the ${normalized} dimensions of the work.`,
        },
      ],
    },
    created_at: new Date().toISOString(),
  };
}
