import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { setupSwagger } from './docs/swagger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { sanitizeNoSql } from './middleware/sanitizeMiddleware.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

export const createApp = (): Express => {
  const app = express();

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows client to load uploaded images
    })
  );

  // CORS configuration
  const allowedOrigins = [
    ENV.CLIENT_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Allow all in dev mode for flexibility
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Request logger
  if (ENV.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Input sanitization against NoSQL injection
  app.use(sanitizeNoSql);

  // Rate limiting for general API calls
  app.use('/api', generalLimiter);

  // Static directory for uploaded project images & resumes
  app.use('/uploads', express.static(ENV.UPLOAD_DIR));

  // Swagger Documentation UI
  setupSwagger(app);

  // Mount API routes
  app.use('/api', apiRouter);

  // Root welcome route
  app.get('/', (req, res) => {
    res.json({
      name: 'Developer Portfolio REST API',
      status: 'active',
      docs: '/api-docs',
      health: '/api/health',
    });
  });

  // 404 Handler
  app.use(notFoundHandler);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
