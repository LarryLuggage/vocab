import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes a cloze marker token (`{{c1::word}}`, `{{c2::word::hint}}`, or `{{word}}`)
 * into the clean target word (`word`).
 */
export function extractClozeToken(rawMarker: string): string {
  const inner = rawMarker.replace(/^\{\{|\}\}$/g, "").trim();
  const withoutPrefix = inner.replace(/^c\d+::/i, "");
  return withoutPrefix.split("::")[0].trim();
}

