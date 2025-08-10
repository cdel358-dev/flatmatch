import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import { usersById, type User } from '../data/mockUsers';
import BackButton from "../components/BackButton";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-2 text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
    {children}
  </h2>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-200">
    {children}
  </span>
);

export default function UserProfile() {
  const { uid = 'u1' } = useParams();
  const navigate = useNavigate();

  // Source of truth: mock map (swap with API/service later)
  const user: User = useMemo(() => {
    return usersById[uid] ?? {
      id: uid,
      name: 'Member',
      verified: false,
      about: 'Keen to find a comfy place with respectful flatmates. Easy-going and tidy.',
      location: 'New Zealand',
      joined: '2024-01-01',
      occupation: 'Professional',
      schedule: 'Mixed',
      pets: 'None',
      languages: ['English'],
      interests: ['Cooking', 'Movies'],
    };
  }, [uid]);

  const joined = user.joined
    ? new Date(user.joined).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
    : undefined;

  return (
    <div className="min-h-dvh bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Top bar (no banner bg) */}
      <div className="px-4 pt-3">
        <BackButton
          className="p-1 -ml-1 rounded hover:bg-gray-100 active:bg-gray-200"
          iconClassName="h-6 w-6 text-gray-700"
          label="" // no text, just the arrow
        />
      </div>

      {/* Header */}
      <div className="flex flex-col items-center px-4 pb-20">
        {/* Avatar with verified tick */}
        <div className="relative mt-4 h-36 w-36">
          <div className="h-36 w-36 overflow-hidden rounded-full bg-slate-300 dark:bg-slate-700">
            <SafeImage src={user.avatar} alt={user.name} heightClass="h-36" />
          </div>
          {user.verified && (
            <span
              className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-green-500 text-white ring-2 ring-white shadow-sm"
              title="Verified"
              aria-label="Verified profile"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
              </svg>
            </span>
          )}
        </div>

        <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>

        {/* CTA: List a room */}
        <button
          onClick={() => navigate('/list-room')} // placeholder route; change when ready
          className="mt-3 inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-black active:scale-[0.99]"
        >
          LIST A ROOM
        </button>

        {/* About */}
        <section className="mt-6 w-full max-w-2xl">
          <SectionTitle>ABOUT</SectionTitle>
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
            {user.about}
          </p>
        </section>

        {/* Good to know */}
        <section className="mt-8 w-full max-w-2xl">
          <SectionTitle>GOOD TO KNOW</SectionTitle>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-xs uppercase tracking-wide text-slate-500">Location</div>
              <div className="mt-1 text-sm">{user.location ?? '—'}</div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-xs uppercase tracking-wide text-slate-500">Joined</div>
              <div className="mt-1 text-sm">{joined ?? '—'}</div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-xs uppercase tracking-wide text-slate-500">Occupation</div>
              <div className="mt-1 text-sm">{user.occupation ?? '—'}</div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-xs uppercase tracking-wide text-slate-500">Schedule</div>
              <div className="mt-1 text-sm">{user.schedule ?? '—'}</div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-xs uppercase tracking-wide text-slate-500">Pets</div>
              <div className="mt-1 text-sm">{user.pets ?? '—'}</div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-xs uppercase tracking-wide text-slate-500">Languages</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(user.languages ?? ['—']).map((l) => (
                  <Chip key={l}>{l}</Chip>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-xs uppercase tracking-wide text-slate-500">Interests</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(user.interests ?? ['—']).map((i) => (
                  <Chip key={i}>{i}</Chip>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
