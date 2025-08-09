import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import { useListings } from '../state/ListingsContext';
import { useReviews, type ReviewSort } from '../hooks/useReviews';

/* ---------- Utils ---------- */
function relativeTime(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const mos = Math.floor(days / 30);
  return `${mos} month${mos === 1 ? '' : 's'} ago`;
}

function Stars({ value, className = 'h-5 w-5' }: { value: number; className?: string }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const isFull = idx <= full;
        const isHalf = !isFull && half && idx === full + 1;
        return (
          <svg
            key={i}
            className={className}
            viewBox="0 0 24 24"
            aria-hidden
            {...(isFull
              ? { fill: 'currentColor' }
              : isHalf
                ? { fill: 'currentColor', style: { clipPath: 'inset(0 50% 0 0)' } }
                : { fill: 'none', stroke: 'currentColor', strokeWidth: 2 })}
          >
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      })}
    </div>
  );
}

/* ---------- Page ---------- */
export default function Reviews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListingById } = useListings();
  const base = id ? getListingById(id).listing : undefined;

  // Load reviews from service (mock or HTTP based on env)
  const { loading, error, reviews, rawReviews, sort, setSort } = useReviews(
    id,
    'relevant',
    { avg: base?.rating, count: base?.reviews }
  );


  // Header numbers come from the listing (source of truth), else compute from reviews
  const avg =
    typeof base?.rating === 'number'
      ? base.rating
      : rawReviews.length
      ? rawReviews.reduce((s, r) => s + r.rating, 0) / rawReviews.length
      : 0;

  const totalCount = rawReviews.length || (typeof base?.reviews === 'number' ? base.reviews : 0);

  // Keep list short for demo: max 9 (shows sorting changes without long scroll)
  const visible = useMemo(
    () => reviews.slice(0, Math.min(9, reviews.length || 5)),
    [reviews]
  );

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-3">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18 9 12l6-6" />
          </svg>
        </button>

        <div className="flex-1 px-2">
          <h1 className="text-3xl font-extrabold leading-tight">Reviews</h1>

          {/* Listing summary */}
          <div className="mt-3">
            <div className="text-lg font-semibold">{base?.title ?? 'Listing'}</div>
            {base?.subtitle && (
              <div className="text-sm text-slate-600 dark:text-slate-300">{base.subtitle}</div>
            )}

            <div className="mt-2 flex items-center gap-3">
              <div className="inline-flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span className="font-semibold">{avg.toFixed(1)}</span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-300">({totalCount} reviews)</span>
            </div>
            {totalCount > 0 && (
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Showing {visible.length} of {totalCount} reviews
              </div>
            )}
          </div>
        </div>

        {/* Sort */}
        <div className="pt-1">
          <label className="sr-only" htmlFor="sort">Sort reviews</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as ReviewSort)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <option value="relevant">Most Relevant</option>
            <option value="newest">Newest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          Failed to load reviews: {error}
        </div>
      )}

      {/* Review cards */}
      {!loading && !error && (
        <>
          {visible.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              No reviews yet.
            </div>
          ) : (
            <div className="space-y-4">
              {visible.map((r) => (
                <article
                  key={r.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <SafeImage src={r.avatar} alt={r.author} heightClass="h-12" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold">{r.author}</h3>
                        <Stars value={r.rating} className="h-4 w-4" />
                      </div>
                      <div className="mt-1 text-sm text-slate-500">{relativeTime(r.createdAt)}</div>
                      <p className="mt-3 text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
                        {r.body}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Back to listing link */}
          <div className="mt-6 text-center">
            <Link
              to={`/listing/${id}`}
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Back to listing
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
