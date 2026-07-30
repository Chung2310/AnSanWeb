import { Request, Response } from 'express';
import { SettingService } from '../service/setting.service.ts';

export class SettingController {
  static async upsert(req: Request, res: Response) {
    const { key, value } = req.body;
    try {
      const setting = await SettingService.upsert(key, value);
      return res.status(200).json({
        status: 'success',
        data: setting,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Lưu cài đặt thất bại.',
      });
    }
  }

  static async getByKey(req: Request, res: Response) {
    try {
      const setting = await SettingService.getByKey(String(req.params.key));
      if (!setting) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy cài đặt này.',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: setting,
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
      const settings = await SettingService.getList();
      return res.status(200).json({
        status: 'success',
        data: settings,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}
