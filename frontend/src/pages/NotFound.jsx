import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-[70vh] items-center justify-center">
    <div className="max-w-md text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-300">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Page not found</h1>
      <p className="mt-3 text-slate-500 dark:text-slate-400">The page you are looking for does not exist.</p>
      <Link className="btn-primary mt-6" to="/">
        Back to notes
      </Link>
    </div>
  </div>
);

export default NotFound;
