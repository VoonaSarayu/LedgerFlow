import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error Handler]:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Handle Prisma unique constraint error code or similar
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      error: 'Database constraint violation or invalid request query.',
      message: err.message,
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
  });
};
