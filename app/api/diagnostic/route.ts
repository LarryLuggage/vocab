import { NextResponse } from 'next/server';
import { getGeminiApiKey } from '@/lib/llm/enricher';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

async function probeSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const allowMemory = process.env.LEXIS_ALLOW_MEMORY_STORE === 'true';

  const info = {
    hasUrl: Boolean(url),
    urlHost: url
      ? (() => {
          try {
            return new URL(url).host;
          } catch {
            return url;
          }
        })()
      : null,
    hasServiceRoleKey: Boolean(serviceKey),
    serviceKeyLength: serviceKey ? serviceKey.length : 0,
    serviceKeyPrefix: serviceKey
      ? `${serviceKey.substring(0, 5)}...${serviceKey.substring(serviceKey.length - 4)}`
      : null,
    hasAnonKey: Boolean(anonKey),
    anonKeyLength: anonKey ? anonKey.length : 0,
    allowMemoryStore: allowMemory,
  };

  if (!url) {
    return {
      status: allowMemory ? 'IN_MEMORY_MODE' : 'MISSING_URL',
      info,
      success: allowMemory,
      message: 'NEXT_PUBLIC_SUPABASE_URL is not set.',
      guidance: 'Add NEXT_PUBLIC_SUPABASE_URL to your environment variables.',
    };
  }

  if (!serviceKey) {
    return {
      status: allowMemory ? 'IN_MEMORY_MODE' : 'MISSING_SERVICE_ROLE_KEY',
      info,
      success: allowMemory,
      message:
        'Database secret key is missing. The native Vercel/Supabase integration only configures the publishable/anon key.',
      guidance:
        'In Supabase Dashboard -> Project Settings -> API, copy the "Default secret key" and add it to Vercel Environment Variables as SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY). If you need temporary preview access, set LEXIS_ALLOW_MEMORY_STORE=true.',
    };
  }

  // Active query probe using service role key
  try {
    const client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await client
      .from('vocab_cards')
      .select('id, term, distinction_matrix')
      .limit(1);

    if (error) {
      const isMissingColumn =
        error.message.toLowerCase().includes('distinction_matrix') ||
        error.code === '42703';
      const isTableMissing =
        error.message.toLowerCase().includes('relation "vocab_cards" does not exist') ||
        error.code === '42P01';

      if (isMissingColumn) {
        return {
          status: 'MIGRATION_PENDING',
          info,
          success: false,
          error: error.message,
          errorCode: error.code,
          guidance:
            'The distinction_matrix column is missing. Run migration supabase/migrations/20261005_align_schema_with_app.sql in your Supabase SQL Editor.',
        };
      }

      if (isTableMissing) {
        return {
          status: 'TABLES_MISSING',
          info,
          success: false,
          error: error.message,
          errorCode: error.code,
          guidance:
            'The vocab_cards table does not exist. Run the initial schema migration in your Supabase SQL Editor.',
        };
      }

      return {
        status: 'QUERY_ERROR',
        info,
        success: false,
        error: error.message,
        errorCode: error.code,
        guidance: `Database query failed: ${error.message}`,
      };
    }

    return {
      status: 'HEALTHY',
      info,
      success: true,
      message: 'Supabase connected with service-role key, schema verified.',
      cardCountSample: data?.length ?? 0,
    };
  } catch (err: any) {
    return {
      status: 'CONNECTION_ERROR',
      info,
      success: false,
      error: err?.message || String(err),
      guidance: 'Could not connect to Supabase. Check network connectivity and NEXT_PUBLIC_SUPABASE_URL.',
    };
  }
}

export async function GET() {
  const geminiKey = getGeminiApiKey();
  const rawGeminiEnv = process.env.GEMINI_API_KEY;
  const rawGoogleEnv = process.env.GOOGLE_API_KEY;
  const rawNextPublicGemini = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const rawGeminiKeyEnv = process.env.GEMINI_KEY;
  const rawGoogleAiKey = process.env.GOOGLE_AI_KEY;
  const secretToken = process.env.LEXIS_SECRET_TOKEN;

  const supabaseProbe = await probeSupabase();

  const envInspection = {
    hasEffectiveGeminiKey: Boolean(geminiKey),
    geminiKeyLength: geminiKey ? geminiKey.length : 0,
    geminiKeyPrefix: geminiKey
      ? `${geminiKey.substring(0, 4)}...${geminiKey.substring(geminiKey.length - 3)}`
      : null,
    variablesChecked: {
      GEMINI_API_KEY: Boolean(rawGeminiEnv),
      GOOGLE_API_KEY: Boolean(rawGoogleEnv),
      NEXT_PUBLIC_GEMINI_API_KEY: Boolean(rawNextPublicGemini),
      GEMINI_KEY: Boolean(rawGeminiKeyEnv),
      GOOGLE_AI_KEY: Boolean(rawGoogleAiKey),
    },
    configuredModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash (default)',
    supabaseProbe: supabaseProbe.info,
    authGated: Boolean(secretToken),
    secretTokenLength: secretToken ? secretToken.length : 0,
    vercelEnvironment: process.env.VERCEL_ENV || 'local / not set',
    nodeEnv: process.env.NODE_ENV || 'development',
  };

  let geminiProbeResult: any = {
    tested: false,
    message: 'No Gemini API key detected in server environment.',
  };

  if (geminiKey) {
    let availableFromGoogle: string[] = [];
    try {
      const listRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`
      );
      if (listRes.ok) {
        const listData = await listRes.json();
        if (Array.isArray(listData.models)) {
          availableFromGoogle = listData.models
            .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
            .map((m: any) => m.name.replace(/^models\//, ''));
        }
      }
    } catch {
      // ignore
    }

    const candidateModels = [
      process.env.GEMINI_MODEL,
      'gemini-3.8-flash',
      'gemini-2.5-flash',
      ...availableFromGoogle.slice(0, 3),
      'gemini-2.0-flash',
    ].filter(Boolean) as string[];
    const uniqueModels = Array.from(new Set(candidateModels));

    const modelTests: Record<string, any> = {};

    for (const model of uniqueModels) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 6000);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with the word "pong".' }] }],
          }),
        });
        clearTimeout(timer);

        if (res.ok) {
          const data = await res.json().catch(() => null);
          const replyText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'OK';
          modelTests[model] = {
            success: true,
            status: res.status,
            reply: replyText,
          };
        } else {
          const errBody = await res.text().catch(() => '');
          modelTests[model] = {
            success: false,
            status: res.status,
            statusText: res.statusText,
            errorBody: errBody.substring(0, 500),
          };
        }
      } catch (err: any) {
        modelTests[model] = {
          success: false,
          error: err?.message || String(err),
        };
      }
    }

    const anySuccess = Object.values(modelTests).some((m: any) => m.success);
    geminiProbeResult = {
      tested: true,
      overallSuccess: anySuccess,
      availableModelsFromGoogle: availableFromGoogle,
      models: modelTests,
    };
  }

  // Probe Public Dictionary Fallback API
  let dictionaryProbe = { success: false };
  try {
    const dictRes = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/test');
    dictionaryProbe = { success: dictRes.ok };
  } catch {
    dictionaryProbe = { success: false };
  }

  // Determine Overall Status
  let overallStatus = 'HEALTHY';
  let guidance = 'All systems operational.';

  if (!supabaseProbe.success) {
    overallStatus = supabaseProbe.status;
    guidance = supabaseProbe.guidance || 'Database configuration issue detected.';
  } else if (!geminiKey) {
    overallStatus = 'MISSING_GEMINI_KEY';
    guidance =
      'GEMINI_API_KEY is not available to this deployment. In Vercel Project Settings -> Environment Variables, add GEMINI_API_KEY for Production, then redeploy.';
  } else if (!geminiProbeResult.overallSuccess) {
    overallStatus = 'GEMINI_KEY_ERROR';
    guidance =
      'Google Gemini API rejected the request. Inspect geminiProbe.models for the exact error code from Google.';
  }

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      environment: envInspection,
      supabaseProbe,
      geminiProbe: geminiProbeResult,
      dictionaryFallbackProbe: dictionaryProbe,
      guidance,
    },
    { status: 200 }
  );
}
