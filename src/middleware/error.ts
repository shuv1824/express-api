import { isDevelopment } from '@/config';
import { DatabaseError } from '@/types';
import { logger } from '@/utils/logger';
import { ResponseUtil } from '@/utils/response';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error occured', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // MongoDB duplicate key error
  if (
    err.name === 'MongoServerError' &&
    (err as DatabaseError).code === 11000
  ) {
    const field =
      Object.keys((err as DatabaseError).keyPattern || {})[0] || 'field';
    ResponseUtil.conflict(
      res,
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    );
    return;
  }

  // MongoDB validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map((val: any) => ({
      field: val.path,
      message: val.message,
    }));
    ResponseUtil.validationError(res, 'Validation failed', errors);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    ResponseUtil.unauthorized(res, 'Invalid token');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    ResponseUtil.unauthorized(res, 'Token expired');
    return;
  }

  // MongoDB CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    ResponseUtil.error(res, 'Invalid ID format', 400);
    return;
  }

  // Default error response
  const message = isDevelopment ? err.message : 'Internal server error';
  const error = isDevelopment ? err.stack : undefined;

  ResponseUtil.error(res, message, 500, error);
};

// Handle 404 errors
export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseUtil.notFound(res, `Route ${req.originalUrl} not found`);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
