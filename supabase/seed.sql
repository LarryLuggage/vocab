-- ============================================================================
-- Lexis Engine: 100-Term Philosophical & Literary Foundational Seed (PostgreSQL)
-- Generated on: 2026-10-15T19:26:25.893Z
-- Idempotent: Can be run multiple times safely via ON CONFLICT
-- ============================================================================

BEGIN;

-- Card 1: aporia
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'aporia',
    'en',
    'noun',
    '/əˈpɔː.ri.ə/',
    'An irresolvable internal contradiction, logical impasse, or state of cognitive puzzlement in a philosophical discourse or text.',
    'In classical rhetoric and deconstruction, aporia is not merely ignorance or a puzzle to be solved, but a constitutive breakdown where the text or argument undoes its own foundational axioms.',
    '{"roots":[{"morpheme":"a-","meaning":"without / lack of","origin":"Greek"},{"morpheme":"poros","meaning":"passage / way / resource","origin":"Greek"},{"morpheme":"-ia","meaning":"state / condition of","origin":"Greek"}],"cognates":["pore","porous","aporetic"]}'::jsonb,
    ARRAY['aporia of justice', 'textual aporia', 'confront an aporia', 'aporetic impasse'],
    '{"sentence":"The dialogue terminates in an explicit aporia, refusing to provide the interlocutors with an unproblematic definition of courage.","source":"Plato and the Limits of Socratic Inquiry","author":"Gregory Vlastos"}'::jsonb,
    ARRAY['Deconstructive reading identifies the subtle {{c1::aporia}} where a philosophical thesis inadvertently relies upon the very premise it rejects.', 'Socrates led his listeners into a state of salutary {{c1::aporia}}, stripping them of unexamined dogmas.'],
    '{"synonyms":["aporia","antinomy","paradox"],"nuanceComparison":"Aporia denotes a structural or conceptual deadlock in discourse where all exits are blocked; antinomy is an explicit contradiction between two equally demonstrable laws; paradox is an apparent contradiction that may nonetheless reveal a deeper truth.","contextRecommendations":[{"word":"aporia","recommendedRegister":"Deconstructive / Philosophical","exampleSentence":"Derrida situates the aporia of hospitality in the impossible demand for unconditional welcome."},{"word":"antinomy","recommendedRegister":"Kantian / Epistemic","exampleSentence":"Kant investigated the four antinomies of pure reason regarding time and freedom."},{"word":"paradox","recommendedRegister":"Literary / General Analytical","exampleSentence":"The paradox of the welfare state lies in subsidizing the conditions of its own decline."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-15T10:00:00.000Z',
    0, 0, 0, 0, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 2: episteme
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'episteme',
    'en',
    'noun',
    '/ˌep.ɪˈstiː.mi/',
    'The historical framework, unconscious grid, or system of unconscious rules that determines what is possible to think, perceive, or know in a given era.',
    'Associated fundamentally with Michel Foucault, an episteme is not an ideology consciously believed by individuals, but the overarching epistemological substrate that structures all scientific and philosophical discourses of an epoch.',
    '{"roots":[{"morpheme":"episteme","meaning":"knowledge / science / understanding","origin":"Greek"},{"morpheme":"epistasthai","meaning":"to know / understand (literally: stand over)","origin":"Greek"}],"cognates":["epistemology","epistemic","epistemological"]}'::jsonb,
    ARRAY['classical episteme', 'modern episteme', 'rupture of the episteme', 'epistemic paradigm'],
    '{"sentence":"In any given culture and at any given moment, there is always only one episteme that defines the conditions of possibility of all knowledge.","source":"The Order of Things","author":"Michel Foucault"}'::jsonb,
    ARRAY['The transition from the Renaissance to the Classical era marked a radical shift in the European {{c1::episteme}} from similitude to representation.', 'Historians of thought must excavate the subterranean {{c1::episteme}} that silently validated medieval medical dogma.'],
    '{"synonyms":["episteme","paradigm","worldview"],"nuanceComparison":"Episteme refers to the unconscious, epoch-defining discursive condition of all knowledge; paradigm is a specific disciplinary matrix or scientific problem-solving framework (Kuhn); worldview (Weltanschauung) is an explicit cultural or personal perspective on life.","contextRecommendations":[{"word":"episteme","recommendedRegister":"Archaeological / Post-Structuralist","exampleSentence":"The taxonomy of living beings reflected the sovereign episteme of the seventeenth century."},{"word":"paradigm","recommendedRegister":"History of Science / Sociology","exampleSentence":"Copernicus inaugurated a scientific paradigm shift."},{"word":"worldview","recommendedRegister":"Cultural / Anthropological","exampleSentence":"Nomadic peoples possessed a worldview intimately bound to migration cycles."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-15T10:00:00.000Z',
    0, 0, 0, 0, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 3: haecceity
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'haecceity',
    'en',
    'noun',
    '/hɛkˈsiː.ɪ.ti/',
    'The distinct "thisness" or unique individualizing nature of an entity; that by virtue of which a thing is this singular entity and not another.',
    'Coined by medieval scholastic Duns Scotus and revived by Gilles Deleuze, contrasting quiddity ("whatness" or universal essence) with haecceity ("thisness" or radical particularity across spacetime).',
    '{"roots":[{"morpheme":"haec","meaning":"this (feminine singular)","origin":"Latin"},{"morpheme":"-itas","meaning":"state / quality of being","origin":"Latin"}],"cognates":["quiddity","identity"]}'::jsonb,
    ARRAY['radical haecceity', 'singular haecceity', 'haecceity of an event', 'capture the haecceity'],
    '{"sentence":"A season, a winter, an hour, a wind: each possesses a perfect haecceity, a qualitative singularity without becoming a subject.","source":"A Thousand Plateaus","author":"Gilles Deleuze and Félix Guattari"}'::jsonb,
    ARRAY['The poet sought words to immortalize the unrepeatable {{c1::haecceity}} of a sudden autumn twilight over the marshlands.', 'Duns Scotus argued that species provide universal nature, while {{c1::haecceity}} confers ultimate concrete individuality.'],
    '{"synonyms":["haecceity","quiddity","individuality"],"nuanceComparison":"Haecceity is the radical, singular \"thisness\" of a concrete individual; quiddity is the generic essence or \"whatness\" shared by all members of a kind; individuality is the broader condition of distinct existence.","contextRecommendations":[{"word":"haecceity","recommendedRegister":"Scholastic / Continental Metaphysics","exampleSentence":"Hopkins celebrated the inscape and haecceity of every created thing."},{"word":"quiddity","recommendedRegister":"Ontological / Scholastic","exampleSentence":"Defining the quiddity of justice has consumed political philosophers since antiquity."},{"word":"individuality","recommendedRegister":"Humanistic / Social","exampleSentence":"Modern education claims to cultivate personal individuality."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-15T10:00:00.000Z',
    0, 0, 0, 0, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 4: anamnesis
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'anamnesis',
    'en',
    'noun',
    '/ˌæn.æmˈniː.sɪs/',
    'The recollection of innate knowledge or transcendental forms acquired by the soul before embodiment; in liturgical theology, active anamnetic remembrance.',
    'In Platonic philosophy, learning is not the acquisition of alien facts, but anamnesis—the recovery of forgotten truths already present in the soul. In literary theory, it denotes writing as retrieval of ancestral memory.',
    '{"roots":[{"morpheme":"ana-","meaning":"back / again","origin":"Greek"},{"morpheme":"mnaomai","meaning":"to remember / be mindful of","origin":"Greek"},{"morpheme":"-sis","meaning":"process / action","origin":"Greek"}],"cognates":["amnesia","mnemonic","memory"]}'::jsonb,
    ARRAY['platonic anamnesis', 'act of anamnesis', 'liturgical anamnesis', 'philosophical anamnesis'],
    '{"sentence":"If truth was in the soul before our birth, then the pursuit of wisdom is nothing other than an act of anamnesis.","source":"Meno","author":"Plato"}'::jsonb,
    ARRAY['The protagonist experienced a sudden flash of {{c1::anamnesis}}, feeling he had walked these ancient ruins in another life.', 'Socrates claimed that the illiterate boy could solve geometric theorems through guided {{c1::anamnesis}}.'],
    '{"synonyms":["anamnesis","reminiscence","recollection"],"nuanceComparison":"Anamnesis implies the metaphysical recollection of innate or transcendent knowledge; reminiscence is the sentimental recall of past personal episodes; recollection is the deliberate cognitive act of remembering.","contextRecommendations":[{"word":"anamnesis","recommendedRegister":"Philosophical / Liturgical / Mythic","exampleSentence":"The ritual served as an anamnesis of the primordial founding covenant."},{"word":"reminiscence","recommendedRegister":"Literary / Autobiographical","exampleSentence":"Her memoirs were full of tender reminiscence of rural Brittany."},{"word":"recollection","recommendedRegister":"Cognitive / General","exampleSentence":"He had no clear recollection of the events immediately preceding the impact."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-15T10:00:00.000Z',
    0, 0, 0, 0, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 5: teleology
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'teleology',
    'en',
    'noun',
    '/ˌtiː.liˈɒl.ə.dʒi/',
    'The philosophical doctrine that phenomena, natural processes, or historical movements are explained by the purpose, end, or design they serve.',
    'From Aristotle''s "final cause" (telos) to Hegelian historical progress; frequently critiqued in modern biology and post-structuralist thought for projecting human intentionality onto blind evolutionary or social contingencies.',
    '{"roots":[{"morpheme":"telos","meaning":"end / goal / completion / purpose","origin":"Greek"},{"morpheme":"-logia","meaning":"study / discourse of","origin":"Greek"}],"cognates":["teleological","telos","dysteleology"]}'::jsonb,
    ARRAY['teleological worldview', 'historical teleology', 'reject teleology', 'immanent teleology'],
    '{"sentence":"Darwinian natural selection dealt a fatal blow to natural teleology, demonstrating that design emerges through blind trial and survival.","source":"The Blind Watchmaker","author":"Richard Dawkins"}'::jsonb,
    ARRAY['Marxist historiography was often accused of an unacknowledged {{c1::teleology}} leading inexorably to the classless society.', 'Aristotle posited that an acorn possesses an internal {{c1::teleology}} directing its growth toward becoming a mature oak.'],
    '{"synonyms":["teleology","determinism","fatalism"],"nuanceComparison":"Teleology explains events by the final purpose or goal pulling them forward; determinism explains events by antecedent mechanistic causes pushing them forward; fatalism attributes outcomes to predetermined cosmic decree regardless of human action.","contextRecommendations":[{"word":"teleology","recommendedRegister":"Philosophical / Historiographical","exampleSentence":"Hegel viewed history as the teleological unfolding of self-conscious Spirit."},{"word":"determinism","recommendedRegister":"Scientific / Analytical","exampleSentence":"Laplace championed physical determinism where every future state is calculated from the present."},{"word":"fatalism","recommendedRegister":"Existential / Tragic","exampleSentence":"Resigned to fatalism, the besieged garrison ceased fortifying their walls."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-15T10:00:00.000Z',
    0, 0, 0, 0, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 6: incommensurable
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000000',
    'incommensurable',
    'en',
    'adjective',
    '/ˌɪn.kəˈmen.ʃər.ə.bəl/',
    'Not able to be judged, measured, or compared by a common standard; having no shared basis for mutual translation or reconciliation.',
    'Crucial in the philosophy of science (Thomas Kuhn) to describe competing paradigms whose concepts cannot be directly translated into one another without fundamental semantic distortion.',
    '{"roots":[{"morpheme":"in-","meaning":"not / un-","origin":"Latin"},{"morpheme":"com-","meaning":"together / with","origin":"Latin"},{"morpheme":"mensurare","meaning":"to measure (from mensura)","origin":"Latin"},{"morpheme":"-able","meaning":"capable of being","origin":"Latin"}],"cognates":["commensurate","measure","dimension"]}'::jsonb,
    ARRAY['incommensurable paradigms', 'incommensurable values', 'mutually incommensurable', 'incommensurable worldviews'],
    '{"sentence":"The normal-scientific tradition that emerges from a scientific revolution is not only incompatible but often incommensurable with that which has gone before.","source":"The Structure of Scientific Revolutions","author":"Thomas Kuhn"}'::jsonb,
    ARRAY['Isaiah Berlin argued that human values like liberty and equality are fundamentally {{c1::incommensurable}} and cannot be harmonized without tragic loss.', 'Because their theological assumptions were {{c1::incommensurable}}, the disputants talked past each other for days.'],
    '{"synonyms":["incommensurable","incompatible","disparate"],"nuanceComparison":"Incommensurable means lacking any common yardstick or metric for comparison; incompatible means incapable of coexisting peacefully or logically; disparate means fundamentally different in kind.","contextRecommendations":[{"word":"incommensurable","recommendedRegister":"Epistemic / Moral Philosophy","exampleSentence":"Utilitarianism fails when attempting to reduce incommensurable moral claims to a single hedonistic calculus."},{"word":"incompatible","recommendedRegister":"Logistical / Logical","exampleSentence":"Her aggressive expansion plan was incompatible with fiscal austerity."},{"word":"disparate","recommendedRegister":"Descriptive / Sociological","exampleSentence":"The coalition gathered disparate regional factions under one temporary banner."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-15T10:00:00.000Z',
    0, 0, 0, 0, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 7: solipsism
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000000',
    'solipsism',
    'en',
    'noun',
    '/ˈsɒl.ɪp.sɪ.zəm/',
    'The philosophical theory that only one''s own mind is sure to exist; epistemological skepticism regarding the existence of other minds or the external world.',
    'Used technically in epistemology as the extreme limit of Cartesian doubt; used pejoratively in cultural criticism to denote narcissistic self-enclosure that treats the external world as secondary decor.',
    '{"roots":[{"morpheme":"solus","meaning":"alone / only","origin":"Latin"},{"morpheme":"ipse","meaning":"self / himself","origin":"Latin"},{"morpheme":"-ism","meaning":"philosophical doctrine / belief","origin":"Greek"}],"cognates":["solitary","solitude","solo"]}'::jsonb,
    ARRAY['radical solipsism', 'epistemological solipsism', 'descent into solipsism', 'verge on solipsism'],
    '{"sentence":"If consciousness can never genuinely step outside its own representations, it remains imprisoned in the silent cell of solipsism.","source":"Meditations on First Philosophy (Critical Commentary)","author":"Jean-Luc Marion"}'::jsonb,
    ARRAY['The protagonist''s claustrophobic interior monologue turns the novel into a haunting study of psychological {{c1::solipsism}}.', 'Skeptics who doubt the physical world must ultimately reckon with the absurd dead-end of radical {{c1::solipsism}}.'],
    '{"synonyms":["solipsism","egocentrism","narcissism"],"nuanceComparison":"Solipsism is an epistemological doctrine denying knowledge of external minds; egocentrism is a cognitive inability to imagine alternative perspectives; narcissism is an emotional fixation on vanity and self-aggrandizement.","contextRecommendations":[{"word":"solipsism","recommendedRegister":"Metaphysical / Epistemic","exampleSentence":"Modern digital hyper-individualism fosters an intellectual solipsism fatal to democratic life."},{"word":"egocentrism","recommendedRegister":"Psychological / Developmental","exampleSentence":"Childhood egocentrism gradually yields to empathetic socialization."},{"word":"narcissism","recommendedRegister":"Clinical / Cultural Critique","exampleSentence":"Social media algorithms incentivize vanity and civic narcissism."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-15T10:00:00.000Z',
    0, 0, 0, 0, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 8: qualia
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000000',
    'qualia',
    'en',
    'noun',
    '/ˈkwɑː.li.ə/',
    'Individual instances of subjective, conscious experience; the internal, qualitative "what it is like" to perceive a sensation (e.g., the redness of a rose).',
    'Plural of quale. Central to the philosophy of mind and the "hard problem of consciousness" (David Chalmers), challenging materialist neurobiology to explain how physical synapses produce phenomenal raw feels.',
    '{"roots":[{"morpheme":"qualis","meaning":"of what kind / sort","origin":"Latin"},{"morpheme":"-ia","meaning":"plural neuter suffix","origin":"Latin"}],"cognates":["quality","qualitative"]}'::jsonb,
    ARRAY['subjective qualia', 'problem of qualia', 'phenomenal qualia', 'ineffable qualia'],
    '{"sentence":"No matter how exhaustively we map the auditory cortex, physical science cannot explain the experiential qualia of hearing a cello.","source":"The Conscious Mind","author":"David Chalmers"}'::jsonb,
    ARRAY['The thought experiment of Mary the color scientist proves that physical information alone cannot convey the {{c1::qualia}} of seeing red.', 'Art aims not merely to transfer factual data, but to recreate the irreducible {{c1::qualia}} of living experience.'],
    '{"synonyms":["qualia","sensations","percepts"],"nuanceComparison":"Qualia designates the purely subjective, raw qualitative feel of conscious experience; sensations refers to physiological sensory inputs; percepts designates the mentally organized objects of sensory awareness.","contextRecommendations":[{"word":"qualia","recommendedRegister":"Philosophy of Mind / Cognitive Science","exampleSentence":"Machine learning models process tokens without ever experiencing phenomenal qualia."},{"word":"sensations","recommendedRegister":"Physiological / General","exampleSentence":"A sensation of intense heat flashed across his skin."},{"word":"percepts","recommendedRegister":"Psychological / Gestalt","exampleSentence":"The visual apparatus binds fragmented light into unified conscious percepts."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-15T10:00:00.000Z',
    0, 0, 0, 0, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 9: monad
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000000',
    'monad',
    'en',
    'noun',
    '/ˈmɒn.æd/',
    'An indivisible, ultimate metaphysical unit of substance that perceives and reflects the entire universe from its own perspective without external interaction.',
    'Formulated by Gottfried Wilhelm Leibniz in Monadology; monads are immaterial, windowless ("monads have no windows through which anything could come in or go out"), yet harmonized by divine pre-established harmony.',
    '{"roots":[{"morpheme":"monas","meaning":"unit / alone / solitary","origin":"Greek"},{"morpheme":"monos","meaning":"single / alone","origin":"Greek"}],"cognates":["monopoly","monastery","monism"]}'::jsonb,
    ARRAY['windowless monad', 'leibnizian monad', 'isolated monad', 'monadic unity'],
    '{"sentence":"The monads have no windows through which anything may enter or leave; every substance bears within itself the trace of all that happens in the cosmos.","source":"Monadology","author":"Gottfried Wilhelm Leibniz"}'::jsonb,
    ARRAY['Adorno observed that modern estranged individuals live like windowless {{c1::monad}}s, bumping against one another in urban anonymity.', 'In Leibniz''s metaphysics, every simple {{c1::monad}} acts as a living mirror of the infinite universe.'],
    '{"synonyms":["monad","atom","singularity"],"nuanceComparison":"Monad is an indivisible, metaphysical, perceptual unit of substance; atom is an indivisible physical particle of matter; singularity is a point of infinite density or unique convergence.","contextRecommendations":[{"word":"monad","recommendedRegister":"Metaphysical / Cultural Theory","exampleSentence":"Benjamin treated the historical work of art as a monad crystallizing the tensions of its era."},{"word":"atom","recommendedRegister":"Physical Science / Materialist","exampleSentence":"Democritus posited that nothing exists except atoms and the void."},{"word":"singularity","recommendedRegister":"Cosmological / Technological","exampleSentence":"The event horizon shields the gravitational singularity."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-15T10:00:00.000Z',
    0, 0, 0, 0, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 10: noumenon
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000000',
    'noumenon',
    'en',
    'noun',
    '/ˈnuː.mɪ.nɒn/',
    'The thing-in-itself (Ding an sich); an object or event as it exists independently of human sensory perception and cognitive mediation.',
    'Contrasted in Kant''s critical philosophy with phenomenon (the object as it appears to our faculties of space, time, and conceptual understanding). Plural: noumena.',
    '{"roots":[{"morpheme":"noein","meaning":"to think / perceive / understand","origin":"Greek"},{"morpheme":"nous","meaning":"mind / intellect","origin":"Greek"},{"morpheme":"-on","meaning":"passive participle neuter","origin":"Greek"}],"cognates":["noetic","paranoia","nous"]}'::jsonb,
    ARRAY['noumenal realm', 'noumenon and phenomenon', 'inaccessible noumenon', 'kantian noumenon'],
    '{"sentence":"We can cognize objects only as phenomena, while the noumenon remains an indispensable boundary concept marking the limits of reason.","source":"Critique of Pure Reason","author":"Immanuel Kant"}'::jsonb,
    ARRAY['Human senses grasp only sensory appearances, leaving the ultimate {{c1::noumenon}} forever shielded behind the veil of perception.', 'Schopenhauer daringly identified Kant''s mysterious {{c1::noumenon}} with the blind, striving metaphysical Will.'],
    '{"synonyms":["noumenon","phenomenon","essence"],"nuanceComparison":"Noumenon is reality in itself beyond any possible observation; phenomenon is reality as it appears mediated through sensory consciousness; essence is the intrinsic identifying nature of an entity.","contextRecommendations":[{"word":"noumenon","recommendedRegister":"Kantian / Epistemic","exampleSentence":"The noumenon serves as a reminder that empirical science measures representations, not ultimate reality."},{"word":"phenomenon","recommendedRegister":"Empirical / Scientific","exampleSentence":"The aurora borealis is an atmospheric phenomenon produced by solar radiation."},{"word":"essence","recommendedRegister":"Classical Ontological","exampleSentence":"Existentialism asserts that existence precedes essence."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-15T10:00:00.000Z',
    0, 0, 0, 0, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 11: ontology
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000000',
    'ontology',
    'en',
    'noun',
    '/ɒnˈtɒl.ə.dʒi/',
    'The branch of metaphysics dealing with the nature of being, existence, and the fundamental categories of reality.',
    'In twentieth-century Continental philosophy (Heidegger), ontology shifts from classifying what objects exist to interrogating the meaning of Being itself (Seinsfrage).',
    '{"roots":[{"morpheme":"ontos","meaning":"being / that which is (present participle of einai)","origin":"Greek"},{"morpheme":"-logia","meaning":"discourse / science / study","origin":"Greek"}],"cognates":["ontological","ontic"]}'::jsonb,
    ARRAY['fundamental ontology', 'ontological question', 'flat ontology', 'social ontology'],
    '{"sentence":"Ontology is possible only as phenomenology; the meaning of Being must be uncovered from within human situated existence.","source":"Being and Time","author":"Martin Heidegger"}'::jsonb,
    ARRAY['Digital technology demands a revised {{c1::ontology}} capable of classifying virtual objects that possess real economic force.', 'The philosopher warned against confusing ontic facts about physical things with the deep {{c1::ontology}} of Being itself.'],
    '{"synonyms":["ontology","epistemology","metaphysics"],"nuanceComparison":"Ontology inquires into what exists and the nature of being; epistemology inquires into how we know and the justification of belief; metaphysics is the overarching field encompassing ontology, cosmology, and first principles.","contextRecommendations":[{"word":"ontology","recommendedRegister":"Philosophical / Computational","exampleSentence":"Speculative realism proposes an object-oriented ontology where non-human things have autonomous agency."},{"word":"epistemology","recommendedRegister":"Theoretical / Critical","exampleSentence":"Feminist epistemology interrogates how patriarchal power structures knowledge."},{"word":"metaphysics","recommendedRegister":"Foundational Philosophical","exampleSentence":"Aristotle described metaphysics as first philosophy."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-16T12:00:00.000Z',
    0, 0, 0, 1, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 12: eschatology
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000000',
    'eschatology',
    'en',
    'noun',
    '/ˌes.kəˈtɒl.ə.dʒi/',
    'The branch of theology or philosophical theory concerned with the ultimate destiny of humanity, the end of history, death, and judgment.',
    'Extended in political philosophy (Walter Benjamin, Karl Löwith) to analyze secular ideologies like Marxism or technological transhumanism as disguised religious narratives of historical salvation.',
    '{"roots":[{"morpheme":"eschatos","meaning":"last / furthest / extreme","origin":"Greek"},{"morpheme":"-logia","meaning":"study / doctrine of","origin":"Greek"}],"cognates":["eschatological","eschaton"]}'::jsonb,
    ARRAY['secular eschatology', 'eschatological vision', 'political eschatology', 'realized eschatology'],
    '{"sentence":"Historical materialism incorporates a secret messianic eschatology, seeking to redeem past suffering in a climactic revolution.","source":"Theses on the Philosophy of History","author":"Walter Benjamin"}'::jsonb,
    ARRAY['Apocalyptic climate fiction borrows heavily from religious {{c1::eschatology}}, depicting ecological catastrophe as moral reckoning.', 'The revolutionary party framed its struggles within an unyielding historical {{c1::eschatology}}.'],
    '{"synonyms":["eschatology","teleology","apocalypse"],"nuanceComparison":"Eschatology focuses on the final consummation and ultimate end of history; teleology focuses on the purpose or design pulling things forward throughout their course; apocalypse refers specifically to the catastrophic unveiling of divine judgment.","contextRecommendations":[{"word":"eschatology","recommendedRegister":"Theological / Critical Theory","exampleSentence":"Nuclear deterrence generated a secular eschatology where humanity holds the power of total annihilation."},{"word":"teleology","recommendedRegister":"Philosophical / Biological","exampleSentence":"Progressivist history assumes a teleology toward greater human freedom."},{"word":"apocalypse","recommendedRegister":"Literary / Dramatic","exampleSentence":"The poem depicts the sudden apocalypse of the ancient city under volcanic ash."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-16T12:00:00.000Z',
    0, 0, 0, 1, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 13: demiurge
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000000',
    'demiurge',
    'en',
    'noun',
    '/ˈdem.i.ɜːdʒ/',
    'A subordinate artisan deity responsible for fashioning and maintaining the physical universe out of pre-existing chaotic matter.',
    'In Plato''s Timaeus, a benevolent craftsman; in Gnosticism, an inferior, blind, or malevolent entity who imprisons spiritual souls in a flawed material cosmos.',
    '{"roots":[{"morpheme":"demos","meaning":"people / common populace","origin":"Greek"},{"morpheme":"ergon","meaning":"work / deed","origin":"Greek"}],"cognates":["energy","synergy","democracy"]}'::jsonb,
    ARRAY['platonic demiurge', 'gnostic demiurge', 'malevolent demiurge', 'blind demiurge'],
    '{"sentence":"The Demiurge, being free from jealousy, desired that all things should come as near as possible to being like himself, ordering chaos into cosmos.","source":"Timaeus","author":"Plato"}'::jsonb,
    ARRAY['Gnostic sects held that the material universe was created not by the supreme transcendent God, but by an arrogant {{c1::demiurge}} named Yaldabaoth.', 'The modernist author viewed the novelist as a rival {{c1::demiurge}}, creating secondary fictional universes governed by their own laws.'],
    '{"synonyms":["demiurge","creator","artisan"],"nuanceComparison":"Demiurge specifies a secondary craftsman deity shaping material chaos (often flawed); creator implies the omnipotent author of existence ex nihilo; artisan is a skilled human craftsman working physical materials.","contextRecommendations":[{"word":"demiurge","recommendedRegister":"Mythological / Gnostic / Metaphysical","exampleSentence":"Borges often imagined history as the nightmare of an indifferent demiurge."},{"word":"creator","recommendedRegister":"Theological / General","exampleSentence":"Monotheism worships the single transcendent creator of heaven and earth."},{"word":"artisan","recommendedRegister":"Craft / Economic","exampleSentence":"The medieval cathedral was raised by generations of dedicated stone artisans."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-16T12:00:00.000Z',
    0, 0, 0, 1, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 14: antinomy
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000000',
    'antinomy',
    'en',
    'noun',
    '/ænˈtɪn.ə.mi/',
    'A contradiction between two beliefs, principles, or conclusions that each seem equally valid, necessary, or reasonable.',
    'Made famous in Kant''s Critique of Pure Reason (the Antinomies of Pure Reason), demonstrating that applying rational categories beyond sensory experience leads into insoluble contradictions (e.g., whether the world has a beginning or is infinite).',
    '{"roots":[{"morpheme":"anti-","meaning":"against / opposite","origin":"Greek"},{"morpheme":"nomos","meaning":"law / custom / order","origin":"Greek"}],"cognates":["autonomy","astronomy","anomie"]}'::jsonb,
    ARRAY['kantian antinomy', 'unresolved antinomy', 'antinomy of pure reason', 'face an antinomy'],
    '{"sentence":"Reason falls into antinomy whenever it ventures into cosmology, proving with equal rigor both the thesis and the antithesis.","source":"Critique of Pure Reason","author":"Immanuel Kant"}'::jsonb,
    ARRAY['Liberal democracy grapples with the fundamental {{c1::antinomy}} between absolute individual liberty and collective social security.', 'The fourth {{c1::antinomy}} examined whether an absolutely necessary being exists as part of the world or as its cause.'],
    '{"synonyms":["antinomy","paradox","contradiction"],"nuanceComparison":"Antinomy is a formal conflict between two equally provable laws or rational arguments; paradox is an assertion that seems self-contradictory yet contains truth; contradiction is a logical violation where two statements cannot both be true.","contextRecommendations":[{"word":"antinomy","recommendedRegister":"Kantian / Legal Philosophy","exampleSentence":"Legal theorists struggled to resolve the antinomy between constitutional rights and emergency powers."},{"word":"paradox","recommendedRegister":"Literary / Common Intellectual","exampleSentence":"The paradox of thrift shows that individual savings can reduce collective wealth."},{"word":"contradiction","recommendedRegister":"Formal Logic / Rhetoric","exampleSentence":"His sworn testimony contained a direct contradiction."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-16T12:00:00.000Z',
    0, 0, 0, 1, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 15: hypostasis
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000000',
    'hypostasis',
    'en',
    'noun',
    '/haɪˈpɒs.tə.sɪs/',
    'The underlying fundamental reality, substance, or individual personal reality of an entity beneath its outward manifestations.',
    'In Neoplatonism, the successive emanations of reality (the One, Nous, Soul); in Christian theology, the distinct persons of the Trinity; in linguistics/logic, reification of an abstract concept into a concrete thing.',
    '{"roots":[{"morpheme":"hypo-","meaning":"under / beneath","origin":"Greek"},{"morpheme":"stasis","meaning":"standing / posture / setting","origin":"Greek"}],"cognates":["static","status","ecstasy"]}'::jsonb,
    ARRAY['hypostatic union', 'neoplatonic hypostasis', 'hypostasis of Being', 'treat as a hypostasis'],
    '{"sentence":"Plotinus conceived reality as an eternal cascade of three divine hypostases: the One, the Divine Mind, and the World Soul.","source":"The Enneads","author":"Plotinus"}'::jsonb,
    ARRAY['The council affirmed the doctrine of the hypostatic union, joining divine and human natures in a single {{c1::hypostasis}}.', 'Critics warned that reifying "the Market" into an active entity commits the fallacy of turning a metaphor into a {{c1::hypostasis}}.'],
    '{"synonyms":["hypostasis","substance","reification"],"nuanceComparison":"Hypostasis emphasizes the underlying concrete personal reality or metaphysical subsistence; substance refers to the enduring philosophical substratum bearing properties; reification is the logical fallacy of making an abstraction concrete.","contextRecommendations":[{"word":"hypostasis","recommendedRegister":"Theological / Neoplatonic","exampleSentence":"In Levinas''s early thought, hypostasis represents the emergence of an autonomous existent from anonymous Being."},{"word":"substance","recommendedRegister":"Aristotelian / Spinozan","exampleSentence":"Spinoza famously posited that there exists only one infinite substance, which is Nature or God."},{"word":"reification","recommendedRegister":"Critical Theory / Marxist","exampleSentence":"Lukács analyzed how reification turns human relations into relations between things."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-16T12:00:00.000Z',
    0, 0, 0, 1, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 16: immanence
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000016',
    '00000000-0000-0000-0000-000000000000',
    'immanence',
    'en',
    'noun',
    '/ˈɪm.ə.nəns/',
    'The condition of operating or existing entirely within the boundaries of the material world or human experience; indwelling.',
    'Opposed to transcendence; championed by Baruch Spinoza ("Deus sive Natura") and Gilles Deleuze ("plane of immanence") to reject hierarchical, supernatural, or transcendent authorities outside the world.',
    '{"roots":[{"morpheme":"in-","meaning":"in / within / into","origin":"Latin"},{"morpheme":"manere","meaning":"to remain / dwell / stay","origin":"Latin"},{"morpheme":"-ence","meaning":"state / quality of","origin":"Latin"}],"cognates":["permanent","remain","mansion"]}'::jsonb,
    ARRAY['plane of immanence', 'radical immanence', 'divine immanence', 'immanent critique'],
    '{"sentence":"Spinoza constructed an absolute plane of immanence where God does not rule the world from beyond, but is the infinite substance of the world itself.","source":"Spinoza: Practical Philosophy","author":"Gilles Deleuze"}'::jsonb,
    ARRAY['Modern secular literature often replaces theological transcendence with the poetic sacredness of earthly {{c1::immanence}}.', 'Adorno practiced {{c1::immanence}} in his critiques, judging ideologies against their own internal claims rather than imposing external dogmas.'],
    '{"synonyms":["immanence","transcendence","pantheism"],"nuanceComparison":"Immanence asserts that truth, divinity, or causality dwells wholly within the physical/experiential order; transcendence places the sacred or foundational principle beyond the world; pantheism is a theological doctrine equating God with the cosmos.","contextRecommendations":[{"word":"immanence","recommendedRegister":"Continental Philosophy / Theology","exampleSentence":"Deleuze described philosophy as the creation of concepts upon an open plane of immanence."},{"word":"transcendence","recommendedRegister":"Religious / Existential","exampleSentence":"Kierkegaard spoke of the absolute transcendence of the Divine across an infinite qualitative abyss."},{"word":"pantheism","recommendedRegister":"Theological / Historical","exampleSentence":"Romantic poets were often accused of a pantheism that worshiped mountains and rivers."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000016',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-16T12:00:00.000Z',
    0, 0, 0, 1, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 17: transcendence
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000000',
    'transcendence',
    'en',
    'noun',
    '/trænˈsen.dəns/',
    'Existence or experience beyond the physical, normal, or material level; surpassing empirical limitations.',
    'In traditional theology, God''s otherness beyond creation; in Kant, transcendent means illegitimately exceeding the bounds of possible experience (contrasted with transcendental, which investigates the necessary conditions of experience).',
    '{"roots":[{"morpheme":"trans-","meaning":"across / beyond / over","origin":"Latin"},{"morpheme":"scandere","meaning":"to climb / mount","origin":"Latin"},{"morpheme":"-ence","meaning":"state / condition of","origin":"Latin"}],"cognates":["transcend","transcendental","ascend","scale"]}'::jsonb,
    ARRAY['radical transcendence', 'longing for transcendence', 'divine transcendence', 'transcendence of the ego'],
    '{"sentence":"The human condition is defined by the tension between bodily immanence in nature and the restless yearning for spiritual transcendence.","source":"The Second Sex","author":"Simone de Beauvoir"}'::jsonb,
    ARRAY['In his late sonnets, the poet struggled to find images adequate to convey mystical {{c1::transcendence}}.', 'Sartre argued that consciousness is pure {{c1::transcendence}}, continuously projecting itself beyond its present circumstances toward a future.'],
    '{"synonyms":["transcendence","immanence","sublimity"],"nuanceComparison":"Transcendence describes existing beyond and above worldly bounds; immanence describes indwelling within the world; sublimity describes the aesthetic experience of vastness evoking awe and terror.","contextRecommendations":[{"word":"transcendence","recommendedRegister":"Theological / Metaphysical","exampleSentence":"Karl Jaspers reflected on how boundary situations awaken awareness of transcendence."},{"word":"immanence","recommendedRegister":"Spinozan / Materialist","exampleSentence":"Materialism affirms the self-sufficiency of nature''s immanence."},{"word":"sublimity","recommendedRegister":"Aesthetic / Literary","exampleSentence":"The storm at sea possessed an awful sublimity that silenced the crew."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-16T12:00:00.000Z',
    0, 0, 0, 1, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 18: dialectic
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000018',
    '00000000-0000-0000-0000-000000000000',
    'dialectic',
    'en',
    'noun',
    '/ˌdaɪ.əˈlek.tɪk/',
    'A method of philosophical inquiry and historical development through the clash, contradiction, and reconciliation of opposing forces or ideas.',
    'Evolved from Socratic dialogue (refutation) to Hegelian synthesis (Aufhebung: sublation preserving and overcoming contradiction) and Marxist historical materialism (class struggle driving historical transitions).',
    '{"roots":[{"morpheme":"dia-","meaning":"through / across / between","origin":"Greek"},{"morpheme":"legein","meaning":"to speak / converse","origin":"Greek"},{"morpheme":"-tikos","meaning":"pertaining to / art of","origin":"Greek"}],"cognates":["dialogue","lexicon","dialectical"]}'::jsonb,
    ARRAY['hegelian dialectic', 'dialectical materialism', 'master-slave dialectic', 'negative dialectics'],
    '{"sentence":"Contradiction is the root of all movement and life; only insofar as something has a contradiction within it does it possess a dialectic.","source":"Science of Logic","author":"G.W.F. Hegel"}'::jsonb,
    ARRAY['In the famous master-slave {{c1::dialectic}}, Hegel demonstrates that the master remains dependent upon the slave for recognition.', 'Adorno proposed a "negative {{c1::dialectic}}" that refuses false utopian reconciliation, preserving irreducible contradictions.'],
    '{"synonyms":["dialectic","dialogue","dualism"],"nuanceComparison":"Dialectic is the dynamic process where opposing ideas clash to yield higher development; dialogue is conversation between parties seeking understanding; dualism is static division of reality into two irreconcilable principles (mind/body).","contextRecommendations":[{"word":"dialectic","recommendedRegister":"Hegelian / Marxist / Critical Theory","exampleSentence":"The historical dialectic between capital and labor accelerated technological automation."},{"word":"dialogue","recommendedRegister":"Civic / Humanistic","exampleSentence":"Diplomats worked to establish meaningful dialogue between the warring factions."},{"word":"dualism","recommendedRegister":"Cartesian / Ontological","exampleSentence":"Cartesian dualism struggles to explain how immaterial mind interacts with physical brain."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000018',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-16T12:00:00.000Z',
    0, 0, 0, 1, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 19: noetic
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000000',
    'noetic',
    'en',
    'adjective',
    '/noʊˈet.ɪk/',
    'Pertaining to the intellect, pure mental contemplation, or direct intellectual intuition of metaphysical truth.',
    'From Greek nous; denotes cognition that operates through direct intellectual grasping rather than discursive sensory observation. Prominent in Husserlian phenomenology (noetic-noematic correlation).',
    '{"roots":[{"morpheme":"noein","meaning":"to think / perceive / understand","origin":"Greek"},{"morpheme":"nous","meaning":"intellect / mind","origin":"Greek"},{"morpheme":"-tic","meaning":"pertaining to","origin":"Greek"}],"cognates":["noumenon","paranoia","noosphere"]}'::jsonb,
    ARRAY['noetic quality', 'noetic structure', 'noetic grasp', 'noetic experience'],
    '{"sentence":"Mystical states of consciousness carry a profound noetic quality, presenting themselves as authoritative states of illumination and insight.","source":"The Varieties of Religious Experience","author":"William James"}'::jsonb,
    ARRAY['Husserl investigated the {{c1::noetic}} act of consciousness alongside the noematic object toward which it is intentionally directed.', 'Beyond sensory proof, the mathematician experienced a moment of pure {{c1::noetic}} certainty upon discovering the proof.'],
    '{"synonyms":["noetic","discursive","empirical"],"nuanceComparison":"Noetic pertains to direct, intuitive intellectual insight; discursive involves step-by-step sequential reasoning; empirical relies upon sensory observation and experimental evidence.","contextRecommendations":[{"word":"noetic","recommendedRegister":"Phenomenological / Epistemic","exampleSentence":"The contemplative traditions cultivate noetic awareness unobstructed by wandering chatter."},{"word":"discursive","recommendedRegister":"Philosophical / Rhetorical","exampleSentence":"He reached his conclusion through rigorous discursive logic."},{"word":"empirical","recommendedRegister":"Scientific / Observational","exampleSentence":"The hypothesis lacked supportive empirical data from laboratory trials."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-16T12:00:00.000Z',
    0, 0, 0, 1, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 20: aletheia
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000000',
    'aletheia',
    'en',
    'noun',
    '/ˌæl.əˈθiː.ə/',
    'Truth conceptualized as unconcealment, disclosure, or the unveiling of reality from hiddenness, rather than mere propositional correctness.',
    'Recovered by Martin Heidegger from pre-Socratic Greek thought (a- [un-] + lethe [forgetfulness/concealment]); asserts that before a statement can be logically "true" (veritas), reality must first open up and disclose itself in experience.',
    '{"roots":[{"morpheme":"a-","meaning":"privative / un- / without","origin":"Greek"},{"morpheme":"lethe","meaning":"forgetfulness / oblivion / hiddenness","origin":"Greek"}],"cognates":["lethargy","lethal","Lethe"]}'::jsonb,
    ARRAY['truth as aletheia', 'event of aletheia', 'primordial aletheia', 'unconcealment of aletheia'],
    '{"sentence":"To the early Greeks, truth was not the correspondence of an idea to an object, but aletheia: the event whereby being wrests itself from concealment.","source":"The Origin of the Work of Art","author":"Martin Heidegger"}'::jsonb,
    ARRAY['In a great work of art, a world opens up and an event of {{c1::aletheia}} occurs, revealing things as they truly are.', 'Heidegger argued that Western philosophy forgot {{c1::aletheia}} when it reduced truth to bureaucratic correctness and verification.'],
    '{"synonyms":["aletheia","veracity","revelation"],"nuanceComparison":"Aletheia is the existential unconcealment and poetic disclosure of Being; veracity is the factual truthfulness or accuracy of a statement; revelation is the supernatural communication of divine mystery.","contextRecommendations":[{"word":"aletheia","recommendedRegister":"Heideggerian / Hermeneutic","exampleSentence":"Poetry serves as the vessel for aletheia, unveiling dimensions obscured by scientific jargon."},{"word":"veracity","recommendedRegister":"Forensic / Everyday Scholarly","exampleSentence":"The defense attorney questioned the veracity of the witness''s recollection."},{"word":"revelation","recommendedRegister":"Theological / Prophetic","exampleSentence":"Scripture records the divine revelation given on Mount Sinai."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-16T12:00:00.000Z',
    0, 0, 0, 1, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 21: simulacrum
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000000',
    'simulacrum',
    'en',
    'noun',
    '/ˌsɪm.jʊˈleɪ.krəm/',
    'A representation, image, or sign that has no reference to any underlying reality; a copy where the original never existed.',
    'Baudrillard articulated four phases of the image: from reflecting reality to masking reality, masking the absence of reality, and finally bearing no relation to reality whatsoever (pure simulacrum). Plural: simulacra.',
    '{"roots":[{"morpheme":"simulare","meaning":"to imitate / copy / feign","origin":"Latin"},{"morpheme":"-crum","meaning":"instrument / means of","origin":"Latin"}],"cognates":["simulate","simulation","dissimulate"]}'::jsonb,
    ARRAY['mere simulacrum', 'order of simulacra', 'postmodern simulacrum', 'empty simulacrum'],
    '{"sentence":"The simulacrum is never what conceals the truth—it is truth that conceals that there is none. The simulacrum is true.","source":"Simulacra and Simulation","author":"Jean Baudrillard"}'::jsonb,
    ARRAY['Disneyland is presented as imaginary in order to make us believe that the surrounding America is real, whereas all of Los Angeles is of the order of the {{c1::simulacrum}}.', 'In digital consumer culture, the commodity is often a {{c1::simulacrum}} whose advertising campaign precedes any physical manufacture.'],
    '{"synonyms":["simulacrum","facsimile","illusion"],"nuanceComparison":"Simulacrum denotes an image or copy detached from an original, replacing reality itself; facsimile is an exact, faithful reproduction of an existing document or object; illusion is a deceptive sensory impression.","contextRecommendations":[{"word":"simulacrum","recommendedRegister":"Postmodern / Critical Theory","exampleSentence":"The theme park offers a sanitized simulacrum of nineteenth-century Main Street."},{"word":"facsimile","recommendedRegister":"Bibliographical / Archival","exampleSentence":"The library displayed an expensive facsimile of the Gutenberg Bible."},{"word":"illusion","recommendedRegister":"General / Psychological","exampleSentence":"The optical illusion made the parallel lines appear curved."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-17T12:00:00.000Z',
    0, 0, 0, 2, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 22: interpellation
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000000',
    'interpellation',
    'en',
    'noun',
    '/ɪnˌtɜː.pəˈleɪ.ʃən/',
    'The ideological process by which individuals are addressed, recognized, and constituted as social subjects.',
    'Formulated by Louis Althusser; illustrated by a police officer calling "Hey, you there!" on the street. Turning around in response signifies the individual recognizing themselves as the subject of the state''s ideological apparatus.',
    '{"roots":[{"morpheme":"inter-","meaning":"between / among","origin":"Latin"},{"morpheme":"pellere","meaning":"to drive / push / hail","origin":"Latin"},{"morpheme":"-tion","meaning":"action / process of","origin":"Latin"}],"cognates":["appeal","pulse","repel","compel"]}'::jsonb,
    ARRAY['ideological interpellation', 'mechanism of interpellation', 'interpellation of subjects', 'resist interpellation'],
    '{"sentence":"Ideology interpellates individuals as subjects; by that very hail, the individual is transformed into a subject accountable to the law.","source":"Ideology and Ideological State Apparatuses","author":"Louis Althusser"}'::jsonb,
    ARRAY['Consumer advertising operates via subtle {{c1::interpellation}}, hailing the viewer as a discerning, autonomous connoisseur.', 'The school and the church function as apparatuses of {{c1::interpellation}}, shaping identity long before political consciousness develops.'],
    '{"synonyms":["interpellation","socialization","indoctrination"],"nuanceComparison":"Interpellation is the constitutive moment where ideology summons identity into being; socialization is the gradual sociological habituation into norms; indoctrination is the explicit, forceful inculcation of doctrine.","contextRecommendations":[{"word":"interpellation","recommendedRegister":"Althusserian / Marxist Theory","exampleSentence":"Through ideological interpellation, citizens gladly adopt the state''s demands as their personal moral duties."},{"word":"socialization","recommendedRegister":"Sociological / Developmental","exampleSentence":"Family dinners provide vital primary socialization for young children."},{"word":"indoctrination","recommendedRegister":"Political / Polemical","exampleSentence":"The totalitarian regime replaced classical history with political indoctrination."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-17T12:00:00.000Z',
    0, 0, 0, 2, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 23: hegemony
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000023',
    '00000000-0000-0000-0000-000000000000',
    'hegemony',
    'en',
    'noun',
    '/hɪˈɡem.ə.ni/',
    'Political, social, cultural, or ideological predominance exercised by a ruling class over civil society through moral consent rather than overt violence.',
    'In Antonio Gramsci''s Prison Notebooks, cultural hegemony explains why subaltern classes accept capitalist exploitation: the ruling class naturalizes its worldview through schools, media, and churches as universal "common sense."',
    '{"roots":[{"morpheme":"hegemon","meaning":"leader / ruler / guide","origin":"Greek"},{"morpheme":"hegeisthai","meaning":"to lead / command","origin":"Greek"},{"morpheme":"-y","meaning":"state / condition of","origin":"Greek"}],"cognates":["hegemonic","exegesis"]}'::jsonb,
    ARRAY['cultural hegemony', 'hegemonic discourse', 'challenge the hegemony', 'counter-hegemonic struggle'],
    '{"sentence":"A social group can, and indeed must, exercise leadership before winning governmental power: it exercises hegemony through civil society.","source":"Selections from the Prison Notebooks","author":"Antonio Gramsci"}'::jsonb,
    ARRAY['The university became the primary battlefield for establishing a new intellectual {{c1::hegemony}} over democratic institutions.', 'Rather than relying on military rule, the empire sustained its global {{c1::hegemony}} through financial architecture and cultural export.'],
    '{"synonyms":["hegemony","domination","ascendancy"],"nuanceComparison":"Hegemony implies leadership won through manufactured cultural consent and institutions; domination relies upon coercive physical force and direct policing; ascendancy is temporary or rising superiority in status.","contextRecommendations":[{"word":"hegemony","recommendedRegister":"Gramscian / Geopolitical","exampleSentence":"Subcultural movements often formulate counter-hegemony to resist corporate consumerism."},{"word":"domination","recommendedRegister":"Political / Legal","exampleSentence":"Colonial domination was maintained by military garrisons and discriminatory law."},{"word":"ascendancy","recommendedRegister":"Historical / General","exampleSentence":"The party gained political ascendancy after the sudden collapse of its rival."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000023',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-17T12:00:00.000Z',
    0, 0, 0, 2, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 24: panopticon
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000024',
    '00000000-0000-0000-0000-000000000000',
    'panopticon',
    'en',
    'noun',
    '/pænˈɒp.tɪ.kən/',
    'An architectural design for a circular prison with an inspection tower at the center, inducing in inmates a permanent state of visible, internalized self-surveillance.',
    'Designed by Jeremy Bentham and conceptualized by Michel Foucault in Discipline and Punish as the architectural diagram of modern disciplinary power, where external coercion is internalized by the subject.',
    '{"roots":[{"morpheme":"pan","meaning":"all / every","origin":"Greek"},{"morpheme":"optikos","meaning":"pertaining to sight / vision","origin":"Greek"}],"cognates":["optics","panorama","panacea"]}'::jsonb,
    ARRAY['digital panopticon', 'panoptic gaze', 'panoptic surveillance', 'internalize the panopticon'],
    '{"sentence":"The major effect of the Panopticon was to induce in the inmate a state of conscious and permanent visibility that assures the automatic functioning of power.","source":"Discipline and Punish: The Birth of the Prison","author":"Michel Foucault"}'::jsonb,
    ARRAY['Smartphones and constant geolocation tracking turn contemporary society into an invisible, portable {{c1::panopticon}}.', 'In Bentham''s {{c1::panopticon}}, the prisoner never knows when the inspector is looking, so must behave as if constantly observed.'],
    '{"synonyms":["panopticon","surveillance","chaperone"],"nuanceComparison":"Panopticon refers to the systematic architectural/structural apparatus that induces internalized self-policing through asymmetrical visibility; surveillance is the empirical act of monitoring; chaperone is human custodial supervision.","contextRecommendations":[{"word":"panopticon","recommendedRegister":"Foucaultian / Sociological","exampleSentence":"Open-plan offices replicate the panopticon, enforcing productivity through peer visibility."},{"word":"surveillance","recommendedRegister":"Technical / Legal","exampleSentence":"CCTV cameras provide extensive urban surveillance."},{"word":"chaperone","recommendedRegister":"Social / Domestic","exampleSentence":"The students toured the museum under the watch of their faculty chaperone."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000024',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-17T12:00:00.000Z',
    0, 0, 0, 2, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 25: hauntology
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000025',
    '00000000-0000-0000-0000-000000000000',
    'hauntology',
    'en',
    'noun',
    '/hɔːnˈtɒl.ə.dʒi/',
    'The persistent, spectral return of elements from the cultural or political past, or the mourning of lost futures that never came to pass.',
    'Coined by Jacques Derrida in Specters of Marx (punning in French on ontology and fantôme) and popularized by cultural critic Mark Fisher to describe the stagnation of 21st-century culture, haunted by the unfulfilled promises of modernist utopia.',
    '{"roots":[{"morpheme":"hanter","meaning":"to haunt / frequent","origin":"French"},{"morpheme":"-logia","meaning":"discourse / study of","origin":"Greek"}],"cognates":["haunt","ontology"]}'::jsonb,
    ARRAY['cultural hauntology', 'lost futures of hauntology', 'spectral hauntology', 'aesthetic of hauntology'],
    '{"sentence":"Hauntology is not merely about the past refusing to die; it is the melancholic acknowledgment of lost futures that failed to happen.","source":"Ghosts of My Life","author":"Mark Fisher"}'::jsonb,
    ARRAY['The electronic music genre hypnagogic pop is steeped in {{c1::hauntology}}, sampling warped cassette tapes from childhoods past.', 'Derrida insisted that Marx''s ghost continues to disturb neoliberal capitalism through an inescapable {{c1::hauntology}}.'],
    '{"synonyms":["hauntology","nostalgia","anachronism"],"nuanceComparison":"Hauntology is the philosophical mourning of unrealized alternative futures that haunt present consciousness; nostalgia is sentimental longing for a romanticized past; anachronism is a chronological inconsistency or out-of-date element.","contextRecommendations":[{"word":"hauntology","recommendedRegister":"Critical Theory / Cultural Criticism","exampleSentence":"Brutalist architecture now radiates a peculiar hauntology, carrying the memory of egalitarian postwar futures."},{"word":"nostalgia","recommendedRegister":"Affective / Commercial","exampleSentence":"Advertisers exploit vintage retro fonts to trigger consumer nostalgia."},{"word":"anachronism","recommendedRegister":"Historical / Literary","exampleSentence":"A mechanical clock striking in ancient Rome is a famous Shakespearean anachronism."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000025',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-17T12:00:00.000Z',
    0, 0, 0, 2, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 26: bricolage
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000026',
    '00000000-0000-0000-0000-000000000000',
    'bricolage',
    'en',
    'noun',
    '/ˌbriː.kəˈlɑːʒ/',
    'Creation or construction of a cultural work, theory, or structure using whatever diverse tools, signs, and fragments happen to be readily available.',
    'Contrasted by Claude Lévi-Strauss (The Savage Mind) with the engineer: the engineer creates specialized tools for a predefined plan, while the bricoleur works with the contingent "ruins" and heterogeneous leftovers of culture.',
    '{"roots":[{"morpheme":"bricoler","meaning":"to do odd jobs / putter about / bounce off","origin":"French"},{"morpheme":"-age","meaning":"act / product of","origin":"French"}],"cognates":["bricoleur"]}'::jsonb,
    ARRAY['intellectual bricolage', 'cultural bricolage', 'technique of bricolage', 'methodological bricolage'],
    '{"sentence":"The bricoleur is adept at performing a large number of diverse tasks; but, unlike the engineer, he does not subordinate each of them to the availability of raw materials conceived for the purpose.","source":"The Savage Mind","author":"Claude Lévi-Strauss"}'::jsonb,
    ARRAY['Subcultural fashion represents an act of rebellious {{c1::bricolage}}, re-appropriating safety pins and workboots into semiotic weapons.', 'Derrida argued that all human discourse is a form of {{c1::bricolage}}, borrowing old philosophical terms to critique the very metaphysics they created.'],
    '{"synonyms":["bricolage","improvisation","pastiche"],"nuanceComparison":"Bricolage is the structural assembly of new forms from heterogeneous leftover materials; improvisation is spontaneous performance without rehearsal; pastiche is an artistic work imitating the style of another.","contextRecommendations":[{"word":"bricolage","recommendedRegister":"Anthropological / Cultural Theory","exampleSentence":"The installation artist utilized urban salvage to create an evocative sculptural bricolage."},{"word":"improvisation","recommendedRegister":"Musical / Theatrical","exampleSentence":"The jazz quartet captivated the club with forty minutes of pure improvisation."},{"word":"pastiche","recommendedRegister":"Literary / Film Studies","exampleSentence":"The movie was an affectionate pastiche of 1940s film noir."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000026',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-17T12:00:00.000Z',
    0, 0, 0, 2, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 27: parrhesia
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000027',
    '00000000-0000-0000-0000-000000000000',
    'parrhesia',
    'en',
    'noun',
    '/pəˈriː.zi.ə/',
    'The classical practice of speaking truth candidly and fearlessly to power, in the face of grave personal or political risk.',
    'Examines by Michel Foucault in his late lectures on the government of self and others. A parrhesiastes does not use rhetorical dissimulation or flattery; their speech requires courage because the speaker is in a position of vulnerability relative to the sovereign.',
    '{"roots":[{"morpheme":"pan","meaning":"all / everything","origin":"Greek"},{"morpheme":"rhesis","meaning":"speech / saying","origin":"Greek"}],"cognates":["rhetoric"]}'::jsonb,
    ARRAY['act of parrhesia', 'courageous parrhesia', 'practice parrhesia', 'parrhesiastic contract'],
    '{"sentence":"Parrhesia is a verbal activity in which a speaker expresses his personal relationship to truth and risks his life because he recognizes truth-telling as a duty.","source":"Fearless Speech","author":"Michel Foucault"}'::jsonb,
    ARRAY['The exiled journalist engaged in noble {{c1::parrhesia}}, publishing the regime''s secret treaties despite facing assassination.', 'Socrates defended himself before the Athenian jury not with servile tears, but with unsparing {{c1::parrhesia}}.'],
    '{"synonyms":["parrhesia","candor","insolence"],"nuanceComparison":"Parrhesia is ethical truth-telling directed against powerful authority at personal hazard; candor is general frankness and openness of character; insolence is disrespectful or impertinent behavior.","contextRecommendations":[{"word":"parrhesia","recommendedRegister":"Classical / Political Philosophy","exampleSentence":"The dissident intellectual saw parrhesia as the last remaining duty in a corrupt republic."},{"word":"candor","recommendedRegister":"Civic / Personal","exampleSentence":"I appreciate your candor regarding the team''s financial deficits."},{"word":"insolence","recommendedRegister":"Hierarchical / Disciplinary","exampleSentence":"The officer punished the private for blatant insolence."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000027',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-17T12:00:00.000Z',
    0, 0, 0, 2, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 28: deterritorialization
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000028',
    '00000000-0000-0000-0000-000000000000',
    'deterritorialization',
    'en',
    'noun',
    '/diːˌter.ɪ.tɔː.ri.ə.laɪˈzeɪ.ʃən/',
    'The process by which an established territory, identity, social code, or sign system is unmoored, disrupted, and decoded.',
    'Formulated by Gilles Deleuze and Félix Guattari in Anti-Oedipus and A Thousand Plateaus; closely paired with reterritorialization. Capital deterritorializes traditional agrarian ways of life only to reterritorialize them within commodity consumption.',
    '{"roots":[{"morpheme":"de-","meaning":"undo / reverse / off","origin":"Latin"},{"morpheme":"territorium","meaning":"land / territory","origin":"Latin"},{"morpheme":"-ize","meaning":"to cause to become","origin":"Greek"},{"morpheme":"-tion","meaning":"state / process of","origin":"Latin"}],"cognates":["territory","reterritorialization"]}'::jsonb,
    ARRAY['lines of deterritorialization', 'absolute deterritorialization', 'deterritorialization of language', 'flows of deterritorialization'],
    '{"sentence":"Capitalism is a monstrous machine that decodes and deterritorializes all ancestral social codes, converting sacred relations into market flows.","source":"Anti-Oedipus","author":"Gilles Deleuze and Félix Guattari"}'::jsonb,
    ARRAY['Kafka''s writing operates as a minor literature through the deliberate {{c1::deterritorialization}} of the German language within Prague.', 'Global logistics networks cause the rapid {{c1::deterritorialization}} of local craft traditions.'],
    '{"synonyms":["deterritorialization","displacement","dislocation"],"nuanceComparison":"Deterritorialization specifically describes the ontological or semiotic unmooring of codes and flows from fixed hierarchies; displacement refers to physical or social removal; dislocation implies jarring rupture of continuous order.","contextRecommendations":[{"word":"deterritorialization","recommendedRegister":"Deleuzian / Cultural Geography","exampleSentence":"Digital nomadism embodies the deterritorialization of professional labor from physical geography."},{"word":"displacement","recommendedRegister":"Humanitarian / Political","exampleSentence":"The flood led to the displacement of tens of thousands of coastal villagers."},{"word":"dislocation","recommendedRegister":"Economic / Structural","exampleSentence":"Factory closures caused massive dislocation in manufacturing communities."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000028',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-17T12:00:00.000Z',
    0, 0, 0, 2, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 29: rhizome
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000029',
    '00000000-0000-0000-0000-000000000000',
    'rhizome',
    'en',
    'noun',
    '/ˈraɪ.zoʊm/',
    'A non-hierarchical, horizontal, open-ended network structure that has no central root or origin and can connect any point to any other point.',
    'Used by Deleuze and Guattari as an epistemic model to challenge Western "arborescent" (tree-like, vertical, hierarchical) thinking; characterized by principles of connection, heterogeneity, multiplicity, and asignifying rupture.',
    '{"roots":[{"morpheme":"rhizoma","meaning":"mass of roots","origin":"Greek"},{"morpheme":"rhiza","meaning":"root","origin":"Greek"}],"cognates":["rhizomatic"]}'::jsonb,
    ARRAY['rhizomatic network', 'principles of the rhizome', 'operate as a rhizome', 'rhizomatic structure'],
    '{"sentence":"A rhizome has no beginning or end; it is always in the middle, between things, interbeing, intermezzo.","source":"A Thousand Plateaus","author":"Gilles Deleuze and Félix Guattari"}'::jsonb,
    ARRAY['The early World Wide Web was celebrated as the ultimate technical realization of a decentralized {{c1::rhizome}}.', 'Unlike the arborescent genealogy of dynastic kings, revolutionary solidarity spreads underground like an unpredictable {{c1::rhizome}}.'],
    '{"synonyms":["rhizome","hierarchy","network"],"nuanceComparison":"Rhizome is a radically non-hierarchical, acentered, proliferating subterranean network; hierarchy is vertically ordered with an authoritative apex; network is any generic interconnected system.","contextRecommendations":[{"word":"rhizome","recommendedRegister":"Deleuzian / Media Theory","exampleSentence":"The open-source community functions as a rhizome, spawning spontaneous collaborations across continents."},{"word":"hierarchy","recommendedRegister":"Organizational / Corporate","exampleSentence":"Military command relies on strict chain-of-command hierarchy."},{"word":"network","recommendedRegister":"Technical / Sociological","exampleSentence":"Railway networks revolutionized overland trade during the nineteenth century."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000029',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-17T12:00:00.000Z',
    0, 0, 0, 2, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 30: biopolitics
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000030',
    '00000000-0000-0000-0000-000000000000',
    'biopolitics',
    'en',
    'noun',
    '/ˌbaɪ.oʊ.pəˈlɪt.ɪks/',
    'The modern techniques, administrative rationalities, and regulatory mechanisms by which political power manages, calculates, and governs human biological life and populations.',
    'Contrasted by Foucault with sovereign power: while the feudal sovereign held the right to "take life and let live," modern biopolitics governs to "make live and let die" through birth rates, public health, sanitation, epidemiology, and demographics.',
    '{"roots":[{"morpheme":"bios","meaning":"life / course of life","origin":"Greek"},{"morpheme":"politikos","meaning":"civic / of a citizen","origin":"Greek"}],"cognates":["biology","politics","biopower"]}'::jsonb,
    ARRAY['era of biopolitics', 'biopolitical control', 'biopolitical regime', 'apparatus of biopolitics'],
    '{"sentence":"For the first time in history, no doubt, biological existence was reflected in political existence; the fact of living was no longer an inaccessible substrate.","source":"The History of Sexuality, Vol. 1","author":"Michel Foucault"}'::jsonb,
    ARRAY['Quarantine mandates and algorithmic contact tracing exemplify modern {{c1::biopolitics}} in a public health crisis.', 'Agamben argued that the concentration camp represents the ultimate nightmare of modern {{c1::biopolitics}}.'],
    '{"synonyms":["biopolitics","governance","eugenics"],"nuanceComparison":"Biopolitics is the management of the biological life processes of an entire population by the state; governance is the general exercise of regulatory administration; eugenics is an explicit ideology of selective genetic breeding.","contextRecommendations":[{"word":"biopolitics","recommendedRegister":"Foucaultian / Critical Theory","exampleSentence":"Vaccine distribution strategies reveal the underlying biopolitics that determines whose health is prioritized."},{"word":"governance","recommendedRegister":"Institutional / Civic","exampleSentence":"Good governance demands institutional transparency and regular audits."},{"word":"eugenics","recommendedRegister":"Historical / Bioethical","exampleSentence":"Early twentieth-century eugenics produced catastrophic forced sterilization laws."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000030',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-17T12:00:00.000Z',
    0, 0, 0, 2, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 31: habitus
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000031',
    '00000000-0000-0000-0000-000000000000',
    'habitus',
    'en',
    'noun',
    '/ˈhæb.ɪ.təs/',
    'A system of durable, internalized dispositions, bodily mannerisms, and intuitive inclinations shaped by one''s social environment and class position.',
    'Developed by sociologist Pierre Bourdieu (Distinction, The Logic of Practice) to transcend the divide between structural determinism and individual free will: habitus acts as "structured structures predisposed to function as structuring structures."',
    '{"roots":[{"morpheme":"habitus","meaning":"condition / appearance / character / dress","origin":"Latin"},{"morpheme":"habere","meaning":"to have / hold","origin":"Latin"}],"cognates":["habit","inhabit","ability"]}'::jsonb,
    ARRAY['bourdieu habitus', 'class habitus', 'embodied habitus', 'shaped by habitus'],
    '{"sentence":"The habitus, a product of history, produces individual and collective practices—more history—in accordance with the schemes generated by history.","source":"The Logic of Practice","author":"Pierre Bourdieu"}'::jsonb,
    ARRAY['The aristocratic accent, posture, and instinctive taste of the diplomat were the unconscious reflections of his elite {{c1::habitus}}.', 'First-generation university students often experience a disorienting clash between their familial background and the institutional academic {{c1::habitus}}.'],
    '{"synonyms":["habitus","custom","disposition"],"nuanceComparison":"Habitus denotes the deeply ingrained, embodied class-based cognitive and physical matrix generating intuitive behavior; custom is an explicit cultural practice; disposition is an individual psychological tendency.","contextRecommendations":[{"word":"habitus","recommendedRegister":"Sociological / Bourdieusian","exampleSentence":"Taste in art and wine is not an innate gift but an index of acquired cultural habitus."},{"word":"custom","recommendedRegister":"Anthropological / Traditional","exampleSentence":"It was the local custom to offer tea to strangers arriving at sunset."},{"word":"disposition","recommendedRegister":"Psychological / General","exampleSentence":"She possessed a cheerful and accommodating disposition."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000031',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-18T12:00:00.000Z',
    0, 0, 0, 3, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 32: reification
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000032',
    '00000000-0000-0000-0000-000000000000',
    'reification',
    'en',
    'noun',
    '/ˌreɪ.ɪ.fɪˈkeɪ.ʃən/',
    'The cognitive or social process of treating an abstract concept, relation, or human quality as if it were a concrete, independent physical thing or commodity.',
    'Georg Lukács (History and Class Consciousness) applied Marx''s commodity fetishism to show that under advanced capitalism, human relationships, intellectual life, and time itself undergo reification (Verdinglichung), appearing as alien laws of nature.',
    '{"roots":[{"morpheme":"res","meaning":"thing / matter / affair","origin":"Latin"},{"morpheme":"facere","meaning":"to make / do","origin":"Latin"},{"morpheme":"-tion","meaning":"action / state of","origin":"Latin"}],"cognates":["real","reality","reify"]}'::jsonb,
    ARRAY['process of reification', 'social reification', 'resist reification', 'reification of consciousness'],
    '{"sentence":"Reification requires that a relation between people takes on the character of a thing and thus acquires a phantom objectivity.","source":"History and Class Consciousness","author":"Georg Lukács"}'::jsonb,
    ARRAY['When economists describe the "invisible hand" as a conscious being that rewards productivity, they commit the fallacy of {{c1::reification}}.', 'Romantic love suffers tragic {{c1::reification}} when dating apps reduce human intimacy to market metrics and swipe statistics.'],
    '{"synonyms":["reification","fetishism","objectification"],"nuanceComparison":"Reification turns social relations or mental abstractions into physical things with autonomous authority; fetishism imputes mystical or divine powers to an object; objectification treats a human person instrumentally as a passive object.","contextRecommendations":[{"word":"reification","recommendedRegister":"Marxist / Critical Epistemology","exampleSentence":"The reification of historical time makes the current economic order seem eternal and unalterable."},{"word":"fetishism","recommendedRegister":"Anthropological / Psychoanalytic","exampleSentence":"Marx analyzed the commodity fetishism that hides the sweat of factory workers."},{"word":"objectification","recommendedRegister":"Feminist / Ethical Theory","exampleSentence":"The camera gaze in golden-age cinema reinforced the visual objectification of actresses."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000032',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-18T12:00:00.000Z',
    0, 0, 0, 3, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 33: alienation
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000033',
    '00000000-0000-0000-0000-000000000000',
    'alienation',
    'en',
    'noun',
    '/ˌeɪ.li.əˈneɪ.ʃən/',
    'The state of estrangement or disconnection of an individual from their labor, products of their work, fellow human beings, and fundamental human nature.',
    'In Karl Marx''s 1844 Manuscripts (Entfremdung), wage labor alienates workers because they do not own the product they create, turn work into painful misery rather than self-expression, and view fellow workers as rivals.',
    '{"roots":[{"morpheme":"alienus","meaning":"belonging to another / foreign / strange","origin":"Latin"},{"morpheme":"alius","meaning":"other","origin":"Latin"},{"morpheme":"-ation","meaning":"action / process of","origin":"Latin"}],"cognates":["alien","inalienable","alienate"]}'::jsonb,
    ARRAY['alienation of labor', 'social alienation', 'existential alienation', 'feel deep alienation'],
    '{"sentence":"The worker becomes all the poorer the more wealth he produces. The devaluation of the human world grows in direct proportion to the increase in value of the world of things.","source":"Economic and Philosophic Manuscripts of 1844","author":"Karl Marx"}'::jsonb,
    ARRAY['The assembly line represents the zenith of industrial {{c1::alienation}}, reducing the artisan to an interchangeable cog.', 'Modern existential novels capture the quiet {{c1::alienation}} of the white-collar commuter lost in suburban monotony.'],
    '{"synonyms":["alienation","anomie","estrangement"],"nuanceComparison":"Alienation is structural estrangement from one''s creative essence, labor, and community; anomie is a breakdown of moral rules and social norms leading to disorientation; estrangement is personal emotional distancing.","contextRecommendations":[{"word":"alienation","recommendedRegister":"Marxist / Critical Sociology","exampleSentence":"Workers overcome alienation only when they achieve democratic control over production."},{"word":"anomie","recommendedRegister":"Durkheimian / Sociological","exampleSentence":"Sudden economic collapses trigger widespread anomie and soaring suicide rates."},{"word":"estrangement","recommendedRegister":"Interpersonal / Psychotherapy","exampleSentence":"A bitter inheritance dispute caused lasting estrangement between the brothers."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000033',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-18T12:00:00.000Z',
    0, 0, 0, 3, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 34: hyperreality
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000034',
    '00000000-0000-0000-0000-000000000000',
    'hyperreality',
    'en',
    'noun',
    '/ˌhaɪ.pə.riˈæl.ɪ.ti/',
    'A condition in which what is simulated, virtual, or media-constructed becomes more real and influential to consciousness than physical reality itself.',
    'Formulated by Jean Baudrillard and Umberto Eco to describe consumer society where television, theme parks, and digital avatars dissolve the distinction between real events and scripted simulations.',
    '{"roots":[{"morpheme":"hyper-","meaning":"over / beyond / excessive","origin":"Greek"},{"morpheme":"realitas","meaning":"reality / actual existence","origin":"Latin"}],"cognates":["real","hyperactive","hyperspace"]}'::jsonb,
    ARRAY['age of hyperreality', 'realm of hyperreality', 'hyperreal spectacle', 'succumb to hyperreality'],
    '{"sentence":"The territory no longer precedes the map, nor survives it. Henceforth, it is the map that precedes the territory—precession of simulacra—it is the map that engenders the territory.","source":"Simulacra and Simulation","author":"Jean Baudrillard"}'::jsonb,
    ARRAY['The televised gulf war unfolded as pure {{c1::hyperreality}}, experienced as a video game of green night-vision trajectories without visible corpses.', 'Tourists visiting the artificial Venetian canals in Las Vegas experience a state of commercialized {{c1::hyperreality}}.'],
    '{"synonyms":["hyperreality","virtual reality","hallucination"],"nuanceComparison":"Hyperreality is a condition where media models precede and replace reality culturally; virtual reality is a specific digital hardware technology immersing the user; hallucination is a neurochemical or sensory pathology.","contextRecommendations":[{"word":"hyperreality","recommendedRegister":"Media Theory / Postmodernism","exampleSentence":"Influencers curate hyperreality on Instagram, fabricating lifestyles that millions attempt to mimic."},{"word":"virtual reality","recommendedRegister":"Technological / Computer Science","exampleSentence":"The flight simulator uses virtual reality goggles to train fighter pilots."},{"word":"hallucination","recommendedRegister":"Clinical / Neurological","exampleSentence":"Severe fever induced vivid auditory hallucinations."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000034',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-18T12:00:00.000Z',
    0, 0, 0, 3, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 35: subaltern
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000035',
    '00000000-0000-0000-0000-000000000000',
    'subaltern',
    'en',
    'noun',
    '/səˈbɔːl.tərn/',
    'A person, population, or social class marginalized, subordinated, and excluded from the hegemonic institutions and official historical archives of power.',
    'Adapted from Gramsci by Gayatri Chakravorty Spivak and the Subaltern Studies Group. In her seminal essay "Can the Subaltern Speak?", Spivak interrogates whether subaltern voices can be heard without being distorted by colonial/Western frameworks.',
    '{"roots":[{"morpheme":"sub-","meaning":"under / beneath","origin":"Latin"},{"morpheme":"alternus","meaning":"alternate / one after another","origin":"Latin"}],"cognates":["alternate","alterity"]}'::jsonb,
    ARRAY['subaltern classes', 'voice of the subaltern', 'subaltern studies', 'subaltern perspective'],
    '{"sentence":"If, in the context of colonial production, the subaltern has no history and cannot speak, the subaltern as female is even more deeply in shadow.","source":"Can the Subaltern Speak?","author":"Gayatri Chakravorty Spivak"}'::jsonb,
    ARRAY['Historiography from below seeks to recover the lost agency of the {{c1::subaltern}} peasants silenced by royal chronicles.', 'The NGO was criticized for speaking on behalf of the {{c1::subaltern}} instead of providing them the platform to represent themselves.'],
    '{"synonyms":["subaltern","proletariat","underclass"],"nuanceComparison":"Subaltern denotes cultural, linguistic, and political exclusion from representation in addition to class oppression; proletariat refers strictly to wage-laborers lacking capital; underclass is an empirical sociological term for impoverished urban strata.","contextRecommendations":[{"word":"subaltern","recommendedRegister":"Postcolonial / Critical Historiography","exampleSentence":"Postcolonial theory investigates the silenced perspectives of subaltern subjects in colonial archives."},{"word":"proletariat","recommendedRegister":"Marxist / Economic","exampleSentence":"The industrial proletariat organized nationwide strikes for the eight-hour day."},{"word":"underclass","recommendedRegister":"Policy / Empirical Sociology","exampleSentence":"Welfare policies debated how best to alleviate the systemic traps ensnaring the urban underclass."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000035',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-18T12:00:00.000Z',
    0, 0, 0, 3, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 36: governmentality
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000036',
    '00000000-0000-0000-0000-000000000000',
    'governmentality',
    'en',
    'noun',
    '/ˌɡʌv.ərn.menˈtæl.ɪ.ti/',
    'The organized rationalities, administrative calculations, and institutional apparatuses through which a society and its population are rendered governable.',
    'Introduced by Michel Foucault (Security, Territory, Population). In neoliberal governmentality, individuals are governed not by physical force, but by shaping their desires to act as autonomous "entrepreneurs of the self."',
    '{"roots":[{"morpheme":"gouverner","meaning":"to steer / guide / govern","origin":"French"},{"morpheme":"mentalite","meaning":"mentality / mindset","origin":"French"}],"cognates":["govern","mentality"]}'::jsonb,
    ARRAY['neoliberal governmentality', 'art of governmentality', 'biopolitical governmentality', 'regimes of governmentality'],
    '{"sentence":"By \"governmentality\" I understand the ensemble formed by institutions, procedures, analyses, and reflections that allow the exercise of this very specific, albeit complex, form of power.","source":"Security, Territory, Population","author":"Michel Foucault"}'::jsonb,
    ARRAY['Self-help culture and wellness apps act as vectors of contemporary {{c1::governmentality}}, encouraging workers to optimize their own stamina for corporate exploitation.', 'The transition to modern {{c1::governmentality}} shifted the goal of power from defending territory to cultivating the biological productivity of the population.'],
    '{"synonyms":["governmentality","sovereignty","bureaucracy"],"nuanceComparison":"Governmentality is the pervasive rationality that shapes conduct and subjectivities; sovereignty is the legal monopoly on supreme authority and violence; bureaucracy is the formal administrative hierarchy of offices.","contextRecommendations":[{"word":"governmentality","recommendedRegister":"Foucaultian / Political Sociology","exampleSentence":"Neoliberal governmentality transforms public citizens into market consumers responsible for their own safety nets."},{"word":"sovereignty","recommendedRegister":"Constitutional / International Law","exampleSentence":"Westphalian sovereignty guarantees territorial integrity against foreign invasion."},{"word":"bureaucracy","recommendedRegister":"Organizational / Weberian","exampleSentence":"Max Weber documented the inexorable expansion of legal-rational bureaucracy."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000036',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-18T12:00:00.000Z',
    0, 0, 0, 3, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 37: dispositif
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000037',
    '00000000-0000-0000-0000-000000000000',
    'dispositif',
    'en',
    'noun',
    '/dɪs.pɒz.ɪˈtiːf/',
    'A heterogeneous ensemble consisting of discourses, institutions, architectural forms, regulatory decisions, laws, and administrative measures maintaining power.',
    'Often translated into English as "apparatus." Giorgio Agamben defined a dispositif as anything that has in some way the capacity to capture, orient, determine, intercept, model, control, or secure the gestures, behaviors, and discourses of human beings.',
    '{"roots":[{"morpheme":"dispositio","meaning":"arrangement / order / disposition","origin":"Latin"},{"morpheme":"disponere","meaning":"to arrange / put in place","origin":"Latin"}],"cognates":["disposition","dispose"]}'::jsonb,
    ARRAY['foucaultian dispositif', 'apparatus and dispositif', 'carceral dispositif', 'dispositif of power'],
    '{"sentence":"What I call an apparatus (dispositif) is a thoroughly heterogeneous ensemble consisting of discourses, institutions, architectural forms, and philosophical propositions.","source":"Power/Knowledge","author":"Michel Foucault"}'::jsonb,
    ARRAY['The modern smartphone is not merely an electronic gadget, but a pervasive {{c1::dispositif}} capturing human attention and extracting behavioral surplus.', 'Foucault dissected the penal {{c1::dispositif}} to reveal how prison architecture works in tandem with judicial doctrine.'],
    '{"synonyms":["dispositif","institution","apparatus"],"nuanceComparison":"Dispositif emphasizes the strategic network linking architectural spaces, moral discourses, and technologies together; institution refers to a formally established organization; apparatus is the mechanical or political machinery.","contextRecommendations":[{"word":"dispositif","recommendedRegister":"Continental Theory / Agambenian","exampleSentence":"Agamben traces how the liturgical dispositif of the medieval church prefigured modern mass media."},{"word":"institution","recommendedRegister":"Sociological / Political","exampleSentence":"The supreme court remains a venerable democratic institution."},{"word":"apparatus","recommendedRegister":"Institutional / Technical","exampleSentence":"The state security apparatus intercepted the dissidents'' communications."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000037',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-18T12:00:00.000Z',
    0, 0, 0, 3, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 38: abjection
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000038',
    '00000000-0000-0000-0000-000000000000',
    'abjection',
    'en',
    'noun',
    '/æbˈdʒek.ʃən/',
    'The visceral psychological revulsion toward that which disturbs identity, order, or the clean boundary between the self and the other (e.g., corpses, bodily wastes).',
    'Articulated by Julia Kristeva in Powers of Horror. The abject is that which the infant must violently cast off to establish an autonomous bodily ego; it fascinates as much as it repulses because it threatens the collapse of borders.',
    '{"roots":[{"morpheme":"ab-","meaning":"away / off / from","origin":"Latin"},{"morpheme":"jacere","meaning":"to throw / cast","origin":"Latin"},{"morpheme":"-tion","meaning":"action / state of","origin":"Latin"}],"cognates":["abject","reject","projectile","eject"]}'::jsonb,
    ARRAY['state of abjection', 'powers of abjection', 'aesthetic of abjection', 'visceral abjection'],
    '{"sentence":"The corpse, seen without God and outside of science, is the utmost of abjection. It is death infecting life; abjection is a border.","source":"Powers of Horror: An Essay on Abjection","author":"Julia Kristeva"}'::jsonb,
    ARRAY['Body horror films generate anxiety by thrusting the viewer into direct confrontation with physical {{c1::abjection}}.', 'The exile was driven into psychological {{c1::abjection}}, stripped of legal citizenship and forced into squalor.'],
    '{"synonyms":["abjection","disgust","degradation"],"nuanceComparison":"Abjection is the primal metaphysical terror of boundary collapse between self and other; disgust is a physiological aversion to offensive sensory stimuli; degradation is the reduction of status or dignity.","contextRecommendations":[{"word":"abjection","recommendedRegister":"Psychoanalytic / Feminist Theory","exampleSentence":"Kristeva located the origin of abjection in the child''s traumatic separation from the maternal body."},{"word":"disgust","recommendedRegister":"Affective / Biological","exampleSentence":"He recoiled in sudden disgust from the rotting meat."},{"word":"degradation","recommendedRegister":"Social / Moral","exampleSentence":"The prisoners endured unspeakable humiliation and physical degradation."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000038',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-18T12:00:00.000Z',
    0, 0, 0, 3, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 39: heterotopia
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000039',
    '00000000-0000-0000-0000-000000000000',
    'heterotopia',
    'en',
    'noun',
    '/ˌhet.ə.roʊˈtoʊ.pi.ə/',
    'A real, physical counter-site or space of radical otherness that simultaneously represents, contests, and inverts all conventional spaces in a culture.',
    'Proposed by Michel Foucault in "Of Other Spaces." Unlike imaginary utopias, heterotopias are physical places: cemeteries, ships, psychiatric clinics, mirrors, gardens, and prisons, which operate by special temporal rules (heterochrony).',
    '{"roots":[{"morpheme":"heteros","meaning":"other / different / another","origin":"Greek"},{"morpheme":"topos","meaning":"place / location","origin":"Greek"},{"morpheme":"-ia","meaning":"state / place","origin":"Greek"}],"cognates":["utopia","heterodox","topology"]}'::jsonb,
    ARRAY['foucaultian heterotopia', 'heterotopia of deviation', 'ship as heterotopia', 'counter-site heterotopia'],
    '{"sentence":"The ship is the heterotopia par excellence. In civilizations without boats, dreams dry up, espionage takes the place of adventure, and the police take the place of pirates.","source":"Of Other Spaces: Utopias and Heterotopias","author":"Michel Foucault"}'::jsonb,
    ARRAY['The boarding school functioned as a closed {{c1::heterotopia}}, training young minds under rigid rituals isolated from the outside world.', 'Foucault classified the cemetery as a prime {{c1::heterotopia}}, a city of the dead mirroring yet separating from the metropolis of the living.'],
    '{"synonyms":["heterotopia","utopia","enclave"],"nuanceComparison":"Heterotopia is an actual physical location that suspends or inverts surrounding normative spaces; utopia is an idealized imaginary nowhere; enclave is a distinct geopolitical territory enclosed within a larger one.","contextRecommendations":[{"word":"heterotopia","recommendedRegister":"Spatial Theory / Architectural Criticism","exampleSentence":"The international cruise ship operates as a luxury heterotopia floating outside terrestrial jurisdictions."},{"word":"utopia","recommendedRegister":"Literary / Political","exampleSentence":"Thomas More coined the term utopia to depict an island free of private property."},{"word":"enclave","recommendedRegister":"Geopolitical / Urban","exampleSentence":"The walled diplomatic enclave remained insulated from the city''s protests."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000039',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-18T12:00:00.000Z',
    0, 0, 0, 3, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 40: jouissance
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000000',
    'jouissance',
    'en',
    'noun',
    '/ʒwiːˈsɒ̃s/',
    'Intense, transgressive pleasure that surpasses the pleasure principle, bordering on suffering, ecstasy, and the dissolution of subjective boundaries.',
    'Crucial in Jacques Lacan''s psychoanalytic theory and Roland Barthes''s The Pleasure of the Text (plaisir vs. jouissance). While pleasure satisfies homeostasis, jouissance shatters the ego with excessive sensory, sexual, or textual intensity.',
    '{"roots":[{"morpheme":"jouir","meaning":"to enjoy / savor / experience orgasm","origin":"French"},{"morpheme":"-ance","meaning":"action / condition of","origin":"French"}],"cognates":["joy","rejoice"]}'::jsonb,
    ARRAY['lacanian jouissance', 'text of jouissance', 'excessive jouissance', 'border on jouissance'],
    '{"sentence":"The text of pleasure is that which contents, fills, grants euphoria; the text of jouissance is that which imposes a state of loss, the text that discomforts, unsettles.","source":"The Pleasure of the Text","author":"Roland Barthes"}'::jsonb,
    ARRAY['Mystics describing ecstatic communion with God often articulate an experience resembling psychoanalytic {{c1::jouissance}}, where agony and bliss merge.', 'Avant-garde cinema rejects comforting narrative pleasure, seeking instead to shock the spectator into raw {{c1::jouissance}}.'],
    '{"synonyms":["jouissance","ecstasy","hedonism"],"nuanceComparison":"Jouissance is transgressive enjoyment that pierces the pleasure barrier into overwhelming painful intensity; ecstasy is being thrown outside oneself by transcendent awe; hedonism is the deliberate pursuit of pleasant sensory gratification.","contextRecommendations":[{"word":"jouissance","recommendedRegister":"Psychoanalytic / Literary Theory","exampleSentence":"Lacan situated feminine jouissance beyond the phallic register of symbolic law."},{"word":"ecstasy","recommendedRegister":"Spiritual / Poetic","exampleSentence":"Teresa of Ávila fell into rapturous spiritual ecstasy."},{"word":"hedonism","recommendedRegister":"Philosophical / Everyday","exampleSentence":"Ancient Epicureanism was far more disciplined than crude modern hedonism."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-18T12:00:00.000Z',
    0, 0, 0, 3, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 41: hermeneutics
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000041',
    '00000000-0000-0000-0000-000000000000',
    'hermeneutics',
    'en',
    'noun',
    '/ˌhɜː.mɪˈnjuː.tɪks/',
    'The theory, methodology, and philosophy of textual interpretation, particularly regarding legal, biblical, and literary texts.',
    'From Hermes, the messenger god. Advanced by Schleiermacher, Dilthey, Heidegger, and Gadamer from a set of philological rules for biblical exegesis into a fundamental philosophy of human understanding (the hermeneutic circle: the whole is understood through the parts, and the parts through the whole).',
    '{"roots":[{"morpheme":"hermeneutikos","meaning":"expert in interpretation","origin":"Greek"},{"morpheme":"hermeneuein","meaning":"to interpret / translate","origin":"Greek"},{"morpheme":"Hermes","meaning":"messenger god / interpreter","origin":"Greek"}],"cognates":["hermeneutic"]}'::jsonb,
    ARRAY['hermeneutic circle', 'hermeneutics of suspicion', 'philosophical hermeneutics', 'textual hermeneutics'],
    '{"sentence":"Paul Ricoeur distinguished between a hermeneutics of faith, which listens to the symbol, and a hermeneutics of suspicion, practiced by Marx, Nietzsche, and Freud to unmask illusions.","source":"Freud and Philosophy: An Essay on Interpretation","author":"Paul Ricoeur"}'::jsonb,
    ARRAY['Reading dense modernist poetry requires a flexible {{c1::hermeneutics}} capable of enduring unresolved syntactic ambiguities.', 'Gadamer insisted that all understanding takes place within the horizon of tradition, making {{c1::hermeneutics}} the condition of human life.'],
    '{"synonyms":["hermeneutics","exegesis","semiotics"],"nuanceComparison":"Hermeneutics is the overarching philosophy and methodology of interpretation and meaning; exegesis is the close, verse-by-verse textual analysis of a specific work (especially scripture); semiotics is the study of signs and sign systems.","contextRecommendations":[{"word":"hermeneutics","recommendedRegister":"Philosophical / Literary Theory","exampleSentence":"A feminist hermeneutics reinterprets patriarchal parables to illuminate silenced female disciples."},{"word":"exegesis","recommendedRegister":"Theological / Philological","exampleSentence":"The scholar published a rigorous grammatical exegesis of Paul''s Epistle to the Romans."},{"word":"semiotics","recommendedRegister":"Structuralist / Linguistic","exampleSentence":"Umberto Eco applied semiotics to analyze James Bond novels."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000041',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-19T12:00:00.000Z',
    0, 0, 0, 4, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 42: palimpsest
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000042',
    '00000000-0000-0000-0000-000000000000',
    'palimpsest',
    'en',
    'noun',
    '/ˈpæl.ɪmp.sest/',
    'A manuscript or parchment on which the original writing has been scraped off to make room for later writing, but where faint traces remain; metaphor for layered memory.',
    'Used frequently in literary modernism (Joyce, Woolf, H.D.) and post-structuralism to describe human consciousness, urban architecture, or cultural history as layered inscriptions where the past constantly bleeds through the present.',
    '{"roots":[{"morpheme":"palin","meaning":"again / back","origin":"Greek"},{"morpheme":"psen","meaning":"to scrape / rub smooth","origin":"Greek"}],"cognates":["palindrome","palilalia"]}'::jsonb,
    ARRAY['urban palimpsest', 'historical palimpsest', 'palimpsest of memory', 'read like a palimpsest'],
    '{"sentence":"What else than a natural and mighty palimpsest is the human brain? Everlasting layers of ideas, images, feelings have fallen upon your brain softly as light.","source":"Suspiria de Profundis","author":"Thomas De Quincey"}'::jsonb,
    ARRAY['Walking through Rome feels like wandering over an architectural {{c1::palimpsest}}, where baroque fountains rest directly on pagan temple foundations.', 'The historian scrutinized the vellum {{c1::palimpsest}} with ultraviolet light, recovering a lost treatise by Archimedes beneath thirteenth-century prayers.'],
    '{"synonyms":["palimpsest","stratification","mosaic"],"nuanceComparison":"Palimpsest specifically evokes an erased text through which earlier layers ghost and re-emerge; stratification emphasizes orderly, distinct geological or social layers; mosaic denotes distinct fragments assembled into a single surface.","contextRecommendations":[{"word":"palimpsest","recommendedRegister":"Literary / Cultural Geography","exampleSentence":"Berlin''s bullet-scarred facades form an emotional palimpsest of the twentieth century."},{"word":"stratification","recommendedRegister":"Geological / Sociological","exampleSentence":"Social stratification hardened along rigid income divides."},{"word":"mosaic","recommendedRegister":"Aesthetic / Metaphorical","exampleSentence":"The city was a vibrant mosaic of immigrant neighborhoods."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000042',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-19T12:00:00.000Z',
    0, 0, 0, 4, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 43: polyphony
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000043',
    '00000000-0000-0000-0000-000000000000',
    'polyphony',
    'en',
    'noun',
    '/pəˈlɪf.ə.ni/',
    'The simultaneous presence and dialogue of multiple independent, unmerged character voices and worldviews within a novel, none subordinated to an authorial monologue.',
    'Imported from musical counterpoint into literary theory by Mikhail Bakhtin in Problems of Dostoevsky''s Poetics. In a polyphonic novel, the author creates characters who possess their own sovereign ideological dignity rather than acting as authorial mouthpieces.',
    '{"roots":[{"morpheme":"poly-","meaning":"many / multi","origin":"Greek"},{"morpheme":"phone","meaning":"voice / sound","origin":"Greek"}],"cognates":["polyphonic","phonetic","symphony"]}'::jsonb,
    ARRAY['bakhtinian polyphony', 'polyphonic novel', 'rich polyphony', 'orchestrate polyphony'],
    '{"sentence":"Dostoevsky is the creator of the polyphonic novel; he created an entirely new novelistic genre where a plurality of independent voices sound alongside one another.","source":"Problems of Dostoevsky''s Poetics","author":"Mikhail Bakhtin"}'::jsonb,
    ARRAY['The epic novel achieves mesmerizing {{c1::polyphony}}, giving equal weight to the monologue of the revolutionary, the bishop, and the cynic.', 'Unlike the monologic Victorian narrator who lectures the reader, modern fiction thrives on raw, unsettled {{c1::polyphony}}.'],
    '{"synonyms":["polyphony","cacophony","monologue"],"nuanceComparison":"Polyphony is the harmonious or contrapuntal coexistence of distinct autonomous voices; cacophony is a harsh, discordant, chaotic clash of noise; monologue is speech delivered by a single solitary voice.","contextRecommendations":[{"word":"polyphony","recommendedRegister":"Bakhtinian / Musical / Literary Criticism","exampleSentence":"The narrative''s polyphony mirrors the ideological pluralism of modern democracy."},{"word":"cacophony","recommendedRegister":"Acoustic / Descriptive","exampleSentence":"Traffic horns and construction drills created a deafening morning cacophony."},{"word":"monologue","recommendedRegister":"Theatrical / Dramatic","exampleSentence":"Hamlet''s soliloquy is the most famous dramatic monologue in English."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000043',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-19T12:00:00.000Z',
    0, 0, 0, 4, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 44: clinamen
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000044',
    '00000000-0000-0000-0000-000000000000',
    'clinamen',
    'en',
    'noun',
    '/klaɪˈneɪ.mən/',
    'An unpredictable atomic inclination or swerve; in literary theory, a poet''s deliberate, subversive swerve away from a strong precursor to establish creative originality.',
    'Coined in Latin by Lucretius (De Rerum Natura) to describe the random atomic swerve that introduces free will into deterministic physics. Harold Bloom (The Anxiety of Influence) made it the first "revisionary ratio" where a strong poet misreads their precursor to open imaginative space.',
    '{"roots":[{"morpheme":"clinare","meaning":"to lean / bend / incline","origin":"Latin"},{"morpheme":"-men","meaning":"instrument / result of action","origin":"Latin"}],"cognates":["incline","decline","clinic"]}'::jsonb,
    ARRAY['poetic clinamen', 'lucretian clinamen', 'revisionary clinamen', 'swerve of the clinamen'],
    '{"sentence":"Clinamen is poetic misprision or swerve proper; the poet swerves away from his precursor by reading the precursor''s poem so as to imply that it was correct up to a point, but then should have swerved in the direction of the new poem.","source":"The Anxiety of Influence","author":"Harold Bloom"}'::jsonb,
    ARRAY['Keats executed a brilliant {{c1::clinamen}} away from Milton''s austere epic style, turning toward sensory richness and earthly mortality.', 'In Epicurean physics, without the random {{c1::clinamen}} of atoms falling through the void, no collision could ever have formed the cosmos.'],
    '{"synonyms":["clinamen","deviation","swerve"],"nuanceComparison":"Clinamen is an unexpected, creative atomic or poetic swerve establishing freedom or original voice; deviation is a departure from a standard rule or path (often negative); swerve is physical abrupt turning.","contextRecommendations":[{"word":"clinamen","recommendedRegister":"Poetic Theory / Lucretian Philosophy","exampleSentence":"The young novelist''s second book marked a necessary clinamen away from her mentor''s realism."},{"word":"deviation","recommendedRegister":"Statistical / Normative","exampleSentence":"A standard deviation of two points was considered statistically insignificant."},{"word":"swerve","recommendedRegister":"Physical / Everyday","exampleSentence":"A sudden swerve avoided a collision with the fallen tree branch."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000044',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-19T12:00:00.000Z',
    0, 0, 0, 4, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 45: defamiliarization
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000045',
    '00000000-0000-0000-0000-000000000000',
    'defamiliarization',
    'en',
    'noun',
    '/diː.fəˌmɪl.i.ə.raɪˈzeɪ.ʃən/',
    'The artistic technique of presenting common, habitual objects or concepts in an unfamiliar, strange way so as to enhance perception and overcome routine numbness.',
    'Formulated by Russian Formalist Viktor Shklovsky as ostranenie ("making strange"). Art exists to make one feel things, to make the stone stony: "The purpose of art is to impart the sensation of things as they are perceived and not as they are known."',
    '{"roots":[{"morpheme":"de-","meaning":"undo / reverse","origin":"Latin"},{"morpheme":"familiaris","meaning":"belonging to household / familiar","origin":"Latin"},{"morpheme":"-ation","meaning":"process / result of","origin":"Latin"}],"cognates":["familiar","ostranenie"]}'::jsonb,
    ARRAY['technique of defamiliarization', 'shklovskian defamiliarization', 'effect of defamiliarization', 'defamiliarize the everyday'],
    '{"sentence":"Habitualization devours works, clothes, furniture, one''s wife, and the fear of war. Art exists that one may recover the sensation of life; it exists to make one feel things, to make the stony stone.","source":"Art as Technique","author":"Viktor Shklovsky"}'::jsonb,
    ARRAY['Tolstoy practiced exquisite {{c1::defamiliarization}} in War and Peace by describing the pompous opera entirely from the perspective of an innocent young girl.', 'By narrating the story through the consciousness of an alien observing human courtship, the satire achieved powerful {{c1::defamiliarization}}.'],
    '{"synonyms":["defamiliarization","alienation effect","estrangement"],"nuanceComparison":"Defamiliarization is the poetic renewal of sensory perception by making the familiar strange; alienation effect (Brecht''s Verfremdungseffekt) is a theatrical device breaking dramatic illusion to encourage critical political reflection; estrangement is personal psychological alienation.","contextRecommendations":[{"word":"defamiliarization","recommendedRegister":"Formalist / Literary Theory","exampleSentence":"Metaphor achieves defamiliarization by juxtaposing two violently dissimilar objects."},{"word":"alienation effect","recommendedRegister":"Theatrical / Brechtian","exampleSentence":"Brecht used stage placards and house lights to trigger the alienation effect in the audience."},{"word":"estrangement","recommendedRegister":"Psychological / Interpersonal","exampleSentence":"Long absences produced mutual estrangement between the parents and child."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000045',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-19T12:00:00.000Z',
    0, 0, 0, 4, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 46: anomie
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000046',
    '00000000-0000-0000-0000-000000000000',
    'anomie',
    'en',
    'noun',
    '/ˈæn.ə.mi/',
    'A condition of social instability, normlessness, and moral deregulation resulting from the breakdown of collective standards and social cohesion.',
    'Coined by French sociologist Émile Durkheim (The Division of Labor in Society, Suicide). Anomie occurs during rapid modernization or economic turmoil when society''s moral framework fails to regulate individual appetites, causing existential despair.',
    '{"roots":[{"morpheme":"a-","meaning":"without / lack of","origin":"Greek"},{"morpheme":"nomos","meaning":"law / custom / order","origin":"Greek"}],"cognates":["autonomy","antinomy","astronomy"]}'::jsonb,
    ARRAY['social anomie', 'state of anomie', 'drift into anomie', 'durkheimian anomie'],
    '{"sentence":"When society is disturbed by some painful crisis or by rapid transitions, it is momentarily incapable of exercising its regulatory action; hence the sharp rise in anomic suicides.","source":"Suicide: A Study in Sociology","author":"Émile Durkheim"}'::jsonb,
    ARRAY['Post-Soviet Russia in the 1990s witnessed sudden {{c1::anomie}}, as old socialist certainties collapsed while market capitalism unleashed lawless oligarchy.', 'Urban crime waves are frequently fueled not merely by poverty, but by the demoralizing {{c1::anomie}} of neglected neighborhoods.'],
    '{"synonyms":["anomie","alienation","lawlessness"],"nuanceComparison":"Anomie is the structural absence or breakdown of moral norms and limits guiding life; alienation is the separation from one''s labor and humanity; lawlessness is simple disobedience or absence of physical policing.","contextRecommendations":[{"word":"anomie","recommendedRegister":"Sociological / Cultural Critique","exampleSentence":"Modern consumerism breeds an acute anomie where infinite desire finds no ethical boundary."},{"word":"alienation","recommendedRegister":"Marxist / Existential","exampleSentence":"Factory workers protested the alienation of working alongside deafening machines."},{"word":"lawlessness","recommendedRegister":"Criminological / Civic","exampleSentence":"The frontier town descended into rampant lawlessness after the sheriff fled."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000046',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-19T12:00:00.000Z',
    0, 0, 0, 4, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 47: diegesis
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000047',
    '00000000-0000-0000-0000-000000000000',
    'diegesis',
    'en',
    'noun',
    '/ˌdaɪ.əˈdʒiː.sɪs/',
    'The fictional world, events, and narrative space depicted within a film, literary work, or theatrical production; narration as opposed to enactment.',
    'Contrasted by Plato with mimesis (direct imitation/dialogue vs. narration by the poet). In modern narratology (Genette) and film theory, distinguished between diegetic (existing within the story world, e.g., a radio the characters hear) and non-diegetic (e.g., background film score).',
    '{"roots":[{"morpheme":"diegesis","meaning":"narration / statement / story","origin":"Greek"},{"morpheme":"dia-","meaning":"through / throughout","origin":"Greek"},{"morpheme":"hegeisthai","meaning":"to lead / guide","origin":"Greek"}],"cognates":["diegetic","hegemony","exegesis"]}'::jsonb,
    ARRAY['diegetic music', 'inside the diegesis', 'film diegesis', 'narrative diegesis'],
    '{"sentence":"The distinction between diegetic sound, which originates within the story space, and non-diegetic soundtrack music is fundamental to film grammar.","source":"Film Art: An Introduction","author":"David Bordwell and Kristin Thompson"}'::jsonb,
    ARRAY['When the pianist on screen began playing, what sounded like romantic background music was revealed to be part of the film''s internal {{c1::diegesis}}.', 'Gérard Genette subdivided narrative levels into intradiegetic (within the first story) and extradiegetic (outside the main {{c1::diegesis}}).'],
    '{"synonyms":["diegesis","mimesis","setting"],"nuanceComparison":"Diegesis refers to the total narrative world and fictional reality wherein characters exist; mimesis is the direct dramatization or theatrical enactment of events; setting is the physical and temporal backdrop.","contextRecommendations":[{"word":"diegesis","recommendedRegister":"Film Studies / Narratology","exampleSentence":"The sudden appearance of an omniscient narrator ruptured the realism of the historical diegesis."},{"word":"mimesis","recommendedRegister":"Aesthetic / Classical Literary","exampleSentence":"Aristotle regarded drama as the highest form of artistic mimesis."},{"word":"setting","recommendedRegister":"Everyday Literary / Scriptwriting","exampleSentence":"The misty moors provided a brooding setting for the romance."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000047',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-19T12:00:00.000Z',
    0, 0, 0, 4, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 48: mimesis
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000048',
    '00000000-0000-0000-0000-000000000000',
    'mimesis',
    'en',
    'noun',
    '/mɪˈmiː.sɪs/',
    'Imitation, poetic representation, or the artistic re-enactment of reality and human action in literature, painting, and drama.',
    'Crucial to ancient poetics: Plato mistrusted mimesis as a copy of a copy twice removed from the true Forms, whereas Aristotle championed it in the Poetics as an innate human instinct through which we learn and experience catharsis. Analyzed historically by Erich Auerbach (Mimesis: The Representation of Reality in Western Literature).',
    '{"roots":[{"morpheme":"mimeisthai","meaning":"to imitate / mimic / represent","origin":"Greek"},{"morpheme":"mimos","meaning":"actor / mime","origin":"Greek"}],"cognates":["mimic","mime","mimetic"]}'::jsonb,
    ARRAY['artistic mimesis', 'mimetic desire', 'mimetic representation', 'theory of mimesis'],
    '{"sentence":"Epic poetry and Tragedy, Comedy also and Dithyrambic poetry are all, in their general conception, modes of mimesis.","source":"Poetics","author":"Aristotle"}'::jsonb,
    ARRAY['René Girard grounded his anthropology in {{c1::mimesis}}, arguing that human beings desire objects not for their intrinsic worth, but because rivals desire them.', 'Auerbach traced the evolution of literary {{c1::mimesis}} from Homeric clarity to the multi-layered stream-of-consciousness in Virginia Woolf.'],
    '{"synonyms":["mimesis","imitation","simulation"],"nuanceComparison":"Mimesis is the poetic artistic re-creation of reality revealing universal truths; imitation is general copying of an existing model; simulation is the technical modeling or deceptive generation of an artificial process.","contextRecommendations":[{"word":"mimesis","recommendedRegister":"Aristotelian / Literary Theory","exampleSentence":"Realist novels achieved a triumph of mimesis, mirroring nineteenth-century bourgeois life."},{"word":"imitation","recommendedRegister":"Everyday / Rhetorical","exampleSentence":"Apprentice painters learned their craft through the diligent imitation of the old masters."},{"word":"simulation","recommendedRegister":"Computer Science / Postmodern","exampleSentence":"The flight simulation replicated turbulent storm conditions with alarming precision."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000048',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-19T12:00:00.000Z',
    0, 0, 0, 4, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 49: heteroglossia
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000049',
    '00000000-0000-0000-0000-000000000000',
    'heteroglossia',
    'en',
    'noun',
    '/ˌhet.ə.roʊˈɡlɒs.i.ə/',
    'The coexistence and collision of distinct social, regional, generational, and ideological languages and registers within a single national tongue.',
    'Introduced by Mikhail Bakhtin in "Discourse in the Novel" (raznorechie). The novel is the supreme genre because it incorporates the stratified social dialects (the lawyer''s jargon, the peasant''s argot, the bureaucrat''s pedantry) into a vibrant linguistic arena.',
    '{"roots":[{"morpheme":"heteros","meaning":"other / different / another","origin":"Greek"},{"morpheme":"glossa","meaning":"tongue / language","origin":"Greek"},{"morpheme":"-ia","meaning":"condition / abstract noun","origin":"Greek"}],"cognates":["glossary","heterogeneous","polyglot"]}'::jsonb,
    ARRAY['social heteroglossia', 'bakhtinian heteroglossia', 'forces of heteroglossia', 'internal heteroglossia'],
    '{"sentence":"The novel orchestrates all its themes by means of the social diversity of speech types (raznorechie) and by the differing individual voices that enter into it.","source":"The Dialogic Imagination","author":"Mikhail Bakhtin"}'::jsonb,
    ARRAY['James Joyce''s Ulysses is the pinnacle of modern {{c1::heteroglossia}}, weaving Dublin street slang, liturgical Latin, advertising slogans, and medical jargon.', 'Authoritarian states attempt to impose a monologic standard language, but the vitality of popular {{c1::heteroglossia}} constantly undermines censorship.'],
    '{"synonyms":["heteroglossia","polyphony","multilingualism"],"nuanceComparison":"Heteroglossia is the internal stratification of a single language into competing socio-ideological dialects; polyphony is the structural orchestration of independent character viewpoints; multilingualism is the knowledge or use of several distinct languages.","contextRecommendations":[{"word":"heteroglossia","recommendedRegister":"Bakhtinian / Sociolinguistics","exampleSentence":"The courtroom scene hums with heteroglossia as legal Latin clashes with working-class vernacular."},{"word":"polyphony","recommendedRegister":"Narratology / Musical","exampleSentence":"The polyphony of the novel ensures no single character holds the moral monopoly."},{"word":"multilingualism","recommendedRegister":"Educational / Civic","exampleSentence":"Switzerland''s canton system accommodates constitutional multilingualism."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000049',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-19T12:00:00.000Z',
    0, 0, 0, 4, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 50: chronotope
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000050',
    '00000000-0000-0000-0000-000000000000',
    'chronotope',
    'en',
    'noun',
    '/ˈkrɒn.ə.toʊp/',
    'The intrinsic, inseparable interconnectedness of temporal and spatial relationships artistically expressed in literary narrative.',
    'Coined by Bakhtin (borrowing Einstein''s spacetime physics) in "Forms of Time and of the Chronotope in the Novel." Specific chronotopes define literary genres: e.g., the "chronotope of the road" in picaresque novels, or the "chronotope of the provincial salon" in realism.',
    '{"roots":[{"morpheme":"chronos","meaning":"time","origin":"Greek"},{"morpheme":"topos","meaning":"place / space","origin":"Greek"}],"cognates":["chronometer","topology","chronological"]}'::jsonb,
    ARRAY['bakhtinian chronotope', 'chronotope of the road', 'castle chronotope', 'literary chronotope'],
    '{"sentence":"We will give the name chronotope (literally, \"time-space\") to the intrinsic connectedness of temporal and spatial relationships that are artistically expressed in literature.","source":"The Dialogic Imagination","author":"Mikhail Bakhtin"}'::jsonb,
    ARRAY['Gothic horror relies upon the sinister {{c1::chronotope}} of the ruined medieval castle, where ancestral crimes from the past haunt decaying physical spaces.', 'The modern road trip film revives the ancient picaresque {{c1::chronotope}}, where geographic travel parallels psychological maturation.'],
    '{"synonyms":["chronotope","setting","spacetime"],"nuanceComparison":"Chronotope is the fused, symbolic unity of time and space defining narrative genres and character agency; setting is the physical backdrop; spacetime is the four-dimensional continuum of relativistic physics.","contextRecommendations":[{"word":"chronotope","recommendedRegister":"Bakhtinian / Narrative Theory","exampleSentence":"The provincial town in Madame Bovary serves as a suffocating chronotope where time plods without destination."},{"word":"setting","recommendedRegister":"Literary / Descriptive","exampleSentence":"The quiet seaside cottage provided an idyllic setting for writing her memoirs."},{"word":"spacetime","recommendedRegister":"Theoretical Physics","exampleSentence":"General relativity describes gravity as the curvature of spacetime around mass."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000050',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-19T12:00:00.000Z',
    0, 0, 0, 4, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 51: fabula
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000051',
    '00000000-0000-0000-0000-000000000000',
    'fabula',
    'en',
    'noun',
    '/ˈfæb.jʊ.lə/',
    'The raw, chronological, and causal sequence of events in a narrative as they actually occurred in the story world.',
    'Crucial binary in Russian Formalism (Shklovsky, Tomashevsky) paired with syuzhet. The fabula is the raw chronological material ("what happened"), while the syuzhet is the aesthetic arrangement and plotting ("how it is told").',
    '{"roots":[{"morpheme":"fabula","meaning":"story / tale / myth / plot","origin":"Latin"},{"morpheme":"fari","meaning":"to speak","origin":"Latin"}],"cognates":["fable","fabulous","ineffable"]}'::jsonb,
    ARRAY['fabula and syuzhet', 'reconstruct the fabula', 'underlying fabula', 'chronological fabula'],
    '{"sentence":"The fabula is the raw material for narrative structuring, whereas the syuzhet is the finished, stylized composition of events presented to the reader.","source":"Theory of Literature","author":"Boris Tomashevsky"}'::jsonb,
    ARRAY['In detective fiction, the reader spends the entire book analyzing the confusing clues of the syuzhet in order to reconstruct the hidden {{c1::fabula}} of the murder.', 'Christopher Nolan''s Memento scrambled the chronological {{c1::fabula}} by presenting the plot scenes in reverse temporal order.'],
    '{"synonyms":["fabula","syuzhet","chronology"],"nuanceComparison":"Fabula is the raw chronological chain of cause and effect in the narrative world; syuzhet is the artistic structuring and re-sequencing of those events in the text; chronology is a mere temporal list of dates.","contextRecommendations":[{"word":"fabula","recommendedRegister":"Russian Formalism / Narratology","exampleSentence":"The film''s flash-forwards and flashbacks obscured the underlying simplicity of the tragic fabula."},{"word":"syuzhet","recommendedRegister":"Structuralist / Formalist","exampleSentence":"The intricate syuzhet created mounting suspense by delaying the confession until the final page."},{"word":"chronology","recommendedRegister":"Historical / Archival","exampleSentence":"The biographer established a strict chronology of the general''s wartime campaigns."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000051',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-20T12:00:00.000Z',
    0, 0, 0, 5, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 52: syuzhet
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000052',
    '00000000-0000-0000-0000-000000000000',
    'syuzhet',
    'en',
    'noun',
    '/suːˈʒet/',
    'The artistic organization, narrative framing, and dramatic sequence of events as deliberately presented to the reader or audience.',
    'Paired in Russian Formalism with fabula (the underlying chronological events). The syuzhet uses flashbacks, omissions, delays, and pacing to deform the fabula, generating suspense and defamiliarization.',
    '{"roots":[{"morpheme":"sujet","meaning":"subject / plot / matter","origin":"French"}],"cognates":["subject"]}'::jsonb,
    ARRAY['construction of the syuzhet', 'syuzhet and fabula', 'intricate syuzhet', 'syuzhet arrangement'],
    '{"sentence":"The methods of the syuzhet consist of slowing down the action, rearranging temporal sequence, and introducing digressions to thwart the reader''s expectation.","source":"Theory of Prose","author":"Viktor Shklovsky"}'::jsonb,
    ARRAY['While the fabula spans fifty years of family history, the novel''s compressed {{c1::syuzhet}} unfolds entirely over the course of a single turbulent afternoon.', 'Pulp Fiction achieved fame through its inventive {{c1::syuzhet}}, interlocking three crime storylines in a circular temporal loop.'],
    '{"synonyms":["syuzhet","plot","fabula"],"nuanceComparison":"Syuzhet is the formal, stylized aesthetic composition and presentation of narrative events; plot is the conventional term for the sequence of events; fabula is the unadorned chronological timeline of what occurred.","contextRecommendations":[{"word":"syuzhet","recommendedRegister":"Formalist / Film Theory","exampleSentence":"By beginning in media res, the syuzhet immediately plunges the viewer into the crisis."},{"word":"plot","recommendedRegister":"General Literary / Commercial","exampleSentence":"The mystery novel featured an unpredictable and fast-paced plot."},{"word":"fabula","recommendedRegister":"Narratological / Analytical","exampleSentence":"When rearranged chronologically, the fabula revealed that the butler had planned the theft months in advance."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000052',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-20T12:00:00.000Z',
    0, 0, 0, 5, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 53: intertextuality
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000053',
    '00000000-0000-0000-0000-000000000000',
    'intertextuality',
    'en',
    'noun',
    '/ˌɪn.tə.teks.tʃuˈæl.ɪ.ti/',
    'The relational interdependence and reciprocal referencing between literary texts; the condition where every text is an absorption and transformation of other texts.',
    'Coined by Julia Kristeva in 1966, synthesizing Bakhtin''s dialogism with structuralist semiotics. Roland Barthes expanded it to declare that a text is not an original creation of a single author, but a "tissue of quotations drawn from innumerable centers of culture."',
    '{"roots":[{"morpheme":"inter-","meaning":"between / among","origin":"Latin"},{"morpheme":"textus","meaning":"woven / web / text (from texere: to weave)","origin":"Latin"},{"morpheme":"-ity","meaning":"quality / state of","origin":"Latin"}],"cognates":["text","textile","texture"]}'::jsonb,
    ARRAY['rich intertextuality', 'postmodern intertextuality', 'web of intertextuality', 'ironic intertextuality'],
    '{"sentence":"Any text is constructed as a mosaic of quotations; any text is the absorption and transformation of another. The notion of intertextuality installs itself.","source":"Desire in Language: A Semiotic Approach to Literature and Art","author":"Julia Kristeva"}'::jsonb,
    ARRAY['T.S. Eliot''s The Waste Land relies upon dense {{c1::intertextuality}}, quoting Dante, Ovid, the Upanishads, and popular pub songs within a single stanza.', 'Postmodern cinema revels in playful {{c1::intertextuality}}, embedding tributes to spaghetti westerns and Japanese samurai films.'],
    '{"synonyms":["intertextuality","allusion","plagiarism"],"nuanceComparison":"Intertextuality is the structural semiotic condition where texts inevitably echo and transform prior cultural texts; allusion is a deliberate, conscious brief reference to an outside work; plagiarism is the illicit theft of another''s prose without attribution.","contextRecommendations":[{"word":"intertextuality","recommendedRegister":"Post-Structuralist / Literary Theory","exampleSentence":"The novel''s rich intertextuality rewards erudite readers who recognize biblical subtexts."},{"word":"allusion","recommendedRegister":"Rhetorical / Classical","exampleSentence":"The prime minister''s speech contained an elegant allusion to Lincoln''s Gettysburg Address."},{"word":"plagiarism","recommendedRegister":"Academic / Legal","exampleSentence":"The graduate student faced expulsion after software detected rampant plagiarism in his dissertation."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000053',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-20T12:00:00.000Z',
    0, 0, 0, 5, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 54: paratext
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000054',
    '00000000-0000-0000-0000-000000000000',
    'paratext',
    'en',
    'noun',
    '/ˈpær.ə.tekst/',
    'The framing, peripheral materials that surround, present, and mediate a literary work to the public (prefaces, footnotes, titles, epigraphs, dust jackets).',
    'Theorized comprehensively by Gérard Genette in Paratexts: Thresholds of Interpretation. Subdivided into peritext (elements inside the book: titles, dedication, epigraphs, appendices) and epitext (elements outside: interviews, reviews, letters).',
    '{"roots":[{"morpheme":"para-","meaning":"beside / alongside / beyond","origin":"Greek"},{"morpheme":"textus","meaning":"text / woven fabric","origin":"Latin"}],"cognates":["parallel","parameter","paradox"]}'::jsonb,
    ARRAY['editorial paratext', 'authorial paratext', 'paratextual threshold', 'function of the paratext'],
    '{"sentence":"The paratext is what enables a text to become a book and to be offered as such to its readers and, more generally, to the public. It is a zone not only of transition and also of transaction.","source":"Paratexts: Thresholds of Interpretation","author":"Gérard Genette"}'::jsonb,
    ARRAY['David Foster Wallace used endless explanatory footnotes as a subversive {{c1::paratext}} that continually interrupted the primary fictional narrative.', 'A sensationalist book cover and endorsement blurb form part of the marketing {{c1::paratext}} that steers how an audience interprets the story.'],
    '{"synonyms":["paratext","peritext","context"],"nuanceComparison":"Paratext comprises the physical framing elements created to mediate reading (titles, footnotes, prefaces); peritext refers specifically to elements bound within the physical volume; context refers to the broader historical and biographical circumstances.","contextRecommendations":[{"word":"paratext","recommendedRegister":"Genettian / Book History / Bibliographical","exampleSentence":"Nabokov''s Pale Fire is a brilliant satire of the scholarly paratext, comprising a poem framed by an obsessive commentator."},{"word":"peritext","recommendedRegister":"Narratological / Specialized","exampleSentence":"The publisher altered the peritext by appending a glossy glossary to the back pages."},{"word":"context","recommendedRegister":"Historical / General","exampleSentence":"Understanding the French Revolution provides vital context for interpreting Romantic poetry."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000054',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-20T12:00:00.000Z',
    0, 0, 0, 5, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 55: metalepsis
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000055',
    '00000000-0000-0000-0000-000000000000',
    'metalepsis',
    'en',
    'noun',
    '/ˌmet.əˈlep.sɪs/',
    'A narrative figure or transgression in which the boundary between distinct fictional levels (e.g. author, reader, and fictional world) is deliberately violated.',
    'Conceptualized by Gérard Genette in Figures III. Famous examples include Pirandello''s Six Characters in Search of an Author, Italo Calvino''s If on a winter''s night a traveler, and Woody Allen''s The Purple Rose of Cairo (where a character walks off the movie screen into the audience).',
    '{"roots":[{"morpheme":"meta-","meaning":"across / change / after","origin":"Greek"},{"morpheme":"lepsis","meaning":"taking / seizing (from lambanein)","origin":"Greek"}],"cognates":["catalepsy","epilepsy"]}'::jsonb,
    ARRAY['narrative metalepsis', 'act of metalepsis', 'ontological metalepsis', 'metaleptic transgression'],
    '{"sentence":"Any intrusion by the extradiegetic narrator into the diegetic universe produces an effect of either strangeness or humor; this transgressive threshold crossing is what we call narrative metalepsis.","source":"Narrative Discourse: An Essay in Method","author":"Gérard Genette"}'::jsonb,
    ARRAY['When the narrator suddenly speaks directly to the protagonist sitting in the cafe, the novel executes an unsettling {{c1::metalepsis}}.', 'Borges employed {{c1::metalepsis}} to remind readers that if the characters in Don Quixote can be readers of Quixote, we the readers might also be fictions.'],
    '{"synonyms":["metalepsis","breaking the fourth wall","metafiction"],"nuanceComparison":"Metalepsis is the specific technical transgression crossing distinct narrative ontological levels; breaking the fourth wall is a theatrical convention addressing the audience directly; metafiction is any fiction that self-consciously examines its own artificiality.","contextRecommendations":[{"word":"metalepsis","recommendedRegister":"Narratological / Postmodern","exampleSentence":"The cartoon character painting the borders of his own frame is a visual metalepsis."},{"word":"breaking the fourth wall","recommendedRegister":"Theatrical / Film Criticism","exampleSentence":"The sitcom protagonist looks directly at the camera, breaking the fourth wall with an exasperated smirk."},{"word":"metafiction","recommendedRegister":"Literary / Critical","exampleSentence":"Tristram Shandy is the great eighteenth-century ancestor of postmodern metafiction."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000055',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-20T12:00:00.000Z',
    0, 0, 0, 5, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 56: semiotics
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000056',
    '00000000-0000-0000-0000-000000000000',
    'semiotics',
    'en',
    'noun',
    '/ˌsem.iˈɒt.ɪks/',
    'The systematic philosophical and linguistic study of signs, symbols, signifying systems, and the processes through which meaning is generated.',
    'Founded simultaneously by Ferdinand de Saussure (semiology, analyzing signifier and signified) and Charles Sanders Peirce (semiotics, analyzing sign, object, and interpretant; icons, indexes, and symbols). Roland Barthes applied it to mass culture in Mythologies.',
    '{"roots":[{"morpheme":"semeiotikos","meaning":"observant of signs","origin":"Greek"},{"morpheme":"semeion","meaning":"sign / mark / token","origin":"Greek"}],"cognates":["semantic","semaphore","semiology"]}'::jsonb,
    ARRAY['cultural semiotics', 'semiotic analysis', 'semiotic system', 'field of semiotics'],
    '{"sentence":"Semiology aims to take in any system of signs, whatever their substance and limits; images, gestures, musical sounds, objects: all constitute systems of signification.","source":"Elements of Semiology","author":"Roland Barthes"}'::jsonb,
    ARRAY['In his famous {{c1::semiotics}} essay on French wine and beefsteak, Barthes decoded how food items serve as national mythologies of virility.', 'Fashion designers manipulate the {{c1::semiotics}} of street culture, translating subversive working-class attire into luxury signifiers.'],
    '{"synonyms":["semiotics","linguistics","semantics"],"nuanceComparison":"Semiotics is the overarching science of all signs (verbal, visual, gestural, cultural); linguistics is the specific science of natural verbal languages; semantics is the branch of linguistics studying literal word meaning.","contextRecommendations":[{"word":"semiotics","recommendedRegister":"Cultural Studies / Structuralist","exampleSentence":"Corporate branding relies heavily on visual semiotics to evoke prestige without explicit claims."},{"word":"linguistics","recommendedRegister":"Scientific / Academic","exampleSentence":"Chomsky revolutionized generative linguistics with his theory of universal grammar."},{"word":"semantics","recommendedRegister":"Analytical / Philosophical","exampleSentence":"The debate descended into futile arguments over semantics rather than substantial policy."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000056',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-20T12:00:00.000Z',
    0, 0, 0, 5, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 57: différance
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000057',
    '00000000-0000-0000-0000-000000000000',
    'différance',
    'en',
    'noun',
    '/ˌdiː.feɪˈrɑ̃ːs/',
    'A central deconstructive neologism formulating that meaning in language is perpetually both differing in structure and endlessly deferred in time.',
    'Coined by Jacques Derrida in 1968, deliberately spelled with an "a" to exploit a homophone in French (différence and différance sound identical). Because the difference is audible only in writing, it challenges the classical Western privilege of voice (phonocentrism) over writing.',
    '{"roots":[{"morpheme":"differer","meaning":"to differ / to postpone / to defer","origin":"French"},{"morpheme":"-ance","meaning":"gerund / middle voice indicator","origin":"French"}],"cognates":["difference","deferral"]}'::jsonb,
    ARRAY['derridean différance', 'play of différance', 'concept of différance', 'trace of différance'],
    '{"sentence":"Différance is neither a word nor a concept; it is the non-full, non-simple origin of differences, the movement that produces what it simultaneously suspends.","source":"Margins of Philosophy","author":"Jacques Derrida"}'::jsonb,
    ARRAY['In deconstructive analysis, no text possesses a fixed, final meaning, because the chain of signifiers is caught in an endless play of {{c1::différance}}.', 'Derrida invented the term {{c1::différance}} with an "a" to show that meaning relies on an unpronounced graphic mark invisible to the spoken ear.'],
    '{"synonyms":["différance","indeterminacy","polysemy"],"nuanceComparison":"Différance is the structural movement of endless spatial difference and temporal deferral underlying language; indeterminacy is the general condition of being open-ended or unsettled; polysemy is the capacity of a single word to bear multiple distinct dictionary definitions.","contextRecommendations":[{"word":"différance","recommendedRegister":"Derridean / Deconstructive","exampleSentence":"The stable presence of the author''s intention is dissolved by the restless work of différance."},{"word":"indeterminacy","recommendedRegister":"Literary / Quantum","exampleSentence":"The novel ends in emotional indeterminacy, leaving the couple''s fate unstated."},{"word":"polysemy","recommendedRegister":"Linguistic / Lexicographical","exampleSentence":"The polysemy of the word \"bank\" requires context to determine whether river or financial vault is meant."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000057',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-20T12:00:00.000Z',
    0, 0, 0, 5, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 58: anagnorisis
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000058',
    '00000000-0000-0000-0000-000000000000',
    'anagnorisis',
    'en',
    'noun',
    '/ˌæn.əɡˈnɒr.ɪ.sɪs/',
    'The critical moment of dramatic recognition, sudden revelation, or discovery of true identity and hidden circumstance in a tragedy or epic.',
    'From Aristotle''s Poetics; the transition from ignorance to knowledge. Most celebrated in Sophocles'' Oedipus Rex, where the discovery that Oedipus has killed his father and married his mother coincides with peripeteia (the sudden reversal of fortune).',
    '{"roots":[{"morpheme":"ana-","meaning":"back / again","origin":"Greek"},{"morpheme":"gnorizein","meaning":"to make known / recognize","origin":"Greek"},{"morpheme":"gnosis","meaning":"knowledge","origin":"Greek"}],"cognates":["diagnosis","prognosis","gnostic"]}'::jsonb,
    ARRAY['moment of anagnorisis', 'tragic anagnorisis', 'dramatic anagnorisis', 'experience anagnorisis'],
    '{"sentence":"A discovery (anagnorisis) is, as the very word indicates, a change from ignorance to knowledge, producing love or hate between the persons destined for good or bad fortune.","source":"Poetics","author":"Aristotle"}'::jsonb,
    ARRAY['The climax of King Lear reaches agonizing {{c1::anagnorisis}} when the aged monarch finally recognizes his foolish vanity while cradling Cordelia.', 'In modern psychological drama, {{c1::anagnorisis}} occurs not when a lost child is revealed, but when the protagonist admits their self-deception.'],
    '{"synonyms":["anagnorisis","epiphany","peripeteia"],"nuanceComparison":"Anagnorisis is the dramatic revelation of factual identity or hidden circumstance leading to tragedy; epiphany is a sudden poetic or spiritual manifestation of sacred meaning in everyday life; peripeteia is the sudden reversal of fortune.","contextRecommendations":[{"word":"anagnorisis","recommendedRegister":"Aristotelian / Dramatic Tragedy","exampleSentence":"The tragic hero''s anagnorisis came too late to prevent the catastrophe."},{"word":"epiphany","recommendedRegister":"Joycean / Modernist Literary","exampleSentence":"Gazing at the girl wading in the Dublin tide, Stephen Dedalus experienced a luminous aesthetic epiphany."},{"word":"peripeteia","recommendedRegister":"Classical Dramatic","exampleSentence":"The arrival of the messenger provoked a terrifying peripeteia in the king''s prospects."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000058',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-20T12:00:00.000Z',
    0, 0, 0, 5, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 59: hamartia
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000059',
    '00000000-0000-0000-0000-000000000000',
    'hamartia',
    'en',
    'noun',
    '/ˌhæm.ɑːˈtiː.ə/',
    'The fatal tragic error, miscalculation, moral blind spot, or character defect that precipitates the downfall of a noble protagonist.',
    'In Aristotle''s Poetics, derived from archery ("to miss the mark"). Frequently mistranslated as merely a "fatal flaw" (sin); Aristotle meant an error in judgment or crucial mistake made in ignorance of vital facts by an essentially noble person.',
    '{"roots":[{"morpheme":"hamartanein","meaning":"to miss the mark / to err / fail of one''s purpose","origin":"Greek"},{"morpheme":"-ia","meaning":"abstract noun suffix","origin":"Greek"}],"cognates":["hamartiology"]}'::jsonb,
    ARRAY['tragic hamartia', 'protagonist''s hamartia', 'fateful hamartia', 'rooted in hamartia'],
    '{"sentence":"The change of fortune should not be from bad to good, but, reversely, from good to bad. It should come about as the result not of depravity, but of some great error (hamartia).","source":"Poetics","author":"Aristotle"}'::jsonb,
    ARRAY['Othello''s noble trust and naive credulity become his tragic {{c1::hamartia}} when manipulated by the venomous insinuations of Iago.', 'The CEO''s unyielding confidence, once the driver of her triumphs, turned into a catastrophic {{c1::hamartia}} as market conditions shifted.'],
    '{"synonyms":["hamartia","hubris","fatal flaw"],"nuanceComparison":"Hamartia is the specific tragic error of judgment or fateful misstep (missing the mark); hubris is overweening pride and arrogance defying the gods; fatal flaw is the broader popular characterization of psychological defect.","contextRecommendations":[{"word":"hamartia","recommendedRegister":"Classical / Tragic Theory","exampleSentence":"Oedipus''s hamartia was not malice, but his hasty temper and vow to banish the killer before knowing the truth."},{"word":"hubris","recommendedRegister":"Mythological / Classical","exampleSentence":"Challenging the gods to a weaving contest was the hubris that doomed Arachne."},{"word":"fatal flaw","recommendedRegister":"Screenwriting / Popular Criticism","exampleSentence":"Every Hollywood action protagonist is assigned a relatable fatal flaw in the first act."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000059',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-20T12:00:00.000Z',
    0, 0, 0, 5, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 60: verisimilitude
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000060',
    '00000000-0000-0000-0000-000000000000',
    'verisimilitude',
    'en',
    'noun',
    '/ˌver.ɪ.sɪˈmɪl.ɪ.tjuːd/',
    'The appearance or semblance of truth, plausibility, and realism in a literary, theatrical, or artistic work.',
    'From Latin verus (true) + similis (like). In French classical drama (vraisemblance), it governed decorum and believability; in realism (Balzac, Flaubert, Henry James), it relies on meticulous physical and psychological detail to convince the reader of the world''s reality.',
    '{"roots":[{"morpheme":"verus","meaning":"true / real","origin":"Latin"},{"morpheme":"similis","meaning":"like / resembling","origin":"Latin"},{"morpheme":"-itude","meaning":"state / condition of","origin":"Latin"}],"cognates":["verity","similar","verisimilar"]}'::jsonb,
    ARRAY['air of verisimilitude', 'strive for verisimilitude', 'gritty verisimilitude', 'lend verisimilitude'],
    '{"sentence":"The only reason for the existence of a novel is that it does attempt to represent life. When it relinquishes this, it forfeits all claim to verisimilitude.","source":"The Art of Fiction","author":"Henry James"}'::jsonb,
    ARRAY['The historical novelist spent months researching archaic nautical terminology to lend authentic {{c1::verisimilitude}} to the naval battle.', 'Defoe''s Journal of the Plague Year achieved such uncanny {{c1::verisimilitude}} that contemporaries mistook the fictional account for eyewitness journalism.'],
    '{"synonyms":["verisimilitude","realism","authenticity"],"nuanceComparison":"Verisimilitude is the internal artistic appearance or illusion of truth within fiction; realism is a broad aesthetic movement depicting social reality without idealization; authenticity is genuine historical or emotional truthfulness.","contextRecommendations":[{"word":"verisimilitude","recommendedRegister":"Literary Criticism / Narratology","exampleSentence":"Detailed police procedural jargon lends gritty verisimilitude to the crime drama."},{"word":"realism","recommendedRegister":"Art History / Literary History","exampleSentence":"Nineteenth-century realism rejected the romanticized fantasies of aristocratic romance."},{"word":"authenticity","recommendedRegister":"Historical / Philosophical","exampleSentence":"The antique dealer verified the authenticity of the Renaissance parchment."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000060',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-20T12:00:00.000Z',
    0, 0, 0, 5, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 61: chiasmus
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000061',
    '00000000-0000-0000-0000-000000000000',
    'chiasmus',
    'en',
    'noun',
    '/kaɪˈæz.məs/',
    'A rhetorical or poetic figure in which words, grammatical constructions, or concepts are repeated in reverse parallel order (an A-B-B-A structure).',
    'Named after the Greek letter Chi (X), representing crossing. Contrasted with antimetabole (which repeats the exact identical words in reverse: "eat to live, not live to eat"); chiasmus balances concepts or grammatical structures even if words vary slightly.',
    '{"roots":[{"morpheme":"chiasma","meaning":"crossing / diagonal arrangement","origin":"Greek"},{"morpheme":"chiazein","meaning":"to mark with a cross / shaped like letter Chi (Χ)","origin":"Greek"}],"cognates":["chiasm","chiastic"]}'::jsonb,
    ARRAY['rhetorical chiasmus', 'chiastic structure', 'elegant chiasmus', 'chiastic reversal'],
    '{"sentence":"Milton''s Paradise Lost abounds in profound chiastic inversions: \"Adam, first of men, / To first of women, Eve.\"","source":"Milton''s Grand Style","author":"Christopher Ricks"}'::jsonb,
    ARRAY['John F. Kennedy delivered one of history''s most famous rhetorical instances of {{c1::chiasmus}}: "Ask not what your country can do for you—ask what you can do for your country."', 'The biblical psalm employs a tight {{c1::chiasmus}}, mirroring the opening praise in its concluding benediction.'],
    '{"synonyms":["chiasmus","antimetabole","antithesis"],"nuanceComparison":"Chiasmus is the inverted grammatical or conceptual crossing in A-B-B-A form; antimetabole repeats the exact identical lexical words in reverse; antithesis is the juxtaposition of contrasting ideas in balanced phrases.","contextRecommendations":[{"word":"chiasmus","recommendedRegister":"Classical Rhetoric / Literary Analysis","exampleSentence":"Keats constructed a sublime chiasmus in his ode: \"Beauty is truth, truth beauty.\""},{"word":"antimetabole","recommendedRegister":"Stylistic / Technical Rhetoric","exampleSentence":"The slogan was an antimetabole: \"When the going gets tough, the tough get going.\""},{"word":"antithesis","recommendedRegister":"Oratorical / Compositional","exampleSentence":"Dickens opened with unforgettable antithesis: \"It was the best of times, it was the worst of times.\""}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000061',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-21T12:00:00.000Z',
    0, 0, 0, 6, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 62: synecdoche
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000062',
    '00000000-0000-0000-0000-000000000000',
    'synecdoche',
    'en',
    'noun',
    '/sɪˈnek.də.ki/',
    'A figure of speech in which a part is made to represent the whole, or less commonly, the whole is made to represent a part.',
    'From Greek syn- (together) + ekdoche (taking). Common examples: "all hands on deck" (sailors), "hired hands" (laborers), "wheels" (car), or "the law" (police officer). Kenneth Burke analyzed it as one of the "four master tropes" representing representation itself.',
    '{"roots":[{"morpheme":"syn-","meaning":"together / with","origin":"Greek"},{"morpheme":"ek-","meaning":"out of / from","origin":"Greek"},{"morpheme":"dechesthai","meaning":"to receive / take / accept","origin":"Greek"}],"cognates":["synecdochic"]}'::jsonb,
    ARRAY['use of synecdoche', 'master trope of synecdoche', 'synecdochic relationship', 'visual synecdoche'],
    '{"sentence":"Synecdoche may be especially considered under the heading of representation; the part is selected to represent the quality of the whole.","source":"A Grammar of Motives","author":"Kenneth Burke"}'::jsonb,
    ARRAY['When the general ordered fifty "boots on the ground," he employed military {{c1::synecdoche}} to refer to living soldiers.', 'Cinema uses visual {{c1::synecdoche}}, showing only a pair of pacing shoes to convey an entire restless character.'],
    '{"synonyms":["synecdoche","metonymy","metaphor"],"nuanceComparison":"Synecdoche is representation based on an intrinsic part-to-whole relationship (hands for workers); metonymy is representation based on extrinsic contiguity or association (crown for monarch); metaphor is representation based on imaginative similarity.","contextRecommendations":[{"word":"synecdoche","recommendedRegister":"Rhetorical / Poetic Theory","exampleSentence":"The phrase \"bread and butter\" serves as a domestic synecdoche for one''s entire livelihood."},{"word":"metonymy","recommendedRegister":"Linguistic / Poetics","exampleSentence":"The White House issued an official press release, using metonymy to designate the presidential administration."},{"word":"metaphor","recommendedRegister":"Universal Literary","exampleSentence":"Shakespeare described all the world as a stage."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000062',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-21T12:00:00.000Z',
    0, 0, 0, 6, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 63: metonymy
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000063',
    '00000000-0000-0000-0000-000000000000',
    'metonymy',
    'en',
    'noun',
    '/mɪˈtɒn.ɪ.mi/',
    'A figure of speech in which an entity or concept is referred to by the name of an attribute or closely associated concept.',
    'Linguist Roman Jakobson formulated that human language operates across two fundamental poles: the metaphoric pole (based on similarity and substitution) and the metonymic pole (based on contiguity and context). Realist prose leans heavily on the metonymic pole.',
    '{"roots":[{"morpheme":"meta-","meaning":"change / transfer","origin":"Greek"},{"morpheme":"onoma","meaning":"name","origin":"Greek"}],"cognates":["pseudonym","synonym","metonymic"]}'::jsonb,
    ARRAY['jakobsonian metonymy', 'metonymic substitution', 'rely on metonymy', 'metonymic association'],
    '{"sentence":"The competition between both devices, metonymic and metaphoric, is manifest in any symbolic process, either intrapersonal or social.","source":"Two Aspects of Language and Two Types of Aphasic Disturbances","author":"Roman Jakobson"}'::jsonb,
    ARRAY['In the adage "the pen is mightier than the sword," both "pen" (for the written word) and "sword" (for military violence) function via {{c1::metonymy}}.', 'Financial journalists routinely use "Wall Street" as a convenient {{c1::metonymy}} for the entire American investment banking apparatus.'],
    '{"synonyms":["metonymy","synecdoche","symbol"],"nuanceComparison":"Metonymy replaces a concept with a contiguous, associated external entity (the press for journalism); synecdoche replaces a concept with an intrinsic physical part (sail for boat); symbol is an arbitrary cultural token invested with transcendent meaning.","contextRecommendations":[{"word":"metonymy","recommendedRegister":"Linguistic / Stylistic","exampleSentence":"In Shakespeare''s history plays, \"the crown\" is the tragic metonymy for sovereign burden and mortal ambition."},{"word":"synecdoche","recommendedRegister":"Rhetorical / Poetic","exampleSentence":"Calling a businessman a \"suit\" is a dismissive synecdoche."},{"word":"symbol","recommendedRegister":"Literary / Semiotic","exampleSentence":"The green light in The Great Gatsby operates as an evocative symbol of unattainable romantic longing."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000063',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-21T12:00:00.000Z',
    0, 0, 0, 6, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 64: catachresis
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000064',
    '00000000-0000-0000-0000-000000000000',
    'catachresis',
    'en',
    'noun',
    '/ˌkæt.əˈkriː.sɪs/',
    'The deliberate, strained, or paradoxical misuse of a word or metaphor that radically violates conventional linguistic norms, or names a phenomenon lacking a literal term.',
    'In classical rhetoric (Quintilian), a necessary strained metaphor when language lacks a proper word (e.g., "the leg of a table" or "arms of a chair"); in post-structuralism (Derrida, Spivak), the foundational condition of concepts like "democracy" or "justice" that exceed any single literal referent.',
    '{"roots":[{"morpheme":"kata-","meaning":"against / down / perversion of","origin":"Greek"},{"morpheme":"chresis","meaning":"use / employment","origin":"Greek"}],"cognates":["catachrestic"]}'::jsonb,
    ARRAY['daring catachresis', 'poetic catachresis', 'border on catachresis', 'strain of catachresis'],
    '{"sentence":"Catachresis is the violent application of a word to an object for which no proper, literal word exists in language.","source":"Institutio Oratoria","author":"Quintilian"}'::jsonb,
    ARRAY['Hamlet''s famous dilemma to "take arms against a sea of troubles" is a celebrated {{c1::catachresis}}, violently mixing martial weaponry with an oceanic metaphor.', 'Spivak argued that claiming "rights" for the subaltern is an enabling {{c1::catachresis}}, borrowing an imperial Western vocabulary to demand postcolonial justice.'],
    '{"synonyms":["catachresis","mixed metaphor","malapropism"],"nuanceComparison":"Catachresis is the deliberate, profound, or necessary stretching of language beyond conventional bounds; mixed metaphor is an awkward, unintended clash of incompatible imagery; malapropism is the comical, ignorant substitution of a similar-sounding wrong word.","contextRecommendations":[{"word":"catachresis","recommendedRegister":"Rhetorical / Deconstructive","exampleSentence":"The metaphysical poets embraced catachresis, yoking violently dissimilar ideas together by force."},{"word":"mixed metaphor","recommendedRegister":"Stylistic / Editorial","exampleSentence":"The politician stumbled into a mixed metaphor: \"We must iron out our hurdles and sail to victory.\""},{"word":"malapropism","recommendedRegister":"Comedic / Literary","exampleSentence":"Mrs. Malaprop''s boast that someone was \"as headstrong as an allegory on the banks of the Nile\" is the archetypal malapropism."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000064',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-21T12:00:00.000Z',
    0, 0, 0, 6, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 65: elegiac
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000065',
    '00000000-0000-0000-0000-000000000000',
    'elegiac',
    'en',
    'adjective',
    '/ˌel.ɪˈdʒaɪ.ək/',
    'Mournful, sorrowful, or plaintive; expressing profound lamentation and melancholic longing for what is past, dead, or irrecoverably lost.',
    'Originally derived from the classical Greek elegiac couplet (dactylic hexameter paired with pentameter). Extended in modern literature to describe works (W.G. Sebald, Rilke, Thomas Hardy) bathed in quiet, dignified grief over transience and historical ruins.',
    '{"roots":[{"morpheme":"elegos","meaning":"song of mourning / lament","origin":"Greek"},{"morpheme":"-iac","meaning":"pertaining to / resembling","origin":"Greek"}],"cognates":["elegy"]}'::jsonb,
    ARRAY['elegiac tone', 'elegiac prose', 'elegiac lament', 'elegiac beauty'],
    '{"sentence":"Sebald''s novels unfold with an elegiac gravity, documenting the silent decay of European landscapes and the fading memory of vanished peoples.","source":"The Rings of Saturn (Critical Introduction)","author":"Susan Sontag"}'::jsonb,
    ARRAY['The cello suite closed on a sustained, {{c1::elegiac}} chord that lingered in the darkened concert hall like a dying whisper.', 'Virginia Woolf captured an intensely {{c1::elegiac}} mood in To the Lighthouse, mourning the golden family summers shattered by the Great War.'],
    '{"synonyms":["elegiac","sepulchral","melancholic"],"nuanceComparison":"Elegiac expresses tender, dignified poetic sorrow for a lost past or deceased loved one; sepulchral evokes the gloomy, chilling atmosphere of a tomb; melancholic denotes a lingering, introspective, habitual sadness.","contextRecommendations":[{"word":"elegiac","recommendedRegister":"Poetic / High Literary","exampleSentence":"Gray''s \"Elegy Written in a Country Churchyard\" established the supreme English model of elegiac contemplation."},{"word":"sepulchral","recommendedRegister":"Gothic / Somber","exampleSentence":"The castle crypt echoed with a cold, sepulchral stillness."},{"word":"melancholic","recommendedRegister":"Psychological / Artistic","exampleSentence":"Chopin''s nocturnes radiate a delicate, melancholic tenderness."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000065',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-21T12:00:00.000Z',
    0, 0, 0, 6, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 66: apotheosis
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000066',
    '00000000-0000-0000-0000-000000000000',
    'apotheosis',
    'en',
    'noun',
    '/əˌpɒθ.iˈoʊ.sɪs/',
    'The elevation of a person to the status of a deity (deification); or the supreme, idealized culmination and highest point of an art or principle.',
    'In ancient Rome, the formal deification of deceased emperors voted by the Senate. In aesthetic theory and cultural criticism, it denotes the quintessential, glorious apex of a style, movement, or heroic endeavor.',
    '{"roots":[{"morpheme":"apo-","meaning":"away / from / completely","origin":"Greek"},{"morpheme":"theos","meaning":"god / deity","origin":"Greek"},{"morpheme":"-osis","meaning":"process / condition of","origin":"Greek"}],"cognates":["theology","atheism","pantheon","apotheosize"]}'::jsonb,
    ARRAY['apotheosis of art', 'reach an apotheosis', 'cultural apotheosis', 'apotheosis of the hero'],
    '{"sentence":"Beethoven''s Seventh Symphony was famously celebrated by Richard Wagner as the very apotheosis of the dance, humanity''s physical joy sublimated into pure rhythm.","source":"The Artwork of the Future","author":"Richard Wagner"}'::jsonb,
    ARRAY['The ceiling fresco in the cathedral depicted the glorious {{c1::apotheosis}} of Saint Ignatius ascending into heavenly celestial light.', 'Critics hailed the author''s sprawling trilogy as the ultimate {{c1::apotheosis}} of the twentieth-century psychological novel.'],
    '{"synonyms":["apotheosis","zenith","canonization"],"nuanceComparison":"Apotheosis implies glorification or elevation to divine, transcendent stature; zenith marks the highest astronomical or chronological point of power or success; canonization is the formal admission of a person or text into an official list of saints or classic masterpieces.","contextRecommendations":[{"word":"apotheosis","recommendedRegister":"Classical / High Aesthetic","exampleSentence":"The coronation banquet represented the theatrical apotheosis of the monarch''s supreme power."},{"word":"zenith","recommendedRegister":"Astronomical / Metaphorical","exampleSentence":"The Roman Empire reached the zenith of its territorial expanse under Trajan."},{"word":"canonization","recommendedRegister":"Theological / Academic","exampleSentence":"The academic canonization of James Joyce took place within decades of his death."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000066',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-21T12:00:00.000Z',
    0, 0, 0, 6, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 67: liminality
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000067',
    '00000000-0000-0000-0000-000000000000',
    'liminality',
    'en',
    'noun',
    '/ˌlɪm.ɪˈnæl.ɪ.ti/',
    'The transitional, ambiguous, and disorienting threshold state of being between two distinct existential, social, or spatial phases.',
    'Developed by folklorist Arnold van Gennep (Rites of Passage) and expanded by anthropologist Victor Turner. During the liminal phase, individuals are "betwixt and between" established roles, experiencing communitas, vulnerability, and radical openness to transformation.',
    '{"roots":[{"morpheme":"limen","meaning":"threshold / lintel / doorway","origin":"Latin"},{"morpheme":"-al","meaning":"pertaining to","origin":"Latin"},{"morpheme":"-ity","meaning":"state / quality of","origin":"Latin"}],"cognates":["subliminal","eliminate","limit"]}'::jsonb,
    ARRAY['liminal space', 'state of liminality', 'experience liminality', 'liminal threshold'],
    '{"sentence":"Liminal entities are neither here nor there; they are betwixt and between the positions assigned and arrayed by law, custom, convention, and ceremonial.","source":"The Forest of Symbols: Aspects of Ndembu Ritual","author":"Victor Turner"}'::jsonb,
    ARRAY['Empty airport terminals at three in the morning possess an eerie {{c1::liminality}}, suspended between departure and destination.', 'The period of adolescence is defined by psychological {{c1::liminality}}, as the youth sheds childhood without yet attaining adult autonomy.'],
    '{"synonyms":["liminality","transition","purgatory"],"nuanceComparison":"Liminality is the specific anthropological and existential state of being on a transformational threshold; transition is any generic change from one state to another; purgatory is a state of spiritual suffering or purification before deliverance.","contextRecommendations":[{"word":"liminality","recommendedRegister":"Anthropological / Cultural Theory","exampleSentence":"Graduation rituals mark the formal end of collegiate liminality."},{"word":"transition","recommendedRegister":"Everyday / Corporate","exampleSentence":"The company managed a smooth executive transition over six months."},{"word":"purgatory","recommendedRegister":"Theological / Metaphorical","exampleSentence":"He felt trapped in bureaucratic purgatory waiting for his visa approval."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000067',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-21T12:00:00.000Z',
    0, 0, 0, 6, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 68: catharsis
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000068',
    '00000000-0000-0000-0000-000000000000',
    'catharsis',
    'en',
    'noun',
    '/kəˈθɑː.sɪs/',
    'The emotional release, purification, or purgation of pity and fear evoked in an audience through experiencing tragic art.',
    'Aristotle''s Poetics; tragic drama does not inflame antisocial passions (as Plato feared), but provides a homeopathic cleansing of excess pity (eleos) and terror (phobos), restoring psychic and civic equilibrium. Plural: catharses.',
    '{"roots":[{"morpheme":"katharsis","meaning":"cleansing / purification","origin":"Greek"},{"morpheme":"katharos","meaning":"pure / clean / clear","origin":"Greek"}],"cognates":["cathartic","Cathar"]}'::jsonb,
    ARRAY['emotional catharsis', 'dramatic catharsis', 'catharsis of tragedy', 'achieve catharsis'],
    '{"sentence":"Tragedy is an imitation of an action that is serious, complete, and of a certain magnitude; through pity and fear effecting the proper purgation (catharsis) of these emotions.","source":"Poetics","author":"Aristotle"}'::jsonb,
    ARRAY['Weeping openly at the climax of the opera provided the audience with a profound sense of shared {{c1::catharsis}}.', 'Writing the memoir was not merely an act of memory, but a painful psychological {{c1::catharsis}} releasing decades of trauma.'],
    '{"synonyms":["catharsis","abreaction","purification"],"nuanceComparison":"Catharsis is the aesthetic and spiritual purgation of pity and fear through dramatic art; abreaction is the psychoanalytic release of repressed emotional trauma through reliving it; purification is moral or ritual cleansing of guilt or stain.","contextRecommendations":[{"word":"catharsis","recommendedRegister":"Aristotelian / Theatrical / Literary","exampleSentence":"The final reconciliation in King Lear offers the spectators heartbreaking catharsis."},{"word":"abreaction","recommendedRegister":"Freudian / Clinical Psychoanalysis","exampleSentence":"The therapist facilitated the patient''s abreaction of early childhood grief."},{"word":"purification","recommendedRegister":"Ritual / Religious","exampleSentence":"Pilgrims underwent ceremonial purification before entering the inner sanctum."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000068',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-21T12:00:00.000Z',
    0, 0, 0, 6, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 69: bathos
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000069',
    '00000000-0000-0000-0000-000000000000',
    'bathos',
    'en',
    'noun',
    '/ˈbeɪ.θɒs/',
    'An abrupt and ludicrous descent from the elevated, sublime, or tragic to the trivial, common, or ridiculous; anticlimax.',
    'Introduced into English criticism by Alexander Pope in his 1727 treatise Peri Bathous, or the Art of Sinking in Poetry. Bathos can be an accidental poetic failure of bad verse or a deliberate comic device employed by satirists.',
    '{"roots":[{"morpheme":"bathos","meaning":"depth / deep water","origin":"Greek"},{"morpheme":"bathys","meaning":"deep / profound","origin":"Greek"}],"cognates":["bathymetry","bathysphere"]}'::jsonb,
    ARRAY['descent into bathos', 'unintentional bathos', 'plunge into bathos', 'steeped in bathos'],
    '{"sentence":"The poet who aims at the sublime without the wings of genius inevitably plunges headlong into bathos, sinking from the sublime to the ridiculous.","source":"Peri Bathous: Or, The Art of Sinking in Poetry","author":"Alexander Pope"}'::jsonb,
    ARRAY['The eulogy began with majestic solemnity, but collapsed into unintentional {{c1::bathos}} when the speaker complained about parking tickets.', 'Romantic melodrama frequently walks a razor''s edge between transcendent heartbreak and laughable {{c1::bathos}}.'],
    '{"synonyms":["bathos","pathos","anticlimax"],"nuanceComparison":"Bathos is the failed or comical plummet from sublime grandeur to trivial banality; pathos is genuine, moving pity and compassion; anticlimax is any disappointing conclusion to building narrative tension.","contextRecommendations":[{"word":"bathos","recommendedRegister":"Literary Satire / Rhetorical Critique","exampleSentence":"Pope exposed the bathos of contemporary court poets whose grand metaphors crashed into clumsy banalities."},{"word":"pathos","recommendedRegister":"Dramatic / Artistic","exampleSentence":"The dying soldier''s last letter was filled with heartbreaking pathos."},{"word":"anticlimax","recommendedRegister":"Narrative / Everyday","exampleSentence":"After weeks of media frenzy, the verdict was a dull anticlimax."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000069',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-21T12:00:00.000Z',
    0, 0, 0, 6, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 70: anaphora
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000070',
    '00000000-0000-0000-0000-000000000000',
    'anaphora',
    'en',
    'noun',
    '/əˈnæf.ər.ə/',
    'The rhetorical repetition of a word or phrase at the beginning of successive clauses, sentences, or verses for emotional emphasis or rhythmic power.',
    'A cornerstone of prophetic, political, and poetic oratory. Classic examples: Winston Churchill ("We shall fight on the beaches, we shall fight on the landing grounds..."), Martin Luther King Jr. ("I have a dream..."), and Charles Dickens ("It was the best of times...").',
    '{"roots":[{"morpheme":"ana-","meaning":"back / again","origin":"Greek"},{"morpheme":"pherein","meaning":"to bear / carry","origin":"Greek"}],"cognates":["aphorism","metaphor","transfer"]}'::jsonb,
    ARRAY['rhetorical anaphora', 'use of anaphora', 'poetic anaphora', 'resonant anaphora'],
    '{"sentence":"Whitman''s free verse derived its majestic, rolling energy from liturgical anaphora, beginning line after line with the same rolling incantation.","source":"The Ecstatic Whitman","author":"Harold Bloom"}'::jsonb,
    ARRAY['Dr. King''s repeating phrase "I have a dream" is the most celebrated instance of {{c1::anaphora}} in twentieth-century American public rhetoric.', 'The protest chant deployed rhythmic {{c1::anaphora}} to weld the crowd into a unified chorus of moral outrage.'],
    '{"synonyms":["anaphora","epistrophe","refrain"],"nuanceComparison":"Anaphora is the repetition of words at the beginning of successive clauses; epistrophe is repetition at the end of clauses (\"government of the people, by the people, for the people\"); refrain is a recurring verse or chorus across a poem.","contextRecommendations":[{"word":"anaphora","recommendedRegister":"Classical Rhetoric / Oratory","exampleSentence":"Churchill''s stirring anaphora rallied British resolve during the darkest days of the Blitz."},{"word":"epistrophe","recommendedRegister":"Rhetorical / Stylistic","exampleSentence":"The defense attorney used epistrophe to pound the phrase \"beyond reasonable doubt\" into the jury''s mind."},{"word":"refrain","recommendedRegister":"Poetic / Musical","exampleSentence":"Poe''s raven croaks the haunting refrain \"Nevermore.\""}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000070',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-21T12:00:00.000Z',
    0, 0, 0, 6, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 71: litotes
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000071',
    '00000000-0000-0000-0000-000000000000',
    'litotes',
    'en',
    'noun',
    '/laɪˈtoʊ.tiːz/',
    'A deliberate figure of rhetorical understatement in which an affirmative idea is expressed by negating its contrary.',
    'Common in Anglo-Saxon heroic poetry (Beowulf) and classical satire to convey irony, modesty, or restrained grim humor. Examples: "he is not unfamiliar with defeat," "no small feat," or "she was not unhappy with the outcome."',
    '{"roots":[{"morpheme":"litos","meaning":"plain / simple / slender / meager","origin":"Greek"},{"morpheme":"-tes","meaning":"abstract noun suffix","origin":"Greek"}],"cognates":["litotic"]}'::jsonb,
    ARRAY['master of litotes', 'ironic litotes', 'employ litotes', 'classic litotes'],
    '{"sentence":"Old English poetry eschews flamboyant boasting in favor of grim litotes; a deadly wound is described laconically as \"not the most gentle of greetings.\"","source":"The Heroic Age of English Literature","author":"J.R.R. Tolkien"}'::jsonb,
    ARRAY['To describe winning the Nobel Prize as "not bad for an afternoon''s work" is an exquisite example of comedic {{c1::litotes}}.', 'British diplomatic prose has long favored dry {{c1::litotes}} to defuse escalating geopolitical crises.'],
    '{"synonyms":["litotes","understatement","hyperbole"],"nuanceComparison":"Litotes is understatement achieved specifically by negating the opposite (\"not insignificant\"); understatement is any presentation of things as smaller or less important than they are; hyperbole is deliberate, wild exaggeration.","contextRecommendations":[{"word":"litotes","recommendedRegister":"Rhetorical / Stylistic","exampleSentence":"Her litotes (\"the concert was not entirely without merit\") barely masked her severe disappointment."},{"word":"understatement","recommendedRegister":"Conversational / British English","exampleSentence":"Saying the hurricane was \"a bit breezy\" is classic British understatement."},{"word":"hyperbole","recommendedRegister":"Rhetorical / Commercial","exampleSentence":"The movie trailer was filled with wild hyperbole, claiming it was the greatest film in human history."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000071',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-22T12:00:00.000Z',
    0, 0, 0, 7, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 72: zeugma
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000072',
    '00000000-0000-0000-0000-000000000000',
    'zeugma',
    'en',
    'noun',
    '/ˈzjuːɡ.mə/',
    'A figure of speech in which a single word (usually a verb or adjective) applies grammatically to two others in markedly different, often literal and figurative, senses.',
    'From Greek zeugnynai (to yoke). Used brilliantly by Alexander Pope and eighteenth-century satirists: "Here, thou, great Anna! whom three realms obey, / Dost sometimes counsel take—and sometimes tea." Often used interchangeably with syllepsis.',
    '{"roots":[{"morpheme":"zeugma","meaning":"a yoking / bond","origin":"Greek"},{"morpheme":"zeugnynai","meaning":"to yoke / join together","origin":"Greek"}],"cognates":["zygote","syzygy"]}'::jsonb,
    ARRAY['deliberate zeugma', 'poetic zeugma', 'witty zeugma', 'employ a zeugma'],
    '{"sentence":"The eighteenth-century heroic couplet perfected the zeugma, yoking elevated moral virtue to domestic vanity within a single mocking verb.","source":"The Poetry of Pope","author":"G. Wilson Knight"}'::jsonb,
    ARRAY['The rogue left the tavern having broken two promises, three glasses, and her heart—a textbook example of {{c1::zeugma}}.', 'Alexander Pope famously mocked high-society gossip in The Rape of the Lock by uniting stain of honor and stain of silk through biting {{c1::zeugma}}.'],
    '{"synonyms":["zeugma","syllepsis","pun"],"nuanceComparison":"Zeugma yokes two nouns to one verb in different semantic registers; syllepsis is a grammatically correct zeugma where the verb holds different meanings for each noun; pun is any humorous wordplay on homophones or ambiguity.","contextRecommendations":[{"word":"zeugma","recommendedRegister":"Rhetorical / Augustan Satire","exampleSentence":"The weary traveler took his hat and his leave, a neat zeugma closing the chapter."},{"word":"syllepsis","recommendedRegister":"Grammatical / Linguistic","exampleSentence":"\"She blew my mind and my birthday candles\" is a modern syllepsis."},{"word":"pun","recommendedRegister":"Comedic / Popular","exampleSentence":"He made an awful pun about bakers needing to make some dough."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000072',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-22T12:00:00.000Z',
    0, 0, 0, 7, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 73: aposiopesis
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000073',
    '00000000-0000-0000-0000-000000000000',
    'aposiopesis',
    'en',
    'noun',
    '/ˌæp.ə.saɪ.əˈpiː.sɪs/',
    'An abrupt breaking off in the middle of a sentence, leaving the utterance syntactically incomplete due to overwhelming emotion, hesitation, or threat.',
    'Classic Latin example: Neptune in the Aeneid ("Quos ego—! sed motos praestat componere fluctus" — "Whom I—! but it is better to calm the troubled waves"). The speaker halts, allowing the unspoken wrath or grief to hang in the air.',
    '{"roots":[{"morpheme":"apo-","meaning":"away / off / from","origin":"Greek"},{"morpheme":"siopan","meaning":"to be silent","origin":"Greek"},{"morpheme":"siope","meaning":"silence","origin":"Greek"}],"cognates":["aposiopetic"]}'::jsonb,
    ARRAY['rhetorical aposiopesis', 'dramatic aposiopesis', 'lapse into aposiopesis', 'sudden aposiopesis'],
    '{"sentence":"Lear''s rage fractures language into terrifying aposiopesis: \"I will have such revenges on you both, / That all the world shall—I will do such things— / What they are, yet I know not.\"","source":"Shakespearean Tragedy","author":"A.C. Bradley"}'::jsonb,
    ARRAY['Choked with sudden tears upon seeing his ancestral home in ashes, his speech trailed off into heart-wrenching {{c1::aposiopesis}}.', 'The villain uttered a dark threat that broke off into sinister {{c1::aposiopesis}}: "Cross me once more, and you shall—well, you know the consequences."'],
    '{"synonyms":["aposiopesis","ellipsis","paralipsis"],"nuanceComparison":"Aposiopesis is an impassioned, sudden stopping mid-sentence leaving thought unfinished; ellipsis is the grammatical omission of words understood from context (or typographical dots ...); paralipsis is stating that one will not mention something while mentioning it.","contextRecommendations":[{"word":"aposiopesis","recommendedRegister":"Dramatic / Rhetorical Analysis","exampleSentence":"The actor''s sudden aposiopesis communicated the character''s unspoken trauma more eloquently than monologues."},{"word":"ellipsis","recommendedRegister":"Grammatical / Punctuation","exampleSentence":"The editor used an ellipsis to condense the lengthy quote."},{"word":"paralipsis","recommendedRegister":"Political / Oratorical","exampleSentence":"Saying \"I shall not mention my opponent''s criminal indictment\" is classic paralipsis."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000073',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-22T12:00:00.000Z',
    0, 0, 0, 7, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 74: prolepsis
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000074',
    '00000000-0000-0000-0000-000000000000',
    'prolepsis',
    'en',
    'noun',
    '/proʊˈlep.sɪs/',
    'The anticipation and answering of an objection before it is raised; or in narratology, an anachronous flash-forward to future events.',
    'In classical rhetoric (Greek pro- [before] + lambanein [to take]), refuting an opponent''s argument in advance; in narratology (Genette), a flash-forward that reveals future narrative events ahead of chronological time (contrasted with analepsis, or flashback).',
    '{"roots":[{"morpheme":"pro-","meaning":"before / in front of","origin":"Greek"},{"morpheme":"lambanein","meaning":"to take / seize","origin":"Greek"},{"morpheme":"-sis","meaning":"process / condition","origin":"Greek"}],"cognates":["proleptic","epilepsy","catalepsy"]}'::jsonb,
    ARRAY['rhetorical prolepsis', 'narrative prolepsis', 'proleptic anticipation', 'employ prolepsis'],
    '{"sentence":"Garcia Marquez opens One Hundred Years of Solitude with the most celebrated prolepsis in world literature: \"Many years later, as he faced the firing squad...\"","source":"Narrative Discourse","author":"Gérard Genette"}'::jsonb,
    ARRAY['Anticipating the skeptical panel, the scientist used {{c1::prolepsis}} to refute potential criticisms of her methodology in the introductory slide.', 'The opening sentence of the novel executes a breathtaking {{c1::prolepsis}}, revealing the protagonist''s eventual execution before chronicling his youth.'],
    '{"synonyms":["prolepsis","analepsis","foreshadowing"],"nuanceComparison":"Prolepsis is an explicit narrative flash-forward jumping directly into future events; analepsis is an explicit flashback jumping backward; foreshadowing provides subtle, indirect hints and omens of what is to come without revealing the event.","contextRecommendations":[{"word":"prolepsis","recommendedRegister":"Narratological / Rhetorical","exampleSentence":"The biography used prolepsis to frame the young artist''s apprentice sketches against his final masterpieces."},{"word":"analepsis","recommendedRegister":"Formalist / Film Studies","exampleSentence":"The film relies on extended analepsis to explain how the detective became cynical."},{"word":"foreshadowing","recommendedRegister":"Literary / Dramatic","exampleSentence":"The raven perched above the door served as chilling foreshadowing of tragedy."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000074',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-22T12:00:00.000Z',
    0, 0, 0, 7, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 75: periphrasis
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000075',
    '00000000-0000-0000-0000-000000000000',
    'periphrasis',
    'en',
    'noun',
    '/pəˈrɪf.rə.sɪs/',
    'The use of indirect, roundabout, or circumlocutory language to express an idea that could be stated more concisely.',
    'From Greek peri- (around) + phrazein (to speak). Found in high epic decorum (e.g., Homer calling the sea "the wine-dark deep" or Milton calling the sun "the great luminary of day") and in diplomatic or bureaucratic euphemism. Plural: periphrases.',
    '{"roots":[{"morpheme":"peri-","meaning":"around / about","origin":"Greek"},{"morpheme":"phrazein","meaning":"to speak / express / point out","origin":"Greek"}],"cognates":["phrase","paraphrase","periphrastic"]}'::jsonb,
    ARRAY['elaborate periphrasis', 'use of periphrasis', 'poetic periphrasis', 'periphrastic style'],
    '{"sentence":"Neoclassical poets elevated common realities through ornate periphrasis, preferring to speak of \"the finny tribe\" rather than humble fish.","source":"The Augustan World","author":"A.R. Humphreys"}'::jsonb,
    ARRAY['Instead of simply saying he died, the obituary indulged in florid {{c1::periphrasis}}, announcing that he had "embarked on the eternal voyage to the silent shore."', 'Legal contracts often rely on tedious {{c1::periphrasis}} to ensure no loophole remains unclosed.'],
    '{"synonyms":["periphrasis","circumlocution","euphemism"],"nuanceComparison":"Periphrasis is the stylistic or poetic use of a descriptive roundabout phrase instead of a single name; circumlocution is evasive or long-winded wordiness; euphemism is substituting an inoffensive phrase for a harsh or taboo reality.","contextRecommendations":[{"word":"periphrasis","recommendedRegister":"Rhetorical / Classical Stylistics","exampleSentence":"Calling the morning \"the rosy-fingered dawn\" is an immortal Homeric periphrasis."},{"word":"circumlocution","recommendedRegister":"Administrative / Critical","exampleSentence":"The politician answered the direct question with five minutes of evasive circumlocution."},{"word":"euphemism","recommendedRegister":"Sociological / Everyday","exampleSentence":"\"Passing away\" is a tender euphemism for death."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000075',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-22T12:00:00.000Z',
    0, 0, 0, 7, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 76: apostrophe
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000076',
    '00000000-0000-0000-0000-000000000000',
    'apostrophe',
    'en',
    'noun',
    '/əˈpɒs.trə.fi/',
    'A rhetorical or poetic device in which the speaker directly addresses an absent person, deceased figure, inanimate object, or abstract personified concept.',
    'From Greek apo- (away) + strephein (to turn), originally describing an orator turning away from the jury to address an absent deity or concept. Famous in Romantic poetry: Wordsworth''s "Milton! thou shouldst be living at this hour," or Shelley''s address to the West Wind.',
    '{"roots":[{"morpheme":"apo-","meaning":"away / off / from","origin":"Greek"},{"morpheme":"strephein","meaning":"to turn","origin":"Greek"}],"cognates":["catastrophe","strophe","antistrophe"]}'::jsonb,
    ARRAY['rhetorical apostrophe', 'poetic apostrophe', 'address via apostrophe', 'impassioned apostrophe'],
    '{"sentence":"Apostrophe is the central trope of Romantic lyric; the poet attempts to animate the inanimate universe, turning directly to the wind, the urn, or the nightingale.","source":"The Pursuit of Signs: Semiotics, Literature, Deconstruction","author":"Jonathan Culler"}'::jsonb,
    ARRAY['Keats''s "Ode on a Grecian Urn" begins with an intimate poetic {{c1::apostrophe}}: "Thou still unravish''d bride of quietness!"', 'Standing before the crumbling ruins of the forum, the orator broke into an impassioned {{c1::apostrophe}} to the departed spirit of the Roman Republic.'],
    '{"synonyms":["apostrophe","personification","invocation"],"nuanceComparison":"Apostrophe is the direct vocal address to an absent entity or abstraction; personification is attributing human qualities to non-human things; invocation is a prayerful call to a muse or deity for poetic assistance.","contextRecommendations":[{"word":"apostrophe","recommendedRegister":"Rhetorical / Poetics","exampleSentence":"Hamlet''s cry \"Frailty, thy name is woman!\" is a bitter apostrophe to an abstract concept."},{"word":"personification","recommendedRegister":"Literary / Figurative","exampleSentence":"The weeping willow was described as personification of sorrow."},{"word":"invocation","recommendedRegister":"Epic / Classical","exampleSentence":"Homer opens the Iliad with an epic invocation to the Muse."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000076',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-22T12:00:00.000Z',
    0, 0, 0, 7, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 77: hypallage
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000077',
    '00000000-0000-0000-0000-000000000000',
    'hypallage',
    'en',
    'noun',
    '/haɪˈpæl.ə.dʒi/',
    'A figure of speech in which an epithet or modifier is displaced from its natural grammatical subject to another related noun in the sentence; a transferred epithet.',
    'From Greek hypo- (under) + allassein (to change/exchange). Classic poetic examples: "the sleepless night" (the night isn''t sleepless, the person is), "a careless cigarette," or Virgil''s "they walked dark in the lonely night."',
    '{"roots":[{"morpheme":"hypo-","meaning":"under / beneath","origin":"Greek"},{"morpheme":"allassein","meaning":"to change / exchange / alternate","origin":"Greek"}],"cognates":["parallel","allegory"]}'::jsonb,
    ARRAY['transferred epithet hypallage', 'poetic hypallage', 'use of hypallage', 'subtle hypallage'],
    '{"sentence":"T.S. Eliot perfected modern hypallage in The Love Song of J. Alfred Prufrock: \"The yellow fog that rubs its back upon the window-panes.\"","source":"The Composition of Four Quartets","author":"Helen Gardner"}'::jsonb,
    ARRAY['When the weary traveler spoke of his "restless pillow," he utilized {{c1::hypallage}} to transfer his insomnia onto an inanimate object.', 'Virgil''s famous line describing how the travelers walked "lonely in the dark night" is an unforgettable classical {{c1::hypallage}}.'],
    '{"synonyms":["hypallage","transferred epithet","metonymy"],"nuanceComparison":"Hypallage is the specific grammatical transfer of an adjective from its logical subject to another noun; transferred epithet is the modern English term for the same device; metonymy is substituting one noun for an associated noun.","contextRecommendations":[{"word":"hypallage","recommendedRegister":"Classical Philology / Stylistics","exampleSentence":"Milton''s \"blind mouths\" in Lycidas is an aggressive theological hypallage condemning corrupt bishops."},{"word":"transferred epithet","recommendedRegister":"General Literary Analysis","exampleSentence":"The novelist wrote of a \"nervous cigarette,\" employing a transferred epithet."},{"word":"metonymy","recommendedRegister":"Linguistic / Poetics","exampleSentence":"Using \"the bench\" to refer to judges is metonymy, not hypallage."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000077',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-22T12:00:00.000Z',
    0, 0, 0, 7, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 78: synesthesia
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000078',
    '00000000-0000-0000-0000-000000000000',
    'synesthesia',
    'en',
    'noun',
    '/ˌsɪn.əsˈθiː.ʒə/',
    'The poetic or neurological blending of sensory modalities, in which the stimulation of one sense evokes sensations typical of another (e.g., tasting sounds, hearing colors).',
    'Celebrated by French Symbolist poets (Baudelaire''s "Correspondances," Rimbaud''s "Voyelles" assigning colors to vowels). It became central to modernism as a technique to dissolve rigid empirical boundaries into poetic wholeness.',
    '{"roots":[{"morpheme":"syn-","meaning":"together / union","origin":"Greek"},{"morpheme":"aisthesis","meaning":"sensation / perception","origin":"Greek"}],"cognates":["aesthetic","anesthesia","kinesthesia"]}'::jsonb,
    ARRAY['poetic synesthesia', 'experience synesthesia', 'synesthetic imagery', 'cross-modal synesthesia'],
    '{"sentence":"Like long-held echoes blending in the distance / In a profound and shadowy unity / Vast as the night and as the illumination, / Perfumes, colors, and sounds correspond.","source":"Les Fleurs du Mal (Correspondances)","author":"Charles Baudelaire"}'::jsonb,
    ARRAY['The wine critic indulged in florid {{c1::synesthesia}}, describing the dry Riesling as possessing "a sharp green trumpet note."', 'Baudelaire''s symbolist poetry celebrated {{c1::synesthesia}}, weaving scents, visual tints, and musical harmonies into sacred correspondence.'],
    '{"synonyms":["synesthesia","sensory blending","hallucination"],"nuanceComparison":"Synesthesia is the involuntary cross-modal sensory linkage or poetic metaphor combining senses; sensory blending is general integration of perception; hallucination is false perception without sensory stimulus.","contextRecommendations":[{"word":"synesthesia","recommendedRegister":"Poetic / Neurological","exampleSentence":"Nabokov possessed colored hearing, a vivid synesthesia where the letter \"k\" was a huckleberry blue."},{"word":"sensory blending","recommendedRegister":"Cognitive Science / Everyday","exampleSentence":"Gastronomy relies on sensory blending between smell and taste receptors."},{"word":"hallucination","recommendedRegister":"Clinical / Psychiatric","exampleSentence":"Sleep deprivation induced alarming visual hallucinations in the night guard."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000078',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-22T12:00:00.000Z',
    0, 0, 0, 7, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 79: enjambment
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000079',
    '00000000-0000-0000-0000-000000000000',
    'enjambment',
    'en',
    'noun',
    '/ɪnˈdʒæm.mənt/',
    'The continuation of a sentence, syntactic clause, or thought across a poetic line break without terminal punctuation or pause.',
    'From French enjamber (to stride over, from jambe [leg]). Contrasted with end-stopped lines; enjambment introduces rhythmic acceleration, suspense, and semantic tension by striding across the formal boundary of the line.',
    '{"roots":[{"morpheme":"en-","meaning":"in / onto","origin":"French"},{"morpheme":"jambe","meaning":"leg","origin":"French"},{"morpheme":"-ment","meaning":"action / condition of","origin":"French"}],"cognates":["jamb","gambol"]}'::jsonb,
    ARRAY['radical enjambment', 'use of enjambment', 'enjambed line', 'rhythmic enjambment'],
    '{"sentence":"Milton rejected the jingling end-stopped couplets of his era, inventing a majestic blank verse whose surging rhythm relied upon continuous enjambment.","source":"Paradise Lost (Preface on the Verse)","author":"John Milton"}'::jsonb,
    ARRAY['The modern poem creates breathlessness through aggressive {{c1::enjambment}}, breaking clauses mid-preposition to pull the eye rapidly downward.', 'Unlike Pope''s rigid end-stopped couplets, Wordsworth used fluid {{c1::enjambment}} to mimic the natural cadence of a walking meditation.'],
    '{"synonyms":["enjambment","end-stopping","caesura"],"nuanceComparison":"Enjambment is striding across a poetic line break without terminal punctuation; end-stopping is pausing at line end with terminal punctuation; caesura is an intentional pause or break in the middle of a poetic line.","contextRecommendations":[{"word":"enjambment","recommendedRegister":"Poetic Prosody / Literary Analysis","exampleSentence":"Rilke''s enjambment propels the reader forward as the statue of Apollo demands: \"You must change your life.\""},{"word":"end-stopping","recommendedRegister":"Prosodic / Classical","exampleSentence":"Chaucer''s early verse relies on disciplined end-stopping."},{"word":"caesura","recommendedRegister":"Metrical / Prosodic","exampleSentence":"Old English alliterative verse balances two rhythmic half-lines across a central caesura."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000079',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-22T12:00:00.000Z',
    0, 0, 0, 7, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 80: susurrus
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000080',
    '00000000-0000-0000-0000-000000000000',
    'susurrus',
    'en',
    'noun',
    '/sʊˈsʌr.əs/',
    'A whispering sound; a continuous, low murmuring, rustling, or gentle humming acoustic presence.',
    'An onomatopoeic Latinate word reserved for elevated poetic or lyrical prose, capturing the acoustic texture of rustling leaves, gentle waves, or hushed whispers in an auditorium.',
    '{"roots":[{"morpheme":"susurrare","meaning":"to whisper / hum / buzz","origin":"Latin"},{"morpheme":"susurrus","meaning":"a whisper / low murmur","origin":"Latin"}],"cognates":["susurration","susurrant"]}'::jsonb,
    ARRAY['faint susurrus', 'susurrus of leaves', 'gentle susurrus', 'distant susurrus'],
    '{"sentence":"A faint susurrus swept through the auditorium as the curtain rose on the shadowed set.","source":"The Atlantic Review","author":"Literary Quarterly"}'::jsonb,
    ARRAY['The nocturnal forest was quiet save for the rhythmic {{c1::susurrus}} of the pines in the evening breeze.', 'In the grand library reading room, the only sound was the delicate {{c1::susurrus}} of turning parchment.'],
    '{"synonyms":["susurrus","murmur","whisper"],"nuanceComparison":"Susurrus is elevated and lyrical, capturing the acoustic texture of rustling nature or collective soft sound; murmur carries emotional indistinctness or mild collective dissent; whisper is an intentional low vocalization or faint sound.","contextRecommendations":[{"word":"susurrus","recommendedRegister":"Literary / Lyrical","exampleSentence":"The susurrus of willow boughs trailing in the stream."},{"word":"murmur","recommendedRegister":"Narrative / Conversational","exampleSentence":"A murmur of approval rippled through the audience."},{"word":"whisper","recommendedRegister":"Universal / Dramatic","exampleSentence":"She leaned in with a hushed whisper."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000080',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-22T12:00:00.000Z',
    0, 0, 0, 7, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 81: sublime
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000081',
    '00000000-0000-0000-0000-000000000000',
    'sublime',
    'en',
    'adjective',
    '/səˈblaɪm/',
    'Of such extraordinary greatness, vastness, or beauty as to inspire profound awe, veneration, or cosmic terror beyond comprehension.',
    'Contrasted by Edmund Burke and Immanuel Kant with the merely "beautiful." The beautiful pleases through symmetry and form; the sublime overwhelms the senses through vastness, formlessness, and terror safely observed from afar.',
    '{"roots":[{"morpheme":"sub-","meaning":"up to / toward","origin":"Latin"},{"morpheme":"limen","meaning":"threshold / lintel","origin":"Latin"}],"cognates":["sublimity","sublimate","liminal"]}'::jsonb,
    ARRAY['kantian sublime', 'sublime beauty', 'sublime terror', 'reach the sublime'],
    '{"sentence":"The beautiful prepares us to love something unselfishly; the sublime prepares us to esteem something highly, even against our sensory interest.","source":"Critique of Judgment","author":"Immanuel Kant"}'::jsonb,
    ARRAY['Gazing down into the abyssal glacier crevasse, the mountaineer experienced the terrifying awe of the {{c1::sublime}}.', 'Romantic landscape painters sought to evoke the {{c1::sublime}} by contrasting tiny human figures against monolithic stormy mountain ranges.'],
    '{"synonyms":["sublime","beautiful","picturesque"],"nuanceComparison":"Sublime describes overwhelming, formless magnitude inspiring awe and fear; beautiful describes harmonious, proportional grace pleasing the eye; picturesque describes charming visual quaintness suited for a painting.","contextRecommendations":[{"word":"sublime","recommendedRegister":"Kantian / Romantic Aesthetic","exampleSentence":"The erupting volcano was a spectacle of terrifying and sublime grandeur."},{"word":"beautiful","recommendedRegister":"Classical / Aesthetic","exampleSentence":"The classical sculpture possessed a calm and beautiful proportion."},{"word":"picturesque","recommendedRegister":"Tourism / Visual Arts","exampleSentence":"The thatched cottages made the English village wonderfully picturesque."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000081',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-23T12:00:00.000Z',
    0, 0, 0, 8, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 82: ressentiment
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000082',
    '00000000-0000-0000-0000-000000000000',
    'ressentiment',
    'en',
    'noun',
    '/rəˌsɑ̃ː.tiˈmɑ̃ː/',
    'A deep-seated, simmering resentment, malice, and envy felt by the powerless toward those perceived as superior, leading to an inversion of moral values.',
    'Theorized by Friedrich Nietzsche in On the Genealogy of Morals (and expanded by Max Scheler). Ressentiment poisons the soul because the impotent individual cannot discharge anger through action, instead re-valuing noble strength as "evil" and passive weakness as "good."',
    '{"roots":[{"morpheme":"re-","meaning":"again / repeatedly","origin":"French"},{"morpheme":"sentir","meaning":"to feel","origin":"French"},{"morpheme":"-ment","meaning":"state / result of","origin":"French"}],"cognates":["resentment","sentiment"]}'::jsonb,
    ARRAY['nietzschean ressentiment', 'steeped in ressentiment', 'politics of ressentiment', 'slave morality ressentiment'],
    '{"sentence":"The slave revolt in morality begins when ressentiment itself becomes creative and gives birth to values: the ressentiment of natures that are denied the true reaction of deeds.","source":"On the Genealogy of Morals","author":"Friedrich Nietzsche"}'::jsonb,
    ARRAY['Populist demagogues often weaponize popular {{c1::ressentiment}}, turning economic anxiety into bitter hatred against cultural and cosmopolitan elites.', 'Nietzsche identified ascetic guilt as an internal turning of venomous {{c1::ressentiment}} against one''s own instincts.'],
    '{"synonyms":["ressentiment","resentment","envy"],"nuanceComparison":"Ressentiment is systemic philosophical malice born of impotence that fundamentally inverts morality; resentment is simple righteous indignation or bitterness over an affront; envy is wanting what another possesses.","contextRecommendations":[{"word":"ressentiment","recommendedRegister":"Nietzschean / Political Philosophy","exampleSentence":"Totalitarian propaganda feeds upon the festering ressentiment of humiliated populations."},{"word":"resentment","recommendedRegister":"Interpersonal / Everyday","exampleSentence":"He harbored deep resentment toward his brother for inheriting the family farm."},{"word":"envy","recommendedRegister":"Psychological / Moral","exampleSentence":"Envy corrodes friendship when one colleague outpaces another."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000082',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-23T12:00:00.000Z',
    0, 0, 0, 8, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 83: angst
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000083',
    '00000000-0000-0000-0000-000000000000',
    'angst',
    'en',
    'noun',
    '/ɑːŋst/',
    'A profound, unfocused feeling of existential dread, anxiety, or foreboding arising from the confrontation with absolute human freedom and mortality.',
    'From Søren Kierkegaard (The Concept of Anxiety) and Martin Heidegger. Distinct from ordinary fear (Furcht), which has a specific object; Angst has no object other than the abyss of human possibility and Nothingness itself.',
    '{"roots":[{"morpheme":"angst","meaning":"anxiety / anguish / fear","origin":"German"},{"morpheme":"angustus","meaning":"narrow / constricted","origin":"Latin"}],"cognates":["anxious","anguish","anger"]}'::jsonb,
    ARRAY['existential angst', 'paralyzed by angst', 'angst of freedom', 'suburban angst'],
    '{"sentence":"Anxiety (Angst) is the dizziness of freedom, which emerges when the spirit wants to posit the synthesis and freedom looks down into its own possibility.","source":"The Concept of Anxiety","author":"Søren Kierkegaard"}'::jsonb,
    ARRAY['Heidegger argued that authentic existence begins when pervasive {{c1::angst}} strips away the trivial distractions of everyday gossip.', 'Existential cinema of the 1960s was saturated with cold post-war {{c1::angst}}, questioning whether life possessed any inherent purpose.'],
    '{"synonyms":["angst","fear","dread"],"nuanceComparison":"Angst is unfocused metaphysical anxiety regarding existence and radical freedom; fear is targeted alarm toward a specific physical danger; dread is intense anticipation of an impending catastrophe.","contextRecommendations":[{"word":"angst","recommendedRegister":"Existential / Philosophical","exampleSentence":"Kierkegaard described angst as standing upon the edge of a cliff, horrified not by the fall, but by one''s freedom to jump."},{"word":"fear","recommendedRegister":"Biological / Everyday","exampleSentence":"A sudden growl in the dark triggered primal fear."},{"word":"dread","recommendedRegister":"Affective / Dramatic","exampleSentence":"She awaited the biopsy results with sick dread."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000083',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-23T12:00:00.000Z',
    0, 0, 0, 8, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 84: ennui
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000084',
    '00000000-0000-0000-0000-000000000000',
    'ennui',
    'en',
    'noun',
    '/ɒnˈwiː/',
    'A profound, listless feeling of weariness, dissatisfaction, and existential boredom resulting from satiety, inactivity, or perceived pointlessness of life.',
    'Immortalized in nineteenth-century French literature (Flaubert''s Madame Bovary, Baudelaire''s Les Fleurs du Mal). Not mere temporary boredom, but a chronic spiritual paralysis where no worldly achievement can ignite desire.',
    '{"roots":[{"morpheme":"inodiare","meaning":"to hold in hatred / be hateful to","origin":"Latin"},{"morpheme":"odium","meaning":"hatred / ill will","origin":"Latin"}],"cognates":["annoy","noisome","odious"]}'::jsonb,
    ARRAY['crushing ennui', 'aristocratic ennui', 'victim of ennui', 'paralyzed by ennui'],
    '{"sentence":"Among the jackals, panthers, hounds, and apes... there is one more ugly, more evil, more foul! It is Ennui! With an involuntary tear in his eye, he dreams of scaffolds while smoking his pipe.","source":"Les Fleurs du Mal (To the Reader)","author":"Charles Baudelaire"}'::jsonb,
    ARRAY['Surrounded by luxury and endless leisure, the young heir fell into a languid {{c1::ennui}} that made every conversation unbearable.', 'Emma Bovary was driven to ruin by her suffocating {{c1::ennui}}, desperately seeking romantic drama to pierce provincial monotony.'],
    '{"synonyms":["ennui","boredom","apathy"],"nuanceComparison":"Ennui is elevated, existential, and spiritual weariness with worldly existence; boredom is everyday restlessness caused by lack of stimulation; apathy is total emotional numbness and lack of concern.","contextRecommendations":[{"word":"ennui","recommendedRegister":"High Literary / Decadent","exampleSentence":"The late-Victorian aesthetic movement was haunted by fin-de-siècle ennui."},{"word":"boredom","recommendedRegister":"Everyday / Colloquial","exampleSentence":"The students suffered through two hours of boredom during the lecture."},{"word":"apathy","recommendedRegister":"Psychological / Civic","exampleSentence":"Voter apathy led to record-low turnout in the municipal election."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000084',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-23T12:00:00.000Z',
    0, 0, 0, 8, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 85: eudaimonia
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000085',
    '00000000-0000-0000-0000-000000000000',
    'eudaimonia',
    'en',
    'noun',
    '/juː.daɪˈmoʊ.ni.ə/',
    'The highest human good; flourishing, well-being, and living a virtuous life in accordance with reason and human potential.',
    'Central to Aristotle''s Nicomachean Ethics. Often translated as "happiness," but eudaimonia is not a fleeting emotional pleasure (hedonism); it is an active state of flourishing and moral excellence (arete) sustained across a complete lifetime.',
    '{"roots":[{"morpheme":"eu-","meaning":"good / well","origin":"Greek"},{"morpheme":"daimon","meaning":"spirit / inner divinity / fortune","origin":"Greek"},{"morpheme":"-ia","meaning":"state / condition of","origin":"Greek"}],"cognates":["daemon","euphoria","eulogy"]}'::jsonb,
    ARRAY['aristotelian eudaimonia', 'pursuit of eudaimonia', 'achieve eudaimonia', 'eudaimonic life'],
    '{"sentence":"Eudaimonia is an activity of the soul in accordance with complete virtue; for a swallow does not make a spring, nor does one sunny day.","source":"Nicomachean Ethics","author":"Aristotle"}'::jsonb,
    ARRAY['Contemporary virtue ethics has revived {{c1::eudaimonia}}, arguing that moral philosophy should foster human flourishing rather than merely calculate rules.', 'To Aristotle, wealth and honor are mere instruments, whereas {{c1::eudaimonia}} is the only good chosen purely for its own sake.'],
    '{"synonyms":["eudaimonia","hedonism","ataraxia"],"nuanceComparison":"Eudaimonia is active human flourishing through lifelong virtuous rational activity; hedonism is the immediate maximization of sensory pleasure; ataraxia is negative peace of mind achieved by removing anxiety.","contextRecommendations":[{"word":"eudaimonia","recommendedRegister":"Classical / Virtue Ethics","exampleSentence":"A flourishing civic community provides the social conditions for citizens to attain eudaimonia."},{"word":"hedonism","recommendedRegister":"Ethical / Everyday","exampleSentence":"He abandoned philosophical reflection for unbridled sensory hedonism on the coast."},{"word":"ataraxia","recommendedRegister":"Epicurean / Stoic","exampleSentence":"The Stoic sage seeks ataraxia, refusing to let external misfortunes disturb inner serenity."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000085',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-23T12:00:00.000Z',
    0, 0, 0, 8, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 86: ataraxia
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000086',
    '00000000-0000-0000-0000-000000000000',
    'ataraxia',
    'en',
    'noun',
    '/ˌæt.əˈræk.si.ə/',
    'A state of serene, untroubled calm; emotional tranquility and freedom from mental agitation or fear.',
    'The ultimate ethical goal for both Epicureanism and Pyrrhonian Skepticism. In Epicurus, attained through simple living, philosophy, and dispelling fear of the gods and death; in Skepticism, attained by suspending judgment (epoche) on unknowable dogmas.',
    '{"roots":[{"morpheme":"a-","meaning":"without / un-","origin":"Greek"},{"morpheme":"tarache","meaning":"trouble / turmoil / agitation","origin":"Greek"},{"morpheme":"-ia","meaning":"condition of","origin":"Greek"}],"cognates":["ataraxic"]}'::jsonb,
    ARRAY['philosophical ataraxia', 'state of ataraxia', 'epicurean ataraxia', 'attain ataraxia'],
    '{"sentence":"When we say that pleasure is the end and aim, we do not mean the pleasures of the prodigal, but the freedom from pain in the body and from trouble in the soul (ataraxia).","source":"Letter to Menoeceus","author":"Epicurus"}'::jsonb,
    ARRAY['By detaching himself from political intrigue and living quietly in his garden, Epicurus claimed to have achieved lasting {{c1::ataraxia}}.', 'The Pyrrhonian skeptic discovered that suspending dogmatic judgment brings an unexpected peace of mind, an effortless {{c1::ataraxia}}.'],
    '{"synonyms":["ataraxia","apathy","serenity"],"nuanceComparison":"Ataraxia is philosophical tranquility achieved by dispelling irrational terror and dogmatism; apathy (apatheia in Stoicism) is freedom from irrational passions; serenity is gentle, untroubled peacefulness.","contextRecommendations":[{"word":"ataraxia","recommendedRegister":"Epicurean / Classical Philosophy","exampleSentence":"True philosophy offers an intellectual medicine leading to ataraxia."},{"word":"apathy","recommendedRegister":"Psychological / Common","exampleSentence":"Depression often presents as chronic indifference and apathy."},{"word":"serenity","recommendedRegister":"Spiritual / Everyday","exampleSentence":"The quiet lake at dawn radiated profound serenity."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000086',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-23T12:00:00.000Z',
    0, 0, 0, 8, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 87: dasein
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000087',
    '00000000-0000-0000-0000-000000000000',
    'dasein',
    'en',
    'noun',
    '/ˈdɑː.zaɪn/',
    'Human existence or "Being-there"; human consciousness conceived not as a detached spectator, but as an entity fundamentally situated meaningfully in the world and time.',
    'Martin Heidegger''s central term in Being and Time (from German da [there] + sein [to be]). Dasein is the unique being for whom its own Being is an issue, characterized by "Being-in-the-world" (In-der-Welt-sein), care (Sorge), and "Being-towards-death" (Sein-zum-Tode).',
    '{"roots":[{"morpheme":"da","meaning":"there / here","origin":"German"},{"morpheme":"sein","meaning":"to be / being","origin":"German"}],"cognates":["sein"]}'::jsonb,
    ARRAY['heideggerian dasein', 'temporality of dasein', 'authentic dasein', 'dasein in the world'],
    '{"sentence":"Dasein is an entity which does not just occur among other entities. Rather it is ontically distinguished by the fact that, in its very Being, that Being is an issue for it.","source":"Being and Time","author":"Martin Heidegger"}'::jsonb,
    ARRAY['Heidegger rejected the Cartesian ego as a detached thinking substance, replacing it with {{c1::dasein}}, an entity already embedded in tools and social practices.', 'Confronting its own finite mortality awakens {{c1::dasein}} from the inauthentic slumber of the public crowd.'],
    '{"synonyms":["dasein","subject","consciousness"],"nuanceComparison":"Dasein emphasizes human situatedness, temporal finitude, and bodily involvement in the world; subject implies an isolated cognitive spectator set against an external object; consciousness refers to mental awareness.","contextRecommendations":[{"word":"dasein","recommendedRegister":"Heideggerian / Phenomenological","exampleSentence":"The existential analytics of Dasein demonstrates that anxiety uncovers the groundlessness of human existence."},{"word":"subject","recommendedRegister":"Cartesian / Epistemic","exampleSentence":"Kant investigated the transcendental subject as the organizer of sensory intuition."},{"word":"consciousness","recommendedRegister":"Cognitive / Psychological","exampleSentence":"Neuroscientists continue to debate the biological correlates of conscious awareness."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000087',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-23T12:00:00.000Z',
    0, 0, 0, 8, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 88: kenosis
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000088',
    '00000000-0000-0000-0000-000000000000',
    'kenosis',
    'en',
    'noun',
    '/kɪˈnoʊ.sɪs/',
    'The voluntary self-emptying of personal ego, sovereign will, or divine status in order to be receptive to transcendent reality or compassionate service.',
    'Originally theological (Philippians 2:7, Christ "emptying himself" to take the form of a servant). Adopted in modern hermeneutics and secular philosophy (Gianni Vattimo, Slavoj Žižek) as a metaphor for weakening dogmatic metaphysics in favor of open tolerance.',
    '{"roots":[{"morpheme":"kenoun","meaning":"to empty / make hollow / void","origin":"Greek"},{"morpheme":"kenos","meaning":"empty / vain","origin":"Greek"},{"morpheme":"-sis","meaning":"act / process of","origin":"Greek"}],"cognates":["cenotaph","kenotic"]}'::jsonb,
    ARRAY['act of kenosis', 'kenotic theology', 'radical kenosis', 'kenosis of the ego'],
    '{"sentence":"Christianity is not the triumphant affirmation of divine omnipotence, but the revolutionary historical event of God''s self-emptying (kenosis).","source":"After Christianity","author":"Gianni Vattimo"}'::jsonb,
    ARRAY['The mystic''s spiritual ascent requires a radical {{c1::kenosis}}, divesting the soul of all arrogant intellectual certitude.', 'Vattimo proposed "weak thought" as a philosophical {{c1::kenosis}}, surrendering violent claims to absolute metaphysical truth.'],
    '{"synonyms":["kenosis","renunciation","abnegation"],"nuanceComparison":"Kenosis is the profound, spiritual self-emptying of power or divine pride to embrace weakness; renunciation is giving up a claim, possession, or right; abnegation is the self-denying restraint of desires.","contextRecommendations":[{"word":"kenosis","recommendedRegister":"Theological / Continental Hermeneutics","exampleSentence":"Simone Weil viewed artistic creation as an act of kenosis, a stepping back to let the beauty of the world exist."},{"word":"renunciation","recommendedRegister":"Ascetic / Legal","exampleSentence":"The king signed a formal act of renunciation of the throne."},{"word":"abnegation","recommendedRegister":"Moral / Everyday","exampleSentence":"The monk practiced rigorous self-abnegation during Lent."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000088',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-23T12:00:00.000Z',
    0, 0, 0, 8, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 89: nihilism
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000089',
    '00000000-0000-0000-0000-000000000000',
    'nihilism',
    'en',
    'noun',
    '/ˈnaɪ.ɪ.lɪ.zəm/',
    'The philosophical viewpoint that traditional values, moral principles, and beliefs are unfounded, and that existence is devoid of intrinsic meaning, purpose, or objective truth.',
    'Analyzed profoundly by Friedrich Nietzsche as the crisis of modernity ("God is dead"): the highest values devalue themselves. Nietzsche distinguished between passive nihilism (weary exhaustion and resignation) and active nihilism (the joyful destruction of false idols to create new values).',
    '{"roots":[{"morpheme":"nihil","meaning":"nothing / not anything","origin":"Latin"},{"morpheme":"-ism","meaning":"doctrine / philosophical system","origin":"Greek"}],"cognates":["annihilate","nihilistic"]}'::jsonb,
    ARRAY['active nihilism', 'abyss of nihilism', 'moral nihilism', 'confront nihilism'],
    '{"sentence":"Nihilism stands at the door: whence comes this uncanniest of all guests? The aim is lacking; \"why?\" finds no answer.","source":"The Will to Power","author":"Friedrich Nietzsche"}'::jsonb,
    ARRAY['Ivan Turgenev popularized the term in Fathers and Sons, depicting the young radical Bazarov as a haughty proponent of scientific {{c1::nihilism}}.', 'Nietzsche warned that the twentieth century would be defined by catastrophic wars as Europe struggled to survive the collapse into {{c1::nihilism}}.'],
    '{"synonyms":["nihilism","cynicism","pessimism"],"nuanceComparison":"Nihilism rejects the reality of any objective meaning or moral truth whatsoever; cynicism is a distrustful attitude believing people are motivated solely by self-interest; pessimism is the expectation that bad outcomes outweigh good.","contextRecommendations":[{"word":"nihilism","recommendedRegister":"Nietzschean / Existential Philosophy","exampleSentence":"To defeat nihilism, one must possess the courage to affirm life unconditionally."},{"word":"cynicism","recommendedRegister":"Social / Characterological","exampleSentence":"Years in partisan politics bred an unyielding cynicism in the senior senator."},{"word":"pessimism","recommendedRegister":"Philosophical / Affective","exampleSentence":"Schopenhauer''s metaphysical pessimism held that suffering is the essential condition of conscious life."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000089',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-23T12:00:00.000Z',
    0, 0, 0, 8, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 90: perspicacious
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000090',
    '00000000-0000-0000-0000-000000000000',
    'perspicacious',
    'en',
    'adjective',
    '/ˌpɜː.spɪˈkeɪ.ʃəs/',
    'Having a penetrating, ready insight into and keen understanding of complex things; mentally acute, perceptive, and discerning.',
    'From Latin per- (through) + specere (to look). Emphasizes acute mental vision and penetrating discernment capable of piercing deception or analyzing abstract principles, distinct from merely being educated or clever.',
    '{"roots":[{"morpheme":"per-","meaning":"through / thoroughly","origin":"Latin"},{"morpheme":"specere","meaning":"to look at / behold","origin":"Latin"},{"morpheme":"-acious","meaning":"inclined to / characterized by","origin":"Latin"}],"cognates":["perspicuity","spectator","circumspect","conspicuous"]}'::jsonb,
    ARRAY['perspicacious observer', 'perspicacious critique', 'perspicacious mind', 'perspicacious appraisal'],
    '{"sentence":"Her perspicacious appraisal of the macroeconomic instability anticipated the collapse months in advance.","source":"The Economic Review","author":"Economic Quarterly"}'::jsonb,
    ARRAY['The historian''s {{c1::perspicacious}} examination of diplomatic letters revealed motives obscured for centuries.', 'Only a {{c1::perspicacious}} critic could detect the subtle irony woven through the seemingly naive prose.'],
    '{"synonyms":["perspicacious","astute","sagacious"],"nuanceComparison":"Perspicacious emphasizes penetration of vision and seeing through obscurity; astute highlights practical shrewdness and calculating advantage; sagacious implies deep wisdom ripened by age and experience.","contextRecommendations":[{"word":"perspicacious","recommendedRegister":"Scholarly / Critical","exampleSentence":"A perspicacious scholar capable of piercing the dogmas of the era."},{"word":"astute","recommendedRegister":"Pragmatic / Political","exampleSentence":"An astute politician who brokered compromises before opposition mounted."},{"word":"sagacious","recommendedRegister":"Philosophical / Literary","exampleSentence":"The sagacious elder whose quiet counsel steadied the council."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000090',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-23T12:00:00.000Z',
    0, 0, 0, 8, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 91: inchoate
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000091',
    '00000000-0000-0000-0000-000000000000',
    'inchoate',
    'en',
    'adjective',
    '/ɪnˈkoʊ.eɪt/',
    'Just begun and so not fully formed or developed; rudimentary; disorganized and chaotic awaiting articulation.',
    'Carries a sense of nascent potential paired with formlessness. It refers not merely to something young, but to something still chaotic or unarticulated awaiting coherence.',
    '{"roots":[{"morpheme":"inchoare","meaning":"to begin / commence / harness","origin":"Latin"},{"morpheme":"-ate","meaning":"characterized by / possessing","origin":"Latin"}],"cognates":["inchoation","inchoative"]}'::jsonb,
    ARRAY['inchoate ideas', 'inchoate rebellion', 'inchoate longing', 'inchoate structure'],
    '{"sentence":"The manifesto articulated the inchoate frustrations of a generation grappling with institutional decay.","source":"Contemporary Sociology","author":"Sociological Review"}'::jsonb,
    ARRAY['Before drafting the treatise, he wrestled for years with {{c1::inchoate}} thoughts scrawled across notebooks.', 'The opposition remained an {{c1::inchoate}} movement lacking both leadership and cohesive strategy.'],
    '{"synonyms":["inchoate","embryonic","nascent"],"nuanceComparison":"Inchoate highlights formlessness and unshaped inception; embryonic highlights latent biological-like structural development; nascent emphasizes the fresh emergence or coming into being with promise.","contextRecommendations":[{"word":"inchoate","recommendedRegister":"Intellectual / Structural","exampleSentence":"An inchoate grievance that had not yet crystallized into policy demands."},{"word":"embryonic","recommendedRegister":"Organizational / Developmental","exampleSentence":"The company''s international branch was still in an embryonic state."},{"word":"nascent","recommendedRegister":"Historical / Sociological","exampleSentence":"A nascent democracy struggling against entrenched autocrats."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000091',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-24T12:00:00.000Z',
    0, 0, 0, 9, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 92: apocryphal
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000092',
    '00000000-0000-0000-0000-000000000000',
    'apocryphal',
    'en',
    'adjective',
    '/əˈpɒk.rɪ.fəl/',
    'Of doubtful authenticity or questionable provenance, although widely circulated and believed to be true.',
    'Distinct from a blatant lie; apocryphal tales survive precisely because they are evocative, poetic, or illustrate a symbolic truth about a historical figure even if factually spurious.',
    '{"roots":[{"morpheme":"apo-","meaning":"away / off / from","origin":"Greek"},{"morpheme":"kryptein","meaning":"to hide / conceal","origin":"Greek"}],"cognates":["cryptic","cryptography","crypt"]}'::jsonb,
    ARRAY['apocryphal anecdote', 'apocryphal story', 'apocryphal origins', 'widely apocryphal'],
    '{"sentence":"The legend of Newton and the falling apple is likely apocryphal, yet it retains immense pedagogical power.","source":"History of Science Quarterly","author":"Academic Historical Press"}'::jsonb,
    ARRAY['Most historians regard the quote attributed to Marie Antoinette as completely {{c1::apocryphal}}.', 'Despite its {{c1::apocryphal}} nature, the story became central to the city''s civic mythology.'],
    '{"synonyms":["apocryphal","spurious","mythical"],"nuanceComparison":"Apocryphal denotes stories believed widely but lacking provenance; spurious denotes actively forged, illegitimate, or deceitful claims; mythical elevates the lore to overarching archetypal narrative.","contextRecommendations":[{"word":"apocryphal","recommendedRegister":"Biographical / Historiographical","exampleSentence":"An apocryphal memo circulated by later biographers to embellish his courage."},{"word":"spurious","recommendedRegister":"Academic / Forensic","exampleSentence":"The artifact was proven spurious by carbon dating."},{"word":"mythical","recommendedRegister":"Literary / Folkloric","exampleSentence":"The mythical founding fathers cast long shadows over the republic."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000092',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-24T12:00:00.000Z',
    0, 0, 0, 9, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 93: obfuscate
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000093',
    '00000000-0000-0000-0000-000000000000',
    'obfuscate',
    'en',
    'verb',
    '/ˈɒb.fə.skeɪt/',
    'To deliberately make obscure, unclear, or unintelligible; to bewilder, confuse, or darken meaning.',
    'Implies calculated or systemic concealment of truth through convoluted jargon or misleading rhetoric, rather than accidental ambiguity.',
    '{"roots":[{"morpheme":"ob-","meaning":"over / completely","origin":"Latin"},{"morpheme":"fuscare","meaning":"to darken / make dusky","origin":"Latin"}],"cognates":["fuscous","obfuscation"]}'::jsonb,
    ARRAY['deliberately obfuscate', 'obfuscate the truth', 'obfuscate regulatory oversight', 'bureaucratic obfuscation'],
    '{"sentence":"The spokesman''s verbose response seemed calculated to obfuscate the committee''s findings.","source":"Parliamentary Chronicle","author":"Political Quarterly"}'::jsonb,
    ARRAY['Legal teams often draft contracts with convoluted phrasing to {{c1::obfuscate}} unfavorable arbitration clauses.', 'Rather than admitting error, the minister attempted to {{c1::obfuscate}} the policy failure with macroeconomic jargon.'],
    '{"synonyms":["obfuscate","confuse","equivocate"],"nuanceComparison":"Obfuscate denotes deliberately casting darkness or complexity over facts; confuse is the generic creation of mental perplexity; equivocate is using ambiguous language specifically to avoid taking a stand or telling the truth.","contextRecommendations":[{"word":"obfuscate","recommendedRegister":"Legal / Political / Technical","exampleSentence":"The defense attempted to obfuscate the financial ledger trail."},{"word":"confuse","recommendedRegister":"Conversational / General","exampleSentence":"The sudden change in schedule will confuse the staff."},{"word":"equivocate","recommendedRegister":"Diplomatic / Ethical","exampleSentence":"Under cross-examination, the witness began to equivocate."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000093',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-24T12:00:00.000Z',
    0, 0, 0, 9, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 94: ephemeral
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000094',
    '00000000-0000-0000-0000-000000000000',
    'ephemeral',
    'en',
    'adjective',
    '/ɪˈfem.ər.əl/',
    'Lasting for a very short time; transitory; fleeting; enduring only for a single day.',
    'Evokes a melancholic or poetic appreciation for beauty and existence that blossoms brilliantly and dissolves rapidly, rooted in biological or natural transience.',
    '{"roots":[{"morpheme":"epi-","meaning":"on / for","origin":"Greek"},{"morpheme":"hemera","meaning":"day","origin":"Greek"}],"cognates":["ephemera","ephemeris"]}'::jsonb,
    ARRAY['ephemeral beauty', 'ephemeral nature', 'ephemeral pleasure', 'ephemeral fame'],
    '{"sentence":"The installation artist reflected upon the ephemeral nature of ice sculptures under the spring sun.","source":"Contemporary Art Review","author":"Arts Journal"}'::jsonb,
    ARRAY['Digital social fame is notoriously {{c1::ephemeral}}, often fading within days of algorithmic prominence.', 'The morning fog lent the mountain valley an {{c1::ephemeral}} majesty that vanished as noon approached.'],
    '{"synonyms":["ephemeral","transient","evanescent"],"nuanceComparison":"Ephemeral highlights the brief lifespan of a thing (originally a single day); transient refers to something passing through without settling; evanescent describes something fragile that vaporizes or vanishes almost imperceptibly.","contextRecommendations":[{"word":"ephemeral","recommendedRegister":"Philosophical / Aesthetic","exampleSentence":"The ephemeral blooming of the night-blooming cereus."},{"word":"transient","recommendedRegister":"Sociological / Analytical","exampleSentence":"A transient population of migratory workers."},{"word":"evanescent","recommendedRegister":"Poetic / Literary","exampleSentence":"An evanescent scent of jasmine on the dusk breeze."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000094',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-24T12:00:00.000Z',
    0, 0, 0, 9, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 95: hubris
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000095',
    '00000000-0000-0000-0000-000000000000',
    'hubris',
    'en',
    'noun',
    '/ˈhjuː.brɪs/',
    'Dangerous, overweening pride, excessive arrogance, and insolence that defies the gods or moral limits, inevitably inviting retribution.',
    'In ancient Greek tragedy and legal ethics, hubris was an actionable public crime—the violent shaming or humiliation of a victim. In dramatic poetics, it represents the hero''s defiant refusal to accept human limitation, provoking Nemesis (divine retribution).',
    '{"roots":[{"morpheme":"hybris","meaning":"wanton insolence / outrage / excessive pride","origin":"Greek"}],"cognates":["hubristic"]}'::jsonb,
    ARRAY['tragic hubris', 'blinded by hubris', 'act of hubris', 'fatal hubris'],
    '{"sentence":"The hero''s downfall in Greek tragedy is not caused by villainy, but by tragic hubris that tempts him to overstep mortal boundaries.","source":"The Greek Way","author":"Edith Hamilton"}'::jsonb,
    ARRAY['The tech titan''s boast that his platform could replace democratic governance was an astonishing display of modern {{c1::hubris}}.', 'In Greek mythology, Icarus flying too near the sun is the classic cautionary allegory against youthful {{c1::hubris}}.'],
    '{"synonyms":["hubris","arrogance","vanity"],"nuanceComparison":"Hubris is defiant, insolent overstepping of cosmic or moral limits inviting catastrophic downfall; arrogance is an offensive claim of superior status; vanity is petty preoccupation with one''s appearance and admiration.","contextRecommendations":[{"word":"hubris","recommendedRegister":"Classical / Tragic / Political","exampleSentence":"Invading the frozen plains of Russia in winter was Napoleon''s crowning hubris."},{"word":"arrogance","recommendedRegister":"Everyday / Interpersonal","exampleSentence":"His dismissive arrogance alienated even his most loyal supporters."},{"word":"vanity","recommendedRegister":"Moral / Psychological","exampleSentence":"Her constant gazing into mirrors revealed an insatiable vanity."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000095',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-24T12:00:00.000Z',
    0, 0, 0, 9, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 96: peripeteia
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000096',
    '00000000-0000-0000-0000-000000000000',
    'peripeteia',
    'en',
    'noun',
    '/ˌper.ɪ.pɪˈtiː.ə/',
    'A sudden, drastic reversal of circumstances or turning point in a drama, narrative, or life, often working contrary to the protagonist''s intentions.',
    'Aristotle''s Poetics; peripeteia is most powerful when it springs directly from the plot''s internal logic rather than random accident, especially when it coincides with anagnorisis (discovery). Example: the messenger who arrives to comfort Oedipus ends up proving Oedipus''s patricide.',
    '{"roots":[{"morpheme":"peri-","meaning":"around / about","origin":"Greek"},{"morpheme":"piptein","meaning":"to fall","origin":"Greek"}],"cognates":["symptom","peripety"]}'::jsonb,
    ARRAY['dramatic peripeteia', 'sudden peripeteia', 'tragic peripeteia', 'experience a peripeteia'],
    '{"sentence":"A reversal (peripeteia) is, as we have said, a change by which the action veers round to its opposite, subject to the rule of probability or necessity.","source":"Poetics","author":"Aristotle"}'::jsonb,
    ARRAY['The sudden stock market crash wrought a devastating {{c1::peripeteia}} in the financier''s fortunes, reducing him to bankruptcy overnight.', 'The play achieves a stunning {{c1::peripeteia}} when the triumphant general is arrested for treason at his own victory banquet.'],
    '{"synonyms":["peripeteia","catastrophe","reversal"],"nuanceComparison":"Peripeteia is the specific dramatic turning point where circumstances veer sharply to their opposite; catastrophe is the final disastrous outcome concluding a tragedy; reversal is a general change in direction.","contextRecommendations":[{"word":"peripeteia","recommendedRegister":"Aristotelian / Dramatic Theory","exampleSentence":"The messenger''s confession produces a swift peripeteia from triumph to utter ruin."},{"word":"catastrophe","recommendedRegister":"Dramatic / General","exampleSentence":"The final catastrophe saw the stage littered with the bodies of the royal family."},{"word":"reversal","recommendedRegister":"General / Narrative","exampleSentence":"The team suffered a sudden reversal of fortune in the final minutes of the match."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000096',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-24T12:00:00.000Z',
    0, 0, 0, 9, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 97: solipsistic
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000097',
    '00000000-0000-0000-0000-000000000000',
    'solipsistic',
    'en',
    'adjective',
    '/ˌsɒl.ɪpˈsɪs.tɪk/',
    'Characterized by extreme egocentricity and the implicit assumption that only the self or one''s own private experience is real or important.',
    'Adjectival form of solipsism. Used critically to diagnose modern art, autofiction, or digital culture that remains trapped in private self-absorption without engaging external social realities.',
    '{"roots":[{"morpheme":"solus","meaning":"alone / sole","origin":"Latin"},{"morpheme":"ipse","meaning":"self","origin":"Latin"},{"morpheme":"-istic","meaning":"pertaining to / of the manner of","origin":"Greek"}],"cognates":["solipsism","solitude"]}'::jsonb,
    ARRAY['solipsistic worldview', 'solipsistic gaze', 'solipsistic isolation', 'solipsistic navel-gazing'],
    '{"sentence":"Social media algorithms curate an intensely solipsistic digital cocoon, reassuring the user that the universe revolves around their personal preferences.","source":"The Shallows","author":"Nicholas Carr"}'::jsonb,
    ARRAY['The critic dismissed the novel as a {{c1::solipsistic}} exercise in privileged melancholy that ignored the political crisis outside the window.', 'Living in a remote cabin without human contact eventually induced a weirdly {{c1::solipsistic}} state of consciousness.'],
    '{"synonyms":["solipsistic","narcissistic","insular"],"nuanceComparison":"Solipsistic implies a cognitive or existential blindness to the independent reality of others; narcissistic involves vain emotional preoccupation with self-image; insular refers to parochial, narrow-minded cultural detachment.","contextRecommendations":[{"word":"solipsistic","recommendedRegister":"Critical / Epistemic","exampleSentence":"Autofiction risks collapsing into solipsistic trivia when it abandons broader social commentary."},{"word":"narcissistic","recommendedRegister":"Clinical / Interpersonal","exampleSentence":"His narcissistic behavior made collaborative leadership impossible."},{"word":"insular","recommendedRegister":"Geographic / Sociological","exampleSentence":"The village community remained fiercely insular, suspicious of outsiders."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000097',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-24T12:00:00.000Z',
    0, 0, 0, 9, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 98: phenomenological
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000098',
    '00000000-0000-0000-0000-000000000000',
    'phenomenological',
    'en',
    'adjective',
    '/fɪˌnɒm.ɪ.nəˈlɒdʒ.ɪ.kəl/',
    'Relating to the direct qualitative description of conscious experience as it presents itself from a first-person perspective, setting aside theoretical presuppositions.',
    'From Edmund Husserl''s injunction: "Back to the things themselves!" (Zu den Sachen selbst!). Phenomenological method suspends (epoche) scientific or metaphysical assumptions about external reality to describe the pure intentional structures of perception, embodiment (Merleau-Ponty), and time.',
    '{"roots":[{"morpheme":"phainomenon","meaning":"appearance / that which is seen","origin":"Greek"},{"morpheme":"-logia","meaning":"study / discourse","origin":"Greek"},{"morpheme":"-ical","meaning":"pertaining to","origin":"Greek"}],"cognates":["phenomenon","phenomenology"]}'::jsonb,
    ARRAY['phenomenological method', 'phenomenological reduction', 'phenomenological description', 'phenomenological investigation'],
    '{"sentence":"Phenomenology is the study of essences; but it is also a philosophy which puts essences back into existence and does not expect to arrive at an understanding of man and the world from any other starting point than that of their \"facticity.\"","source":"Phenomenology of Perception","author":"Maurice Merleau-Ponty"}'::jsonb,
    ARRAY['Merleau-Ponty provided a rich {{c1::phenomenological}} account of phantom limb syndrome, demonstrating that the body is not an object but our vehicle for being in the world.', 'Instead of measuring brain waves, the psychologist adopted a {{c1::phenomenological}} approach, recording the patient''s lived experience of grief.'],
    '{"synonyms":["phenomenological","empirical","hermeneutic"],"nuanceComparison":"Phenomenological investigates the first-person qualitative structure of lived conscious experience; empirical measures objective third-person observational data; hermeneutic focuses on the interpretation of historical and cultural meaning.","contextRecommendations":[{"word":"phenomenological","recommendedRegister":"Continental Philosophy / Qualitative Psychology","exampleSentence":"A phenomenological inquiry into chronic pain focuses on how illness alters the patient''s perception of time and space."},{"word":"empirical","recommendedRegister":"Quantitative / Natural Science","exampleSentence":"The physics lab gathered empirical measurements of the electron''s spin."},{"word":"hermeneutic","recommendedRegister":"Textual / Interpretive","exampleSentence":"The historian applied a hermeneutic reading to decipher the symbolic codes of the treaty."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000098',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-24T12:00:00.000Z',
    0, 0, 0, 9, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 99: thaumazein
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000099',
    '00000000-0000-0000-0000-000000000000',
    'thaumazein',
    'en',
    'noun',
    '/θɔːˈmɑː.zeɪn/',
    'A state of profound philosophical wonder, awe, and astonishment before the mystery of existence, regarded in antiquity as the inception of philosophy.',
    'From Plato (Theaetetus 155d: "Wonder is the only beginning of philosophy") and Aristotle (Metaphysics 982b). Thaumazein is not superficial curiosity, but a disquieting, awe-struck realization that things are, rather than are not, shaking the thinker out of ordinary complacency.',
    '{"roots":[{"morpheme":"thaumazein","meaning":"to wonder / marvel / be amazed","origin":"Greek"},{"morpheme":"thauma","meaning":"wonder / marvel / miracle","origin":"Greek"}],"cognates":["thaumaturgy","thaumatrope"]}'::jsonb,
    ARRAY['philosophical thaumazein', 'experience thaumazein', 'spirit of thaumazein', 'originary thaumazein'],
    '{"sentence":"For this feeling of wonder (thaumazein) shows that you are a philosopher, since wonder is the only beginning of philosophy.","source":"Theaetetus","author":"Plato"}'::jsonb,
    ARRAY['Before constructing intricate logical systems, true philosophers must first experience {{c1::thaumazein}}—the raw wonder that anything exists at all.', 'Modern consumer capitalism dulls existential {{c1::thaumazein}}, replacing metaphysical astonishment with shallow entertainment.'],
    '{"synonyms":["thaumazein","curiosity","astonishment"],"nuanceComparison":"Thaumazein is the primordial philosophical wonder before the mystery of Being; curiosity is the desire to know or pry into specific details; astonishment is sudden shock or surprise.","contextRecommendations":[{"word":"thaumazein","recommendedRegister":"Classical Greek / Metaphysics","exampleSentence":"Heidegger reminded his students that philosophy must perpetually rekindle the ancient fire of thaumazein."},{"word":"curiosity","recommendedRegister":"Everyday / Intellectual","exampleSentence":"Childhood curiosity fuels scientific discovery."},{"word":"astonishment","recommendedRegister":"Affective / Descriptive","exampleSentence":"She stared in utter astonishment as the magician vanished from the stage."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000099',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-24T12:00:00.000Z',
    0, 0, 0, 9, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

-- Card 100: hermetic
INSERT INTO vocab_cards (
    id, user_id, term, language, part_of_speech, phonetic,
    primary_definition, nuance_note, etymology, collocations,
    source_context, cloze_sentences, distinction_matrix,
    is_fallback, enrichment_source, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000100',
    '00000000-0000-0000-0000-000000000000',
    'hermetic',
    'en',
    'adjective',
    '/hɜːˈmet.ɪk/',
    'Esoteric, cryptically obscure, sealed against outside influence; in literature, poetry characterized by deliberate obscurity, private symbols, and dense allusion.',
    'Originally derived from Hermes Trismegistus and the Hermetic Corpus (occult alchemy and mysticism). In twentieth-century poetics (Italian Ermetismo: Ungaretti, Montale; also Mallarmé and Celan), it designates verse stripped of narrative or rhetorical excess, communicating through cryptic, concentrated verbal essence.',
    '{"roots":[{"morpheme":"Hermes","meaning":"Hermes Trismegistus (Thrice-Great Hermes)","origin":"Greek"},{"morpheme":"-etic","meaning":"pertaining to / of the nature of","origin":"Greek"}],"cognates":["hermetically","hermeticism"]}'::jsonb,
    ARRAY['hermetic poetry', 'hermetically sealed', 'hermetic tradition', 'dense hermeticism'],
    '{"sentence":"Paul Celan''s late poetry achieves a tragic, hermetic intensity, carving private German words out of the silence left by the Shoah.","source":"Paul Celan: Poet, Survivor, Jew","author":"John Felstiner"}'::jsonb,
    ARRAY['The submarine crew lived in a {{c1::hermetic}} environment, isolated from the sun and sky for six continuous months.', 'Mallarmé''s symbolist sonnets are notoriously {{c1::hermetic}}, yielding their layered meanings only after hours of patient decoding.'],
    '{"synonyms":["hermetic","occult","opaque"],"nuanceComparison":"Hermetic implies esoteric, cryptically sealed, or inwardly concentrated poetry/knowledge; occult implies supernatural or hidden magical practices; opaque means difficult to see through or understand due to dense complexity.","contextRecommendations":[{"word":"hermetic","recommendedRegister":"Poetic / Esoteric","exampleSentence":"Italian Hermeticism reflected the poets'' refusal to collaborate with fascist political rhetoric, retreating into dense verbal purity."},{"word":"occult","recommendedRegister":"Mystical / Supernatural","exampleSentence":"The library housed seventeenth-century manuscripts on astrology and the occult."},{"word":"opaque","recommendedRegister":"Everyday / Critical","exampleSentence":"The bureaucrat''s report was hopelessly opaque and full of acronyms."}]}'::jsonb,
    false,
    'curated',
    '2026-10-15T12:00:00.000Z'
) ON CONFLICT (id) DO UPDATE SET
    term = EXCLUDED.term,
    part_of_speech = EXCLUDED.part_of_speech,
    phonetic = EXCLUDED.phonetic,
    primary_definition = EXCLUDED.primary_definition,
    nuance_note = EXCLUDED.nuance_note,
    etymology = EXCLUDED.etymology,
    collocations = EXCLUDED.collocations,
    source_context = EXCLUDED.source_context,
    cloze_sentences = EXCLUDED.cloze_sentences,
    distinction_matrix = EXCLUDED.distinction_matrix;

INSERT INTO srs_cards (
    card_id, user_id, due, stability, difficulty,
    elapsed_days, scheduled_days, reps, lapses, state, last_review
) VALUES (
    '00000000-0000-0000-0000-000000000100',
    '00000000-0000-0000-0000-000000000000',
    '2026-10-24T12:00:00.000Z',
    0, 0, 0, 9, 0, 0, 0, NULL
) ON CONFLICT (card_id) DO UPDATE SET
    due = EXCLUDED.due,
    scheduled_days = EXCLUDED.scheduled_days;

COMMIT;
