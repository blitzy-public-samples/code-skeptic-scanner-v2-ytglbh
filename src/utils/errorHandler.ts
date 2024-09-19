import { Request, Response, NextFunction } from 'express';
import logger from './logger';

// Custom error class for application-specific errors
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Express middleware for handling errors globally
const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error using the logger
  logger.error('Error:', err);

  // Determine if the error is operational or a programming error
  const isOperationalError = err instanceof AppError;

  // Set the appropriate status code
  const statusCode = isOperationalError ? (err as AppError).statusCode : 500;

  // Prepare the error response object
  const errorResponse = {
    status: 'error',
    message: isOperationalError ? err.message : 'Internal Server Error',
  };

  // In development, include the error stack in the response
  if (process.env.NODE_ENV === 'development') {
    errorResponse['stack'] = err.stack;
  }

  // Send the error response to the client
  res.status(statusCode).json(errorResponse);
};

// Wrapper for async route handlers to catch and forward errors to the global error handler
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export { AppError, globalErrorHandler, asyncHandler };

// Human tasks:
// TODO: Review and update error codes and messages to ensure they are clear and informative
// TODO: Implement specific error handling for different types of errors (e.g., validation errors, database errors)
// TODO: Develop a mechanism for error reporting and monitoring in production
// TODO: Create utility functions for common error scenarios in the Code Skeptic Scanner system
// TODO: Implement error boundary components for the frontend to handle and display errors gracefully
// TODO: Develop a system for translating error messages to support internationalization