import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useListings } from '../state/ListingsContext';
import { useReviews } from '../hooks/useReviews';
import SafeImage from '../components/SafeImage';
import NotesModal from '../components/NotesModal';
import FlatmateAvatar from "../components/FlatmateAvatar";

/* ---------- Star rating ---------- */
function StarRating({ value }: { value: number }) {
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
            className="h-5 w-5"
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

/* ---------- Manual (no auto) carousel ---------- */
function Carousel({ images }: { images: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const list = images.length ? images : ['', '', '']; // SafeImage -> /placeholder.webp
  const itemW = 320; // fallback for scrollTo

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement | undefined;
    if (child) {
      el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
    } else {
      el.scrollTo({ left: idx * itemW, behavior: 'smooth' });
    }
  }, [idx]);

  const prev = () => setIdx((i) => (i - 1 + list.length) % list.length);
  const next = () => setIdx((i) => (i + 1) % list.length);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: 'none' as any }}
      >
        <style>{`.carousel-no-scrollbar::-webkit-scrollbar{display:none}`}</style>
        <div className="carousel-no-scrollbar contents">
          {list.map((src, i) => (
            <div
              key={i}
              className="snap-center shrink-0 basis-full sm:basis-2/3 md:basis-1/2"
            >
              <div className="overflow-hidden rounded-2xl">
                <SafeImage src={src} alt={`Listing image ${i + 1}`} heightClass="h-64 md:h-72" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        aria-label="Previous photo"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white dark:bg-slate-900/80"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18 9 12l6-6" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next photo"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white dark:bg-slate-900/80"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="mt-2 flex justify-center gap-1.5">
        {list.map((_, i) => (
          <span
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1.5 w-1.5 cursor-pointer rounded-full ${i === idx ? 'bg-slate-900 dark:bg-slate-200' : 'bg-slate-300 dark:bg-slate-700'}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListingById, toggleSaved } = useListings();
  const [showNotes, setShowNotes] = useState(false);

  // Base listing from shared context
  const base = useMemo(() => (id ? getListingById(id).listing : undefined), [id, getListingById]);

  // Load the real review list for this listing (mock or API via env)
  const { rawReviews } = useReviews(id, 'relevant', { avg: base?.rating, count: base?.reviews });

  // Derive synced rating + count (prefer listing fields, otherwise compute from loaded reviews)
  const reviewsCount = rawReviews.length || base?.reviews || 0;
  const avgRating =
    typeof base?.rating === 'number'
      ? base.rating
      : rawReviews.length
        ? rawReviews.reduce((s, r) => s + r.rating, 0) / rawReviews.length
        : 0;

  // Compose a view model with safe fallbacks (so page renders even if fields missing)
  const listing = useMemo(
    () => ({
      id: base?.id ?? id ?? 'unknown',
      title: base?.title ?? 'Listing',
      desc:
        base?.desc ??
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed leo quis parturient tristique mauris. Amet urna tortor tortor duis tellus risus.',
      rating: avgRating,
      reviews: reviewsCount,
      saved: base?.saved ?? false,
      images: (base?.images && base.images.length ? base.images : ['', '', '']) as string[],
      flatmates:
        base?.flatmates ??
        [
          { id: 'f1', name: 'Alex', verified: true },
          { id: 'f2', name: 'Sam', verified: true },
          { id: 'f3', name: 'Riley', verified: true },
        ],
      tradeMeUrl: base?.tradeMeUrl ?? '#',
      hostEmail: base?.hostEmail ?? 'host@example.com',
      subtitle: base?.subtitle,
      price: base?.price,
      loc: base?.loc,
      savedFlag: base?.saved ?? false,
    }),
    [base, id, avgRating, reviewsCount]
  );

  const emailHref = listing.hostEmail ? `mailto:${listing.hostEmail}` : undefined;

  if (!base) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <p className="text-center text-slate-600 dark:text-slate-300">Listing not found.</p>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-3">
      {/* Top row: back + title/desc + bookmark */}
      <div className="mb-2 flex items-start justify-between">
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
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{listing.desc}</p>
        </div>

        {/* Bookmark (transparent, matches Home style) */}
        <button
          onClick={() => toggleSaved(listing.id!)}
          className="p-1 text-slate-900 drop-shadow-sm hover:scale-110 dark:text-white"
          aria-label={listing.savedFlag ? 'Remove bookmark' : 'Add bookmark'}
          title={listing.savedFlag ? 'Remove bookmark' : 'Add bookmark'}
        >
          {listing.savedFlag ? (
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 2a2 2 0 0 0-2 2v18l8-5.333L20 22V4a2 2 0 0 0-2-2H6z" />
            </svg>
          ) : (
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 2a2 2 0 0 0-2 2v18l8-5.333L20 22V4a2 2 0 0 0-2-2H6z" />
            </svg>
          )}
        </button>
      </div>

      {/* Rating row (left icon, right stars + count) */}
      <div className="mb-3 flex items-center justify-between">
        {/* Notes & Location buttons */}
        <div className="flex items-center gap-2">
          {/* Notes button */}
          <button
            onClick={() => setShowNotes(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-dashed border-slate-400 text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Notes"
            title="Notes"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>

          {/* Location button */}
          {/* <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              (listing.propertyName ? listing.propertyName + ' ' : '') + (listing.location || '')
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-9 w-9 place-items-center rounded-lg border border-dashed border-slate-400 text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open in Maps"
            title="Open in Maps"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M12 21s-6-4.35-6-9a6 6 0 1 1 12 0c0 4.65-6 9-6 9Z" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          </a> */}
          <button
            onClick={() => navigate(`/listing/${listing.id}/location`)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-dashed border-slate-400 text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open Location"
            title="Open Location"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 21s-6-4.35-6-9a6 6 0 1 1 12 0c0 4.65-6 9-6 9Z" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          </button>
        </div>

        {/* Star rating component */}
        <div className="text-right">
          <Link to={`/listing/${listing.id}/reviews`} className="inline-flex items-center gap-2">
            <StarRating value={listing.rating!} />
          </Link>
          <div className="text-xs text-slate-500">
            (<Link to={`/listing/${listing.id}/reviews`} className="hover:underline">
              {listing.reviews} reviews
            </Link>)
          </div>
        </div>
      </div>

      <hr className="mb-3 border-slate-200 dark:border-slate-800" />

      {/* Bigger, horizontally scrolling photos (manual) */}
      <Carousel images={listing.images!} />

      {/* CTAs */}
      <div className="mb-6 mt-6 flex flex-col items-stretch gap-3">
        <a
          href={emailHref}
          className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
        >
          MESSAGE HOST
        </a>
        <a
          href={listing.tradeMeUrl!}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          VIEW ON TRADE ME
        </a>
      </div>

      <hr className="mb-4 border-slate-200 dark:border-slate-800" />

      {/* Flatmates (no trailing paragraph) */}
      <section className="mb-2">
        <h2 className="mb-3 text-lg font-semibold">Flatmates</h2>

        {(!listing.flatmates || listing.flatmates.length === 0) ? (
          <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Be the first to join this flat!
          </div>
        ) : (
          <div className="flex items-start gap-6">
            {listing.flatmates.map((m) => (
              <Link
                key={m.id}
                to={`/listing/${listing.id}/flatmate/${m.id}`}
                className="group block w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`View ${m.name}'s profile`}
              >
                {/* Wrapper is relative; badge is positioned against this, not the avatar (which is overflow-hidden) */}
                <div className="relative mx-auto w-16">
                  <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-slate-300 dark:bg-slate-700">
                    {/* avatar placeholder (SafeImage if you have one) */}
                    {/* <svg className="h-8 w-8 opacity-60" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" />
                    </svg> */}

                    <FlatmateAvatar
                      name={m.name}
                      avatar={m.avatar}          // <- comes from the mock generator
                      size={64}                  // matches w-16 h-16
                    />
                  </div>

                  {m.verified && (
                    <span
                      className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-green-500 text-white ring-2 ring-white shadow-sm"
                      title="Verified"
                    >
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>

                {/* Name under avatar */}
                <div className="mt-2 line-clamp-1 text-xs font-medium text-slate-700 group-hover:underline dark:text-slate-200">
                  {m.name}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {showNotes && (
        <NotesModal
          listingId={listing.id!}
          onClose={() => setShowNotes(false)}
        />
      )}

    </div>
  );
}
