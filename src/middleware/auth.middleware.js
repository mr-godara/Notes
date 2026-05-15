const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { AppError } = require('../utils/AppError');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError(401, 'Authorization token is required'));
  }

  const parts = authHeader.split(' ');
  const [scheme, token] = parts;

  if (parts.length !== 2 || scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'Authorization header must use Bearer token format'));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = { userId: decoded.userId };
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError(401, 'Token expired'));
    }

    return next(new AppError(401, 'Invalid token'));
  }
};

module.exports = { authenticate };
