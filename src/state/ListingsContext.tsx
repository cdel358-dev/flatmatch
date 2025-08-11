// src/state/ListingsContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { popularMock, nearbyMock } from '../data/mockListings';
import { flatmatesByListing } from '../data/mockFlatmates';
import { loadListingImages, preloadListingImages } from "../lib/imageManifest";

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
  const LS_VERSION_KEY = 'flatmatch:seedVersion';
  const SEED_VERSION = 3;
  
  useEffect(() => {
    const current = Number(localStorage.getItem(LS_VERSION_KEY) || '0');
    if (current !== SEED_VERSION) {
      // Clear the single bundle your provider uses
      localStorage.removeItem('flatmatch:listings:v1'); // STORAGE_KEY in this file
      localStorage.setItem(LS_VERSION_KEY, String(SEED_VERSION));
    }
  }, []);
  
  const storage = loadFromStorage();
  const [popular, setPopular] = useState<Listing[]>(
    attachFlatmates(storage?.popular ?? [...popularMock])
  );
  const [nearby, setNearby] = useState<Listing[]>(
    attachFlatmates(storage?.nearby ?? [...nearbyMock])
  );

  
  useEffect(() => {
    // 1) warm-up (first dozen so the grid pops immediately)
    const initialIds = [...popularMock, ...nearbyMock].slice(0, 12).map(l => l.id);
    preloadListingImages(initialIds);
  
    // 2) hydrate all images and merge into state once
    let cancelled = false;
    (async () => {
      const all = [...popularMock, ...nearbyMock];
      const pairs = await Promise.all(all.map(async l => [l.id, await loadListingImages(l.id)] as const));
      if (cancelled) return;
  
      setPopular(prev => prev.map(l => {
        const match = pairs.find(([id]) => id === l.id);
        return match ? { ...l, images: match[1] } : l;
      }));
      setNearby(prev => prev.map(l => {
        const match = pairs.find(([id]) => id === l.id);
        return match ? { ...l, images: match[1] } : l;
      }));
    })();
  
    return () => { cancelled = true; };
  }, []);

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

  // Hydrate gallery images from public manifests and set card thumbnail (img)
  useEffect(() => {
    // Capture initial IDs
    const ids = [...popularMock, ...nearbyMock].map(l => l.id);

    // Warm up a few so the grid feels instant
    preloadListingImages(ids.slice(0, 12));

    let cancelled = false;
    (async () => {
      const pairs = await Promise.all(ids.map(async id => [id, await loadListingImages(id)] as const));
      if (cancelled) return;
      const map = new Map(pairs);

      setPopular(prev =>
        prev.map(l => {
          const imgs = l.images?.length ? l.images : (map.get(l.id) ?? []);
          return {
            ...l,
            images: imgs,
            img: l.img ?? imgs[0] ?? l.img, // ensure card thumbnail
          };
        })
      );
      setNearby(prev =>
        prev.map(l => {
          const imgs = l.images?.length ? l.images : (map.get(l.id) ?? []);
          return {
            ...l,
            images: imgs,
            img: l.img ?? imgs[0] ?? l.img,
          };
        })
      );
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
