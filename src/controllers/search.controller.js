const NoteService = require('../services/note.service');

const searchNotes = async (req, res) => {
  const notes = await NoteService.searchNotes({
    userId: req.user.userId,
    query: req.query.q
  });

  res.status(200).json({ notes });
};

module.exports = { searchNotes };
