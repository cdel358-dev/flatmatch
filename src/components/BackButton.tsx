import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackArrow from './BackArrow';

type Props = {
  to?: string;                 // optional: navigate to this route instead of history back
  label?: string;              // optional text label
  className?: string;          // wrapper styles
  iconClassName?: string;      // icon-only styles
};

export default function BackButton({
  to,
  label = 'Back',
  className = 'inline-flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-100',
  iconClassName = 'h-5 w-5',
}: Props) {
  const navigate = useNavigate();

  if (to) {
    return (
      <Link to={to} className={className} aria-label={label}>
        <BackArrow className={iconClassName} />
        <span className="text-sm">{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={className}
      aria-label={label}
    >
      <BackArrow className={iconClassName} />
      <span className="text-sm">{label}</span>
    </button>
  );
}
