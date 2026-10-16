import { LexicalEnrichmentPayload } from './schema';
import { PHILOSOPHICAL_SEED_CARDS } from '@/lib/db/philosophical-seed-data';

export type CuratedLexiconEntry = Omit<LexicalEnrichmentPayload, 'term' | 'language'> & {
  language?: 'en' | 'es';
  gender?: 'masculine' | 'feminine' | 'neuter' | null;
  english_gloss?: string | null;
};

// ============================================================================
// Curated Spanish Vocabulary (Dual-Language Support — ADR-013)
// ============================================================================
const SPANISH_CURATED_ENTRIES: Record<string, CuratedLexiconEntry> = {
  desahuciado: {
    language: 'es',
    gender: 'masculine',
    english_gloss: 'terminal, hopeless, evicted',
    part_of_speech: 'adjective',
    phonetic: '/desawˈsjaðo/',
    primary_definition: 'Dicho de una persona enferma: que no tiene esperanza de curación; desprovisto de todo auxilio o amparo legal o moral.',
    nuance_note: 'Registra tanto el desahucio clínico irreversible como el desamparo existencial y social. Falsos amigos: no confundir con un mero desalojo civil sin la carga de fatalidad trágica.',
    etymology: {
      roots: [
        { morpheme: 'des-', meaning: 'privación / negación', origin: 'Latin' },
        { morpheme: 'afiuciar / fidere', meaning: 'dar fianza o confianza (fides)', origin: 'Latin' },
        { morpheme: '-ado', meaning: 'participio pasivo / cualidad alcanzada', origin: 'Latin' },
      ],
      cognates: ['desahucio', 'fianza', 'fidedigno', 'desconfianza'],
    },
    collocations: ['enfermo desahuciado', 'causa desahuciada', 'espíritu desahuciado', 'sentirse desahuciado'],
    source_context: {
      sentence: 'El médico contemplaba con pesar al paciente desahuciado, cuyo aliento apenas turbaba el aire.',
      source: 'Crónica Literaria',
    },
    cloze_sentences: [
      'En el pabellón de incurables yacía el anciano {{c1::desahuciado}}, entregado a sus últimas memorias.',
      'La defensa republicana parecía una empresa {{c1::desahuciada}} frente al avance implacable del ejército.',
    ],
    distinction_matrix: {
      synonyms: ['desahuciado', 'moribundo', 'desesperanzado'],
      nuanceComparison: 'Desahuciado implica una condena o sentencia formal de irremediabilidad (médica o existencial); moribundo describe el estado fisiológico de agonía inmediata; desesperanzado alude al estado anímico subjetivo de desilusión.',
      contextRecommendations: [
        { word: 'desahuciado', recommendedRegister: 'Literario / Forense / Trágico', exampleSentence: 'Un diagnóstico que dejaba al enfermo completamente desahuciado.' },
        { word: 'moribundo', recommendedRegister: 'Descriptivo / Clínico', exampleSentence: 'El moribundo murmuraba palabras ininteligibles.' },
        { word: 'desesperanzado', recommendedRegister: 'Psicológico / Narrativo', exampleSentence: 'Miró al horizonte con gesto desesperanzado.' },
      ],
    },
  },

  acontecer: {
    language: 'es',
    gender: null,
    english_gloss: 'to transpire, to happen (historical/solemn events)',
    part_of_speech: 'verb',
    phonetic: '/akonteˈseɾ/',
    primary_definition: 'Hacerse realidad un hecho; suceder o sobrevenir de manera solemne, histórica o trascendente.',
    nuance_note: 'Verbo de tercera persona o impersonal que denota gravedad histórica o designio inexorable del tiempo, infinitamente superior al cotidiano "pasar".',
    etymology: {
      roots: [
        { morpheme: 'a-', meaning: 'hacia / aproximación', origin: 'Latin' },
        { morpheme: 'contescere / texere', meaning: 'suceder en conjunto (cum + texere)', origin: 'Latin' },
        { morpheme: '-ecer', meaning: 'comienzo o desarrollo de acción', origin: 'Latin' },
      ],
      cognates: ['acontecimiento', 'acontencer'],
    },
    collocations: ['acontecer histórico', 'trágico acontecer', 'acontecer de los siglos', 'incierto acontecer'],
    source_context: {
      sentence: 'Nadie sospechaba lo que habría de acontecer aquella aciaga noche decembrina.',
      source: 'Anales del Reino',
    },
    cloze_sentences: [
      'El cronista registró con minucioso detalle cuanto vino a {{c1::acontecer}} tras la caída de la dinastía.',
      'Ignoraban el luctuoso suceso que estaba a punto de {{c1::acontecer}} en el palacio real.',
    ],
    distinction_matrix: {
      synonyms: ['acontecer', 'suceder', 'acaecer'],
      nuanceComparison: 'Acontecer evoca trascendencia histórica en el decurso temporal; suceder es el término genérico neutro; acaecer añade un matiz de suceso fortuito o inesperado de tinte arcaico.',
      contextRecommendations: [
        { word: 'acontecer', recommendedRegister: 'Historiográfico / Filosófico', exampleSentence: 'El acontecer humano no obedece a leyes mecánicas.' },
        { word: 'suceder', recommendedRegister: 'Periodístico / Coloquial', exampleSentence: 'El accidente sucedió en la avenida principal.' },
        { word: 'acaecer', recommendedRegister: 'Arcaizante / Literario', exampleSentence: 'El eclipse vino a acaecer en pleno solsticio de invierno.' },
      ],
    },
  },

  añoranza: {
    language: 'es',
    gender: 'feminine',
    english_gloss: 'nostalgia, wistful yearning, melancholy longing',
    part_of_speech: 'noun',
    phonetic: '/aɲoˈɾanθa/',
    primary_definition: 'Sentimiento de pena, dolor y melancolía que suscita el recuerdo de una persona, patria o dicha ausente.',
    nuance_note: 'Combina el anhelo punzante con el recuerdo tierno; de registro poético e íntimo, emparentado con el latín notus/gnorare ("hacer memoria con sentimiento").',
    etymology: {
      roots: [
        { morpheme: 'enyorar', meaning: 'recordar con pena / echar de menos', origin: 'Catalan' },
        { morpheme: 'notus / gnorare', meaning: 'conocer / tener noción en mente', origin: 'Latin' },
        { morpheme: '-anza', meaning: 'cualidad o estado anímico duradero', origin: 'Latin' },
      ],
      cognates: ['añorar', 'noción', 'ignorar', 'cognición'],
    },
    collocations: ['profunda añoranza', 'añoranza de la patria', 'sentir añoranza', 'dulce añoranza'],
    source_context: {
      sentence: 'El exiliado contemplaba el mar con una callada añoranza que consumía sus tardes.',
      source: 'Memorias de Ultramar',
    },
    cloze_sentences: [
      'Aquel vals evocaba en la anciana marquesa una punzante {{c1::añoranza}} de los salones vieneses.',
      'Escribió sus versos más desgarradores impulsado por la {{c1::añoranza}} del hogar perdido.',
    ],
    distinction_matrix: {
      synonyms: ['añoranza', 'nostalgia', 'morriña'],
      nuanceComparison: 'Añoranza enfatiza la pena sentimental por la persona o tiempo ausente; nostalgia posee un carácter más abarcador y cultural; morriña es la melancolía específica ligada al desarraigo de la tierra natal gallega.',
      contextRecommendations: [
        { word: 'añoranza', recommendedRegister: 'Lírico / Poético', exampleSentence: 'Una añoranza otoñal embargaba la correspondencia epistolar.' },
        { word: 'nostalgia', recommendedRegister: 'Universal / Psicológico', exampleSentence: 'La juventud sentía nostalgia de utopías colectivas pasadas.' },
        { word: 'morriña', recommendedRegister: 'Regional / Afectivo', exampleSentence: 'Lejos de las rías, le invadió una densa morriña.' },
      ],
    },
  },

  ojalá: {
    language: 'es',
    gender: null,
    english_gloss: 'would that, God grant, I wish (subjunctive trigger)',
    part_of_speech: 'interjection',
    phonetic: '/oxaˈla/',
    primary_definition: 'Interjección que denota vivo deseo de que suceda algo favorable; rige obligatoriamente el modo subjuntivo.',
    nuance_note: 'Directamente procedente del árabe andalusí "law sha\'a Allah" (si Dios quisiera). En prosa culta expresa una súplica vehemente o un anhelo de destino cósmico.',
    etymology: {
      roots: [
        { morpheme: "law sha'a Allah", meaning: 'si Dios quisiera / Dios quiera', origin: 'Arabic' },
      ],
      cognates: ['ole', 'alhamdu'],
    },
    collocations: ['ojalá llueva', 'ojalá pudiera', 'ojalá fuera verdad', 'clamar un ojalá'],
    source_context: {
      sentence: 'Miró las cenizas y murmuró: ¡Ojalá la historia no repita semejante ceguera!',
      source: 'Cuadernos del Exilio',
    },
    cloze_sentences: [
      'Los labradores contemplaban el cielo reseco exclamando: {{c1::¡ojalá::ojalá}} el viento traiga tormenta.',
      '{{c1::Ojalá}} el porvenir recompense los sacrificios de esta hora incierta.',
    ],
    distinction_matrix: {
      synonyms: ['ojalá', 'pluguiera', 'así fuera'],
      nuanceComparison: 'Ojalá expresa el deseo activo con vibración arábiga y vigor verbal; pluguiera es una fórmula arcaica y solemne derivada del latín placere; así fuera manifiesta resignación anhelante.',
      contextRecommendations: [
        { word: 'ojalá', recommendedRegister: 'Expresivo / Literario', exampleSentence: 'Ojalá las musas iluminen el empeño del poeta.' },
        { word: 'pluguiera', recommendedRegister: 'Áureo / Solemne', exampleSentence: 'Pluguiera al cielo que hubiésemos llegado a tiempo.' },
        { word: 'así fuera', recommendedRegister: 'Lírico / Elegíaco', exampleSentence: 'Así fuera en un sueño fugaz, anhelaba volver a su lado.' },
      ],
    },
  },

  sobrecoger: {
    language: 'es',
    gender: null,
    english_gloss: 'to awe, to overwhelm with dread or sublimity',
    part_of_speech: 'verb',
    phonetic: '/sobɾekoˈxeɾ/',
    primary_definition: 'Impresionar fuertemente a alguien con pavor, asombro o profunda reverencia ante lo sublime o lo trágico.',
    nuance_note: 'Expresa una conmoción íntima donde convergen el asombro estético y el temor reverencial. Extrae el lema en infinitivo con alternancia consonántica en conjugación (sobrecojo).',
    etymology: {
      roots: [
        { morpheme: 'sobre-', meaning: 'por encima / en grado sumo (super)', origin: 'Latin' },
        { morpheme: 'coger (colligere)', meaning: 'juntar / abrazar / atrapar', origin: 'Latin' },
        { morpheme: '-er', meaning: 'terminación verbal infinitiva', origin: 'Latin' },
      ],
      cognates: ['sobrecogimiento', 'acoger', 'recoger', 'encoger'],
    },
    collocations: ['silencio que sobrecoge', 'espectáculo sobrecogedor', 'sobrecoger el ánimo', 'sobrecoger el corazón'],
    source_context: {
      sentence: 'La inmensidad del abismo sobrecogió a los expedicionarios en la cima.',
      source: 'Relatos de Alta Montaña',
    },
    cloze_sentences: [
      'Aquel grito en mitad de la noche vino a {{c1::sobrecoger}} a toda la aldea dormida.',
      'La majestuosidad del templo milenario alcanzaba a {{c1::sobrecoger}} al viajero más escéptico.',
    ],
    distinction_matrix: {
      synonyms: ['sobrecoger', 'estremecer', 'atemorizar'],
      nuanceComparison: 'Sobrecoger enfatiza una conmoción interna de asombro o pavor sublime; estremecer resalta el temblor físico o vibración somática; atemorizar se limita a infundir cobardía o miedo ordinario.',
      contextRecommendations: [
        { word: 'sobrecoger', recommendedRegister: 'Lírico / Sublime / Trágico', exampleSentence: 'La majestad del glaciar lograba sobrecoger el ánimo del artista.' },
        { word: 'estremecer', recommendedRegister: 'Dramático / Sensorial', exampleSentence: 'Un bramido lejano estremeció los cimientos del baluarte.' },
        { word: 'atemorizar', recommendedRegister: 'Narrativo / Psicológico', exampleSentence: 'El tirano pretendía atemorizar a la población con castigos ejemplares.' },
      ],
    },
  },
};

// ============================================================================
// Curated 100 Philosophical & Literary Foundational Entries
// ============================================================================
const PHILOSOPHICAL_ENTRIES: Record<string, CuratedLexiconEntry> = {};

for (const card of PHILOSOPHICAL_SEED_CARDS) {
  PHILOSOPHICAL_ENTRIES[card.term.toLowerCase()] = {
    language: 'en',
    gender: null,
    english_gloss: null,
    part_of_speech: card.part_of_speech,
    phonetic: card.phonetic,
    primary_definition: card.primary_definition,
    nuance_note: card.nuance_note,
    etymology: card.etymology,
    collocations: card.collocations,
    source_context: {
      sentence: card.source_context.sentence,
      source: card.source_context.source,
      author: card.source_context.author || null,
    },
    cloze_sentences: card.cloze_sentences,
    distinction_matrix: card.distinction_matrix,
  };
}

export const CURATED_LEXICON: Record<string, CuratedLexiconEntry> = {
  ...PHILOSOPHICAL_ENTRIES,
  ...SPANISH_CURATED_ENTRIES,
};
