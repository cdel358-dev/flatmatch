import { useMemo, useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../hooks/useAuth';

export default function AuthPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { login } = useAuth();

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
      const user = {
        id: crypto?.randomUUID?.() || Date.now().toString(),
        email,
        name: email.split('@')[0],
      };
      login(user);

      // If signing up, go to onboarding wizard; otherwise follow "next"
      if (mode === 'signup') {
        navigate('/preferences', { replace: true });
      } else {
        navigate(next, { replace: true });
      }
    },
    [login, navigate, next, mode],
  );

  return (
    <div className="relative -mx-4 min-h-[calc(100dvh-64px)] md:-mx-0 md:min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          backgroundImage: `url(${heroUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 hidden bg-black/40 md:block" aria-hidden />

      <div className="relative z-10 mx-auto grid min-h-[inherit] place-items-center px-4 py-10 md:max-w-7xl">
        <AuthModal
          mode={mode}
          onSwitchMode={setMode}
          onClose={() => navigate(-1)}
          onContinue={handleContinue}
        />
      </div>

      <div className="md:hidden">
        <div className="py-4" />
      </div>
    </div>
  );
}
