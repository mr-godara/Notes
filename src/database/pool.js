const { Pool } = require('pg');
const { env } = require('../config/env');

const shouldUseSsl = () => {
  if (env.databaseSsl === 'true') {
    return true;
  }

  if (env.databaseSsl === 'false') {
    return env.nodeEnv === 'production';
  }

  if (env.nodeEnv === 'production' || env.databaseUrl.includes('sslmode=require')) {
    return true;
  }

  try {
    const { hostname } = new URL(env.databaseUrl);
    return !['localhost', '127.0.0.1', 'postgres'].includes(hostname);
  } catch (error) {
    return false;
  }
};

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: shouldUseSsl()
    ? { rejectUnauthorized: false }
    : false
});

module.exports = { pool };
