import { Router } from 'express';
import { SubscriptionController } from '../controller/subscription.controller.ts';
import { validateRequest } from '../middleware/validation.middleware.ts';
import { subscriptionCreateSchema } from '../validation/subscription.validation.ts';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.ts';

const router = Router();

router.post('/', validateRequest(subscriptionCreateSchema, 'body'), SubscriptionController.create);
router.get('/', authenticateJWT, requireAdmin, SubscriptionController.getList);

export default router;
