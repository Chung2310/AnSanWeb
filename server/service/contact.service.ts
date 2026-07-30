import { ContactModel } from '../model/contact.model.ts';
import { IContact } from '../interface/contact.interface.ts';

export class ContactService {
  static async create(data: any): Promise<IContact> {
    const contact = new ContactModel(data);
    return await contact.save();
  }

  static async getList(query: any): Promise<{ data: IContact[]; total: number; page: number; limit: number }> {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query.email) {
      filter.email = { $regex: query.email, $options: 'i' };
    }

    const total = await ContactModel.countDocuments(filter);
    const data = await ContactModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return { data, total, page, limit };
  }
}
