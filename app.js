const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const { swaggerSpec, writeOpenApiSpec } = require('./src/config/swagger');
const authRoutes = require('./src/routes/auth.routes');
const noteRoutes = require('./src/routes/note.routes');
const searchRoutes = require('./src/routes/search.routes');
const aboutRoutes = require('./src/routes/about.routes');
const { notFoundHandler } = require('./src/middleware/notFound.middleware');
const { errorHandler } = require('./src/middleware/error.middleware');
const { getCorsOptions } = require('./src/config/cors');

writeOpenApiSpec();

const app = express();

app.use(helmet());
app.use(cors(getCorsOptions()));
app.use(express.json({ limit: '1mb' }));

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check
 *     description: Confirms the Notes API is running.
 *     tags:
 *       - Health
 *     responses:
 *       '200':
 *         description: API is healthy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Notes API running
 */
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Notes API running'
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'Notes API Docs'
}));

/**
 * @openapi
 * /openapi.json:
 *   get:
 *     summary: Raw OpenAPI specification
 *     description: Returns the generated OpenAPI 3.0 JSON document.
 *     tags:
 *       - Health
 *     responses:
 *       '200':
 *         description: OpenAPI JSON document.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.get('/openapi.json', (req, res) => {
  res.status(200).json(swaggerSpec);
});

app.use(authRoutes);
app.use(noteRoutes);
app.use(searchRoutes);
app.use(aboutRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
