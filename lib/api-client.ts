// ============================================================================
// Browser API Client
// ----------------------------------------------------------------------------
// The server (Supabase) is the single source of truth. Pages read and write
// only through these calls, and failures throw instead of being swallowed.
// ============================================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });

  if (res.status === 401 && typeof window !== 'undefined' && window.location.pathname !== '/unlock') {
    const next = window.location.pathname + window.location.search;
    window.location.href = `/unlock?next=${encodeURIComponent(next)}`;
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(body?.error || `Request failed (${res.status})`, res.status, body);
  }
  return body as T;
}

export function errorMessageOf(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

// Fired after any write so the navbar due-count and other views refresh
export const CARDS_UPDATED_EVENT = 'lexis-cards-updated';

export function notifyCardsUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CARDS_UPDATED_EVENT));
  }
}
