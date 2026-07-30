import Joi from 'joi';

const imageInfoSchema = Joi.object({
  url: Joi.string().required().messages({ 'any.required': 'Đường dẫn URL ảnh là bắt buộc.' }),
  path: Joi.string().allow(''),
  imageHint: Joi.string().allow(''),
});

export const categoryCreateSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ 'any.required': 'Tên danh mục là bắt buộc.' }),
  slug: Joi.string()
    .required()
    .messages({ 'any.required': 'Slug danh mục là bắt buộc.' }),
  description: Joi.string().allow(''),
  image: imageInfoSchema.allow(null),
  status: Joi.string().valid('active', 'inactive').default('active'),
  parentId: Joi.string().allow('', null),
  tags: Joi.array().items(Joi.string()).default([]),
});

export const categoryUpdateSchema = categoryCreateSchema.fork(
  ['name', 'slug'],
  (schema) => schema.optional()
);
