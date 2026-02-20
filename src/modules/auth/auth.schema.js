const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('client', 'worker').required(),
  fname: Joi.string().required(),
  lname: Joi.string().required(),
  phone: Joi.string().allow(null, ''),
  southAfricanIdNumber: Joi.string().pattern(/^\d{13}$/).allow(null, ''),
  passportNumber: Joi.string().max(20).allow(null, '')
}).custom((value, helpers) => {
  if (value.role === 'worker' && !value.southAfricanIdNumber && !value.passportNumber) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'worker identity requirement');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

module.exports = { registerSchema, loginSchema, refreshSchema };
