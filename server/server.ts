import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { assertSecurityEnv } from './config/env.ts';
import { connectDB } from './config/database.ts';
import { apiRouter } from './router/index.ts';
import { swaggerRouter } from './swagger/index.ts';

const PORT = process.env.BACKEND_PORT ? parseInt(process.env.BACKEND_PORT, 10) : 3001;

async function startServer() {
  // 1. Validate environment variables
  try {
    assertSecurityEnv();
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }

  // 2. Connect to MongoDB
  await connectDB();

  const app = express();

  // 3. Security Middlewares
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
  }));
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 4. CORS configuration
  const allowedOrigins = process.env.LINK_COR
    ? process.env.LINK_COR.split(',')
    : ['http://localhost:3000', 'http://localhost:9002', 'http://localhost:3006'];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Chặn bởi cấu hình CORS của Backend.'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
      exposedHeaders: ['Content-Range', 'Content-Length', 'Accept-Ranges'],
    })
  );

  // 5. Register Swagger Documentation
  app.use('/api-docs', swaggerRouter);

  // 6. Request Logger
  app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString('vi-VN');
    console.log(`[Server ${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    next();
  });

  // 7. Register API routes with prefix /api/v1/
  app.use('/api/v1', apiRouter);

  // 8. Global Error Handler
  app.use((err: any, req: express.Request, res: Response, next: express.NextFunction) => {
    console.error('❌ Lỗi hệ thống:', err);
    res.status(500).json({
      status: 'error',
      message: 'Có lỗi xảy ra trên hệ thống server.',
      error: process.env.NODE_ENV === 'production' ? {} : err.message,
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AnSanWeb Express Backend running on http://localhost:${PORT}`);
    console.log(`📖 Swagger API Docs available at http://localhost:${PORT}/api-docs`);
  });
}

startServer().catch((error) => {
  console.error('❌ Lỗi khởi chạy server:', error);
  process.exit(1);
});
