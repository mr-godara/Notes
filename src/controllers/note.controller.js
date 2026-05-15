const NoteService = require('../services/note.service');

const listNotes = async (req, res) => {
  const response = await NoteService.listNotes({
    userId: req.user.userId,
    page: req.query.page,
    limit: req.query.limit
  });

  res.status(200).json(response);
};

const getNote = async (req, res) => {
  const note = await NoteService.getNote({
    noteId: req.params.id,
    userId: req.user.userId
  });

  res.status(200).json(note);
};

const createNote = async (req, res) => {
  const note = await NoteService.createNote({
    userId: req.user.userId,
    title: req.body.title,
    content: req.body.content
  });

  res.status(201).json(note);
};

const updateNote = async (req, res) => {
  const note = await NoteService.updateNote({
    noteId: req.params.id,
    userId: req.user.userId,
    title: req.body.title,
    content: req.body.content
  });

  res.status(200).json(note);
};

const deleteNote = async (req, res) => {
  await NoteService.deleteNote({
    noteId: req.params.id,
    userId: req.user.userId
  });

  res.status(204).send();
};

const shareNote = async (req, res) => {
  const response = await NoteService.shareNote({
    noteId: req.params.id,
    ownerId: req.user.userId,
    shareWithEmail: req.body.share_with_email
  });

  res.status(200).json(response);
};

const togglePin = async (req, res) => {
  const note = await NoteService.togglePin({
    noteId: req.params.id,
    userId: req.user.userId
  });

  res.status(200).json(note);
};

module.exports = {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  togglePin
};
