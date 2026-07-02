import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Схема для POST
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(30).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least {#limit} characters',
      'string.max': 'Title should have at most {#limit} characters',
      'any.required': 'Title is required',
    }),
    content: Joi.string().max(50).default('').messages({
      'string.base': 'Content must be a string',
      'string.min': 'Content must be at least {#limit}',
      'string.max': 'Content must be at most {#limit}',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .default('Todo')
      .messages({
        'any.only':
          'Tag must be one of: Work, Personal, Meeting, Shopping, Ideas, Travel, Finance, Health, Important, Todo,',
      }),
  }),
};

// Кастомний валідатор для ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// Схема для GET by Id та DELETE by Id
// Схема для перевірки параметра noteId
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

// Схема для PATCH
export const updateNoteSchema = {
  ...noteIdSchema,
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(30).messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least {#limit} characters',
      'string.max': 'Title should have at most {#limit} characters',
    }),
    content: Joi.string().max(50).messages({
      'string.base': 'Content must be a string',
      'string.min': 'Content must be at least {#limit}',
      'string.max': 'Content must be at most {#limit}',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .default('Todo')
      .messages({
        'any.only':
          'Tag must be one of: Work, Personal, Meeting, Shopping, Ideas, Travel, Finance, Health, Important, Todo,',
      }),
  })
    .min(1)
    .messages({
      'object.min':
        'At least one field (title, content or tag) must be provided',
    }),
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().trim().allow(''),
  }),
};
