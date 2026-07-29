import { BlogPostModel } from '../model/blog-post.model.ts';
import { IBlogPost } from '../interface/blog-post.interface.ts';

export class BlogPostService {
  static async create(data: any): Promise<IBlogPost> {
    const existing = await BlogPostModel.findOne({ slug: data.slug });
    if (existing) {
      throw new Error('Slug bài viết này đã tồn tại.');
    }
    const post = new BlogPostModel(data);
    return await post.save();
  }

  static async update(id: string, data: any): Promise<IBlogPost | null> {
    if (data.slug) {
      const existing = await BlogPostModel.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw new Error('Slug bài viết này đã tồn tại.');
      }
    }
    return await BlogPostModel.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id: string): Promise<IBlogPost | null> {
    return await BlogPostModel.findByIdAndDelete(id);
  }

  static async getById(id: string): Promise<IBlogPost | null> {
    return await BlogPostModel.findById(id);
  }

  static async getBySlug(slug: string): Promise<IBlogPost | null> {
    return await BlogPostModel.findOne({ slug });
  }

  static async getList(query: any): Promise<{ data: IBlogPost[]; total: number; page: number; limit: number }> {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.categories) {
      const catArray = Array.isArray(query.categories) ? query.categories : [query.categories];
      filter.categories = { $in: catArray };
    }

    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    const total = await BlogPostModel.countDocuments(filter);
    const data = await BlogPostModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return { data, total, page, limit };
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
    return await BlogPostModel.bulkWrite(operations);
  }
}
