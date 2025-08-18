import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Prefs = {
  priceMin?: number;
  priceMax?: number;
  location?: string;
  category?: 'Studio' | 'Single' | 'Double' | 'En suite' | '';
};

const STEP_TITLES = ['Budget', 'Location', 'Category', 'Review'];

export default function PreferencesWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<Prefs>(() => {
    try {
      const raw = localStorage.getItem('fm_prefs');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const next = () => setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1));
  const back = () => (step === 0 ? navigate(-1) : setStep((s) => Math.max(s - 1, 0)));

  const saveAndFinish = () => {
    // 1) Persist preferences
    localStorage.setItem('fm_prefs', JSON.stringify(prefs));

    // 2) Build URL params for Search Results
    const params = new URLSearchParams();
    if (prefs.location) params.set('location', prefs.location);
    if (prefs.priceMin != null) params.set('min', String(prefs.priceMin));
    if (prefs.priceMax != null) params.set('max', String(prefs.priceMax));

    // NOTE: Your SearchResults filters by `type` using values like 'Studio' | '1BR' | ...
    // The wizard's `category` options are 'Studio' | 'Single' | 'Double' | 'En suite'.
    // If you want to map category -> type, add a small mapping here.
    // For now we only pass price/location which are robust across your dataset.

    // 3) Navigate directly to Search Results with filters applied
    navigate(`/search?${params.toString()}`, { replace: true });
  };

  return (
    <div className="mx-auto min-h-[calc(100dvh-64px)] max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{STEP_TITLES[step]}</h1>
        <div className="flex items-center gap-1">
          {STEP_TITLES.map((_, i) => (
            <span
              key={i}
              className={[
                'h-1 w-8 rounded-full',
                i <= step ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700',
              ].join(' ')}
            />
          ))}
        </div>
      </div>

      {/* Steps */}
      {step === 0 && (
        <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <label className="block text-sm text-slate-600 dark:text-slate-300">Weekly budget (NZD)</label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min"
              value={prefs.priceMin ?? ''}
              onChange={(e) => setPrefs((p) => ({ ...p, priceMin: Number(e.target.value) || undefined }))}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
            <input
              type="number"
              placeholder="Max"
              value={prefs.priceMax ?? ''}
              onChange={(e) => setPrefs((p) => ({ ...p, priceMax: Number(e.target.value) || undefined }))}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <label className="block text-sm text-slate-600 dark:text-slate-300">Preferred area / suburb</label>
          <input
            type="text"
            placeholder="e.g., Grafton, Newmarket, Parnell"
            value={prefs.location ?? ''}
            onChange={(e) => setPrefs((p) => ({ ...p, location: e.target.value }))}
            className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </section>
      )}

      {step === 2 && (
        <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <label className="block text-sm text-slate-600 dark:text-slate-300">Room type</label>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['Studio', 'Single', 'Double', 'En suite'] as const).map((c) => {
              const active = prefs.category === c;
              return (
                <button
                  key={c}
                  onClick={() => setPrefs((p) => ({ ...p, category: c }))}
                  className={[
                    'rounded-full px-4 py-2 text-sm',
                    active
                      ? 'bg-slate-900 text-white dark:bg-blue-600'
                      : 'border border-slate-300 text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
                  ].join(' ')}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
          <h2 className="mb-3 text-base font-semibold">Review</h2>
          <ul className="space-y-2">
            <li><strong>Budget:</strong> {prefs.priceMin ?? '—'} – {prefs.priceMax ?? '—'}</li>
            <li><strong>Location:</strong> {prefs.location || '—'}</li>
            <li><strong>Category:</strong> {prefs.category || '—'}</li>
          </ul>
        </section>
      )}

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={back}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Back
        </button>

        {step < STEP_TITLES.length - 1 ? (
          <button
            onClick={next}
            className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={saveAndFinish}
            className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Save & See Matches
          </button>
        )}
      </div>
    </div>
  );
}
