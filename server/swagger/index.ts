import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { authSwagger } from './auth.swagger.ts';
import { categorySwagger } from './category.swagger.ts';
import { productSwagger } from './product.swagger.ts';
import { blogPostSwagger } from './blog-post.swagger.ts';
import { contactSwagger } from './contact.swagger.ts';
import { subscriptionSwagger } from './subscription.swagger.ts';
import { settingSwagger } from './setting.swagger.ts';
import { uploadSwagger } from './upload.swagger.ts';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'AnSanWeb Backend API Docs',
    version: '1.0.0',
    description: 'Tài liệu API Swagger phục vụ dự án AnSanWeb.',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Cơ sở phục vụ cục bộ (Local Backend)',
    },
  ],
  paths: {
    ...authSwagger.paths,
    ...categorySwagger.paths,
    ...productSwagger.paths,
    ...blogPostSwagger.paths,
    ...contactSwagger.paths,
    ...subscriptionSwagger.paths,
    ...settingSwagger.paths,
    ...uploadSwagger.paths,
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Nhập Access Token vào đây dạng: eyJhbG...',
      },
    },
  },
};

export const swaggerRouter = Router();

swaggerRouter.use('/', swaggerUi.serve as any, swaggerUi.setup(swaggerDocument) as any);
