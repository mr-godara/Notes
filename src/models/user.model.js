const { v4: uuidv4 } = require('uuid');
const { pool } = require('../database/pool');

const createUser = async ({ email, passwordHash }) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO users (id, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, email, created_at`,
    [id, email, passwordHash]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT id, email, password, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0] || null;
};

const findUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, email, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};
