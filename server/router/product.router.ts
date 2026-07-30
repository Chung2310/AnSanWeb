import { Router } from 'express';
import { ProductController } from '../controller/product.controller.ts';
import { validateRequest } from '../middleware/validation.middleware.ts';
import { productCreateSchema, productUpdateSchema } from '../validation/product.validation.ts';
import { idParamValidation } from '../validation/id.validation.ts';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/', ProductController.getList);
router.get('/:id', validateRequest(idParamValidation, 'params'), ProductController.getById);
router.get('/slug/:slug', ProductController.getBySlug);

router.post(
  '/bulk',
  authenticateJWT,
  requireAdmin,
  ProductController.bulkUpsert
);

router.post(
  '/',
  authenticateJWT,
  requireAdmin,
  validateRequest(productCreateSchema, 'body'),
  ProductController.create
);

router.put(
  '/:id',
  authenticateJWT,
  requireAdmin,
  validateRequest(idParamValidation, 'params'),
  validateRequest(productUpdateSchema, 'body'),
  ProductController.update
);

router.delete(
  '/:id',
  authenticateJWT,
  requireAdmin,
  validateRequest(idParamValidation, 'params'),
  ProductController.delete
);

export default router;
