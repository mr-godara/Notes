const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const { env } = require('./env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes API',
      version: '1.0.0',
      description: 'A production-ready REST API for a multi-user notes application with authentication, sharing, pinning, search, and PostgreSQL persistence.',
      contact: {
        name: 'Amit Godara',
        email: 'your-email@example.com'
      }
    },
    servers: [
      {
        url: env.apiBaseUrl,
        description: env.nodeEnv === 'production' ? 'Production server' : 'Local development server'
      }
    ],
    tags: [
      { name: 'Health', description: 'Service health endpoints' },
      { name: 'Auth', description: 'User registration and login' },
      { name: 'Notes', description: 'Create, read, update, delete, share, and pin notes' },
      { name: 'Search', description: 'Full text note search' },
      { name: 'About', description: 'Project metadata' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: 'secret123' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', example: 'secret123' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        },
        NoteCreateRequest: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: { type: 'string', example: 'Meeting notes' },
            content: { type: 'string', example: 'Discuss launch checklist and owner assignments.' }
          }
        },
        NoteUpdateRequest: {
          type: 'object',
          minProperties: 1,
          properties: {
            title: { type: 'string', example: 'Updated meeting notes' },
            content: { type: 'string', example: 'Updated content.' }
          }
        },
        ShareNoteRequest: {
          type: 'object',
          required: ['share_with_email'],
          properties: {
            share_with_email: { type: 'string', format: 'email', example: 'teammate@example.com' }
          }
        },
        Note: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'c1d3c0d9-0f44-45e5-9ab7-c1b5cce74db5' },
            owner_id: { type: 'string', format: 'uuid', example: '45431751-9584-4de4-8d89-58f22fc5291a' },
            title: { type: 'string', example: 'Meeting notes' },
            content: { type: 'string', example: 'Discuss launch checklist and owner assignments.' },
            is_pinned: { type: 'boolean', example: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        PaginatedNotesResponse: {
          type: 'object',
          properties: {
            notes: {
              type: 'array',
              items: { $ref: '#/components/schemas/Note' }
            },
            total: { type: 'integer', example: 100 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 10 }
          }
        },
        MessageResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User registered successfully' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'array',
              items: { type: 'string' },
              example: ['email must be a valid email']
            }
          }
        },
        AboutResponse: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Amit Godara' },
            email: { type: 'string', example: 'your-email@example.com' },
            my_features: {
              type: 'object',
              properties: {
                note_pinning: {
                  type: 'string',
                  example: 'Allows users to pin important notes for quick access.'
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, '../routes/*.js'), path.join(__dirname, '../../app.js')]
};

const swaggerSpec = swaggerJsdoc(options);

const writeOpenApiSpec = () => {
  const outputPath = path.join(__dirname, '../../openapi.json');
  fs.writeFileSync(outputPath, `${JSON.stringify(swaggerSpec, null, 2)}\n`);
};

module.exports = {
  swaggerSpec,
  writeOpenApiSpec
};
