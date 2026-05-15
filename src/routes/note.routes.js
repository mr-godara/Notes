const express = require('express');
const NoteController = require('../controllers/note.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { asyncHandler } = require('../utils/asyncHandler');
const {
  noteIdParamSchema,
  createNoteSchema,
  updateNoteSchema,
  shareNoteSchema,
  paginationSchema
} = require('../schemas/note.schemas');

const router = express.Router();

router.use('/notes', authenticate);

/**
 * @openapi
 * /notes:
 *   get:
 *     summary: List accessible notes
 *     description: Returns notes owned by the authenticated user or shared with the authenticated user. Pinned notes are listed first, then latest updated notes.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of notes per page.
 *     responses:
 *       '200':
 *         description: Paginated notes.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedNotesResponse'
 *       '401':
 *         description: Missing, malformed, invalid, or expired token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/notes', validate(paginationSchema, 'query'), asyncHandler(NoteController.listNotes));

/**
 * @openapi
 * /notes/{id}:
 *   get:
 *     summary: Get a note by ID
 *     description: Returns a note if the authenticated user owns it or it has been shared with them.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Note ID.
 *     responses:
 *       '200':
 *         description: Note found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: User is not authorized to access the note.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Note does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/notes/:id', validate(noteIdParamSchema, 'params'), asyncHandler(NoteController.getNote));

/**
 * @openapi
 * /notes:
 *   post:
 *     summary: Create a note
 *     description: Creates a new note owned by the authenticated user.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteCreateRequest'
 *           examples:
 *             valid:
 *               value:
 *                 title: Meeting notes
 *                 content: Discuss launch checklist and owner assignments.
 *     responses:
 *       '201':
 *         description: Note created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       '400':
 *         description: Invalid payload.
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
router.post('/notes', validate(createNoteSchema), asyncHandler(NoteController.createNote));

/**
 * @openapi
 * /notes/{id}:
 *   put:
 *     summary: Update a note
 *     description: Updates the title and/or content of a note. Only the owner can update a note.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Note ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteUpdateRequest'
 *           examples:
 *             updateTitle:
 *               value:
 *                 title: Updated title
 *             updateBoth:
 *               value:
 *                 title: Updated title
 *                 content: Updated content.
 *     responses:
 *       '200':
 *         description: Note updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       '400':
 *         description: Invalid payload.
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
 *       '403':
 *         description: User is not the note owner.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Note does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/notes/:id', validate(noteIdParamSchema, 'params'), validate(updateNoteSchema), asyncHandler(NoteController.updateNote));

/**
 * @openapi
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: Deletes a note. Only the owner can delete a note.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Note ID.
 *     responses:
 *       '204':
 *         description: Note deleted successfully.
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: User is not the note owner.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Note does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/notes/:id', validate(noteIdParamSchema, 'params'), asyncHandler(NoteController.deleteNote));

/**
 * @openapi
 * /notes/{id}/share:
 *   post:
 *     summary: Share a note
 *     description: Shares a note with another registered user by email. Only the owner can share a note.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Note ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShareNoteRequest'
 *           examples:
 *             valid:
 *               value:
 *                 share_with_email: teammate@example.com
 *     responses:
 *       '200':
 *         description: Note shared successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             examples:
 *               success:
 *                 value:
 *                   message: Note shared successfully
 *       '400':
 *         description: Invalid share request, sharing with self, or duplicate share.
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
 *       '403':
 *         description: User is not the note owner.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Note or recipient user not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/notes/:id/share', validate(noteIdParamSchema, 'params'), validate(shareNoteSchema), asyncHandler(NoteController.shareNote));

/**
 * @openapi
 * /notes/{id}/pin:
 *   patch:
 *     summary: Toggle note pinning
 *     description: Toggles the is_pinned flag for a note. Only the owner can pin or unpin a note.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Note ID.
 *     responses:
 *       '200':
 *         description: Updated pin state.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 is_pinned:
 *                   type: boolean
 *             examples:
 *               pinned:
 *                 value:
 *                   id: c1d3c0d9-0f44-45e5-9ab7-c1b5cce74db5
 *                   title: Meeting notes
 *                   content: Discuss launch checklist.
 *                   is_pinned: true
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: User is not the note owner.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Note does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/notes/:id/pin', validate(noteIdParamSchema, 'params'), asyncHandler(NoteController.togglePin));

module.exports = router;
