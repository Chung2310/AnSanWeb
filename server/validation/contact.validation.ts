import Joi from 'joi';

export const contactCreateSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ 'any.required': 'Họ và tên là bắt buộc.' }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email không đúng định dạng.',
      'any.required': 'Email là bắt buộc.',
    }),
  phone: Joi.string().allow(''),
  message: Joi.string()
    .required()
    .messages({ 'any.required': 'Nội dung tin nhắn là bắt buộc.' }),
});
