const { AppError } = require('../utils/AppError');

const errorHandler = (error, req, res, next) => {
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS origin is not allowed' });
  }

  if (error instanceof AppError) {
    const response = { message: error.message };

    if (error.errors) {
      response.errors = error.errors;
    }

    return res.status(error.statusCode).json(response);
  }

  if (error.code === '23505') {
    return res.status(409).json({ message: 'Duplicate data conflict' });
  }

  return res.status(500).json({ message: 'Internal server error' });
};

module.exports = { errorHandler };
