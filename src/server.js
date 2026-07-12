import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middleware для захисту від базових хакерських атак
app.use(helmet());

// Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT ?? 3000;

// Глобальні Middleware налаштування
app.use(logger); // 1. Логер першим — бачить усі запити
app.use(express.json()); // 2. Парсинг JSON-тіла
app.use(cors()); // 3. Дозвіл для запитів з інших доменів
app.use(cookieParser()); // 4. Парсер кукі

// Група маршрутів
app.use(authRoutes);
app.use(notesRoutes);
app.use(userRoutes);

// Маршрут для імітації middleware помилки
app.get('/test-error', (req, res) => {
  throw new Error('Simulated server error');
});

// Middleware 404 (після всіх маршрутів)
app.use(notFoundHandler);

// Middleware від celebrate (валідація)
app.use(errors());

// Middleware для обробки помилок (останнє)
app.use(errorHandler);

// Підключення до MongoDB
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
