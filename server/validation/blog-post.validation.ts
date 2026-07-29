import Joi from 'joi';

const imageInfoSchema = Joi.object({
  url: Joi.string().required().messages({ 'any.required': 'Đường dẫn URL ảnh là bắt buộc.' }),
  path: Joi.string().allow(''),
  imageHint: Joi.string().allow(''),
});

export const blogPostCreateSchema = Joi.object({
  author: Joi.string()
    .required()
    .messages({ 'any.required': 'Tác giả bài viết là bắt buộc.' }),
  title: Joi.string()
    .required()
    .messages({ 'any.required': 'Tiêu đề bài viết là bắt buộc.' }),
  slug: Joi.string()
    .required()
    .messages({ 'any.required': 'Slug bài viết là bắt buộc.' }),
  excerpt: Joi.string()
    .required()
    .messages({ 'any.required': 'Tóm tắt bài viết là bắt buộc.' }),
  content: Joi.string().allow(''),
  image: imageInfoSchema.allow(null),
  categories: Joi.array().items(Joi.string()).default([]),
  date: Joi.string().allow(''),
});

export const blogPostUpdateSchema = blogPostCreateSchema.fork(
  ['author', 'title', 'slug', 'excerpt'],
  (schema) => schema.optional()
);
