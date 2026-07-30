import { Request, Response } from 'express';
import { CategoryService } from '../service/category.service.ts';

export class CategoryController {
  static async create(req: Request, res: Response) {
    try {
      const category = await CategoryService.create(req.body);
      return res.status(201).json({
        status: 'success',
        data: category,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Tạo danh mục thất bại.',
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const category = await CategoryService.update(String(req.params.id), req.body);
      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy danh mục.',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: category,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Cập nhật danh mục thất bại.',
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const category = await CategoryService.delete(String(req.params.id));
      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy danh mục để xóa.',
        });
      }
      return res.status(200).json({
        status: 'success',
        message: 'Xóa danh mục thành công.',
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Xóa danh mục thất bại.',
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const category = await CategoryService.getById(String(req.params.id));
      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy danh mục.',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: category,
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
      const category = await CategoryService.getBySlug(String(req.params.slug));
      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy danh mục với slug tương ứng.',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: category,
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
      const result = await CategoryService.getList(req.query);
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
      const result = await CategoryService.bulkUpsert(req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Import hàng loạt danh mục thành công.',
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Import danh mục thất bại.',
      });
    }
  }
}
