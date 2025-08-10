import { NavLink } from 'react-router-dom';
import {
  FiInfo,
  FiBookmark,
  FiSearch,
  FiMessageSquare,
  FiUser,
} from 'react-icons/fi';

type IconType = React.ComponentType<{ size?: number }>;

function NavItem({
  to,
  label,
  Icon,
}: {
  to: string;
  label: string;
  Icon: IconType;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex flex-col items-center justify-center gap-1 text-xs',
          isActive
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-300',
        ].join(' ')
      }
      aria-label={label}
    >
      {({ isActive }) => (
        <>
          <Icon size={22} />
          <span
            className={[
              'leading-none',
              isActive ? 'font-semibold' : 'font-normal',
            ].join(' ')}
          >
            {label}
          </span>
          {/* tiny active bar */}
          <span
            className={[
              'mt-0.5 h-0.5 w-4 rounded-full',
              isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent',
            ].join(' ')}
            aria-hidden
          />
        </>
      )}
    </NavLink>
  );
}

export default function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="navigation"
    >
      <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-6">
        <NavItem to="/info" label="Info" Icon={FiInfo} />
        <NavItem to="/bookmarks" label="Saved" Icon={FiBookmark} />
        <NavItem to="/" label="Match" Icon={FiSearch} />
        <NavItem to="/messages" label="Messages" Icon={FiMessageSquare} />
        <NavItem to="/profile" label="Profile" Icon={FiUser} />
      </div>
    </nav>
  );
}
