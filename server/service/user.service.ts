import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel } from '../model/user.model.ts';
import { IUser } from '../interface/user.interface.ts';

export class UserService {
  static generateAccessToken(user: IUser): string {
    const secret = process.env.JWT_ACCESS_SECRET!;
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: '15m' }
    );
  }

  static generateRefreshToken(user: IUser): string {
    const secret = process.env.JWT_REFRESH_SECRET!;
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' }
    );
  }

  static async register(data: any): Promise<IUser> {
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Email này đã được sử dụng.');
    }
    const user = new UserModel(data);
    return await user.save();
  }

  static async login(data: any): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const user = await UserModel.findOne({ email: data.email });
    if (!user) {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
    }

    const isMatch = await bcrypt.compare(data.password, user.password || '');
    if (!isMatch) {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }

  static async refresh(token: string): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const secret = process.env.JWT_REFRESH_SECRET!;
    try {
      const decoded = jwt.verify(token, secret) as any;
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        throw new Error('Không tìm thấy tài khoản tương ứng.');
      }

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return { accessToken, refreshToken, user };
    } catch (error) {
      throw new Error('Mã làm mới (Refresh Token) không hợp lệ hoặc đã hết hạn.');
    }
  }

  static async getMe(id: string): Promise<IUser> {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error('Không tìm thấy thông tin tài khoản.');
    }
    return user;
  }
}
