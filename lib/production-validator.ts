import { ProductionValidationResult } from '@/types/lexis';
import { apiFetch } from '@/lib/api-client';

// Browser-side call to the production sandbox validator (ACT-03).
// Failures throw so the UI can say the sentence went unverified, rather than
// substituting a rule-of-thumb verdict that looks like real feedback.
export async function validateProductionSentence(
  term: string,
  userSentence: string,
  cardId?: string
): Promise<ProductionValidationResult> {
  const res = await apiFetch<{ data: ProductionValidationResult }>('/api/validate-production', {
    method: 'POST',
    body: JSON.stringify({
      term: term.trim(),
      userSentence: userSentence.trim(),
      cardId,
    }),
  });
  return res.data;
}
