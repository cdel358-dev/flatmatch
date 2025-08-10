// src/components/BookmarkButton.tsx
import React from "react";

type Props = {
  isBookmarked: boolean;
  onToggle: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

export default function BookmarkButton({ isBookmarked, onToggle, className = "" }: Props) {
  return (
    <button
      aria-label={isBookmarked ? "Remove bookmark" : "Save bookmark"}
      aria-pressed={isBookmarked}
      onClick={(e) => onToggle?.(e)}
      className={[
        "absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg",
        "bg-white/98 hover:bg-white transition",
        className,
      ].join(" ")}
    >
      {isBookmarked ? (
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px] text-white"
          fill="currentColor"
        >
          <path d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px] text-slate-300"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z" />
        </svg>
      )}
    </button>
  );
}
