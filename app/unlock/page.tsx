'use client';

import React, { useEffect, useRef, useState } from 'react';
import { KeyRound, AlertTriangle } from 'lucide-react';
import { sanitizeNextPath } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default function UnlockPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorMessage(body?.error || `Unlock failed (${res.status})`);
        return;
      }
      const next = new URLSearchParams(window.location.search).get('next');
      // Full navigation so the new cookie applies to the next request
      window.location.replace(sanitizeNextPath(next));
    } catch {
      setErrorMessage('Could not reach the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-16 space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1.5 border-b border-[#e7e5e4] pb-4">
        <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#834832] font-semibold">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Private Lexicon</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#1c1917] tracking-tight">Unlock Lexis</h1>
        <p className="text-sm font-sans text-[#78716c]">
          Enter your <code className="font-mono text-xs">LEXIS_SECRET_TOKEN</code>. This browser stays
          unlocked until the token changes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          ref={inputRef}
          type="password"
          autoComplete="current-password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Secret token"
          className="w-full px-4 py-3 rounded-xl border border-[#e7e5e4] bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#834832]/30"
        />
        <button
          type="submit"
          disabled={isSubmitting || !token.trim()}
          className={cn(
            'w-full px-5 py-3 rounded-xl text-sm font-sans font-semibold transition-all',
            isSubmitting || !token.trim()
              ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
              : 'bg-[#834832] hover:bg-[#693522] text-white shadow-sm'
          )}
        >
          {isSubmitting ? 'Unlocking…' : 'Unlock'}
        </button>
      </form>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span className="text-sm font-sans">{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
