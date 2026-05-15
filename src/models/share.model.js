const { pool } = require('../database/pool');

const createNoteShare = async ({ noteId, sharedWithUserId }) => {
  const result = await pool.query(
    `INSERT INTO note_shares (note_id, shared_with_user_id)
     VALUES ($1, $2)
     ON CONFLICT (note_id, shared_with_user_id) DO NOTHING
     RETURNING note_id, shared_with_user_id, created_at`,
    [noteId, sharedWithUserId]
  );

  return result.rows[0] || null;
};

const findNoteShare = async ({ noteId, sharedWithUserId }) => {
  const result = await pool.query(
    `SELECT note_id, shared_with_user_id, created_at
     FROM note_shares
     WHERE note_id = $1 AND shared_with_user_id = $2`,
    [noteId, sharedWithUserId]
  );

  return result.rows[0] || null;
};

module.exports = {
  createNoteShare,
  findNoteShare
};
