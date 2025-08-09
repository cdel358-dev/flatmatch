import { useMemo, useState } from 'react';
import { FiSliders } from 'react-icons/fi';

export type Filters = {
  location: string;
  minPrice?: number;
  maxPrice?: number;
  type: 'Any' | 'Studio' | '1BR' | '2BR' | 'Flatmate';
  sort: 'Relevance' | 'Price: Low → High' | 'Price: High → Low' | 'Nearest';
};

export default function SearchFilters({
  defaultFilters,
  onApply,
}: {
  defaultFilters?: Partial<Filters>;
  onApply: (filters: Filters) => void;
}) {
  const [open, setOpen] = useState(false);

  const [location, setLocation] = useState(defaultFilters?.location ?? '');
  const [minPrice, setMinPrice] = useState<string>(
    defaultFilters?.minPrice?.toString() ?? ''
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    defaultFilters?.maxPrice?.toString() ?? ''
  );
  const [type, setType] = useState<Filters['type']>(defaultFilters?.type ?? 'Any');
  const [sort, setSort] = useState<Filters['sort']>(defaultFilters?.sort ?? 'Relevance');

  const chipText = useMemo(() => {
    const chips: string[] = [];
    if (location) chips.push(location);
    if (type !== 'Any') chips.push(type);
    if (minPrice || maxPrice) chips.push(`$${minPrice || 0}–$${maxPrice || '∞'}`);
    if (sort !== 'Relevance') chips.push(sort.replace(': ', ' '));
    return chips.join(' • ');
  }, [location, type, minPrice, maxPrice, sort]);

  const apply = () =>
    onApply({
      location,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      type,
      sort,
    });

  const clear = () => {
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setType('Any');
    setSort('Relevance');
    onApply({
      location: '',
      minPrice: undefined,
      maxPrice: undefined,
      type: 'Any',
      sort: 'Relevance',
    });
  };

  return (
    <div className="mb-4">
      {/* Filters summary row */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-h-6 text-xs text-slate-600 dark:text-slate-300">
          {chipText || 'Filter by location, price, type, or sort'}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
          aria-expanded={open}
          aria-controls="filters-panel"
        >
          <FiSliders />
          Filters
        </button>
      </div>

      {/* Expandable filter controls */}
      {open && (
        <div
          id="filters-panel"
          className="mt-2 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-4"
        >
          {/* Location */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-600 dark:text-slate-300">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Hamilton, CBD"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-600 dark:text-slate-300">Price / week</label>
            <div className="flex items-center gap-2">
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ''))}
                placeholder="Min"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              />
              <span className="text-slate-500">–</span>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))}
                placeholder="Max"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              />
            </div>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-600 dark:text-slate-300">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Filters['type'])}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            >
              {['Any', 'Studio', '1BR', '2BR', 'Flatmate'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-600 dark:text-slate-300">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Filters['sort'])}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            >
              {['Relevance', 'Price: Low → High', 'Price: High → Low', 'Nearest'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="col-span-full mt-1 flex items-center justify-end gap-2">
            <button
              onClick={clear}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            >
              Clear
            </button>
            <button
              onClick={apply}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
