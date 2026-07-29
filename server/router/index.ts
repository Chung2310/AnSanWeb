import { Router } from 'express';
import mongoose from 'mongoose';
import authRouter from './auth.router.ts';
import categoryRouter from './category.router.ts';
import productRouter from './product.router.ts';
import blogPostRouter from './blog-post.router.ts';
import contactRouter from './contact.router.ts';
import subscriptionRouter from './subscription.router.ts';
import settingRouter from './setting.router.ts';
import uploadRouter from './upload.router.ts';

export const apiRouter = Router();

// Health Check API
apiRouter.get('/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  if (dbConnected) {
    return res.status(200).json({
      status: 'ok',
      service: 'ansanweb-backend',
      database: 'connected',
    });
  } else {
    return res.status(503).json({
      status: 'error',
      service: 'ansanweb-backend',
      database: 'disconnected',
    });
  }
});

// Register routes
apiRouter.use('/auth', authRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/blog-posts', blogPostRouter);
apiRouter.use('/contacts', contactRouter);
apiRouter.use('/subscriptions', subscriptionRouter);
apiRouter.use('/settings', settingRouter);
apiRouter.use('/upload', uploadRouter);
