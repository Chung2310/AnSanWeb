import { Request, Response } from 'express';
import { UserService } from '../service/user.service.ts';
import { IAuthRequest } from '../middleware/auth.middleware.ts';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await UserService.register(req.body);
      return res.status(201).json({
        status: 'success',
        message: 'Đăng ký tài khoản thành công.',
        data: user,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Đăng ký tài khoản thất bại.',
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { user, accessToken, refreshToken } = await UserService.login(req.body);
      
      // Set Refresh Token in Cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({
        status: 'success',
        message: 'Đăng nhập thành công.',
        accessToken,
        data: user,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Đăng nhập thất bại.',
      });
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(200).json({
      status: 'success',
      message: 'Đăng xuất thành công.',
    });
  }

  static async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Không tìm thấy mã làm mới (Refresh Token).',
      });
    }

    try {
      const result = await UserService.refresh(refreshToken);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        status: 'success',
        accessToken: result.accessToken,
        data: result.user,
      });
    } catch (error: any) {
      return res.status(401).json({
        status: 'error',
        message: error.message || 'Làm mới phiên đăng nhập thất bại.',
      });
    }
  }

  static async getMe(req: IAuthRequest, res: Response) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 'error',
        message: 'Chưa đăng nhập.',
      });
    }

    try {
      const user = await UserService.getMe(req.user.id);
      return res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error: any) {
      return res.status(404).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}
