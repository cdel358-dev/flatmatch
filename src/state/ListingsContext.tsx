// src/state/ListingsContext.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import { popularMock, nearbyMock } from '../data/mockListings';
import { flatmatesByListing } from '../data/mockFlatmates';

/* -------- Types you can expand later -------- */
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
  img?: string;
  price?: string;
  badge?: string;
  type?: ListingType;
  loc?: string;
  km?: number;
  saved?: boolean;
  desc?: string;
  rating?: number;
  reviews?: number;
  images?: string[];
  flatmates?: Flatmate[];
  tradeMeUrl?: string;
  hostEmail?: string;
  // optional: visibleReviews?: number;
};

/* -------- Helper: attach flatmates from mock map if missing -------- */
function attachFlatmates<T extends { id: string; flatmates?: Flatmate[] }>(list: T[]): T[] {
  return list.map((l) => ({
    ...l,
    flatmates: l.flatmates && l.flatmates.length ? l.flatmates : (flatmatesByListing[l.id] ?? []),
  }));
}

/* -------- Context shape -------- */
type ListingsState = {
  popular: Listing[];
  nearby: Listing[];
  getListingById: (
    id: string
  ) => { listing: Listing | undefined; source: 'popular' | 'nearby' | undefined; index: number };
  toggleSaved: (id: string) => void;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  refresh: () => void; // reload from mocks (you can replace with API later)
};

const Ctx = createContext<ListingsState | null>(null);

/* -------- Provider -------- */
export function ListingsProvider({ children }: { children: React.ReactNode }) {
  // Seed from mocks; attach flatmates for convenience
  const [popular, setPopular] = useState<Listing[]>(attachFlatmates([...popularMock]));
  const [nearby, setNearby] = useState<Listing[]>(attachFlatmates([...nearbyMock]));

  const getListingById: ListingsState['getListingById'] = (id) => {
    const pIdx = popular.findIndex((l) => l.id === id);
    if (pIdx !== -1) return { listing: popular[pIdx], source: 'popular', index: pIdx };
    const nIdx = nearby.findIndex((l) => l.id === id);
    if (nIdx !== -1) return { listing: nearby[nIdx], source: 'nearby', index: nIdx };
    return { listing: undefined, source: undefined, index: -1 };
    // (If you later add a DB/service, look there too.)
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
    // Replace with API calls later; keep attachFlatmates so names show under avatars
    setPopular(attachFlatmates([...popularMock]));
    setNearby(attachFlatmates([...nearbyMock]));
  };

  const value = useMemo<ListingsState>(
    () => ({ popular, nearby, getListingById, toggleSaved, updateListing, refresh }),
    [popular, nearby]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* -------- Hook -------- */
export function useListings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useListings must be used within a ListingsProvider');
  return ctx;
}
