import { FiBookmark } from 'react-icons/fi';

export default function BookmarkBadge() {
  return (
    <span
      aria-label="Bookmarked"
      className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/90 text-white shadow-sm dark:bg-white/90 dark:text-slate-900"
    >
      <FiBookmark size={14} />
    </span>
  );
}
