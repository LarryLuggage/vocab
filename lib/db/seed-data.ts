import { CardWithSrs } from '@/types/lexis';

export const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000';

export function createSampleCards(userId: string = DEFAULT_USER_ID, now: Date = new Date()): CardWithSrs[] {
  const past2Hours = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
  const past30Mins = new Date(now.getTime() - 30 * 60 * 1000).toISOString();
  const past5Mins = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
  const future1Day = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const future5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: '00000000-0000-0000-0000-000000000001',
      user_id: userId,
      term: 'perspicacious',
      part_of_speech: 'adjective',
      phonetic: '/ˌpɜː.spɪˈkeɪ.ʃəs/',
      primary_definition: 'Having a ready insight into and understanding of things; perceptive and discerning.',
      nuance_note: 'Emphasizes acute mental vision and penetrating discernment, especially in analyzing complex human motives or abstract principles, distinct from merely being smart or clever.',
      etymology: {
        roots: [
          { morpheme: 'per-', meaning: 'through / thoroughly', origin: 'Latin' },
          { morpheme: 'specere', meaning: 'to look at / behold', origin: 'Latin' },
          { morpheme: '-acious', meaning: 'inclined to / characterized by', origin: 'Latin' },
        ],
        cognates: ['perspicuity', 'spectator', 'circumspect', 'conspicuous'],
      },
      collocations: ['perspicacious observer', 'perspicacious critique', 'perspicacious analysis', 'perspicacious mind'],
      source_context: {
        sentence: 'Her perspicacious appraisal of the macroeconomic instability anticipated the collapse months in advance.',
        source: 'The Economic Review',
      },
      cloze_sentences: [
        'The historian\'s {{c1::perspicacious}} examination of diplomatic letters revealed motives obscured for centuries.',
        'Only a {{c1::perspicacious}} critic could detect the subtle irony woven through the seemingly naive prose.',
      ],
      distinction_matrix: {
        synonyms: ['perspicacious', 'astute', 'sagacious'],
        nuanceComparison: 'Perspicacious emphasizes penetration of vision and seeing through obscurity; astute highlights practical shrewdness and calculating advantage; sagacious implies deep wisdom ripened by age and experience.',
        contextRecommendations: [
          { word: 'perspicacious', recommendedRegister: 'Scholarly / Critical', exampleSentence: 'A perspicacious scholar capable of piercing the dogmas of the era.' },
          { word: 'astute', recommendedRegister: 'Pragmatic / Political', exampleSentence: 'An astute politician who brokered compromises before opposition mounted.' },
          { word: 'sagacious', recommendedRegister: 'Philosophical / Literary', exampleSentence: 'The sagacious elder whose quiet counsel steadied the council.' },
        ],
      },
      created_at: past2Hours,
      srs: {
        card_id: '00000000-0000-0000-0000-000000000001',
        user_id: userId,
        due: past2Hours, // Due now
        stability: 1.2,
        difficulty: 4.8,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 1,
        lapses: 0,
        state: 1, // Learning
        last_review: past2Hours,
      },
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      user_id: userId,
      term: 'solipsism',
      part_of_speech: 'noun',
      phonetic: '/ˈsɒl.ɪp.sɪ.zəm/',
      primary_definition: 'The philosophical theory that only the self exists, or that nothing outside one\'s own mind can be known; colloquially, extreme egocentricity.',
      nuance_note: 'Technically an epistemological skepticism regarding the existence of other minds; used pejoratively in cultural critique to describe insular self-absorption that treats external reality as an illusion or accessory.',
      etymology: {
        roots: [
          { morpheme: 'solus', meaning: 'alone / only', origin: 'Latin' },
          { morpheme: 'ipse', meaning: 'self', origin: 'Latin' },
          { morpheme: '-ism', meaning: 'doctrine / belief system', origin: 'Greek' },
        ],
        cognates: ['solitude', 'solo', 'solitary'],
      },
      collocations: ['epistemological solipsism', 'moral solipsism', 'narcissistic solipsism', 'verge on solipsism'],
      source_context: {
        sentence: 'Trapped in digital echo chambers, modern discourse drifts inexorably toward intellectual solipsism.',
        source: 'Cultural Monographs',
      },
      cloze_sentences: [
        'To reduce ethics merely to individual subjective desire is to risk the trap of moral {{c1::solipsism}}.',
        'The protagonist\'s spiral into paranoia resembled an epistemological {{c1::solipsism}} where external facts ceased to matter.',
      ],
      distinction_matrix: {
        synonyms: ['solipsism', 'egocentrism', 'narcissism'],
        nuanceComparison: 'Solipsism is fundamentally cognitive or philosophical, denying the validity or existence of external reality; egocentrism is developmental inability to consider other perspectives; narcissism is emotional preoccupation with vanity and validation.',
        contextRecommendations: [
          { word: 'solipsism', recommendedRegister: 'Philosophical / Metaphysical', exampleSentence: 'The writer fell into a solipsism so acute that no secondary characters had genuine agency.' },
          { word: 'egocentrism', recommendedRegister: 'Psychological / Analytical', exampleSentence: 'His egocentrism made cooperative governance impossible.' },
          { word: 'narcissism', recommendedRegister: 'Social / Clinical', exampleSentence: 'Modern social platforms feed a pathological narcissism.' },
        ],
      },
      created_at: past30Mins,
      srs: {
        card_id: '00000000-0000-0000-0000-000000000002',
        user_id: userId,
        due: past30Mins, // Due now
        stability: 3.5,
        difficulty: 5.1,
        elapsed_days: 1,
        scheduled_days: 1,
        reps: 2,
        lapses: 0,
        state: 2, // Review
        last_review: past30Mins,
      },
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      user_id: userId,
      term: 'inchoate',
      part_of_speech: 'adjective',
      phonetic: '/ɪnˈkoʊ.eɪt/',
      primary_definition: 'Just begun and so not fully formed or developed; rudimentary; disorganized.',
      nuance_note: 'Carries a sense of nascent potential paired with formlessness. It refers not merely to something young, but to something still chaotic or unarticulated awaiting coherence.',
      etymology: {
        roots: [
          { morpheme: 'inchoare', meaning: 'to begin / commence / harness', origin: 'Latin' },
          { morpheme: '-ate', meaning: 'characterized by / possessing', origin: 'Latin' },
        ],
        cognates: ['inchoation', 'inchoative'],
      },
      collocations: ['inchoate ideas', 'inchoate rebellion', 'inchoate longing', 'inchoate structure'],
      source_context: {
        sentence: 'The manifesto articulated the inchoate frustrations of a generation grappling with institutional decay.',
        source: 'Contemporary Sociology',
      },
      cloze_sentences: [
        'Before drafting the treatise, he wrestled for years with {{c1::inchoate}} thoughts scrawled across notebooks.',
        'The opposition remained an {{c1::inchoate}} movement lacking both leadership and cohesive strategy.',
      ],
      distinction_matrix: {
        synonyms: ['inchoate', 'embryonic', 'nascent'],
        nuanceComparison: 'Inchoate highlights formlessness and unshaped inception; embryonic highlights latent biological-like structural development; nascent emphasizes the fresh emergence or coming into being with promise.',
        contextRecommendations: [
          { word: 'inchoate', recommendedRegister: 'Intellectual / Structural', exampleSentence: 'An inchoate grievance that had not yet crystallized into policy demands.' },
          { word: 'embryonic', recommendedRegister: 'Organizational / Developmental', exampleSentence: 'The company\'s international branch was still in an embryonic state.' },
          { word: 'nascent', recommendedRegister: 'Historical / Sociological', exampleSentence: 'A nascent democracy struggling against entrenched autocrats.' },
        ],
      },
      created_at: past5Mins,
      srs: {
        card_id: '00000000-0000-0000-0000-000000000003',
        user_id: userId,
        due: past5Mins, // Due now
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
    {
      id: '00000000-0000-0000-0000-000000000004',
      user_id: userId,
      term: 'apocryphal',
      part_of_speech: 'adjective',
      phonetic: '/əˈpɒk.rɪ.fəl/',
      primary_definition: '(Of a story or statement) of doubtful authenticity, although widely circulated as being true.',
      nuance_note: 'Distinct from a blatant lie; apocryphal tales often survive precisely because they are evocative, poetic, or illustrate a symbolic truth about a historical figure even if factually spurious.',
      etymology: {
        roots: [
          { morpheme: 'apo-', meaning: 'away / off / from', origin: 'Greek' },
          { morpheme: 'kryptein', meaning: 'to hide / conceal', origin: 'Greek' },
        ],
        cognates: ['cryptic', 'cryptography', 'crypt'],
      },
      collocations: ['apocryphal anecdote', 'apocryphal tale', 'apocryphal origins', 'widely apocryphal'],
      source_context: {
        sentence: 'The legend of Newton and the falling apple is likely apocryphal, yet it retains immense pedagogical power.',
        source: 'History of Science Quarterly',
      },
      cloze_sentences: [
        'Most historians regard the quote attributed to Marie Antoinette as completely {{c1::apocryphal}}.',
        'Despite its {{c1::apocryphal}} nature, the story became central to the city\'s civic mythology.',
      ],
      distinction_matrix: {
        synonyms: ['apocryphal', 'spurious', 'mythical'],
        nuanceComparison: 'Apocryphal denotes stories believed widely but lacking provenance; spurious denotes actively forged, illegitimate, or deceitful claims; mythical elevates the lore to overarching archetypal narrative.',
        contextRecommendations: [
          { word: 'apocryphal', recommendedRegister: 'Biographical / Historiographical', exampleSentence: 'An apocryphal memo circulated by later biographers to embellish his courage.' },
          { word: 'spurious', recommendedRegister: 'Academic / Forensic', exampleSentence: 'The artifact was proven spurious by carbon dating.' },
          { word: 'mythical', recommendedRegister: 'Literary / Folkloric', exampleSentence: 'The mythical founding fathers cast long shadows over the republic.' },
        ],
      },
      created_at: now.toISOString(),
      srs: {
        card_id: '00000000-0000-0000-0000-000000000004',
        user_id: userId,
        due: future1Day, // Due tomorrow (not due)
        stability: 6.8,
        difficulty: 4.2,
        elapsed_days: 1,
        scheduled_days: 1,
        reps: 3,
        lapses: 0,
        state: 2, // Review
        last_review: now.toISOString(),
      },
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      user_id: userId,
      term: 'susurrus',
      part_of_speech: 'noun',
      phonetic: '/sʊˈsʌr.əs/',
      primary_definition: 'A whispering sound; a low, continuous murmuring, rustling, or humming.',
      nuance_note: 'A sensory onomatopoetic Latinate term reserved for poetic or highly lyrical prose. Implies gentle acoustic immersion, such as leaves in a breeze or muffled theater whispers.',
      etymology: {
        roots: [
          { morpheme: 'susurrare', meaning: 'to whisper / hum', origin: 'Latin' },
        ],
        cognates: ['susurration', 'susurrant'],
      },
      collocations: ['gentle susurrus', 'distant susurrus', 'susurrus of leaves', 'susurrus of the crowd'],
      source_context: {
        sentence: 'A faint susurrus swept through the auditorium as the curtain rose on the shadowed set.',
        source: 'The Atlantic Review',
      },
      cloze_sentences: [
        'The nocturnal forest was quiet save for the rhythmic {{c1::susurrus}} of the pines in the evening breeze.',
        'In the grand reading room, the only sound was the faint {{c1::susurrus}} of turning pages.',
      ],
      distinction_matrix: {
        synonyms: ['susurrus', 'murmur', 'whisper'],
        nuanceComparison: 'Susurrus is elevated and lyrical, capturing the acoustic texture of rustling nature or collective soft sound; murmur carries emotional indistinctness or mild collective dissent; whisper is an intentional low vocalization or faint sound.',
        contextRecommendations: [
          { word: 'susurrus', recommendedRegister: 'Literary / Lyrical', exampleSentence: 'The susurrus of willow boughs trailing in the stream.' },
          { word: 'murmur', recommendedRegister: 'Narrative / Conversational', exampleSentence: 'A murmur of approval rippled through the audience.' },
          { word: 'whisper', recommendedRegister: 'Universal / Dramatic', exampleSentence: 'She leaned in with a hushed whisper.' },
        ],
      },
      created_at: now.toISOString(),
      srs: {
        card_id: '00000000-0000-0000-0000-000000000005',
        user_id: userId,
        due: future5Days, // Due in 5 days (not due)
        stability: 14.2,
        difficulty: 3.5,
        elapsed_days: 4,
        scheduled_days: 5,
        reps: 4,
        lapses: 0,
        state: 2, // Review
        last_review: now.toISOString(),
      },
    },
  ];
}
