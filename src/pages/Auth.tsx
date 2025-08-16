import { useMemo, useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

export default function AuthPage() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const params = useMemo(() => new URLSearchParams(search), [search]);
  const initialMode = (params.get('mode') as 'login' | 'signup') || 'login';
  const next = params.get('next') || '/';

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  useEffect(() => {
    const m =
      (new URLSearchParams(window.location.search).get('mode') as
        | 'login'
        | 'signup') || 'login';
    setMode(m);
  }, [search]);

  const BASE = (import.meta as any).env?.BASE_URL ?? '/';
  const heroUrl = useMemo(() => `${BASE}img/auth-hero.jpg`, [BASE]);

  const handleContinue = useCallback(
    (email: string) => {
      const name = email.split('@')[0];
      const user = {
        id: crypto?.randomUUID?.() || Date.now().toString(),
        email,
        name,
      };
      localStorage.setItem('fm_user', JSON.stringify(user));

      // Fire a storage event so other components can react
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'fm_user',
          newValue: JSON.stringify(user),
        }),
      );

      navigate(next, { replace: true });
    },
    [navigate, next],
  );

  return (
    <div className="relative -mx-4 min-h-[calc(100dvh-64px)] md:-mx-0 md:min-h-screen">
      {/* Desktop/WebView background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          backgroundImage: `url(${heroUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        className="absolute inset-0 hidden bg-black/40 md:block"
        aria-hidden
      />

      {/* Centered modal */}
      <div className="relative z-10 mx-auto grid min-h-[inherit] place-items-center px-4 py-10 md:max-w-7xl">
        <AuthModal
          mode={mode}
          onSwitchMode={setMode}
          onClose={() => navigate(-1)}
          onContinue={handleContinue}
        />
      </div>

      {/* Mobile: spacer */}
      <div className="md:hidden">
        <div className="py-4" />
      </div>
    </div>
  );
}
