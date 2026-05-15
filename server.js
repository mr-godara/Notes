const app = require('./app');
const { env } = require('./src/config/env');
const { initializeDatabase } = require('./src/database/init');
const { pool } = require('./src/database/pool');

const startServer = async () => {
  try {
    await initializeDatabase();

    const server = app.listen(env.port, () => {
      console.log(`Notes API running on port ${env.port}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Closing server.`);
      server.close(async () => {
        await pool.end();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start Notes API:', error.message);
    process.exit(1);
  }
};

startServer();
