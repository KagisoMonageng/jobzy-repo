const Joi = require('joi');

const createPlanSchema = Joi.object({
  name: Joi.string().required(),
  priceZar: Joi.number().positive().required()
});

const subscribeSchema = Joi.object({
  planId: Joi.string().uuid().required(),
  provider: Joi.string().valid('paystack', 'peach', 'manual').default('manual')
});

const confirmPaymentSchema = Joi.object({
  transactionId: Joi.string().uuid().required(),
  providerReference: Joi.string().required(),
  paid: Joi.boolean().required()
});

module.exports = { createPlanSchema, subscribeSchema, confirmPaymentSchema };
