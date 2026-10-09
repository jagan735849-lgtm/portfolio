import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { errorResponse } from '../utils/apiResponse.js';
import { ENV } from '../config/env.js';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`Error handling ${req.method} ${req.originalUrl}:`, err.message || err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors: any = null;

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format for resource identifier '${err.value}'`;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = {};
    for (const field in err.errors) {
      errors[field] = err.errors[field].message;
    }
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const key = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${key} already exists.`;
  }

  // Don't leak stack traces in production
  const errorDetails = ENV.NODE_ENV === 'development' ? { ...errors, stack: err.stack } : errors;

  errorResponse(res, message, statusCode, errorDetails);
};
