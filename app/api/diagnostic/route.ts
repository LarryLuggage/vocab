import { NextResponse } from 'next/server';
import { getGeminiApiKey } from '@/lib/llm/enricher';

export const dynamic = 'force-dynamic';

export async function GET() {
  const geminiKey = getGeminiApiKey();
  const rawGeminiEnv = process.env.GEMINI_API_KEY;
  const rawGoogleEnv = process.env.GOOGLE_API_KEY;
  const rawNextPublicGemini = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const rawGeminiKeyEnv = process.env.GEMINI_KEY;
  const rawGoogleAiKey = process.env.GOOGLE_AI_KEY;

  const envInspection = {
    hasEffectiveGeminiKey: Boolean(geminiKey),
    geminiKeyLength: geminiKey ? geminiKey.length : 0,
    geminiKeyPrefix: geminiKey ? `${geminiKey.substring(0, 4)}...${geminiKey.substring(geminiKey.length - 3)}` : null,
    variablesChecked: {
      GEMINI_API_KEY: Boolean(rawGeminiEnv),
      GOOGLE_API_KEY: Boolean(rawGoogleEnv),
      NEXT_PUBLIC_GEMINI_API_KEY: Boolean(rawNextPublicGemini),
      GEMINI_KEY: Boolean(rawGeminiKeyEnv),
      GOOGLE_AI_KEY: Boolean(rawGoogleAiKey),
    },
    configuredModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash (default)',
    supabaseConfigured: Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
    vercelEnvironment: process.env.VERCEL_ENV || 'local / not set',
    nodeEnv: process.env.NODE_ENV || 'development',
  };

  let geminiProbeResult: any = {
    tested: false,
    message: 'No Gemini API key detected in server environment.',
  };

  if (geminiKey) {
    const candidateModels = [
      process.env.GEMINI_MODEL,
      'gemini-2.0-flash',
      'gemini-1.5-flash',
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
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'OK';
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

  return NextResponse.json(
    {
      status: geminiProbeResult.overallSuccess ? 'HEALTHY' : geminiKey ? 'KEY_ERROR' : 'MISSING_API_KEY',
      timestamp: new Date().toISOString(),
      environment: envInspection,
      geminiProbe: geminiProbeResult,
      dictionaryFallbackProbe: dictionaryProbe,
      guidance: !geminiKey
        ? 'GEMINI_API_KEY is not available to this deployment. In Vercel Project Settings -> Environment Variables, add GEMINI_API_KEY for Production, then redeploy.'
        : !geminiProbeResult.overallSuccess
        ? 'Google Gemini API rejected the request. Inspect geminiProbe.models for the exact error code from Google.'
        : 'All systems operational. Gemini API is connected and responding.',
    },
    { status: 200 }
  );
}
