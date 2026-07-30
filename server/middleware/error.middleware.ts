import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from './app-error.ts';

function normalizeError(error: any) {
  if (error instanceof AppError) return error;
  if (error?.code === 11000) return new AppError(409, 'Dữ liệu đã tồn tại.', 'DUPLICATE_RESOURCE', error.keyValue);
  if (error instanceof mongoose.Error.ValidationError) {
    return new AppError(400, 'Dữ liệu không hợp lệ.', 'VALIDATION_ERROR', Object.values(error.errors).map((item) => item.message));
  }
  if (error instanceof mongoose.Error.CastError) {
    return new AppError(400, 'Tham số yêu cầu không hợp lệ.', 'INVALID_PARAMETER', { path: error.path, value: error.value });
  }
  return new AppError(500, 'Có lỗi xảy ra trên máy chủ.', 'INTERNAL_SERVER_ERROR');
}

export const errorMiddleware: ErrorRequestHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (res.headersSent) return;
  const normalized = normalizeError(error);
  if (normalized.statusCode >= 500) console.error('❌ Unhandled API error:', error);
  const response: Record<string, unknown> = {
    status: 'error', message: normalized.message, code: normalized.code, details: normalized.details ?? null,
  };
  if (process.env.NODE_ENV !== 'production' && error?.stack) response.stack = error.stack;
  return res.status(normalized.statusCode).json(response);
};
