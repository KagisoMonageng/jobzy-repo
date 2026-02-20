const Joi = require('joi');

const createServiceSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow('', null),
  icon: Joi.string().allow('', null)
});

module.exports = { createServiceSchema };
