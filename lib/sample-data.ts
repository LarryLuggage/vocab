import { CardWithSrs, VocabCard, SrsCard } from '@/types/lexis';
import { createInitialSrsCard } from './fsrs';

export const INITIAL_VOCAB_CARDS: CardWithSrs[] = [
  {
    id: 'card-pellucid-001',
    user_id: 'default-user',
    term: 'pellucid',
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
    source_context: {
      sentence: 'Her prose was so pellucid that even the most Byzantine philosophical abstractions seemed immediately graspable.',
      source: 'The Literary Review, Issue 42',
    },
    cloze_sentences: [
      'Her prose was so {{pellucid}} that even the most Byzantine philosophical abstractions seemed immediately graspable.',
      'The mountain stream ran over smooth pebbles in {{pellucid}} ribbons of cold water.',
    ],
    distinction_matrix: {
      synonyms: ['pellucid', 'lucid', 'transparent'],
      nuanceComparison:
        "While 'lucid' describes rational comprehensibility and 'transparent' describes basic physical see-through clarity, 'pellucid' evokes pristine, unblemished aesthetic and intellectual radiance.",
      contextRecommendations: [
        {
          word: 'pellucid',
          recommendedRegister: 'High Literary & Scholarly Prose',
          exampleSentence: 'His treatise exhibits a pellucid eloquence rarely found in contemporary criticism.',
        },
        {
          word: 'lucid',
          recommendedRegister: 'Technical & Analytical Discourse',
          exampleSentence: 'The engineer delivered a lucid analysis of the structural failure.',
        },
        {
          word: 'transparent',
          recommendedRegister: 'Conversational & Bureaucratic Contexts',
          exampleSentence: 'The organization strives to be completely transparent regarding budget allocations.',
        },
      ],
    },
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    srs: {
      card_id: 'card-pellucid-001',
      user_id: 'default-user',
      due: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // Due 30 mins ago
      stability: 1.2,
      difficulty: 4.8,
      elapsed_days: 1,
      scheduled_days: 1,
      reps: 2,
      lapses: 0,
      state: 1, // Learning
      last_review: new Date(Date.now() - 86400000).toISOString(),
    },
  },
  {
    id: 'card-hermeneutic-002',
    user_id: 'default-user',
    term: 'hermeneutic',
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
    source_context: {
      sentence: 'The theorist applied a hermeneutic lens to excavate the unvoiced ideological premises of the manifesto.',
      source: 'Studies in Continental Philosophy',
    },
    cloze_sentences: [
      'The theorist applied a {{hermeneutic}} lens to excavate the unvoiced ideological premises of the manifesto.',
      'Understanding the historical context is a core requirement of {{hermeneutic}} analysis.',
    ],
    distinction_matrix: {
      synonyms: ['hermeneutic', 'exegetical', 'interpretive'],
      nuanceComparison:
        "'Interpretive' is the general broad term. 'Exegetical' focuses narrowly on critical close reading of authoritative scriptural or legal texts. 'Hermeneutic' encompasses the philosophical inquiry into how meaning itself is mediated.",
      contextRecommendations: [
        {
          word: 'hermeneutic',
          recommendedRegister: 'Epistemology & Critical Theory',
          exampleSentence: 'Paul Ricoeur expanded the hermeneutic circle to include psychoanalysis.',
        },
        {
          word: 'exegetical',
          recommendedRegister: 'Scriptural & Theological Philology',
          exampleSentence: 'The scholar offered an exegetical dissection of early Hebrew manuscripts.',
        },
        {
          word: 'interpretive',
          recommendedRegister: 'General Humanities & Art Criticism',
          exampleSentence: 'The museum display offered an interpretive guide for modern sculpture.',
        },
      ],
    },
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    srs: {
      card_id: 'card-hermeneutic-002',
      user_id: 'default-user',
      due: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // Due 2 hrs ago
      stability: 3.4,
      difficulty: 5.5,
      elapsed_days: 3,
      scheduled_days: 3,
      reps: 3,
      lapses: 0,
      state: 2, // Review
      last_review: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  },
  {
    id: 'card-laconic-003',
    user_id: 'default-user',
    term: 'laconic',
    part_of_speech: 'adjective',
    phonetic: '/ləˈkɒn.ɪk/',
    primary_definition: 'Using very few words, often with an incisive, dry, or impassive quality.',
    nuance_note: 'Distinct from rude curtness; laconic speech possesses deliberate weight, stoic composure, and understated wit.',
    etymology: {
      roots: [
        { morpheme: 'Lakōn', meaning: 'inhabitant of Laconia / Sparta', origin: 'Greek' },
      ],
      cognates: ['laconicism', 'Spartan'],
    },
    collocations: ['laconic reply', 'laconic understatement', 'laconic wit', 'laconic dispatch'],
    source_context: {
      sentence: 'Faced with impending doom, the Spartan king delivered a characteristically laconic decree.',
      source: 'Histories of Antiquity',
    },
    cloze_sentences: [
      'Faced with impending doom, the Spartan king delivered a characteristically {{laconic}} decree.',
      'Known for his {{laconic}} humor, he summarized the two-hour meeting in a single ironic sentence.',
    ],
    distinction_matrix: {
      synonyms: ['laconic', 'terse', 'concise'],
      nuanceComparison:
        "'Concise' emphasizes efficient clarity without fluff. 'Terse' often borders on brusque irritation. 'Laconic' suggests a deliberate, stoic, or dryly theatrical economy of words.",
      contextRecommendations: [
        {
          word: 'laconic',
          recommendedRegister: 'Literary & Narrative Characterization',
          exampleSentence: 'The cowboy responded with a laconic nod and tipped his brim.',
        },
        {
          word: 'terse',
          recommendedRegister: 'Direct Observation & Interpersonal Dialogue',
          exampleSentence: 'She hung up after giving a terse rejection.',
        },
        {
          word: 'concise',
          recommendedRegister: 'Technical Writing & Executive Summaries',
          exampleSentence: 'Please draft a concise summary of the quarterly milestones.',
        },
      ],
    },
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    srs: {
      card_id: 'card-laconic-003',
      user_id: 'default-user',
      due: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // Due 10 mins ago
      stability: 0.8,
      difficulty: 4.0,
      elapsed_days: 0,
      scheduled_days: 1,
      reps: 1,
      lapses: 0,
      state: 1, // Learning
      last_review: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
  },
  {
    id: 'card-meretricious-004',
    user_id: 'default-user',
    term: 'meretricious',
    part_of_speech: 'adjective',
    phonetic: '/ˌmɛr.ɪˈtrɪʃ.əs/',
    primary_definition: 'Apparently attractive but having in reality no value or integrity; gaudy or insincere.',
    nuance_note: 'Carries severe aesthetic or moral condemnation: something masquerading as precious or profound through vulgar dazzle.',
    etymology: {
      roots: [
        { morpheme: 'meretrix', meaning: 'courtesan / prostitute', origin: 'Latin' },
        { morpheme: 'mereri', meaning: 'to earn pay', origin: 'Latin' },
      ],
      cognates: ['merit', 'mercenary'],
    },
    collocations: ['meretricious ornament', 'meretricious rhetoric', 'meretricious charm', 'meretricious display'],
    source_context: {
      sentence: 'The gallery was choked with meretricious spectacles intended to shock rather than illuminate.',
      source: 'Aesthetics in the Capitalist Age',
    },
    cloze_sentences: [
      'The gallery was choked with {{meretricious}} spectacles intended to shock rather than illuminate.',
      'Beneath the politician’s {{meretricious}} charm lay calculating opportunism.',
    ],
    distinction_matrix: {
      synonyms: ['meretricious', 'specious', 'tawdry'],
      nuanceComparison:
        "'Tawdry' relates to cheap, gaudy physical appearance. 'Specious' describes an argument that appears correct but is fallacious. 'Meretricious' bridges both, denoting deceptive allure that conceals moral or intellectual hollowness.",
      contextRecommendations: [
        {
          word: 'meretricious',
          recommendedRegister: 'Literary & Cultural Critique',
          exampleSentence: 'The novel’s sentimentality was rejected as meretricious melodrama.',
        },
        {
          word: 'specious',
          recommendedRegister: 'Philosophical & Legal Argument',
          exampleSentence: 'The lawyer dismantled the witness’s specious reasoning.',
        },
        {
          word: 'tawdry',
          recommendedRegister: 'Descriptive & Material Criticism',
          exampleSentence: 'The carnival was decked in tawdry neon and plastic streamers.',
        },
      ],
    },
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    srs: {
      card_id: 'card-meretricious-004',
      user_id: 'default-user',
      due: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Due tomorrow
      stability: 4.5,
      difficulty: 6.0,
      elapsed_days: 2,
      scheduled_days: 4,
      reps: 4,
      lapses: 0,
      state: 2, // Review
      last_review: new Date(Date.now() - 86400000).toISOString(),
    },
  },
  {
    id: 'card-anachronism-005',
    user_id: 'default-user',
    term: 'anachronism',
    part_of_speech: 'noun',
    phonetic: '/əˈnæk.rə.nɪ.zəm/',
    primary_definition: 'A thing belonging or appropriate to a period other than that in which it exists, especially conspicuously old-fashioned.',
    nuance_note: 'Can denote a chronological error in narrative or historiography, or metaphorically a person or convention displaced from their modern temporal environment.',
    etymology: {
      roots: [
        { morpheme: 'ana-', meaning: 'against / backward / upside down', origin: 'Greek' },
        { morpheme: 'chronos', meaning: 'time', origin: 'Greek' },
      ],
      cognates: ['chronology', 'chronic', 'synchronous'],
    },
    collocations: ['glaring anachronism', 'historical anachronism', 'quaint anachronism', 'cultural anachronism'],
    source_context: {
      sentence: 'The clock striking in Shakespeare’s Julius Caesar is perhaps literature’s most famous anachronism.',
      source: 'Historiography and Drama',
    },
    cloze_sentences: [
      'The clock striking in Shakespeare’s Julius Caesar is perhaps literature’s most famous {{anachronism}}.',
      'In an era of fiber-optic communication, the mechanical telegraph felt like a quaint {{anachronism}}.',
    ],
    distinction_matrix: {
      synonyms: ['anachronism', 'relic', 'archaism'],
      nuanceComparison:
        "'Relic' denotes a surviving artifact from the past. 'Archaism' refers to an antiquated word or idiom. 'Anachronism' specifies temporal dissonance—something misplaced across time.",
      contextRecommendations: [
        {
          word: 'anachronism',
          recommendedRegister: 'Critical Historiography & Dramaturgy',
          exampleSentence: 'The appearance of steam engines in the medieval fantasy was a jarring anachronism.',
        },
        {
          word: 'relic',
          recommendedRegister: 'Material History & Anthropology',
          exampleSentence: 'The ruined chapel stood as a sacred relic of the feudal era.',
        },
        {
          word: 'archaism',
          recommendedRegister: 'Linguistic & Stylistic Analysis',
          exampleSentence: 'The author deliberately employed biblical archaisms to evoke solemnity.',
        },
      ],
    },
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    srs: {
      card_id: 'card-anachronism-005',
      user_id: 'default-user',
      due: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // Due 5 mins ago
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      state: 0, // New
      last_review: null,
    },
  },
];

const LOCAL_STORAGE_KEY = 'lexis_cards_v1';

export function getClientCards(): CardWithSrs[] {
  if (typeof window === 'undefined') {
    return INITIAL_VOCAB_CARDS;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_VOCAB_CARDS));
      return INITIAL_VOCAB_CARDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_VOCAB_CARDS;
  } catch (err) {
    console.error('Failed reading from local storage:', err);
    return INITIAL_VOCAB_CARDS;
  }
}

export function saveClientCards(cards: CardWithSrs[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cards));
  } catch (err) {
    console.error('Failed saving to local storage:', err);
  }
}

export function addOrUpdateClientCard(newCard: CardWithSrs): CardWithSrs[] {
  const existing = getClientCards();
  const idx = existing.findIndex((c) => c.id === newCard.id || c.term.toLowerCase() === newCard.term.toLowerCase());
  let updated: CardWithSrs[];
  if (idx >= 0) {
    updated = [...existing];
    updated[idx] = newCard;
  } else {
    updated = [newCard, ...existing];
  }
  saveClientCards(updated);
  return updated;
}

export function updateClientCardSrs(cardId: string, updatedSrs: SrsCard): CardWithSrs[] {
  const existing = getClientCards();
  const updated = existing.map((card) => {
    if (card.id === cardId) {
      return { ...card, srs: updatedSrs };
    }
    return card;
  });
  saveClientCards(updated);
  return updated;
}

export function getDueCards(cards: CardWithSrs[], now: Date = new Date()): CardWithSrs[] {
  return cards
    .filter((card) => {
      const dueDate = new Date(card.srs.due);
      return dueDate.getTime() <= now.getTime();
    })
    .sort((a, b) => new Date(a.srs.due).getTime() - new Date(b.srs.due).getTime());
}
