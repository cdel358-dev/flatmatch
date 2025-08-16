import { useEffect, useState, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
}

const STORAGE_KEY = 'fm_user';

function readUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}
function writeUser(u: User | null) {
  if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  else localStorage.removeItem(STORAGE_KEY);
  // notify listeners (and our own hook) immediately
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: u ? JSON.stringify(u) : null,
    })
  );
}

/** Central auth state used by Header/BottomNav/etc. */
export function useAuth() {
  const [user, setUser] = useState<User | null>(() => readUser());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setUser(readUser());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const logout = useCallback(() => {
    writeUser(null);
  }, []);

  const login = useCallback((u: User) => {
    writeUser(u);
  }, []);

  return { user, isAuthenticated: !!user, login, logout };
}
