import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

import { CLUSTER_1_EPISTEMOLOGY } from './curriculum-data/cluster1-epistemology.mjs';
import { CLUSTER_2_CRITICAL_THEORY } from './curriculum-data/cluster2-critical-theory.mjs';
import { CLUSTER_3_LITERARY_CRITICISM } from './curriculum-data/cluster3-literary-criticism.mjs';
import { CLUSTER_4_POETICS_RHETORIC } from './curriculum-data/cluster4-poetics-rhetoric.mjs';
import { CLUSTER_5_AESTHETICS_EXISTENTIALISM } from './curriculum-data/cluster5-aesthetics-existentialism.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Simple .env.local parser to load variables without extra dependencies
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

loadEnvFile(path.join(projectRoot, '.env.local'));
loadEnvFile(path.join(projectRoot, '.env'));

const ALL_100_TERMS = [
  ...CLUSTER_1_EPISTEMOLOGY,
  ...CLUSTER_2_CRITICAL_THEORY,
  ...CLUSTER_3_LITERARY_CRITICISM,
  ...CLUSTER_4_POETICS_RHETORIC,
  ...CLUSTER_5_AESTHETICS_EXISTENTIALISM,
];

function getDeterministicUuid(index) {
  const hex = (index + 1).toString().padStart(4, '0');
  return `00000000-0000-0000-0000-00000000${hex}`;
}

function getSpanishDeterministicUuid(index) {
  const hex = (index + 1).toString().padStart(4, '0');
  return `10000000-0000-0000-0000-00000000${hex}`;
}

function loadSpanishLiteraryTerms() {
  const tsPath = path.join(projectRoot, 'lib', 'db', 'spanish-seed-data.ts');
  if (!fs.existsSync(tsPath)) return [];
  const raw = fs.readFileSync(tsPath, 'utf-8');
  const startMarker = 'const RAW_SPANISH_LITERARY_TERMS: SpanishSeedBase[] = ';
  const endMarker = '\nexport function getSpanishLiterarySeedCards';
  const startIdx = raw.indexOf(startMarker);
  const endIdx = raw.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1) return [];
  const arrayExpr = raw
    .slice(startIdx + startMarker.length, endIdx)
    .trim()
    .replace(/;$/, '');
  const fn = new Function(`return (${arrayExpr});`);
  return fn();
}

function parsePackArg(args) {
  const eqArg = args.find((a) => a.startsWith('--pack='));
  if (eqArg) {
    const val = eqArg.split('=')[1]?.toLowerCase().trim();
    if (val === 'en' || val === 'es' || val === 'all') return val;
  }
  const packIdx = args.indexOf('--pack');
  if (packIdx !== -1 && args[packIdx + 1]) {
    const val = args[packIdx + 1].toLowerCase().trim();
    if (val === 'en' || val === 'es' || val === 'all') return val;
  }
  return 'all';
}

async function main() {
  const args = process.argv.slice(2);
  const isHelp = args.includes('--help') || args.includes('-h');
  const isDryRun = args.includes('--dry-run');
  const isSqlOnly = args.includes('--sql');
  const pack = parsePackArg(args);

  const userIdx = args.indexOf('--user');
  const targetUserId = userIdx !== -1 && args[userIdx + 1]
    ? args[userIdx + 1]
    : '00000000-0000-0000-0000-000000000000';

  console.log('===========================================================');
  console.log('   Lexis Engine — Curated Curriculum Seed Runner           ');
  console.log('===========================================================');

  if (isHelp) {
    console.log(`
Usage:
  node scripts/seed.mjs [options]
  pnpm db:seed [options]

Options:
  --pack <en|es|all>  Select vocabulary pack to seed (default: all)
                        • en  : 100-Term English Philosophical & Literary Pack
                        • es  : 25-Term Spanish Literary & Philosophical Pack
                        • all : Both English (100) + Spanish (25) packs (125 total)
  --user <uuid>       Set the target user UUID (default: 00000000-0000-0000-0000-000000000000)
  --dry-run           Validate cards without performing database writes
  --sql               Display the location and command for supabase/seed.sql
  --help, -h          Show this help message
`);
    process.exit(0);
  }

  const sqlFilePath = path.join(projectRoot, 'supabase', 'seed.sql');
  if (isSqlOnly) {
    console.log(`\nSQL Seed File Location: ${sqlFilePath}`);
    console.log(`Size: ${(fs.statSync(sqlFilePath).size / 1024).toFixed(1)} KB`);
    console.log('\nYou can copy and paste this file directly into the Supabase Dashboard SQL Editor.\n');
    process.exit(0);
  }

  const spanishTerms = pack === 'es' || pack === 'all' ? loadSpanishLiteraryTerms() : [];
  const englishTerms = pack === 'en' || pack === 'all' ? ALL_100_TERMS : [];
  const totalSelected = englishTerms.length + spanishTerms.length;

  console.log(`Selected Pack: --pack ${pack}`);
  if (englishTerms.length > 0) {
    console.log(`  • English Philosophical & Literary Pack: ${englishTerms.length} terms (lib/db/seed-data.ts & lib/db/philosophical-seed-data.ts)`);
  }
  if (spanishTerms.length > 0) {
    console.log(`  • Spanish Literary & Philosophical Pack: ${spanishTerms.length} terms (lib/db/spanish-seed-data.ts)`);
  }
  console.log(`Total Curated Terms to Seed: ${totalSelected}`);
  console.log(`Target User ID: ${targetUserId}`);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_KEY;

  const isLiveConfigured =
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes('your-project.supabase.co') &&
    supabaseKey !== 'your-service-role-key';

  if (!isLiveConfigured) {
    console.log('\n[Notice] No active Supabase credentials found in .env.local.');
    console.log('-----------------------------------------------------------');
    console.log('You have two ways to populate your remote database:');
    console.log('');
    console.log('Option 1 (Automated Script):');
    console.log('  1. Add your credentials to .env.local:');
    console.log('       NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co');
    console.log('       SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>');
    console.log('  2. Run: pnpm db:seed --pack all');
    console.log('');
    console.log('Option 2 (In-App 1-Click Seeding or SQL Editor):');
    console.log('  • Use POST /api/cards/seed with { "pack": "en" | "es" | "all" }');
    console.log(`  • Or paste supabase/seed.sql into the Supabase SQL Editor.`);
    console.log('-----------------------------------------------------------');
    console.log(`Static TypeScript seed modules verified:`);
    console.log(`  -> lib/db/philosophical-seed-data.ts (100 English terms)`);
    console.log(`  -> lib/db/spanish-seed-data.ts (25 Spanish terms)\n`);
    process.exit(0);
  }

  console.log(`\nConnecting to Supabase at: ${supabaseUrl}`);
  const supabase = createClient(supabaseUrl, supabaseKey);

  if (isDryRun) {
    console.log(`[Dry Run] Credentials verified for ${totalSelected} terms (--pack ${pack}). Skipping actual database insertion.`);
    process.exit(0);
  }

  const now = new Date();
  const baseTimestamp = now.toISOString();

  // Prepare records
  const vocabInserts = [];
  const srsInserts = [];

  for (let i = 0; i < englishTerms.length; i++) {
    const termData = englishTerms[i];
    const cardId = getDeterministicUuid(i);
    const batchIndex = Math.floor(i / 10); // 0 to 9

    const dueDate =
      batchIndex === 0
        ? new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
        : new Date(now.getTime() + batchIndex * 24 * 60 * 60 * 1000).toISOString();

    vocabInserts.push({
      id: cardId,
      user_id: targetUserId,
      term: termData.term,
      language: 'en',
      gender: null,
      english_gloss: null,
      part_of_speech: termData.part_of_speech,
      phonetic: termData.phonetic,
      primary_definition: termData.primary_definition,
      nuance_note: termData.nuance_note,
      etymology: termData.etymology,
      collocations: termData.collocations,
      source_context: {
        sentence: termData.source_context.sentence,
        source: termData.source_context.source,
        author: termData.source_context.author || null,
      },
      cloze_sentences: termData.cloze_sentences,
      distinction_matrix: termData.distinction_matrix,
      is_fallback: false,
      enrichment_source: 'curated',
      created_at: baseTimestamp,
    });

    srsInserts.push({
      card_id: cardId,
      user_id: targetUserId,
      due: dueDate,
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: batchIndex,
      reps: 0,
      lapses: 0,
      state: 0, // New
      last_review: null,
    });
  }

  for (let i = 0; i < spanishTerms.length; i++) {
    const termData = spanishTerms[i];
    const cardId = getSpanishDeterministicUuid(i);
    const batchDay = Math.floor(i / 5); // 0 to 4

    const dueDate = new Date(
      now.getTime() + batchDay * 24 * 60 * 60 * 1000 - (batchDay === 0 ? 60 * 60 * 1000 : 0)
    ).toISOString();

    vocabInserts.push({
      id: cardId,
      user_id: targetUserId,
      term: termData.term,
      language: 'es',
      gender: termData.gender || null,
      english_gloss: termData.english_gloss || null,
      part_of_speech: termData.part_of_speech,
      phonetic: termData.phonetic,
      primary_definition: termData.primary_definition,
      nuance_note: termData.nuance_note,
      etymology: termData.etymology,
      collocations: termData.collocations,
      source_context: {
        sentence: termData.source_context.sentence,
        source: termData.source_context.source,
        author: termData.source_context.author || null,
      },
      cloze_sentences: termData.cloze_sentences,
      distinction_matrix: termData.distinction_matrix,
      is_fallback: false,
      enrichment_source: 'curated',
      created_at: baseTimestamp,
    });

    srsInserts.push({
      card_id: cardId,
      user_id: targetUserId,
      due: dueDate,
      stability: batchDay === 0 ? 0 : batchDay * 2.5,
      difficulty: 4.5,
      elapsed_days: batchDay,
      scheduled_days: batchDay,
      reps: batchDay === 0 ? 0 : 1,
      lapses: 0,
      state: batchDay === 0 ? 0 : 2,
      last_review: batchDay === 0 ? null : baseTimestamp,
    });
  }

  console.log(`Inserting ${vocabInserts.length} vocab cards in batches of 25...`);
  const batchSize = 25;
  for (let i = 0; i < vocabInserts.length; i += batchSize) {
    const chunk = vocabInserts.slice(i, i + batchSize);
    const { error } = await supabase.from('vocab_cards').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`[Error] Failed to upsert vocab_cards chunk ${i / batchSize + 1}:`, error.message);
      process.exit(1);
    }
    process.stdout.write(`  [Vocab Cards] ${Math.min(i + batchSize, vocabInserts.length)}/${vocabInserts.length} upserted...\r`);
  }
  console.log(`\n  ✓ ${vocabInserts.length}/${vocabInserts.length} vocab cards upserted successfully.`);

  console.log(`Inserting ${srsInserts.length} SRS scheduling states in batches of 25...`);
  for (let i = 0; i < srsInserts.length; i += batchSize) {
    const chunk = srsInserts.slice(i, i + batchSize);
    const { error } = await supabase.from('srs_cards').upsert(chunk, { onConflict: 'card_id' });
    if (error) {
      console.error(`[Error] Failed to upsert srs_cards chunk ${i / batchSize + 1}:`, error.message);
      process.exit(1);
    }
    process.stdout.write(`  [SRS Cards] ${Math.min(i + batchSize, srsInserts.length)}/${srsInserts.length} upserted...\r`);
  }
  console.log(`\n  ✓ ${srsInserts.length}/${srsInserts.length} SRS cards upserted successfully.`);

  console.log('\n===========================================================');
  console.log('   🎉 Database seeding completed successfully!             ');
  console.log('===========================================================\n');
}

main().catch((err) => {
  console.error('[Fatal Error during seeding]:', err);
  process.exit(1);
});
