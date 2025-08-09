import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Show header only for desktop */}
      {!isMobile && <Header />}

      <main className="flex-1 container py-4">
        <Outlet />
      </main>

      {/* Show bottom nav only for mobile */}
      {isMobile && <BottomNav />}
    </div>
  );
}
