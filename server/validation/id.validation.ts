import Joi from 'joi';

// Accept both MongoDB ObjectId (24 hex chars) and Firebase-style IDs (alphanumeric)
export const objectIdSchema = Joi.string()
  .pattern(/^[0-9a-zA-Z_-]{1,128}$/)
  .message('ID không hợp lệ.');

export const idParamValidation = Joi.object({
  id: objectIdSchema.required(),
});
