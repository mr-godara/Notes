import { Link, useLocation } from 'react-router-dom';
import { LogOut, Moon, Search, Sun, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const Navbar = ({ searchTerm, onSearchChange, onClearSearch }) => {
  const { logout, theme, toggleTheme } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 rounded-xl focus-ring">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-base font-black text-slate-950 shadow-sm">
            N
          </span>
          <span className="hidden text-lg font-bold text-slate-950 dark:text-white sm:inline">Notes</span>
        </Link>

        {isDashboard && (
          <div className="relative ml-0 flex-1 sm:ml-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Search notes"
              className="input h-11 rounded-2xl pl-10 pr-10"
              placeholder="Search notes"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                onClick={onClearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        <nav className="ml-auto flex items-center gap-1">
          <Link
            to="/about"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            About
          </Link>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button className="icon-btn" onClick={logout} aria-label="Logout" title="Logout">
            <LogOut className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
