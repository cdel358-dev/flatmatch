import { FiInfo, FiBookmark, FiSearch, FiMessageSquare, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="flex justify-around border-t border-slate-200 p-2 bg-white dark:bg-slate-900">
      <Link to="/about" className="flex flex-col items-center text-sm">
        <FiInfo size={20} /> Info
      </Link>
      <Link to="/saved" className="flex flex-col items-center text-sm">
        <FiBookmark size={20} /> Saved
      </Link>
      <Link to="/" className="flex flex-col items-center text-sm">
        <FiSearch size={22} /> Match
      </Link>
      <Link to="/messages" className="flex flex-col items-center text-sm">
        <FiMessageSquare size={20} /> Messages
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-sm">
        <FiUser size={20} /> Profile
      </Link>
    </nav>
  );
}
