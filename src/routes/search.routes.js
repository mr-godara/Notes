const express = require('express');
const SearchController = require('../controllers/search.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { asyncHandler } = require('../utils/asyncHandler');
const { searchSchema } = require('../schemas/note.schemas');

const router = express.Router();

/**
 * @openapi
 * /search:
 *   get:
 *     summary: Search accessible notes
 *     description: Performs a case-insensitive search across title and content for notes owned by or shared with the authenticated user.
 *     tags:
 *       - Search
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Search keyword.
 *         example: launch
 *     responses:
 *       '200':
 *         description: Matching notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       '400':
 *         description: Missing or invalid search query.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/search', authenticate, validate(searchSchema, 'query'), asyncHandler(SearchController.searchNotes));

module.exports = router;
