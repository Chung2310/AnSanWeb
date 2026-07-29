import { Request, Response } from 'express';
import { SubscriptionService } from '../service/subscription.service.ts';

export class SubscriptionController {
  static async create(req: Request, res: Response) {
    try {
      const sub = await SubscriptionService.create(req.body);
      return res.status(201).json({
        status: 'success',
        data: sub,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Đăng ký nhận tin thất bại.',
      });
    }
  }

  static async getList(req: Request, res: Response) {
    try {
      const result = await SubscriptionService.getList(req.query);
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
}
