import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// Кореневий маршрут (контролер) до всіх нотаток
export const getAllNotes = async (req, res) => {
  // Отримання параметрів пагінації та задавання дефолтних значень
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;
  // Базовий запит
  const notesQuery = Note.find({ userId: req.user._id });

  //Фільтрація за tag
  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  // Пошук за текстом
  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  // Обчислення загальної кількості сторінок
  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({ page, perPage, totalNotes, totalPages, notes });
};

// Кореневий маршрут (контролер) до конкретної нотатки за id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};

// Post контролер
export const createNote = async (req, res) => {
  const note = await Note.create({ ...req.body, userId: req.user._id });
  res.status(201).json(note);
};

// DELETE контролер
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
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
    { _id: noteId, userId: req.user._id }, // Шукаємо по id
    req.body,
    { returnDocument: 'after' }, //повертаємо оновлений документ
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};
