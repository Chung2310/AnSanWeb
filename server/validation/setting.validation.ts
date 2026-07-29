import Joi from 'joi';

export const settingCreateSchema = Joi.object({
  key: Joi.string()
    .required()
    .messages({ 'any.required': 'Khóa cài đặt là bắt buộc.' }),
  value: Joi.any()
    .required()
    .messages({ 'any.required': 'Giá trị cài đặt là bắt buộc.' }),
});
