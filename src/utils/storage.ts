// src/utils/storage.ts
export function clearFlatMatchStorage() {
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (k.startsWith('flatmatch:') || k.startsWith('fm:')) toRemove.push(k);
    }
    // Fallback: if you know exact keys, you can also list them explicitly:
    // ['flatmatch:listings', 'flatmatch:bookmarks'].forEach(k => toRemove.push(k));
    toRemove.forEach((k) => localStorage.removeItem(k));
  }
  