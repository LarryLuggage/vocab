import { LexicalEnrichmentPayload } from './schema';

export const CURATED_LEXICON: Record<string, Omit<LexicalEnrichmentPayload, 'term'>> = {
  perspicacious: {
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
  },

  solipsism: {
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
  },

  inchoate: {
    part_of_speech: 'adjective',
    phonetic: '/ɪnˈkoʊ.eɪt/',
    primary_definition: 'Just begun and so not fully formed or developed; rudimentary; disorganized.',
    nuance_note: 'Carries a sense of nascent potential paired with formlessness. It refers not merely to something young, but to something still chaotic or unarticulated awaiting coherence.',
    etymology: {
      roots: [
        { morpheme: 'inchoare', meaning: 'to begin / commence', origin: 'Latin' },
        { morpheme: '-ate', meaning: 'characterized by', origin: 'Latin' },
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
  },

  apocryphal: {
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
  },

  susurrus: {
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
  },

  obfuscate: {
    part_of_speech: 'verb',
    phonetic: '/ˈɒb.fə.skeɪt/',
    primary_definition: 'To deliberately make obscure, unclear, or unintelligible; to bewilder or confuse.',
    nuance_note: 'Implies calculated or systemic concealment of truth through convoluted jargon or misleading rhetoric, rather than accidental ambiguity.',
    etymology: {
      roots: [
        { morpheme: 'ob-', meaning: 'over / completely', origin: 'Latin' },
        { morpheme: 'fuscare', meaning: 'to darken / make dusky', origin: 'Latin' },
      ],
      cognates: ['fuscous', 'obfuscation'],
    },
    collocations: ['deliberately obfuscate', 'obfuscate the truth', 'obfuscate regulatory oversight', 'bureaucratic obfuscation'],
    source_context: {
      sentence: 'The spokesman\'s verbose response seemed calculated to obfuscate the committee\'s findings.',
      source: 'Parliamentary Chronicle',
    },
    cloze_sentences: [
      'Legal teams often draft contracts with convoluted phrasing to {{c1::obfuscate}} unfavorable arbitration clauses.',
      'Rather than admitting error, the minister attempted to {{c1::obfuscate}} the policy failure with macroeconomic jargon.',
    ],
    distinction_matrix: {
      synonyms: ['obfuscate', 'confuse', 'equivocate'],
      nuanceComparison: 'Obfuscate denotes deliberately casting darkness or complexity over facts; confuse is the generic creation of mental perplexity; equivocate is using ambiguous language specifically to avoid taking a stand or telling the truth.',
      contextRecommendations: [
        { word: 'obfuscate', recommendedRegister: 'Legal / Political / Technical', exampleSentence: 'The defense attempted to obfuscate the financial ledger trail.' },
        { word: 'confuse', recommendedRegister: 'Conversational / General', exampleSentence: 'The sudden change in schedule will confuse the staff.' },
        { word: 'equivocate', recommendedRegister: 'Diplomatic / Ethical', exampleSentence: 'Under cross-examination, the witness began to equivocate.' },
      ],
    },
  },

  ephemeral: {
    part_of_speech: 'adjective',
    phonetic: '/ɪˈfem.ər.əl/',
    primary_definition: 'Lasting for a very short time; transitory; fleeting.',
    nuance_note: 'Evokes a melancholic or poetic appreciation for beauty and existence that blossoms brilliantly and dissolves rapidly, rooted in biological or natural transience.',
    etymology: {
      roots: [
        { morpheme: 'epi-', meaning: 'on / for', origin: 'Greek' },
        { morpheme: 'hemera', meaning: 'day', origin: 'Greek' },
      ],
      cognates: ['ephemera', 'ephemeris'],
    },
    collocations: ['ephemeral beauty', 'ephemeral nature', 'ephemeral pleasure', 'ephemeral fame'],
    source_context: {
      sentence: 'The installation artist reflected upon the ephemeral nature of ice sculptures under the spring sun.',
      source: 'Contemporary Art Review',
    },
    cloze_sentences: [
      'Digital social fame is notoriously {{c1::ephemeral}}, often fading within days of algorithmic prominence.',
      'The morning fog lent the mountain valley an {{c1::ephemeral}} majesty that vanished as noon approached.',
    ],
    distinction_matrix: {
      synonyms: ['ephemeral', 'transient', 'evanescent'],
      nuanceComparison: 'Ephemeral highlights the brief lifespan of a thing (originally a single day); transient refers to something passing through without settling; evanescent describes something fragile that vaporizes or vanishes almost imperceptibly.',
      contextRecommendations: [
        { word: 'ephemeral', recommendedRegister: 'Philosophical / Aesthetic', exampleSentence: 'The ephemeral blooming of the night-blooming cereus.' },
        { word: 'transient', recommendedRegister: 'Sociological / Analytical', exampleSentence: 'A transient population of migratory workers.' },
        { word: 'evanescent', recommendedRegister: 'Poetic / Literary', exampleSentence: 'An evanescent scent of jasmine on the dusk breeze.' },
      ],
    },
  },
};
