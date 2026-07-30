import { Request, Response } from 'express';
import { ProductService } from '../service/product.service.ts';

export class ProductController {
  static async create(req: Request, res: Response) {
    try {
      const product = await ProductService.create(req.body);
      return res.status(201).json({
        status: 'success',
        data: product,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Tạo sản phẩm thất bại.',
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const product = await ProductService.update(String(req.params.id), req.body);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy sản phẩm.',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: product,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Cập nhật sản phẩm thất bại.',
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const product = await ProductService.delete(String(req.params.id));
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy sản phẩm để xóa.',
        });
      }
      return res.status(200).json({
        status: 'success',
        message: 'Xóa sản phẩm thành công.',
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Xóa sản phẩm thất bại.',
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const product = await ProductService.getById(String(req.params.id));
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy sản phẩm.',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: product,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  static async getBySlug(req: Request, res: Response) {
    try {
      const product = await ProductService.getBySlug(String(req.params.slug));
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy sản phẩm với slug tương ứng.',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: product,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  static async getList(req: Request, res: Response) {
    try {
      const result = await ProductService.getList(req.query);
      return res.status(200).json({
        status: 'success',
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  static async bulkUpsert(req: Request, res: Response) {
    try {
      const result = await ProductService.bulkUpsert(req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Import hàng loạt sản phẩm thành công.',
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Import sản phẩm thất bại.',
      });
    }
  }
}
