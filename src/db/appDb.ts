import Dexie, { Table } from 'dexie';

export type ListingRow = {
  id: string;
  source: 'popular' | 'nearby';
  title: string;
  subtitle?: string;
  img?: string;
  price?: string;
  badge?: string;
  type?: 'Studio' | '1BR' | '2BR' | 'Flatmate';
  loc?: string;
  km?: number;
  saved?: boolean;
  desc?: string;
  rating?: number;
  reviews?: number;
  images?: string[];
  tradeMeUrl?: string;
  hostEmail?: string;
  updatedAt: number;
};

class AppDB extends Dexie {
  listings!: Table<ListingRow, string>;
  constructor() {
    super('flatmatch');
    this.version(1).stores({
      listings: 'id, source, saved, updatedAt',
    });
  }
}

/** Return a DB instance only if IndexedDB exists (prevents white screen in unsupported/private modes). */
export function getDb(): AppDB | null {
  try {
    if (typeof indexedDB === 'undefined') return null;
    return new AppDB();
  } catch {
    return null;
  }
}
