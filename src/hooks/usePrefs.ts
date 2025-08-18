import { useCallback } from 'react';

export type Prefs = {
  priceMin?: number;
  priceMax?: number;
  location?: string;
  category?: 'Studio' | 'Single' | 'Double' | 'En suite' | '';
};

const PREFS_KEY = 'fm_prefs';
const AUTO_KEY = 'fm_prefs_auto'; // "1" means auto-apply once on next visit

export function readPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function writePrefs(prefs: Prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function enableAutoApplyOnce() {
  localStorage.setItem(AUTO_KEY, '1');
}

export function consumeAutoApply(): boolean {
  const v = localStorage.getItem(AUTO_KEY);
  if (v === '1') localStorage.removeItem(AUTO_KEY);
  return v === '1';
}

export function usePrefs() {
  const get = useCallback(() => readPrefs(), []);
  const set = useCallback((p: Prefs) => writePrefs(p), []);
  const clear = useCallback(() => localStorage.removeItem(PREFS_KEY), []);
  const enableAuto = useCallback(() => enableAutoApplyOnce(), []);
  const consumeAuto = useCallback(() => consumeAutoApply(), []);
  return { get, set, clear, enableAuto, consumeAuto };
}
