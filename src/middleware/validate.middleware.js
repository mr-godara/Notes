const { AppError } = require('../utils/AppError');

const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    const details = error.details.map((detail) => detail.message);
    return next(new AppError(400, 'Validation failed', details));
  }

  req[source] = value;
  return next();
};

module.exports = { validate };
