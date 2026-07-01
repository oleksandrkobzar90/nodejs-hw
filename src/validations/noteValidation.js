import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

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
      .valid(
        'Work',
        'Personal',
        'Meeting',
        'Shopping',
        'Ideas',
        'Travel',
        'Finance',
        'Health',
        'Important',
        'Todo',
      )
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
export const noteIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

// Схема для PATCH
export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    notesId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(30),
    age: Joi.number().integer().min(12).max(65),
    gender: Joi.string().valid('male', 'female', 'other'),
    avgMark: Joi.number().min(2).max(12),
    onDuty: Joi.boolean(),
  }).min(1), // важливо: не дозволяємо порожнє тіло
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
  }),
};
