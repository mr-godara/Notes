const express = require('express');
const AboutController = require('../controllers/about.controller');

const router = express.Router();

/**
 * @openapi
 * /about:
 *   get:
 *     summary: About this API
 *     description: Returns project owner information and custom feature details.
 *     tags:
 *       - About
 *     responses:
 *       '200':
 *         description: About metadata.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AboutResponse'
 *             examples:
 *               about:
 *                 value:
 *                   name: Amit Godara
 *                   email: your-email@example.com
 *                   my_features:
 *                     note_pinning: Allows users to pin important notes for quick access.
 */
router.get('/about', AboutController.getAbout);

module.exports = router;
