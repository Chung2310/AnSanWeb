import { Router } from 'express';
import { BlogPostController } from '../controller/blog-post.controller.ts';
import { validateRequest } from '../middleware/validation.middleware.ts';
import { blogPostCreateSchema, blogPostUpdateSchema } from '../validation/blog-post.validation.ts';
import { idParamValidation } from '../validation/id.validation.ts';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/', BlogPostController.getList);
router.get('/:id', validateRequest(idParamValidation, 'params'), BlogPostController.getById);
router.get('/slug/:slug', BlogPostController.getBySlug);

router.post(
  '/bulk',
  authenticateJWT,
  requireAdmin,
  BlogPostController.bulkUpsert
);

router.post(
  '/',
  authenticateJWT,
  requireAdmin,
  validateRequest(blogPostCreateSchema, 'body'),
  BlogPostController.create
);

router.put(
  '/:id',
  authenticateJWT,
  requireAdmin,
  validateRequest(idParamValidation, 'params'),
  validateRequest(blogPostUpdateSchema, 'body'),
  BlogPostController.update
);

router.delete(
  '/:id',
  authenticateJWT,
  requireAdmin,
  validateRequest(idParamValidation, 'params'),
  BlogPostController.delete
);

export default router;
