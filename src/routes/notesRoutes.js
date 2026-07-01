import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';
import { celebrate } from 'celebrate';
import {
  createNoteSchema,
  getAllNotesSchema,
  noteIdParamSchema,
  updateNoteSchema,
} from '../validations/noteValidation.js';

const router = Router();

// Кореневий маршрут до всіх нотаток
router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

// Кореневий маршрут до конкретної нотатки за id
router.get('/notes/:noteId', celebrate(noteIdParamSchema), getNoteById);

// Post маршрут
router.post('/notes', celebrate(createNoteSchema), createNote);

// DELETE маршрут
router.delete('/notes/:noteId', celebrate(noteIdParamSchema), deleteNote);

// PATCH маршрут
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;
