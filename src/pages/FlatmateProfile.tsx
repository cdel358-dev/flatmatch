import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useListings } from '../state/ListingsContext';
import SafeImage from '../components/SafeImage';

type Flatmate = {
  id: string;
  name: string;
  verified?: boolean;
  avatar?: string;
  about?: string;
};

export default function FlatmateProfile() {
  const { id: listingId, mid } = useParams<{ id: string; mid: string }>();
  const navigate = useNavigate();
  const { getListingById } = useListings();

  const listing = useMemo(
    () => (listingId ? getListingById(listingId).listing : undefined),
    [listingId, getListingById]
  );

  const flatmate: Flatmate | undefined = useMemo(() => {
    const fm = (listing?.flatmates as Flatmate[] | undefined) ?? [];
    return fm.find((f) => f.id === mid);
  }, [listing, mid]);

  const name = flatmate?.name ?? 'Flatmate';
  const about =
    flatmate?.about ??
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra rutrum elementum nunc velit dui dui, penatibus.';

  return (
    <div className="min-h-dvh bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Top bar (no banner bg) */}
      <div className="px-4 pt-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18 9 12l6-6" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center px-4 pb-24">
        {/* Big circular avatar, no rectangle behind */}
        <div className="mt-6 h-36 w-36 overflow-hidden rounded-full bg-slate-300 dark:bg-slate-700">
          <SafeImage src={flatmate?.avatar} alt={name} heightClass="h-36" />
        </div>

        <h1 className="mt-4 text-2xl font-bold">{name}</h1>

        <section className="mt-6 w-full max-w-2xl">
          <h2 className="mb-2 text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
            ABOUT
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
            {about}
          </p>
        </section>
      </div>
    </div>
  );
}
