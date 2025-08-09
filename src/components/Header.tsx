import { useState, useRef, useEffect } from 'react';
import { FiBell, FiMenu, FiInfo, FiBookmark, FiSearch, FiMessageSquare, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="relative flex justify-between items-center p-4 border-b border-slate-200 bg-white dark:bg-slate-900">
      {/* Branding */}
      <h1 className="text-lg font-bold">Flat Match</h1>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <FiBell size={20} />
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          <FiMenu size={20} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div
          ref={menuRef}
          className="absolute right-4 top-14 w-48 rounded-lg shadow-lg border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 z-50"
        >
          <nav className="flex flex-col divide-y divide-slate-200 dark:divide-slate-700">
            <Link to="/about" className="flex items-center gap-2 p-3 hover:bg-slate-100 dark:hover:bg-slate-700">
              <FiInfo /> Info
            </Link>
            <Link to="/saved" className="flex items-center gap-2 p-3 hover:bg-slate-100 dark:hover:bg-slate-700">
              <FiBookmark /> Saved
            </Link>
            <Link to="/" className="flex items-center gap-2 p-3 hover:bg-slate-100 dark:hover:bg-slate-700">
              <FiSearch /> Match
            </Link>
            <Link to="/messages" className="flex items-center gap-2 p-3 hover:bg-slate-100 dark:hover:bg-slate-700">
              <FiMessageSquare /> Messages
            </Link>
            <Link to="/profile" className="flex items-center gap-2 p-3 hover:bg-slate-100 dark:hover:bg-slate-700">
              <FiUser /> Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
