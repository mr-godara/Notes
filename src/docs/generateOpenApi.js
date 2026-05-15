process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://notes_user:notes_password@localhost:5432/notes_db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'openapi-generation-secret';
process.env.API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

const { writeOpenApiSpec } = require('../config/swagger');

writeOpenApiSpec();
console.log('openapi.json generated successfully');
