import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

/**
 * Sidebar Component
 * - User info, navigation, dark mode toggle, logout
 * - Collapsible on mobile via prop
 */
export default function Sidebar({ open, onClose }) {
  const { dark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72
          bg-white dark:bg-surface-800
          border-r border-gray-200 dark:border-gray-700/50
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-700/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/25">
            T
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-4 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
            </svg>
            Board
          </a>
        </nav>

        {/* Bottom actions */}
        <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700/50">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            id="theme-toggle"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            {dark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            id="logout-button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
