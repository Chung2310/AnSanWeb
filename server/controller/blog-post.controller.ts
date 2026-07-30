import { Request, Response } from 'express';
import { BlogPostService } from '../service/blog-post.service.ts';

export class BlogPostController {
  static async create(req: Request, res: Response) {
    try {
      const post = await BlogPostService.create(req.body);
      return res.status(201).json({
        status: 'success',
        data: post,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Tạo bài viết thất bại.',
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const post = await BlogPostService.update(String(req.params.id), req.body);
      if (!post) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy bài viết.',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: post,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Cập nhật bài viết thất bại.',
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const post = await BlogPostService.delete(String(req.params.id));
      if (!post) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy bài viết để xóa.',
        });
      }
      return res.status(200).json({
        status: 'success',
        message: 'Xóa bài viết thành công.',
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Xóa bài viết thất bại.',
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const post = await BlogPostService.getById(String(req.params.id));
      if (!post) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy bài viết.',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: post,
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
      const post = await BlogPostService.getBySlug(String(req.params.slug));
      if (!post) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy bài viết với slug tương ứng.',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: post,
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
      const result = await BlogPostService.getList(req.query);
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
      const result = await BlogPostService.bulkUpsert(req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Import hàng loạt bài viết thành công.',
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Import bài viết thất bại.',
      });
    }
  }
}
