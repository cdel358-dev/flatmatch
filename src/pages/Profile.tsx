import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user, logout } = useAuth();

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <section className="prose dark:prose-invert max-w-none">
      <h1>User Profile</h1>

      {user ? (
        <div className="not-prose mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-slate-700 dark:text-slate-200">
            <strong>Email:</strong> {user.email}
          </p>
          {user.name && (
            <p className="text-sm text-slate-700 dark:text-slate-200">
              <strong>Name:</strong> {user.name}
            </p>
          )}
        </div>
      ) : (
        <p className="text-slate-500 dark:text-slate-400">No user logged in.</p>
      )}

      <div className="mt-8 flex flex-col gap-3 not-prose">
        <button
          onClick={handleClearData}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Clear Data
        </button>

        <button
          onClick={logout}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Log out
        </button>
      </div>
    </section>
  );
}
