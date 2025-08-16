// src/pages/info/Tips.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import tipsData from "../../data/tips.json";

type Tip = {
  id: number;
  title: string;
  text: string;
  author: string;
  date: string; // YYYY-MM-DD
};

function timeAgo(isoDate: string) {
  const then = new Date(isoDate + "T00:00:00");
  const now = new Date();
  const diffDays = Math.max(1, Math.round((+now - +then) / (1000 * 60 * 60 * 24)));
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  const weeks = Math.round(diffDays / 7);
  return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
}

export default function Tips() {
  const navigate = useNavigate();
  const [sort, setSort] = useState<"recent" | "oldest" | "az" | "za">("recent");

  // Always start from raw data, then apply sort
  const tips = useMemo(() => {
    const list = [...(tipsData as Tip[])];
    switch (sort) {
      case "oldest":
        return list.sort((a, b) => a.date.localeCompare(b.date));
      case "az":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "za":
        return list.sort((a, b) => b.title.localeCompare(a.title));
      case "recent":
      default:
        return list.sort((a, b) => b.date.localeCompare(a.date));
    }
  }, [sort]);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="sticky top-0 z-10 -mx-4 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-4 flex items-center gap-2 py-3">
          <BackButton
            className="p-1 -ml-1 rounded hover:bg-gray-100 active:bg-gray-200"
            iconClassName="h-6 w-6 text-gray-700"
            label="" // no text, just the arrow
          />
          <h1 className="text-xl font-semibold">Tips From Our Users</h1>
        </div>
        <div className="mx-4 h-px w-full bg-gray-200" />
      </div>

      {/* Actions */}
      <div className="mt-2 flex items-center justify-end">
        <label className="sr-only" htmlFor="tip-sort">Sort tips</label>
        <select
          id="tip-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest</option>
          <option value="az">Title A–Z</option>
          <option value="za">Title Z–A</option>
        </select>
      </div>

      {/* Tip cards */}
      <div className="space-y-4 pt-4 max-w-3xl mx-auto">
        {tips.map((t) => (
          <article
            key={t.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                {/* quote icon */}
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                  <path d="M7.5 11c-.9 0-1.5.6-1.5 1.5s.6 1.5 1.5 1.5S9 13.4 9 12.5 8.4 11 7.5 11Zm0-6C4.5 5 3 7 3 9.5c0 2.7 2.2 4.7 5 4.9v.1c-1.1 1.5-2.5 3.3-3.5 5.5h2.5c1.4-3 3.9-6 3.9-9.5C10.9 7.1 9.4 5 7.5 5Zm9 6c-.9 0-1.5.6-1.5 1.5S15.6 14 16.5 14s1.5-.6 1.5-1.5S17.4 11 16.5 11Zm0-6c-3 0-4.5 2-4.5 4.5 0 2.7 2.2 4.7 5 4.9v.1c-1.1 1.5-2.5 3.3-3.5 5.5H16c1.4-3 3.9-6 3.9-9.5 0-3.4-1.5-5.5-3.4-5.5Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-base font-semibold">{t.title}</h2>
                <p className="mt-1 italic text-slate-700 dark:text-slate-200">“{t.text}”</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {t.author} • {timeAgo(t.date)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
