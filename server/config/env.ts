import dotenv from 'dotenv';
dotenv.config();

export function assertSecurityEnv() {
  const requiredEnv = [
    'MONGODB_URI',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  const missing = requiredEnv.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Lỗi khởi động: Thiếu các biến môi trường bắt buộc sau: ${missing.join(', ')}`
    );
  }
}
