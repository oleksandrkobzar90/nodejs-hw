import { Note } from '../models/Note.js';
import createHttpError from 'http-errors';

// Кореневий маршрут (контролер) до всіх нотаток
export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

// Кореневий маршрут (контролер) до конкретної нотатки за id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};

// Post контролер
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

// DELETE контролер
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};

// PATCH контролер
export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate(
    { _id: noteId }, // Шукаємо по id
    req.body,
    { returnDocument: 'after' }, //повертаэмо оновлений документ
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};
