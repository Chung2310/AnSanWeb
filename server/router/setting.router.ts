import { Router } from 'express';
import { SettingController } from '../controller/setting.controller.ts';
import { validateRequest } from '../middleware/validation.middleware.ts';
import { settingCreateSchema } from '../validation/setting.validation.ts';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/', SettingController.getList);
router.get('/:key', SettingController.getByKey);
router.post(
  '/',
  authenticateJWT,
  requireAdmin,
  validateRequest(settingCreateSchema, 'body'),
  SettingController.upsert
);

export default router;
