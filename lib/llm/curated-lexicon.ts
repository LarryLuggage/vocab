import { LexicalEnrichmentPayload } from './schema';

export const CURATED_LEXICON: Record<
  string,
  Omit<LexicalEnrichmentPayload, 'term' | 'language'> & {
    language?: 'en' | 'es';
    gender?: 'masculine' | 'feminine' | 'neuter' | null;
    english_gloss?: string | null;
  }
> = {
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
