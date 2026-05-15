import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const noteSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(500, 'Title is too long'),
  content: z.string().max(100000, 'Content is too long')
});

const DRAFT_KEY = 'notes_draft';

const NoteModal = ({ note, isOpen, isSaving, onClose, onSubmit }) => {
  const isEditing = Boolean(note);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: ''
    }
  });

  const content = watch('content') || '';

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (note) {
      reset({ title: note.title, content: note.content });
      return;
    }

    const draft = localStorage.getItem(DRAFT_KEY);
    reset(draft ? JSON.parse(draft) : { title: '', content: '' });
  }, [isOpen, note, reset]);

  useEffect(() => {
    if (!isOpen || note) {
      return undefined;
    }

    const subscription = watch((value) => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        title: value.title || '',
        content: value.content || ''
      }));
    });

    return () => subscription.unsubscribe();
  }, [isOpen, note, watch]);

  const submit = async (values) => {
    await onSubmit(values);
    if (!note) {
      localStorage.removeItem(DRAFT_KEY);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-2xl rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:rounded-3xl sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">{isEditing ? 'Edit note' : 'Create note'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close note editor">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <input className="input" placeholder="Title" {...register('title')} />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>
          <div>
            <textarea className="input min-h-[220px]" placeholder="Write something..." {...register('content')} />
            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>{errors.content?.message}</span>
              <span>{content.length}/100000</span>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Create note'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NoteModal;
