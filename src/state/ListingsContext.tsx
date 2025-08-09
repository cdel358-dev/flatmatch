import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getDb, ListingRow } from '../db/appDb';

export type ListingType = 'Studio' | '1BR' | '2BR' | 'Flatmate';
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
  flatmates?: { id: string; name: string; verified?: boolean }[];
  tradeMeUrl?: string;
  hostEmail?: string;
};

type ListingsState = {
  popular: Listing[];
  nearby: Listing[];
  toggleSaved: (id: string) => void;
  getListingById: (id: string) => { listing: Listing | undefined; source: 'popular' | 'nearby' | undefined };
  updateListing: (id: string, patch: Partial<Listing>) => void;
};

const Ctx = createContext<ListingsState | null>(null);

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [popular, setPopular] = useState<Listing[]>([
    { id: 'p1', title: 'Sunny 1BR near CBD', subtitle: 'Hamilton Central', price: '$420/wk', badge: 'Popular', type: '1BR', loc: 'Hamilton', km: 1.0, saved: true },
    { id: 'p2', title: 'Modern studio',       subtitle: 'Hillcrest',         price: '$350/wk',                         type: 'Studio',  loc: 'Hillcrest', km: 2.2 },
    { id: 'p3', title: '2BR with parking',    subtitle: 'Rototuna',          price: '$520/wk',                         type: '2BR',     loc: 'Rototuna', km: 4.5, saved: true },
    { id: 'p4', title: 'Flatmate wanted',     subtitle: 'Frankton',          price: '$210/wk',                         type: 'Flatmate',loc: 'Frankton', km: 3.6 },
  ]);
  const [nearby, setNearby] = useState<Listing[]>([
    { id: 'n1', title: 'City studio',  subtitle: '0.5 km • CBD',        price: '$380/wk', badge: 'Nearby', type: 'Studio',  loc: 'CBD',         km: 0.5 },
    { id: 'n2', title: 'Cozy 1BR',     subtitle: '1.2 km • River Rd',   price: '$410/wk',                 type: '1BR',     loc: 'River Rd',    km: 1.2 },
    { id: 'n3', title: 'Shared room',  subtitle: '1.9 km • Five Cross', price: '$180/wk',                 type: 'Flatmate',loc: 'Five Cross',  km: 1.9 },
    { id: 'n4', title: 'Large 2BR',    subtitle: '2.4 km • Claudelands',price: '$540/wk',                 type: '2BR',     loc: 'Claudelands', km: 2.4 },
  ]);

  const db = useMemo(() => getDb(), []);

  // Hydrate from DB if available
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!db) return;
      try {
        const rows = await db.table<ListingRow>('listings').toArray();
        if (cancelled) return;
        if (rows.length === 0) {
          // seed current state
          const now = Date.now();
          await db.table<ListingRow>('listings').bulkPut([
            ...popular.map(l => ({ ...l, source: 'popular' as const, updatedAt: now })),
            ...nearby.map(l => ({ ...l, source: 'nearby' as const,  updatedAt: now })),
          ]);
          return;
        }
        const p = rows.filter(r => r.source === 'popular');
        const n = rows.filter(r => r.source === 'nearby');
        if (p.length) setPopular(p);
        if (n.length) setNearby(n);
      } catch (e) {
        // swallow errors so UI still renders
        console.error('IndexedDB load failed:', e);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);

  const getListingById = (id: string) => {
    const p = popular.find(l => l.id === id);
    if (p) return { listing: p, source: 'popular' as const };
    const n = nearby.find(l => l.id === id);
    if (n) return { listing: n, source: 'nearby' as const };
    return { listing: undefined, source: undefined };
  };

  const persistLane = async (source: 'popular' | 'nearby', list: Listing[]) => {
    if (!db) return;
    try {
      const now = Date.now();
      await db.table<ListingRow>('listings').bulkPut(
        list.map(l => ({ ...(l as ListingRow), source, updatedAt: now })),
      );
    } catch (e) {
      console.error('IndexedDB write failed:', e);
    }
  };

  const setList = (source: 'popular' | 'nearby', updater: (list: Listing[]) => Listing[]) => {
    if (source === 'popular') {
      setPopular(prev => {
        const next = updater(prev);
        void persistLane('popular', next);
        return next;
      });
    } else {
      setNearby(prev => {
        const next = updater(prev);
        void persistLane('nearby', next);
        return next;
      });
    }
  };

  const updateListing = (id: string, patch: Partial<Listing>) => {
    const found = getListingById(id);
    if (!found.source) return;
    setList(found.source, list => list.map(l => (l.id === id ? { ...l, ...patch } : l)));
  };

  const toggleSaved = (id: string) => {
    const found = getListingById(id);
    if (!found.source) return;
    setList(found.source, list => list.map(l => (l.id === id ? { ...l, saved: !l.saved } : l)));
  };

  const value = useMemo(() => ({ popular, nearby, toggleSaved, getListingById, updateListing }), [popular, nearby]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useListings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useListings must be used within a ListingsProvider');
  return ctx;
}
