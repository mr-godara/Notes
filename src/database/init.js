const { pool } = require('./pool');

const initializeDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id UUID PRIMARY KEY,
        owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        is_pinned BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS note_shares (
        note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
        shared_with_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (note_id, shared_with_user_id)
      );
    `);

    await client.query('CREATE INDEX IF NOT EXISTS idx_notes_owner_id ON notes(owner_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_notes_ordering ON notes(is_pinned DESC, updated_at DESC);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_note_shares_user_id ON note_shares(shared_with_user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { initializeDatabase };
