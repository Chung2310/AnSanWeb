import Joi from 'joi';

export const objectIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .message('ID phải là định dạng MongoDB ObjectId 24 ký tự hợp lệ.');

export const idParamValidation = Joi.object({
  id: objectIdSchema.required(),
});
