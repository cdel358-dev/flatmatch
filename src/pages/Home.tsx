// src/pages/Home.tsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import SearchFilters, { Filters } from '../components/SearchFilters';
import { useListings } from '../state/ListingsContext';

type Card = {
  id: string;
  title: string;
  subtitle?: string;
  img?: string; // SafeImage falls back to /placeholder.webp
  price?: string; // "$420/wk"
  badge?: string;
  type?: 'Studio' | '1BR' | '2BR' | 'Flatmate';
  loc?: string; // area
  km?: number;  // distance
  saved?: boolean;
};

function priceToNum(p?: string): number | undefined {
  if (!p) return undefined;
  const m = p.match(/\$?(\d+)/);
  return m ? Number(m[1]) : undefined;
}

export default function Home() {
  // Shared listings come from context so saved state is global
  const { popular, nearby, toggleSaved } = useListings();

  // Local UI state
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({
    location: '',
    minPrice: undefined,
    maxPrice: undefined,
    type: 'Any',
    sort: 'Relevance',
  });

  const categories = useMemo<Card[]>(
    () => [
      { id: 'c1', title: 'Studios' },
      { id: 'c2', title: '1-Bed' },
      { id: 'c3', title: '2-Bed' },
      { id: 'c4', title: 'Flatmates' },
      { id: 'c5', title: 'Pet Friendly' },
      { id: 'c6', title: 'Near Uni' },
    ],
    []
  );

  const applyFilters = (list: Card[]): Card[] => {
    let out = list.slice();

    if (search) {
      const q = search.toLowerCase();
      out = out.filter(
        (x) =>
          x.title.toLowerCase().includes(q) ||
          (x.subtitle && x.subtitle.toLowerCase().includes(q))
      );
    }

    if (filters.location) {
      const locQ = filters.location.toLowerCase();
      out = out.filter(
        (x) =>
          (x.loc && x.loc.toLowerCase().includes(locQ)) ||
          (x.subtitle && x.subtitle.toLowerCase().includes(locQ)) ||
          x.title.toLowerCase().includes(locQ)
      );
    }

    if (filters.type !== 'Any') {
      out = out.filter((x) => x.type === filters.type);
    }

    if (filters.minPrice !== undefined) {
      out = out.filter((x) => (priceToNum(x.price) ?? Infinity) >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      out = out.filter((x) => (priceToNum(x.price) ?? 0) <= filters.maxPrice!);
    }

    if (filters.sort === 'Price: Low → High') {
      out.sort((a, b) => (priceToNum(a.price) ?? 1e9) - (priceToNum(b.price) ?? 1e9));
    } else if (filters.sort === 'Price: High → Low') {
      out.sort((a, b) => (priceToNum(b.price) ?? -1) - (priceToNum(a.price) ?? -1));
    } else if (filters.sort === 'Nearest') {
      out.sort((a, b) => (a.km ?? 1e9) - (b.km ?? 1e9));
    }

    return out;
  };

  const popularFiltered = useMemo(
    () => applyFilters(popular as Card[]),
    [popular, filters, search]
  );
  const nearbyFiltered = useMemo(
    () => applyFilters(nearby as Card[]),
    [nearby, filters, search]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 md:py-6">
      {/* Title */}
      <div className="mb-3">
        <h1 className="text-2xl font-bold">Flat Match</h1>
        <p className="text-slate-600 dark:text-slate-300">Find your perfect flat.</p>
      </div>

      {/* Search under title */}
      <div className="relative mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border border-slate-300 px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900"
          aria-label="Search listings"
        />
        <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">🔍</span>
      </div>

      {/* Filters */}
      <SearchFilters onApply={setFilters} defaultFilters={filters} />

      {/* Categories */}
      <Section title="Categories">
        <HorizontalScroller>
          {categories.map((c) => (
            <CategoryTile key={c.id} {...c} />
          ))}
        </HorizontalScroller>
      </Section>

      {/* Popular */}
      <Section title="Popular">
        <HorizontalScroller big>
          {popularFiltered.map((p) => (
            <Link key={p.id} to={`/listing/${p.id}`} className="block">
              <ListingTile
                {...p}
                onToggleSaved={(e) => {
                  e.preventDefault(); // don’t navigate when tapping the bookmark
                  toggleSaved(p.id);
                }}
              />
            </Link>
          ))}
        </HorizontalScroller>
      </Section>

      {/* Nearby */}
      <Section title="Nearby">
        <HorizontalScroller big>
          {nearbyFiltered.map((n) => (
            <Link key={n.id} to={`/listing/${n.id}`} className="block">
              <ListingTile
                {...n}
                onToggleSaved={(e) => {
                  e.preventDefault();
                  toggleSaved(n.id);
                }}
              />
            </Link>
          ))}
        </HorizontalScroller>
      </Section>
    </div>
  );
}

/* ---------- UI primitives ---------- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function HorizontalScroller({
  children,
  big = false,
}: {
  children: React.ReactNode;
  big?: boolean;
}) {
  const itemWidth = big ? 'min-w-[15.5rem]' : 'min-w-[10rem]';
  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none]">
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
      <div className="no-scrollbar flex gap-4">
        {Array.isArray(children)
          ? children.map((child, i) => (
              <div key={i} className={`snap-start ${itemWidth}`}>
                {child}
              </div>
            ))
          : children}
      </div>
    </div>
  );
}

function CategoryTile({ title, img }: Card) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <SafeImage src={img} alt={title} heightClass="h-24" />
      <div className="p-3">
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
    </article>
  );
}

function ListingTile({
  id,
  title,
  subtitle,
  img,
  price,
  badge,
  saved,
  onToggleSaved,
}: Card & { onToggleSaved: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <article
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      data-id={id}
    >
      <div className="relative">
        <SafeImage src={img} alt={title} heightClass="h-40" />

        {/* Optional left badge */}
        {badge && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-800 shadow">
            {badge}
          </span>
        )}

        {/* Bookmark toggle (no bg, outline vs filled) */}
        <button
          onClick={onToggleSaved}
          className="absolute right-2 top-2 p-1 text-white drop-shadow-md hover:scale-110 transition-transform dark:text-white"
          aria-label={saved ? 'Remove bookmark' : 'Add bookmark'}
        >
          {saved ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 2a2 2 0 0 0-2 2v18l8-5.333L20 22V4a2 2 0 0 0-2-2H6z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 2a2 2 0 0 0-2 2v18l8-5.333L20 22V4a2 2 0 0 0-2-2H6z" />
            </svg>
          )}
        </button>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-slate-600 dark:text-slate-300">{subtitle}</p>}
        {price && <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">{price}</p>}
      </div>
    </article>
  );
}
