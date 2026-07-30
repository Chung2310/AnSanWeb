import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI không được khai báo trong biến môi trường.');
    process.exit(1);
  }

  const options: mongoose.ConnectOptions = {};

  if (process.env.MONGODB_DB_NAME) {
    options.dbName = process.env.MONGODB_DB_NAME;
  }

  if (process.env.MONGODB_USER && process.env.MONGODB_USER.trim() !== '') {
    options.user = process.env.MONGODB_USER.trim();
  }

  if (process.env.MONGODB_PASSWORD && process.env.MONGODB_PASSWORD.trim() !== '') {
    options.pass = process.env.MONGODB_PASSWORD.trim();
  }

  if (process.env.MONGODB_AUTH_SOURCE && process.env.MONGODB_AUTH_SOURCE.trim() !== '') {
    options.authSource = process.env.MONGODB_AUTH_SOURCE.trim();
  }

  try {
    console.log('⏳ Đang kết nối tới cơ sở dữ liệu MongoDB...');
    await mongoose.connect(uri, options);
    console.log(`✅ Kết nối MongoDB thành công tới database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    process.exit(1);
  }
}
