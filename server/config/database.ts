import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'ansanweb';

  if (!uri) {
    console.error('❌ MONGODB_URI không được khai báo trong biến môi trường.');
    process.exit(1);
  }

  try {
    console.log(`⏳ Đang kết nối tới cơ sở dữ liệu MongoDB: ${dbName}...`);
    await mongoose.connect(uri, {
      dbName: dbName,
    });
    console.log('✅ Kết nối MongoDB thành công.');
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    process.exit(1);
  }
}
