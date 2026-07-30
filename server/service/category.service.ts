import { CategoryModel } from '../model/category.model.ts';
import { ICategory } from '../interface/category.interface.ts';

function mapDoc(doc: any): any {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject({ virtuals: true }) : { ...doc };
  obj.id = doc._id.toString();
  return obj;
}

export class CategoryService {
  static async create(data: any): Promise<ICategory> {
    const existing = await CategoryModel.findOne({ slug: data.slug });
    if (existing) {
      throw new Error('Slug danh mục này đã tồn tại.');
    }
    const category = new CategoryModel(data);
    return mapDoc(await category.save());
  }

  static async update(id: string, data: any): Promise<ICategory | null> {
    if (data.slug) {
      const existing = await CategoryModel.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw new Error('Slug danh mục này đã tồn tại.');
      }
    }
    return mapDoc(await CategoryModel.findByIdAndUpdate(id, data, { new: true }));
  }

  static async delete(id: string): Promise<ICategory | null> {
    // Recursive helper to find all descendants
    const getDescendants = async (parentId: string): Promise<string[]> => {
      const children = await CategoryModel.find({ parentId });
      const childIds = children.map((c) => c._id.toString());
      let descendants = [...childIds];
      for (const childId of childIds) {
        const subDescendants = await getDescendants(childId);
        descendants = [...descendants, ...subDescendants];
      }
      return descendants;
    };

    const descendants = await getDescendants(id);
    const idsToDelete = [id, ...descendants];

    // 1. Delete all categories in hierarchy
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    if (idsToDelete.length > 1) {
      await CategoryModel.deleteMany({ _id: { $in: idsToDelete } });
    }

    // 2. Clean up product references (categoryIds and tags)
    const { ProductModel } = await import('../model/product.model.ts');
    await ProductModel.updateMany(
      { categoryIds: { $in: idsToDelete } },
      { $pull: { categoryIds: { $in: idsToDelete } } }
    );
    await ProductModel.updateMany(
      { tags: { $in: idsToDelete } },
      { $pull: { tags: { $in: idsToDelete } } }
    );

    return deletedCategory;
  }

  static async getById(id: string): Promise<ICategory | null> {
    return mapDoc(await CategoryModel.findById(id));
  }

  static async getBySlug(slug: string): Promise<ICategory | null> {
    return mapDoc(await CategoryModel.findOne({ slug }));
  }

  static async getList(query: any): Promise<{ data: ICategory[]; total: number; page: number; limit: number }> {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 100; // Default high limit for categories since there aren't too many usually
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query.parentId !== undefined) {
      filter.parentId = query.parentId === '' || query.parentId === 'null' ? null : query.parentId;
    }
    if (query.status) {
      filter.status = query.status;
    }

    const total = await CategoryModel.countDocuments(filter);
    const docs = await CategoryModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
    return await CategoryModel.bulkWrite(operations);
  }
}
