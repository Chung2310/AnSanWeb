import { Request, Response } from 'express';
import { ContactService } from '../service/contact.service.ts';

export class ContactController {
  static async create(req: Request, res: Response) {
    try {
      const contact = await ContactService.create(req.body);
      return res.status(201).json({
        status: 'success',
        data: contact,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Gửi liên hệ thất bại.',
      });
    }
  }

  static async getList(req: Request, res: Response) {
    try {
      const result = await ContactService.getList(req.query);
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
