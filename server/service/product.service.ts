import { ProductModel } from '../model/product.model.ts';
import { IProduct } from '../interface/product.interface.ts';

function mapDoc(doc: any): any {
  if (!doc) return null;
  // doc may be a lean plain object or a Mongoose Document
  const raw = doc._doc ? { ...doc._doc } : { ...doc };
  // Ensure id is always set from _id (handles both string Firebase IDs and ObjectId)
  if (raw._id != null) {
    raw.id = String(raw._id);
  }
  return raw;
}

export class ProductService {
  static async create(data: any): Promise<IProduct> {
    const existing = await ProductModel.findOne({ slug: data.slug });
    if (existing) {
      throw new Error('Slug sản phẩm này đã tồn tại.');
    }
    const product = new ProductModel(data);
    return mapDoc(await product.save());
  }

  static async update(id: string, data: any): Promise<IProduct | null> {
    if (data.slug) {
      const existing = await ProductModel.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw new Error('Slug sản phẩm này đã tồn tại.');
      }
    }
    return mapDoc(await ProductModel.findByIdAndUpdate(id, data, { new: true }));
  }

  static async delete(id: string): Promise<IProduct | null> {
    return await ProductModel.findByIdAndDelete(id);
  }

  static async getById(id: string): Promise<IProduct | null> {
    return mapDoc(await ProductModel.findOne({ $or: [{ _id: id }, { id }] }).lean());
  }

  static async getBySlug(slug: string): Promise<IProduct | null> {
    return mapDoc(await ProductModel.findOne({ slug }).lean());
  }

  static async getList(query: any): Promise<{ data: IProduct[]; total: number; page: number; limit: number }> {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const filter: any = {};

    // Search by name (case-insensitive regex)
    if (query.search) {
      filter.nameVN = { $regex: query.search, $options: 'i' };
    }

    // Filter by Category IDs
    if (query.categoryIds) {
      const cats = Array.isArray(query.categoryIds) ? query.categoryIds : [query.categoryIds];
      filter.categoryIds = { $in: cats };
    }

    // Filter by tags
    if (query.tags) {
      const tagArray = Array.isArray(query.tags) ? query.tags : [query.tags];
      filter.tags = { $in: tagArray };
    }

    // Filter by status
    if (query.status) {
      filter.status = query.status;
    }

    // Other boolean filters
    if (query.isFeatured !== undefined) {
      filter.isFeatured = query.isFeatured === 'true';
    }
    if (query.isNew !== undefined) {
      filter.isNew = query.isNew === 'true';
    }
    if (query.bestChoice !== undefined) {
      filter.bestChoice = query.bestChoice === 'true';
    }
    if (query.isGoodPrice !== undefined) {
      filter.isGoodPrice = query.isGoodPrice === 'true';
    }

    const total = await ProductModel.countDocuments(filter);
    const docs = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return { data: docs.map(mapDoc), total, page, limit };
  }

  static async bulkUpsert(items: any[]): Promise<any> {
    const operations = items.map((item) => {
      const id = item.id || item._id;
      return {
        updateOne: {
          filter: { _id: id },
          update: { $set: item },
          upsert: true,
        },
      };
    });
    return await ProductModel.bulkWrite(operations);
  }
}
