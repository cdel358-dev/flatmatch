import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';

export default function App() {
  return (
    <div className="min-h-dvh bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Top bar */}
      <Header />

      {/* Page content — reserve space for fixed mobile bottom nav */}
      <main className="mx-auto max-w-7xl px-4 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Always render; hidden on md+ */}
      <BottomNav />
    </div>
  );
}
