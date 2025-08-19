import { useState, useRef, useEffect, useMemo } from 'react';
import {
  FiBell,
  FiMenu,
  FiInfo,
  FiBookmark,
  FiSearch,
  FiMessageSquare,
  FiUser,
  FiLogIn,
} from 'react-icons/fi';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '/flatmatch-2.png';

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const MenuItem = ({
    to,
    label,
    Icon,
  }: {
    to: string;
    label: string;
    Icon: React.ComponentType<{ size?: number }>;
  }) => (
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        [
          'flex items-center gap-2 rounded-xl px-3 py-2 text-sm',
          isActive
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={18} />
          <span className="leading-none">{label}</span>
          {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />}
        </>
      )}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="FlatMatch Logo"
              className="h-16 w-auto object-contain"
            />
          {/* <span className="text-lg font-bold">FlatMatch</span> */}
          </Link>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications: only when logged in */}
          {isAuthenticated && (
            <button
              aria-label="Notifications"
              className="rounded-xl border border-transparent p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FiBell />
            </button>
          )}

          {/* Desktop: Auth/Profile */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <FiUser size={16} />
                Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/auth?mode=login"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="text-sm font-semibold text-slate-700 underline hover:text-slate-900 dark:text-slate-200"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger (desktop hidden) */}
          <div className="relative md:hidden" ref={menuRef}>
            <button
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="rounded-xl border border-transparent p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FiMenu />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                {isAuthenticated ? (
                  <>
                    <MenuItem to="/info" label="Info" Icon={FiInfo} />
                    <MenuItem to="/bookmarks" label="Saved" Icon={FiBookmark} />
                    <MenuItem to="/" label="Match" Icon={FiSearch} />
                    <MenuItem to="/messages" label="Messages" Icon={FiMessageSquare} />
                    <MenuItem to="/profile" label="Profile" Icon={FiUser} />
                  </>
                ) : (
                  <>
                    <MenuItem to="/auth?mode=login" label="Log in" Icon={FiLogIn} />
                    <MenuItem to="/auth?mode=signup" label="Sign up" Icon={FiUser} />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop quick links bar: show only if authenticated */}
      {isAuthenticated && (
        <nav className="hidden border-t border-slate-200 md:block dark:border-slate-800">
          <div className="mx-auto flex max-w-7xl gap-2 px-4 py-2">
            {[
              { to: '/info', label: 'Info', Icon: FiInfo },
              { to: '/bookmarks', label: 'Saved', Icon: FiBookmark },
              { to: '/', label: 'Match', Icon: FiSearch },
              { to: '/messages', label: 'Messages', Icon: FiMessageSquare },
              { to: '/profile', label: 'Profile', Icon: FiUser },
            ].map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    'inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm',
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                  ].join(' ')
                }
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
