const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { asyncHandler } = require('../utils/asyncHandler');
const { registerSchema, loginSchema } = require('../schemas/auth.schemas');

const router = express.Router();

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a user account with a unique email and a bcrypt hashed password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             valid:
 *               value:
 *                 email: user@example.com
 *                 password: secret123
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             examples:
 *               success:
 *                 value:
 *                   message: User registered successfully
 *       '400':
 *         description: Invalid payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               duplicate:
 *                 value:
 *                   message: Email already exists
 */
router.post('/register', validate(registerSchema), asyncHandler(AuthController.register));

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login
 *     description: Authenticates a user and returns a JWT access token valid for 24 hours.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             valid:
 *               value:
 *                 email: user@example.com
 *                 password: secret123
 *     responses:
 *       '200':
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       '400':
 *         description: Invalid payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidCredentials:
 *                 value:
 *                   message: Invalid email or password
 */
router.post('/login', validate(loginSchema), asyncHandler(AuthController.login));

module.exports = router;
