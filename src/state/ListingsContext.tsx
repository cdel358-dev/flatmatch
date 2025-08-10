// src/state/ListingsContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { popularMock, nearbyMock } from '../data/mockListings';
import { flatmatesByListing } from '../data/mockFlatmates';

/* ========= Types ========= */
export type ListingType = 'Studio' | '1BR' | '2BR' | 'Flatmate';

export type Flatmate = {
  id: string;
  name: string;
  verified?: boolean;
  avatar?: string;
  about?: string;
};

export type Listing = {
  id: string;
  title: string;
  subtitle?: string;
  img?: string | null;   // thumbnail for cards
  price?: string;
  badge?: string;
  type?: ListingType;
  loc?: string;
  km?: number;
  saved?: boolean;
  desc?: string;
  rating?: number;
  reviews?: number;
  images?: string[];     // gallery
  flatmates?: Flatmate[];
  tradeMeUrl?: string;
  hostEmail?: string;
  photos?: string[];     // legacy alias some pages might use
};

/* ========= Helpers ========= */
const STORAGE_KEY = 'flatmatch:listings:v1';

function attachFlatmates<T extends { id: string; flatmates?: Flatmate[] }>(list: T[]): T[] {
  return list.map((l) => ({
    ...l,
    flatmates: l.flatmates?.length ? l.flatmates : (flatmatesByListing[l.id] ?? []),
  }));
}

type PersistShape = { popular: Listing[]; nearby: Listing[]; savedAt: number };

function loadFromStorage(): PersistShape | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistShape;
    if (!parsed || !Array.isArray(parsed.popular) || !Array.isArray(parsed.nearby)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(state: PersistShape) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota or JSON errors
  }
}

/* ========= Context ========= */
type ListingsState = {
  popular: Listing[];
  nearby: Listing[];
  getListingById: (
    id: string
  ) => { listing: Listing | undefined; source: 'popular' | 'nearby' | undefined; index: number };
  toggleSaved: (id: string) => void;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  refresh: () => void;
  addListing: (l: Omit<Listing, 'id'> & { id?: string }) => string; // used by ListRoom
};

const Ctx = createContext<ListingsState | null>(null);

/* ========= Provider ========= */
export function ListingsProvider({ children }: { children: React.ReactNode }) {
  // Initial hydrate: load from storage, otherwise seed with mocks
  const storage = loadFromStorage();
  const [popular, setPopular] = useState<Listing[]>(
    attachFlatmates(storage?.popular ?? [...popularMock])
  );
  const [nearby, setNearby] = useState<Listing[]>(
    attachFlatmates(storage?.nearby ?? [...nearbyMock])
  );

  // Persist on changes (debounced) — avoids writing on every keystroke
  const persistTimer = useRef<number | null>(null);
  useEffect(() => {
    if (persistTimer.current) window.clearTimeout(persistTimer.current);
    persistTimer.current = window.setTimeout(() => {
      saveToStorage({ popular, nearby, savedAt: Date.now() });
    }, 200);
    return () => {
      if (persistTimer.current) window.clearTimeout(persistTimer.current);
    };
  }, [popular, nearby]);

  const getListingById: ListingsState['getListingById'] = (id) => {
    const pIdx = popular.findIndex((l) => l.id === id);
    if (pIdx !== -1) return { listing: popular[pIdx], source: 'popular', index: pIdx };
    const nIdx = nearby.findIndex((l) => l.id === id);
    if (nIdx !== -1) return { listing: nearby[nIdx], source: 'nearby', index: nIdx };
    return { listing: undefined, source: undefined, index: -1 };
  };

  const setLane = (source: 'popular' | 'nearby', updater: (arr: Listing[]) => Listing[]) => {
    if (source === 'popular') setPopular((prev) => updater(prev));
    else setNearby((prev) => updater(prev));
  };

  const updateListing: ListingsState['updateListing'] = (id, patch) => {
    const found = getListingById(id);
    if (!found.source || found.index < 0) return;
    setLane(found.source, (arr) =>
      arr.map((l, i) => (i === found.index ? { ...l, ...patch } : l))
    );
  };

  const toggleSaved: ListingsState['toggleSaved'] = (id) => {
    const found = getListingById(id);
    if (!found.source || found.index < 0) return;
    setLane(found.source, (arr) =>
      arr.map((l, i) => (i === found.index ? { ...l, saved: !l.saved } : l))
    );
  };

  const refresh = () => {
    // Reset to mocks (and persist)
    const p = attachFlatmates([...popularMock]);
    const n = attachFlatmates([...nearbyMock]);
    setPopular(p);
    setNearby(n);
    saveToStorage({ popular: p, nearby: n, savedAt: Date.now() });
  };

  const addListing: ListingsState['addListing'] = (l) => {
    const id = l.id ?? `u${Date.now()}`;
    const images = l.images ?? l.photos ?? [];
    const listing: Listing = {
      id,
      title: l.title || 'New room',
      subtitle: l.subtitle || l.loc,
      img: l.img ?? images[0] ?? null,   // ensure card thumbnail
      price: l.price,
      badge: l.badge ?? 'New',
      type: l.type,
      loc: l.loc,
      km: l.km,
      saved: false,
      desc: l.desc ?? '',
      rating: l.rating ?? 0,
      reviews: l.reviews ?? 0,
      images,
      flatmates: l.flatmates ?? [],
      tradeMeUrl: l.tradeMeUrl ?? '#',
      hostEmail: l.hostEmail,
    };
    setPopular((prev) => [listing, ...prev]); // insert at top of Popular
    // nearby unchanged
    // Persist immediately for this action so refresh after publish still shows it
    saveToStorage({ popular: [listing, ...popular], nearby, savedAt: Date.now() });
    return id;
  };

  const value = useMemo<ListingsState>(
    () => ({ popular, nearby, getListingById, toggleSaved, updateListing, refresh, addListing }),
    [popular, nearby]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* ========= Hook ========= */
export function useListings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useListings must be used within a ListingsProvider');
  return ctx;
}
