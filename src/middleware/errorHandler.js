// Middleware для обробки помилок (останнє)
import { isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error('Error Middleware:', err);

  const isProd = process.env.NODE_ENV === 'production';

  // Якщо помилка створена через http-errors
  if (isHttpError(err)) {
    return res.status(err.status).json({
      message: err.message || err.name,
    });
  }

  // Усі інші помилки — як внутрішні
  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
};
