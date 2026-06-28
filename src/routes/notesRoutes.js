import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

const router = Router();

// Кореневий маршрут до всіх нотаток
router.get('/notes', getAllNotes);

// Кореневий маршрут до конкретної нотатки за id
router.get('/notes/:noteId', getNoteById);

// Post маршрут
router.post('/notes', createNote);

// DELETE маршрут
router.delete('/notes/:noteId', deleteNote);

// PATCH маршрут
router.patch('/notes/:noteId', updateNote);

export default router;
