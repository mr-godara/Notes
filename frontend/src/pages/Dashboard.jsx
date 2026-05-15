import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, RefreshCw } from 'lucide-react';
import NoteCard from '../components/NoteCard.jsx';
import NoteModal from '../components/NoteModal.jsx';
import ShareModal from '../components/ShareModal.jsx';
import Pagination from '../components/Pagination.jsx';
import Loader from '../components/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getApiErrorMessage } from '../api/axios.js';
import {
  createNote,
  deleteNote,
  getNotes,
  searchNotes,
  shareNote,
  togglePin,
  updateNote
} from '../services/notesService.js';

const LIMIT = 20;

const Dashboard = ({ searchTerm }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [sharingNote, setSharingNote] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const openCreate = (event) => {
      if ((event.key === 'n' || event.key === 'N') && !event.metaKey && !event.ctrlKey && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        setEditingNote(null);
        setIsNoteModalOpen(true);
      }
    };

    window.addEventListener('keydown', openCreate);
    return () => window.removeEventListener('keydown', openCreate);
  }, []);

  const notesQuery = useQuery({
    queryKey: ['notes', page, LIMIT],
    queryFn: () => getNotes({ page, limit: LIMIT }),
    enabled: !debouncedSearch
  });

  const searchQuery = useQuery({
    queryKey: ['notes-search', debouncedSearch],
    queryFn: () => searchNotes(debouncedSearch),
    enabled: Boolean(debouncedSearch)
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created');
      setIsNoteModalOpen(false);
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Could not create note'))
  });

  const updateMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes-search'] });
      toast.success('Note updated');
      setIsNoteModalOpen(false);
      setEditingNote(null);
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Could not update note'))
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes-search'] });
      toast.success('Note deleted');
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Could not delete note'))
  });

  const pinMutation = useMutation({
    mutationFn: togglePin,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notes'] });
      const previous = queryClient.getQueryData(['notes', page, LIMIT]);

      queryClient.setQueryData(['notes', page, LIMIT], (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          notes: current.notes
            .map((note) => (note.id === id ? { ...note, is_pinned: !note.is_pinned } : note))
            .sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned))
        };
      });

      return { previous };
    },
    onError: (error, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notes', page, LIMIT], context.previous);
      }
      toast.error(getApiErrorMessage(error, 'Could not update pin'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes-search'] });
    }
  });

  const shareMutation = useMutation({
    mutationFn: shareNote,
    onSuccess: () => {
      toast.success('Note shared');
      setSharingNote(null);
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Could not share note'))
  });

  const notes = useMemo(() => {
    if (debouncedSearch) {
      return searchQuery.data || [];
    }

    return notesQuery.data?.notes || [];
  }, [debouncedSearch, notesQuery.data, searchQuery.data]);

  const isLoading = debouncedSearch ? searchQuery.isLoading : notesQuery.isLoading;
  const isError = debouncedSearch ? searchQuery.isError : notesQuery.isError;
  const totalPages = notesQuery.data?.totalPages || 1;

  const openCreate = () => {
    setEditingNote(null);
    setIsNoteModalOpen(true);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const closeEditor = () => {
    setIsNoteModalOpen(false);
    setEditingNote(null);
  };

  const submitNote = async (values) => {
    if (editingNote) {
      await updateMutation.mutateAsync({ id: editingNote.id, payload: values });
      return;
    }

    await createMutation.mutateAsync(values);
  };

  const confirmDelete = (note) => {
    const accepted = window.confirm(`Delete "${note.title}"? This cannot be undone.`);
    if (accepted) {
      deleteMutation.mutate(note.id);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
            {debouncedSearch ? 'Search results' : 'Your notes'}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {debouncedSearch ? `Matching "${debouncedSearch}"` : 'Pinned notes stay first. Shared notes appear here too.'}
          </p>
        </div>
        <button className="btn-primary hidden sm:inline-flex" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New note
        </button>
      </div>

      {isLoading && <Loader label="Loading notes" />}

      {isError && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5" />
            Could not load notes. Check that the backend API is running.
          </div>
        </div>
      )}

      {!isLoading && !isError && notes.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">{debouncedSearch ? 'No matches found' : 'No notes yet'}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            {debouncedSearch ? 'Try a different search term.' : 'Create your first note and it will appear here.'}
          </p>
          {!debouncedSearch && (
            <button className="btn-primary mt-5" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              New note
            </button>
          )}
        </div>
      )}

      <AnimatePresence>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              canEdit={note.owner_id === user?.id}
              onEdit={openEdit}
              onDelete={confirmDelete}
              onShare={setSharingNote}
              onTogglePin={(target) => pinMutation.mutate(target.id)}
            />
          ))}
        </div>
      </AnimatePresence>

      {!debouncedSearch && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      <button
        className="fixed bottom-5 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-2xl sm:hidden dark:bg-white dark:text-slate-950"
        onClick={openCreate}
        aria-label="Create note"
      >
        <Plus className="h-6 w-6" />
      </button>

      <NoteModal
        note={editingNote}
        isOpen={isNoteModalOpen}
        isSaving={createMutation.isPending || updateMutation.isPending}
        onClose={closeEditor}
        onSubmit={submitNote}
      />

      <ShareModal
        note={sharingNote}
        isOpen={Boolean(sharingNote)}
        isSharing={shareMutation.isPending}
        onClose={() => setSharingNote(null)}
        onSubmit={async (email) => {
          try {
            await shareMutation.mutateAsync({ id: sharingNote.id, email });
            return true;
          } catch (error) {
            return false;
          }
        }}
      />
    </div>
  );
};

export default Dashboard;
