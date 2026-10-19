import { CardWithSrs, VocabCard } from '@/types/lexis';
import { DEFAULT_USER_ID } from './seed-data';
import { PHILOSOPHICAL_SEED_CARDS } from './philosophical-seed-data';
import { SPANISH_LITERARY_SEED_CARDS } from './spanish-seed-data';

export interface ThematicPackDefinition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  language: 'en' | 'es';
  category: string;
  cards: CardWithSrs[];
}

type RawThematicCard = Omit<
  VocabCard,
  'id' | 'user_id' | 'is_fallback' | 'enrichment_source' | 'created_at'
>;

function buildPackCards(
  packPrefix: string,
  entries: RawThematicCard[],
  userId: string = DEFAULT_USER_ID,
  baseDate: Date = new Date('2026-10-16T12:00:00.000Z')
): CardWithSrs[] {
  return entries.map((entry, idx) => {
    const num = String(idx + 1).padStart(4, '0');
    const id = `${packPrefix}-0000-0000-0000-00000000${num}`;
    const batchDay = Math.floor(idx / 5);
    const createdAt = new Date(baseDate.getTime() - (10 - idx) * 60 * 1000).toISOString();
    const dueDate = new Date(
      baseDate.getTime() + batchDay * 24 * 60 * 60 * 1000 - (batchDay === 0 ? 60 * 60 * 1000 : 0)
    ).toISOString();

    return {
      ...entry,
      id,
      user_id: userId,
      language: entry.language || 'en',
      gender: entry.gender || null,
      english_gloss: entry.english_gloss || null,
      is_fallback: false,
      enrichment_source: 'curated',
      created_at: createdAt,
      srs: {
        card_id: id,
        user_id: userId,
        due: dueDate,
        stability: batchDay === 0 ? 0 : 2.5,
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

const AESTHETICS_POETICS_RAW: RawThematicCard[] = [
  {
    term: 'ekphrasis',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˈɛk.frə.sɪs/',
    primary_definition:
      'A vivid, dramatic verbal description of, or commentary upon, a visual work of art, real or imagined.',
    nuance_note:
      'More than mere description: in classical rhetoric and poetics, ekphrasis stages a rivalry (paragone) between word and image, translating spatial stasis into temporal narrative.',
    etymology: {
      roots: [
        { morpheme: 'ek-', meaning: 'out / fully', origin: 'Greek' },
        { morpheme: 'phrazein', meaning: 'to point out / declare / speak', origin: 'Greek' },
      ],
      cognates: ['phrase', 'paraphrase', 'ekphrastic'],
    },
    collocations: ['ekphrastic poetry', 'classical ekphrasis', 'verbal ekphrasis', 'Homeric ekphrasis'],
    source_context: {
      sentence:
        'Homer’s account of the Shield of Achilles inaugurates the Western tradition of ekphrasis, animating hammered bronze with civic life.',
      source: 'Museum of Words: The Poetics of Ekphrasis',
      author: 'James A. W. Heffernan',
    },
    cloze_sentences: [
      'Keats’s "Ode on a Grecian Urn" remains the quintessential Romantic {{c1::ekphrasis}}, interrogating silent marble through lyric verse.',
      'Through intricate {{c1::ekphrasis}}, the novelist obliges the reader to behold a painting that never existed.',
    ],
    distinction_matrix: {
      synonyms: ['ekphrasis', 'hypotyposis', 'blazon'],
      nuanceComparison:
        'Ekphrasis specifically mediates a visual artwork through language; hypotyposis is any rhetorical description so vivid it places a scene before the eyes; blazon catalogs attributes item by item.',
      contextRecommendations: [
        {
          word: 'ekphrasis',
          recommendedRegister: 'Art Criticism / Poetics',
          exampleSentence: 'Auden’s "Musée des Beaux Arts" uses ekphrasis to reflect on human indifference to suffering.',
        },
        {
          word: 'hypotyposis',
          recommendedRegister: 'Classical Rhetoric',
          exampleSentence: 'The orator’s hypotyposis made the courtroom witness the shipwreck firsthand.',
        },
      ],
    },
  },
  {
    term: 'chiaroscuro',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/kiˌɑː.rəˈskjʊə.roʊ/',
    primary_definition:
      'The treatment of light and shade in drawing and painting; by extension, stark contrast between luminous clarity and moral or psychological darkness.',
    nuance_note:
      'Originating in Renaissance oil painting and Caravaggio’s tenebrism, literary chiaroscuro denotes an atmospheric interplay of revelation and concealment.',
    etymology: {
      roots: [
        { morpheme: 'clarus', meaning: 'clear / bright (chiaro)', origin: 'Latin' },
        { morpheme: 'obscurus', meaning: 'dark / dim (oscuro)', origin: 'Latin' },
      ],
      cognates: ['clear', 'obscure', 'clarify'],
    },
    collocations: ['dramatic chiaroscuro', 'moral chiaroscuro', 'Caravaggesque chiaroscuro', 'psychological chiaroscuro'],
    source_context: {
      sentence:
        'Hawthorne’s romances unfold in a moral chiaroscuro where Puritan rectitude casts long, unforgiving shadows.',
      source: 'American Renaissance',
      author: 'F. O. Matthiessen',
    },
    cloze_sentences: [
      'Rembrandt’s mastery of {{c1::chiaroscuro}} draws the viewer’s eye toward the subject’s illuminated brow.',
      'The noir cinematographer sculpted the interrogation scene in severe {{c1::chiaroscuro}}.',
    ],
    distinction_matrix: {
      synonyms: ['chiaroscuro', 'sfumato', 'tenebrism'],
      nuanceComparison:
        'Chiaroscuro balances light and shadow to model volume; tenebrism pushes darkness to violent extremes; sfumato softens all transitions into imperceptible haze.',
      contextRecommendations: [
        {
          word: 'chiaroscuro',
          recommendedRegister: 'Aesthetic / Literary',
          exampleSentence: 'The novel’s moral chiaroscuro refuses easy heroes.',
        },
        {
          word: 'sfumato',
          recommendedRegister: 'Art History',
          exampleSentence: 'Leonardo’s sfumato dissolves the boundary between lip and shadow.',
        },
      ],
    },
  },
  {
    term: 'concinnity',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/kənˈsɪn.ɪ.ti/',
    primary_definition:
      'The skillful and harmonious adaptation or fitting together of the different parts of a literary, architectural, or musical composition.',
    nuance_note:
      'Alberti’s highest architectural ideal (concinnitas): nothing can be added, taken away, or altered without impairing the elegance of the whole.',
    etymology: {
      roots: [
        { morpheme: 'con-', meaning: 'together / thoroughly', origin: 'Latin' },
        { morpheme: 'cinnus', meaning: 'mixed drink / harmonious blend', origin: 'Latin' },
      ],
      cognates: ['concinnous', 'inconcinnity'],
    },
    collocations: ['architectural concinnity', 'Ciceronian concinnity', 'stylistic concinnity', 'formal concinnity'],
    source_context: {
      sentence:
        'Beauty is a form of sympathy and consonance of the parts within a body, according to definite number, outline, and position, as dictated by concinnity.',
      source: 'De Re Aedificatoria',
      author: 'Leon Battista Alberti',
    },
    cloze_sentences: [
      'The quartet’s late movement achieves a rare {{c1::concinnity}} in which counterpoint and lyricism feel indivisible.',
      'Ciceronian prose is celebrated for the periodic {{c1::concinnity}} of its balanced clauses.',
    ],
    distinction_matrix: {
      synonyms: ['concinnity', 'eurythmy', 'symmetry'],
      nuanceComparison:
        'Concinnity emphasizes intellectual and stylistic craftsmanship in joining diverse parts; symmetry implies geometric mirroring; eurythmy denotes graceful proportion in movement or rhythm.',
      contextRecommendations: [
        {
          word: 'concinnity',
          recommendedRegister: 'Rhetorical / Architectural',
          exampleSentence: 'The essay’s concinnity reflects months of structural revision.',
        },
        {
          word: 'symmetry',
          recommendedRegister: 'Geometric / General',
          exampleSentence: 'The bilateral symmetry of the facade commands the plaza.',
        },
      ],
    },
  },
  {
    term: 'pentimento',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˌpɛn.tɪˈmɛn.toʊ/',
    primary_definition:
      'The reappearance in a painting of an earlier image, form, or brushstroke that was painted over by the artist; a visible trace of artistic revision.',
    nuance_note:
      'Literally "repentance" in Italian; used figuratively in literary criticism for palpable traces of earlier drafts, memories, or second thoughts showing through a finished work.',
    etymology: {
      roots: [
        { morpheme: 'paenitere', meaning: 'to repent / regret (pentirsi)', origin: 'Latin' },
        { morpheme: '-mentum', meaning: 'result or trace of action', origin: 'Latin' },
      ],
      cognates: ['penitent', 'repent', 'penance'],
    },
    collocations: ['ghostly pentimento', 'textual pentimento', 'visible pentimento', 'reveal a pentimento'],
    source_context: {
      sentence:
        'Old paint on canvas, as it ages, sometimes becomes transparent. When that happens it is possible, in some pictures, to see the original lines: this is called pentimento.',
      source: 'Pentimento: A Book of Portraits',
      author: 'Lillian Hellman',
    },
    cloze_sentences: [
      'Infrared reflectography exposed a striking {{c1::pentimento}} beneath the madonna’s mantle.',
      'The memoir reads like a {{c1::pentimento}}, where youthful convictions still glimmer beneath aged irony.',
    ],
    distinction_matrix: {
      synonyms: ['pentimento', 'palimpsest', 'vestige'],
      nuanceComparison:
        'Pentimento is an artist’s own earlier intention resurfacing through aged pigment; a palimpsest is a manuscript scraped clean and overwritten; vestige is any surviving remnant.',
      contextRecommendations: [
        {
          word: 'pentimento',
          recommendedRegister: 'Art Criticism / Memoir',
          exampleSentence: 'A faint pentimento around the horse’s leg betrays Velázquez’s revision.',
        },
        {
          word: 'palimpsest',
          recommendedRegister: 'Philological / Cultural',
          exampleSentence: 'Rome is an urban palimpsest of imperial, papal, and modern strata.',
        },
      ],
    },
  },
  {
    term: 'synaesthesia',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˌsɪn.ɪsˈθiː.zi.ə/',
    primary_definition:
      'A perceptual or poetic phenomenon in which stimulation of one sensory modality simultaneously evokes sensation or imagery in another.',
    nuance_note:
      'Central to Symbolist poetics (Baudelaire’s "Correspondances" and Rimbaud’s colored vowels), bridging neurological cross-wiring and deliberate metaphorical fusion.',
    etymology: {
      roots: [
        { morpheme: 'syn-', meaning: 'together / concomitant', origin: 'Greek' },
        { morpheme: 'aisthesis', meaning: 'sensation / perception', origin: 'Greek' },
      ],
      cognates: ['aesthetic', 'anaesthesia', 'kinesthesia'],
    },
    collocations: ['poetic synaesthesia', 'auditory-visual synaesthesia', 'Symbolist synaesthesia', 'chromatic synaesthesia'],
    source_context: {
      sentence:
        'Rimbaud’s sonnet "Voyelles" elevated synaesthesia into a manifesto of visionary poetics, assigning each vowel a distinct chromatic timbre.',
      source: 'The Symbolist Movement in Literature',
      author: 'Arthur Symons',
    },
    cloze_sentences: [
      'Nabokov’s memoir describes his lifelong {{c1::synaesthesia}}, perceiving each letter of the alphabet in specific hues.',
      'Keats’s phrase "tasting of Flora and the country green" achieves its lushness through {{c1::synaesthesia}}.',
    ],
    distinction_matrix: {
      synonyms: ['synaesthesia', 'correspondence', 'hypallage'],
      nuanceComparison:
        'Synaesthesia fuses distinct sensory registers; correspondence implies metaphysical echoes across nature and spirit; hypallage transfers an epithet syntactically to an adjacent noun.',
      contextRecommendations: [
        {
          word: 'synaesthesia',
          recommendedRegister: 'Poetics / Cognitive Aesthetics',
          exampleSentence: 'Messiaen’s chords were shaped by his vivid musical synaesthesia.',
        },
        {
          word: 'hypallage',
          recommendedRegister: 'Rhetorical Analysis',
          exampleSentence: 'Virgil’s "the trumpet’s Tuscan roar" exemplifies classic hypallage.',
        },
      ],
    },
  },
  {
    term: 'bathos',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˈbeɪ.θɒs/',
    primary_definition:
      'An abrupt, unintended transition in style from the exalted or sublime to the commonplace and ludicrous, producing anticlimax.',
    nuance_note:
      'Coined in its critical sense by Alexander Pope (Peri Bathous, 1727) as the comic inverse of Longinus’s hypsos (the sublime): overreaching pathos that collapses into banality.',
    etymology: {
      roots: [
        { morpheme: 'bathos', meaning: 'depth / bottom / sinking', origin: 'Greek' },
      ],
      cognates: ['bathysphere', 'bathymetry', 'bathetic'],
    },
    collocations: ['descend into bathos', 'unintended bathos', 'sublime to bathos', 'bathetic anticlimax'],
    source_context: {
      sentence:
        'Pope anatomized bathos as the art of sinking in poetry, whereby an overwrought ode plunges from celestial rapture into bureaucratic detail.',
      source: 'Peri Bathous, Or the Art of Sinking in Poetry',
      author: 'Alexander Pope',
    },
    cloze_sentences: [
      'The eulogy’s lofty tribute to the senator’s virtue collapsed into {{c1::bathos}} when it praised his punctual tax filings.',
      'Only rigorous restraint prevents high melodrama from tipping into {{c1::bathos}}.',
    ],
    distinction_matrix: {
      synonyms: ['bathos', 'pathos', 'anticlimax'],
      nuanceComparison:
        'Pathos evokes genuine pity and tragic sympathy; bathos is failed or overstrained pathos that tumbles into ridiculousness; anticlimax is any disappointing drop in narrative tension.',
      contextRecommendations: [
        {
          word: 'bathos',
          recommendedRegister: 'Literary Criticism',
          exampleSentence: 'The final stanza’s bathetic rhyme ruins the elegiac mood.',
        },
        {
          word: 'pathos',
          recommendedRegister: 'Dramatic / Rhetorical',
          exampleSentence: 'The chorus infuses the heroine’s farewell with unbearable pathos.',
        },
      ],
    },
  },
  {
    term: 'afflatus',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/əˈfleɪ.təs/',
    primary_definition:
      'A divine or supernatural creative impulse; a sudden rush of poetic, prophetic, or artistic inspiration.',
    nuance_note:
      'Literally a "breathing upon" (Cicero’s afflatus divinus); carries an elevated, sometimes gently ironic resonance when describing romantic notions of unbidden genius.',
    etymology: {
      roots: [
        { morpheme: 'ad-', meaning: 'toward / upon', origin: 'Latin' },
        { morpheme: 'flare', meaning: 'to blow / breathe', origin: 'Latin' },
      ],
      cognates: ['inflate', 'conflate', 'insufflate'],
    },
    collocations: ['divine afflatus', 'poetic afflatus', 'prophetic afflatus', 'seized by afflatus'],
    source_context: {
      sentence:
        'No man was ever yet a great poet without being at the same time a profound philosopher, whatever reliance he may place on the divine afflatus.',
      source: 'Biographia Literaria',
      author: 'Samuel Taylor Coleridge',
    },
    cloze_sentences: [
      'Waiting passively for the divine {{c1::afflatus}} is no substitute for disciplined prosodic craft.',
      'Plato’s Ion portrays the rhapsode not as a technician but as a vessel possessed by sacred {{c1::afflatus}}.',
    ],
    distinction_matrix: {
      synonyms: ['afflatus', 'enthusiasm', 'epiphany'],
      nuanceComparison:
        'Afflatus emphasizes the pneumatic metaphor of inspiration breathed into the artist from without; enthusiasm (entheos) is being filled with a god; epiphany is a sudden cognitive manifestation.',
      contextRecommendations: [
        {
          word: 'afflatus',
          recommendedRegister: 'Classical / Aesthetic',
          exampleSentence: 'He composed the cantata in a single nocturnal fit of afflatus.',
        },
        {
          word: 'epiphany',
          recommendedRegister: 'Modernist / Narrative',
          exampleSentence: 'Joyce structured Dubliners around moments of quiet epiphany.',
        },
      ],
    },
  },
  {
    term: 'anamorphosis',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˌæn.əˈmɔː.fə.sɪs/',
    primary_definition:
      'A distorted projection or perspective requiring the viewer to occupy a specific vantage point or use a curved mirror to reconstitute the image.',
    nuance_note:
      'Famous from Holbein’s "The Ambassadors" (where a diagonal smear resolves into a skull); deployed by Lacan and Žižek to show how reality coheres only when viewed awry.',
    etymology: {
      roots: [
        { morpheme: 'ana-', meaning: 'back / again / anew', origin: 'Greek' },
        { morpheme: 'morphe', meaning: 'form / shape', origin: 'Greek' },
      ],
      cognates: ['metamorphosis', 'morphology', 'amorphous'],
    },
    collocations: ['optical anamorphosis', 'Holbein’s anamorphosis', 'anamorphic skull', 'ideological anamorphosis'],
    source_context: {
      sentence:
        'In Holbein’s portrait, the floating phallic bone at the ambassadors’ feet operates by anamorphosis, revealing the vanity of worldly power only as one exits the room.',
      source: 'The Four Fundamental Concepts of Psychoanalysis',
      author: 'Jacques Lacan',
    },
    cloze_sentences: [
      'Seen head-on the fresco appears abstract, but from the chancel steps its {{c1::anamorphosis}} snaps into focus.',
      'Critics read the narrator’s unreliable digressions as a deliberate {{c1::anamorphosis}} of colonial history.',
    ],
    distinction_matrix: {
      synonyms: ['anamorphosis', 'trompe-l’oeil', 'parallax'],
      nuanceComparison:
        'Anamorphosis distorts form so it is legible only from an oblique angle; trompe-l’oeil tricks the eye into seeing flat paint as three-dimensional; parallax is apparent displacement due to observer shift.',
      contextRecommendations: [
        {
          word: 'anamorphosis',
          recommendedRegister: 'Visual Theory / Psychoanalytic',
          exampleSentence: 'Lacan treats the gaze through the optical device of anamorphosis.',
        },
        {
          word: 'parallax',
          recommendedRegister: 'Epistemological / Astronomical',
          exampleSentence: 'The parallax gap between subject and object cannot be mediated.',
        },
      ],
    },
  },
  {
    term: 'patina',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˈpæt.ɪ.nə/',
    primary_definition:
      'A green or brown film produced by oxidation on the surface of old bronze; by extension, an aura of character, refinement, or venerability acquired through age and use.',
    nuance_note:
      'Can denote either authentic historical depth (wabi-sabi and Ruskin’s "golden stain of time") or a superficial veneer of respectability.',
    etymology: {
      roots: [
        { morpheme: 'patina', meaning: 'shallow dish / surface incrustation', origin: 'Latin' },
      ],
      cognates: ['paten', 'patinate'],
    },
    collocations: ['patina of age', 'verdigris patina', 'aristocratic patina', 'acquire a patina'],
    source_context: {
      sentence:
        'For Ruskin, the true glory of architecture resides in that golden stain of time—the irreproducible patina that no restoration can counterfeit.',
      source: 'The Seven Lamps of Architecture',
      author: 'John Ruskin',
    },
    cloze_sentences: [
      'Centuries of handling had given the walnut lectern a warm, honeyed {{c1::patina}}.',
      'Beneath its {{c1::patina}} of constitutional legality, the regime operated by decree.',
    ],
    distinction_matrix: {
      synonyms: ['patina', 'veneer', 'gloss'],
      nuanceComparison:
        'Patina grows organically from within through time and weathering; veneer is a thin decorative layer glued over cheaper wood; gloss is a shiny surface polish.',
      contextRecommendations: [
        {
          word: 'patina',
          recommendedRegister: 'Aesthetic / Material Culture',
          exampleSentence: 'The bronze bell bore a centuries-old jade patina.',
        },
        {
          word: 'veneer',
          recommendedRegister: 'Critical / Social',
          exampleSentence: 'His politeness was a brittle veneer over ruthless ambition.',
        },
      ],
    },
  },
  {
    term: 'tectonic',
    language: 'en',
    part_of_speech: 'adjective',
    phonetic: '/tɛkˈtɒn.ɪk/',
    primary_definition:
      'Relating to the art of construction and structural articulation in architecture or aesthetics; or involving foundational, large-scale structural shifts.',
    nuance_note:
      'In art history (Heinrich Wölfflin) and architecture (Gottfried Semper), "tectonic" designates closed, load-bearing structural clarity as opposed to "atectonic" painterly flux.',
    etymology: {
      roots: [
        { morpheme: 'tekton', meaning: 'carpenter / builder / master artisan', origin: 'Greek' },
        { morpheme: '-ikos', meaning: 'pertaining to', origin: 'Greek' },
      ],
      cognates: ['architect', 'architectonic', 'techne'],
    },
    collocations: ['tectonic clarity', 'tectonic shift', 'tectonic rigor', 'tectonic form'],
    source_context: {
      sentence:
        'Classical Renaissance composition is strictly tectonic, anchoring every figure within a self-contained equilibrium of verticals and horizontals.',
      source: 'Principles of Art History',
      author: 'Heinrich Wölfflin',
    },
    cloze_sentences: [
      'Mies van der Rohe exposed the steel I-beams to celebrate the building’s {{c1::tectonic}} honesty.',
      'The treatise triggered a {{c1::tectonic}} realignment in twentieth-century historiography.',
    ],
    distinction_matrix: {
      synonyms: ['tectonic', 'architectonic', 'structural'],
      nuanceComparison:
        'Tectonic highlights the material joinery and load-bearing expression of construction (or seismic scale); architectonic emphasizes overarching systematic design; structural is neutral and technical.',
      contextRecommendations: [
        {
          word: 'tectonic',
          recommendedRegister: 'Architectural / Art Historical',
          exampleSentence: 'Semper distinguished the tectonic timber frame from the stereotomic stone base.',
        },
        {
          word: 'architectonic',
          recommendedRegister: 'Philosophical / Literary',
          exampleSentence: 'Kant’s Critique concludes with the Architectonic of Pure Reason.',
        },
      ],
    },
  },
];

const POLITICAL_ECONOMY_RAW: RawThematicCard[] = [
  {
    term: 'dirigisme',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˌdɪr.ɪˈʒiːz.mə/',
    primary_definition:
      'State-directed economic policy in which the government exerts strong directive influence over investment, industrial priorities, and credit allocation within a market economy.',
    nuance_note:
      'Distinct from Soviet command planning: dirigisme (exemplified by post-war French Gaullism and East Asian developmental states) steers private capital toward national strategic goals.',
    etymology: {
      roots: [
        { morpheme: 'dirigere', meaning: 'to direct / steer / align (diriger)', origin: 'Latin' },
        { morpheme: '-isme', meaning: 'doctrine / system', origin: 'Greek' },
      ],
      cognates: ['dirigiste', 'direct', 'dirigible'],
    },
    collocations: ['state dirigisme', 'Gaullist dirigisme', 'industrial dirigisme', 'dirigiste policy'],
    source_context: {
      sentence:
        'Post-war French modernization relied on indicative planning and technocratic dirigisme to rebuild heavy industry and infrastructure.',
      source: 'Modern Capitalism',
      author: 'Andrew Shonfield',
    },
    cloze_sentences: [
      'After decades of neoliberal deregulation, green industrial policy has revived interest in strategic {{c1::dirigisme}}.',
      'Under postwar {{c1::dirigisme}}, state planners channeled credit toward national champions in aerospace and rail.',
    ],
    distinction_matrix: {
      synonyms: ['dirigisme', 'statism', 'mercantilism'],
      nuanceComparison:
        'Dirigisme denotes technocratic state steering of a capitalist economy; statism is a broader ideological preference for state sovereignty; mercantilism focuses on bullion accumulation and trade surpluses.',
      contextRecommendations: [
        {
          word: 'dirigisme',
          recommendedRegister: 'Political Economy / Policy',
          exampleSentence: 'East Asian industrial policy combined export discipline with credit dirigisme.',
        },
        {
          word: 'mercantilism',
          recommendedRegister: 'Economic History',
          exampleSentence: 'Colbert’s tariffs epitomized seventeenth-century mercantilism.',
        },
      ],
    },
  },
  {
    term: 'autarky',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˈɔː.tɑː.ki/',
    primary_definition:
      'Economic self-sufficiency and independence from international trade; in classical philosophy, moral and psychological self-sufficiency.',
    nuance_note:
      'Spelled with a "k" (from Greek autarkeia, self-sufficiency), never to be confused with "autarchy" (autarcheia, absolute sovereignty/despotism).',
    etymology: {
      roots: [
        { morpheme: 'autos', meaning: 'self', origin: 'Greek' },
        { morpheme: 'arkein', meaning: 'to suffice / ward off / be enough', origin: 'Greek' },
      ],
      cognates: ['autarkic', 'autarch'],
    },
    collocations: ['economic autarky', 'Stoic autarky', 'retreat into autarky', 'autarkic regime'],
    source_context: {
      sentence:
        'For Aristotle, the polis comes into existence for the sake of life, but exists for the sake of the good life, having attained the limit of complete autarky.',
      source: 'Politics',
      author: 'Aristotle',
    },
    cloze_sentences: [
      'Interwar protectionism pushed several continental economies toward costly {{c1::autarky}}.',
      'The Cynics prized radical {{c1::autarky}}, renouncing civic honours to depend on nothing external.',
    ],
    distinction_matrix: {
      synonyms: ['autarky', 'autonomy', 'sovereignty'],
      nuanceComparison:
        'Autarky means material or existential self-sufficiency without external inputs; autonomy is self-legislation under moral law; sovereignty is supreme political authority.',
      contextRecommendations: [
        {
          word: 'autarky',
          recommendedRegister: 'Macroeconomics / Ancient Philosophy',
          exampleSentence: 'Complete semiconductor autarky remains unattainable even for superpowers.',
        },
        {
          word: 'autonomy',
          recommendedRegister: 'Moral & Political Philosophy',
          exampleSentence: 'Kantian ethics grounds dignity in rational autonomy.',
        },
      ],
    },
  },
  {
    term: 'comprador',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˌkɒm.prəˈdɔːr/',
    primary_definition:
      'A native agent or domestic elite class in a peripheral economy that acts as an intermediary for foreign capital, colonial enterprises, or multinational corporations.',
    nuance_note:
      'Originating in Portuguese trade in China, dependency theorists (Samir Amin, Andre Gunder Frank) use "comprador bourgeoisie" to contrast domestic elites tied to foreign extraction with a national industrial bourgeoisie.',
    etymology: {
      roots: [
        { morpheme: 'comparare', meaning: 'to procure / purchase (comprar)', origin: 'Latin' },
        { morpheme: '-tor', meaning: 'agent noun suffix (-dor)', origin: 'Latin' },
      ],
      cognates: ['compare', 'compradorial'],
    },
    collocations: ['comprador bourgeoisie', 'comprador elite', 'comprador class', 'comprador capitalism'],
    source_context: {
      sentence:
        'The comprador bourgeoisie derives its wealth not from domestic productive transformation, but from brokering the extraction of peripheral surplus for metropolitan finance.',
      source: 'Unequal Development',
      author: 'Samir Amin',
    },
    cloze_sentences: [
      'Postcolonial critics argued that independence merely transferred state offices to a {{c1::comprador}} elite.',
      'Treaty-port merchants functioned as {{c1::comprador}} intermediaries for British trading houses.',
    ],
    distinction_matrix: {
      synonyms: ['comprador', 'collaborator', 'intermediary'],
      nuanceComparison:
        'Comprador specifically denotes a structural class brokering foreign economic dominance in the periphery; collaborator implies wartime political treason; intermediary is neutral.',
      contextRecommendations: [
        {
          word: 'comprador',
          recommendedRegister: 'Dependency Theory / Postcolonial Studies',
          exampleSentence: 'Tariff reform was blocked by the entrenched comprador faction.',
        },
        {
          word: 'intermediary',
          recommendedRegister: 'Commercial / Neutral',
          exampleSentence: 'The bank acted as an intermediary in the cross-border merger.',
        },
      ],
    },
  },
  {
    term: 'precarity',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/prɪˈkɛə.rɪ.ti/',
    primary_definition:
      'A condition of existence without predictability, job security, material welfare, or social protection; politically induced vulnerability.',
    nuance_note:
      'Judith Butler distinguishes existential "precariousness" (our shared bodily finitude) from "precarity" (the differential, politically organized distribution of vulnerability across populations).',
    etymology: {
      roots: [
        { morpheme: 'prex / precaris', meaning: 'prayer / obtained by entreaty', origin: 'Latin' },
        { morpheme: '-itas', meaning: 'state or condition', origin: 'Latin' },
      ],
      cognates: ['precarious', 'prayer', 'deprecate'],
    },
    collocations: ['economic precarity', 'structural precarity', 'labor precarity', 'institutionalized precarity'],
    source_context: {
      sentence:
        'Precarity designates that politically induced condition in which certain populations suffer from failing social and economic networks of support and become differentially exposed to injury.',
      source: 'Frames of War',
      author: 'Judith Butler',
    },
    cloze_sentences: [
      'Platform capitalism has normalized chronic {{c1::precarity}} under the euphemism of flexible entrepreneurship.',
      'Sociologists traced how housing {{c1::precarity}} erodes civic participation.',
    ],
    distinction_matrix: {
      synonyms: ['precarity', 'contingency', 'vulnerability'],
      nuanceComparison:
        'Precarity highlights structural socio-economic insecurity under neoliberal labor regimes; contingency is philosophical non-necessity; vulnerability is general susceptibility to harm.',
      contextRecommendations: [
        {
          word: 'precarity',
          recommendedRegister: 'Critical Sociology / Political Economy',
          exampleSentence: 'Adjunct faculty experience acute academic precarity.',
        },
        {
          word: 'contingency',
          recommendedRegister: 'Ontology / History',
          exampleSentence: 'Rorty emphasized the radical contingency of language and selfhood.',
        },
      ],
    },
  },
  {
    term: 'isegoria',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˌaɪ.sɪˈɡɔː.ri.ə/',
    primary_definition:
      'The equal right of all citizens in a democratic assembly to speak freely and address matters of public policy.',
    nuance_note:
      'In Athenian democracy, isegoria (positive equality of public voice in the ekklesia) complemented isonomia (equality before the law) and parrhesia (candid truth-speaking).',
    etymology: {
      roots: [
        { morpheme: 'isos', meaning: 'equal', origin: 'Greek' },
        { morpheme: 'agoreuein', meaning: 'to speak in the public assembly (agora)', origin: 'Greek' },
      ],
      cognates: ['agora', 'allegory', 'category', 'isonomy'],
    },
    collocations: ['Athenian isegoria', 'democratic isegoria', 'isonomia and isegoria', 'public isegoria'],
    source_context: {
      sentence:
        'When the herald asked "Who wishes to speak?" before the assembled citizens on the Pnyx, he enacted the constitutional principle of isegoria.',
      source: 'The Athenian Democracy in the Age of Demosthenes',
      author: 'Mogens Herman Hansen',
    },
    cloze_sentences: [
      'Formal freedom of speech means little without substantive {{c1::isegoria}} in the public sphere.',
      'Herodotus credited the military vigour of Athens to the newly won {{c1::isegoria}} of its citizens.',
    ],
    distinction_matrix: {
      synonyms: ['isegoria', 'parrhesia', 'isonomia'],
      nuanceComparison:
        'Isegoria is the institutional equal right to address the assembly; parrhesia is the moral courage to speak dangerous truth to power; isonomia is equality of political rights under law.',
      contextRecommendations: [
        {
          word: 'isegoria',
          recommendedRegister: 'Democratic Theory / Classics',
          exampleSentence: 'Campaign finance concentration subverts democratic isegoria.',
        },
        {
          word: 'parrhesia',
          recommendedRegister: 'Ethical / Foucauldian',
          exampleSentence: 'Diogenes practiced fearless parrhesia before Alexander.',
        },
      ],
    },
  },
  {
    term: 'plutocracy',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/pluːˈtɒk.rə.si/',
    primary_definition:
      'Government or political domination by the wealthiest class, in which material riches directly confer ruling power.',
    nuance_note:
      'Xenophon and Plato analyzed how oligarchies degenerate into plutocracies when civic virtue is subordinated to the accumulation of property.',
    etymology: {
      roots: [
        { morpheme: 'ploutos', meaning: 'wealth / riches', origin: 'Greek' },
        { morpheme: 'kratos', meaning: 'rule / power / strength', origin: 'Greek' },
      ],
      cognates: ['plutocrat', 'plutocratic', 'Pluto'],
    },
    collocations: ['gilded plutocracy', 'entrenched plutocracy', 'drift toward plutocracy', 'plutocratic capture'],
    source_context: {
      sentence:
        'When the returns on inherited capital persistently outpace output growth, democratic republics risk hardening into hereditary plutocracy.',
      source: 'Capital in the Twenty-First Century',
      author: 'Thomas Piketty',
    },
    cloze_sentences: [
      'Solon’s constitutional reforms sought to prevent Athens from fracturing into a ruthless {{c1::plutocracy}}.',
      'Unlimited dark-money lobbying accelerates the transformation of representative government into {{c1::plutocracy}}.',
    ],
    distinction_matrix: {
      synonyms: ['plutocracy', 'oligarchy', 'kleptocracy'],
      nuanceComparison:
        'Plutocracy is rule specifically by wealth; oligarchy is rule by a small faction (whether military, aristocratic, orpropertied); kleptocracy is rule by officials who embezzle state funds.',
      contextRecommendations: [
        {
          word: 'plutocracy',
          recommendedRegister: 'Political Science / Critique',
          exampleSentence: 'Gilded Age senate seats were openly caricatured as instruments of plutocracy.',
        },
        {
          word: 'kleptocracy',
          recommendedRegister: 'Geopolitics / Governance',
          exampleSentence: 'Offshore shell companies laundered the proceeds of the kleptocracy.',
        },
      ],
    },
  },
  {
    term: 'subaltern',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/səˈbɔːl.tən/',
    primary_definition:
      'A population or social group excluded from the hierarchy of hegemonic power and denied institutional agency or epistemological voice.',
    nuance_note:
      'Adapted by Antonio Gramsci (Prison Notebooks) for non-hegemonic classes and radicalized by Gayatri Spivak ("Can the Subaltern Speak?") to critique colonial and metropolitan ventriloquism.',
    etymology: {
      roots: [
        { morpheme: 'sub-', meaning: 'under / below', origin: 'Latin' },
        { morpheme: 'alternus', meaning: 'every other / subordinate in rank', origin: 'Latin' },
      ],
      cognates: ['alternate', 'alter', 'subalternity'],
    },
    collocations: ['subaltern studies', 'subaltern agency', 'subaltern classes', 'subaltern historiography'],
    source_context: {
      sentence:
        'The history of subaltern social groups is necessarily fragmented and episodic, even when they rebel, because they are always subject to the activity of ruling groups.',
      source: 'Selections from the Prison Notebooks',
      author: 'Antonio Gramsci',
    },
    cloze_sentences: [
      'Spivak’s landmark essay interrogates whether the {{c1::subaltern}} can speak within colonial archives that erase her voice.',
      'Historians read court transcripts against the grain to reconstruct {{c1::subaltern}} resistance.',
    ],
    distinction_matrix: {
      synonyms: ['subaltern', 'proletariat', 'marginalized'],
      nuanceComparison:
        'Subaltern emphasizes structural exclusion from hegemonic representation and political voice; proletariat designates wage-laborers under capitalism; marginalized is a broad sociological term.',
      contextRecommendations: [
        {
          word: 'subaltern',
          recommendedRegister: 'Postcolonial / Gramscian Theory',
          exampleSentence: 'Ranajit Guha founded Subaltern Studies to challenge elitist Indian historiography.',
        },
        {
          word: 'proletariat',
          recommendedRegister: 'Marxist Political Economy',
          exampleSentence: 'Industrialization concentrated the urban proletariat in factory towns.',
        },
      ],
    },
  },
  {
    term: 'rentier',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˈrɒn.ti.eɪ/',
    primary_definition:
      'An individual or economic class that derives income passively from ownership of scarce assets, land, debt, or monopolies rather than productive enterprise or labor.',
    nuance_note:
      'Classical economists (Smith, Ricardo) and Keynes ("the euthanasia of the rentier") treated rentier extraction as a drag on productive investment and innovation.',
    etymology: {
      roots: [
        { morpheme: 'reddita / renta', meaning: 'yield / revenue / rent rendered', origin: 'Latin' },
        { morpheme: '-ier', meaning: 'person connected with', origin: 'Latin' },
      ],
      cognates: ['rent', 'render', 'surrender'],
    },
    collocations: ['rentier capitalism', 'rentier class', 'euthanasia of the rentier', 'rentier state'],
    source_context: {
      sentence:
        'Keynes foresaw that a sufficiently low rate of interest would bring about the euthanasia of the rentier, and consequently, the euthanasia of the cumulative oppressive power of the capitalist to exploit the scarcity-value of capital.',
      source: 'The General Theory of Employment, Interest and Money',
      author: 'John Maynard Keynes',
    },
    cloze_sentences: [
      'Intellectual property monopolies and tollbooth platforms have created a digital {{c1::rentier}} economy.',
      'Classical political economy sharply distinguished the entrepreneurial industrialist from the landed {{c1::rentier}}.',
    ],
    distinction_matrix: {
      synonyms: ['rentier', 'speculator', 'creditor'],
      nuanceComparison:
        'A rentier collects recurring passive tribute from asset scarcity; a speculator wagers on price fluctuations; a creditor lends principal at interest.',
      contextRecommendations: [
        {
          word: 'rentier',
          recommendedRegister: 'Political Economy',
          exampleSentence: 'Oil-exporting monarchies are often analyzed as rentier states.',
        },
        {
          word: 'speculator',
          recommendedRegister: 'Financial / Market',
          exampleSentence: 'Currency speculators attacked the central bank’s peg.',
        },
      ],
    },
  },
  {
    term: 'hegemon',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˈhɛdʒ.ɪ.mɒn/',
    primary_definition:
      'A supreme leading state, class, or institution that exercises predominance over others through a combination of material preeminence and ideological consent.',
    nuance_note:
      'In Greek antiquity, the hegemon led an alliance of autonomous poleis; in modern international relations and Gramscian theory, hegemony blends coercion with normative leadership.',
    etymology: {
      roots: [
        { morpheme: 'hegeisthai', meaning: 'to lead / go before / guide', origin: 'Greek' },
      ],
      cognates: ['hegemony', 'hegemonic', 'exegesis'],
    },
    collocations: ['global hegemon', 'regional hegemon', 'declining hegemon', 'hegemonic stability'],
    source_context: {
      sentence:
        'For an international economic order to remain open and stable, Kindleberger argued, a single benevolent hegemon must be willing to act as lender of last resort.',
      source: 'The World in Depression, 1929–1939',
      author: 'Charles P. Kindleberger',
    },
    cloze_sentences: [
      'Thucydides chronicled how Athens evolved from the voluntary {{c1::hegemon}} of the Delian League into an imperial master.',
      'Multipolar rivalry intensifies when an incumbent {{c1::hegemon}} can no longer underwrite global public goods.',
    ],
    distinction_matrix: {
      synonyms: ['hegemon', 'suzerain', 'imperium'],
      nuanceComparison:
        'A hegemon leads formally sovereign states via structural and ideological primacy; a suzerain holds feudal or treaty overlordship over a tributary vassal; imperium is direct formal rule.',
      contextRecommendations: [
        {
          word: 'hegemon',
          recommendedRegister: 'International Relations / Geopolitics',
          exampleSentence: 'The dollar’s reserve status underpins the financial power of the hegemon.',
        },
        {
          word: 'suzerain',
          recommendedRegister: 'Diplomatic History',
          exampleSentence: 'The empire acted as suzerain over the frontier principalities.',
        },
      ],
    },
  },
  {
    term: 'anomie',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˈæn.ə.mi/',
    primary_definition:
      'A condition of social instability and moral deregulation resulting from the breakdown of shared norms, values, and integrative bonds between the individual and society.',
    nuance_note:
      'Central to Émile Durkheim’s sociology (The Division of Labor in Society; Suicide): anomie arises when rapid economic upheaval outstrips society’s capacity to regulate desires.',
    etymology: {
      roots: [
        { morpheme: 'a-', meaning: 'without / lack of', origin: 'Greek' },
        { morpheme: 'nomos', meaning: 'law / custom / normative order', origin: 'Greek' },
      ],
      cognates: ['autonomous', 'antinomian', 'astronomy'],
    },
    collocations: ['social anomie', 'Durkheimian anomie', 'urban anomie', 'sense of anomie'],
    source_context: {
      sentence:
        'When society is disturbed by some painful crisis or by beneficent but abrupt transitions, it is momentarily incapable of exercising moral regulation, plunging individuals into anomie.',
      source: 'Suicide: A Study in Sociology',
      author: 'Émile Durkheim',
    },
    cloze_sentences: [
      'Deindustrialization hollowed out civic associations, leaving behind a pervasive {{c1::anomie}}.',
      'Durkheim diagnosed modern {{c1::anomie}} not as poverty, but as the boundless deregulation of human appetite.',
    ],
    distinction_matrix: {
      synonyms: ['anomie', 'alienation', 'ennui'],
      nuanceComparison:
        'Anomie is Durkheimian normlessness and moral deregulation; alienation (Entfremdung) is Marxist estrangement from one’s labor and species-being; ennui is existential or aristocratic boredom.',
      contextRecommendations: [
        {
          word: 'anomie',
          recommendedRegister: 'Sociological / Critical',
          exampleSentence: 'Rapid urbanization eroded traditional guild norms and bred acute anomie.',
        },
        {
          word: 'alienation',
          recommendedRegister: 'Marxist / Hegelian',
          exampleSentence: 'Assembly-line work deepened the worker’s alienation from the product.',
        },
      ],
    },
  },
];

const PHENOMENOLOGY_MIND_RAW: RawThematicCard[] = [
  {
    term: 'qualia',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˈkwɑː.li.ə/',
    primary_definition:
      'The internal, subjective, qualitative properties of conscious experience—the felt "what-it-is-likeness" of perceiving red, tasting wine, or feeling pain.',
    nuance_note:
      'Coined by C. I. Lewis and popularized by Frank Jackson ("Mary’s Room") and Thomas Nagel to challenge reductive physicalism in the philosophy of mind.',
    etymology: {
      roots: [
        { morpheme: 'qualis', meaning: 'of what sort / of what quality', origin: 'Latin' },
      ],
      cognates: ['quality', 'qualitative', 'qualify'],
    },
    collocations: ['subjective qualia', 'inverted qualia', 'ineffable qualia', 'problem of qualia'],
    source_context: {
      sentence:
        'Even if a neuroscientist knew every physical fact about color vision, she would still learn something new upon first experiencing the qualia of seeing red.',
      source: 'Epiphenomenal Qualia',
      author: 'Frank Jackson',
    },
    cloze_sentences: [
      'Functionalism struggles to explain why neural computation is accompanied by phenomenal {{c1::qualia}}.',
      'The thought experiment of the philosophical zombie imagines a being behaviorally identical to us but devoid of {{c1::qualia}}.',
    ],
    distinction_matrix: {
      synonyms: ['qualia', 'phenomenality', 'sensa'],
      nuanceComparison:
        'Qualia designates discrete intrinsic qualitative feels in analytic philosophy of mind; phenomenality is the broader continental structure of appearing; sensa are sense-data objects.',
      contextRecommendations: [
        {
          word: 'qualia',
          recommendedRegister: 'Philosophy of Mind / Cognitive Science',
          exampleSentence: 'Chalmers’s hard problem of consciousness centers on the irreducibility of qualia.',
        },
        {
          word: 'phenomenality',
          recommendedRegister: 'Continental Phenomenology',
          exampleSentence: 'Husserl investigated the transcendental conditions of phenomenality.',
        },
      ],
    },
  },
  {
    term: 'noema',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/noʊˈiː.mə/',
    primary_definition:
      'In Husserlian phenomenology, the objective correlate of an intentional act of consciousness—the object precisely as it is meant, perceived, or judged.',
    nuance_note:
      'Paired with noesis (the subjective act of experiencing): every intentional act has a noetic-noematic structure uniting the how of consciousness with the what as intended.',
    etymology: {
      roots: [
        { morpheme: 'noein', meaning: 'to perceive / think / intuit (nous)', origin: 'Greek' },
        { morpheme: '-ma', meaning: 'result or object of an action', origin: 'Greek' },
      ],
      cognates: ['noesis', 'noetic', 'paranoia', 'noumenon'],
    },
    collocations: ['noesis and noema', 'perceptual noema', 'noematic sense', 'intentional noema'],
    source_context: {
      sentence:
        'Corresponding to all points to the manifold data of the real noetic content, there is a variety of data displayable in really pure intuition in a correlative noema.',
      source: 'Ideas Pertaining to a Pure Phenomenology',
      author: 'Edmund Husserl',
    },
    cloze_sentences: [
      'Whether the tree in the garden burns up or not, the perceptual {{c1::noema}} "this blooming apple tree" remains descriptively intact.',
      'Husserl correlates every subjective act of noesis with its intentional {{c1::noema}}.',
    ],
    distinction_matrix: {
      synonyms: ['noema', 'intentional object', 'noumenon'],
      nuanceComparison:
        'Noema is the object as immanently intended within bracketed experience; noumenon is Kant’s thing-in-itself beyond all possible experience; intentional object is the general Brentanian term.',
      contextRecommendations: [
        {
          word: 'noema',
          recommendedRegister: 'Husserlian Phenomenology',
          exampleSentence: 'The noema includes both the core determinable X and its horizon of predicates.',
        },
        {
          word: 'noumenon',
          recommendedRegister: 'Kantian Metaphysics',
          exampleSentence: 'Human sensibility can never cognize the noumenon in itself.',
        },
      ],
    },
  },
  {
    term: 'aseity',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/əˈsiː.ɪ.ti/',
    primary_definition:
      'The property by which a being exists in and of itself, wholly independent of any external cause, ground, or sustaining agent.',
    nuance_note:
      'From Scholastic Latin a se ("from oneself"); attributed to the Absolute or God in Anselm and Spinoza, and secularized by Schopenhauer and Sartre in analyzing the pour-soi’s desire to become en-soi-pour-soi.',
    etymology: {
      roots: [
        { morpheme: 'a-', meaning: 'from / by (ab)', origin: 'Latin' },
        { morpheme: 'se', meaning: 'oneself', origin: 'Latin' },
        { morpheme: '-itas', meaning: 'state of being', origin: 'Latin' },
      ],
      cognates: ['per se', 'ipsedixitism', 'suicide'],
    },
    collocations: ['divine aseity', 'ontological aseity', 'absolute aseity', 'claim to aseity'],
    source_context: {
      sentence:
        'Substance, as Spinoza defines it at the opening of the Ethics, possesses absolute aseity: it is in itself and is conceived through itself.',
      source: 'The Philosophy of Spinoza',
      author: 'Harry Austryn Wolfson',
    },
    cloze_sentences: [
      'Finite creatures remain contingent precisely because they lack ontological {{c1::aseity}}.',
      'Sartre defines human desire as the impossible project of uniting conscious freedom with the {{c1::aseity}} of being-in-itself.',
    ],
    distinction_matrix: {
      synonyms: ['aseity', 'autarky', 'immanence'],
      nuanceComparison:
        'Aseity is metaphysical self-existence without external ground; autarky is practical or economic self-sufficiency; immanence is remaining within rather than transcending a domain.',
      contextRecommendations: [
        {
          word: 'aseity',
          recommendedRegister: 'Metaphysics / Philosophical Theology',
          exampleSentence: 'Classical theism pairs divine simplicity with absolute aseity.',
        },
        {
          word: 'immanence',
          recommendedRegister: 'Continental Metaphysics',
          exampleSentence: 'Deleuze sought a plane of pure immanence.',
        },
      ],
    },
  },
  {
    term: 'ipseity',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ɪpˈsiː.ɪ.ti/',
    primary_definition:
      'Individual selfhood and reflexive personal identity; the first-personal givenness that makes an experience irreducibly "mine."',
    nuance_note:
      'Paul Ricoeur (Oneself as Another) contrasts ipseity (ipse: narrative self-constancy and ethical commitment across change) with idem-identity (mere numerical or qualitative sameness).',
    etymology: {
      roots: [
        { morpheme: 'ipse', meaning: 'himself / oneself / the very', origin: 'Latin' },
        { morpheme: '-itas', meaning: 'condition / quality', origin: 'Latin' },
      ],
      cognates: ['solipsism', 'ipso facto', 'ipsilateral'],
    },
    collocations: ['narrative ipseity', 'minimal ipseity', 'ipseity and alterity', 'pre-reflective ipseity'],
    source_context: {
      sentence:
        'Selfhood as ipseity is not sameness (idem); it implies an intimate relation to alterity such that oneself cannot be thought without another.',
      source: 'Oneself as Another',
      author: 'Paul Ricoeur',
    },
    cloze_sentences: [
      'Keeping a promise across decades exemplifies {{c1::ipseity}} even when one’s temperament has changed.',
      'Dan Zahavi argues that every conscious state carries a pre-reflective {{c1::ipseity}} prior to explicit introspection.',
    ],
    distinction_matrix: {
      synonyms: ['ipseity', 'haecceity', 'subjectivity'],
      nuanceComparison:
        'Ipseity is reflexive first-personal selfhood ("who I am"); haecceity is Duns Scotus’s non-qualitative "thisness" of any particular thing; subjectivity is the general domain of conscious interiority.',
      contextRecommendations: [
        {
          word: 'ipseity',
          recommendedRegister: 'Phenomenology / Hermeneutics',
          exampleSentence: 'Schizophrenia researchers examine disturbances in minimal ipseity.',
        },
        {
          word: 'haecceity',
          recommendedRegister: 'Scholastic / Poetic Metaphysics',
          exampleSentence: 'Hopkins’s "inscape" draws directly on Scotist haecceity.',
        },
      ],
    },
  },
  {
    term: 'facticity',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/fækˈtɪs.ɪ.ti/',
    primary_definition:
      'The concrete, unchosen historical, bodily, and situational givens into which human existence (Dasein) is thrown and within which freedom must operate.',
    nuance_note:
      'Developed by Heidegger (Faktizität) and Sartre: my birthplace, body, and past are my facticity, yet how I interpret and project myself beyond them is my transcendence.',
    etymology: {
      roots: [
        { morpheme: 'facere / factum', meaning: 'to make / that which is done', origin: 'Latin' },
        { morpheme: '-itas', meaning: 'state or condition', origin: 'Latin' },
      ],
      cognates: ['fact', 'factitious', 'artifact'],
    },
    collocations: ['thrown facticity', 'facticity and transcendence', 'bodily facticity', 'historical facticity'],
    source_context: {
      sentence:
        'Bad faith consists in the art of forming contradictory concepts which unite in themselves an idea and the negation of that idea, playing on the double property of the human being as both facticity and transcendence.',
      source: 'Being and Nothingness',
      author: 'Jean-Paul Sartre',
    },
    cloze_sentences: [
      'To deny the weight of one’s historical {{c1::facticity}} is as much an evasion of freedom as surrendering to determinism.',
      'Heidegger pairs thrown {{c1::facticity}} with existential projection toward future possibilities.',
    ],
    distinction_matrix: {
      synonyms: ['facticity', 'thrownness', 'contingency'],
      nuanceComparison:
        'Facticity is the concrete resistance and givenness of one’s situation; thrownness (Geworfenheit) emphasizes finding oneself already delivered over to a world; contingency is logical non-necessity.',
      contextRecommendations: [
        {
          word: 'facticity',
          recommendedRegister: 'Existential Phenomenology',
          exampleSentence: 'Habermas titled his legal treatise Between Facts and Norms (Faktizität und Geltung).',
        },
        {
          word: 'thrownness',
          recommendedRegister: 'Heideggerian Ontology',
          exampleSentence: 'Mood discloses Dasein’s thrownness into its "there."',
        },
      ],
    },
  },
  {
    term: 'apophatic',
    language: 'en',
    part_of_speech: 'adjective',
    phonetic: '/ˌæp.əˈfæt.ɪk/',
    primary_definition:
      'Proceeding by negation; describing the ultimate ground of being or the divine solely in terms of what may not be predicated of it.',
    nuance_note:
      'Contrasted with cataphatic (affirmative) discourse; runs from Pseudo-Dionysius and Meister Eckhart into modern continental thought (Wittgenstein’s whereof one cannot speak, Derrida’s negative theology).',
    etymology: {
      roots: [
        { morpheme: 'apo-', meaning: 'away from / off', origin: 'Greek' },
        { morpheme: 'phanai', meaning: 'to speak / say', origin: 'Greek' },
      ],
      cognates: ['aphasia', 'prophecy', 'euphemism'],
    },
    collocations: ['apophatic theology', 'apophatic mysticism', 'apophatic discourse', 'apophatic unsaying'],
    source_context: {
      sentence:
        'Ascending beyond all conceptual idols, apophatic contemplation enters the luminous darkness where every affirmative predicate falls silent.',
      source: 'The Mystical Theology',
      author: 'Pseudo-Dionysius the Areopagite',
    },
    cloze_sentences: [
      'Meister Eckhart’s sermons radicalize {{c1::apophatic}} theology by praying to be rid of every finite image of God.',
      'Adorno’s refusal to paint a positive blueprint of utopia follows an {{c1::apophatic}} ethics of critique.',
    ],
    distinction_matrix: {
      synonyms: ['apophatic', 'ineffable', 'via negativa'],
      nuanceComparison:
        'Apophatic denotes a rigorous discursive method of unsaying; ineffable describes that which exceeds speech; via negativa is the Latin equivalent of the negative path.',
      contextRecommendations: [
        {
          word: 'apophatic',
          recommendedRegister: 'Theological / Continental Philosophy',
          exampleSentence: 'Marion’s saturated phenomenon borders on apophatic phenomenology.',
        },
        {
          word: 'ineffable',
          recommendedRegister: 'Literary / Aesthetic',
          exampleSentence: 'The adagio conveys an ineffable sorrow.',
        },
      ],
    },
  },
  {
    term: 'hyle',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˈhaɪ.liː/',
    primary_definition:
      'In Aristotelian metaphysics, matter or underlying substratum as paired with form (morphe); in Husserl, the raw non-intentional sensory data animated by noetic form.',
    nuance_note:
      'Originally Greek for "timber" or "woodland," Aristotle adapted hyle for the potentiality shaped by form; Husserl coined "hyletic data" for immanent sensory impressions prior to intentional objectification.',
    etymology: {
      roots: [
        { morpheme: 'hyle', meaning: 'wood / timber / raw matter', origin: 'Greek' },
      ],
      cognates: ['hylomorphism', 'hylozoism', 'hyletic'],
    },
    collocations: ['hyle and morphe', 'sensuous hyle', 'hyletic data', 'Aristotelian hyle'],
    source_context: {
      sentence:
        'Sensuous data offer themselves as stuff—as hyle—for intentional formations or meanings of different levels.',
      source: 'Ideas I',
      author: 'Edmund Husserl',
    },
    cloze_sentences: [
      'In Aristotelian hylomorphism, bronze serves as the {{c1::hyle}} that receives the form of the statue.',
      'Husserl distinguishes the animating act of noesis from the passive sensuous {{c1::hyle}}.',
    ],
    distinction_matrix: {
      synonyms: ['hyle', 'substratum', 'prima materia'],
      nuanceComparison:
        'Hyle is the relative matter correlative to form (or sensory stuff in phenomenology); substratum (hypokeimenon) is that which underlies predication; prima materia is pure formless potentiality.',
      contextRecommendations: [
        {
          word: 'hyle',
          recommendedRegister: 'Aristotelian / Phenomenological',
          exampleSentence: 'Michel Henry critiqued Husserl’s treatment of affective hyle.',
        },
        {
          word: 'substratum',
          recommendedRegister: 'Analytic Metaphysics',
          exampleSentence: 'Locke puzzled over substance as an unknown substratum of qualities.',
        },
      ],
    },
  },
  {
    term: 'entitative',
    language: 'en',
    part_of_speech: 'adjective',
    phonetic: '/ˈɛn.tɪ.tə.tɪv/',
    primary_definition:
      'Pertaining to a thing considered purely as an existing entity or discrete substance, abstracted from its relational, historical, or existential horizon.',
    nuance_note:
      'Used in Scholasticism (entitativus) and modern ontology to critique reifying processes or consciousness into static, self-enclosed things.',
    etymology: {
      roots: [
        { morpheme: 'ens / entis', meaning: 'being / that which exists', origin: 'Latin' },
        { morpheme: '-ivus', meaning: 'tending to / pertaining to', origin: 'Latin' },
      ],
      cognates: ['entity', 'essence', 'ontological'],
    },
    collocations: ['entitative status', 'entitative realism', 'entitative conception', 'purely entitative'],
    source_context: {
      sentence:
        'To treat Dasein as an entitative substance present-at-hand is to miss its fundamental constitution as being-in-the-world.',
      source: 'History of the Concept of Time',
      author: 'Martin Heidegger',
    },
    cloze_sentences: [
      'Process philosophers reject an {{c1::entitative}} metaphysics of static substances in favor of relational becoming.',
      'Scholastic disputations distinguished {{c1::entitative}} perfection from moral habit.',
    ],
    distinction_matrix: {
      synonyms: ['entitative', 'ontic', 'substantive'],
      nuanceComparison:
        'Entitative stresses viewing something as a discrete bounded entity; ontic (Heidegger) refers to empirical facts about beings as opposed to ontological structures; substantive means having independent weight or reality.',
      contextRecommendations: [
        {
          word: 'entitative',
          recommendedRegister: 'Ontological / Scholastic',
          exampleSentence: 'Relations are not merely entitative accidents added to isolated monads.',
        },
        {
          word: 'ontic',
          recommendedRegister: 'Heideggerian Philosophy',
          exampleSentence: 'Biology is an ontic science investigating living organisms.',
        },
      ],
    },
  },
  {
    term: 'epoche',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˌɛp.ɒˈkeɪ/',
    primary_definition:
      'The methodological suspension of judgment or "bracketing" of the natural attitude regarding the external existence of the world in order to examine pure phenomena.',
    nuance_note:
      'Borrowed by Husserl from ancient Pyrrhonian Skepticism (where epoche brought ataraxia/tranquility) and repurposed as the gateway to transcendental phenomenology.',
    etymology: {
      roots: [
        { morpheme: 'epi-', meaning: 'upon / at', origin: 'Greek' },
        { morpheme: 'echein', meaning: 'to hold / check / arrest', origin: 'Greek' },
      ],
      cognates: ['epoch', 'epochal', 'hectic'],
    },
    collocations: ['phenomenological epoche', 'perform the epoche', 'Skeptical epoche', 'transcendental epoche'],
    source_context: {
      sentence:
        'Through the phenomenological epoche, I do not negate this world as though I were a sophist, nor do I doubt its existence; I simply bar myself from using any judgment about spatio-temporal existence.',
      source: 'Ideas Pertaining to a Pure Phenomenology',
      author: 'Edmund Husserl',
    },
    cloze_sentences: [
      'By enacting the {{c1::epoche}}, the phenomenologist shifts attention from naive realism to how objects constitute themselves in consciousness.',
      'Sextus Empiricus taught that equipollence of opposing arguments leads naturally to {{c1::epoche}}.',
    ],
    distinction_matrix: {
      synonyms: ['epoche', 'bracketing', 'skepticism'],
      nuanceComparison:
        'Epoche is the technical Greek/Husserlian suspension of ontological positing; bracketing (Einklammerung) is Husserl’s mathematical metaphor for the same act; skepticism actively doubts knowledge claims.',
      contextRecommendations: [
        {
          word: 'epoche',
          recommendedRegister: 'Phenomenology / Ancient Philosophy',
          exampleSentence: 'Merleau-Ponty insisted that the lesson of the epoche is the impossibility of a complete reduction.',
        },
        {
          word: 'skepticism',
          recommendedRegister: 'General Epistemology',
          exampleSentence: 'Cartesian skepticism uses hyperbolic doubt to seek indubitable foundations.',
        },
      ],
    },
  },
  {
    term: 'dasein',
    language: 'en',
    part_of_speech: 'noun',
    phonetic: '/ˈdɑː.zaɪn/',
    primary_definition:
      'In Heidegger’s fundamental ontology, the distinctive mode of human being—literally "being-there"—characterized by openness to Being, care, and temporal projection.',
    nuance_note:
      'Heidegger uses Dasein to avoid the Cartesian subject-object split built into terms like "consciousness," "ego," or "rational animal": Dasein is always already in-the-world.',
    etymology: {
      roots: [
        { morpheme: 'da-', meaning: 'there / here (spatial-temporal openness)', origin: 'German' },
        { morpheme: 'sein', meaning: 'to be / Being', origin: 'German' },
      ],
      cognates: ['Mitsein', 'Daseinsanalyse'],
    },
    collocations: ['analytic of Dasein', 'authentic Dasein', 'being-there of Dasein', 'temporal Dasein'],
    source_context: {
      sentence:
        'Dasein is an entity which does not just occur among other entities. Rather it is ontically distinguished by the fact that, in its very Being, that Being is an issue for it.',
      source: 'Being and Time',
      author: 'Martin Heidegger',
    },
    cloze_sentences: [
      'Unlike a stone or a hammer, {{c1::dasein}} exists by projecting itself toward its own finite possibilities.',
      'Heidegger identifies care (Sorge) as the ontological totality of {{c1::dasein}}.',
    ],
    distinction_matrix: {
      synonyms: ['dasein', 'subject', 'existence'],
      nuanceComparison:
        'Dasein names the worldly, temporal site where Being is disclosed; subject implies a self-enclosed Cartesian mind facing external objects; existence (Existenz) is Dasein’s ecstatic standing-out.',
      contextRecommendations: [
        {
          word: 'dasein',
          recommendedRegister: 'Fundamental Ontology / Existentialism',
          exampleSentence: 'Being-towards-death individualizes Dasein out of the "they" (das Man).',
        },
        {
          word: 'subject',
          recommendedRegister: 'Modern Epistemology',
          exampleSentence: 'Descartes grounded certainty in the thinking subject.',
        },
      ],
    },
  },
];

const BOOM_REALISMO_MAGICO_RAW: RawThematicCard[] = [
  {
    term: 'esperpento',
    language: 'es',
    gender: 'masculine',
    english_gloss: 'grotesque tragicomedy, systematically distorted mirror of reality',
    part_of_speech: 'noun',
    phonetic: '/espeɾˈpento/',
    primary_definition:
      'Género y estética literaria creada por Ramón del Valle-Inclán que deforma sistemáticamente la realidad mediante lo grotesco y el absurdo para revelar su verdad moral profunda.',
    nuance_note:
      'En Luces de bohemia, Max Estrella define el esperpento como pasar a los héroes clásicos por los espejos cóncavos del Callejón del Gato: la tragedia española vista desde una matemática perfecta de la deformación.',
    etymology: {
      roots: [
        { morpheme: 'esperpento', meaning: 'voz expresiva hispánica (despropósito / visión grotesca)', origin: 'Spanish' },
      ],
      cognates: ['esperpéntico', 'esperpentizar'],
    },
    collocations: ['estética del esperpento', 'espejo del esperpento', 'farsa y esperpento', 'esperpento ibérico'],
    source_context: {
      sentence:
        'Los héroes clásicos reflejados en los espejos cóncavos dan el Esperpento. El sentido trágico de la vida española sólo puede darse con una estética sistemáticamente deformada.',
      source: 'Luces de bohemia',
      author: 'Ramón del Valle-Inclán',
    },
    cloze_sentences: [
      'Valle-Inclán transformó la degradación política de la Restauración en un implacable {{c1::esperpento}}.',
      'La novela del dictador latinoamericano hereda del {{c1::esperpento}} su caricatura feroz del poder.',
    ],
    distinction_matrix: {
      synonyms: ['esperpento', 'sátira', 'parodia'],
      nuanceComparison:
        'El esperpento aplica una deformación cóncava trágico-grotesca a toda la condición histórica; la sátira censura vicios con intención correctiva; la parodia imita burlescamente un estilo.',
      contextRecommendations: [
        {
          word: 'esperpento',
          recommendedRegister: 'Crítica Literaria / Dramaturgia',
          exampleSentence: 'Tirano Banderas inaugura el esperpento en la narrativa hispanoamericana.',
        },
        {
          word: 'sátira',
          recommendedRegister: 'Literario / General',
          exampleSentence: 'Quevedo afiló la sátira moral contra la hipocresía cortesana.',
        },
      ],
    },
  },
  {
    term: 'claroscuro',
    language: 'es',
    gender: 'masculine',
    english_gloss: 'chiaroscuro, interplay of light and shadow / moral ambiguity',
    part_of_speech: 'noun',
    phonetic: '/klaɾosˈkuɾo/',
    primary_definition:
      'Contraste acusado entre la luz y las sombras en una obra pictórica o literaria; dualidad de lucidez y misterio en el alma o la historia.',
    nuance_note:
      'Clave en el Barroco hispánico y en la prosa de Alejo Carpentier y Ernesto Sabato para describir atmósferas donde la razón ilustrada convive con el abismo.',
    etymology: {
      roots: [
        { morpheme: 'clarus', meaning: 'claro / luminoso', origin: 'Latin' },
        { morpheme: 'obscurus', meaning: 'oscuro / sombrío', origin: 'Latin' },
      ],
      cognates: ['claridad', 'oscuridad', 'esclarecer'],
    },
    collocations: ['intenso claroscuro', 'claroscuro barroco', 'claroscuro moral', 'en medio del claroscuro'],
    source_context: {
      sentence:
        'La historia del Caribe se despliega en un violento claroscuro donde las luces de la enciclopedia chocan con el cadalso.',
      source: 'El siglo de las luces',
      author: 'Alejo Carpentier',
    },
    cloze_sentences: [
      'La prosa de Sabato explora el {{c1::claroscuro}} de la conciencia atormentada.',
      'Bajo el {{c1::claroscuro}} de los soportales coloniales se tejían las conspiraciones.',
    ],
    distinction_matrix: {
      synonyms: ['claroscuro', 'penumbra', 'contraluz'],
      nuanceComparison:
        'Claroscuro enfatiza la tensión dramática entre luz viva y sombra densa; penumbra es la transición tenue entre ambas; contraluz recorta una silueta frente al foco luminoso.',
      contextRecommendations: [
        {
          word: 'claroscuro',
          recommendedRegister: 'Estético / Ensayístico',
          exampleSentence: 'Un retrato psicológico trazado con magistral claroscuro.',
        },
        {
          word: 'contraluz',
          recommendedRegister: 'Visual / Cinematográfico',
          exampleSentence: 'Vio su perfil recortado a contraluz en el umbral.',
        },
      ],
    },
  },
  {
    term: 'onírico',
    language: 'es',
    gender: 'masculine',
    english_gloss: 'oneiric, dreamlike, pertaining to dreams',
    part_of_speech: 'adjective',
    phonetic: '/oˈni.ɾi.ko/',
    primary_definition:
      'Perteneciente o relativo a los sueños; que posee la lógica insólita, simbólica y fluida de las visiones del sueño.',
    nuance_note:
      'Piedra angular de Borges, Rulfo y Cortázar: en el realismo mágico y la literatura fantástica rioplatense, lo onírico no se opone a lo real, sino que lo infiltra.',
    etymology: {
      roots: [
        { morpheme: 'oneiros', meaning: 'sueño / ensueño', origin: 'Greek' },
        { morpheme: '-ikos', meaning: 'relativo a', origin: 'Greek' },
      ],
      cognates: ['oniromancia', 'onirismo'],
    },
    collocations: ['atmósfera onírica', 'universo onírico', 'delirio onírico', 'paisaje onírico'],
    source_context: {
      sentence:
        'En las ruinas circulares, el forastero comprende con alivio y con humillación que él también era una apariencia de carácter onírico que otro estaba soñando.',
      source: 'Ficciones',
      author: 'Jorge Luis Borges',
    },
    cloze_sentences: [
      'Comala emerge en Pedro Páramo como un murmullo {{c1::onírico}} donde los muertos conversan bajo la tierra.',
      'El relato mantiene un rigor geométrico dentro de su aparente deriva {{c1::onírica}}.',
    ],
    distinction_matrix: {
      synonyms: ['onírico', 'fantasmagórico', 'quimérico'],
      nuanceComparison:
        'Onírico remite específicamente a la textura y arquitectura de los sueños; fantasmagórico sugiere apariciones espectrales; quimérico alude a lo ilusorio o irrealizable.',
      contextRecommendations: [
        {
          word: 'onírico',
          recommendedRegister: 'Crítica Literaria / Psicoanálisis',
          exampleSentence: 'Cortázar entrelaza la vigilia parisina con el pasaje onírico.',
        },
        {
          word: 'quimérico',
          recommendedRegister: 'Filosófico / Culto',
          exampleSentence: 'Persiguió durante décadas un proyecto quimérico.',
        },
      ],
    },
  },
  {
    term: 'oropel',
    language: 'es',
    gender: 'masculine',
    english_gloss: 'tinsel, fool’s gold, gaudy and hollow ostentation',
    part_of_speech: 'noun',
    phonetic: '/o.ɾoˈpel/',
    primary_definition:
      'Lámina fina de latón que imita al oro; figuradamente, cosa de mucho brillo y apariencia vistosa pero de escaso valor o sustancia.',
    nuance_note:
      'Del occitano antiguo auripel ("piel de oro"). Muy empleado por José Martí, Rubén Darío y García Márquez para desenmascarar la retórica hueca o el lujo impostado del poder.',
    etymology: {
      roots: [
        { morpheme: 'aurum', meaning: 'oro', origin: 'Latin' },
        { morpheme: 'pellis', meaning: 'piel / lámina delgada', origin: 'Latin' },
      ],
      cognates: ['oro', 'piel', 'película', 'aurífero'],
    },
    collocations: ['falso oropel', 'oropel retórico', 'brillo de oropel', 'despojar de oropel'],
    source_context: {
      sentence:
        'Tras el esplendor efímero de la compañía bananera, en Macondo sólo quedaron escombros de oropel y trenes oxidados.',
      source: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
    },
    cloze_sentences: [
      'El ensayista supo distinguir la poesía verdadera del mero {{c1::oropel}} decorativo.',
      'Las promesas del caudillo resultaron ser {{c1::oropel}} destinado a encandilar a la multitud.',
    ],
    distinction_matrix: {
      synonyms: ['oropel', 'fasto', 'boato'],
      nuanceComparison:
        'Oropel implica falsedad y engaño tras un brillo barato; fasto y boato designan magnificencia u ostentación suntuosa pero materialmente real.',
      contextRecommendations: [
        {
          word: 'oropel',
          recommendedRegister: 'Literario / Crítico',
          exampleSentence: 'La corte vivía envuelta en un patético oropel.',
        },
        {
          word: 'boato',
          recommendedRegister: 'Histórico / Culto',
          exampleSentence: 'El virrey entró en Lima con inusitado boato.',
        },
      ],
    },
  },
  {
    term: 'desmesura',
    language: 'es',
    gender: 'feminine',
    english_gloss: 'boundlessness, hubristic excess, monumental scale beyond measure',
    part_of_speech: 'noun',
    phonetic: '/des.meˈsu.ɾa/',
    primary_definition:
      'Falta de medida, proporción o templanza; magnitud colosal de la naturaleza, la pasión o la imaginación que desborda los cánones clásicos.',
    nuance_note:
      'Traduce tanto la hybris trágica griega como la escala telúrica americana (selvas, ríos, pasiones absolutas) que alimenta lo real maravilloso en Carpentier y García Márquez.',
    etymology: {
      roots: [
        { morpheme: 'des-', meaning: 'privación / exceso fuera de', origin: 'Latin' },
        { morpheme: 'mensura', meaning: 'medida / proporción', origin: 'Latin' },
      ],
      cognates: ['mesura', 'mensurable', 'inmenso', 'conmensurar'],
    },
    collocations: ['desmesura tropical', 'trágica desmesura', 'desmesura barroca', 'fastuosa desmesura'],
    source_context: {
      sentence:
        'La realidad entera de América Latina, desde su geografía indómita hasta sus tiranías delirantes, está marcada por el signo de la desmesura.',
      source: 'La soledad de América Latina',
      author: 'Gabriel García Márquez',
    },
    cloze_sentences: [
      'La estirpe de los Buendía repite sus pasiones con una {{c1::desmesura}} que ignora el paso de los siglos.',
      'Frente a la sobriedad ática, el barroco americano abraza la {{c1::desmesura}} de la selva.',
    ],
    distinction_matrix: {
      synonyms: ['desmesura', 'intemperancia', 'exorbitancia'],
      nuanceComparison:
        'Desmesura posee resonancia estética y ontológica (hybris o inmensidad cósmica); intemperancia es falta moral de moderación; exorbitancia alude a cifras o precios que salen de órbita.',
      contextRecommendations: [
        {
          word: 'desmesura',
          recommendedRegister: 'Literario / Filosófico',
          exampleSentence: 'La novela total aspira a igualar la desmesura del continente.',
        },
        {
          word: 'intemperancia',
          recommendedRegister: 'Moral / Clásico',
          exampleSentence: 'Séneca advirtió contra la intemperancia de los afectos.',
        },
      ],
    },
  },
  {
    term: 'acendrado',
    language: 'es',
    gender: 'masculine',
    english_gloss: 'purified in the crucible, spotless, refined to its purest essence',
    part_of_speech: 'adjective',
    phonetic: '/a.θenˈdɾa.ðo/',
    primary_definition:
      'Puro, sin mancha ni defecto; dicho de una cualidad moral, intelectual o estética que ha sido depurada como los metales nobles en la cendra.',
    nuance_note:
      'Proviene de la metalurgia tradicional: la "cendra" es la pasta de ceniza de huesos donde se afinaban el oro y la plata en el crisol.',
    etymology: {
      roots: [
        { morpheme: 'a-', meaning: 'hacia / acción de', origin: 'Latin' },
        { morpheme: 'cinis / cineris', meaning: 'ceniza de crisol (cendra)', origin: 'Latin' },
        { morpheme: '-ado', meaning: 'participio / cualidad depurada', origin: 'Latin' },
      ],
      cognates: ['cendra', 'ceniza', 'incinerar'],
    },
    collocations: ['prosa acendrada', 'patriotismo acendrado', 'vocación acendrada', 'virtud acendrada'],
    source_context: {
      sentence:
        'Alfonso Reyes ejerció a lo largo de medio siglo el más acendrado magisterio de lucidez y cortesía intelectual en nuestra lengua.',
      source: 'Otras inquisiciones',
      author: 'Jorge Luis Borges',
    },
    cloze_sentences: [
      'Su poesía evolucionó desde el barroquismo juvenil hacia una expresión {{c1::acendrada}} y desnuda.',
      'Defendió la libertad de cátedra con un rigor ético {{c1::acendrado}}.',
    ],
    distinction_matrix: {
      synonyms: ['acendrado', 'depurado', 'acrisolado'],
      nuanceComparison:
        'Acendrado y acrisolado comparten la metáfora alquímica del fuego que purifica el metal (en la cendra o el crisol); depurado es más técnico o estilístico.',
      contextRecommendations: [
        {
          word: 'acendrado',
          recommendedRegister: 'Literario / Panegírico Culto',
          exampleSentence: 'Conservó siempre un acendrado amor por los clásicos del Siglo de Oro.',
        },
        {
          word: 'depurado',
          recommendedRegister: 'Crítico / Estilístico',
          exampleSentence: 'Una técnica narrativa sumamente depurada.',
        },
      ],
    },
  },
  {
    term: 'vorágine',
    language: 'es',
    gender: 'feminine',
    english_gloss: 'maelstrom, vortex, all-consuming whirlwind',
    part_of_speech: 'noun',
    phonetic: '/boˈɾa.xi.ne/',
    primary_definition:
      'Remolino impetuoso que hacen las aguas del mar o de los ríos; figuradamente, pasión desenfrenada o sucesión vertiginosa de acontecimientos que todo lo devora.',
    nuance_note:
      'Inmortalizada por la novela homónima de José Eustasio Rivera (La vorágine, 1924): el infierno verde amazónico y la fiebre del caucho que engullen al protagonista Arturo Cova.',
    etymology: {
      roots: [
        { morpheme: 'vorare', meaning: 'devorar / tragar con avidez', origin: 'Latin' },
        { morpheme: '-ago / -aginis', meaning: 'fuerza o abismo envolvente', origin: 'Latin' },
      ],
      cognates: ['voraz', 'devorar', 'omnívoro'],
    },
    collocations: ['la vorágine de la selva', 'vorágine de la guerra', 'engullido por la vorágine', 'vorágine urbana'],
    source_context: {
      sentence:
        '¡Los devoró la selva! Así concluye el manuscrito de Arturo Cova, arrastrado sin rastro hacia el fondo de la vorágine amazónica.',
      source: 'La vorágine',
      author: 'José Eustasio Rivera',
    },
    cloze_sentences: [
      'Las familias desplazadas intentaban sobrevivir en medio de la {{c1::vorágine}} revolucionaria.',
      'La especulación financiera arrastró al país hacia una {{c1::vorágine}} inflacionaria.',
    ],
    distinction_matrix: {
      synonyms: ['vorágine', 'torbellino', 'piélago'],
      nuanceComparison:
        'Vorágine conlleva la idea visceral de un abismo que devora (vorare) sin retorno; torbellino destaca el giro rápido del viento; piélago es la inmensidad profunda del mar.',
      contextRecommendations: [
        {
          word: 'vorágine',
          recommendedRegister: 'Narrativo / Trágico',
          exampleSentence: 'Se perdió en la vorágine de las caucherías.',
        },
        {
          word: 'torbellino',
          recommendedRegister: 'General / Poético',
          exampleSentence: 'Un torbellino de recuerdos asaltó su memoria.',
        },
      ],
    },
  },
  {
    term: 'sortilegio',
    language: 'es',
    gender: 'masculine',
    english_gloss: 'sorcery, spellbinding enchantment, divination by lots',
    part_of_speech: 'noun',
    phonetic: '/soɾ.tiˈle.xjo/',
    primary_definition:
      'Adivinación o encantamiento por medio de suertes mágicas; fascinación irresistible y misteriosa que ejerce una persona, una obra de arte o un lugar.',
    nuance_note:
      'Une sus raíces latinas (sortem legere, leer las suertes) con el hechizo estético del realismo mágico, donde el lenguaje mismo opera como conjuro.',
    etymology: {
      roots: [
        { morpheme: 'sors / sortis', meaning: 'suerte / destino / oráculo', origin: 'Latin' },
        { morpheme: 'legere', meaning: 'leer / recoger / interpretar', origin: 'Latin' },
      ],
      cognates: ['suerte', 'consorcio', 'lectura', 'sacrilegio'],
    },
    collocations: ['extraño sortilegio', 'bajo el sortilegio de', 'sortilegio verbal', 'romper el sortilegio'],
    source_context: {
      sentence:
        'La música de aquellos acordeones viajeros poseía el sortilegio de suspender el tiempo en las aldeas de la ciénaga.',
      source: 'El amor en los tiempos del cólera',
      author: 'Gabriel García Márquez',
    },
    cloze_sentences: [
      'El lector queda atrapado desde la primera página por el {{c1::sortilegio}} rítmico de su sintaxis.',
      'Ningún {{c1::sortilegio}} de los gitanos pudo devolverle la memoria al pueblo insomne.',
    ],
    distinction_matrix: {
      synonyms: ['sortilegio', 'embrujo', 'fascinación'],
      nuanceComparison:
        'Sortilegio conserva un timbre culto y oracular (leer el destino); embrujo es más popular y pasional; fascinación es psicológico y general.',
      contextRecommendations: [
        {
          word: 'sortilegio',
          recommendedRegister: 'Literario / Poético',
          exampleSentence: 'La noche veneciana ejercía sobre los viajeros un antiguo sortilegio.',
        },
        {
          word: 'embrujo',
          recommendedRegister: 'Lírico / Folclórico',
          exampleSentence: 'El embrujo del cante jondo conmovió al auditorio.',
        },
      ],
    },
  },
  {
    term: 'penumbra',
    language: 'es',
    gender: 'feminine',
    english_gloss: 'penumbra, half-light, twilight shadow between light and darkness',
    part_of_speech: 'noun',
    phonetic: '/peˈnum.bɾa/',
    primary_definition:
      'Sombra débil entre la luz y la oscuridad, que no deja percibir dónde empieza la una o acaba la otra; estado de vaguedad o recogimiento íntimo.',
    nuance_note:
      'Acuñada en el latín científico por Johannes Kepler (paene umbra, "casi sombra") para los eclipses y adoptada por la lírica modernista y la narrativa de Juan Carlos Onetti y José Donoso.',
    etymology: {
      roots: [
        { morpheme: 'paene', meaning: 'casi / prácticamente', origin: 'Latin' },
        { morpheme: 'umbra', meaning: 'sombra', origin: 'Latin' },
      ],
      cognates: ['península', 'umbral', 'umbroso', 'sombrío'],
    },
    collocations: ['fresca penumbra', 'penumbra del cuarto', 'en la penumbra de la memoria', 'vaga penumbra'],
    source_context: {
      sentence:
        'En la penumbra tibia de los corredores coloniales, las ancianas desgranaban rosarios y genealogías olvidadas.',
      source: 'El obsceno pájaro de la noche',
      author: 'José Donoso',
    },
    cloze_sentences: [
      'Borges, ya ciego, habitaba una luminosa {{c1::penumbra}} poblada de hexámetros y tigres.',
      'Los conspiradores aguardaron en la {{c1::penumbra}} de la biblioteca hasta que sonaron las doce.',
    ],
    distinction_matrix: {
      synonyms: ['penumbra', 'crepúsculo', 'tiniebla'],
      nuanceComparison:
        'Penumbra es la media luz íntima e indecisa en cualquier espacio o eclipse; crepúsculo se refiere específicamente a la caída o el alba del sol; tiniebla es oscuridad cerrada y total.',
      contextRecommendations: [
        {
          word: 'penumbra',
          recommendedRegister: 'Literario / Descriptivo',
          exampleSentence: 'Sus ojos tardaron en acostumbrarse a la penumbra del archivo.',
        },
        {
          word: 'tiniebla',
          recommendedRegister: 'Bíblico / Trágico',
          exampleSentence: 'Una espesa tiniebla cubrió la llanura.',
        },
      ],
    },
  },
  {
    term: 'alquimia',
    language: 'es',
    gender: 'feminine',
    english_gloss: 'alchemy, poetic or spiritual transmutation',
    part_of_speech: 'noun',
    phonetic: '/alˈki.mja/',
    primary_definition:
      'Sabiduría hermética antigua que buscaba la transmutación de los metales y la piedra filosofal; figuradamente, transformación prodigiosa de la materia cotidiana en arte o espíritu.',
    nuance_note:
      'En Cien años de soledad, el laboratorio de alquimia de Melquíades y José Arcadio Buendía es el corazón simbólico de la novela: la escritura como transmutación de la memoria.',
    etymology: {
      roots: [
        { morpheme: 'al-', meaning: 'el / la (artículo árabe)', origin: 'Arabic' },
        { morpheme: 'kimiya / chemeia', meaning: 'arte de fundir y transmutar metales', origin: 'Greek' },
      ],
      cognates: ['alquimista', 'alquímico', 'química'],
    },
    collocations: ['alquimia del verbo', 'secreta alquimia', 'laboratorio de alquimia', 'alquimia poética'],
    source_context: {
      sentence:
        'Melquíades le regaló a José Arcadio Buendía un laboratorio de alquimia que habría de alterar para siempre el destino de la aldea.',
      source: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
    },
    cloze_sentences: [
      'La traducción literaria exige una sutil {{c1::alquimia}} capaz de preservar la música en otro idioma.',
      'Por obra de la {{c1::alquimia}} narrativa, la crónica periodística se convirtió en mito.',
    ],
    distinction_matrix: {
      synonyms: ['alquimia', 'transmutación', 'metamorfosis'],
      nuanceComparison:
        'Alquimia enfatiza el arte hermético y deliberado de destilar lo vulgar en oro espiritual o verbal; transmutación es el cambio de una sustancia en otra; metamorfosis es el cambio biológico o mítico de forma.',
      contextRecommendations: [
        {
          word: 'alquimia',
          recommendedRegister: 'Poético / Ensayístico',
          exampleSentence: 'Rimbaud proclamó la alquimia del verbo como método visionario.',
        },
        {
          word: 'transmutación',
          recommendedRegister: 'Filosófico / Científico',
          exampleSentence: 'Nietzsche propuso la transmutación de todos los valores.',
        },
      ],
    },
  },
];

export const THEMATIC_PACKS: ThematicPackDefinition[] = [
  {
    id: 'aesthetics-poetics',
    title: 'Aesthetics, Art & Poetics',
    subtitle: '10 Curated Terms • Visual Theory, Rhetoric & Formal Criticism',
    description:
      'From Homeric ekphrasis and Renaissance concinnity to Caravaggesque chiaroscuro, Holbein’s anamorphosis, and Wölfflin’s tectonic form.',
    language: 'en',
    category: 'Aesthetics & Poetics',
    cards: buildPackCards('20000001', AESTHETICS_POETICS_RAW),
  },
  {
    id: 'political-economy',
    title: 'Political Economy & Critical Theory',
    subtitle: '10 Curated Terms • Statecraft, Hegemony & Social Structure',
    description:
      'Keynesian rentier critique, Gaullist dirigisme, Gramscian subalternity, Durkheimian anomie, and classical Athenian isegoria.',
    language: 'en',
    category: 'Political Economy',
    cards: buildPackCards('20000002', POLITICAL_ECONOMY_RAW),
  },
  {
    id: 'phenomenology-mind',
    title: 'Phenomenology & Philosophy of Mind',
    subtitle: '10 Curated Terms • Consciousness, Intentionality & Ontology',
    description:
      'Husserl’s epoche, noema, and hyle alongside Heideggerian Dasein and facticity, Ricoeur’s ipseity, Spinoza’s aseity, and analytic qualia.',
    language: 'en',
    category: 'Philosophy of Mind',
    cards: buildPackCards('20000003', PHENOMENOLOGY_MIND_RAW),
  },
  {
    id: 'boom-realismo-magico',
    title: 'Boom Latinoamericano & Realismo Mágico',
    subtitle: '10 Vocablos Selectos • Borges, García Márquez, Carpentier y Valle-Inclán',
    description:
      'El léxico matricial de la gran literatura hispánica: el esperpento, la desmesura macondiana, la alquimia de Melquíades, el universo onírico de Ficciones y la vorágine.',
    language: 'es',
    category: 'Literatura Hispánica',
    cards: buildPackCards('20000004', BOOM_REALISMO_MAGICO_RAW),
  },
];

export const ALL_CURATED_PACKS: ThematicPackDefinition[] = [
  {
    id: 'en-philosophical',
    title: '100 Philosophical & Literary Core',
    subtitle: '100 Curated Terms • Epistemology, Critical Theory, Poetics & Existentialism',
    description:
      'The flagship 100-term Lexis curriculum spanning five foundational clusters of philosophical, rhetorical, and literary criticism.',
    language: 'en',
    category: 'Core Curriculum',
    cards: PHILOSOPHICAL_SEED_CARDS,
  },
  {
    id: 'es-literary',
    title: '25 Spanish Literary & Philosophical',
    subtitle: '25 Vocablos Cultos • Unamuno, Ortega y Gasset, Borges y el Siglo de Oro',
    description:
      'Veinticinco términos esenciales del ensayo y la lírica en español con raíces latinas, griegas y árabes, anclaje en inglés y matrices de distinción.',
    language: 'es',
    category: 'Core Curriculum',
    cards: SPANISH_LITERARY_SEED_CARDS,
  },
  ...THEMATIC_PACKS,
];

export function findCuratedPackById(packId: string): ThematicPackDefinition | undefined {
  const normalized = packId.toLowerCase().trim();
  if (normalized === 'en') {
    return ALL_CURATED_PACKS.find((p) => p.id === 'en-philosophical');
  }
  if (normalized === 'es') {
    return ALL_CURATED_PACKS.find((p) => p.id === 'es-literary');
  }
  return ALL_CURATED_PACKS.find((p) => p.id === normalized);
}
