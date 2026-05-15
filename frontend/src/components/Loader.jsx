const Loader = ({ label = 'Loading' }) => (
  <div className="flex min-h-[240px] items-center justify-center">
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950 dark:border-slate-700 dark:border-t-white" />
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
    </div>
  </div>
);

export default Loader;
