import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface IAuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'user';
  };
}

export const authenticateJWT = (req: IAuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      console.error('❌ JWT_ACCESS_SECRET is missing.');
      return res.status(500).json({
        status: 'error',
        message: 'Lỗi cấu hình hệ thống phía server.',
      });
    }

    jwt.verify(token, secret, (err: any, user: any) => {
      if (err) {
        return res.status(401).json({
          status: 'error',
          message: 'Access Token đã hết hạn hoặc không hợp lệ.',
        });
      }

      req.user = user as any;
      next();
    });
  } else {
    res.status(401).json({
      status: 'error',
      message: 'Không tìm thấy mã xác thực (Access Token).',
    });
  }
};

export const requireAdmin = (req: IAuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      status: 'error',
      message: 'Yêu cầu quyền quản trị viên (Admin).',
    });
  }
};
