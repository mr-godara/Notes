import { useQuery } from '@tanstack/react-query';
import { Mail, Pin } from 'lucide-react';
import Loader from '../components/Loader.jsx';
import { getAbout } from '../services/notesService.js';

const About = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['about'],
    queryFn: getAbout
  });

  if (isLoading) {
    return <Loader label="Loading about" />;
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
        Could not load about information.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-300">About</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Notes API Frontend</h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            A responsive React interface for authentication, notes, sharing, pinning, and search.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">{data.name}</h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Mail className="h-4 w-4" />
              {data.email}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-300/15 dark:text-amber-200">
                <Pin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-950 dark:text-white">Note pinning</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {data.my_features?.note_pinning}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
