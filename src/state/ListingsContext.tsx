import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getDb, ListingRow } from '../db/appDb';
import { listingsService } from '../services';

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
  refresh: () => Promise<void>;
};

const Ctx = createContext<ListingsState | null>(null);

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [popular, setPopular] = useState<Listing[]>([]);
  const [nearby, setNearby] = useState<Listing[]>([]);
  const db = useMemo(() => getDb(), []);

  // Write a whole lane to IndexedDB (if available)
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

  const getListingById = (id: string) => {
    const p = popular.find(l => l.id === id);
    if (p) return { listing: p, source: 'popular' as const };
    const n = nearby.find(l => l.id === id);
    if (n) return { listing: n, source: 'nearby' as const };
    return { listing: undefined, source: undefined };
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

  // Public refresh() you can call from any screen / pull-to-refresh
  const refresh = async () => {
    try {
      const { popular: p, nearby: n } = await listingsService.fetchAll();
      setPopular(p);
      setNearby(n);
      void persistLane('popular', p);
      void persistLane('nearby', n);
    } catch (e) {
      console.error('Service fetch failed:', e);
    }
  };

  // Boot: try DB → else service
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 1) Try DB
      if (db) {
        try {
          const rows = await db.table<ListingRow>('listings').toArray();
          if (cancelled) return;
          if (rows.length > 0) {
            const p = rows.filter(r => r.source === 'popular');
            const n = rows.filter(r => r.source === 'nearby');
            setPopular(p);
            setNearby(n);
            return;
          }
        } catch (e) {
          console.warn('IndexedDB load failed, falling back to service:', e);
        }
      }
      // 2) Fallback to service
      await refresh();
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);

  const value = useMemo(
    () => ({ popular, nearby, toggleSaved, getListingById, updateListing, refresh }),
    [popular, nearby],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useListings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useListings must be used within a ListingsProvider');
  return ctx;
}
