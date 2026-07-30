import cloudinary from '../config/cloudinary.ts';
import * as path from 'path';

export class CloudinaryService {
  static async uploadBuffer(buffer: Buffer, originalName: string, folder: string): Promise<string> {
    const publicId = path.parse(originalName).name.replace(/[^a-zA-Z0-9]/g, '_');
    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `ansanweb/${folder}`,
          public_id: `${Date.now()}_${publicId}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Tải lên Cloudinary thất bại.'));
          }
        }
      );
      uploadStream.end(buffer);
    });
  }

  static async deleteByUrl(url: string): Promise<void> {
    try {
      // Extract public_id from Cloudinary secure URL
      // E.g. https://res.cloudinary.com/<cloud_name>/image/upload/v12345/ansanweb/products/image.jpg
      const matches = url.match(/\/ansanweb\/(.+)$/);
      if (matches && matches[0]) {
        const fullPublicId = matches[0].replace(path.extname(matches[0]), ''); // remove extension
        // strip leading slash
        const cleanedId = fullPublicId.startsWith('/') ? fullPublicId.substring(1) : fullPublicId;
        console.log(`⏳ Deleting from Cloudinary: ${cleanedId}...`);
        await cloudinary.uploader.destroy(cleanedId);
      }
    } catch (error) {
      console.error('❌ Lỗi xóa ảnh trên Cloudinary:', error);
    }
  }
}
