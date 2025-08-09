import { useMemo, useState } from 'react';
import SafeImage from '../components/SafeImage';
import SearchFilters, { Filters } from '../components/SearchFilters';

type Card = {
  id: string;
  title: string;
  subtitle?: string;
  img?: string; // optional; SafeImage falls back to /placeholder.webp
  price?: string; // like "$420/wk"
  badge?: string;
  // optional helpers for filtering demo
  type?: 'Studio' | '1BR' | '2BR' | 'Flatmate';
  loc?: string; // location/area
  km?: number; // distance for "Nearest" sort demo
};

function priceToNum(p?: string): number | undefined {
  if (!p) return undefined;
  const m = p.match(/\$?(\d+)/);
  return m ? Number(m[1]) : undefined;
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    q: '',
    location: '',
    minPrice: undefined,
    maxPrice: undefined,
    type: 'Any',
    sort: 'Relevance',
  });

  // Demo data — include fields to make filtering feel real
  const categories = useMemo<Card[]>(
    () => [
      { id: 'c1', title: 'Studios' },
      { id: 'c2', title: '1-Bed' },
      { id: 'c3', title: '2-Bed' },
      { id: 'c4', title: 'Flatmates' },
      { id: 'c5', title: 'Pet Friendly' },
      { id: 'c6', title: 'Near Uni' },
    ],
    [],
  );

  const popular = useMemo<Card[]>(
    () => [
      { id: 'p1', title: 'Sunny 1BR near CBD', subtitle: 'Hamilton Central', price: '$420/wk', badge: 'Popular', type: '1BR', loc: 'Hamilton', km: 1.0 },
      { id: 'p2', title: 'Modern studio', subtitle: 'Hillcrest', price: '$350/wk', type: 'Studio', loc: 'Hillcrest', km: 2.2 },
      { id: 'p3', title: '2BR with parking', subtitle: 'Rototuna', price: '$520/wk', type: '2BR', loc: 'Rototuna', km: 4.5 },
      { id: 'p4', title: 'Flatmate wanted', subtitle: 'Frankton', price: '$210/wk', type: 'Flatmate', loc: 'Frankton', km: 3.6 },
    ],
    [],
  );

  const nearby = useMemo<Card[]>(
    () => [
      { id: 'n1', title: 'City studio', subtitle: '0.5 km • CBD', price: '$380/wk', badge: 'Nearby', type: 'Studio', loc: 'CBD', km: 0.5 },
      { id: 'n2', title: 'Cozy 1BR', subtitle: '1.2 km • River Rd', price: '$410/wk', type: '1BR', loc: 'River Rd', km: 1.2 },
      { id: 'n3', title: 'Shared room', subtitle: '1.9 km • Five Cross Rds', price: '$180/wk', type: 'Flatmate', loc: 'Five Cross Rds', km: 1.9 },
      { id: 'n4', title: 'Large 2BR', subtitle: '2.4 km • Claudelands', price: '$540/wk', type: '2BR', loc: 'Claudelands', km: 2.4 },
    ],
    [],
  );

  const applyFilters = (list: Card[]): Card[] => {
    let out = list.slice();

    // text query
    if (filters.q) {
      const q = filters.q.toLowerCase();
      out = out.filter(
        (x) =>
          x.title.toLowerCase().includes(q) ||
          (x.subtitle && x.subtitle.toLowerCase().includes(q))
      );
    }

    // location contains
    if (filters.location) {
      const locQ = filters.location.toLowerCase();
      out = out.filter(
        (x) =>
          (x.loc && x.loc.toLowerCase().includes(locQ)) ||
          (x.subtitle && x.subtitle.toLowerCase().includes(locQ)) ||
          x.title.toLowerCase().includes(locQ)
      );
    }

    // type
    if (filters.type !== 'Any') {
      out = out.filter((x) => x.type === filters.type);
    }

    // price
    if (filters.minPrice !== undefined) {
      out = out.filter((x) => (priceToNum(x.price) ?? Infinity) >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      out = out.filter((x) => (priceToNum(x.price) ?? 0) <= filters.maxPrice!);
    }

    // sort
    if (filters.sort === 'Price: Low → High') {
      out.sort((a, b) => (priceToNum(a.price) ?? 1e9) - (priceToNum(b.price) ?? 1e9));
    } else if (filters.sort === 'Price: High → Low') {
      out.sort((a, b) => (priceToNum(b.price) ?? -1) - (priceToNum(a.price) ?? -1));
    } else if (filters.sort === 'Nearest') {
      out.sort((a, b) => (a.km ?? 1e9) - (b.km ?? 1e9));
    }
    // Relevance => leave as-is for demo

    return out;
  };

  const popularFiltered = useMemo(() => applyFilters(popular), [popular, filters]);
  const nearbyFiltered = useMemo(() => applyFilters(nearby), [nearby, filters]);

  return (
    <div className="py-0 md:py-2">
      {/* Search + Filters on top */}
      <SearchFilters onApply={setFilters} defaultFilters={filters} />

      {/* Mobile-only title below search */}
      <div className="mb-4 mt-1 px-4 md:hidden">
        <h1 className="text-2xl font-bold">Flat Match</h1>
        <p className="text-slate-600 dark:text-slate-300">Find your perfect flat.</p>
      </div>

      {/* Content container (keeps same gutter as App main) */}
      <div className="mx-auto max-w-7xl px-4">
        {/* Categories — horizontal */}
        <Section title="Categories">
          <HorizontalScroller>
            {categories.map((c) => (
              <CategoryTile key={c.id} {...c} />
            ))}
          </HorizontalScroller>
        </Section>

        {/* Popular — horizontal */}
        <Section title="Popular">
          <HorizontalScroller big>
            {popularFiltered.map((p) => (
              <ListingTile key={p.id} {...p} />
            ))}
          </HorizontalScroller>
        </Section>

        {/* Nearby — horizontal */}
        <Section title="Nearby">
          <HorizontalScroller big>
            {nearbyFiltered.map((n) => (
              <ListingTile key={n.id} {...n} />
            ))}
          </HorizontalScroller>
        </Section>
      </div>
    </div>
  );
}

/* ---------- UI pieces ---------- */

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

function ListingTile({ title, subtitle, img, price, badge }: Card) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="relative">
        <SafeImage src={img} alt={title} heightClass="h-40" />
        {badge && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-800 shadow">
            {badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-slate-600 dark:text-slate-300">{subtitle}</p>}
        {price && <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">{price}</p>}
      </div>
    </article>
  );
}
