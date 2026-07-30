import { Router } from 'express';
import { AuthController } from '../controller/auth.controller.ts';
import { validateRequest } from '../middleware/validation.middleware.ts';
import { loginSchema, registerSchema } from '../validation/auth.validation.ts';
import { authenticateJWT } from '../middleware/auth.middleware.ts';

const router = Router();

router.post('/register', validateRequest(registerSchema, 'body'), AuthController.register);
router.post('/login', validateRequest(loginSchema, 'body'), AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh', AuthController.refresh);
router.get('/me', authenticateJWT, AuthController.getMe);

export default router;
