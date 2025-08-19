import { useState, useMemo } from 'react';
import { FiX, FiMail, FiSmartphone, FiChevronRight } from 'react-icons/fi';
import logo from '/flatmatch-2.png';

interface Props {
  mode?: 'login' | 'signup';
  onClose?: () => void;
  onSwitchMode?: (mode: 'login' | 'signup') => void;
  onContinue?: (email: string) => void;
}

export default function AuthModal({
  mode = 'login',
  onClose,
  onSwitchMode,
  onContinue,
}: Props) {
  const [agree, setAgree] = useState(false);
  const [email, setEmail] = useState('');

  const title = mode === 'signup' ? 'Create your account' : 'Welcome back';
  const valid = useMemo(() => /.+@.+\..+/.test(email), [email]);

  const BASE = (import.meta as any).env?.BASE_URL ?? '/';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <FiX className="h-5 w-5" />
      </button>

      {/* Logo */}
      <img
        src={logo}
        alt="FlatMatch Logo"
        className="mb-6 w-80 object-contain mx-auto"
      />


      <h1 className="mb-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        {mode === 'signup' ? (
          <>Sign up to save listings, sync across devices, and message flatmates.</>
        ) : (
          <>Log in to access your saved places and messages.</>
        )}
      </p>

      {mode === 'signup' && (
        <label className="mb-4 flex select-none items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-slate-700"
          />
          I agree to get emails about cool stuff on FlatMatch
        </label>
      )}

      <div className="grid gap-3">
        <button
          type="button"
          className="inline-flex w-full items-center justify-between rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span className="flex items-center gap-3">
            <FiSmartphone className="h-5 w-5" /> Continue with phone number
          </span>
          <FiChevronRight />
        </button>
        <button
          type="button"
          className="inline-flex w-full items-center justify-between rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span className="flex items-center gap-3">
            <img
              alt="Google"
              src={`${BASE}img/logos/google.svg`}
              className="h-5 w-5"
            />
            Continue with Google
          </span>
          <FiChevronRight />
        </button>
        <button
          type="button"
          className="inline-flex w-full items-center justify-between rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span className="flex items-center gap-3">
            <img
              alt="Apple"
              src={`${BASE}img/logos/apple.svg`}
              className="h-5 w-5"
            />
            Continue with Apple
          </span>
          <FiChevronRight />
        </button>
      </div>

      <div className="my-4 flex items-center gap-3 text-xs text-slate-500">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" /> OR
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 ring-1 ring-inset ring-transparent focus-within:ring-blue-600 dark:bg-slate-800/70 dark:focus-within:ring-blue-400">
        <FiMail className="h-4 w-4 text-slate-500" />
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent p-1 text-sm outline-none placeholder:text-slate-500"
        />
      </div>

      <button
        onClick={() => valid && onContinue?.(email)}
        disabled={!valid}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-blue-600"
      >
        Continue
      </button>

      <p className="mt-4 text-center text-xs text-slate-600 dark:text-slate-300">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <button
              className="underline"
              onClick={() => onSwitchMode?.('login')}
            >
              Log in
            </button>
          </>
        ) : (
          <>
            New to FlatMatch?{' '}
            <button
              className="underline"
              onClick={() => onSwitchMode?.('signup')}
            >
              Create account
            </button>
          </>
        )}
      </p>
    </div>
  );
}
