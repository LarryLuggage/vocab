export const CLUSTER_4_POETICS_RHETORIC = [
  {
    term: 'chiasmus',
    part_of_speech: 'noun',
    phonetic: '/kaɪˈæz.məs/',
    primary_definition: 'A rhetorical or poetic figure in which words, grammatical constructions, or concepts are repeated in reverse parallel order (an A-B-B-A structure).',
    nuance_note: 'Named after the Greek letter Chi (X), representing crossing. Contrasted with antimetabole (which repeats the exact identical words in reverse: "eat to live, not live to eat"); chiasmus balances concepts or grammatical structures even if words vary slightly.',
    etymology: {
      roots: [
        { morpheme: 'chiasma', meaning: 'crossing / diagonal arrangement', origin: 'Greek' },
        { morpheme: 'chiazein', meaning: 'to mark with a cross / shaped like letter Chi (Χ)', origin: 'Greek' },
      ],
      cognates: ['chiasm', 'chiastic'],
    },
    collocations: ['rhetorical chiasmus', 'chiastic structure', 'elegant chiasmus', 'chiastic reversal'],
    source_context: {
      sentence: 'Milton\'s Paradise Lost abounds in profound chiastic inversions: "Adam, first of men, / To first of women, Eve."',
      source: 'Milton\'s Grand Style',
      author: 'Christopher Ricks',
    },
    cloze_sentences: [
      'John F. Kennedy delivered one of history\'s most famous rhetorical instances of {{c1::chiasmus}}: "Ask not what your country can do for you—ask what you can do for your country."',
      'The biblical psalm employs a tight {{c1::chiasmus}}, mirroring the opening praise in its concluding benediction.',
    ],
    distinction_matrix: {
      synonyms: ['chiasmus', 'antimetabole', 'antithesis'],
      nuanceComparison: 'Chiasmus is the inverted grammatical or conceptual crossing in A-B-B-A form; antimetabole repeats the exact identical lexical words in reverse; antithesis is the juxtaposition of contrasting ideas in balanced phrases.',
      contextRecommendations: [
        { word: 'chiasmus', recommendedRegister: 'Classical Rhetoric / Literary Analysis', exampleSentence: 'Keats constructed a sublime chiasmus in his ode: "Beauty is truth, truth beauty."' },
        { word: 'antimetabole', recommendedRegister: 'Stylistic / Technical Rhetoric', exampleSentence: 'The slogan was an antimetabole: "When the going gets tough, the tough get going."' },
        { word: 'antithesis', recommendedRegister: 'Oratorical / Compositional', exampleSentence: 'Dickens opened with unforgettable antithesis: "It was the best of times, it was the worst of times."' },
      ],
    },
  },
  {
    term: 'synecdoche',
    part_of_speech: 'noun',
    phonetic: '/sɪˈnek.də.ki/',
    primary_definition: 'A figure of speech in which a part is made to represent the whole, or less commonly, the whole is made to represent a part.',
    nuance_note: 'From Greek syn- (together) + ekdoche (taking). Common examples: "all hands on deck" (sailors), "hired hands" (laborers), "wheels" (car), or "the law" (police officer). Kenneth Burke analyzed it as one of the "four master tropes" representing representation itself.',
    etymology: {
      roots: [
        { morpheme: 'syn-', meaning: 'together / with', origin: 'Greek' },
        { morpheme: 'ek-', meaning: 'out of / from', origin: 'Greek' },
        { morpheme: 'dechesthai', meaning: 'to receive / take / accept', origin: 'Greek' },
      ],
      cognates: ['synecdochic'],
    },
    collocations: ['use of synecdoche', 'master trope of synecdoche', 'synecdochic relationship', 'visual synecdoche'],
    source_context: {
      sentence: 'Synecdoche may be especially considered under the heading of representation; the part is selected to represent the quality of the whole.',
      source: 'A Grammar of Motives',
      author: 'Kenneth Burke',
    },
    cloze_sentences: [
      'When the general ordered fifty "boots on the ground," he employed military {{c1::synecdoche}} to refer to living soldiers.',
      'Cinema uses visual {{c1::synecdoche}}, showing only a pair of pacing shoes to convey an entire restless character.',
    ],
    distinction_matrix: {
      synonyms: ['synecdoche', 'metonymy', 'metaphor'],
      nuanceComparison: 'Synecdoche is representation based on an intrinsic part-to-whole relationship (hands for workers); metonymy is representation based on extrinsic contiguity or association (crown for monarch); metaphor is representation based on imaginative similarity.',
      contextRecommendations: [
        { word: 'synecdoche', recommendedRegister: 'Rhetorical / Poetic Theory', exampleSentence: 'The phrase "bread and butter" serves as a domestic synecdoche for one\'s entire livelihood.' },
        { word: 'metonymy', recommendedRegister: 'Linguistic / Poetics', exampleSentence: 'The White House issued an official press release, using metonymy to designate the presidential administration.' },
        { word: 'metaphor', recommendedRegister: 'Universal Literary', exampleSentence: 'Shakespeare described all the world as a stage.' },
      ],
    },
  },
  {
    term: 'metonymy',
    part_of_speech: 'noun',
    phonetic: '/mɪˈtɒn.ɪ.mi/',
    primary_definition: 'A figure of speech in which an entity or concept is referred to by the name of an attribute or closely associated concept.',
    nuance_note: 'Linguist Roman Jakobson formulated that human language operates across two fundamental poles: the metaphoric pole (based on similarity and substitution) and the metonymic pole (based on contiguity and context). Realist prose leans heavily on the metonymic pole.',
    etymology: {
      roots: [
        { morpheme: 'meta-', meaning: 'change / transfer', origin: 'Greek' },
        { morpheme: 'onoma', meaning: 'name', origin: 'Greek' },
      ],
      cognates: ['pseudonym', 'synonym', 'metonymic'],
    },
    collocations: ['jakobsonian metonymy', 'metonymic substitution', 'rely on metonymy', 'metonymic association'],
    source_context: {
      sentence: 'The competition between both devices, metonymic and metaphoric, is manifest in any symbolic process, either intrapersonal or social.',
      source: 'Two Aspects of Language and Two Types of Aphasic Disturbances',
      author: 'Roman Jakobson',
    },
    cloze_sentences: [
      'In the adage "the pen is mightier than the sword," both "pen" (for the written word) and "sword" (for military violence) function via {{c1::metonymy}}.',
      'Financial journalists routinely use "Wall Street" as a convenient {{c1::metonymy}} for the entire American investment banking apparatus.',
    ],
    distinction_matrix: {
      synonyms: ['metonymy', 'synecdoche', 'symbol'],
      nuanceComparison: 'Metonymy replaces a concept with a contiguous, associated external entity (the press for journalism); synecdoche replaces a concept with an intrinsic physical part (sail for boat); symbol is an arbitrary cultural token invested with transcendent meaning.',
      contextRecommendations: [
        { word: 'metonymy', recommendedRegister: 'Linguistic / Stylistic', exampleSentence: 'In Shakespeare\'s history plays, "the crown" is the tragic metonymy for sovereign burden and mortal ambition.' },
        { word: 'synecdoche', recommendedRegister: 'Rhetorical / Poetic', exampleSentence: 'Calling a businessman a "suit" is a dismissive synecdoche.' },
        { word: 'symbol', recommendedRegister: 'Literary / Semiotic', exampleSentence: 'The green light in The Great Gatsby operates as an evocative symbol of unattainable romantic longing.' },
      ],
    },
  },
  {
    term: 'catachresis',
    part_of_speech: 'noun',
    phonetic: '/ˌkæt.əˈkriː.sɪs/',
    primary_definition: 'The deliberate, strained, or paradoxical misuse of a word or metaphor that radically violates conventional linguistic norms, or names a phenomenon lacking a literal term.',
    nuance_note: 'In classical rhetoric (Quintilian), a necessary strained metaphor when language lacks a proper word (e.g., "the leg of a table" or "arms of a chair"); in post-structuralism (Derrida, Spivak), the foundational condition of concepts like "democracy" or "justice" that exceed any single literal referent.',
    etymology: {
      roots: [
        { morpheme: 'kata-', meaning: 'against / down / perversion of', origin: 'Greek' },
        { morpheme: 'chresis', meaning: 'use / employment', origin: 'Greek' },
      ],
      cognates: ['catachrestic'],
    },
    collocations: ['daring catachresis', 'poetic catachresis', 'border on catachresis', 'strain of catachresis'],
    source_context: {
      sentence: 'Catachresis is the violent application of a word to an object for which no proper, literal word exists in language.',
      source: 'Institutio Oratoria',
      author: 'Quintilian',
    },
    cloze_sentences: [
      'Hamlet\'s famous dilemma to "take arms against a sea of troubles" is a celebrated {{c1::catachresis}}, violently mixing martial weaponry with an oceanic metaphor.',
      'Spivak argued that claiming "rights" for the subaltern is an enabling {{c1::catachresis}}, borrowing an imperial Western vocabulary to demand postcolonial justice.',
    ],
    distinction_matrix: {
      synonyms: ['catachresis', 'mixed metaphor', 'malapropism'],
      nuanceComparison: 'Catachresis is the deliberate, profound, or necessary stretching of language beyond conventional bounds; mixed metaphor is an awkward, unintended clash of incompatible imagery; malapropism is the comical, ignorant substitution of a similar-sounding wrong word.',
      contextRecommendations: [
        { word: 'catachresis', recommendedRegister: 'Rhetorical / Deconstructive', exampleSentence: 'The metaphysical poets embraced catachresis, yoking violently dissimilar ideas together by force.' },
        { word: 'mixed metaphor', recommendedRegister: 'Stylistic / Editorial', exampleSentence: 'The politician stumbled into a mixed metaphor: "We must iron out our hurdles and sail to victory."' },
        { word: 'malapropism', recommendedRegister: 'Comedic / Literary', exampleSentence: 'Mrs. Malaprop\'s boast that someone was "as headstrong as an allegory on the banks of the Nile" is the archetypal malapropism.' },
      ],
    },
  },
  {
    term: 'elegiac',
    part_of_speech: 'adjective',
    phonetic: '/ˌel.ɪˈdʒaɪ.ək/',
    primary_definition: 'Mournful, sorrowful, or plaintive; expressing profound lamentation and melancholic longing for what is past, dead, or irrecoverably lost.',
    nuance_note: 'Originally derived from the classical Greek elegiac couplet (dactylic hexameter paired with pentameter). Extended in modern literature to describe works (W.G. Sebald, Rilke, Thomas Hardy) bathed in quiet, dignified grief over transience and historical ruins.',
    etymology: {
      roots: [
        { morpheme: 'elegos', meaning: 'song of mourning / lament', origin: 'Greek' },
        { morpheme: '-iac', meaning: 'pertaining to / resembling', origin: 'Greek' },
      ],
      cognates: ['elegy'],
    },
    collocations: ['elegiac tone', 'elegiac prose', 'elegiac lament', 'elegiac beauty'],
    source_context: {
      sentence: 'Sebald\'s novels unfold with an elegiac gravity, documenting the silent decay of European landscapes and the fading memory of vanished peoples.',
      source: 'The Rings of Saturn (Critical Introduction)',
      author: 'Susan Sontag',
    },
    cloze_sentences: [
      'The cello suite closed on a sustained, {{c1::elegiac}} chord that lingered in the darkened concert hall like a dying whisper.',
      'Virginia Woolf captured an intensely {{c1::elegiac}} mood in To the Lighthouse, mourning the golden family summers shattered by the Great War.',
    ],
    distinction_matrix: {
      synonyms: ['elegiac', 'sepulchral', 'melancholic'],
      nuanceComparison: 'Elegiac expresses tender, dignified poetic sorrow for a lost past or deceased loved one; sepulchral evokes the gloomy, chilling atmosphere of a tomb; melancholic denotes a lingering, introspective, habitual sadness.',
      contextRecommendations: [
        { word: 'elegiac', recommendedRegister: 'Poetic / High Literary', exampleSentence: 'Gray\'s "Elegy Written in a Country Churchyard" established the supreme English model of elegiac contemplation.' },
        { word: 'sepulchral', recommendedRegister: 'Gothic / Somber', exampleSentence: 'The castle crypt echoed with a cold, sepulchral stillness.' },
        { word: 'melancholic', recommendedRegister: 'Psychological / Artistic', exampleSentence: 'Chopin\'s nocturnes radiate a delicate, melancholic tenderness.' },
      ],
    },
  },
  {
    term: 'apotheosis',
    part_of_speech: 'noun',
    phonetic: '/əˌpɒθ.iˈoʊ.sɪs/',
    primary_definition: 'The elevation of a person to the status of a deity (deification); or the supreme, idealized culmination and highest point of an art or principle.',
    nuance_note: 'In ancient Rome, the formal deification of deceased emperors voted by the Senate. In aesthetic theory and cultural criticism, it denotes the quintessential, glorious apex of a style, movement, or heroic endeavor.',
    etymology: {
      roots: [
        { morpheme: 'apo-', meaning: 'away / from / completely', origin: 'Greek' },
        { morpheme: 'theos', meaning: 'god / deity', origin: 'Greek' },
        { morpheme: '-osis', meaning: 'process / condition of', origin: 'Greek' },
      ],
      cognates: ['theology', 'atheism', 'pantheon', 'apotheosize'],
    },
    collocations: ['apotheosis of art', 'reach an apotheosis', 'cultural apotheosis', 'apotheosis of the hero'],
    source_context: {
      sentence: 'Beethoven\'s Seventh Symphony was famously celebrated by Richard Wagner as the very apotheosis of the dance, humanity\'s physical joy sublimated into pure rhythm.',
      source: 'The Artwork of the Future',
      author: 'Richard Wagner',
    },
    cloze_sentences: [
      'The ceiling fresco in the cathedral depicted the glorious {{c1::apotheosis}} of Saint Ignatius ascending into heavenly celestial light.',
      'Critics hailed the author\'s sprawling trilogy as the ultimate {{c1::apotheosis}} of the twentieth-century psychological novel.',
    ],
    distinction_matrix: {
      synonyms: ['apotheosis', 'zenith', 'canonization'],
      nuanceComparison: 'Apotheosis implies glorification or elevation to divine, transcendent stature; zenith marks the highest astronomical or chronological point of power or success; canonization is the formal admission of a person or text into an official list of saints or classic masterpieces.',
      contextRecommendations: [
        { word: 'apotheosis', recommendedRegister: 'Classical / High Aesthetic', exampleSentence: 'The coronation banquet represented the theatrical apotheosis of the monarch\'s supreme power.' },
        { word: 'zenith', recommendedRegister: 'Astronomical / Metaphorical', exampleSentence: 'The Roman Empire reached the zenith of its territorial expanse under Trajan.' },
        { word: 'canonization', recommendedRegister: 'Theological / Academic', exampleSentence: 'The academic canonization of James Joyce took place within decades of his death.' },
      ],
    },
  },
  {
    term: 'liminality',
    part_of_speech: 'noun',
    phonetic: '/ˌlɪm.ɪˈnæl.ɪ.ti/',
    primary_definition: 'The transitional, ambiguous, and disorienting threshold state of being between two distinct existential, social, or spatial phases.',
    nuance_note: 'Developed by folklorist Arnold van Gennep (Rites of Passage) and expanded by anthropologist Victor Turner. During the liminal phase, individuals are "betwixt and between" established roles, experiencing communitas, vulnerability, and radical openness to transformation.',
    etymology: {
      roots: [
        { morpheme: 'limen', meaning: 'threshold / lintel / doorway', origin: 'Latin' },
        { morpheme: '-al', meaning: 'pertaining to', origin: 'Latin' },
        { morpheme: '-ity', meaning: 'state / quality of', origin: 'Latin' },
      ],
      cognates: ['subliminal', 'eliminate', 'limit'],
    },
    collocations: ['liminal space', 'state of liminality', 'experience liminality', 'liminal threshold'],
    source_context: {
      sentence: 'Liminal entities are neither here nor there; they are betwixt and between the positions assigned and arrayed by law, custom, convention, and ceremonial.',
      source: 'The Forest of Symbols: Aspects of Ndembu Ritual',
      author: 'Victor Turner',
    },
    cloze_sentences: [
      'Empty airport terminals at three in the morning possess an eerie {{c1::liminality}}, suspended between departure and destination.',
      'The period of adolescence is defined by psychological {{c1::liminality}}, as the youth sheds childhood without yet attaining adult autonomy.',
    ],
    distinction_matrix: {
      synonyms: ['liminality', 'transition', 'purgatory'],
      nuanceComparison: 'Liminality is the specific anthropological and existential state of being on a transformational threshold; transition is any generic change from one state to another; purgatory is a state of spiritual suffering or purification before deliverance.',
      contextRecommendations: [
        { word: 'liminality', recommendedRegister: 'Anthropological / Cultural Theory', exampleSentence: 'Graduation rituals mark the formal end of collegiate liminality.' },
        { word: 'transition', recommendedRegister: 'Everyday / Corporate', exampleSentence: 'The company managed a smooth executive transition over six months.' },
        { word: 'purgatory', recommendedRegister: 'Theological / Metaphorical', exampleSentence: 'He felt trapped in bureaucratic purgatory waiting for his visa approval.' },
      ],
    },
  },
  {
    term: 'catharsis',
    part_of_speech: 'noun',
    phonetic: '/kəˈθɑː.sɪs/',
    primary_definition: 'The emotional release, purification, or purgation of pity and fear evoked in an audience through experiencing tragic art.',
    nuance_note: 'Aristotle\'s Poetics; tragic drama does not inflame antisocial passions (as Plato feared), but provides a homeopathic cleansing of excess pity (eleos) and terror (phobos), restoring psychic and civic equilibrium. Plural: catharses.',
    etymology: {
      roots: [
        { morpheme: 'katharsis', meaning: 'cleansing / purification', origin: 'Greek' },
        { morpheme: 'katharos', meaning: 'pure / clean / clear', origin: 'Greek' },
      ],
      cognates: ['cathartic', 'Cathar'],
    },
    collocations: ['emotional catharsis', 'dramatic catharsis', 'catharsis of tragedy', 'achieve catharsis'],
    source_context: {
      sentence: 'Tragedy is an imitation of an action that is serious, complete, and of a certain magnitude; through pity and fear effecting the proper purgation (catharsis) of these emotions.',
      source: 'Poetics',
      author: 'Aristotle',
    },
    cloze_sentences: [
      'Weeping openly at the climax of the opera provided the audience with a profound sense of shared {{c1::catharsis}}.',
      'Writing the memoir was not merely an act of memory, but a painful psychological {{c1::catharsis}} releasing decades of trauma.',
    ],
    distinction_matrix: {
      synonyms: ['catharsis', 'abreaction', 'purification'],
      nuanceComparison: 'Catharsis is the aesthetic and spiritual purgation of pity and fear through dramatic art; abreaction is the psychoanalytic release of repressed emotional trauma through reliving it; purification is moral or ritual cleansing of guilt or stain.',
      contextRecommendations: [
        { word: 'catharsis', recommendedRegister: 'Aristotelian / Theatrical / Literary', exampleSentence: 'The final reconciliation in King Lear offers the spectators heartbreaking catharsis.' },
        { word: 'abreaction', recommendedRegister: 'Freudian / Clinical Psychoanalysis', exampleSentence: 'The therapist facilitated the patient\'s abreaction of early childhood grief.' },
        { word: 'purification', recommendedRegister: 'Ritual / Religious', exampleSentence: 'Pilgrims underwent ceremonial purification before entering the inner sanctum.' },
      ],
    },
  },
  {
    term: 'bathos',
    part_of_speech: 'noun',
    phonetic: '/ˈbeɪ.θɒs/',
    primary_definition: 'An abrupt and ludicrous descent from the elevated, sublime, or tragic to the trivial, common, or ridiculous; anticlimax.',
    nuance_note: 'Introduced into English criticism by Alexander Pope in his 1727 treatise Peri Bathous, or the Art of Sinking in Poetry. Bathos can be an accidental poetic failure of bad verse or a deliberate comic device employed by satirists.',
    etymology: {
      roots: [
        { morpheme: 'bathos', meaning: 'depth / deep water', origin: 'Greek' },
        { morpheme: 'bathys', meaning: 'deep / profound', origin: 'Greek' },
      ],
      cognates: ['bathymetry', 'bathysphere'],
    },
    collocations: ['descent into bathos', 'unintentional bathos', 'plunge into bathos', 'steeped in bathos'],
    source_context: {
      sentence: 'The poet who aims at the sublime without the wings of genius inevitably plunges headlong into bathos, sinking from the sublime to the ridiculous.',
      source: 'Peri Bathous: Or, The Art of Sinking in Poetry',
      author: 'Alexander Pope',
    },
    cloze_sentences: [
      'The eulogy began with majestic solemnity, but collapsed into unintentional {{c1::bathos}} when the speaker complained about parking tickets.',
      'Romantic melodrama frequently walks a razor\'s edge between transcendent heartbreak and laughable {{c1::bathos}}.',
    ],
    distinction_matrix: {
      synonyms: ['bathos', 'pathos', 'anticlimax'],
      nuanceComparison: 'Bathos is the failed or comical plummet from sublime grandeur to trivial banality; pathos is genuine, moving pity and compassion; anticlimax is any disappointing conclusion to building narrative tension.',
      contextRecommendations: [
        { word: 'bathos', recommendedRegister: 'Literary Satire / Rhetorical Critique', exampleSentence: 'Pope exposed the bathos of contemporary court poets whose grand metaphors crashed into clumsy banalities.' },
        { word: 'pathos', recommendedRegister: 'Dramatic / Artistic', exampleSentence: 'The dying soldier\'s last letter was filled with heartbreaking pathos.' },
        { word: 'anticlimax', recommendedRegister: 'Narrative / Everyday', exampleSentence: 'After weeks of media frenzy, the verdict was a dull anticlimax.' },
      ],
    },
  },
  {
    term: 'anaphora',
    part_of_speech: 'noun',
    phonetic: '/əˈnæf.ər.ə/',
    primary_definition: 'The rhetorical repetition of a word or phrase at the beginning of successive clauses, sentences, or verses for emotional emphasis or rhythmic power.',
    nuance_note: 'A cornerstone of prophetic, political, and poetic oratory. Classic examples: Winston Churchill ("We shall fight on the beaches, we shall fight on the landing grounds..."), Martin Luther King Jr. ("I have a dream..."), and Charles Dickens ("It was the best of times...").',
    etymology: {
      roots: [
        { morpheme: 'ana-', meaning: 'back / again', origin: 'Greek' },
        { morpheme: 'pherein', meaning: 'to bear / carry', origin: 'Greek' },
      ],
      cognates: ['aphorism', 'metaphor', 'transfer'],
    },
    collocations: ['rhetorical anaphora', 'use of anaphora', 'poetic anaphora', 'resonant anaphora'],
    source_context: {
      sentence: 'Whitman\'s free verse derived its majestic, rolling energy from liturgical anaphora, beginning line after line with the same rolling incantation.',
      source: 'The Ecstatic Whitman',
      author: 'Harold Bloom',
    },
    cloze_sentences: [
      'Dr. King\'s repeating phrase "I have a dream" is the most celebrated instance of {{c1::anaphora}} in twentieth-century American public rhetoric.',
      'The protest chant deployed rhythmic {{c1::anaphora}} to weld the crowd into a unified chorus of moral outrage.',
    ],
    distinction_matrix: {
      synonyms: ['anaphora', 'epistrophe', 'refrain'],
      nuanceComparison: 'Anaphora is the repetition of words at the beginning of successive clauses; epistrophe is repetition at the end of clauses ("government of the people, by the people, for the people"); refrain is a recurring verse or chorus across a poem.',
      contextRecommendations: [
        { word: 'anaphora', recommendedRegister: 'Classical Rhetoric / Oratory', exampleSentence: 'Churchill\'s stirring anaphora rallied British resolve during the darkest days of the Blitz.' },
        { word: 'epistrophe', recommendedRegister: 'Rhetorical / Stylistic', exampleSentence: 'The defense attorney used epistrophe to pound the phrase "beyond reasonable doubt" into the jury\'s mind.' },
        { word: 'refrain', recommendedRegister: 'Poetic / Musical', exampleSentence: 'Poe\'s raven croaks the haunting refrain "Nevermore."' },
      ],
    },
  },
  {
    term: 'litotes',
    part_of_speech: 'noun',
    phonetic: '/laɪˈtoʊ.tiːz/',
    primary_definition: 'A deliberate figure of rhetorical understatement in which an affirmative idea is expressed by negating its contrary.',
    nuance_note: 'Common in Anglo-Saxon heroic poetry (Beowulf) and classical satire to convey irony, modesty, or restrained grim humor. Examples: "he is not unfamiliar with defeat," "no small feat," or "she was not unhappy with the outcome."',
    etymology: {
      roots: [
        { morpheme: 'litos', meaning: 'plain / simple / slender / meager', origin: 'Greek' },
        { morpheme: '-tes', meaning: 'abstract noun suffix', origin: 'Greek' },
      ],
      cognates: ['litotic'],
    },
    collocations: ['master of litotes', 'ironic litotes', 'employ litotes', 'classic litotes'],
    source_context: {
      sentence: 'Old English poetry eschews flamboyant boasting in favor of grim litotes; a deadly wound is described laconically as "not the most gentle of greetings."',
      source: 'The Heroic Age of English Literature',
      author: 'J.R.R. Tolkien',
    },
    cloze_sentences: [
      'To describe winning the Nobel Prize as "not bad for an afternoon\'s work" is an exquisite example of comedic {{c1::litotes}}.',
      'British diplomatic prose has long favored dry {{c1::litotes}} to defuse escalating geopolitical crises.',
    ],
    distinction_matrix: {
      synonyms: ['litotes', 'understatement', 'hyperbole'],
      nuanceComparison: 'Litotes is understatement achieved specifically by negating the opposite ("not insignificant"); understatement is any presentation of things as smaller or less important than they are; hyperbole is deliberate, wild exaggeration.',
      contextRecommendations: [
        { word: 'litotes', recommendedRegister: 'Rhetorical / Stylistic', exampleSentence: 'Her litotes ("the concert was not entirely without merit") barely masked her severe disappointment.' },
        { word: 'understatement', recommendedRegister: 'Conversational / British English', exampleSentence: 'Saying the hurricane was "a bit breezy" is classic British understatement.' },
        { word: 'hyperbole', recommendedRegister: 'Rhetorical / Commercial', exampleSentence: 'The movie trailer was filled with wild hyperbole, claiming it was the greatest film in human history.' },
      ],
    },
  },
  {
    term: 'zeugma',
    part_of_speech: 'noun',
    phonetic: '/ˈzjuːɡ.mə/',
    primary_definition: 'A figure of speech in which a single word (usually a verb or adjective) applies grammatically to two others in markedly different, often literal and figurative, senses.',
    nuance_note: 'From Greek zeugnynai (to yoke). Used brilliantly by Alexander Pope and eighteenth-century satirists: "Here, thou, great Anna! whom three realms obey, / Dost sometimes counsel take—and sometimes tea." Often used interchangeably with syllepsis.',
    etymology: {
      roots: [
        { morpheme: 'zeugma', meaning: 'a yoking / bond', origin: 'Greek' },
        { morpheme: 'zeugnynai', meaning: 'to yoke / join together', origin: 'Greek' },
      ],
      cognates: ['zygote', 'syzygy'],
    },
    collocations: ['deliberate zeugma', 'poetic zeugma', 'witty zeugma', 'employ a zeugma'],
    source_context: {
      sentence: 'The eighteenth-century heroic couplet perfected the zeugma, yoking elevated moral virtue to domestic vanity within a single mocking verb.',
      source: 'The Poetry of Pope',
      author: 'G. Wilson Knight',
    },
    cloze_sentences: [
      'The rogue left the tavern having broken two promises, three glasses, and her heart—a textbook example of {{c1::zeugma}}.',
      'Alexander Pope famously mocked high-society gossip in The Rape of the Lock by uniting stain of honor and stain of silk through biting {{c1::zeugma}}.',
    ],
    distinction_matrix: {
      synonyms: ['zeugma', 'syllepsis', 'pun'],
      nuanceComparison: 'Zeugma yokes two nouns to one verb in different semantic registers; syllepsis is a grammatically correct zeugma where the verb holds different meanings for each noun; pun is any humorous wordplay on homophones or ambiguity.',
      contextRecommendations: [
        { word: 'zeugma', recommendedRegister: 'Rhetorical / Augustan Satire', exampleSentence: 'The weary traveler took his hat and his leave, a neat zeugma closing the chapter.' },
        { word: 'syllepsis', recommendedRegister: 'Grammatical / Linguistic', exampleSentence: '"She blew my mind and my birthday candles" is a modern syllepsis.' },
        { word: 'pun', recommendedRegister: 'Comedic / Popular', exampleSentence: 'He made an awful pun about bakers needing to make some dough.' },
      ],
    },
  },
  {
    term: 'aposiopesis',
    part_of_speech: 'noun',
    phonetic: '/ˌæp.ə.saɪ.əˈpiː.sɪs/',
    primary_definition: 'An abrupt breaking off in the middle of a sentence, leaving the utterance syntactically incomplete due to overwhelming emotion, hesitation, or threat.',
    nuance_note: 'Classic Latin example: Neptune in the Aeneid ("Quos ego—! sed motos praestat componere fluctus" — "Whom I—! but it is better to calm the troubled waves"). The speaker halts, allowing the unspoken wrath or grief to hang in the air.',
    etymology: {
      roots: [
        { morpheme: 'apo-', meaning: 'away / off / from', origin: 'Greek' },
        { morpheme: 'siopan', meaning: 'to be silent', origin: 'Greek' },
        { morpheme: 'siope', meaning: 'silence', origin: 'Greek' },
      ],
      cognates: ['aposiopetic'],
    },
    collocations: ['rhetorical aposiopesis', 'dramatic aposiopesis', 'lapse into aposiopesis', 'sudden aposiopesis'],
    source_context: {
      sentence: 'Lear\'s rage fractures language into terrifying aposiopesis: "I will have such revenges on you both, / That all the world shall—I will do such things— / What they are, yet I know not."',
      source: 'Shakespearean Tragedy',
      author: 'A.C. Bradley',
    },
    cloze_sentences: [
      'Choked with sudden tears upon seeing his ancestral home in ashes, his speech trailed off into heart-wrenching {{c1::aposiopesis}}.',
      'The villain uttered a dark threat that broke off into sinister {{c1::aposiopesis}}: "Cross me once more, and you shall—well, you know the consequences."',
    ],
    distinction_matrix: {
      synonyms: ['aposiopesis', 'ellipsis', 'paralipsis'],
      nuanceComparison: 'Aposiopesis is an impassioned, sudden stopping mid-sentence leaving thought unfinished; ellipsis is the grammatical omission of words understood from context (or typographical dots ...); paralipsis is stating that one will not mention something while mentioning it.',
      contextRecommendations: [
        { word: 'aposiopesis', recommendedRegister: 'Dramatic / Rhetorical Analysis', exampleSentence: 'The actor\'s sudden aposiopesis communicated the character\'s unspoken trauma more eloquently than monologues.' },
        { word: 'ellipsis', recommendedRegister: 'Grammatical / Punctuation', exampleSentence: 'The editor used an ellipsis to condense the lengthy quote.' },
        { word: 'paralipsis', recommendedRegister: 'Political / Oratorical', exampleSentence: 'Saying "I shall not mention my opponent\'s criminal indictment" is classic paralipsis.' },
      ],
    },
  },
  {
    term: 'prolepsis',
    part_of_speech: 'noun',
    phonetic: '/proʊˈlep.sɪs/',
    primary_definition: 'The anticipation and answering of an objection before it is raised; or in narratology, an anachronous flash-forward to future events.',
    nuance_note: 'In classical rhetoric (Greek pro- [before] + lambanein [to take]), refuting an opponent\'s argument in advance; in narratology (Genette), a flash-forward that reveals future narrative events ahead of chronological time (contrasted with analepsis, or flashback).',
    etymology: {
      roots: [
        { morpheme: 'pro-', meaning: 'before / in front of', origin: 'Greek' },
        { morpheme: 'lambanein', meaning: 'to take / seize', origin: 'Greek' },
        { morpheme: '-sis', meaning: 'process / condition', origin: 'Greek' },
      ],
      cognates: ['proleptic', 'epilepsy', 'catalepsy'],
    },
    collocations: ['rhetorical prolepsis', 'narrative prolepsis', 'proleptic anticipation', 'employ prolepsis'],
    source_context: {
      sentence: 'Garcia Marquez opens One Hundred Years of Solitude with the most celebrated prolepsis in world literature: "Many years later, as he faced the firing squad..."',
      source: 'Narrative Discourse',
      author: 'Gérard Genette',
    },
    cloze_sentences: [
      'Anticipating the skeptical panel, the scientist used {{c1::prolepsis}} to refute potential criticisms of her methodology in the introductory slide.',
      'The opening sentence of the novel executes a breathtaking {{c1::prolepsis}}, revealing the protagonist\'s eventual execution before chronicling his youth.',
    ],
    distinction_matrix: {
      synonyms: ['prolepsis', 'analepsis', 'foreshadowing'],
      nuanceComparison: 'Prolepsis is an explicit narrative flash-forward jumping directly into future events; analepsis is an explicit flashback jumping backward; foreshadowing provides subtle, indirect hints and omens of what is to come without revealing the event.',
      contextRecommendations: [
        { word: 'prolepsis', recommendedRegister: 'Narratological / Rhetorical', exampleSentence: 'The biography used prolepsis to frame the young artist\'s apprentice sketches against his final masterpieces.' },
        { word: 'analepsis', recommendedRegister: 'Formalist / Film Studies', exampleSentence: 'The film relies on extended analepsis to explain how the detective became cynical.' },
        { word: 'foreshadowing', recommendedRegister: 'Literary / Dramatic', exampleSentence: 'The raven perched above the door served as chilling foreshadowing of tragedy.' },
      ],
    },
  },
  {
    term: 'periphrasis',
    part_of_speech: 'noun',
    phonetic: '/pəˈrɪf.rə.sɪs/',
    primary_definition: 'The use of indirect, roundabout, or circumlocutory language to express an idea that could be stated more concisely.',
    nuance_note: 'From Greek peri- (around) + phrazein (to speak). Found in high epic decorum (e.g., Homer calling the sea "the wine-dark deep" or Milton calling the sun "the great luminary of day") and in diplomatic or bureaucratic euphemism. Plural: periphrases.',
    etymology: {
      roots: [
        { morpheme: 'peri-', meaning: 'around / about', origin: 'Greek' },
        { morpheme: 'phrazein', meaning: 'to speak / express / point out', origin: 'Greek' },
      ],
      cognates: ['phrase', 'paraphrase', 'periphrastic'],
    },
    collocations: ['elaborate periphrasis', 'use of periphrasis', 'poetic periphrasis', 'periphrastic style'],
    source_context: {
      sentence: 'Neoclassical poets elevated common realities through ornate periphrasis, preferring to speak of "the finny tribe" rather than humble fish.',
      source: 'The Augustan World',
      author: 'A.R. Humphreys',
    },
    cloze_sentences: [
      'Instead of simply saying he died, the obituary indulged in florid {{c1::periphrasis}}, announcing that he had "embarked on the eternal voyage to the silent shore."',
      'Legal contracts often rely on tedious {{c1::periphrasis}} to ensure no loophole remains unclosed.',
    ],
    distinction_matrix: {
      synonyms: ['periphrasis', 'circumlocution', 'euphemism'],
      nuanceComparison: 'Periphrasis is the stylistic or poetic use of a descriptive roundabout phrase instead of a single name; circumlocution is evasive or long-winded wordiness; euphemism is substituting an inoffensive phrase for a harsh or taboo reality.',
      contextRecommendations: [
        { word: 'periphrasis', recommendedRegister: 'Rhetorical / Classical Stylistics', exampleSentence: 'Calling the morning "the rosy-fingered dawn" is an immortal Homeric periphrasis.' },
        { word: 'circumlocution', recommendedRegister: 'Administrative / Critical', exampleSentence: 'The politician answered the direct question with five minutes of evasive circumlocution.' },
        { word: 'euphemism', recommendedRegister: 'Sociological / Everyday', exampleSentence: '"Passing away" is a tender euphemism for death.' },
      ],
    },
  },
  {
    term: 'apostrophe',
    part_of_speech: 'noun',
    phonetic: '/əˈpɒs.trə.fi/',
    primary_definition: 'A rhetorical or poetic device in which the speaker directly addresses an absent person, deceased figure, inanimate object, or abstract personified concept.',
    nuance_note: 'From Greek apo- (away) + strephein (to turn), originally describing an orator turning away from the jury to address an absent deity or concept. Famous in Romantic poetry: Wordsworth\'s "Milton! thou shouldst be living at this hour," or Shelley\'s address to the West Wind.',
    etymology: {
      roots: [
        { morpheme: 'apo-', meaning: 'away / off / from', origin: 'Greek' },
        { morpheme: 'strephein', meaning: 'to turn', origin: 'Greek' },
      ],
      cognates: ['catastrophe', 'strophe', 'antistrophe'],
    },
    collocations: ['rhetorical apostrophe', 'poetic apostrophe', 'address via apostrophe', 'impassioned apostrophe'],
    source_context: {
      sentence: 'Apostrophe is the central trope of Romantic lyric; the poet attempts to animate the inanimate universe, turning directly to the wind, the urn, or the nightingale.',
      source: 'The Pursuit of Signs: Semiotics, Literature, Deconstruction',
      author: 'Jonathan Culler',
    },
    cloze_sentences: [
      'Keats\'s "Ode on a Grecian Urn" begins with an intimate poetic {{c1::apostrophe}}: "Thou still unravish\'d bride of quietness!"',
      'Standing before the crumbling ruins of the forum, the orator broke into an impassioned {{c1::apostrophe}} to the departed spirit of the Roman Republic.',
    ],
    distinction_matrix: {
      synonyms: ['apostrophe', 'personification', 'invocation'],
      nuanceComparison: 'Apostrophe is the direct vocal address to an absent entity or abstraction; personification is attributing human qualities to non-human things; invocation is a prayerful call to a muse or deity for poetic assistance.',
      contextRecommendations: [
        { word: 'apostrophe', recommendedRegister: 'Rhetorical / Poetics', exampleSentence: 'Hamlet\'s cry "Frailty, thy name is woman!" is a bitter apostrophe to an abstract concept.' },
        { word: 'personification', recommendedRegister: 'Literary / Figurative', exampleSentence: 'The weeping willow was described as personification of sorrow.' },
        { word: 'invocation', recommendedRegister: 'Epic / Classical', exampleSentence: 'Homer opens the Iliad with an epic invocation to the Muse.' },
      ],
    },
  },
  {
    term: 'hypallage',
    part_of_speech: 'noun',
    phonetic: '/haɪˈpæl.ə.dʒi/',
    primary_definition: 'A figure of speech in which an epithet or modifier is displaced from its natural grammatical subject to another related noun in the sentence; a transferred epithet.',
    nuance_note: 'From Greek hypo- (under) + allassein (to change/exchange). Classic poetic examples: "the sleepless night" (the night isn\'t sleepless, the person is), "a careless cigarette," or Virgil\'s "they walked dark in the lonely night."',
    etymology: {
      roots: [
        { morpheme: 'hypo-', meaning: 'under / beneath', origin: 'Greek' },
        { morpheme: 'allassein', meaning: 'to change / exchange / alternate', origin: 'Greek' },
      ],
      cognates: ['parallel', 'allegory'],
    },
    collocations: ['transferred epithet hypallage', 'poetic hypallage', 'use of hypallage', 'subtle hypallage'],
    source_context: {
      sentence: 'T.S. Eliot perfected modern hypallage in The Love Song of J. Alfred Prufrock: "The yellow fog that rubs its back upon the window-panes."',
      source: 'The Composition of Four Quartets',
      author: 'Helen Gardner',
    },
    cloze_sentences: [
      'When the weary traveler spoke of his "restless pillow," he utilized {{c1::hypallage}} to transfer his insomnia onto an inanimate object.',
      'Virgil\'s famous line describing how the travelers walked "lonely in the dark night" is an unforgettable classical {{c1::hypallage}}.',
    ],
    distinction_matrix: {
      synonyms: ['hypallage', 'transferred epithet', 'metonymy'],
      nuanceComparison: 'Hypallage is the specific grammatical transfer of an adjective from its logical subject to another noun; transferred epithet is the modern English term for the same device; metonymy is substituting one noun for an associated noun.',
      contextRecommendations: [
        { word: 'hypallage', recommendedRegister: 'Classical Philology / Stylistics', exampleSentence: 'Milton\'s "blind mouths" in Lycidas is an aggressive theological hypallage condemning corrupt bishops.' },
        { word: 'transferred epithet', recommendedRegister: 'General Literary Analysis', exampleSentence: 'The novelist wrote of a "nervous cigarette," employing a transferred epithet.' },
        { word: 'metonymy', recommendedRegister: 'Linguistic / Poetics', exampleSentence: 'Using "the bench" to refer to judges is metonymy, not hypallage.' },
      ],
    },
  },
  {
    term: 'synesthesia',
    part_of_speech: 'noun',
    phonetic: '/ˌsɪn.əsˈθiː.ʒə/',
    primary_definition: 'The poetic or neurological blending of sensory modalities, in which the stimulation of one sense evokes sensations typical of another (e.g., tasting sounds, hearing colors).',
    nuance_note: 'Celebrated by French Symbolist poets (Baudelaire\'s "Correspondances," Rimbaud\'s "Voyelles" assigning colors to vowels). It became central to modernism as a technique to dissolve rigid empirical boundaries into poetic wholeness.',
    etymology: {
      roots: [
        { morpheme: 'syn-', meaning: 'together / union', origin: 'Greek' },
        { morpheme: 'aisthesis', meaning: 'sensation / perception', origin: 'Greek' },
      ],
      cognates: ['aesthetic', 'anesthesia', 'kinesthesia'],
    },
    collocations: ['poetic synesthesia', 'experience synesthesia', 'synesthetic imagery', 'cross-modal synesthesia'],
    source_context: {
      sentence: 'Like long-held echoes blending in the distance / In a profound and shadowy unity / Vast as the night and as the illumination, / Perfumes, colors, and sounds correspond.',
      source: 'Les Fleurs du Mal (Correspondances)',
      author: 'Charles Baudelaire',
    },
    cloze_sentences: [
      'The wine critic indulged in florid {{c1::synesthesia}}, describing the dry Riesling as possessing "a sharp green trumpet note."',
      'Baudelaire\'s symbolist poetry celebrated {{c1::synesthesia}}, weaving scents, visual tints, and musical harmonies into sacred correspondence.',
    ],
    distinction_matrix: {
      synonyms: ['synesthesia', 'sensory blending', 'hallucination'],
      nuanceComparison: 'Synesthesia is the involuntary cross-modal sensory linkage or poetic metaphor combining senses; sensory blending is general integration of perception; hallucination is false perception without sensory stimulus.',
      contextRecommendations: [
        { word: 'synesthesia', recommendedRegister: 'Poetic / Neurological', exampleSentence: 'Nabokov possessed colored hearing, a vivid synesthesia where the letter "k" was a huckleberry blue.' },
        { word: 'sensory blending', recommendedRegister: 'Cognitive Science / Everyday', exampleSentence: 'Gastronomy relies on sensory blending between smell and taste receptors.' },
        { word: 'hallucination', recommendedRegister: 'Clinical / Psychiatric', exampleSentence: 'Sleep deprivation induced alarming visual hallucinations in the night guard.' },
      ],
    },
  },
  {
    term: 'enjambment',
    part_of_speech: 'noun',
    phonetic: '/ɪnˈdʒæm.mənt/',
    primary_definition: 'The continuation of a sentence, syntactic clause, or thought across a poetic line break without terminal punctuation or pause.',
    nuance_note: 'From French enjamber (to stride over, from jambe [leg]). Contrasted with end-stopped lines; enjambment introduces rhythmic acceleration, suspense, and semantic tension by striding across the formal boundary of the line.',
    etymology: {
      roots: [
        { morpheme: 'en-', meaning: 'in / onto', origin: 'French' },
        { morpheme: 'jambe', meaning: 'leg', origin: 'French' },
        { morpheme: '-ment', meaning: 'action / condition of', origin: 'French' },
      ],
      cognates: ['jamb', 'gambol'],
    },
    collocations: ['radical enjambment', 'use of enjambment', 'enjambed line', 'rhythmic enjambment'],
    source_context: {
      sentence: 'Milton rejected the jingling end-stopped couplets of his era, inventing a majestic blank verse whose surging rhythm relied upon continuous enjambment.',
      source: 'Paradise Lost (Preface on the Verse)',
      author: 'John Milton',
    },
    cloze_sentences: [
      'The modern poem creates breathlessness through aggressive {{c1::enjambment}}, breaking clauses mid-preposition to pull the eye rapidly downward.',
      'Unlike Pope\'s rigid end-stopped couplets, Wordsworth used fluid {{c1::enjambment}} to mimic the natural cadence of a walking meditation.',
    ],
    distinction_matrix: {
      synonyms: ['enjambment', 'end-stopping', 'caesura'],
      nuanceComparison: 'Enjambment is striding across a poetic line break without terminal punctuation; end-stopping is pausing at line end with terminal punctuation; caesura is an intentional pause or break in the middle of a poetic line.',
      contextRecommendations: [
        { word: 'enjambment', recommendedRegister: 'Poetic Prosody / Literary Analysis', exampleSentence: 'Rilke\'s enjambment propels the reader forward as the statue of Apollo demands: "You must change your life."' },
        { word: 'end-stopping', recommendedRegister: 'Prosodic / Classical', exampleSentence: 'Chaucer\'s early verse relies on disciplined end-stopping.' },
        { word: 'caesura', recommendedRegister: 'Metrical / Prosodic', exampleSentence: 'Old English alliterative verse balances two rhythmic half-lines across a central caesura.' },
      ],
    },
  },
  {
    term: 'susurrus',
    part_of_speech: 'noun',
    phonetic: '/sʊˈsʌr.əs/',
    primary_definition: 'A whispering sound; a continuous, low murmuring, rustling, or gentle humming acoustic presence.',
    nuance_note: 'An onomatopoeic Latinate word reserved for elevated poetic or lyrical prose, capturing the acoustic texture of rustling leaves, gentle waves, or hushed whispers in an auditorium.',
    etymology: {
      roots: [
        { morpheme: 'susurrare', meaning: 'to whisper / hum / buzz', origin: 'Latin' },
        { morpheme: 'susurrus', meaning: 'a whisper / low murmur', origin: 'Latin' },
      ],
      cognates: ['susurration', 'susurrant'],
    },
    collocations: ['faint susurrus', 'susurrus of leaves', 'gentle susurrus', 'distant susurrus'],
    source_context: {
      sentence: 'A faint susurrus swept through the auditorium as the curtain rose on the shadowed set.',
      source: 'The Atlantic Review',
      author: 'Literary Quarterly',
    },
    cloze_sentences: [
      'The nocturnal forest was quiet save for the rhythmic {{c1::susurrus}} of the pines in the evening breeze.',
      'In the grand library reading room, the only sound was the delicate {{c1::susurrus}} of turning parchment.',
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
];
