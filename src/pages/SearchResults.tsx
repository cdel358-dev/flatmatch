import { useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useListings } from '../state/ListingsContext';
import SafeImage from '../components/SafeImage';
import BackButton from '../components/BackButton';
import SearchFilters, { Filters } from '../components/SearchFilters';

type Listing = {
  id: string;
  title: string;
  subtitle?: string;
  location?: string;
  images?: string[];
  img?: string;
  price?: string; // "$420/wk"
  type?: 'Studio' | '1BR' | '2BR' | 'Flatmate';
  km?: number;
  saved?: boolean;
};

// Map category chip to type (for the first 4)
const TYPE_MAP: Record<string, Listing['type']> = {
  'Studios': 'Studio',
  '1-Bed': '1BR',
  '2-Bed': '2BR',
  'Flatmates': 'Flatmate',
};

const priceToNum = (p?: string) => {
  if (!p) return undefined;
  const m = p.match(/\$?(\d+)/);
  return m ? Number(m[1]) : undefined;
};

// ---- URL <-> Filters helpers ----
function paramsToFilters(params: URLSearchParams): Filters {
  const q = params.get('q') ?? '';
  const location = params.get('location') ?? '';
  const min = params.get('min');
  const max = params.get('max');
  const type = (params.get('type') as Filters['type']) || 'Any';
  const sort = (params.get('sort') as Filters['sort']) || 'Relevance';

  return {
    location,
    minPrice: min ? Number(min) : undefined,
    maxPrice: max ? Number(max) : undefined,
    type,
    sort,
    // NOTE: SearchFilters doesn't carry plain 'q', we’ll handle it separately
  };
}

function filtersToParams(base: URLSearchParams, next: Filters & { q?: string; category?: string }) {
  const out = new URLSearchParams(base.toString());
  // overwrite
  if (next.q !== undefined) out.set('q', next.q);
  if (next.category !== undefined) out.set('category', next.category);

  if (next.location) out.set('location', next.location); else out.delete('location');
  if (next.minPrice !== undefined) out.set('min', String(next.minPrice)); else out.delete('min');
  if (next.maxPrice !== undefined) out.set('max', String(next.maxPrice)); else out.delete('max');
  if (next.type && next.type !== 'Any') out.set('type', next.type); else out.delete('type');
  if (next.sort) out.set('sort', next.sort); else out.delete('sort');

  return out;
}

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? ''; // from category tiles
  const q = params.get('q') ?? '';               // free text
  const { popular, nearby, toggleSaved } = useListings();

  // Merge + dedupe
  const all: Listing[] = useMemo(() => {
    const list = [...(popular ?? []), ...(nearby ?? [])] as Listing[];
    const seen = new Map<string, Listing>();
    for (const l of list) if (l?.id && !seen.has(l.id)) seen.set(l.id, l);
    return Array.from(seen.values());
  }, [popular, nearby]);

  const urlFilters = paramsToFilters(params);

  // Apply filters + query + category
  const results = useMemo(() => {
    let out = all.slice();

    // category handling
    const mappedType = TYPE_MAP[category];
    if (mappedType) {
      out = out.filter((l) => l.type === mappedType);
    } else if (category) {
      const cat = category.toLowerCase();
      out = out.filter((l) => {
        const hay = `${l.title ?? ''} ${l.subtitle ?? ''} ${l.location ?? ''}`.toLowerCase();
        if (category === 'Pet Friendly') return hay.includes('pet');
        if (category === 'Near Uni') return hay.includes('uni') || hay.includes('university');
        return hay.includes(cat);
      });
    }

    // free-text q
    if (q) {
      const ql = q.toLowerCase();
      out = out.filter(
        (l) =>
          (l.title ?? '').toLowerCase().includes(ql) ||
          (l.subtitle ?? '').toLowerCase().includes(ql) ||
          (l.location ?? '').toLowerCase().includes(ql)
      );
    }

    // filters
    if (urlFilters.location) {
      const locQ = urlFilters.location.toLowerCase();
      out = out.filter(
        (l) =>
          (l.location ?? '').toLowerCase().includes(locQ) ||
          (l.title ?? '').toLowerCase().includes(locQ) ||
          (l.subtitle ?? '').toLowerCase().includes(locQ)
      );
    }

    if (urlFilters.type !== 'Any') {
      out = out.filter((l) => l.type === urlFilters.type);
    }

    if (urlFilters.minPrice !== undefined) {
      out = out.filter((l) => (priceToNum(l.price) ?? Infinity) >= urlFilters.minPrice!);
    }
    if (urlFilters.maxPrice !== undefined) {
      out = out.filter((l) => (priceToNum(l.price) ?? 0) <= urlFilters.maxPrice!);
    }

    // sorting
    if (urlFilters.sort === 'Price: Low → High') {
      out.sort((a, b) => (priceToNum(a.price) ?? 1e9) - (priceToNum(b.price) ?? 1e9));
    } else if (urlFilters.sort === 'Price: High → Low') {
      out.sort((a, b) => (priceToNum(b.price) ?? -1) - (priceToNum(a.price) ?? -1));
    } else if (urlFilters.sort === 'Nearest') {
      out.sort((a, b) => (a.km ?? 1e9) - (b.km ?? 1e9));
    }

    return out;
  }, [all, category, q, urlFilters]);

  // When filters change in the UI, sync them to the URL
  const handleApplyFilters = useCallback(
    (next: Filters) => {
      const newParams = filtersToParams(params, { ...next, q, category });
      setParams(newParams, { replace: false });
    },
    [params, setParams, q, category]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-3 text-slate-900 dark:text-slate-100">
      {/* Title */}
      <div className="mb-3 flex items-center gap-2">
        <BackButton
          to="/" // <-- go to Home instead of history back
          className="p-1 -ml-1 rounded hover:bg-gray-100 active:bg-gray-200"
          iconClassName="h-6 w-6 text-gray-700"
          label=""
        />
        <h1 className="text-xl font-semibold">
          Matches · {results.length} result{results.length === 1 ? '' : 's'}
        </h1>
      </div>
  
      {/* Search Bar */}
      <div className="relative mb-3">
        <input
          value={q}
          onChange={(e) => {
            const newParams = filtersToParams(params, {
              ...urlFilters,
              q: e.target.value,
              category,
            });
            setParams(newParams, { replace: false });
          }}
          type="text"
          placeholder="Search terms…"
          className="w-full rounded-xl border border-slate-300 px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900"
          aria-label="Search text"
        />
        <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
          🔍
        </span>
      </div>
  
      {/* Filters */}
      <SearchFilters onApply={handleApplyFilters} defaultFilters={urlFilters} />
  
      {/* List */}
      {results.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-700">
          No results found.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((l) => {
            const img = l.img ?? l.images?.[0] ?? '';
            return (
              <Link
                key={l.id}
                to={`/listing/${l.id}`}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >

                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                <SafeImage src={img} alt={l.title} heightClass="h-44" />

                {/* Inline bookmark toggle — same behavior as Home */}
                <button
                    onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    toggleSaved(l.id);
                    }}
                    className="absolute right-2 top-2 p-1 text-white drop-shadow-md hover:scale-110 transition-transform dark:text-white"
                    aria-label={l.saved ? 'Remove bookmark' : 'Add bookmark'}
                >
                    {l.saved ? (
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

  
                {/* Text */}
                <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                  <div className="line-clamp-1 text-[17px] font-semibold">
                    {l.title}
                  </div>
                  {l.subtitle && (
                    <div className="mt-0.5 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                      {l.subtitle}
                    </div>
                  )}
                  {l.price && (
                    <div className="mt-2 text-[15px] font-semibold text-blue-600">
                      {l.price}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
  
}
