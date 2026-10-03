'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookMarked, Plus, Sparkles, Library, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getClientCards, getDueCards } from '@/lib/sample-data';

export default function Navbar() {
  const pathname = usePathname();
  const [dueCount, setDueCount] = useState<number>(0);

  const updateCounter = () => {
    try {
      const cards = getClientCards();
      const due = getDueCards(cards);
      setDueCount(due.length);
    } catch {
      setDueCount(0);
    }
  };

  useEffect(() => {
    updateCounter();

    const handleUpdate = () => updateCounter();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('lexis-cards-updated', handleUpdate);

    // Periodic check every 30s
    const timer = setInterval(updateCounter, 30000);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('lexis-cards-updated', handleUpdate);
      clearInterval(timer);
    };
  }, []);

  const navLinks = [
    {
      href: '/lexicon',
      label: 'Lexicon',
      icon: Library,
      active: pathname === '/lexicon' || pathname === '/',
    },
    {
      href: '/review',
      label: 'Review Queue',
      icon: Sparkles,
      active: pathname.startsWith('/review'),
      badge: dueCount > 0 ? `${dueCount} due` : null,
    },
  ];

  return (
    <>
      {/* Desktop / Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#e7e5e4] bg-[#fbf9f5]/90 backdrop-blur-md transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link
              href="/lexicon"
              className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <div className="w-8 h-8 rounded-lg bg-[#834832] flex items-center justify-center text-[#fdf8f6] shadow-sm shadow-[#834832]/20 group-hover:scale-105 transition-transform">
                <BookMarked className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-wider font-bold text-lg text-[#1c1917] leading-none">
                  LEXIS
                </span>
                <span className="text-[10px] tracking-widest uppercase font-sans text-[#78716c] font-medium mt-0.5">
                  Engine
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 ml-4">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 font-sans',
                      item.active
                        ? 'bg-[#834832]/10 text-[#834832] font-semibold'
                        : 'text-[#57534e] hover:text-[#1c1917] hover:bg-stone-200/50'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#834832] text-white animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Action Button: Quick Capture */}
          <div className="flex items-center gap-3">
            <Link
              href="/add"
              className={cn(
                'group inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm font-sans',
                pathname === '/add'
                  ? 'bg-[#4f2416] text-[#fdf8f6] ring-2 ring-[#834832]/30'
                  : 'bg-[#834832] text-[#fdf8f6] hover:bg-[#693522] active:scale-95 shadow-[#834832]/15'
              )}
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span className="font-medium">Quick Capture</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] bg-[#693522] text-[#eaddd7] rounded font-mono border border-[#9e5f48]/40">
                ⌘K
              </kbd>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Single Thumb Friendly) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-lg border-t border-[#e7e5e4] px-4 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link
            href="/lexicon"
            className={cn(
              'flex flex-col items-center py-1 px-3 rounded-lg text-xs font-sans transition-colors',
              pathname === '/lexicon' || pathname === '/'
                ? 'text-[#834832] font-semibold'
                : 'text-[#78716c] hover:text-[#1c1917]'
            )}
          >
            <Library className="w-5 h-5 mb-0.5" />
            <span>Lexicon</span>
          </Link>

          <Link
            href="/add"
            className={cn(
              'flex flex-col items-center py-1 px-4 rounded-full text-xs font-sans transition-all -translate-y-2 bg-[#834832] text-white shadow-md shadow-[#834832]/25',
              pathname === '/add' ? 'ring-2 ring-stone-900 ring-offset-2' : ''
            )}
          >
            <Plus className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-bold">Capture</span>
          </Link>

          <Link
            href="/review"
            className={cn(
              'flex flex-col items-center py-1 px-3 rounded-lg text-xs font-sans relative transition-colors',
              pathname.startsWith('/review')
                ? 'text-[#834832] font-semibold'
                : 'text-[#78716c] hover:text-[#1c1917]'
            )}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span>Review</span>
            {dueCount > 0 && (
              <span className="absolute top-0 right-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-[#834832] text-white">
                {dueCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </>
  );
}
