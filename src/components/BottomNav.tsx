import { Link, useLocation } from 'react-router-dom';
import {
  FiInfo,
  FiBookmark,
  FiSearch,
  FiMessageSquare,
  FiUser,
} from 'react-icons/fi';

export default function BottomNav() {
  const { pathname } = useLocation();

  const item = (
    to: string,
    label: string,
    Icon: React.ComponentType<{ size?: number }>,
  ) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        aria-label={label}
        className={`flex flex-col items-center justify-center gap-1 text-xs ${
          active
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-300'
        }`}
      >
        <Icon size={22} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="navigation"
    >
      <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-6">
        {item('/info', 'Info', FiInfo)}
        {item('/saved', 'Saved', FiBookmark)}
        {item('/', 'Match', FiSearch)}
        {item('/messages', 'Messages', FiMessageSquare)}
        {item('/profile', 'Profile', FiUser)}
      </div>
    </nav>
  );
}
