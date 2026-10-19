import { CardWithSrs, VocabCard } from '@/types/lexis';
import { DEFAULT_USER_ID } from './seed-data';

export { DEFAULT_USER_ID };

type SpanishSeedBase = Omit<
  VocabCard,
  'id' | 'user_id' | 'language' | 'is_fallback' | 'enrichment_source' | 'created_at'
>;

const RAW_SPANISH_LITERARY_TERMS: SpanishSeedBase[] = [
  // 1. desahuciado
  {
    term: 'desahuciado',
    gender: 'masculine',
    english_gloss: 'terminal, hopeless, evicted',
    part_of_speech: 'adjective',
    phonetic: '/desawˈsjaðo/',
    primary_definition:
      'Dicho de una persona enferma: que no tiene esperanza de curación; desprovisto de todo auxilio o amparo legal o moral.',
    nuance_note:
      'Registra tanto el desahucio clínico irreversible como el desamparo existencial y social. Falsos amigos: no confundir con un mero desalojo civil sin la carga de fatalidad trágica.',
    etymology: {
      roots: [
        { morpheme: 'des-', meaning: 'privación / negación', origin: 'Latin' },
        { morpheme: 'afiuciar / fidere', meaning: 'dar fianza o confianza (fides)', origin: 'Latin' },
        { morpheme: '-ado', meaning: 'participio pasivo / cualidad alcanzada', origin: 'Latin' },
      ],
      cognates: ['desahucio', 'fianza', 'fidedigno', 'desconfianza'],
    },
    collocations: [
      'enfermo desahuciado',
      'causa desahuciada',
      'espíritu desahuciado',
      'sentirse desahuciado',
    ],
    source_context: {
      sentence:
        'El hombre que sabe que está desahuciado por la carne descubre con asombro su hambre de inmortalidad.',
      source: 'Del sentimiento trágico de la vida',
      author: 'Miguel de Unamuno',
    },
    cloze_sentences: [
      'En el pabellón de incurables yacía el anciano {{c1::desahuciado}}, entregado a sus últimas memorias.',
      'La defensa republicana parecía una empresa {{c1::desahuciada}} frente al avance implacable del ejército.',
    ],
    distinction_matrix: {
      synonyms: ['desahuciado', 'moribundo', 'desesperanzado'],
      nuanceComparison:
        'Desahuciado implica una condena o sentencia formal de irremediabilidad (médica o existencial); moribundo describe el estado fisiológico de agonía inmediata; desesperanzado alude al estado anímico subjetivo de desilusión.',
      contextRecommendations: [
        {
          word: 'desahuciado',
          recommendedRegister: 'Literario / Forense / Trágico',
          exampleSentence: 'Un diagnóstico que dejaba al enfermo completamente desahuciado.',
        },
        {
          word: 'moribundo',
          recommendedRegister: 'Descriptivo / Clínico',
          exampleSentence: 'El moribundo murmuraba palabras ininteligibles.',
        },
        {
          word: 'desesperanzado',
          recommendedRegister: 'Psicológico / Narrativo',
          exampleSentence: 'Miró al horizonte con gesto desesperanzado.',
        },
      ],
    },
  },

  // 2. acontecer
  {
    term: 'acontecer',
    gender: null,
    english_gloss: 'to transpire, to happen (historical/solemn events)',
    part_of_speech: 'verb',
    phonetic: '/akonteˈseɾ/',
    primary_definition:
      'Hacerse realidad un hecho; suceder o sobrevenir de manera solemne, histórica o trascendente.',
    nuance_note:
      'Verbo defectivo de tercera persona o sustantivado ("el acontecer") que denota gravedad histórica o designio inexorable del tiempo, infinitamente superior al cotidiano "pasar".',
    etymology: {
      roots: [
        { morpheme: 'a-', meaning: 'hacia / aproximación', origin: 'Latin' },
        { morpheme: 'contescere / contingere', meaning: 'tocar / suceder en conjunto', origin: 'Latin' },
        { morpheme: '-ecer', meaning: 'comienzo o desarrollo de acción', origin: 'Latin' },
      ],
      cognates: ['acontecimiento', 'contingencia', 'contingente'],
    },
    collocations: [
      'acontecer histórico',
      'trágico acontecer',
      'acontecer de los siglos',
      'incierto acontecer',
    ],
    source_context: {
      sentence:
        'El hombre no tiene naturaleza, sino que tiene historia; su ser es un puro acontecer dramático.',
      source: 'Historia como sistema',
      author: 'José Ortega y Gasset',
    },
    cloze_sentences: [
      'El cronista registró con minucioso detalle cuanto vino a {{c1::acontecer}} tras la caída de la dinastía.',
      'Ignoraban el luctuoso suceso que estaba a punto de {{c1::acontecer}} en el palacio real.',
    ],
    distinction_matrix: {
      synonyms: ['acontecer', 'suceder', 'acaecer'],
      nuanceComparison:
        'Acontecer evoca trascendencia histórica en el decurso temporal; suceder es el término genérico neutro; acaecer añade un matiz de suceso fortuito o inesperado de tinte arcaico.',
      contextRecommendations: [
        {
          word: 'acontecer',
          recommendedRegister: 'Historiográfico / Filosófico',
          exampleSentence: 'El acontecer humano no obedece a leyes mecánicas.',
        },
        {
          word: 'suceder',
          recommendedRegister: 'Periodístico / Coloquial',
          exampleSentence: 'El accidente sucedió en la avenida principal.',
        },
        {
          word: 'acaecer',
          recommendedRegister: 'Arcaizante / Literario',
          exampleSentence: 'El eclipse vino a acaecer en pleno solsticio de invierno.',
        },
      ],
    },
  },

  // 3. añoranza
  {
    term: 'añoranza',
    gender: 'feminine',
    english_gloss: 'nostalgia, wistful yearning, melancholy longing',
    part_of_speech: 'noun',
    phonetic: '/aɲoˈɾanθa/',
    primary_definition:
      'Sentimiento de pena, dolor y melancolía que suscita el recuerdo de una persona, patria o dicha ausente.',
    nuance_note:
      'Combina el anhelo punzante con el recuerdo tierno; de registro poético e íntimo, emparentado con el catalán "enyorar" y el latín "ignotus/gnorare".',
    etymology: {
      roots: [
        { morpheme: 'enyorar', meaning: 'recordar con pena / echar de menos', origin: 'Catalan' },
        { morpheme: 'notus / gnorare', meaning: 'conocer / tener noción en mente', origin: 'Latin' },
        { morpheme: '-anza', meaning: 'cualidad o estado anímico duradero', origin: 'Latin' },
      ],
      cognates: ['añorar', 'noción', 'ignorar', 'cognición'],
    },
    collocations: [
      'profunda añoranza',
      'añoranza de la patria',
      'sentir añoranza',
      'dulce añoranza',
    ],
    source_context: {
      sentence:
        'Todo exilio engendra una secreta añoranza que transfigura la geografía perdida en paraíso intemporal.',
      source: 'Los claros del bosque',
      author: 'María Zambrano',
    },
    cloze_sentences: [
      'Aquel vals evocaba en la anciana marquesa una punzante {{c1::añoranza}} de los salones vieneses.',
      'Escribió sus versos más desgarradores impulsado por la {{c1::añoranza}} del hogar perdido.',
    ],
    distinction_matrix: {
      synonyms: ['añoranza', 'nostalgia', 'morriña'],
      nuanceComparison:
        'Añoranza enfatiza la pena sentimental por la persona o tiempo ausente; nostalgia posee un carácter más abarcador y cultural; morriña es la melancolía específica ligada al desarraigo de la tierra natal gallega.',
      contextRecommendations: [
        {
          word: 'añoranza',
          recommendedRegister: 'Lírico / Poético',
          exampleSentence: 'Una añoranza otoñal embargaba la correspondencia epistolar.',
        },
        {
          word: 'nostalgia',
          recommendedRegister: 'Universal / Psicológico',
          exampleSentence: 'La juventud sentía nostalgia de utopías colectivas pasadas.',
        },
        {
          word: 'morriña',
          recommendedRegister: 'Regional / Afectivo',
          exampleSentence: 'Lejos de las rías, le invadió una densa morriña.',
        },
      ],
    },
  },

  // 4. ojalá
  {
    term: 'ojalá',
    gender: null,
    english_gloss: 'would that, God grant, I wish (subjunctive trigger)',
    part_of_speech: 'interjection',
    phonetic: '/oxaˈla/',
    primary_definition:
      'Interjección que denota vivo deseo de que suceda algo favorable; rige obligatoriamente el modo subjuntivo.',
    nuance_note:
      'Directamente procedente del árabe andalusí "law sha\'a Allah" (si Dios quisiera). En prosa culta expresa una súplica vehemente o un anhelo de destino cósmico con imperfecto o pluscuamperfecto de subjuntivo.',
    etymology: {
      roots: [
        { morpheme: "law sha'a Allah", meaning: 'si Dios quisiera / Dios quiera', origin: 'Arabic (Árabe Andalusí)' },
      ],
      cognates: ['inshallah', 'alhamdu'],
    },
    collocations: [
      'ojalá llueva',
      'ojalá pudiera',
      'ojalá fuera verdad',
      'clamar un ojalá',
    ],
    source_context: {
      sentence:
        '¡Ojalá los lectores de estas páginas compartan siquiera un instante la perplejidad que las dictó!',
      source: 'Otras inquisiciones',
      author: 'Jorge Luis Borges',
    },
    cloze_sentences: [
      'Los labradores contemplaban el cielo reseco exclamando: {{c1::¡ojalá::ojalá}} el viento traiga tormenta.',
      '{{c1::Ojalá}} el porvenir recompense los sacrificios de esta hora incierta.',
    ],
    distinction_matrix: {
      synonyms: ['ojalá', 'pluguiera', 'así fuera'],
      nuanceComparison:
        'Ojalá expresa el deseo activo con vibración arábiga y vigor verbal; pluguiera es una fórmula arcaica y solemne derivada del latín placere; así fuera manifiesta resignación anhelante.',
      contextRecommendations: [
        {
          word: 'ojalá',
          recommendedRegister: 'Expresivo / Literario',
          exampleSentence: 'Ojalá las musas iluminen el empeño del poeta.',
        },
        {
          word: 'pluguiera',
          recommendedRegister: 'Áureo / Solemne',
          exampleSentence: 'Pluguiera al cielo que hubiésemos llegado a tiempo.',
        },
        {
          word: 'así fuera',
          recommendedRegister: 'Lírico / Elegíaco',
          exampleSentence: 'Así fuera en un sueño fugaz, anhelaba volver a su lado.',
        },
      ],
    },
  },

  // 5. sobrecoger
  {
    term: 'sobrecoger',
    gender: null,
    english_gloss: 'to awe, to overwhelm with dread or sublimity',
    part_of_speech: 'verb',
    phonetic: '/sobɾekoˈxeɾ/',
    primary_definition:
      'Impresionar fuertemente a alguien con pavor, asombro o profunda reverencia ante lo sublime o lo trágico.',
    nuance_note:
      'Expresa una conmoción íntima donde convergen el asombro estético y el temor reverencial. Presenta alternancia ortográfica g/j ante o/a (sobrecojo, sobrecoja).',
    etymology: {
      roots: [
        { morpheme: 'sobre-', meaning: 'por encima / en grado sumo (super)', origin: 'Latin' },
        { morpheme: 'coger (colligere)', meaning: 'juntar / abrazar / atrapar', origin: 'Latin' },
        { morpheme: '-er', meaning: 'terminación verbal infinitiva', origin: 'Latin' },
      ],
      cognates: ['sobrecogimiento', 'acoger', 'recoger', 'encoger'],
    },
    collocations: [
      'silencio que sobrecoge',
      'espectáculo sobrecogedor',
      'sobrecoger el ánimo',
      'sobrecoger el corazón',
    ],
    source_context: {
      sentence:
        'La contemplación de la bóveda estrellada basta para sobrecoger el espíritu más arrogante.',
      source: 'Visión de Anáhuac',
      author: 'Alfonso Reyes',
    },
    cloze_sentences: [
      'Aquel grito en mitad de la noche vino a {{c1::sobrecoger}} a toda la aldea dormida.',
      'La majestuosidad del templo milenario alcanzaba a {{c1::sobrecoger}} al viajero más escéptico.',
    ],
    distinction_matrix: {
      synonyms: ['sobrecoger', 'estremecer', 'atemorizar'],
      nuanceComparison:
        'Sobrecoger enfatiza una conmoción interna de asombro o pavor sublime; estremecer resalta el temblor físico o vibración somática; atemorizar se limita a infundir cobardía o miedo ordinario.',
      contextRecommendations: [
        {
          word: 'sobrecoger',
          recommendedRegister: 'Lírico / Sublime / Trágico',
          exampleSentence: 'La majestad del glaciar lograba sobrecoger el ánimo del artista.',
        },
        {
          word: 'estremecer',
          recommendedRegister: 'Dramático / Sensorial',
          exampleSentence: 'Un bramido lejano estremeció los cimientos del baluarte.',
        },
        {
          word: 'atemorizar',
          recommendedRegister: 'Narrativo / Psicológico',
          exampleSentence: 'El tirano pretendía atemorizar a la población con castigos ejemplares.',
        },
      ],
    },
  },

  // 6. desasosiego
  {
    term: 'desasosiego',
    gender: 'masculine',
    english_gloss: 'existential disquiet, restlessness, inner turmoil',
    part_of_speech: 'noun',
    phonetic: '/desasoˈsjeɣo/',
    primary_definition:
      'Falta de quietud, serenidad o paz interior; inquietud honda del espíritu ante la incertidumbre vital.',
    nuance_note:
      'Término predilecto del ensayo existencial hispánico y lusófono; supera la mera "ansiedad" clínica para designar una intranquilidad metafísica y lúcida.',
    etymology: {
      roots: [
        { morpheme: 'des-', meaning: 'privación / inversión', origin: 'Latin' },
        { morpheme: 'asosegar (sessicare)', meaning: 'asentar / aquietar', origin: 'Latin' },
      ],
      cognates: ['sosiego', 'asosegar', 'desasosegar', 'sede'],
    },
    collocations: [
      'íntimo desasosiego',
      'profundo desasosiego',
      'sembrar el desasosiego',
      'perpetuo desasosiego',
    ],
    source_context: {
      sentence:
        'En el fondo de toda lucidez moderna late un invencible desasosiego que ninguna ortodoxia logra apaciguar.',
      source: 'El arco y la lira',
      author: 'Octavio Paz',
    },
    cloze_sentences: [
      'La lectura de aquellas cartas inéditas dejó en su espíritu un extraño {{c1::desasosiego}}.',
      'Caminaba por los muelles neblinosos intentando aplacar el {{c1::desasosiego}} de la espera.',
    ],
    distinction_matrix: {
      synonyms: ['desasosiego', 'inquietud', 'ansiedad'],
      nuanceComparison:
        'Desasosiego designa una pérdida grave de la paz espiritual con resonancia literaria; inquietud es más general y puede ser curiosidad intelectual; ansiedad pertenece al registro clínico o psicológico.',
      contextRecommendations: [
        {
          word: 'desasosiego',
          recommendedRegister: 'Filosófico / Literario',
          exampleSentence: 'El libro del desasosiego retrata la fragmentación del alma urbana.',
        },
        {
          word: 'inquietud',
          recommendedRegister: 'Ensayístico / Culto',
          exampleSentence: 'Mostró desde joven una viva inquietud por las letras clásicas.',
        },
        {
          word: 'ansiedad',
          recommendedRegister: 'Clínico / Cotidiano',
          exampleSentence: 'El paciente presentaba síntomas agudos de ansiedad.',
        },
      ],
    },
  },

  // 7. zozobra
  {
    term: 'zozobra',
    gender: 'feminine',
    english_gloss: 'anguished uncertainty, capsizing, spiritual distress',
    part_of_speech: 'noun',
    phonetic: '/soˈsobɾa/',
    primary_definition:
      'Aflicción, congoja e incertidumbre extrema del ánimo que no deja sosegar, semejante al peligro de naufragio.',
    nuance_note:
      'Metáfora náutica ("zozobrar" el navío contra el viento) trasladada a la filosofía mexicana y panhispánica (Emilio Uranga, López Velarde) como oscilación ontológica entre el ser y la nada.',
    etymology: {
      roots: [
        { morpheme: 'sub-', meaning: 'debajo de', origin: 'Latin' },
        { morpheme: 'supra', meaning: 'encima de (volver lo de abajo arriba)', origin: 'Latin' },
      ],
      cognates: ['zozobrar', 'sobrar', 'soberano'],
    },
    collocations: [
      'vivir en zozobra',
      'constante zozobra',
      'zozobra espiritual',
      'horas de zozobra',
    ],
    source_context: {
      sentence:
        'Nuestra intimidad oscila en perpetua zozobra, suspendida entre dos abismos que se reclaman mutuamente.',
      source: 'El laberinto de la soledad',
      author: 'Octavio Paz',
    },
    cloze_sentences: [
      'Durante los meses del asedio, la ciudad entera vivió sumida en una angustiosa {{c1::zozobra}}.',
      'El navegante contempló con {{c1::zozobra}} cómo el horizonte se teñía de nubarrones negros.',
    ],
    distinction_matrix: {
      synonyms: ['zozobra', 'angustia', 'incertidumbre'],
      nuanceComparison:
        'Zozobra sugiere un vaivén pendular de peligro inminente o naufragio moral; angustia enfatiza la opresión visceral o existencial; incertidumbre es la mera falta cognitiva de certeza.',
      contextRecommendations: [
        {
          word: 'zozobra',
          recommendedRegister: 'Poético / Dramático',
          exampleSentence: 'Su corazón latía con zozobra ante el veredicto inminente.',
        },
        {
          word: 'angustia',
          recommendedRegister: 'Existencial / Psicológico',
          exampleSentence: 'La angustia de la finitud atraviesa la obra de Unamuno.',
        },
        {
          word: 'incertidumbre',
          recommendedRegister: 'Analítico / General',
          exampleSentence: 'La incertidumbre económica retrasó las inversiones.',
        },
      ],
    },
  },

  // 8. albedrío
  {
    term: 'albedrío',
    gender: 'masculine',
    english_gloss: 'free will, sovereign volition, caprice',
    part_of_speech: 'noun',
    phonetic: '/alβeˈðɾi.o/',
    primary_definition:
      'Potestad de obrar por reflexión y elección soberana; en especial en la locución "libre albedrío".',
    nuance_note:
      'Voz patrimonial de gran prosapia teológica y dramática (Calderón, Sor Juana) frente a su doblete culto "arbitrio". Usado solo ("a su albedrío") puede connotar capricho o voluntad sin freno.',
    etymology: {
      roots: [
        { morpheme: 'arbitrium', meaning: 'juicio / decisión / voluntad libre', origin: 'Latin' },
      ],
      cognates: ['arbitrio', 'arbitrario', 'árbitro', 'arbitrar'],
    },
    collocations: [
      'libre albedrío',
      'a su libre albedrío',
      'soberano albedrío',
      'rendir el albedrío',
    ],
    source_context: {
      sentence:
        'Ninguna tiranía exterior puede encadenar el libre albedrío de un entendimiento que busca la verdad.',
      source: 'Respuesta a Sor Filotea de la Cruz',
      author: 'Sor Juana Inés de la Cruz',
    },
    cloze_sentences: [
      'Los teólogos debatieron durante siglos la conciliación entre la gracia divina y el libre {{c1::albedrío}}.',
      'Dejó que la barca derivase al {{c1::albedrío}} de las corrientes fluviales.',
    ],
    distinction_matrix: {
      synonyms: ['albedrío', 'voluntad', 'arbitrio'],
      nuanceComparison:
        'Albedrío posee resonancia metafísica y moral respecto a la libertad humana ante el destino; voluntad es la facultad psíquica general de querer; arbitrio pertenece al ámbito jurídico o político.',
      contextRecommendations: [
        {
          word: 'albedrío',
          recommendedRegister: 'Filosófico / Teológico / Áureo',
          exampleSentence: 'El protagonista defiende su albedrío frente a los presagios.',
        },
        {
          word: 'voluntad',
          recommendedRegister: 'Éste / General',
          exampleSentence: 'Cumplió su cometido con férrea voluntad.',
        },
        {
          word: 'arbitrio',
          recommendedRegister: 'Jurídico / Político',
          exampleSentence: 'El impuesto quedó sujeto al arbitrio del gobernador.',
        },
      ],
    },
  },

  // 9. enajenación
  {
    term: 'enajenación',
    gender: 'feminine',
    english_gloss: 'alienation, estrangement, rapture/madness',
    part_of_speech: 'noun',
    phonetic: '/enaxenaˈsjon/',
    primary_definition:
      'Acción y efecto de pasar a ser ajeno a sí mismo; pérdida de la propia identidad, de la razón o del dominio sobre algo.',
    nuance_note:
      'Reúne tres registros de extraordinaria riqueza: el filosófico-sociológico (traduce el alemán Entfremdung/Alienation), el místico-estético (éxtasis o arrebato fuera de sí) y el jurídico-psiquiátrico.',
    etymology: {
      roots: [
        { morpheme: 'in-', meaning: 'hacia dentro / transformación', origin: 'Latin' },
        { morpheme: 'alienare (alienus)', meaning: 'hacer ajeno / perteneciente a otro', origin: 'Latin' },
        { morpheme: '-ción', meaning: 'acción y efecto', origin: 'Latin' },
      ],
      cognates: ['ajeno', 'enajenar', 'alienación', 'alienígena'],
    },
    collocations: [
      'enajenación mental',
      'enajenación del espíritu',
      'profunda enajenación',
      'enajenación contemporánea',
    ],
    source_context: {
      sentence:
        'La prisa técnica sumerge al ciudadano en una sutil enajenación donde vive fuera de sí mismo.',
      source: 'El hombre y la gente',
      author: 'José Ortega y Gasset',
    },
    cloze_sentences: [
      'El filósofo denunció la {{c1::enajenación}} del individuo reducido a mero engranaje mercantil.',
      'Escuchó la sonata en un estado de casi mística {{c1::enajenación}} estética.',
    ],
    distinction_matrix: {
      synonyms: ['enajenación', 'alienación', 'extravío'],
      nuanceComparison:
        'Enajenación es la voz patrimonial castiza de mayor hondura literaria ("hacerse ajeno"); alienación es el cultismo técnico sociológico directo; extravío enfatiza la desorientación moral o mental.',
      contextRecommendations: [
        {
          word: 'enajenación',
          recommendedRegister: 'Filosófico / Literario / Jurídico',
          exampleSentence: 'La soledad moderna nace de la enajenación de la palabra compartida.',
        },
        {
          word: 'alienación',
          recommendedRegister: 'Sociológico / Político',
          exampleSentence: 'Un estudio sobre la alienación laboral en la era industrial.',
        },
        {
          word: 'extravío',
          recommendedRegister: 'Moral / Narrativo',
          exampleSentence: 'Aquel episodio fue juzgado como un pasajero extravío de juventud.',
        },
      ],
    },
  },

  // 10. entelequia
  {
    term: 'entelequia',
    gender: 'feminine',
    english_gloss: 'entelechy, realized actuality; (fig.) pipe dream / unreal abstraction',
    part_of_speech: 'noun',
    phonetic: '/enteˈlekja/',
    primary_definition:
      'En la filosofía de Aristóteles, fin u objetivo de una actividad que la completa y perfecciona; en el uso culto moderno, cosa irreal o ideal inalcanzable.',
    nuance_note:
      'Curiosa inversión semántica: para Aristóteles significa la plenitud del ser actualizado ("tener el fin en sí mismo"), pero en español culto moderno suele emplearse irónicamente como ficción especulativa o abstracción nebulosa.',
    etymology: {
      roots: [
        { morpheme: 'en-', meaning: 'en / dentro', origin: 'Greek' },
        { morpheme: 'telos', meaning: 'fin / perfección / propósito', origin: 'Greek' },
        { morpheme: 'ekhein', meaning: 'tener / poseer', origin: 'Greek' },
      ],
      cognates: ['teleología', 'teleológico', 'telescopio'],
    },
    collocations: [
      'mera entelequia',
      'entelequia aristotélica',
      'convertirse en una entelequia',
      'vaga entelequia',
    ],
    source_context: {
      sentence:
        'No quiero ser una fría entelequia conceptual, sino un hombre de carne y hueso que sufre y sueña.',
      source: 'Niebla',
      author: 'Miguel de Unamuno',
    },
    cloze_sentences: [
      'Sin voluntad política, aquel tratado de paz quedó reducido a una vacua {{c1::entelequia}} diplomática.',
      'Para la metafísica peripatética, el alma constituye la primera {{c1::entelequia}} del cuerpo natural.',
    ],
    distinction_matrix: {
      synonyms: ['entelequia', 'abstracción', 'ficción'],
      nuanceComparison:
        'Entelequia designa una construcción mental de perfección teórica que carece de asidero empírico; abstracción es una operación intelectual legítima; ficción es una invención narrativa consciente.',
      contextRecommendations: [
        {
          word: 'entelequia',
          recommendedRegister: 'Filosófico / Ensayístico Irónico',
          exampleSentence: 'Su reforma administrativa resultó ser una inalcanzable entelequia.',
        },
        {
          word: 'abstracción',
          recommendedRegister: 'Científico / Epistemológico',
          exampleSentence: 'La matemática procede mediante rigurosas abstracciones.',
        },
        {
          word: 'ficción',
          recommendedRegister: 'Literario / Jurídico',
          exampleSentence: 'El derecho recurre a veces a una útil ficción legal.',
        },
      ],
    },
  },

  // 11. quimera
  {
    term: 'quimera',
    gender: 'feminine',
    english_gloss: 'chimera, pipe dream, seductive illusion',
    part_of_speech: 'noun',
    phonetic: '/kiˈmeɾa/',
    primary_definition:
      'Aquello que se propone a la imaginación como posible o verdadero, no siéndolo; ilusión seductora pero imposible.',
    nuance_note:
      'Evoca al monstruo mitológico híbrido (león, cabra y serpiente) para nombrar los espejismos ardientes de la ambición o del deseo poético.',
    etymology: {
      roots: [
        { morpheme: 'khimaira', meaning: 'cabra joven / monstruo mitológico que vomita fuego', origin: 'Greek' },
      ],
      cognates: ['quimérico', 'quimerista'],
    },
    collocations: [
      'perseguir una quimera',
      'vana quimera',
      'sueño quimérico',
      'alimentar quimeras',
    ],
    source_context: {
      sentence:
        'El buscador de absolutos consagró su vigilia a perseguir la hermosa quimera de un lenguaje universal.',
      source: 'El idioma analítico de John Wilkins',
      author: 'Jorge Luis Borges',
    },
    cloze_sentences: [
      'Los conquistadores se internaron en la selva hechizados por la {{c1::quimera}} del oro inagotable.',
      'Pronto comprendió que la neutralidad perpetua era una noble pero imposible {{c1::quimera}}.',
    ],
    distinction_matrix: {
      synonyms: ['quimera', 'utopía', 'espejismo'],
      nuanceComparison:
        'Quimera resalta el carácter fantástico, ardiente e híbrido de la imaginación individual; utopía se refiere a un proyecto ideal de organización colectiva; espejismo subraya el engaño óptico o perceptivo momentáneo.',
      contextRecommendations: [
        {
          word: 'quimera',
          recommendedRegister: 'Literario / Poético',
          exampleSentence: 'Don Quijote transformaba la llanura manchega en teatro de heroicas quimeras.',
        },
        {
          word: 'utopía',
          recommendedRegister: 'Político / Filosófico',
          exampleSentence: 'El Renacimiento concibió América como espacio para la utopía humanista.',
        },
        {
          word: 'espejismo',
          recommendedRegister: 'Descriptivo / Analítico',
          exampleSentence: 'La bonanza financiera demostró ser un efímero espejismo.',
        },
      ],
    },
  },

  // 12. ubicuidad
  {
    term: 'ubicuidad',
    gender: 'feminine',
    english_gloss: 'ubiquity, omnipresence',
    part_of_speech: 'noun',
    phonetic: '/uβikwiˈðað/',
    primary_definition:
      'Cualidad de ubicuo; facultad de estar presente a un mismo tiempo en todas partes.',
    nuance_note:
      'Originalmente atributo exclusivo de la divinidad en la escolástica; hoy se aplica en ensayos culturales a la simultaneidad espacial o mediática ("don de la ubicuidad").',
    etymology: {
      roots: [
        { morpheme: 'ubique', meaning: 'en todas partes / dondequiera', origin: 'Latin' },
        { morpheme: '-idad (-itas)', meaning: 'cualidad abstracta', origin: 'Latin' },
      ],
      cognates: ['ubicuo', 'ubicar', 'ubicación'],
    },
    collocations: [
      'don de la ubicuidad',
      'asombrosa ubicuidad',
      'ubicuidad digital',
      'ilusión de ubicuidad',
    ],
    source_context: {
      sentence:
        'El Aleph era el punto donde convergían todos los lugares del orbe en vertiginosa ubicuidad.',
      source: 'El Aleph',
      author: 'Jorge Luis Borges',
    },
    cloze_sentences: [
      'La imprenta otorgó a las ideas humanistas una inédita {{c1::ubicuidad}} en toda Europa.',
      'Parecía poseer el don de la {{c1::ubicuidad}}, pues intervenía simultáneamente en todas las tertulias.',
    ],
    distinction_matrix: {
      synonyms: ['ubicuidad', 'omnipresencia', 'simultaneidad'],
      nuanceComparison:
        'Ubicuidad destaca la presencia espacial múltiple o movilidad instantánea; omnipresencia connota majestad teológica o vigilancia absoluta; simultaneidad se refiere a la coincidencia temporal.',
      contextRecommendations: [
        {
          word: 'ubicuidad',
          recommendedRegister: 'Ensayístico / Culto',
          exampleSentence: 'La ubicuidad de las pantallas ha abolido la distancia geográfica.',
        },
        {
          word: 'omnipresencia',
          recommendedRegister: 'Teológico / Político',
          exampleSentence: 'La omnipresencia del aparato censor asfixiaba la prensa.',
        },
        {
          word: 'simultaneidad',
          recommendedRegister: 'Científico / Narrativo',
          exampleSentence: 'Cortázar experimentó con la simultaneidad de planos narrativos.',
        },
      ],
    },
  },

  // 13. devenir
  {
    term: 'devenir',
    gender: 'masculine',
    english_gloss: 'becoming, historical flux, to come to be',
    part_of_speech: 'noun',
    phonetic: '/deβeˈniɾ/',
    primary_definition:
      'Proceso continuo por el que algo o alguien llega a ser o se transforma en el tiempo; la realidad entendida como flujo y cambio perpetuo.',
    nuance_note:
      'Funciona tanto como sustantivo masculino ("el devenir histórico") cuanto como verbo culto ("devenir en"). Traduce el griego gignesthai de Heráclito y el alemán Werden de Hegel.',
    etymology: {
      roots: [
        { morpheme: 'de-', meaning: 'desde / movimiento descendente o derivado', origin: 'Latin' },
        { morpheme: 'venire', meaning: 'venir / llegar', origin: 'Latin' },
      ],
      cognates: ['porvenir', 'advenir', 'intervenir', 'sobrevenir'],
    },
    collocations: [
      'devenir histórico',
      'incesante devenir',
      'devenir del tiempo',
      'el ser y el devenir',
    ],
    source_context: {
      sentence:
        'La poesía consagra el instante y lo rescata del incesante devenir en que todo se disuelve.',
      source: 'El arco y la lira',
      author: 'Octavio Paz',
    },
    cloze_sentences: [
      'Heráclito concibió el cosmos como un perpetuo {{c1::devenir}} gobernado por la tensión de los opuestos.',
      'A lo largo del {{c1::devenir}} de los siglos, aquellas ruinas mudaron de templo a fortaleza.',
    ],
    distinction_matrix: {
      synonyms: ['devenir', 'evolución', 'transcurso'],
      nuanceComparison:
        'Devenir subraya la transformación ontológica e inestable del ser en el tiempo; evolución implica desarrollo gradual y teleológico; transcurso alude simplemente al paso cronológico.',
      contextRecommendations: [
        {
          word: 'devenir',
          recommendedRegister: 'Filosófico / Metafísico',
          exampleSentence: 'El devenir de la conciencia constituye el eje de la fenomenología.',
        },
        {
          word: 'evolución',
          recommendedRegister: 'Científico / Histórico',
          exampleSentence: 'La evolución fonética del castellano medieval al clásico.',
        },
        {
          word: 'transcurso',
          recommendedRegister: 'Formal / Administrativo',
          exampleSentence: 'En el transcurso de la sesión se aprobaron los estatutos.',
        },
      ],
    },
  },

  // 14. hastío
  {
    term: 'hastío',
    gender: 'masculine',
    english_gloss: 'ennui, world-weariness, existential boredom',
    part_of_speech: 'noun',
    phonetic: '/asˈti.o/',
    primary_definition:
      'Disgusto, tedio profundo o cansancio vital hacia las cosas o la existencia misma por saciedad o falta de sentido.',
    nuance_note:
      'Equivalente hispánico del "ennui" de Baudelaire o el "spleen" modernista; mucho más intenso y filosófico que el simple "aburrimiento" pasajero. Conserva la h aspirada procedente de la f latina (fastidium).',
    etymology: {
      roots: [
        { morpheme: 'fastidium', meaning: 'repugnancia / aversión por saciedad / orgullo', origin: 'Latin' },
      ],
      cognates: ['fastidio', 'hastiar', 'hastiado', 'fastidioso'],
    },
    collocations: [
      'profundo hastío',
      'hastío vital',
      'bostezar de hastío',
      'sumido en el hastío',
    ],
    source_context: {
      sentence:
        'Los inmortales, sabedores de que en un plazo infinito todo ocurre a todos, habían caído en un lúcido hastío.',
      source: 'El inmortal',
      author: 'Jorge Luis Borges',
    },
    cloze_sentences: [
      'Tras años de frívolos banquetes cortesanos, el príncipe cayó en un incurable {{c1::hastío}}.',
      'El poeta modernista cantó el {{c1::hastío}} de las tardes lluviosas en las capitales de provincia.',
    ],
    distinction_matrix: {
      synonyms: ['hastío', 'tedio', 'aburrimiento'],
      nuanceComparison:
        'Hastío connota saturación, cansancio vital y aversión espiritual; tedio destaca la monotonía lenta y plomiza del tiempo vacío; aburrimiento es la voz cotidiana para la falta de distracción.',
      contextRecommendations: [
        {
          word: 'hastío',
          recommendedRegister: 'Literario / Modernista / Existencial',
          exampleSentence: 'Un elegante hastío asomaba en los versos crepusculares del autor.',
        },
        {
          word: 'tedio',
          recommendedRegister: 'Culto / Psicológico',
          exampleSentence: 'El tedio dominical pesaba sobre las calles desiertas.',
        },
        {
          word: 'aburrimiento',
          recommendedRegister: 'Coloquial / General',
          exampleSentence: 'Los niños bostezaban de aburrimiento durante la espera.',
        },
      ],
    },
  },

  // 15. inefable
  {
    term: 'inefable',
    gender: null,
    english_gloss: 'ineffable, beyond verbal expression, unutterable',
    part_of_speech: 'adjective',
    phonetic: '/ineˈfaβle/',
    primary_definition:
      'Que con palabras no se puede explicar, pronunciar ni describir adecuadamente por su sutileza, belleza o trascendencia.',
    nuance_note:
      'Término central de la mística española (San Juan de la Cruz, Santa Teresa) y de la estética del sublime. Adjetivo invariable en género ("experiencia inefable", "misterio inefable").',
    etymology: {
      roots: [
        { morpheme: 'in-', meaning: 'no / negación', origin: 'Latin' },
        { morpheme: 'effabilis (ex + fari)', meaning: 'que se puede decir o hablar', origin: 'Latin' },
      ],
      cognates: ['afable', 'fábula', 'infante', 'prefacio'],
    },
    collocations: [
      'misterio inefable',
      'gozo inefable',
      'experiencia inefable',
      'belleza inefable',
    ],
    source_context: {
      sentence:
        'El místico balbucea imágenes paradójicas porque intenta comunicar una visión de suyo inefable.',
      source: 'El hombre y lo divino',
      author: 'María Zambrano',
    },
    cloze_sentences: [
      'La música comienza precisamente allí donde el lenguaje tropieza con lo {{c1::inefable}}.',
      'Sintió una serenidad {{c1::inefable}} al contemplar el amanecer sobre la cordillera.',
    ],
    distinction_matrix: {
      synonyms: ['inefable', 'indecible', 'inenarrable'],
      nuanceComparison:
        'Inefable se reserva para realidades sublimes, espirituales o estéticas que trascienden el lenguaje; indecible suele acompañar dolores o grados extremos; inenarrable se aplica a sucesos caóticos o atroces.',
      contextRecommendations: [
        {
          word: 'inefable',
          recommendedRegister: 'Místico / Estético / Filosófico',
          exampleSentence: 'La poesía asedia siempre el reducto de lo inefable.',
        },
        {
          word: 'indecible',
          recommendedRegister: 'Dramático / Intenso',
          exampleSentence: 'Sufrió una angustia indecible antes del desenlace.',
        },
        {
          word: 'inenarrable',
          recommendedRegister: 'Periodístico / Narrativo',
          exampleSentence: 'El naufragio produjo escenas de pánico inenarrable.',
        },
      ],
    },
  },

  // 16. cavilación
  {
    term: 'cavilación',
    gender: 'feminine',
    english_gloss: 'brooding reflection, deep rumination,ratiocination',
    part_of_speech: 'noun',
    phonetic: '/kaβilaˈsjon/',
    primary_definition:
      'Acción y efecto de cavilar; discurso o meditación insistente, profunda y a menudo melancólica o suspicaz sobre un asunto.',
    nuance_note:
      'En latín clásico "cavillatio" era un sofisma o sutileza capciosa; en español literario designa la rumia mental absorbente y solitaria del pensador (frecuente en plural: "absorto en sus cavilaciones").',
    etymology: {
      roots: [
        { morpheme: 'cavillari', meaning: 'sutilizar / discurrir con agudeza o recelo', origin: 'Latin' },
        { morpheme: '-ción', meaning: 'acción y efecto', origin: 'Latin' },
      ],
      cognates: ['cavilar', 'caviloso'],
    },
    collocations: [
      'sumido en cavilaciones',
      'hondas cavilaciones',
      'sombría cavilación',
      'interrumpir sus cavilaciones',
    ],
    source_context: {
      sentence:
        'Oliveira recorría los puentes del Sena entregado a interminables cavilaciones sobre el sentido de la búsqueda.',
      source: 'Rayuela',
      author: 'Julio Cortázar',
    },
    cloze_sentences: [
      'El timbre del reloj sacó al filósofo de sus nocturnas {{c1::cavilaciones::cavilación}}.',
      'Tras larga {{c1::cavilación}}, decidió quemar el manuscrito antes del alba.',
    ],
    distinction_matrix: {
      synonyms: ['cavilación', 'meditación', 'reflexión'],
      nuanceComparison:
        'Cavilación connota un pensamiento circular, tenaz y teñido de preocupación o perplejidad; meditación sugiere recogimiento sereno y metódico; reflexión es el examen racional ponderado.',
      contextRecommendations: [
        {
          word: 'cavilación',
          recommendedRegister: 'Literario / Psicológico',
          exampleSentence: 'Sus cavilaciones insomnes giraban en torno al enigma del espejo.',
        },
        {
          word: 'meditación',
          recommendedRegister: 'Filosófico / Espiritual',
          exampleSentence: 'Las Meditaciones del Quijote inauguraron la obra de Ortega.',
        },
        {
          word: 'reflexión',
          recommendedRegister: 'Académico / General',
          exampleSentence: 'El informe invita a una reflexión rigurosa sobre la ética médica.',
        },
      ],
    },
  },

  // 17. sosiego
  {
    term: 'sosiego',
    gender: 'masculine',
    english_gloss: 'tranquility, equanimity, serene composure',
    part_of_speech: 'noun',
    phonetic: '/soˈsjeɣo/',
    primary_definition:
      'Quietud, tranquilidad, serenidad del ánimo que domina las pasiones y la prisa.',
    nuance_note:
      'Virtud cardinal del humanismo hispánico clásico (Fray Luis de León, Cervantes: "con mucho sosiego"). Antónimo exacto de "desasosiego"; denota no pasividad, sino señorío interior.',
    etymology: {
      roots: [
        { morpheme: 'sub-', meaning: 'bajo / suavemente', origin: 'Latin' },
        { morpheme: 'sessicare (sedere)', meaning: 'asentar / hacer sentar / reposar', origin: 'Latin' },
      ],
      cognates: ['sosegar', 'sosegado', 'desasosiego', 'sedente'],
    },
    collocations: [
      'hondo sosiego',
      'hablar con sosiego',
      'recobrar el sosiego',
      'sosiego del claustro',
    ],
    source_context: {
      sentence:
        'La lectura verdadera exige un ámbito de sosiego donde las palabras puedan resonar sin premura.',
      source: 'La experiencia literaria',
      author: 'Alfonso Reyes',
    },
    cloze_sentences: [
      'A la sombra de los cipreses, el viajero recobró por fin el {{c1::sosiego}} perdido en la corte.',
      'Respondió a las injurias de sus adversarios con imperturbable {{c1::sosiego}}.',
    ],
    distinction_matrix: {
      synonyms: ['sosiego', 'calma', 'paz'],
      nuanceComparison:
        'Sosiego expresa una templanza señorial y reposada del espíritu tras el movimiento; calma alude a la ausencia física o emocional de agitación; paz es el estado universal de armonía o no violencia.',
      contextRecommendations: [
        {
          word: 'sosiego',
          recommendedRegister: 'Clásico / Literario / Humanista',
          exampleSentence: 'Buscaba el sosiego de la biblioteca para ordenar sus memorias.',
        },
        {
          word: 'calma',
          recommendedRegister: 'Descriptivo / Cotidiano',
          exampleSentence: 'El mar permanecía en absoluta calma al amanecer.',
        },
        {
          word: 'paz',
          recommendedRegister: 'Universal / Político / Espiritual',
          exampleSentence: 'Firmaron una paz duradera tras décadas de contienda.',
        },
      ],
    },
  },

  // 18. exégesis
  {
    term: 'exégesis',
    gender: 'feminine',
    english_gloss: 'exegesis, critical interpretation of a text',
    part_of_speech: 'noun',
    phonetic: '/ekˈsexesis/',
    primary_definition:
      'Explicación o interpretación crítica y filológica de un texto, especialmente de las Sagradas Escrituras o de una obra filosófica y literaria compleja.',
    nuance_note:
      'Admite doble acentuación normativa en la RAE: esdrújula ("exégesis", preferida en el uso culto hispanoamericano y español actual) o llana ("exegesis"). Invariable en plural ("las exégesis").',
    etymology: {
      roots: [
        { morpheme: 'ex-', meaning: 'hacia fuera / desde dentro', origin: 'Greek' },
        { morpheme: 'hegeisthai', meaning: 'guiar / conducir / explicar', origin: 'Greek' },
        { morpheme: '-sis', meaning: 'acción / proceso', origin: 'Greek' },
      ],
      cognates: ['exegeta', 'exegético', 'hegemonía'],
    },
    collocations: [
      'rigurosa exégesis',
      'exégesis bíblica',
      'exégesis filológica',
      'emprender la exégesis',
    ],
    source_context: {
      sentence:
        'Los cabalistas dedicaron siglos a la minuciosa exégesis de cada letra y permutación del texto sagrado.',
      source: 'Discusión',
      author: 'Jorge Luis Borges',
    },
    cloze_sentences: [
      'El filólogo consagró su cátedra a la {{c1::exégesis}} de los sonetos herméticos de Góngora.',
      'Toda traducción literaria entraña ya una silenciosa {{c1::exégesis}} del original.',
    ],
    distinction_matrix: {
      synonyms: ['exégesis', 'hermenéutica', 'glosa'],
      nuanceComparison:
        'Exégesis es el acto concreto de desentrañar y explicar un texto línea por línea; hermenéutica es la teoría filosófica general de la interpretación; glosa es un comentario breve o marginal.',
      contextRecommendations: [
        {
          word: 'exégesis',
          recommendedRegister: 'Filológico / Teológico / Crítico',
          exampleSentence: 'Una brillante exégesis del Primero sueño de Sor Juana.',
        },
        {
          word: 'hermenéutica',
          recommendedRegister: 'Filosófico / Epistemológico',
          exampleSentence: 'Gadamer renovó la hermenéutica contemporánea.',
        },
        {
          word: 'glosa',
          recommendedRegister: 'Erudito / Historiográfico',
          exampleSentence: 'Las Glosas Emilianenses atestiguan el romance incipiente.',
        },
      ],
    },
  },

  // 19. azogue
  {
    term: 'azogue',
    gender: 'masculine',
    english_gloss: 'quicksilver (mercury), restless agitation',
    part_of_speech: 'noun',
    phonetic: '/aˈsoɣe/',
    primary_definition:
      'Nombre tradicional y literario del mercurio; figuradamente, inquietud extrema, vivacidad o temblor continuo.',
    nuance_note:
      'Arabismo de fascinante historia metalúrgica y poética: con el azogue se amalgamaba la plata en América y se cubrían los espejos ("el azogue del espejo" en Borges y García Lorca).',
    etymology: {
      roots: [
        { morpheme: 'az-zāwúq', meaning: 'mercurio / metal vivo para amalgamar', origin: 'Arabic (Árabe Andalusí)' },
      ],
      cognates: ['azogar', 'azogado'],
    },
    collocations: [
      'el azogue del espejo',
      'parecer tener azogue',
      'temblar como azogue',
      'turbio azogue',
    ],
    source_context: {
      sentence:
        'En el fondo del corredor, el turbio azogue del espejo acechaba nuestros gestos como un agua insomne.',
      source: 'El hacedor',
      author: 'Jorge Luis Borges',
    },
    cloze_sentences: [
      'El anciano contempló su rostro desdibujado en el gastado {{c1::azogue}} del espejo veneciano.',
      'Sus dedos se movían sobre el teclado con la vivacidad líquida del {{c1::azogue}}.',
    ],
    distinction_matrix: {
      synonyms: ['azogue', 'mercurio', 'inquietud'],
      nuanceComparison:
        'Azogue pertenece al registro poético, histórico y metafórico (espejos, temblor vivo); mercurio es la denominación química y astronómica moderna; inquietud es el término abstracto psicológico.',
      contextRecommendations: [
        {
          word: 'azogue',
          recommendedRegister: 'Poético / Histórico / Metafórico',
          exampleSentence: 'La luna derramaba un frío azogue sobre las acequias.',
        },
        {
          word: 'mercurio',
          recommendedRegister: 'Científico / Técnico',
          exampleSentence: 'La columna de mercurio descendió bajo cero.',
        },
        {
          word: 'inquietud',
          recommendedRegister: 'General / Psicológico',
          exampleSentence: 'No podía disimular su inquietud durante la entrevista.',
        },
      ],
    },
  },

  // 20. semblanza
  {
    term: 'semblanza',
    gender: 'feminine',
    english_gloss: 'biographical sketch, literary portrait',
    part_of_speech: 'noun',
    phonetic: '/semˈblanθa/',
    primary_definition:
      'Bosquejo biográfico de una persona que traza con agudeza sus rasgos morales, intelectuales y fisonómicos.',
    nuance_note:
      'Género ensayístico clásico de las letras hispánicas desde Fernán Pérez de Guzmán ("Generaciones y semblanzas") hasta Alfonso Reyes y Juan Ramón Jiménez; busca captar el espíritu del personaje en pocas páginas magistrales.',
    etymology: {
      roots: [
        { morpheme: 'similare (similis)', meaning: 'semejar / parecerse', origin: 'Latin' },
        { morpheme: '-anza (-antia)', meaning: 'cualidad / figura resultante', origin: 'Latin' },
      ],
      cognates: ['semblante', 'semejanza', 'similar', 'verosímil'],
    },
    collocations: [
      'trazar una semblanza',
      'aguda semblanza',
      'semblanza biográfica',
      'semblanza moral',
    ],
    source_context: {
      sentence:
        'En breves páginas trazó una inolvidable semblanza donde el gesto cotidiano revelaba al filósofo entero.',
      source: 'Retratos reales e imaginarios',
      author: 'Alfonso Reyes',
    },
    cloze_sentences: [
      'El discurso de ingreso incluyó una emotiva {{c1::semblanza}} de su maestro recién fallecido.',
      'Más que una exhaustiva biografía documental, el crítico nos ofrece una vívida {{c1::semblanza}} literaria.',
    ],
    distinction_matrix: {
      synonyms: ['semblanza', 'biografía', 'retrato'],
      nuanceComparison:
        'Semblanza es una síntesis ensayística y evocadora del carácter de una figura; biografía es la narración histórica completa y documentada de una vida; retrato enfatiza la descripción plástica o visual.',
      contextRecommendations: [
        {
          word: 'semblanza',
          recommendedRegister: 'Literario / Académico',
          exampleSentence: 'Publicó una colección de semblanzas de escritores del exilio.',
        },
        {
          word: 'biografía',
          recommendedRegister: 'Historiográfico / Editorial',
          exampleSentence: 'Una monumental biografía en tres volúmenes con archivos inéditos.',
        },
        {
          word: 'retrato',
          recommendedRegister: 'Artístico / Descriptivo',
          exampleSentence: 'Velázquez penetró la psicología real en cada retrato.',
        },
      ],
    },
  },

  // 21. palimpsesto
  {
    term: 'palimpsesto',
    gender: 'masculine',
    english_gloss: 'palimpsest, manuscript or memory with layered traces',
    part_of_speech: 'noun',
    phonetic: '/palimpˈsesto/',
    primary_definition:
      'Manuscrito antiguo que conserva huellas de una escritura anterior borrada artificialmente; por extensión, obra, ciudad o memoria donde se superponen estratos de tiempos distintos.',
    nuance_note:
      'Concepto clave de la teoría literaria (Genette, Borges) y la historia cultural hispánica para describir textos o culturas donde el pasado trasluce bajo la superficie presente.',
    etymology: {
      roots: [
        { morpheme: 'palin', meaning: 'de nuevo / otra vez', origin: 'Greek' },
        { morpheme: 'psao (psestos)', meaning: 'raspar / borrar frotando', origin: 'Greek' },
      ],
      cognates: ['paliativo', 'palinodia'],
    },
    collocations: [
      'complejo palimpsesto',
      'palimpsesto de la memoria',
      'descifrar un palimpsesto',
      'ciudad como palimpsesto',
    ],
    source_context: {
      sentence:
        'He considerado que también las generaciones de los hombres son como un vasto palimpsesto donde cada siglo escribe sobre el anterior.',
      source: 'El Aleph',
      author: 'Jorge Luis Borges',
    },
    cloze_sentences: [
      'Bajo la luz ultravioleta, el pergamino medieval reveló un inesperado {{c1::palimpsesto}} griego.',
      'El centro histórico de México es un vivo {{c1::palimpsesto}} donde el tezontle colonial descansa sobre basamentos mexicas.',
    ],
    distinction_matrix: {
      synonyms: ['palimpsesto', 'manuscrito', 'códice'],
      nuanceComparison:
        'Palimpsesto implica necesariamente la superposición de al menos dos escrituras o épocas donde la antigua asoma bajo la nueva; manuscrito es cualquier texto escrito a mano; códice es el libro antiguo encuadernado en cuadernos.',
      contextRecommendations: [
        {
          word: 'palimpsesto',
          recommendedRegister: 'Filológico / Teoría Literaria',
          exampleSentence: 'La novela funciona como un palimpsesto que reescribe la Odisea.',
        },
        {
          word: 'manuscrito',
          recommendedRegister: 'Académico / General',
          exampleSentence: 'El autor entregó el manuscrito definitivo al impresor.',
        },
        {
          word: 'códice',
          recommendedRegister: 'Histórico / Arqueológico',
          exampleSentence: 'El Códice Mendoza se conserva en la Biblioteca Bodleiana.',
        },
      ],
    },
  },

  // 22. aporía
  {
    term: 'aporía',
    gender: 'feminine',
    english_gloss: 'aporia, logical impasse, irresolvable contradiction',
    part_of_speech: 'noun',
    phonetic: '/apoˈɾi.a/',
    primary_definition:
      'Enunciado que expresa o que contiene una inviabilidad de orden racional; callejón sin salida lógico o metafísico.',
    nuance_note:
      'Conserva el hiato acentuado en "-ía" (/a.po.ˈɾi.a/) a diferencia de su equivalente inglés. Esencial para discutir las paradojas de Zenón, los diálogos socráticos o las antinomias de la razón.',
    etymology: {
      roots: [
        { morpheme: 'a-', meaning: 'sin / privación', origin: 'Greek' },
        { morpheme: 'poros', meaning: 'camino / pasaje / salida', origin: 'Greek' },
        { morpheme: '-ía', meaning: 'estado / condición', origin: 'Greek' },
      ],
      cognates: ['poro', 'poroso', 'aporético'],
    },
    collocations: [
      'insoluble aporía',
      'aporía del tiempo',
      'desembocar en una aporía',
      'aporía de Zenón',
    ],
    source_context: {
      sentence:
        'Aquiles y la tortuga encarnan la más célebre aporía con que Elea desafió la ilusión del movimiento.',
      source: 'Discusión',
      author: 'Jorge Luis Borges',
    },
    cloze_sentences: [
      'El razonamiento jurídico sobre la soberanía absoluta desemboca inevitablemente en una {{c1::aporía}}.',
      'Lejos de ocultar la {{c1::aporía}}, el filósofo hizo de aquella contradicción el centro de su método.',
    ],
    distinction_matrix: {
      synonyms: ['aporía', 'paradoja', 'dilema'],
      nuanceComparison:
        'Aporía designa una obstrucción racional donde el pensamiento no halla tránsito posible; paradoja es una proposición que desafía la opinión común ocultando una verdad; dilema exige elegir entre dos alternativas.',
      contextRecommendations: [
        {
          word: 'aporía',
          recommendedRegister: 'Filosófico / Epistemológico',
          exampleSentence: 'San Agustín expuso las aporías de la medición del tiempo.',
        },
        {
          word: 'paradoja',
          recommendedRegister: 'Literario / Ensayístico',
          exampleSentence: 'Quevedo cultivó la paradoja conceptual con maestría.',
        },
        {
          word: 'dilema',
          recommendedRegister: 'Ético / Práctico',
          exampleSentence: 'El médico se enfrentó a un grave dilema deontológico.',
        },
      ],
    },
  },

  // 23. inmanencia
  {
    term: 'inmanencia',
    gender: 'feminine',
    english_gloss: 'immanence, indwelling presence within the world',
    part_of_speech: 'noun',
    phonetic: '/immaˈnenθja/',
    primary_definition:
      'Cualidad de inmanente; condición de aquello que es inherente a algún ser o va unido de un modo inseparable a su esencia, sin depender de un principio exterior.',
    nuance_note:
      'Forma pareja dialéctica indispensable con "trascendencia". En estética y filosofía (Spinoza, Deleuze, Zambrano) designa el plano de la realidad que se basta a sí mismo.',
    etymology: {
      roots: [
        { morpheme: 'in-', meaning: 'en / dentro', origin: 'Latin' },
        { morpheme: 'manere', meaning: 'permanecer / morar / quedarse', origin: 'Latin' },
        { morpheme: '-encia (-entia)', meaning: 'cualidad de un agente', origin: 'Latin' },
      ],
      cognates: ['inmanente', 'permanecer', 'remanente', 'mansión'],
    },
    collocations: [
      'plano de inmanencia',
      'radical inmanencia',
      'inmanencia y trascendencia',
      'filosofía de la inmanencia',
    ],
    source_context: {
      sentence:
        'La razón poética no deserta del mundo sensible, sino que descubre lo sagrado en la propia inmanencia de la vida.',
      source: 'Filosofía y poesía',
      author: 'María Zambrano',
    },
    cloze_sentences: [
      'El panteísmo de Spinoza afirma la absoluta {{c1::inmanencia}} de Dios en la naturaleza.',
      'El ensayo explora la tensión moderna entre la {{c1::inmanencia}} secular y el anhelo de trascendencia.',
    ],
    distinction_matrix: {
      synonyms: ['inmanencia', 'inherencia', 'interioridad'],
      nuanceComparison:
        'Inmanencia es el concepto metafísico opuesto a trascendencia (permanecer dentro del ser); inherencia señala la unión lógica de un atributo a su sujeto; interioridad alude a la vida subjetiva íntima.',
      contextRecommendations: [
        {
          word: 'inmanencia',
          recommendedRegister: 'Metafísico / Teológico / Estético',
          exampleSentence: 'La crítica inmanentista analiza el poema sin acudir a datos externos.',
        },
        {
          word: 'inherencia',
          recommendedRegister: 'Lógico / Jurídico',
          exampleSentence: 'La inherencia de los derechos fundamentales a la dignidad humana.',
        },
        {
          word: 'interioridad',
          recommendedRegister: 'Psicológico / Espiritual',
          exampleSentence: 'San Agustín descubrió la verdad en el recogimiento de la interioridad.',
        },
      ],
    },
  },

  // 24. efímero
  {
    term: 'efímero',
    gender: 'masculine',
    english_gloss: 'ephemeral, fleeting, short-lived',
    part_of_speech: 'adjective',
    phonetic: '/eˈfimeɾo/',
    primary_definition:
      'Pasajero, de corta duración; que tiene la vida de un solo día o se desvanece con prontitud.',
    nuance_note:
      'Voz lírica por excelencia del barroco y la poesía moderna hispánica (el tópico de la rosa que dura un día en Góngora, Calderón y Sor Juana). Admite flexión de género ("gloria efímera") o uso sustantivado ("lo efímero").',
    etymology: {
      roots: [
        { morpheme: 'epi-', meaning: 'sobre / durante', origin: 'Greek' },
        { morpheme: 'hemera', meaning: 'día', origin: 'Greek' },
      ],
      cognates: ['efemérides', 'hemeroteca'],
    },
    collocations: [
      'belleza efímera',
      'triunfo efímero',
      'la condición de lo efímero',
      'instante efímero',
    ],
    source_context: {
      sentence:
        'Miró la rosa que en la aurora ostenta su púrpura y a la tarde yace en efímero despojo.',
      source: 'Inundación castálida',
      author: 'Sor Juana Inés de la Cruz',
    },
    cloze_sentences: [
      'El arte aspira a otorgar perdurabilidad a lo que en la experiencia humana es {{c1::efímero}}.',
      'Aquel armisticio resultó tan {{c1::efímero}} como la nieve de primavera.',
    ],
    distinction_matrix: {
      synonyms: ['efímero', 'fugaz', 'perecedero'],
      nuanceComparison:
        'Efímero subraya la brevedad vital de lo que dura apenas un día; fugaz destaca la velocidad con que algo huye o pasa como un relámpago; perecedero enfatiza la corrupción material inevitable.',
      contextRecommendations: [
        {
          word: 'efímero',
          recommendedRegister: 'Lírico / Filosófico',
          exampleSentence: 'La arquitectura efímera de los arcos triunfales barrocos.',
        },
        {
          word: 'fugaz',
          recommendedRegister: 'Poético / Narrativo',
          exampleSentence: 'Cruzó por su memoria el recuerdo fugaz de aquella tarde.',
        },
        {
          word: 'perecedero',
          recommendedRegister: 'Doctrinal / Formal',
          exampleSentence: 'Despreció las riquezas perecederas por el estudio.',
        },
      ],
    },
  },

  // 25. verosimilitud
  {
    term: 'verosimilitud',
    gender: 'feminine',
    english_gloss: 'verisimilitude, narrative plausibility, lifelikeness',
    part_of_speech: 'noun',
    phonetic: '/beɾosimiliˈtuð/',
    primary_definition:
      'Cualidad de verosímil; apariencia de verdadero y coherencia interna que hace creíble una obra de ficción o un relato.',
    nuance_note:
      'Concepto rector de la poética aristotélica y cervantina: la literatura no exige verdad empírica o histórica, sino "verosimilitud" estética y coherencia interna.',
    etymology: {
      roots: [
        { morpheme: 'verus', meaning: 'verdadero', origin: 'Latin' },
        { morpheme: 'similis', meaning: 'semejante / parecido', origin: 'Latin' },
        { morpheme: '-tud (-tudo)', meaning: 'cualidad abstracta', origin: 'Latin' },
      ],
      cognates: ['verosímil', 'inverosímil', 'verdad', 'símil'],
    },
    collocations: [
      'rigurosa verosimilitud',
      'carecer de verosimilitud',
      'verosimilitud poética',
      'ilusión de verosimilitud',
    ],
    source_context: {
      sentence:
        'El arte del narrador fantástico consiste en rodear el prodigio de una minuciosa verosimilitud cotidiana.',
      source: 'Algunos aspectos del cuento',
      author: 'Julio Cortázar',
    },
    cloze_sentences: [
      'Cervantes reflexionó constantemente sobre las leyes de la {{c1::verosimilitud}} en la novela moderna.',
      'Los detalles circunstanciales dotaban al testimonio de una innegable {{c1::verosimilitud}}.',
    ],
    distinction_matrix: {
      synonyms: ['verosimilitud', 'credibilidad', 'plausibilidad'],
      nuanceComparison:
        'Verosimilitud es la coherencia estética y formal que semeja la verdad en el arte o el discurso; credibilidad es la confianza moral que inspira una fuente; plausibilidad alude a lo aceptable o admisible de una hipótesis.',
      contextRecommendations: [
        {
          word: 'verosimilitud',
          recommendedRegister: 'Teoría Literaria / Filosófico',
          exampleSentence: 'Prefirió el poeta lo imposible verosímil a lo posible sin verosimilitud.',
        },
        {
          word: 'credibilidad',
          recommendedRegister: 'Periodístico / Político',
          exampleSentence: 'El testigo perdió toda credibilidad tras contradecirse.',
        },
        {
          word: 'plausibilidad',
          recommendedRegister: 'Científico / Argumentativo',
          exampleSentence: 'Evaluaron la plausibilidad biológica del modelo propuesto.',
        },
      ],
    },
  },
];

export function getSpanishLiterarySeedCards(
  userId: string = DEFAULT_USER_ID,
  baseDate: Date = new Date()
): CardWithSrs[] {
  return RAW_SPANISH_LITERARY_TERMS.map((entry, idx) => {
    const num = String(idx + 1).padStart(4, '0');
    const id = `10000000-0000-0000-0000-00000000${num}`;
    // Stagger across 5 batches of 5 cards (days 0..4 relative to baseDate)
    const batchDay = Math.floor(idx / 5);
    const createdAt = new Date(baseDate.getTime() - (25 - idx) * 60 * 1000).toISOString();
    const dueDate = new Date(
      baseDate.getTime() + batchDay * 24 * 60 * 60 * 1000 - (batchDay === 0 ? 60 * 60 * 1000 : 0)
    ).toISOString();

    return {
      ...entry,
      id,
      user_id: userId,
      language: 'es',
      is_fallback: false,
      enrichment_source: 'curated',
      created_at: createdAt,
      srs: {
        card_id: id,
        user_id: userId,
        due: dueDate,
        stability: batchDay === 0 ? 0 : batchDay * 2.5,
        difficulty: 4.5,
        elapsed_days: batchDay,
        scheduled_days: batchDay,
        reps: batchDay === 0 ? 0 : 1,
        lapses: 0,
        state: batchDay === 0 ? 0 : 2,
        last_review: batchDay === 0 ? null : createdAt,
      },
    };
  });
}

export const SPANISH_LITERARY_SEED_CARDS: CardWithSrs[] = getSpanishLiterarySeedCards(DEFAULT_USER_ID);
