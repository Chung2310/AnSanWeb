import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '../controller/upload.controller.ts';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.ts';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // limit 10MB
  },
});

router.post('/', authenticateJWT, requireAdmin, upload.single('image'), UploadController.uploadImage);

export default router;
