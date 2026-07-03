import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }

  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? 'field';
    return res.status(409).json({
      success: false,
      code: 'DUPLICATE_KEY',
      message: `An account with this ${field} already exists`,
    });
  }

  if (env.isDev) {
    console.error(err);
  }

  return res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: env.isDev ? err.message : 'Something went wrong',
  });
}
