import Joi from 'joi';

export const subscriptionCreateSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email không đúng định dạng nhận tin.',
      'any.required': 'Email nhận tin là bắt buộc.',
    }),
});
