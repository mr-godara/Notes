const { v4: uuidv4 } = require('uuid');
const { pool } = require('../database/pool');

const noteColumns = 'id, owner_id, title, content, is_pinned, created_at, updated_at';

const createNote = async ({ ownerId, title, content }) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO notes (id, owner_id, title, content)
     VALUES ($1, $2, $3, $4)
     RETURNING ${noteColumns}`,
    [id, ownerId, title, content]
  );

  return result.rows[0];
};

const findNoteById = async (id) => {
  const result = await pool.query(
    `SELECT ${noteColumns}
     FROM notes
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

const findAccessibleNotes = async ({ userId, limit, offset }) => {
  const notesResult = await pool.query(
    `SELECT DISTINCT n.${noteColumns.replaceAll(', ', ', n.')}
     FROM notes n
     LEFT JOIN note_shares ns ON ns.note_id = n.id
     WHERE n.owner_id = $1 OR ns.shared_with_user_id = $1
     ORDER BY n.is_pinned DESC, n.updated_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(DISTINCT n.id)::int AS total
     FROM notes n
     LEFT JOIN note_shares ns ON ns.note_id = n.id
     WHERE n.owner_id = $1 OR ns.shared_with_user_id = $1`,
    [userId]
  );

  return {
    notes: notesResult.rows,
    total: countResult.rows[0].total
  };
};

const hasNoteAccess = async ({ noteId, userId }) => {
  const result = await pool.query(
    `SELECT EXISTS (
       SELECT 1
       FROM notes n
       LEFT JOIN note_shares ns ON ns.note_id = n.id
       WHERE n.id = $1
         AND (n.owner_id = $2 OR ns.shared_with_user_id = $2)
     ) AS has_access`,
    [noteId, userId]
  );

  return result.rows[0].has_access;
};

const updateNote = async ({ id, title, content }) => {
  const result = await pool.query(
    `UPDATE notes
     SET title = COALESCE($2, title),
         content = COALESCE($3, content),
         updated_at = NOW()
     WHERE id = $1
     RETURNING ${noteColumns}`,
    [id, title, content]
  );

  return result.rows[0] || null;
};

const deleteNote = async (id) => {
  await pool.query('DELETE FROM notes WHERE id = $1', [id]);
};

const toggleNotePin = async ({ id, isPinned }) => {
  const result = await pool.query(
    `UPDATE notes
     SET is_pinned = $2,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, content, is_pinned`,
    [id, isPinned]
  );

  return result.rows[0] || null;
};

const searchAccessibleNotes = async ({ userId, query }) => {
  const term = `%${query}%`;
  const result = await pool.query(
    `SELECT DISTINCT n.${noteColumns.replaceAll(', ', ', n.')}
     FROM notes n
     LEFT JOIN note_shares ns ON ns.note_id = n.id
     WHERE (n.owner_id = $1 OR ns.shared_with_user_id = $1)
       AND (n.title ILIKE $2 OR n.content ILIKE $2)
     ORDER BY n.is_pinned DESC, n.updated_at DESC`,
    [userId, term]
  );

  return result.rows;
};

module.exports = {
  createNote,
  findNoteById,
  findAccessibleNotes,
  hasNoteAccess,
  updateNote,
  deleteNote,
  toggleNotePin,
  searchAccessibleNotes
};
