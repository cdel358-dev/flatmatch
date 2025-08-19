import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useListings } from "../state/ListingsContext";
import SafeImage from "../components/SafeImage";
import BookmarkButton from "../components/BookmarkButton";
import BackButton from "../components/BackButton";

export default function Bookmarks() {
  const navigate = useNavigate();
  const { popular, nearby, toggleSaved } = useListings();

  // Merge + dedupe + keep only saved listings
  const saved = useMemo(() => {
    const list = [...(popular ?? []), ...(nearby ?? [])];
    const map = new Map<string, any>();
    for (const l of list) {
      if (l?.saved) map.set(l.id, l);
    }
    return Array.from(map.values());
  }, [popular, nearby]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 pt-3 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BackButton
          className="p-1 -ml-1 rounded hover:bg-gray-100 active:bg-gray-200"
          iconClassName="h-6 w-6 text-gray-700"
          label="" // no text, just the arrow
        />
        <h1 className="text-xl font-semibold">Bookmarked Listings</h1>
      </div>

      {saved.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-700">
          No bookmarks yet. Tap the ribbon on any listing to save it here.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((l) => {
            const img = l.img ?? l.images?.[0] ?? "";
            return (
              <div
                key={l.id}
                onClick={() => navigate(`/listing/${l.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/listing/${l.id}`)}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Image area */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <SafeImage src={img} alt={l.title} heightClass="h-44" />
                  <BookmarkButton
                    isBookmarked={!!l.saved}
                    onToggle={(e) => {
                      e?.stopPropagation();
                      toggleSaved(l.id);
                    }}
                  />
                </div>

                {/* Text area */}
                <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                  <div className="line-clamp-1 text-[17px] font-semibold">{l.title}</div>
                  {l.subtitle && (
                    <div className="mt-0.5 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                      {l.subtitle}
                    </div>
                  )}
                  {l.price && (
                    <div className="mt-2 text-[15px] font-semibold text-blue-600">${l.price}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
