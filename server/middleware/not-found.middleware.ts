import { Request, Response } from 'express';

export const apiNotFound = (req: Request, res: Response) => {
  return res.status(404).json({
    status: 'error',
    message: `Không tìm thấy API: ${req.method} ${req.originalUrl}`,
    code: 'ROUTE_NOT_FOUND',
    details: null,
  });
};
