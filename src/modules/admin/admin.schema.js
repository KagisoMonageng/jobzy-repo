const Joi = require('joi');

const reviewWorkerSchema = Joi.object({
  verificationStatus: Joi.string().valid('approved', 'rejected').required(),
  backgroundCheckStatus: Joi.string().valid('approved', 'rejected').required(),
  rejectionReason: Joi.string().allow('', null)
});

module.exports = { reviewWorkerSchema };
