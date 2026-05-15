const NoteModel = require('../models/note.model');
const ShareModel = require('../models/share.model');
const UserModel = require('../models/user.model');
const { AppError } = require('../utils/AppError');
const { getPagination } = require('../utils/pagination');

const ensureNoteExists = async (noteId) => {
  const note = await NoteModel.findNoteById(noteId);

  if (!note) {
    throw new AppError(404, 'Note not found');
  }

  return note;
};

const ensureOwner = (note, userId) => {
  if (note.owner_id !== userId) {
    throw new AppError(403, 'You are not allowed to perform this action');
  }
};

const listNotes = async ({ userId, page, limit }) => {
  const pagination = getPagination(page, limit);
  const { notes, total } = await NoteModel.findAccessibleNotes({
    userId,
    limit: pagination.limit,
    offset: pagination.offset
  });

  return {
    notes,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(total / pagination.limit)
  };
};

const getNote = async ({ noteId, userId }) => {
  const note = await ensureNoteExists(noteId);
  const hasAccess = await NoteModel.hasNoteAccess({ noteId, userId });

  if (!hasAccess) {
    throw new AppError(403, 'You are not allowed to access this note');
  }

  return note;
};

const createNote = async ({ userId, title, content }) => {
  return NoteModel.createNote({ ownerId: userId, title, content });
};

const updateNote = async ({ noteId, userId, title, content }) => {
  const note = await ensureNoteExists(noteId);
  ensureOwner(note, userId);

  return NoteModel.updateNote({ id: noteId, title, content });
};

const deleteNote = async ({ noteId, userId }) => {
  const note = await ensureNoteExists(noteId);
  ensureOwner(note, userId);

  await NoteModel.deleteNote(noteId);
};

const shareNote = async ({ noteId, ownerId, shareWithEmail }) => {
  const note = await ensureNoteExists(noteId);
  ensureOwner(note, ownerId);

  const recipient = await UserModel.findUserByEmail(shareWithEmail);

  if (!recipient) {
    throw new AppError(404, 'User not found');
  }

  if (recipient.id === ownerId) {
    throw new AppError(400, 'Cannot share a note with yourself');
  }

  const existingShare = await ShareModel.findNoteShare({
    noteId,
    sharedWithUserId: recipient.id
  });

  if (existingShare) {
    throw new AppError(400, 'Note is already shared with this user');
  }

  await ShareModel.createNoteShare({
    noteId,
    sharedWithUserId: recipient.id
  });

  return { message: 'Note shared successfully' };
};

const togglePin = async ({ noteId, userId }) => {
  const note = await ensureNoteExists(noteId);
  ensureOwner(note, userId);

  return NoteModel.toggleNotePin({
    id: noteId,
    isPinned: !note.is_pinned
  });
};

const searchNotes = async ({ userId, query }) => {
  return NoteModel.searchAccessibleNotes({ userId, query });
};

module.exports = {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  togglePin,
  searchNotes
};
