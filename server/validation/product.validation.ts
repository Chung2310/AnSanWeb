import Joi from 'joi';

const imageInfoSchema = Joi.object({
  url: Joi.string().required().messages({ 'any.required': 'Đường dẫn URL ảnh là bắt buộc.' }),
  path: Joi.string().allow(''),
  imageHint: Joi.string().allow(''),
});

const attributeSchema = Joi.object({
  label: Joi.string().required(),
  value: Joi.string().required(),
});

export const productCreateSchema = Joi.object({
  nameVN: Joi.string()
    .required()
    .messages({ 'any.required': 'Tên sản phẩm tiếng Việt là bắt buộc.' }),
  slug: Joi.string()
    .required()
    .messages({ 'any.required': 'Slug sản phẩm là bắt buộc.' }),
  shortDescription: Joi.string().allow(''),
  price: Joi.number()
    .required()
    .messages({ 'any.required': 'Giá sản phẩm là bắt buộc.' }),
  priceDescription: Joi.string().allow(''),
  secondaryPrice: Joi.number().allow(null),
  secondaryPriceDescription: Joi.string().allow('', null),
  description: Joi.string()
    .required()
    .messages({ 'any.required': 'Mô tả chi tiết sản phẩm là bắt buộc.' }),
  image: imageInfoSchema.allow(null),
  detailImages: Joi.array().items(imageInfoSchema).default([]),
  isFeatured: Joi.boolean().default(false),
  isNew: Joi.boolean().default(false),
  bestChoice: Joi.boolean().default(false),
  isGoodPrice: Joi.boolean().default(false),
  tags: Joi.array().items(Joi.string()).default([]),
  attributes: Joi.array().items(attributeSchema).default([]),
  categoryIds: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid('published', 'draft').default('published'),
  age: Joi.number().allow(null),
  cask: Joi.string().allow(''),
  nonChillFiltered: Joi.boolean().default(false),
});

export const productUpdateSchema = productCreateSchema.fork(
  ['nameVN', 'slug', 'price', 'description'],
  (schema) => schema.optional()
);
