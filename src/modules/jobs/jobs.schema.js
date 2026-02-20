const Joi = require('joi');

const createJobSchema = Joi.object({
  serviceId: Joi.string().uuid().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  budget: Joi.number().min(0).required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  addressText: Joi.string().required(),
  scheduledAt: Joi.date().iso().required()
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('accepted', 'in_progress', 'completed', 'cancelled').required()
});

module.exports = { createJobSchema, updateStatusSchema };
