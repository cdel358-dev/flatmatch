import { useMemo } from 'react';
import SafeImage from '../components/SafeImage';

type Card = {
  id: string;
  title: string;
  subtitle?: string;
  img?: string; // optional; SafeImage will fall back to /placeholder.webp
  price?: string;
  badge?: string;
};

export default function Home() {
  // Demo data — no remote URLs; SafeImage will use /placeholder.webp
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
      { id: 'p1', title: 'Sunny 1BR near CBD', subtitle: 'Hamilton Central', price: '$420/wk', badge: 'Popular' },
      { id: 'p2', title: 'Modern studio', subtitle: 'Hillcrest', price: '$350/wk' },
      { id: 'p3', title: '2BR with parking', subtitle: 'Rototuna', price: '$520/wk' },
      { id: 'p4', title: 'Flatmate wanted', subtitle: 'Frankton', price: '$210/wk' },
    ],
    [],
  );

  const nearby = useMemo<Card[]>(
    () => [
      { id: 'n1', title: 'City studio', subtitle: '0.5 km • CBD', price: '$380/wk', badge: 'Nearby' },
      { id: 'n2', title: 'Cozy 1BR', subtitle: '1.2 km • River Rd', price: '$410/wk' },
      { id: 'n3', title: 'Shared room', subtitle: '1.9 km • Five Cross Rds', price: '$180/wk' },
      { id: 'n4', title: 'Large 2BR', subtitle: '2.4 km • Claudelands', price: '$540/wk' },
    ],
    [],
  );

  return (
    <div className="py-4 md:py-6">
      {/* Mobile-only title */}
      <div className="mb-4 md:hidden">
        <h1 className="text-2xl font-bold">Flat Match</h1>
        <p className="text-slate-600 dark:text-slate-300">Find your perfect flat.</p>
      </div>

      {/* Categories — horizontal */}
      <Section title="Categories">
        <HorizontalScroller>
          {categories.map((c) => (
            <CategoryTile key={c.id} {...c} />
          ))}
        </HorizontalScroller>
      </Section>

      {/* Popular — horizontal, bigger tiles */}
      <Section title="Popular">
        <HorizontalScroller big>
          {popular.map((p) => (
            <ListingTile key={p.id} {...p} />
          ))}
        </HorizontalScroller>
      </Section>

      {/* Nearby — horizontal, bigger tiles */}
      <Section title="Nearby">
        <HorizontalScroller big>
          {nearby.map((n) => (
            <ListingTile key={n.id} {...n} />
          ))}
        </HorizontalScroller>
      </Section>
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
