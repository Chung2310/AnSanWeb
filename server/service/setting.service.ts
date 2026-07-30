import { SettingModel } from '../model/setting.model.ts';
import { ISetting } from '../interface/setting.interface.ts';

export class SettingService {
  static async upsert(key: string, value: any): Promise<ISetting> {
    return (await SettingModel.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    )) as ISetting;
  }

  static async getByKey(key: string): Promise<ISetting | null> {
    return await SettingModel.findOne({ key });
  }

  static async getList(): Promise<ISetting[]> {
    return await SettingModel.find({});
  }
}
