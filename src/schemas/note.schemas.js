const Joi = require('joi');

const uuidSchema = Joi.string().uuid({ version: ['uuidv4', 'uuidv5'] });

const noteIdParamSchema = Joi.object({
  id: uuidSchema.required()
});

const createNoteSchema = Joi.object({
  title: Joi.string().trim().min(1).max(500).required(),
  content: Joi.string().allow('').max(100000).required()
});

const updateNoteSchema = Joi.object({
  title: Joi.string().trim().min(1).max(500),
  content: Joi.string().allow('').max(100000)
}).min(1);

const shareNoteSchema = Joi.object({
  share_with_email: Joi.string().email().lowercase().trim().required()
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

const searchSchema = Joi.object({
  q: Joi.string().trim().min(1).max(500).required()
});

module.exports = {
  noteIdParamSchema,
  createNoteSchema,
  updateNoteSchema,
  shareNoteSchema,
  paginationSchema,
  searchSchema
};
