export interface DiagnosticStatusInput {
  supabaseSuccess: boolean;
  supabaseStatus: string;
  supabaseGuidance?: string;
  hasGeminiKey: boolean;
  pingSuccess: boolean;
  enrichmentTested: boolean;
  enrichmentSuccess: boolean;
  enrichmentError?: string | null;
}

export function resolveDiagnosticStatus(input: DiagnosticStatusInput): {
  status: string;
  guidance: string;
} {
  if (!input.supabaseSuccess) {
    return {
      status: input.supabaseStatus,
      guidance: input.supabaseGuidance || 'Database configuration issue detected.',
    };
  }
  if (!input.hasGeminiKey) {
    return {
      status: 'MISSING_GEMINI_KEY',
      guidance:
        'GEMINI_API_KEY is not available to this deployment. In Vercel Project Settings -> Environment Variables, add GEMINI_API_KEY for Production, then redeploy.',
    };
  }
  if (!input.pingSuccess) {
    return {
      status: 'GEMINI_KEY_ERROR',
      guidance:
        'Google Gemini API rejected the request. Inspect geminiProbe.models for the exact error code from Google.',
    };
  }
  if (input.enrichmentTested && !input.enrichmentSuccess) {
    return {
      status: 'GEMINI_ENRICHMENT_FAILED',
      guidance: `Gemini responded to ping but lexical enrichment failed: ${input.enrichmentError || 'schema or timeout error'}`,
    };
  }
  if (!input.enrichmentTested) {
    return {
      status: 'ENRICHMENT_UNTESTED',
      guidance:
        'Gemini answered a short ping, but lexical enrichment was not run. Open /api/diagnostic?enrichment=true to test a real word. Do not treat this response as proof that enrichment is healthy.',
    };
  }
  return {
    status: 'HEALTHY',
    guidance: 'All systems operational, including a live lexical enrichment.',
  };
}
