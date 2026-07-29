import { Router } from 'express';
import { CategoryController } from '../controller/category.controller.ts';
import { validateRequest } from '../middleware/validation.middleware.ts';
import { categoryCreateSchema, categoryUpdateSchema } from '../validation/category.validation.ts';
import { idParamValidation } from '../validation/id.validation.ts';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/', CategoryController.getList);
router.get('/:id', validateRequest(idParamValidation, 'params'), CategoryController.getById);
router.get('/slug/:slug', CategoryController.getBySlug);

router.post(
  '/bulk',
  authenticateJWT,
  requireAdmin,
  CategoryController.bulkUpsert
);

router.post(
  '/',
  authenticateJWT,
  requireAdmin,
  validateRequest(categoryCreateSchema, 'body'),
  CategoryController.create
);

router.put(
  '/:id',
  authenticateJWT,
  requireAdmin,
  validateRequest(idParamValidation, 'params'),
  validateRequest(categoryUpdateSchema, 'body'),
  CategoryController.update
);

router.delete(
  '/:id',
  authenticateJWT,
  requireAdmin,
  validateRequest(idParamValidation, 'params'),
  CategoryController.delete
);

export default router;
