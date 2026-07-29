import { SubscriptionModel } from '../model/subscription.model.ts';
import { ISubscription } from '../interface/subscription.interface.ts';

export class SubscriptionService {
  static async create(data: any): Promise<ISubscription> {
    const existing = await SubscriptionModel.findOne({ email: data.email });
    if (existing) {
      throw new Error('Email này đã được đăng ký nhận tin trước đó.');
    }
    const subscription = new SubscriptionModel(data);
    return await subscription.save();
  }

  static async getList(query: any): Promise<{ data: ISubscription[]; total: number; page: number; limit: number }> {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query.email) {
      filter.email = { $regex: query.email, $options: 'i' };
    }

    const total = await SubscriptionModel.countDocuments(filter);
    const data = await SubscriptionModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return { data, total, page, limit };
  }
}
