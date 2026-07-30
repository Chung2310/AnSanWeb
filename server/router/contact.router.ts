import { Router } from 'express';
import { ContactController } from '../controller/contact.controller.ts';
import { validateRequest } from '../middleware/validation.middleware.ts';
import { contactCreateSchema } from '../validation/contact.validation.ts';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.ts';

const router = Router();

router.post('/', validateRequest(contactCreateSchema, 'body'), ContactController.create);
router.get('/', authenticateJWT, requireAdmin, ContactController.getList);

export default router;
