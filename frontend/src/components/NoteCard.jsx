import { Copy, Pencil, Pin, PinOff, Share2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { clampPreview, formatDate } from '../utils/formatDate.js';

const NoteCard = ({ note, canEdit, onEdit, onDelete, onShare, onTogglePin }) => {
  const copyNote = async () => {
    await navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    toast.success('Note copied');
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="group flex min-h-[190px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-3 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-base font-bold text-slate-950 dark:text-white">{note.title}</h2>
          <p className="mt-1 text-xs font-medium text-slate-400">{formatDate(note.created_at)}</p>
        </div>
        {note.is_pinned && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-300/15 dark:text-amber-200">
            <Pin className="h-3.5 w-3.5" />
            Pinned
          </span>
        )}
      </div>

      <p className="mb-5 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
        {clampPreview(note.content) || 'No content'}
      </p>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <button className="icon-btn" onClick={() => onTogglePin(note)} aria-label={note.is_pinned ? 'Unpin note' : 'Pin note'} title={note.is_pinned ? 'Unpin' : 'Pin'}>
          {note.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </button>
        <div className="flex items-center gap-1">
          <button className="icon-btn" onClick={copyNote} aria-label="Copy note" title="Copy">
            <Copy className="h-4 w-4" />
          </button>
          <button className="icon-btn" onClick={() => onShare(note)} aria-label="Share note" title="Share">
            <Share2 className="h-4 w-4" />
          </button>
          {canEdit && (
            <>
              <button className="icon-btn" onClick={() => onEdit(note)} aria-label="Edit note" title="Edit">
                <Pencil className="h-4 w-4" />
              </button>
              <button className="icon-btn hover:text-red-600 dark:hover:text-red-400" onClick={() => onDelete(note)} aria-label="Delete note" title="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default NoteCard;
