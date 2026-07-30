import { Request, Response } from 'express';
import { CloudinaryService } from '../service/cloudinary.service.ts';

export class UploadController {
  static async uploadImage(req: Request, res: Response) {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        status: 'error',
        message: 'Không tìm thấy tệp tải lên.',
      });
    }

    try {
      const folder = req.body.folder || 'general';
      const cloudinaryUrl = await CloudinaryService.uploadBuffer(
        file.buffer,
        file.originalname,
        folder
      );

      return res.status(200).json({
        status: 'success',
        url: cloudinaryUrl,
        path: `cloudinary://${folder}/${file.originalname}`,
      });
    } catch (error: any) {
      console.error('❌ Upload to Cloudinary error:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Lỗi tải tệp lên Cloudinary.',
      });
    }
  }
}
