import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// A chainable stand-in for the Supabase query builder. Each awaited query
// resolves to the response registered for "<table>.<operation>".
const fake = vi.hoisted(() => {
  const state = {
    responses: {} as Record<string, { data: any; error: { message: string } | null }>,
    calls: [] as string[],
  };
  const client = {
    from(table: string) {
      let op = 'select';
      const builder: any = new Proxy(
        {},
        {
          get(_target, prop: string) {
            if (prop === 'then') {
              const result = state.responses[`${table}.${op}`] ?? { data: null, error: null };
              return (resolve: any, reject: any) => Promise.resolve(result).then(resolve, reject);
            }
            return () => {
              if (['insert', 'update', 'delete', 'upsert'].includes(prop)) {
                op = prop;
                state.calls.push(`${table}.${op}`);
              }
              return builder;
            };
          },
        }
      );
      return builder;
    },
  };
  return { state, client };
});

vi.mock('@supabase/supabase-js', () => ({ createClient: () => fake.client }));

const cardInput = {
  user_id: '00000000-0000-0000-0000-000000000000',
  term: 'homuncular',
  part_of_speech: 'adjective',
  primary_definition: 'Relating to a homunculus.',
  etymology: { roots: [], cognates: [] },
  collocations: [],
  source_context: { sentence: null, source: null },
  cloze_sentences: [],
};

async function loadDb() {
  vi.resetModules();
  return import('@/lib/db');
}

describe('Data layer with Supabase configured', () => {
  beforeEach(() => {
    fake.state.responses = {};
    fake.state.calls = [];
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test-project.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role-test-key');
  });
  afterEach(() => vi.unstubAllEnvs());

  it('throws on an insert error instead of saving to memory', async () => {
    fake.state.responses['vocab_cards.insert'] = {
      data: null,
      error: { message: 'column "distinction_matrix" of relation "vocab_cards" does not exist' },
    };
    const db = await loadDb();
    await expect(db.createCard(cardInput)).rejects.toThrow(/distinction_matrix/);
  });

  it('removes the card if its schedule row cannot be created', async () => {
    fake.state.responses['vocab_cards.insert'] = { data: { ...cardInput, id: 'x' }, error: null };
    fake.state.responses['srs_cards.insert'] = { data: null, error: { message: 'permission denied' } };
    const db = await loadDb();
    await expect(db.createCard(cardInput)).rejects.toThrow(/permission denied/);
    expect(fake.state.calls).toContain('vocab_cards.delete');
  });

  it('throws when the due queue query fails', async () => {
    fake.state.responses['srs_cards.select'] = { data: null, error: { message: 'timeout' } };
    const db = await loadDb();
    await expect(db.getDueCards()).rejects.toThrow(/timeout/);
  });

  it('throws when saving a review fails', async () => {
    fake.state.responses['vocab_cards.select'] = {
      data: { ...cardInput, id: 'card-1', created_at: new Date().toISOString(), srs: [] },
      error: null,
    };
    fake.state.responses['srs_cards.upsert'] = { data: null, error: { message: 'connection reset' } };
    const db = await loadDb();
    await expect(db.recordReview('card-1', 3)).rejects.toThrow(/connection reset/);
  });

  it('ignores the anon key', async () => {
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key');
    const db = await loadDb();
    expect(db.getSupabaseClient()).toBeNull();
  });
});

describe('Data layer without Supabase', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('SUPABASE_URL', '');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '');
    vi.stubEnv('SUPABASE_SECRET_KEY', '');
  });
  afterEach(() => vi.unstubAllEnvs());

  it('refuses the in-memory store in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const db = await loadDb();
    await expect(db.listCards()).rejects.toThrow(/Database not configured/);
  });

  it('uses the in-memory store in development and tests', async () => {
    const db = await loadDb();
    const cards = await db.listCards();
    expect(cards.length).toBeGreaterThan(0);
  });
});
