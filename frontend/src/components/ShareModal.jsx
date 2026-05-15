import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const shareSchema = z.object({
  email: z.string().email('Enter a valid email address')
});

const ShareModal = ({ note, isOpen, isSharing, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(shareSchema),
    defaultValues: { email: '' }
  });

  if (!isOpen || !note) {
    return null;
  }

  const submit = async (values) => {
    await onSubmit(values.email);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Share note</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{note.title}</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close share dialog">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <input className="input" placeholder="teammate@example.com" {...register('email')} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSharing}>
              {isSharing ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ShareModal;
